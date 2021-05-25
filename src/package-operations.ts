import { promises as fs } from 'fs';
import pathUtils from 'path';
import { promisify } from 'util';
import _glob from 'glob';
import { updateChangelog } from '@metamask/auto-changelog';

import { didPackageChange } from './git-operations';
import {
  isTruthyString,
  isValidSemver,
  readJsonObjectFile,
  WORKSPACE_ROOT,
  writeJsonFile,
} from './utils';

const glob = promisify(_glob);

const PACKAGE_JSON = 'package.json';

export enum PackageDependencyFields {
  Production = 'dependencies',
  Development = 'devDependencies',
  Peer = 'peerDependencies',
  Bundled = 'bundledDependencies',
  Optional = 'optionalDependencies',
}

export enum FieldNames {
  Name = 'name',
  Private = 'private',
  Version = 'version',
  Workspaces = 'workspaces',
}

export interface PackageManifest
  extends Partial<Record<PackageDependencyFields, Record<string, string>>> {
  readonly [FieldNames.Name]: string;
  readonly [FieldNames.Private]?: boolean;
  readonly [FieldNames.Version]: string;
  readonly [FieldNames.Workspaces]?: string[];
}

export interface PolyrepoPackageManifest
  extends Partial<Record<PackageDependencyFields, Record<string, string>>> {
  readonly [FieldNames.Name]: string;
  readonly [FieldNames.Version]: string;
}

export interface MonorepoPackageManifest extends Partial<PackageManifest> {
  readonly [FieldNames.Version]: string;
  readonly [FieldNames.Private]: boolean;
  readonly [FieldNames.Workspaces]: string[];
}

export interface PackageMetadata {
  readonly dirName: string;
  readonly manifest: PackageManifest;
  readonly name: string;
  readonly dirPath: string;
}

interface UpdateSpecification {
  readonly newVersion: string;
  readonly repositoryUrl: string;
  readonly shouldUpdateChangelog: boolean;
}

interface MonorepoUpdateSpecification extends UpdateSpecification {
  readonly packagesToUpdate: ReadonlySet<string>;
  readonly synchronizeVersions: boolean;
}

/**
 * Get workspace directory locations, given the set of workspace patterns
 * specified in the `workspaces` field of the root `package.json` file.
 *
 * @param workspaces - The list of workspace patterns given in the root manifest.
 * @param rootDir - The monorepo root directory.
 * @returns The location of each workspace directory relative to the root directory
 */
async function getWorkspaceLocations(
  workspaces: string[],
  rootDir: string,
): Promise<string[]> {
  const resolvedWorkspaces = await Promise.all(
    workspaces.map((pattern) => glob(pattern, { cwd: rootDir })),
  );
  return resolvedWorkspaces.flat();
}

/**
 * Finds the package manifest for each workspace, and collects
 * metadata for each package.
 *
 * @param workspaces - The list of workspace patterns given in the root manifest.
 * @param rootDir - The monorepo root directory.
 * @returns The metadata for all packages in the monorepo.
 */
export async function getMetadataForAllPackages(
  workspaces: string[],
  rootDir: string = WORKSPACE_ROOT,
): Promise<Record<string, PackageMetadata>> {
  const workspaceLocations = await getWorkspaceLocations(workspaces, rootDir);

  const result: Record<string, PackageMetadata> = {};
  await Promise.all(
    workspaceLocations.map(async (workspaceDirectory) => {
      const fullWorkspacePath = pathUtils.join(rootDir, workspaceDirectory);
      if ((await fs.lstat(fullWorkspacePath)).isDirectory()) {
        const rawManifest = await getPackageManifest(fullWorkspacePath);
        const manifest = validatePolyrepoPackageManifest(
          rawManifest,
          workspaceDirectory,
        );
        result[manifest.name] = {
          dirName: pathUtils.basename(workspaceDirectory),
          manifest,
          name: manifest.name,
          dirPath: workspaceDirectory,
        };
      }
    }),
  );
  return result;
}

/**
 * @param allPackages - The metadata of all packages in the monorepo.
 * @param synchronizeVersions - Whether to synchronize the versions of all
 * packages.
 * @param tags - All tags for the release's base git branch.
 * @returns The names of the packages to update.
 */
export async function getPackagesToUpdate(
  allPackages: Record<string, PackageMetadata>,
  synchronizeVersions: boolean,
  tags: ReadonlySet<string>,
): Promise<ReadonlySet<string>> {
  // In order to synchronize versions, we must update every package.
  if (synchronizeVersions) {
    return new Set(Object.keys(allPackages));
  }

  // If we're not synchronizing versions, we only update changed packages.
  const shouldBeUpdated: Set<string> = new Set();
  // We use a for-loop here instead of Promise.all because didPackageChange
  // must be called serially.
  for (const packageName of Object.keys(allPackages)) {
    if (await didPackageChange(tags, allPackages[packageName])) {
      shouldBeUpdated.add(packageName);
    }
  }

  if (shouldBeUpdated.size === 0) {
    throw new Error(`There are no packages to update.`);
  }
  return shouldBeUpdated;
}

/**
 * Updates the manifests and changelogs of all packages in the monorepo per the
 * update specification. Writes the new manifests to disk. The following changes
 * are made to the new manifests:
 *
 * - The "version" field is replaced with the new version
 * - If package versions are being synchronized, updates their version ranges
 * wherever they appear as dependencies
 *
 * @param allPackages - The metadata of all monorepo packages
 * @param updateSpecification - The update specification.
 */
export async function updatePackages(
  allPackages: Record<string, Pick<PackageMetadata, 'dirPath' | 'manifest'>>,
  updateSpecification: MonorepoUpdateSpecification,
): Promise<void> {
  const { packagesToUpdate } = updateSpecification;
  await Promise.all(
    Array.from(packagesToUpdate.keys()).map(async (packageName) =>
      updatePackage(allPackages[packageName], updateSpecification),
    ),
  );
}

/**
 * Updates the manifest and changelog of the given package per the update
 * specification and writes the changes to disk. The following changes are made
 * to the manifest:
 *
 * - The "version" field is replaced with the new version
 * - If package versions are being synchronized, updates their version ranges
 * wherever they appear as dependencies
 *
 * @param packageMetadata - The metadata of the package to update.
 * @param updateSpecification - The update specification, which determines how
 * the update is performed.
 */
export async function updatePackage(
  packageMetadata: { dirPath: string; manifest: Partial<PackageManifest> },
  updateSpecification: UpdateSpecification | MonorepoUpdateSpecification,
  rootDir: string = WORKSPACE_ROOT,
): Promise<void> {
  await Promise.all([
    writeJsonFile(
      pathUtils.join(rootDir, packageMetadata.dirPath, PACKAGE_JSON),
      getUpdatedManifest(packageMetadata.manifest, updateSpecification),
    ),
    updateSpecification.shouldUpdateChangelog
      ? updatePackageChangelog(packageMetadata, updateSpecification)
      : Promise.resolve(),
  ]);
}

/**
 * Updates the changelog file of the given package, using
 * @metamask/auto-changelog. Assumes that the changelog file is located at the
 * package root directory and named "CHANGELOG.md".
 *
 * @param packageMetadata - The metadata of the package to update.
 * @param updateSpecification - The update specification, which determines how
 * the update is performed.
 */
async function updatePackageChangelog(
  packageMetadata: { dirPath: string },
  updateSpecification: UpdateSpecification | MonorepoUpdateSpecification,
  rootDir: string = WORKSPACE_ROOT,
) {
  const { dirPath: projectRootDirectory } = packageMetadata;
  const { newVersion, repositoryUrl } = updateSpecification;

  let changelogContent: string;
  const changelogPath = pathUtils.join(
    rootDir,
    projectRootDirectory,
    'CHANGELOG.md',
  );
  try {
    changelogContent = await fs.readFile(changelogPath, 'utf-8');
  } catch (error) {
    console.error(`Failed to read changelog in "${projectRootDirectory}".`);
    throw error;
  }

  await updateChangelog({
    changelogContent,
    currentVersion: newVersion,
    isReleaseCandidate: true,
    projectRootDirectory,
    repoUrl: repositoryUrl,
  });
}

/**
 * Updates the given manifest per the update specification as follows:
 *
 * - Updates the manifest's "version" field to the new version
 * - If monorepo package versions are being synchronized, updates their version
 * ranges wherever they appear as dependencies
 *
 * @param currentManifest - The package's current manifest, as read from disk.
 * @param updateSpecification - The update specification, which determines how
 * the update is performed.
 * @returns The updated manifest.
 */
function getUpdatedManifest(
  currentManifest: Partial<PackageManifest>,
  updateSpecification: UpdateSpecification | MonorepoUpdateSpecification,
) {
  const { newVersion } = updateSpecification;
  if (
    isMonorepoUpdateSpecification(updateSpecification) &&
    updateSpecification.synchronizeVersions
  ) {
    // If we're synchronizing the versions of our updated packages, we also
    // synchronize their versions whenever they appear as a dependency.
    return {
      ...currentManifest,
      ...getUpdatedDependencyFields(currentManifest, updateSpecification),
      version: newVersion,
    };
  }

  // If we're not synchronizing versions, we leave all dependencies as they are.
  return { ...currentManifest, version: newVersion };
}

/**
 * Gets the updated dependency fields of the given manifest per the given
 * update specification.
 *
 * @param currentManifest - The package's current manifest, as read from disk.
 * @param updateSpecification - The update specification, which determines how
 * the update is performed.
 * @returns The updated dependency fields of the manifest.
 */
function getUpdatedDependencyFields(
  manifest: Partial<PackageManifest>,
  updateSpecification: MonorepoUpdateSpecification,
): Partial<Pick<PackageManifest, PackageDependencyFields>> {
  const { newVersion, packagesToUpdate } = updateSpecification;
  return Object.values(PackageDependencyFields).reduce(
    (newDepsFields: Record<string, unknown>, fieldName) => {
      if (fieldName in manifest) {
        newDepsFields[fieldName] = getUpdatedDependencyField(
          manifest[fieldName] as Record<string, string>,
          packagesToUpdate,
          newVersion,
        );
      }

      return newDepsFields;
    },
    {},
  );
}

/**
 * Updates the version range of every package in the list that's present in the
 * dependency object to "^<VERSION>", where <VERSION> is the specified new
 * version.
 *
 * @param dependencyObject - The package.json dependency object to update.
 * @param packagesToUpdate - The packages to update the version of.
 * @param newVersion - The new version of the given packages.
 * @returns The updated dependency object.
 */
function getUpdatedDependencyField(
  dependencyObject: Record<string, string>,
  packagesToUpdate: ReadonlySet<string>,
  newVersion: string,
): Record<string, string> {
  const newVersionRange = `^${newVersion}`;
  return Object.keys(dependencyObject).reduce(
    (newDeps: Record<string, string>, packageName) => {
      newDeps[packageName] = packagesToUpdate.has(packageName)
        ? newVersionRange
        : dependencyObject[packageName];

      return newDeps;
    },
    {},
  );
}

/**
 * Read, parse, validate, and return the object corresponding to the
 * package.json file in the given directory.
 *
 * An error is thrown if validation fails.
 *
 * @param containingDirPath - The complete path to the directory containing
 * the package.json file.
 * @returns The object corresponding to the parsed package.json file.
 */
export async function getPackageManifest(
  containingDirPath: string,
): Promise<Record<string, unknown>> {
  return await readJsonObjectFile(
    pathUtils.join(containingDirPath, PACKAGE_JSON),
  );
}

/**
 * Type guard to ensure that the given manifest has a valid "name" field.
 *
 * @param manifest - The manifest object to validate.
 * @returns Whether the manifest has a valid "name" field.
 */
function hasValidNameField(
  manifest: Partial<PackageManifest>,
): manifest is typeof manifest & Pick<PackageManifest, FieldNames.Name> {
  return isTruthyString(manifest[FieldNames.Name]);
}

/**
 * Type guard to ensure that the given manifest has a valid "private" field.
 *
 * @param manifest - The manifest object to validate.
 * @returns Whether the manifest has a valid "private" field.
 */
function hasValidPrivateField(
  manifest: Partial<PackageManifest>,
): manifest is typeof manifest &
  Pick<MonorepoPackageManifest, FieldNames.Private> {
  return manifest[FieldNames.Private] === true;
}

/**
 * Type guard to ensure that the given manifest has a valid "version" field.
 *
 * @param manifest - The manifest object to validate.
 * @returns Whether the manifest has a valid "version" field.
 */
function hasValidVersionField(
  manifest: Partial<PackageManifest>,
): manifest is typeof manifest & Pick<PackageManifest, FieldNames.Version> {
  return isValidSemver(manifest[FieldNames.Version]);
}

/**
 * Type guard to ensure that the given manifest has a valid "worksapces" field.
 *
 * @param manifest - The manifest object to validate.
 * @returns Whether the manifest has a valid "worksapces" field.
 */
function hasValidWorkspacesField(
  manifest: Partial<PackageManifest>,
): manifest is typeof manifest &
  Pick<MonorepoPackageManifest, FieldNames.Workspaces> {
  return (
    Array.isArray(manifest[FieldNames.Workspaces]) &&
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    manifest[FieldNames.Workspaces]!.length > 0
  );
}

/**
 * Validates the "version" field of a package manifest object, i.e. a parsed
 * "package.json" file.
 *
 * @param manifest - The manifest to validate.
 * @param manifestDirPath - The path to the directory containing the
 * manifest file relative to the root directory.
 * @returns The unmodified manifest, with the "version" field typed correctly.
 */
export function validatePackageManifestVersion<
  ManifestType extends Partial<PackageManifest>
>(
  manifest: ManifestType,
  manifestDirPath: string,
): ManifestType & Pick<PackageManifest, FieldNames.Version> {
  if (!hasValidVersionField(manifest)) {
    throw new Error(
      `${getManifestErrorMessagePrefix(
        FieldNames.Version,
        manifest,
        manifestDirPath,
      )} is not a valid SemVer version: ${manifest[FieldNames.Version]}`,
    );
  }
  return manifest;
}

/**
 * Validates the "name" field of a package manifest object, i.e. a parsed
 * "package.json" file.
 *
 * @param manifest - The manifest to validate.
 * @param manifestDirPath - The path to the directory containing the
 * manifest file relative to the root directory.
 * @returns The unmodified manifest, with the "name" field typed correctly.
 */
export function validatePackageManifestName<
  ManifestType extends Partial<PackageManifest>
>(
  manifest: ManifestType,
  manifestDirPath: string,
): ManifestType & Pick<PackageManifest, FieldNames.Name> {
  if (!hasValidNameField(manifest)) {
    throw new Error(
      `Manifest in "${manifestDirPath}" does not have a valid "${FieldNames.Name}" field.`,
    );
  }
  return manifest;
}

/**
 * Validates the "version" and "name" fields of a package manifest object,
 * i.e. a parsed "package.json" file.
 *
 * @param manifest - The manifest to validate.
 * @param manifestDirPath - The path to the directory containing the
 * manifest file relative to the root directory.
 * @returns The unmodified manifest, with the "version" and "name" fields typed
 * correctly.
 */
export function validatePolyrepoPackageManifest(
  manifest: Partial<PackageManifest>,
  manifestDirPath: string,
): PolyrepoPackageManifest {
  return validatePackageManifestName(
    validatePackageManifestVersion(manifest, manifestDirPath),
    manifestDirPath,
  );
}

/**
 * Validates the "workspaces" and "private" fields of a package manifest object,
 * i.e. a parsed "package.json" file.
 *
 * Assumes that the manifest's "version" field is already validated.
 *
 * @param manifest - The manifest to validate.
 * @param manifestDirPath - The path to the directory containing the
 * manifest file relative to the root directory.
 * @returns The unmodified manifest, with the "workspaces" and "private" fields
 * typed correctly.
 */
export function validateMonorepoPackageManifest<
  ManifestType extends Pick<PackageManifest, FieldNames.Version> &
    Partial<PackageManifest>
>(manifest: ManifestType, manifestDirPath: string): MonorepoPackageManifest {
  if (!hasValidWorkspacesField(manifest)) {
    throw new Error(
      `${getManifestErrorMessagePrefix(
        FieldNames.Workspaces,
        manifest,
        manifestDirPath,
      )} must be a non-empty array if present. Received: ${
        manifest[FieldNames.Workspaces]
      }`,
    );
  }

  if (!hasValidPrivateField(manifest)) {
    throw new Error(
      `${getManifestErrorMessagePrefix(
        FieldNames.Private,
        manifest,
        manifestDirPath,
      )} must be "true" if "${FieldNames.Workspaces}" is present. Received: ${
        manifest[FieldNames.Private]
      }`,
    );
  }
  return manifest;
}

/**
 * Type guard for checking if an update specification is a monorepo update
 * specification.
 *
 * @param specification - The update specification object to check.
 * @returns Whether the given specification object is a monorepo update
 * specification.
 */
function isMonorepoUpdateSpecification(
  specification: UpdateSpecification | MonorepoUpdateSpecification,
): specification is MonorepoUpdateSpecification {
  return (
    'packagesToUpdate' in specification &&
    'synchronizeVersions' in specification
  );
}

/**
 * Gets the prefix of an error message for a manifest file validation error.
 *
 * @param invalidField - The name of the invalid field.
 * @param manifest - The manifest object that's invalid.
 * @param manifestDirPath - The path to the directory of the manifest file
 * relative to the root directory.
 * @returns The prefix of a manifest validation error message.
 */
function getManifestErrorMessagePrefix(
  invalidField: FieldNames,
  manifest: Partial<MonorepoPackageManifest>,
  manifestDirPath: string,
) {
  return `${
    manifest[FieldNames.Name]
      ? `"${manifest[FieldNames.Name]}" manifest "${invalidField}"`
      : `"${invalidField}" of manifest in "${manifestDirPath}"`
  }`;
}
