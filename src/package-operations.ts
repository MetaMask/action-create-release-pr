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
import type { DepGraph } from 'dependency-graph';
import { didPackageChange } from './git-operations';
import { getMonorepoDependencyGraph } from './graph-utils';
import { VersionSynchronizationStrategies, WORKSPACE_ROOT } from './utils';

export interface IntermediatePackageMetadata {
  readonly dirName: string;
  readonly manifest: PackageManifest;
  readonly name: string;
  readonly dirPath: string;
}

export interface PackageMetadata extends IntermediatePackageMetadata {
  readonly shouldUpdate: boolean;
}

interface UpdateSpecification {
  readonly newVersion: string;
  readonly repositoryUrl: string;
}

export interface MonorepoUpdateSpecification extends UpdateSpecification {
  readonly allPackageMetadata: ReadonlyMap<string, PackageMetadata>;
  /**
   * The set of packages that have changed since the previous release. This is
   * in some cases needed in the update specification to determine whether to
   * update the version ranges of internal monorepo packages where they appear
   * as dependencies.
   */
  readonly changedPackages: ReadonlySet<string>;
  readonly versionSyncStrategy: VersionSynchronizationStrategies;
  readonly shouldUpdateChangelog: boolean;
}

const MANIFEST_FILE_NAME = 'package.json';
const CHANGELOG_FILE_NAME = 'CHANGELOG.md';

/**
 * Finds the package manifest for each workspace, determines which packages
 * have changed since the last release, and collects necessary metadata for
 * about package.
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
): Promise<[ReadonlyMap<string, PackageMetadata>, ReadonlySet<string>]> {
  const workspaceLocations = await getWorkspaceLocations(workspaces, rootDir);

  // These are populated in the .map() below.
  const changedPackages: Set<string> = new Set();
  const intermediatePackageMetadata: Map<
    string,
    IntermediatePackageMetadata | PackageMetadata
  > = new Map();

  // We could have reduced here, but instead we parallelize our operations using
  // Promise.all.
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

        // Record whether package changed. If we're synchronizing the versions
        // of all packages, regard all packages as changed. Otherwise, go by the
        // git history.
        if (
          versionSyncStrategy === VersionSynchronizationStrategies.fixed ||
          (await didPackageChange(tags, manifest, packagePath))
        ) {
          changedPackages.add(packageName);
        }

        // Record intermediate package metadata.
        intermediatePackageMetadata.set(packageName, {
          dirName: pathUtils.basename(packagePath),
          manifest,
          name: packageName,
          dirPath: packagePath,
        });
      }
    }),
  );

  // If our strategy is not to bump the versions of all packages and no packages
  // changed, there's nothing to do, and we exit with an error.
  if (
    versionSyncStrategy !== VersionSynchronizationStrategies.fixed &&
    changedPackages.size === 0
  ) {
    throw new Error(`There are no packages to update.`);
  }

  return [
    getCompletePackageMetadata(
      intermediatePackageMetadata,
      changedPackages,
      versionSyncStrategy,
    ),
    changedPackages,
  ];
}

/**
 * Given the intermediate equivalent, gets the _complete_ metadata for all
 * packages in the monorepo, which amounts to a boolean for each package
 * indicating whether it should be updated. This is computed by analyzing the
 * monorepo's dependency graph.
 *
 * @param intermediatePackageMetadata - The intermediate package metadata of all
 * monorepo packages.
 * @param changedPackages - The set of packages that have changed.
 * @param versionSyncStrategy - The version synchronization strategy.
 * @returns The complete package metadata for all packages in the monorepo.
 */
export function getCompletePackageMetadata(
  intermediatePackageMetadata: ReadonlyMap<string, IntermediatePackageMetadata>,
  changedPackages: ReadonlySet<string>,
  versionSyncStrategy: VersionSynchronizationStrategies,
): ReadonlyMap<string, PackageMetadata> {
  const dependencyGraph = getMonorepoDependencyGraph(
    intermediatePackageMetadata,
  );

  // This mutable set will be modified as the dependency graph is traversed.
  const packagesToUpdate = new Set(changedPackages.values());

  /**
   * Sidebar: Topological order
   *
   * "...a topological sort or topological ordering of a directed graph is a
   * linear ordering of its vertices such that for every directed edge uv from
   * vertex u to vertex v, u comes before v in the ordering."
   * Ref: https://en.wikipedia.org/wiki/Topological_sorting
   *
   * In our usage, there is a directed edge from PackageA to PackageB if
   * PackageA lists PackageB in any of the dependency fields in its
   * `package.json`.
   *
   * `overallOrder` is a convention of the `dependency-graph` library, which by
   * all appearances is the opposite of topological order.
   * Ref: https://github.com/jriecken/dependency-graph/tree/072cdcc3eef1ee4531114e7a675e3cbe828fb33e#examples
   */

  // Traverse the monorepo's internal dependency graph in topological order.
  return dependencyGraph
    .overallOrder() // leaves -> root
    .reverse() // root -> leaves (topological order)
    .reduce((fullPackageMetadata, packageName) => {
      const shouldUpdate = shouldUpdateMonorepoPackage(
        packageName,
        packagesToUpdate,
        dependencyGraph,
        versionSyncStrategy,
      );

      // Update the set of packages that will be updated in preparation for the
      // next iteration.
      if (shouldUpdate) {
        packagesToUpdate.add(packageName);
      }

      fullPackageMetadata.set(packageName, {
        // Every package is in the dependency graph, so we know that the key exists.
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        ...intermediatePackageMetadata.get(packageName)!,
        shouldUpdate,
      });
      return fullPackageMetadata;
    }, new Map<string, PackageMetadata>());
}

/**
 * **ATTN:** This function must be called on each monorepo package in
 * topological order of dependency in order to return valid results.
 *
 * Gets whether the specified package should be updated, given the set of
 * dependents of this package that will be updated, the monorepo dependency
 * graph, and the active version synchronization strategy.
 *
 * @param packageName - The name of the package to check.
 * @param packagesToUpdate - The (mutable) set of packages that will be updated.
 * @param dependencyGraph - The monorepo's internal dependency graph.
 * @param versionSyncStrategy - The version synchronization strategy.
 * @returns Whether the package should be updated to the new version.
 */
export function shouldUpdateMonorepoPackage(
  packageName: string,
  packagesToUpdate: Set<string>,
  dependencyGraph: DepGraph<string>,
  versionSyncStrategy: VersionSynchronizationStrategies,
): boolean {
  const shouldUpdate =
    versionSyncStrategy === VersionSynchronizationStrategies.fixed ||
    packagesToUpdate.has(packageName) ||
    dependencyGraph
      .dependenciesOf(packageName)
      .reduce<boolean>((hasChangedDependency, dependencyName) => {
        return hasChangedDependency || packagesToUpdate.has(dependencyName);
      }, false);

  return shouldUpdate;
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
export async function updateMonorepoPackages(
  updateSpecification: MonorepoUpdateSpecification,
): Promise<void> {
  const { allPackageMetadata } = updateSpecification;
  await Promise.all(
    Array.from(allPackageMetadata.values()).map(async (packageMetadata) =>
      updateMonorepoPackage(packageMetadata, updateSpecification),
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
async function updateMonorepoPackage(
  packageMetadata: PackageMetadata,
  updateSpecification: MonorepoUpdateSpecification,
  rootDir: string = WORKSPACE_ROOT,
): Promise<void> {
  await Promise.all([
    writeJsonFile(
      pathUtils.join(rootDir, packageMetadata.dirPath, MANIFEST_FILE_NAME),
      getUpdatedManifest(packageMetadata, updateSpecification),
    ),
    packageMetadata.shouldUpdate && updateSpecification.shouldUpdateChangelog
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
  const { manifest: currentManifest, shouldUpdate } = packageMetadata;
  const { newVersion } = updateSpecification;
  if (isMonorepoUpdateSpecification(updateSpecification)) {
    // Synchronize monorepo package versions wherever they appear as a dependency.
    return {
      ...currentManifest,
      ...getUpdatedDependencyFields(currentManifest, updateSpecification),
      version: shouldUpdate ? newVersion : currentManifest.version,
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
  return Object.values(ManifestDependencyFieldNames).reduce(
    (newDepsFields: Record<string, unknown>, fieldName) => {
      if (Object.hasOwnProperty.call(currentManifest, fieldName)) {
        newDepsFields[fieldName] = getUpdatedDependencyField(
          currentManifest[fieldName] as Record<string, string>,
          updateSpecification,
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
  updateSpecification: MonorepoUpdateSpecification,
): Record<string, string> {
  const {
    allPackageMetadata,
    changedPackages,
    newVersion,
    versionSyncStrategy,
  } = updateSpecification;

  const newVersionRange = `^${newVersion}`;

  return Object.keys(dependencyObject).reduce(
    (newDeps: Record<string, string>, packageName) => {
      if (allPackageMetadata.has(packageName)) {
        newDeps[packageName] = shouldUpdateDependencyVersion(
          packageName,
          versionSyncStrategy,
          changedPackages,
        )
          ? newVersionRange
          : dependencyObject[packageName];
      }

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
    case VersionSynchronizationStrategies.fixed:
      return true;

    case VersionSynchronizationStrategies.transitive:
    case VersionSynchronizationStrategies.independent:
      return changedPackages.has(packageName);

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
