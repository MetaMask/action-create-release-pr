import {
  AcceptedSemverReleaseTypes,
  getActionInputs,
  InputKeys,
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
}: {
  releaseType?: string;
  releaseVersion?: string;
}) => {
  if (releaseType !== undefined) {
    process.env[InputKeys.ReleaseType] = releaseType;
  }

  if (releaseVersion !== undefined) {
    process.env[InputKeys.ReleaseVersion] = releaseVersion;
  }
};

const unmockProcessEnv = () => {
  Object.values(InputKeys).forEach((key) => delete process.env[key]);
};

describe('getActionInputs', () => {
  afterEach(() => {
    unmockProcessEnv();
  });

  it('correctly parses valid input: release-type', () => {
    for (const releaseType of Object.values(AcceptedSemverReleaseTypes)) {
      mockProcessEnv({ releaseType });
      expect(getActionInputs()).toStrictEqual({
        ReleaseType: releaseType,
        ReleaseVersion: null,
      });
    }
  });

  it('correctly parses valid input: release-version', () => {
    const versions = ['1.0.0', '2.0.0', '1.0.1', '0.1.0'];
    for (const releaseVersion of versions) {
      mockProcessEnv({ releaseVersion });
      expect(getActionInputs()).toStrictEqual({
        ReleaseType: null,
        ReleaseVersion: releaseVersion,
      });
    }
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
