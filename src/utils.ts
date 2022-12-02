import { isValidSemver, tabs } from '@ethjs-staging/action-utils';

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
 *
 * @param inputs - The inputs to this action.
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
 * Type guard for determining whether the given value is an error object with a
 * `code` property, such as the kind of error that Node throws for filesystem
 * operations.
 *
 * @param error - The object to check.
 * @returns True or false, depending on the result.
 */
export function isErrorWithCode(error: unknown): error is { code: string } {
  return typeof error === 'object' && error !== null && 'code' in error;
}
