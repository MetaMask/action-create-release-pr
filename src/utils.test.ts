import fs from 'fs';
import {
  AcceptedSemverReleaseTypes,
  getActionInputs,
  InputKeys,
  isMajorSemverDiff,
  isTruthyString,
  isValidSemver,
  readJsonFile,
  writeJsonFile,
  tabs,
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
  // process.env.GITHUB_WORKSPACE = require.resolve('..')
  if (releaseType !== undefined) {
    process.env[InputKeys.ReleaseType] = releaseType;
  }
  if (releaseVersion !== undefined) {
    process.env[InputKeys.ReleaseVersion] = releaseVersion;
  }
};

const unmockProcessEnv = () => {
  // foo @ts-ignore
  // delete process.env.GITHUB_WORKSPACE
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

describe('readJsonFile', () => {
  afterAll(() => {
    jest.clearAllMocks();
  });

  it('reads a JSON file and returns it as an object', async () => {
    const expectedResult = { foo: ['bar', 'baz'] };
    const path = 'arbitrary/path';
    const mockJsonString = JSON.stringify(expectedResult);

    jest
      .spyOn(fs.promises, 'readFile')
      .mockImplementationOnce(async () => mockJsonString);

    const result = await readJsonFile(path);
    expect(result).toStrictEqual(expectedResult);
  });

  it('throws an error if the file contains invalid JSON', async () => {
    const path = 'arbitrary/path';
    // missing closing curly bracket
    const mockJsonString = `{ foo: ['bar', 'baz']`;

    jest
      .spyOn(fs.promises, 'readFile')
      .mockImplementationOnce(async () => mockJsonString);

    await expect(readJsonFile(path)).rejects.toThrow(/^Unexpected token/u);
  });

  it('throws an error if the file parses to a falsy value', async () => {
    const path = 'arbitrary/path';
    const mockJsonString = 'null';

    jest
      .spyOn(fs.promises, 'readFile')
      .mockImplementationOnce(async () => mockJsonString);

    await expect(readJsonFile(path)).rejects.toThrow(/falsy value\.$/u);
  });
});

describe('writeJsonFile', () => {
  afterAll(() => {
    jest.clearAllMocks();
  });

  const stringify = (value: unknown) => `${JSON.stringify(value, null, 2)}\n`;

  it('stringifies a JSON-like value and writes it to disk', async () => {
    const jsonValue = { foo: ['bar', 'baz'] };
    const path = 'arbitrary/path';

    const writeFileSpy = jest.spyOn(fs.promises, 'writeFile');

    await writeJsonFile(path, jsonValue);
    expect(writeFileSpy).toHaveBeenCalledTimes(1);
    expect(writeFileSpy).toHaveBeenCalledWith(path, stringify(jsonValue));
  });
});

describe('isValidSemver', () => {
  it('returns true for clean SemVer version strings', () => {
    expect(isValidSemver('0.0.1')).toStrictEqual(true);
    expect(isValidSemver('0.1.0')).toStrictEqual(true);
    expect(isValidSemver('1.0.0')).toStrictEqual(true);
    expect(isValidSemver('1.0.1')).toStrictEqual(true);
    expect(isValidSemver('1.1.0')).toStrictEqual(true);
    expect(isValidSemver('1.1.1')).toStrictEqual(true);
    expect(isValidSemver('1.0.0-0')).toStrictEqual(true);
    expect(isValidSemver('1.0.0-beta')).toStrictEqual(true);
    expect(isValidSemver('1.0.0-beta1')).toStrictEqual(true);
    expect(isValidSemver('1.0.0-beta.1')).toStrictEqual(true);
  });

  it('returns false for non-string values', () => {
    expect(isValidSemver(null)).toStrictEqual(false);
  });

  it('returns false for v-prefixed SemVer strings', () => {
    expect(isValidSemver('v1.0.0')).toStrictEqual(false);
  });
});

describe('isMajorSemverDiff', () => {
  it('returns true for "major" and "premajor" diffs', () => {
    expect(isMajorSemverDiff('major')).toStrictEqual(true);
    expect(isMajorSemverDiff('premajor')).toStrictEqual(true);
  });

  it('returns false for non-major diffs', () => {
    expect(isMajorSemverDiff('patch')).toStrictEqual(false);
    expect(isMajorSemverDiff('minor')).toStrictEqual(false);
    expect(isMajorSemverDiff('prerelease')).toStrictEqual(false);
  });
});

describe('isTruthyString', () => {
  it('returns true for truthy strings', () => {
    expect(isTruthyString('foo')).toStrictEqual(true);
    expect(isTruthyString('a')).toStrictEqual(true);
    expect(isTruthyString('很高兴认识您！')).toStrictEqual(true);
  });

  it('returns false for falsy strings', () => {
    expect(isTruthyString('')).toStrictEqual(false);
  });

  it('returns false for non-strings', () => {
    expect(isTruthyString(true)).toStrictEqual(false);
    expect(isTruthyString(false)).toStrictEqual(false);
    expect(isTruthyString({ foo: 'bar' })).toStrictEqual(false);
    expect(isTruthyString([])).toStrictEqual(false);
    expect(isTruthyString(['baz'])).toStrictEqual(false);
  });
});

describe('tabs', () => {
  const TAB = '  ';

  it('throws on invalid inputs', () => {
    expect(() => tabs(0)).toThrow('Expected positive integer.');
    expect(() => tabs(-1)).toThrow('Expected positive integer.');
  });

  it('returns the specified number of tabs', () => {
    expect(tabs(1)).toStrictEqual(TAB);
    expect(tabs(5)).toStrictEqual(`${TAB}${TAB}${TAB}${TAB}${TAB}`);
  });

  it('prepends a prefix to the entire string', () => {
    expect(tabs(1, 'foo')).toStrictEqual(`foo${TAB}`);
    expect(tabs(5, 'foo')).toStrictEqual(`foo${TAB}${TAB}${TAB}${TAB}${TAB}`);
  });
});
