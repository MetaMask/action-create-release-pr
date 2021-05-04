import pathUtils from 'path';
import semverClean from 'semver/functions/clean';
import execa from 'execa';
import type { PackageMetadata } from './package-operations';
import { isValidSemver, WORKSPACE_ROOT } from './utils';

const HEAD = 'HEAD';

type DiffMap = Map<string, string[]>;

let INITIALIZED_GIT = false;
let TAGS: Readonly<Set<string>>;
const DIFFS: DiffMap = new Map();

/**
 * ATTN: This function must be called before other git operations are performed.
 *
 * Executes "git tag" and caches the result. Throws an error if fetching tags
 * fails.
 *
 * Idempotent, but only if executed serially.
 */
export async function initializeGit(): Promise<void> {
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
 * Assumes that initializeGit has been called. If it's not the
 * first release of the package, also assumes that:
 *
 * - The "version" field of the package's manifest corresponds to its latest
 * released version.
 * - The release commit of the package's most recent version is tagged with
 * "v<VERSION>", where <VERSION> is equal to the manifest's "version" field.
 *
 * @param packageData - The metadata of the package to diff.
 * @param packagesDir - The directory containing the monorepo's packages.
 * @returns Whether the package changed since its last release. `true` is
 * returned if there are no releases in the repository's history.
 */
export async function didPackageChange(
  packageData: PackageMetadata,
  packagesDir = 'packages',
  _tags: never = TAGS as never, // for testing purposes
): Promise<boolean> {
  const tags = _tags as typeof TAGS;
  // In this case, we assume that it's the first release, and every package
  // is implicitly considered to have "changed".
  if (tags.size === 0) {
    return true;
  }

  const {
    manifest: { name: packageName, version: currentVersion },
  } = packageData;
  const tagOfCurrentVersion = versionToTag(currentVersion);

  if (!tags.has(tagOfCurrentVersion)) {
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
 * ATTN: Only exported for testing purposes. Consumers should use initializeGit.
 *
 * Utility function for executing "git tag" and parsing the result.
 * An error is thrown if no tags are found and the local git history is
 * incomplete.
 *
 * @returns A tuple of all tags as a string array and the latest tag.
 * The tuple is populated by an empty array and null if there are no tags.
 */
export async function getTags(): Promise<
  Readonly<[Set<string>, string | null]>
> {
  // The --merged flag ensures that we only get tags that are parents of or
  // equal to the current HEAD.
  const rawTags = await performGitOperation('tag', '--merged');
  const allTags = rawTags.split('\n').filter((value) => value !== '');

  if (allTags.length === 0) {
    if (await hasCompleteGitHistory()) {
      return [new Set(), null];
    }
    throw new Error(
      `"git tag" returned no tags. Increase your git fetch depth.`,
    );
  }

  const latestTag = allTags[allTags.length - 1];
  if (!latestTag || !isValidSemver(semverClean(latestTag))) {
    throw new Error(
      `Invalid latest tag. Expected a valid SemVer version. Received: ${latestTag}`,
    );
  }
  return [new Set(allTags), latestTag] as const;
}

/**
 * Check whether the local repository has a complete git history.
 * Implemented using "git rev-parse --is-shallow-repository".
 *
 * @returns Whether the local repository has a complete, as opposed to shallow,
 * git history.
 */
async function hasCompleteGitHistory(): Promise<boolean> {
  const isShallow = await performGitOperation(
    'rev-parse',
    '--is-shallow-repository',
  );

  // We invert the meaning of these strings because we want to know if the
  // repository is NOT shallow.
  if (isShallow === 'true') {
    return false;
  } else if (isShallow === 'false') {
    return true;
  }
  throw new Error(
    `"git rev-parse --is-shallow-repository" returned unrecognized value: ${isShallow}`,
  );
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
