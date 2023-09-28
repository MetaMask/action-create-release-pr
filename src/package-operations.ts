import { promises as fs } from 'fs';
import pathUtils from 'path';
import { updateChangelog } from '@metamask/auto-changelog';
import {
  getPackageManifest,
  getWorkspaceLocations,
  ManifestDependencyFieldNames,
  ManifestFieldNames,
  PackageManifest,
  MonorepoPackageManifest,
  validateMonorepoPackageManifest,
  validatePackageManifestVersion,
  validatePolyrepoPackageManifest,
  writeJsonFile,
} from '@metamask/action-utils';
import prettier from 'prettier';
import { didPackageChange } from './git-operations';
import { WORKSPACE_ROOT, isErrorWithCode } from './utils';

export interface PackageMetadata {
  readonly dirName: string;
  readonly manifest: PackageManifest | MonorepoPackageManifest;
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

const MANIFEST_FILE_NAME = 'package.json';
const CHANGELOG_FILE_NAME = 'CHANGELOG.md';

/**
 * Recursively finds the package manifest for each workspace, and collects
 * metadata for each package.
 *
 * @param workspaces - The list of workspace patterns given in the root manifest.
 * @param rootDir - The monorepo root directory.
 * @param parentDir - The parent directory of the current package.
 * @returns The metadata for all packages in the monorepo.
 */
export async function getMetadataForAllPackages(
  workspaces: string[],
  rootDir: string = WORKSPACE_ROOT,
  parentDir = '',
): Promise<Record<string, PackageMetadata>> {
  const workspaceLocations = await getWorkspaceLocations(workspaces, rootDir);

  return workspaceLocations.reduce<Promise<Record<string, PackageMetadata>>>(
    async (promise, workspaceDirectory) => {
      const result = await promise;

      const fullWorkspacePath = pathUtils.join(rootDir, workspaceDirectory);
      if ((await fs.lstat(fullWorkspacePath)).isDirectory()) {
        const rawManifest = await getPackageManifest(fullWorkspacePath);

        // If the package is a sub-workspace, resolve all packages in the sub-workspace and add them
        // to the result.
        if (ManifestFieldNames.Workspaces in rawManifest) {
          const rootManifest = validatePackageManifestVersion(
            rawManifest,
            workspaceDirectory,
          );

          const manifest = validateMonorepoPackageManifest(
            rootManifest,
            workspaceDirectory,
          );

          const name = manifest[ManifestFieldNames.Name];
          if (!name) {
            throw new Error(
              `Expected sub-workspace in "${workspaceDirectory}" to have a name.`,
            );
          }

          return {
            ...result,
            ...(await getMetadataForAllPackages(
              manifest.workspaces,
              workspaceDirectory,
              workspaceDirectory,
            )),
            [name]: {
              dirName: pathUtils.basename(workspaceDirectory),
              manifest,
              name,
              dirPath: pathUtils.join(parentDir, workspaceDirectory),
            },
          };
        }

        const manifest = validatePolyrepoPackageManifest(
          rawManifest,
          workspaceDirectory,
        );

        return {
          ...result,
          [manifest.name]: {
            dirName: pathUtils.basename(workspaceDirectory),
            manifest,
            name: manifest.name,
            dirPath: pathUtils.join(parentDir, workspaceDirectory),
          },
        };
      }

      return result;
    },
    Promise.resolve({}),
  );
}

/**
 * Determines the set of packages whose versions should be bumped and whose
 * changelogs should be updated.
 *
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
 * - The "version" field is replaced with the new version.
 * - If package versions are being synchronized, updates their version ranges
 * wherever they appear as dependencies.
 *
 * @param allPackages - The metadata of all monorepo packages.
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
 * - The "version" field is replaced with the new version.
 * - If package versions are being synchronized, updates their version ranges
 * wherever they appear as dependencies.
 *
 * @param packageMetadata - The metadata of the package to update.
 * @param packageMetadata.dirPath - The full path to the directory that holds
 * the package.
 * @param packageMetadata.manifest - The information within the `package.json`
 * file for the package.
 * @param updateSpecification - The update specification, which determines how
 * the update is performed.
 * @param rootDir - The full path to the project.
 */
export async function updatePackage(
  packageMetadata: { dirPath: string; manifest: Partial<PackageManifest> },
  updateSpecification: UpdateSpecification | MonorepoUpdateSpecification,
  rootDir: string = WORKSPACE_ROOT,
): Promise<void> {
  await Promise.all([
    writeJsonFile(
      pathUtils.join(rootDir, packageMetadata.dirPath, MANIFEST_FILE_NAME),
      getUpdatedManifest(packageMetadata.manifest, updateSpecification),
    ),
    updateSpecification.shouldUpdateChangelog
      ? updatePackageChangelog(packageMetadata, updateSpecification)
      : Promise.resolve(),
  ]);
}

/**
 * Updates the changelog file of the given package, using
 * `@metamask/auto-changelog`. Assumes that the changelog file is located at the
 * package root directory and named "CHANGELOG.md".
 *
 * @param packageMetadata - The metadata of the package to update.
 * @param packageMetadata.dirPath - The full path to the directory that holds
 * the package.
 * @param packageMetadata.manifest - The information within the `package.json`
 * file for the package.
 * @param updateSpecification - The update specification, which determines how
 * the update is performed.
 * @param rootDir - The full path to the project.
 * @returns The result of writing to the changelog.
 */
async function updatePackageChangelog(
  packageMetadata: { dirPath: string; manifest: Partial<PackageManifest> },
  updateSpecification: UpdateSpecification | MonorepoUpdateSpecification,
  rootDir: string = WORKSPACE_ROOT,
): Promise<number | void> {
  const { dirPath: projectRootDirectory } = packageMetadata;
  const { newVersion, repositoryUrl } = updateSpecification;

  let changelogContent: string;
  const packagePath = pathUtils.join(rootDir, projectRootDirectory);
  const changelogPath = pathUtils.join(packagePath, CHANGELOG_FILE_NAME);

  try {
    changelogContent = await fs.readFile(changelogPath, 'utf-8');
  } catch (error) {
    // If the error is not a file not found error, throw it
    if (!isErrorWithCode(error) || error.code !== 'ENOENT') {
      console.error(`Failed to read changelog in "${projectRootDirectory}".`);
      throw error;
    }

    console.warn(`Failed to read changelog in "${projectRootDirectory}".`);
    return undefined;
  }

  const newChangelogContent = await updateChangelog({
    changelogContent,
    currentVersion: newVersion,
    isReleaseCandidate: true,
    projectRootDirectory,
    repoUrl: repositoryUrl,
    formatter: (changelog) =>
      prettier.format(changelog, { parser: 'markdown' }),
  });
  if (!newChangelogContent) {
    const packageName = packageMetadata.manifest.name;
    throw new Error(
      `"updateChangelog" returned an empty value for package ${
        packageName ? `"${packageName}"` : `at "${packagePath}"`
      }.`,
    );
  }

  return await fs.writeFile(changelogPath, newChangelogContent);
}

/**
 * Updates the given manifest per the update specification as follows:
 *
 * - Updates the manifest's "version" field to the new version.
 * - If monorepo package versions are being synchronized, updates their version
 * ranges wherever they appear as dependencies.
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
 * @param manifest - The package's current manifest, as read from disk.
 * @param updateSpecification - The update specification, which determines how
 * the update is performed.
 * @returns The updated dependency fields of the manifest.
 */
function getUpdatedDependencyFields(
  manifest: Partial<PackageManifest>,
  updateSpecification: MonorepoUpdateSpecification,
): Partial<Pick<PackageManifest, ManifestDependencyFieldNames>> {
  const { newVersion, packagesToUpdate } = updateSpecification;
  return Object.values(ManifestDependencyFieldNames).reduce(
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
      newDeps[packageName] =
        packagesToUpdate.has(packageName) &&
        !dependencyObject[packageName].startsWith('workspace:')
          ? newVersionRange
          : dependencyObject[packageName];

      return newDeps;
    },
    {},
  );
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
