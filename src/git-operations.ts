import pathUtils from 'path';
import semverClean from 'semver/functions/clean';
import execa from 'execa';
import type { PackageMetadata } from './package-operations';
import { isValidSemver, WORKSPACE_ROOT } from './utils';

const HEAD = 'HEAD';

type DiffMap = Map<string, string[]>;

let INITIALIZED_GIT = false;
let TAGS: Readonly<string[]>;
const DIFFS: DiffMap = new Map();

/**
 * Executes "git tag" and stores the result.
 * Idempotent, but only if executed serially.
 */
async function initializeGit(): Promise<void> {
  if (!INITIALIZED_GIT) {
    [TAGS] = await getTags();
    // eslint-disable-next-line require-atomic-updates
    INITIALIZED_GIT = true;
  }
}

/**
 * ATTN: Only execute serially. Not safely parallelizable.
 *
 * Using git, checks whether the package changed since it was last released.
 *
 * Assumes that:
 * - The "version" field of the package's manifest corresponds to its latest
 * released version.
 * - The release commit of the package's latest version is tagged with
 * "v<VERSION>", where <VERSION> is equal to the manifest's "version" field.
 *
 * @param packageData - The metadata of the package to diff.
 * @returns Whether the package changed since its last release.
 */
export async function didPackageChange(
  packageData: PackageMetadata,
  packagesDir = 'packages',
): Promise<boolean> {
  await initializeGit();

  const {
    manifest: { name: packageName, version: currentVersion },
  } = packageData;
  const tagOfCurrentVersion = versionToTag(currentVersion);

  if (!TAGS.includes(tagOfCurrentVersion)) {
    throw new Error(
      `Package "${packageName}" has version "${currentVersion}" in its manifest, but no corresponding tag "${tagOfCurrentVersion}" exists.`,
    );
  }

  return hasDiff(packageData, tagOfCurrentVersion, packagesDir);
}

/**
 * Retrieves the diff for the given tag from the cache or performs the git diff
 * operation, caching the result and returning it.
 *
 * @param packageData - The metadata of the package to diff.
 * @param tag - The tag corresponding to the package's latest release.
 * @param packagesDir - The monorepo's packages directory.
 * @returns Whether the package changed since its last release.
 */
async function hasDiff(
  packageData: PackageMetadata,
  tag: string,
  packagesDir: string,
): Promise<boolean> {
  const { dirName: packageDirName } = packageData;

  let diff: string[];
  if (DIFFS.has(tag)) {
    diff = DIFFS.get(tag) as string[];
  } else {
    diff = await performDiff(tag, packagesDir);
    DIFFS.set(tag, diff);
  }

  const packagePathPrefix = pathUtils.join(packagesDir, packageDirName);
  return diff.some((diffPath) => diffPath.startsWith(packagePathPrefix));
}

/**
 * Wrapper function for executing "git diff".
 *
 * @param tag - The tag to compare against HEAD.
 * @param packagesDir - The monorepo's packages directory. Used for narrowing
 * git diff results.
 */
async function performDiff(
  tag: string,
  packagesDir: string,
): Promise<string[]> {
  return (
    await performGitOperation(
      'diff',
      tag,
      HEAD,
      '--name-only',
      '--',
      packagesDir,
    )
  ).split('\n');
}

/**
 * Utility function for executing "git tag" and parsing the result.
 *
 * @returns A tuple of all tags as a string array and the latest tag.
 */
async function getTags(): Promise<Readonly<[string[], string]>> {
  const rawTags = await performGitOperation('tag');
  const allTags = rawTags.split('\n');
  const latestTag = allTags[allTags.length - 1];
  if (!latestTag || !isValidSemver(semverClean(latestTag))) {
    throw new Error(
      `Invalid latest tag. Expected a valid SemVer version. Received: ${latestTag}`,
    );
  }
  return [allTags, latestTag] as const;
}

/**
 * Utility function for performing git operations via execa.
 *
 * @param command - The git command to execute.
 * @param args - The positional arguments to the git command.
 * @returns The result of the git command.
 */
async function performGitOperation(
  command: string,
  ...args: string[]
): Promise<string> {
  return (
    await execa('git', [command, ...args], { cwd: WORKSPACE_ROOT })
  ).stdout.trim();
}

/**
 * Takes a SemVer version string and prefixes it with "v".
 *
 * @param version - The SemVer version string to prefix.
 * @returns The "v"-prefixed SemVer version string.
 */
function versionToTag(version: string): string {
  return `v${version}`;
}
