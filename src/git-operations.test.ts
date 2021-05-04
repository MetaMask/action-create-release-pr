import execa from 'execa';
import { didPackageChange, initializeGit, getTags } from './git-operations';

// We don't actually use it, so it doesn't matter what it is.
process.env.GITHUB_WORKSPACE = 'root';

jest.mock('execa');
const execaMock: jest.Mock<any, any> = execa as any;

enum VERSIONS {
  A = '1.0.0',
  B = '1.0.1',
  C = '1.1.0',
}

enum TAGS {
  A = 'v1.0.0',
  B = 'v1.0.1',
  C = 'v1.1.0',
}

const PACKAGES: Readonly<Record<string, { name: string; dir: string }>> = {
  A: { name: 'fooName', dir: 'foo' },
  B: { name: 'barName', dir: 'bar' },
};

const RAW_MOCK_TAGS = `${Object.values(TAGS).join('\n')}\n`;

const RAW_DIFFS: Readonly<Record<TAGS, string>> = {
  [TAGS.A]: `packages/${PACKAGES.A.dir}/file.txt\npackages/${PACKAGES.B.dir}/file.txt\n`,
  [TAGS.B]: `packages/${PACKAGES.A.dir}/file.txt\n`,
  [TAGS.C]: `packages/${PACKAGES.B.dir}/file.txt\n`,
};

/**
 * ATTN: This test suite is order-dependent due to git tag results being cached
 * in the git-operations module.
 * The "initializeGit" tests must run before the "didPackageChange" tests.
 */

describe('initializeGit', () => {
  it('fetches the git tags', async () => {
    execaMock.mockImplementationOnce(async () => {
      return { stdout: RAW_MOCK_TAGS };
    });
    expect(await initializeGit()).toBeUndefined();
    expect(execaMock).toHaveBeenCalledTimes(1);
  });

  it('is idempotent', async () => {
    expect(await initializeGit()).toBeUndefined();
    expect(execaMock).toHaveBeenCalledTimes(0);
  });
});

describe('didPackageChange', () => {
  it('returns true if there are no tags', async () => {
    expect(
      await didPackageChange({} as any, 'foo', new Set() as never),
    ).toStrictEqual(true);
    expect(execaMock).not.toHaveBeenCalled();
  });

  it('calls "git diff" with expected tag', async () => {
    execaMock.mockImplementationOnce(async () => {
      return { stdout: RAW_DIFFS[TAGS.A] };
    });

    expect(
      await didPackageChange({
        name: PACKAGES.A.name,
        manifest: { name: PACKAGES.A.name, version: VERSIONS.A },
        dirName: PACKAGES.A.dir,
        dirPath: '', // just for interface compliance, not relevant
      }),
    ).toStrictEqual(true);
    expect(execaMock).toHaveBeenCalledTimes(1);
  });

  it('repeat call for tag retrieves result from cache', async () => {
    expect(
      await didPackageChange({
        name: PACKAGES.A.name,
        manifest: { name: PACKAGES.A.name, version: VERSIONS.A },
        dirName: PACKAGES.A.dir,
        dirPath: '', // just for interface compliance, not relevant
      }),
    ).toStrictEqual(true);
    expect(execaMock).not.toHaveBeenCalled();
  });

  it('retrieves cached diff on repeat call for tag', async () => {
    expect(
      await didPackageChange({
        name: PACKAGES.A.name,
        manifest: { name: PACKAGES.A.name, version: VERSIONS.A },
        dirName: PACKAGES.A.dir,
        dirPath: '', // just for interface compliance, not relevant
      }),
    ).toStrictEqual(true);
    expect(execaMock).not.toHaveBeenCalled();
  });

  it('throws if package manifest specifies version without tag', async () => {
    await expect(
      didPackageChange({
        name: PACKAGES.A.name,
        manifest: { name: PACKAGES.A.name, version: '2.0.0' },
        dirName: PACKAGES.A.dir,
        dirPath: '', // just for interface compliance, not relevant
      }),
    ).rejects.toThrow(/no corresponding tag/u);
    expect(execaMock).not.toHaveBeenCalled();
  });
});

describe('getTags', () => {
  it('succeeds if repo has complete history and no tags', async () => {
    execaMock
      .mockImplementationOnce(async () => {
        return { stdout: '' };
      })
      .mockImplementationOnce(async () => {
        return { stdout: 'false' };
      });

    expect(await getTags()).toStrictEqual([new Set(), null]);
    expect(execaMock).toHaveBeenCalledTimes(2);
  });

  it('throws if repo has incomplete history and no tags', async () => {
    execaMock
      .mockImplementationOnce(async () => {
        return { stdout: '' };
      })
      .mockImplementationOnce(async () => {
        return { stdout: 'true' };
      });

    await expect(getTags()).rejects.toThrow(/^"git tag" returned no tags/u);
    expect(execaMock).toHaveBeenCalledTimes(2);
  });

  it('throws if repo has invalid tags', async () => {
    execaMock.mockImplementationOnce(async () => {
      return { stdout: 'foo\nbar\n' };
    });

    await expect(getTags()).rejects.toThrow(/^Invalid latest tag/u);
    expect(execaMock).toHaveBeenCalledTimes(1);
  });

  it('throws if git rev-parse returns unrecognized value', async () => {
    execaMock
      .mockImplementationOnce(async () => {
        return { stdout: '' };
      })
      .mockImplementationOnce(async () => {
        return { stdout: 'foo' };
      });

    await expect(getTags()).rejects.toThrow(
      /^"git rev-parse --is-shallow-repository" returned unrecognized/u,
    );
    expect(execaMock).toHaveBeenCalledTimes(2);
  });
});
