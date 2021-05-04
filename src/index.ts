import {
  setFailed as setActionToFailed,
  setOutput as setActionOutput,
} from '@actions/core';
import semverIncrement from 'semver/functions/inc';
import semverDiff from 'semver/functions/diff';
import type { ReleaseType as SemverReleaseType } from 'semver';

import {
  getMetadataForAllPackages,
  getPackagesToUpdate,
  updatePackages,
  getPackageManifest,
  updatePackage,
} from './package-operations';
import { initializeGit } from './git-operations';
import { getActionInputs, isMajorSemverDiff, WORKSPACE_ROOT } from './utils';

main().catch((error) => {
  setActionToFailed(error);
});

async function main(): Promise<void> {
  const actionInputs = getActionInputs();

  // Get all git tags. An error is thrown if "git tag" returns no tags and the
  // local git history is incomplete.
  await initializeGit();

  const rootManifest = await getPackageManifest(WORKSPACE_ROOT, ['version']);
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

  // If the version bump is major, we will synchronize the versions of all
  // monorepo packages, meaning the "version" field of their manifests and
  // their version range specified wherever they appear as a dependency.
  const synchronizeVersions = isMajorSemverDiff(versionDiff);

  // Collect required information to perform updates
  const allPackages = await getMetadataForAllPackages();
  const packagesToUpdate = await getPackagesToUpdate(
    allPackages,
    synchronizeVersions,
  );
  const updateSpecification = {
    newVersion,
    packagesToUpdate,
    synchronizeVersions,
  };

  // Finally, bump the version of all packages and the root manifest, and add
  // the new version an Action output
  await updatePackages(allPackages, updateSpecification);
  await updatePackage(
    { dirPath: WORKSPACE_ROOT, manifest: rootManifest },
    updateSpecification,
  );
  setActionOutput('NEW_VERSION', newVersion);
}
