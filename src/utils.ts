import { promises as fs } from 'fs';
import semverParse from 'semver/functions/parse';
import type { ReleaseType as SemverReleaseType } from 'semver';

// Our custom input env keys
export enum InputKeys {
  ReleaseType = 'RELEASE_TYPE',
  ReleaseVersion = 'RELEASE_VERSION',
}

/**
 * SemVer release types that are accepted by this Action.
 */
export enum AcceptedSemverReleaseTypes {
  Major = 'major',
  Minor = 'minor',
  Patch = 'patch',
}

/**
 * Add missing properties to "process.env" interface.
 */
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface ProcessEnv {
      // The root of the workspace running this action
      GITHUB_WORKSPACE: string;
      [InputKeys.ReleaseType]: string;
      [InputKeys.ReleaseVersion]: string;
    }
  }
}

/**
 * The names of the inputs to the Action, per action.yml.
 */
export enum InputNames {
  ReleaseType = 'release-type',
  ReleaseVersion = 'release-version',
}

export interface ActionInputs {
  readonly ReleaseType: AcceptedSemverReleaseTypes | null;
  readonly ReleaseVersion: string | null;
}

export const WORKSPACE_ROOT = process.env.GITHUB_WORKSPACE;

const TWO_SPACES = '  ';

/**
 * Validates and returns the inputs to the Action.
 * We perform additional validation because the GitHub Actions configuration
 * syntax is insufficient to express the requirements we have of our inputs.
 *
 * @returns The parsed and validated inputs to the Action.
 */
export function getActionInputs(): ActionInputs {
  const inputs: ActionInputs = {
    ReleaseType:
      (getProcessEnvValue(
        InputKeys.ReleaseType,
      ) as AcceptedSemverReleaseTypes) || null,
    ReleaseVersion: getProcessEnvValue(InputKeys.ReleaseVersion) || null,
  };
  validateActionInputs(inputs);
  return inputs;
}

/**
 * Utility function to get the trimmed value of a particular key of process.env.
 *
 * @param key - The key of process.env to access.
 * @returns The trimmed string value of the process.env key. Returns an empty
 * string if the key is not set.
 */
function getProcessEnvValue(key: string): string {
  return process.env[key]?.trim() || '';
}

/**
 * Validates the inputs to the Action, defined earlier in this file.
 * Throws an error if validation fails.
 */
function validateActionInputs(inputs: ActionInputs): void {
  if (!inputs.ReleaseType && !inputs.ReleaseVersion) {
    throw new Error(
      `Must specify either "${InputNames.ReleaseType}" or "${InputNames.ReleaseVersion}".`,
    );
  }

  if (inputs.ReleaseType && inputs.ReleaseVersion) {
    throw new Error(
      `Must specify either "${InputNames.ReleaseType}" or "${InputNames.ReleaseVersion}", not both.`,
    );
  }

  if (
    inputs.ReleaseType &&
    !Object.values(AcceptedSemverReleaseTypes).includes(inputs.ReleaseType)
  ) {
    const tab = tabs(1, '\n');
    throw new Error(
      `Unrecognized "${
        InputNames.ReleaseType
      }". Must be one of:${tab}${Object.keys(AcceptedSemverReleaseTypes).join(
        tab,
      )}`,
    );
  }

  if (inputs.ReleaseVersion) {
    if (!isValidSemver(inputs.ReleaseVersion)) {
      throw new Error(
        `"${InputNames.ReleaseVersion}" must be a plain SemVer version string. Received: ${inputs.ReleaseVersion}`,
      );
    }
  }
}

/**
 * Reads the assumed JSON file at the given path, attempts to parse it, and
 * returns the resulting object.
 *
 * Throws if failing to read or parse, or if the parsed JSON value is not a
 * plain object.
 *
 * @param paths - The path segments pointing to the JSON file. Will be passed
 * to path.join().
 * @returns The object corresponding to the parsed JSON file.
 */
export async function readJsonObjectFile(
  path: string,
): Promise<Record<string, unknown>> {
  const obj = JSON.parse(await fs.readFile(path, 'utf8')) as Record<
    string,
    unknown
  >;

  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
    throw new Error(
      `Assumed JSON file at path "${path}" parsed to a non-object value.`,
    );
  }
  return obj;
}

/**
 * Attempts to write the given JSON-like value to the file at the given path.
 * Adds a newline to the end of the file.
 *
 * @param path - The path to write the JSON file to, including the file itself.
 * @param jsonValue - The JSON-like value to write to the file. Make sure that
 * JSON.stringify can handle it.
 */
export async function writeJsonFile(
  path: string,
  jsonValue: unknown,
): Promise<void> {
  await fs.writeFile(path, `${JSON.stringify(jsonValue, null, 2)}\n`);
}

/**
 * Checks whether the given value is a valid, unprefixed SemVer version string.
 * The string must begin with the numerical major version.
 *
 * (The semver package has a similar function, but it permits v-prefixes.)
 *
 * @param value - The value to check.
 * @returns Whether the given value is a valid, unprefixed SemVer version
 * string.
 */
export function isValidSemver(value: unknown): value is string {
  if (typeof value !== 'string') {
    return false;
  }
  return semverParse(value, { loose: false })?.version === value;
}

/**
 * Checks whether the given SemVer diff is a major diff, i.e. "major" or
 * "premajor".
 *
 * @param diff - The SemVer diff to check.
 * @returns Whether the given SemVer diff is a major diff.
 */
export function isMajorSemverDiff(diff: SemverReleaseType): boolean {
  return diff.includes(AcceptedSemverReleaseTypes.Major);
}

/**
 * @param value - The value to test.
 * @returns Whether the value is a non-empty string.
 */
export function isTruthyString(value: unknown): value is string {
  return Boolean(value) && typeof value === 'string';
}

/**
 * @param numTabs - The number of tabs to return. A tab consists of two spaces.
 * @param prefix - The prefix to prepend to the returned string, if any.
 * @returns A string consisting of the prefix, if any, and the requested number
 * of tabs.
 */
export function tabs(numTabs: number, prefix?: string): string {
  if (!Number.isInteger(numTabs) || numTabs < 1) {
    throw new Error('Expected positive integer.');
  }

  const firstTab = prefix ? `${prefix}${TWO_SPACES}` : TWO_SPACES;

  if (numTabs === 1) {
    return firstTab;
  }
  return firstTab + new Array(numTabs).join(TWO_SPACES);
}
