/* eslint-disable import/first */
// This must be set before the import, so that the default root workspace is set
process.env.GITHUB_WORKSPACE = 'root';

import execa from 'execa';
import {
  didPackageChange,
  getRepositoryHttpsUrl,
  getTags,
} from './git-operations';

jest.mock('execa');
const execaMock: jest.Mock<any, any> = execa as any;

enum VERSIONS {
  First = '1.0.0',
  Second = '1.0.1',
  Third = '1.1.0',
}

enum TAGS {
  First = 'v1.0.0',
  Second = 'v1.0.1',
  Third = 'v1.1.0',
}

type MockPackage = Readonly<{ name: string; dir: string }>;

const PACKAGES: Readonly<Record<string, MockPackage>> = {
  A: { name: 'fooName', dir: 'foo' },
  B: { name: 'barName', dir: 'bar' },
};

const RAW_MOCK_TAGS = `${Object.values(TAGS).join('\n')}\n`;

const PARSED_MOCK_TAGS: ReadonlySet<string> = new Set(Object.values(TAGS));

const RAW_DIFFS: Readonly<Record<TAGS, string>> = {
  [TAGS.First]: `packages/${PACKAGES.A.dir}/file.txt\npackages/${PACKAGES.B.dir}/file.txt\n`,
  [TAGS.Second]: `packages/${PACKAGES.A.dir}/file.txt\n`,
  [TAGS.Third]: `packages/${PACKAGES.B.dir}/file.txt\n`,
};

describe('getRepositoryHttpsUrl', () => {
  it('gets the repository https url (already https)', async () => {
    const repoHttpsUrl = 'https://github.com/Foo/Bar';
    // execa('git', ['config', '--get', ...])
    execaMock.mockImplementationOnce(async () => {
      return { stdout: repoHttpsUrl };
    });

    expect(await getRepositoryHttpsUrl()).toStrictEqual(repoHttpsUrl);
    expect(execaMock).toHaveBeenCalledTimes(1);
  });

  it('gets the repository https url (ssh)', async () => {
    const repoHttpsUrl = 'https://github.com/Foo/Bar';
    const repoSshUrl = 'git@github.com:Foo/Bar.git';
    // execa('git', ['config', '--get', ...])
    execaMock.mockImplementationOnce(async () => {
      return { stdout: repoSshUrl };
    });

    expect(await getRepositoryHttpsUrl()).toStrictEqual(repoHttpsUrl);
    expect(execaMock).toHaveBeenCalledTimes(1);
  });

  it('throws on unrecognized urls', async () => {
    // execa('git', ['config', '--get', ...])
    execaMock
      .mockImplementationOnce(async () => {
        return { stdout: 'foo' };
      })
      .mockImplementationOnce(async () => {
        return { stdout: 'http://github.com/Foo/Bar' };
      })
      .mockImplementationOnce(async () => {
        return { stdout: 'https://gitbar.foo/Foo/Bar' };
      })
      .mockImplementationOnce(async () => {
        return { stdout: 'git@gitbar.foo:Foo/Bar.git' };
      })
      .mockImplementationOnce(async () => {
        return { stdout: 'git@github.com:Foo/Bar.foo' };
      });

    await expect(getRepositoryHttpsUrl()).rejects.toThrow(/^Unrecognized URL/u);
    await expect(getRepositoryHttpsUrl()).rejects.toThrow(/^Unrecognized URL/u);
    await expect(getRepositoryHttpsUrl()).rejects.toThrow(/^Unrecognized URL/u);
    await expect(getRepositoryHttpsUrl()).rejects.toThrow(/^Unrecognized URL/u);
    await expect(getRepositoryHttpsUrl()).rejects.toThrow(/^Unrecognized URL/u);
  });
});

describe('getTags', () => {
  it('successfully parses tags', async () => {
    // execa('git', ['tag', ...])
    execaMock.mockImplementationOnce(async () => {
      return { stdout: RAW_MOCK_TAGS };
    });

    expect(await getTags()).toStrictEqual([PARSED_MOCK_TAGS, TAGS.Third]);
    expect(execaMock).toHaveBeenCalledTimes(1);
  });

  it('succeeds if repo has complete history and no tags', async () => {
    execaMock.mockImplementation(async (...args) => {
      const gitCommand = args[1][0];
      if (gitCommand === 'tag') {
        return { stdout: '' };
      } else if (gitCommand === 'rev-parse') {
        return { stdout: 'false' };
      }
      throw new Error(`Unrecognized git command: ${gitCommand}`);
    });

    expect(await getTags()).toStrictEqual([new Set(), null]);
    expect(execaMock).toHaveBeenCalledTimes(2);
  });

  it('throws if repo has incomplete history and no tags', async () => {
    execaMock.mockImplementation(async (...args) => {
      const gitCommand = args[1][0];
      if (gitCommand === 'tag') {
        return { stdout: '' };
      } else if (gitCommand === 'rev-parse') {
        return { stdout: 'true' };
      }
      throw new Error(`Unrecognized git command: ${gitCommand}`);
    });

    await expect(getTags()).rejects.toThrow(/^"git tag" returned no tags/u);
    expect(execaMock).toHaveBeenCalledTimes(2);
  });

  it('throws if repo has invalid tags', async () => {
    // execa('git', ['tag', ...])
    execaMock.mockImplementationOnce(async () => {
      return { stdout: 'foo\nbar\n' };
    });

    await expect(getTags()).rejects.toThrow(/^Invalid latest tag/u);
    expect(execaMock).toHaveBeenCalledTimes(1);
  });

  it('throws if git rev-parse returns unrecognized value', async () => {
    execaMock.mockImplementation(async (...args) => {
      const gitCommand = args[1][0];
      if (gitCommand === 'tag') {
        return { stdout: '' };
      } else if (gitCommand === 'rev-parse') {
        return { stdout: 'foo' };
      }
      throw new Error(`Unrecognized git command: ${gitCommand}`);
    });

    await expect(getTags()).rejects.toThrow(
      /^"git rev-parse --is-shallow-repository" returned unrecognized/u,
    );
    expect(execaMock).toHaveBeenCalledTimes(2);
  });
});

describe('didPackageChange', () => {
  it('returns true if there are no tags', async () => {
    expect(await didPackageChange(new Set(), {} as any)).toStrictEqual(true);
    expect(execaMock).not.toHaveBeenCalled();
  });

  it('calls "git diff" with expected tag', async () => {
    execaMock.mockImplementationOnce(async () => {
      return { stdout: RAW_DIFFS[TAGS.First] };
    });

    expect(
      await didPackageChange(PARSED_MOCK_TAGS, {
        name: PACKAGES.A.name,
        manifest: { name: PACKAGES.A.name, version: VERSIONS.First },
        dirName: PACKAGES.A.dir,
        dirPath: `packages/${PACKAGES.A.dir}`,
      }),
    ).toStrictEqual(true);

    expect(
      await didPackageChange(PARSED_MOCK_TAGS, {
        name: PACKAGES.B.name,
        manifest: { name: PACKAGES.B.name, version: VERSIONS.First },
        dirName: PACKAGES.B.dir,
        dirPath: `packages/${PACKAGES.B.dir}`,
      }),
    ).toStrictEqual(true);
    expect(execaMock).toHaveBeenCalledTimes(1);
  });

  it('repeat call for tag retrieves result from cache', async () => {
    expect(
      await didPackageChange(PARSED_MOCK_TAGS, {
        name: PACKAGES.A.name,
        manifest: { name: PACKAGES.A.name, version: VERSIONS.First },
        dirName: PACKAGES.A.dir,
        dirPath: `packages/${PACKAGES.A.dir}`,
      }),
    ).toStrictEqual(true);
    expect(execaMock).not.toHaveBeenCalled();
  });

  it('only returns true for packages that actually changed', async () => {
    execaMock.mockImplementationOnce(async () => {
      return { stdout: RAW_DIFFS[TAGS.Second] };
    });

    expect(
      await didPackageChange(PARSED_MOCK_TAGS, {
        name: PACKAGES.A.name,
        manifest: { name: PACKAGES.A.name, version: VERSIONS.Second },
        dirName: PACKAGES.A.dir,
        dirPath: `packages/${PACKAGES.A.dir}`,
      }),
    ).toStrictEqual(true);

    expect(
      await didPackageChange(PARSED_MOCK_TAGS, {
        name: PACKAGES.B.name,
        manifest: { name: PACKAGES.B.name, version: VERSIONS.Second },
        dirName: PACKAGES.B.dir,
        dirPath: `packages/${PACKAGES.B.dir}`,
      }),
    ).toStrictEqual(false);
    expect(execaMock).toHaveBeenCalledTimes(1);
  });

  it('throws if package manifest specifies version without tag', async () => {
    await expect(
      didPackageChange(PARSED_MOCK_TAGS, {
        name: PACKAGES.A.name,
        manifest: { name: PACKAGES.A.name, version: '2.0.0' },
        dirName: PACKAGES.A.dir,
        dirPath: `packages/${PACKAGES.A.dir}`,
      }),
    ).rejects.toThrow(/no corresponding tag/u);
    expect(execaMock).not.toHaveBeenCalled();
  });
});
