import { setOutput as setActionOutput } from '@actions/core';
import semverIncrement from 'semver/functions/inc';
import semverDiff from 'semver/functions/diff';
import type { ReleaseType as SemverReleaseType } from 'semver';

import { getRepositoryHttpsUrl, getTags } from './git-operations';
import {
  FieldNames,
  getMetadataForAllPackages,
  getPackagesToUpdate,
  getPackageManifest,
  updatePackage,
  updatePackages,
  validateMonorepoPackageManifest,
  validatePackageManifestVersion,
  validatePackageManifestName,
  MonorepoPackageManifest,
  PolyrepoPackageManifest,
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
  const repositoryUrl = await getRepositoryHttpsUrl();

  // Get all git tags. An error is thrown if "git tag" returns no tags and the
  // local git history is incomplete.
  const [tags] = await getTags();

  const rawRootManifest = await getPackageManifest(WORKSPACE_ROOT);
  const rootManifest = validatePackageManifestVersion(
    rawRootManifest,
    WORKSPACE_ROOT,
  );

  const { version: currentVersion } = rootManifest;

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

  if (FieldNames.Workspaces in rootManifest) {
    console.log(
      'Project appears to have workspaces. Applying monorepo workflow.',
    );

    await updateMonorepo(
      newVersion,
      versionDiff,
      validateMonorepoPackageManifest(rootManifest, WORKSPACE_ROOT),
      repositoryUrl,
      tags,
    );
  } else {
    console.log(
      'Project does not appear to have any workspaces. Applying polyrepo workflow.',
    );

    await updatePolyrepo(
      newVersion,
      validatePackageManifestName(rootManifest, WORKSPACE_ROOT),
      repositoryUrl,
    );
  }
  setActionOutput('NEW_VERSION', newVersion);
}

/**
 * Given that checked out git repository is a polyrepo (i.e., a "normal",
 * single-package repo), updates the repository's package and its changelog.
 *
 * @param newVersion - The package's new version.
 * @param manifest - The package's parsed package.json file.
 * @param repositoryUrl - The HTTPS URL of the repository.
 */
async function updatePolyrepo(
  newVersion: string,
  manifest: PolyrepoPackageManifest,
  repositoryUrl: string,
): Promise<void> {
  await updatePackage(
    { dirPath: WORKSPACE_ROOT, manifest },
    { newVersion, repositoryUrl, shouldUpdateChangelog: true },
  );
}

/**
 * Given that the checked out repository is a monorepo:
 *
 * If the semver diff is "major" or if it's the first release of the monorepo
 * (inferred from the complete absence of tags), updates all packages.
 * Otherwise, updates packages that changed since their previous release.
 * The changelog of any updated package will also be updated.
 *
 * @param newVersion - The new version of the package(s) to update.
 * @param versionDiff - A SemVer version diff, e.g. "major" or "prerelease".
 * @param rootManifest - The parsed root package.json file of the monorepo.
 * @param repositoryUrl - The HTTPS URL of the repository.
 * @param tags - All tags reachable from the current git HEAD, as from "git
 * tag --merged".
 */
async function updateMonorepo(
  newVersion: string,
  versionDiff: SemverReleaseType,
  rootManifest: MonorepoPackageManifest,
  repositoryUrl: string,
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
    repositoryUrl,
    synchronizeVersions,
    shouldUpdateChangelog: true,
  };

  // Finally, bump the version of all packages and the root manifest, update the
  // changelogs of all updated packages, and add the new version as an output of
  // this Action.
  await updatePackages(allPackages, updateSpecification);
  await updatePackage(
    { dirPath: WORKSPACE_ROOT, manifest: rootManifest },
    { ...updateSpecification, shouldUpdateChangelog: false },
  );
}
