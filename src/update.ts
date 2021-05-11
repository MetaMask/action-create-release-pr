import { setOutput as setActionOutput } from '@actions/core';
import semverIncrement from 'semver/functions/inc';
import semverDiff from 'semver/functions/diff';
import type { ReleaseType as SemverReleaseType } from 'semver';

import { getTags } from './git-operations';
import {
  FieldNames,
  getMetadataForAllPackages,
  getPackagesToUpdate,
  getPackageManifest,
  PackageManifest,
  updatePackage,
  updatePackages,
} from './package-operations';
import { ActionInputs, isMajorSemverDiff, WORKSPACE_ROOT } from './utils';

/**
 * Action entry function. Gets git tags, reads the work space root package.json,
 * and updates the package(s) of the repository per the Action inputs.
 *
 * @see updateMonorepo - For details on monorepo workflow.
 * @see updatePolyrepo - For details on polyrepo (i.e. single-package
 * repository) workflow.
 */
export async function performUpdate(actionInputs: ActionInputs): Promise<void> {
  // Get all git tags. An error is thrown if "git tag" returns no tags and the
  // local git history is incomplete.
  const [tags] = await getTags();

  const rootManifest = await getPackageManifest(WORKSPACE_ROOT, [
    FieldNames.Version,
    FieldNames.Private,
    FieldNames.Workspaces,
  ]);

  const { version: currentVersion } = rootManifest;
  const isMonorepo = rootManifest.private === true && rootManifest.workspaces;

  // Compute the new version and version diff from the inputs and root manifest
  let newVersion: string, versionDiff: SemverReleaseType;
  if (actionInputs.ReleaseType) {
    newVersion = semverIncrement(
      currentVersion,
      actionInputs.ReleaseType,
    ) as string;
    versionDiff = actionInputs.ReleaseType;
  } else {
    newVersion = actionInputs.ReleaseVersion as string;
    versionDiff = semverDiff(currentVersion, newVersion) as SemverReleaseType;
  }

  if (isMonorepo) {
    await updateMonorepo(newVersion, versionDiff, rootManifest, tags);
  } else {
    await updatePolyrepo(newVersion, rootManifest);
  }
  setActionOutput('NEW_VERSION', newVersion);
}

/**
 *
 * Given that the package is a polyrepo (i.e., a "normal", single-package repo),
 * updates the package.
 *
 * @param newVersion - The package's new version.
 * @param manifest - The package's parsed package.json file.
 */
async function updatePolyrepo(
  newVersion: string,
  manifest: Partial<PackageManifest>,
): Promise<void> {
  await updatePackage({ dirPath: WORKSPACE_ROOT, manifest }, { newVersion });
}

/**
 * Given that the Action is run for a monorepo:
 *
 * If the semver diff is "major" or if it's the first release of the monorepo
 * (inferred from the complete absence of tags), updates all packages.
 * Otherwise, updates packages that changed since their previous release.
 *
 * @param newVersion - The new version of the package(s) to update.
 * @param versionDiff - A SemVer version diff, e.g. "major" or "prerelease".
 * @param rootManifest - The parsed root package.json file of the monorepo.
 * @param tags - All tags reachable from the current git HEAD, as from "git
 * tag --merged".
 */
async function updateMonorepo(
  newVersion: string,
  versionDiff: SemverReleaseType,
  rootManifest: Partial<PackageManifest>,
  tags: ReadonlySet<string>,
): Promise<void> {
  // If the version bump is major, we will synchronize the versions of all
  // monorepo packages, meaning the "version" field of their manifests and
  // their version range specified wherever they appear as a dependency.
  const synchronizeVersions = isMajorSemverDiff(versionDiff);

  // Collect required information to perform updates
  const allPackages = await getMetadataForAllPackages();
  const packagesToUpdate = await getPackagesToUpdate(
    allPackages,
    synchronizeVersions,
    tags,
  );
  const updateSpecification = {
    newVersion,
    packagesToUpdate,
    synchronizeVersions,
  };

  // Finally, bump the version of all packages and the root manifest, and add
  // the new version as an output of this Action
  await updatePackages(allPackages, updateSpecification);
  await updatePackage(
    { dirPath: WORKSPACE_ROOT, manifest: rootManifest },
    updateSpecification,
  );
}
