import { promises as fs } from 'fs';
import pathUtils from 'path';
import { updateChangelog } from '@metamask/auto-changelog';
import {
  getPackageManifest,
  getWorkspaceLocations,
  ManifestDependencyFieldNames,
  PackageManifest,
  validatePolyrepoPackageManifest,
  writeJsonFile,
} from '@metamask/action-utils';
import { didPackageChange } from './git-operations';
import { VersionSynchronizationStrategies, WORKSPACE_ROOT } from './utils';

export interface PackageMetadata {
  readonly dirName: string;
  readonly manifest: PackageManifest;
  readonly name: string;
  readonly dirPath: string;
}

interface UpdateSpecification {
  readonly newVersion: string;
  readonly repositoryUrl: string;
}

interface MonorepoUpdateSpecification extends UpdateSpecification {
  readonly allPackageMetadata: Record<string, PackageMetadata>;
  readonly changedPackages: ReadonlySet<string>;
  readonly versionSyncStrategy: VersionSynchronizationStrategies;
  readonly shouldUpdateChangelog: boolean;
}

const MANIFEST_FILE_NAME = 'package.json';
const CHANGELOG_FILE_NAME = 'CHANGELOG.md';

/**
 * Finds the package manifest for each workspace, and collects
 * metadata for each package.
 *
 * @param workspaces - The list of workspace patterns given in the root manifest.
 * @param tags - All tags for the release's base git branch.
 * @param versionSyncStrategy - The monorepo package version synchronization
 * strategy.
 * @param rootDir - The monorepo root directory.
 * @returns The metadata for all packages in the monorepo, and the set of
 * changed packages.
 */
export async function getMetadataForAllPackages(
  workspaces: string[],
  tags: ReadonlySet<string>,
  versionSyncStrategy: VersionSynchronizationStrategies,
  rootDir: string = WORKSPACE_ROOT,
): Promise<[Record<string, PackageMetadata>, ReadonlySet<string>]> {
  const workspaceLocations = await getWorkspaceLocations(workspaces, rootDir);

  let hasChangedPackages = false;
  const allPackageMetadata: Record<string, PackageMetadata> = {};
  const changedPackages: Set<string> = new Set();

  await Promise.all(
    workspaceLocations.map(async (packagePath) => {
      const fullWorkspacePath = pathUtils.join(rootDir, packagePath);
      if ((await fs.lstat(fullWorkspacePath)).isDirectory()) {
        const rawManifest = await getPackageManifest(fullWorkspacePath);
        const manifest = validatePolyrepoPackageManifest(
          rawManifest,
          packagePath,
        );
        const { name: packageName } = manifest;

        // Record package metadata
        allPackageMetadata[packageName] = {
          dirName: pathUtils.basename(packagePath),
          manifest,
          name: packageName,
          dirPath: packagePath,
        };

        // Record whether package changed
        const didChange = await didPackageChange(tags, manifest, packagePath);
        if (didChange) {
          changedPackages.add(packageName);
        }
        hasChangedPackages = hasChangedPackages || didChange;
      }
    }),
  );

  // If no packages were changed, and our strategy is not to bump the versions
  // of all packages, there's nothing to do, and we exit with an error.
  if (
    !hasChangedPackages &&
    versionSyncStrategy !== VersionSynchronizationStrategies.all
  ) {
    throw new Error(`There are no packages to update.`);
  }
  return [allPackageMetadata, changedPackages];
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
 * @param updateSpecification - The update specification.
 */
export async function updatePackages(
  updateSpecification: MonorepoUpdateSpecification,
): Promise<void> {
  const { allPackageMetadata } = updateSpecification;
  await Promise.all(
    Object.keys(allPackageMetadata).map(async (packageName) =>
      updatePackage(allPackageMetadata[packageName], updateSpecification),
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
 * @param rootDir - The path to the repository root directory.
 */
export async function updatePackage(
  packageMetadata: PackageMetadata,
  updateSpecification: MonorepoUpdateSpecification,
  rootDir: string = WORKSPACE_ROOT,
): Promise<void> {
  await Promise.all([
    writeJsonFile(
      pathUtils.join(rootDir, packageMetadata.dirPath, MANIFEST_FILE_NAME),
      getUpdatedManifest(packageMetadata, updateSpecification),
    ),
    updateSpecification.shouldUpdateChangelog
      ? updatePackageChangelog(packageMetadata, updateSpecification)
      : Promise.resolve(),
  ]);
}

/**
 * Updates the repository root `package.json` file, for both polyrepos and
 * monorepos. Simply updates the `version` field to the new version per the
 * specified update specification.
 *
 * @param rootManifest - The repository root `package.json`.
 * @param updateSpecification - The update specification.
 * @param rootDir - The path to the repository root directory.
 */
export async function updateRepoRootManifest(
  rootManifest: Partial<PackageManifest>,
  updateSpecification: UpdateSpecification | MonorepoUpdateSpecification,
  rootDir: string = WORKSPACE_ROOT,
): Promise<void> {
  await writeJsonFile(pathUtils.join(rootDir, './', MANIFEST_FILE_NAME), {
    ...rootManifest,
    version: updateSpecification.newVersion,
  });
}

/**
 * Updates the changelog file of the given package, using
 * @metamask/auto-changelog. Assumes that the changelog file is located at the
 * package root directory and named `CHANGELOG.md`.
 *
 * @param packageMetadata - The metadata of the package to update.
 * @param updateSpecification - The update specification, which determines how
 * the update is performed.
 * @param rootDir - The path to the repository root directory.
 */
export async function updatePackageChangelog(
  packageMetadata: { dirPath: string; manifest: Partial<PackageManifest> },
  updateSpecification: UpdateSpecification | MonorepoUpdateSpecification,
  rootDir: string = WORKSPACE_ROOT,
): Promise<void> {
  const { dirPath: projectRootDirectory } = packageMetadata;
  const { newVersion, repositoryUrl } = updateSpecification;

  let changelogContent: string;
  const packagePath = pathUtils.join(rootDir, projectRootDirectory);
  const changelogPath = pathUtils.join(packagePath, CHANGELOG_FILE_NAME);

  try {
    changelogContent = await fs.readFile(changelogPath, 'utf-8');
  } catch (error) {
    console.error(`Failed to read changelog in "${projectRootDirectory}".`);
    throw error;
  }

  const newChangelogContent = await updateChangelog({
    changelogContent,
    currentVersion: newVersion,
    isReleaseCandidate: true,
    projectRootDirectory,
    repoUrl: repositoryUrl,
  });
  if (!newChangelogContent) {
    const packageName = packageMetadata.manifest.name;
    throw new Error(
      `"updateChangelog" returned an empty value for package ${
        packageName ? `"${packageName}"` : `at "${packagePath}"`
      }.`,
    );
  }

  await fs.writeFile(changelogPath, newChangelogContent);
}

/**
 * Updates the given manifest per the update specification as follows:
 *
 * - Updates the manifest's `version` field to the new version
 * - If monorepo package versions are being synchronized, updates their version
 * ranges wherever they appear as dependencies
 *
 * @param packageMetadata - The metadata of the package to update.
 * @param updateSpecification - The update specification, which determines how
 * the update is performed.
 * @returns The updated manifest.
 */
function getUpdatedManifest(
  packageMetadata: PackageMetadata,
  updateSpecification: UpdateSpecification | MonorepoUpdateSpecification,
): PackageManifest {
  const { manifest: currentManifest } = packageMetadata;
  const { newVersion } = updateSpecification;
  if (
    isMonorepoUpdateSpecification(updateSpecification) &&
    updateSpecification.versionSyncStrategy !==
      VersionSynchronizationStrategies.none
  ) {
    // Synchronize monorepo package versions wherever they appear as a dependency.
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
  currentManifest: Partial<PackageManifest>,
  updateSpecification: MonorepoUpdateSpecification,
): Partial<Pick<PackageManifest, ManifestDependencyFieldNames>> {
  const {
    newVersion,
    changedPackages,
    versionSyncStrategy,
  } = updateSpecification;

  return Object.values(ManifestDependencyFieldNames).reduce(
    (newDepsFields: Record<string, unknown>, fieldName) => {
      if (fieldName in currentManifest) {
        newDepsFields[fieldName] = getUpdatedDependencyField(
          currentManifest[fieldName] as Record<string, string>,
          newVersion,
          versionSyncStrategy,
          changedPackages,
        );
      }

      return newDepsFields;
    },
    {},
  );
}

/**
 * Updates the version range of every package in the list that's present in the
 * dependency object to `^<VERSION>`, where `<VERSION>` is the specified new
 * version.
 *
 * @param dependencyObject - The package.json dependency object to update.
 * @param newVersion - The new version of the given packages.
 * @param versionSyncStrategy - The current version synchronization strategy.
 * @param changedPackages - The set of packages that have changed.
 * @returns The updated dependency object.
 */
function getUpdatedDependencyField(
  dependencyObject: Record<string, string>,
  newVersion: string,
  versionSyncStrategy: VersionSynchronizationStrategies,
  changedPackages: ReadonlySet<string>,
): Record<string, string> {
  const newVersionRange = `^${newVersion}`;
  return Object.keys(dependencyObject).reduce(
    (newDeps: Record<string, string>, packageName) => {
      newDeps[packageName] = shouldUpdateDependencyVersion(
        packageName,
        versionSyncStrategy,
        changedPackages,
      )
        ? newVersionRange
        : dependencyObject[packageName];

      return newDeps;
    },
    {},
  );
}

/**
 * @param packageName - The name of the dependency.
 * @param versionSyncStrategy - The current version synchronization strategy.
 * @param changedPackages - The set of packages that have changed.
 * @returns Whether the version of thet specified dependency should be updated.
 */
function shouldUpdateDependencyVersion(
  packageName: string,
  versionSyncStrategy: VersionSynchronizationStrategies,
  changedPackages: ReadonlySet<string>,
): boolean {
  switch (versionSyncStrategy) {
    case VersionSynchronizationStrategies.all:
      return true;

    case VersionSynchronizationStrategies.dependenciesOnly:
      return changedPackages.has(packageName);

    case VersionSynchronizationStrategies.none:
      return false;

    default:
      throw new Error(
        `Unknown version synchronization strategy: "${versionSyncStrategy}"`,
      );
  }
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
  return Object.hasOwnProperty.call(specification, 'versionSyncStrategy');
}
