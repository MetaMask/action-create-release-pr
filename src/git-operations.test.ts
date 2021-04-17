import execa from 'execa';
import { didPackageChange } from './git-operations';

// We don't actually use it, so it doesn't matter what it is.
process.env.GITHUB_WORKSPACE = 'root';

jest.mock('execa');

/**
 * ATTN: These cases are order-dependent.
 *
 * The first call to didPackageChange performs some initialization work.
 * Calls for valid tags, computed from packageData.manifest.version, are cached,
 * and future calls for the same tag perform no git operations.
 */
describe('didPackageChange', () => {
  const execaMock: ReturnType<typeof jest.fn> = execa as any;

  const VERSIONS = {
    A: '1.0.0',
    B: '1.0.1',
    C: '1.1.0',
  };

  const TAGS = {
    A: 'v1.0.0',
    B: 'v1.0.1',
    C: 'v1.1.0',
  };

  const PACKAGES = {
    A: { name: 'fooName', dir: 'foo' },
    B: { name: 'barName', dir: 'bar' },
  };

  const RAW_MOCK_TAGS = `${Object.values(TAGS).join('\n')}\n`;

  const RAW_DIFFS = {
    [TAGS.A]: `packages/${PACKAGES.A.dir}/file.txt\npackages/${PACKAGES.B.dir}/file.txt\n`,
    [TAGS.B]: `packages/${PACKAGES.A.dir}/file.txt\n`,
    [TAGS.C]: `packages/${PACKAGES.B.dir}/file.txt\n`,
  };

  afterEach(() => {
    execaMock.mockClear();
  });

  it('first call, failure: Throws if repo has invalid tags', async () => {
    execaMock.mockImplementationOnce(() => {
      return { stdout: 'foo\nbar\n' };
    });

    await expect(
      didPackageChange({
        name: PACKAGES.A.name,
        manifest: { name: PACKAGES.A.name, version: VERSIONS.A },
        dirName: PACKAGES.A.dir,
        dirPath: '', // just for interface compliance, not relevant
      }),
    ).rejects.toThrow(/^Invalid latest tag/u);
    expect(execaMock).toHaveBeenCalledTimes(1);
  });

  it('first call, success: Calls "git tag" and "git diff" with expected tag', async () => {
    execaMock.mockImplementationOnce(() => {
      return { stdout: RAW_MOCK_TAGS };
    });
    execaMock.mockImplementationOnce(() => {
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
    expect(execaMock).toHaveBeenCalledTimes(2);
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
