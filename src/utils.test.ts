import {
  AcceptedSemverReleaseTypes,
  getActionInputs,
  InputKeys,
  InputNames,
  VersionSynchronizationStrategies,
} from './utils';

jest.mock('fs', () => ({
  promises: {
    readFile: jest.fn(),
    writeFile: jest.fn(),
  },
}));

const mockProcessEnv = ({
  releaseType,
  releaseVersion,
  versionSyncStrategy,
}: {
  releaseType?: string;
  releaseVersion?: string;
  versionSyncStrategy?: VersionSynchronizationStrategies;
}) => {
  if (releaseType !== undefined) {
    process.env[InputKeys.ReleaseType] = releaseType;
  }
  if (releaseVersion !== undefined) {
    process.env[InputKeys.ReleaseVersion] = releaseVersion;
  }
  if (versionSyncStrategy !== undefined) {
    process.env[InputKeys.VersionSynchronizationStrategy] = versionSyncStrategy;
  }
};

const unmockProcessEnv = () => {
  Object.values(InputKeys).forEach((key) => delete process.env[key]);
};

describe('getActionInputs', () => {
  afterEach(() => {
    unmockProcessEnv();
  });

  it(`correctly parses valid input: ${InputNames.ReleaseType}`, () => {
    Object.values(AcceptedSemverReleaseTypes).forEach((releaseType) => {
      mockProcessEnv({ releaseType });

      expect(getActionInputs()).toStrictEqual({
        ReleaseType: releaseType,
        ReleaseVersion: null,
        VersionSynchronizationStrategy: null,
      });
    });
  });

  it(`correctly parses valid input: ${InputNames.ReleaseVersion}`, () => {
    ['1.0.0', '2.0.0', '1.0.1', '0.1.0'].forEach((releaseVersion) => {
      mockProcessEnv({ releaseVersion });

      expect(getActionInputs()).toStrictEqual({
        ReleaseType: null,
        ReleaseVersion: releaseVersion,
        VersionSynchronizationStrategy: null,
      });
    });
  });

  it(`correctly parses valid input: ${InputNames.VersionSynchronizationStrategy}`, () => {
    const releaseVersion = '1.0.0';

    Object.values(VersionSynchronizationStrategies).forEach(
      (versionSyncStrategy) => {
        mockProcessEnv({ versionSyncStrategy, releaseVersion });

        expect(getActionInputs()).toStrictEqual({
          ReleaseType: null,
          ReleaseVersion: releaseVersion,
          VersionSynchronizationStrategy: versionSyncStrategy,
        });
      },
    );
  });

  it('throws if neither "release-type" nor "release-version" are specified', () => {
    mockProcessEnv({});
    expect(() => getActionInputs()).toThrow(/^Must specify either/u);
  });

  it('throws if both "release-type" and "release-version" are specified', () => {
    mockProcessEnv({ releaseType: 'patch', releaseVersion: '1.0.0' });
    expect(() => getActionInputs()).toThrow(/not both.$/u);
  });

  it('throws if "release-type" is not an accepted SemVer release type', () => {
    const invalidTypes = ['v1.0.0', '1.0.0', 'premajor', 'foo'];
    for (const releaseType of invalidTypes) {
      mockProcessEnv({ releaseType });
      expect(() => getActionInputs()).toThrow(/^Unrecognized/u);
    }
  });

  it('throws if neither "release-version" is not a valid SemVer version', () => {
    const invalidVersions = ['v1.0.0', 'major', 'premajor', 'foo'];
    for (const releaseVersion of invalidVersions) {
      mockProcessEnv({ releaseVersion });
      expect(() => getActionInputs()).toThrow(/a plain SemVer version string/u);
    }
  });
});
