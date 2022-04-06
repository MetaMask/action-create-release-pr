import { isValidSemver, tabs } from '@metamask/action-utils';

// Our custom input env keys
export enum InputKeys {
  ReleaseType = 'RELEASE_TYPE',
  ReleaseVersion = 'RELEASE_VERSION',
  VersionSynchronizationStrategy = 'VERSION_SYNCHRONIZATION_STRATEGY',
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
 * The different monorepo package version synchronization strategies employed
 * by this Action.
 */
export enum VersionSynchronizationStrategies {
  /**
   * All packages will be updated to the new version, and the version of every
   * monorepo package will be updated to the new version wherever it appears as
   * a dependency.
   *
   * The published versions of all monorepo packages are "fixed".
   *
   * This is the default behavior _if_ the release is a new major version.
   */
  fixed = 'fixed',

  /**
   * Changed packages and their dependents in the monorepo will be updated to
   * the new version, and the version of every monorepo package will be updated
   * to the new version wherever it appears as a dependency.
   *
   * The published versions of all monorepo packages will reflect their
   * dependency relationships.
   *
   * This is the default behavior _unless_ the release is a new major version.
   */
  transitive = 'transitive',

  /**
   * Only changed packages will be updated to the new version, and the version
   * of every monorepo package will be updated to the new version wherever it
   * appears as a dependency. Synchronizing the monorepo package versions
   * internally is necessary for the functioning of `yarn`'s workspace feature.
   *
   * The the published versions of all monorepo packages are "independent".
   *
   * This is never the default behavior.
   */
  independent = 'independent',
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
      [InputKeys.VersionSynchronizationStrategy]: VersionSynchronizationStrategies;
    }
  }
}

/**
 * The names of the inputs to the Action, per action.yml.
 */
export enum InputNames {
  ReleaseType = 'release-type',
  ReleaseVersion = 'release-version',
  VersionSynchronizationStrategy = 'version-synchronization-strategy',
}

export interface ActionInputs {
  readonly ReleaseType: AcceptedSemverReleaseTypes | null;
  readonly ReleaseVersion: string | null;
  readonly VersionSynchronizationStrategy: VersionSynchronizationStrategies | null;
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
    VersionSynchronizationStrategy: getVersionSynchronizationStrategyInput(),
  };
  validateActionInputs(inputs);
  return inputs;
}

/**
 * Gets the trimmed value of a particular key of process.env.
 *
 * @param key - The key of `process.env` to access.
 * @returns The trimmed string value of the `process.env` key. Returns an empty
 * string if the key is not set.
 */
function getProcessEnvValue(key: string): string {
  return process.env[key]?.trim() || '';
}

/**
 * @returns The version synchronization strategy input of the Action, or the
 * default value if no input was specified.
 */
function getVersionSynchronizationStrategyInput(): VersionSynchronizationStrategies | null {
  const rawInput =
    getProcessEnvValue(InputKeys.VersionSynchronizationStrategy) || null;

  if (
    rawInput !== null &&
    !Object.hasOwnProperty.call(VersionSynchronizationStrategies, rawInput)
  ) {
    const tab = tabs(1, '\n');
    throw new Error(
      `Invalid "${
        InputNames.VersionSynchronizationStrategy
      }". Received "${rawInput}". Must be one of:${tab}${Object.values(
        VersionSynchronizationStrategies,
      ).join(tab)}`,
    );
  }
  return rawInput as VersionSynchronizationStrategies | null;
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
      }". Must be one of:${tab}${Object.values(AcceptedSemverReleaseTypes).join(
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
