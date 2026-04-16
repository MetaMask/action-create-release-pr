import type {
  ManifestDependencyFieldNames,
  PackageManifest,
} from '@metamask/action-utils';
import {
  getPackageManifest,
  getWorkspaceLocations,
  writeJsonFile,
  ManifestFieldNames,
} from '@metamask/action-utils';
import * as autoChangelog from '@metamask/auto-changelog';
import { promises as fs } from 'fs';
import cloneDeep from 'lodash.clonedeep';
import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
  type MockInstance,
} from 'vitest';

import * as gitOps from './git-operations.js';
import {
  formatChangelog,
  getMetadataForAllPackages,
  getPackagesToUpdate,
  updatePackage,
  updatePackages,
} from './package-operations.js';

vi.mock('fs', () => ({
  default: {},
  promises: {
    lstat: vi.fn(),
    readdir: vi.fn(),
    readFile: vi.fn(),
    writeFile: vi.fn(),
  },
}));

vi.mock(import('@metamask/action-utils'), async (importOriginal) => {
  const actualModule = await importOriginal();
  return {
    ...actualModule,
    getPackageManifest: vi.fn(),
    getWorkspaceLocations: vi.fn(),
    writeJsonFile: vi.fn(),
  };
});

vi.mock('@metamask/auto-changelog', () => {
  return {
    updateChangelog: vi.fn(),
    parseChangelog: vi.fn(),
  };
});

vi.mock(import('./git-operations.js'), async (importOriginal) => {
  const actualModule = await importOriginal();
  return {
    ...actualModule,
    didPackageChange: vi.fn(),
  };
});

vi.mock(import('./utils.js'), async (importOriginal) => {
  const actualModule = await importOriginal();
  return {
    ...actualModule,
    WORKSPACE_ROOT: 'root',
  };
});

const MOCK_PACKAGES_DIR = 'packages';

type DependencyFieldsDict = Partial<
  Record<ManifestDependencyFieldNames, Record<string, string>>
>;

const getMockManifest = (
  name: string,
  version: string,
  dependencyFields: DependencyFieldsDict = {},
): PackageManifest => {
  return { name, version, ...dependencyFields };
};

describe('package-operations', () => {
  describe('getMetadataForAllPackages', () => {
    const names = ['name1', 'name2', 'name3'];
    const dirs = ['dir1', 'dir2', 'dir3'];
    const version = '1.0.0';
    const SOME_FILE = 'someFile';

    const getMockPackageMetadata: (index: number) => {
      dirName: string;
      manifest: PackageManifest;
      name: string;
      dirPath: string;
    } = (index: number) => {
      return {
        dirName: dirs[index],
        manifest: getMockManifest(names[index], version),
        [ManifestFieldNames.Name]: names[index],
        dirPath: `${MOCK_PACKAGES_DIR}/${dirs[index]}`,
      };
    };

    beforeEach(() => {
      vi.spyOn(fs, 'lstat').mockImplementation((async (path: string) => {
        return path.endsWith(SOME_FILE)
          ? { isDirectory: (): boolean => false }
          : { isDirectory: (): boolean => true };
      }) as any);
    });

    it('does not throw', async () => {
      vi.mocked(getWorkspaceLocations).mockResolvedValueOnce([
        'packages/dir1',
        'packages/dir2',
        'packages/dir3',
        'packages/someFile',
      ]);

      vi.mocked(getPackageManifest)
        .mockResolvedValueOnce(getMockManifest(names[0], version) as any)
        .mockResolvedValueOnce(getMockManifest(names[1], version) as any)
        .mockResolvedValueOnce(getMockManifest(names[2], version) as any);

      expect(await getMetadataForAllPackages(['packages/*'])).toStrictEqual({
        [names[0]]: getMockPackageMetadata(0),
        [names[1]]: getMockPackageMetadata(1),
        [names[2]]: getMockPackageMetadata(2),
      });
    });

    it('resolves recursive workspaces', async () => {
      vi.mocked(getWorkspaceLocations)
        .mockResolvedValueOnce(['packages/dir1'])
        .mockResolvedValueOnce(['packages/dir2']);

      vi.mocked(getPackageManifest)
        .mockResolvedValueOnce({
          ...getMockManifest(names[0], version),
          private: true,
          workspaces: ['packages/*'],
        } as any)
        .mockResolvedValueOnce(getMockManifest(names[1], version) as any);

      expect(await getMetadataForAllPackages(['packages/*'])).toStrictEqual({
        [names[0]]: {
          ...getMockPackageMetadata(0),
          manifest: {
            ...getMockManifest(names[0], version),
            private: true,
            workspaces: ['packages/*'],
          },
        },
        [names[1]]: {
          ...getMockPackageMetadata(1),
          dirPath: 'packages/dir1/packages/dir2',
        },
      });
    });

    it('throws if a sub-workspace does not have a name', async () => {
      vi.mocked(getWorkspaceLocations).mockResolvedValueOnce(['packages/dir1']);

      vi.mocked(getPackageManifest).mockResolvedValueOnce({
        ...getMockManifest(names[0], version),
        private: true,
        workspaces: ['packages/*'],
        name: undefined,
      } as any);

      await expect(getMetadataForAllPackages(['packages/*'])).rejects.toThrow(
        'Expected sub-workspace in "packages/dir1" to have a name.',
      );
    });
  });

  describe('getPackagesToUpdate', () => {
    let didPackageChangeMock: MockInstance;

    const packageNames = ['name1', 'name2', 'name3'];

    const mockMetadataRecord = {
      [packageNames[0]]: {},
      [packageNames[1]]: {},
      [packageNames[2]]: {},
    };

    beforeEach(() => {
      didPackageChangeMock = vi.spyOn(gitOps, 'didPackageChange');
    });

    it('returns all packages if synchronizeVersions is true', async () => {
      expect(
        await getPackagesToUpdate(mockMetadataRecord as any, true, new Set()),
      ).toStrictEqual(new Set(packageNames));
      expect(didPackageChangeMock).not.toHaveBeenCalled();
    });

    it('returns changed packages if synchronizeVersions is false', async () => {
      didPackageChangeMock
        .mockImplementationOnce(async () => false)
        .mockImplementationOnce(async () => true)
        .mockImplementationOnce(async () => false);

      expect(
        await getPackagesToUpdate(mockMetadataRecord as any, false, new Set()),
      ).toStrictEqual(new Set([packageNames[1]]));
      expect(didPackageChangeMock).toHaveBeenCalledTimes(3);
    });

    it('throws an error if there are no packages to update', async () => {
      didPackageChangeMock.mockImplementation(async () => false);

      await expect(
        getPackagesToUpdate(mockMetadataRecord as any, false, new Set()),
      ).rejects.toThrow(/no packages to update/u);
      expect(didPackageChangeMock).toHaveBeenCalledTimes(3);
    });
  });

  describe('Updating packages', () => {
    const writeFileMock = vi
      .spyOn(fs, 'writeFile')
      .mockImplementation(async () => Promise.resolve());
    const readFileMock = vi.spyOn(fs, 'readFile');

    const updateChangelogMock = vi.spyOn(autoChangelog, 'updateChangelog');
    const parseChangelogMock = vi.spyOn(autoChangelog, 'parseChangelog');

    const getMockPackageMetadata = (
      dirPath: string,
      manifest: PackageManifest,
    ): { dirPath: string; manifest: PackageManifest } => {
      return {
        dirPath,
        manifest,
      };
    };

    const getMockWritePath = (dirPath: string, fileName: string): string =>
      `root/${dirPath}/${fileName}`;

    const mockDirs = ['dir1', 'dir2', 'dir3'];
    const packageNames = ['name1', 'name2', 'name3'];

    describe('updatePackage (singular)', () => {
      it('updates a package without dependencies', async () => {
        const originalVersion = '1.0.0';
        const newVersion = '1.0.1';
        const dir = mockDirs[0];
        const name = packageNames[0];
        const manifest = getMockManifest(name, originalVersion);

        const packageMetadata = getMockPackageMetadata(dir, manifest);
        const updateSpecification = {
          newVersion,
          packagesToUpdate: new Set(packageNames),
          repositoryUrl: '',
          shouldUpdateChangelog: false,
          synchronizeVersions: false,
        };

        await updatePackage(packageMetadata, updateSpecification);
        expect(writeJsonFile).toHaveBeenCalledTimes(1);
        expect(writeJsonFile).toHaveBeenCalledWith(
          getMockWritePath(dir, 'package.json'),
          {
            ...cloneDeep(manifest),
            [ManifestFieldNames.Version]: newVersion,
          },
        );
        expect(updateChangelogMock).not.toHaveBeenCalled();
      });

      it('updates a package and its changelog', async () => {
        const originalVersion = '1.0.0';
        const newVersion = '1.0.1';
        const dir = mockDirs[0];
        const name = packageNames[0];
        const manifest = getMockManifest(name, originalVersion);

        const repoUrl = 'https://fake';
        const changelogContent = 'I am a changelog.';
        readFileMock.mockImplementationOnce(async () => changelogContent);

        const mockNewChangelog = 'I am a new changelog.';
        updateChangelogMock.mockImplementation(async () => mockNewChangelog);

        const packageMetadata = getMockPackageMetadata(dir, manifest);
        const updateSpecification = {
          newVersion,
          packagesToUpdate: new Set(packageNames),
          repositoryUrl: repoUrl,
          shouldUpdateChangelog: true,
          synchronizeVersions: false,
        };

        await updatePackage(packageMetadata, updateSpecification);
        expect(writeJsonFile).toHaveBeenCalledTimes(1);
        expect(writeJsonFile).toHaveBeenNthCalledWith(
          1,
          getMockWritePath(dir, 'package.json'),
          {
            ...cloneDeep(manifest),
            [ManifestFieldNames.Version]: newVersion,
          },
        );
        expect(updateChangelogMock).toHaveBeenCalledTimes(1);
        expect(updateChangelogMock).toHaveBeenCalledWith({
          changelogContent,
          currentVersion: newVersion,
          isReleaseCandidate: true,
          projectRootDirectory: dir,
          autoCategorize: true,
          repoUrl,
          formatter: expect.any(Function),
        });

        expect(writeFileMock).toHaveBeenCalledOnce();
        expect(writeFileMock).toHaveBeenNthCalledWith(
          1,
          getMockWritePath(dir, 'CHANGELOG.md'),
          mockNewChangelog,
        );
        expect(parseChangelogMock).toHaveBeenCalledTimes(0);
      });

      it('re-throws changelog read error', async () => {
        const originalVersion = '1.0.0';
        const newVersion = '1.0.1';
        const dir = mockDirs[0];
        const name = packageNames[0];
        const manifest = getMockManifest(name, originalVersion);

        readFileMock.mockImplementationOnce(async () => {
          throw new Error('readError');
        });

        const packageMetadata = getMockPackageMetadata(dir, manifest);
        const updateSpecification = {
          newVersion,
          packagesToUpdate: new Set(packageNames),
          repositoryUrl: 'https://fake',
          shouldUpdateChangelog: true,
          synchronizeVersions: false,
        };

        const consoleErrorSpy = vi
          .spyOn(console, 'error')
          .mockImplementationOnce(() => undefined);

        await expect(
          updatePackage(packageMetadata, updateSpecification),
        ).rejects.toThrow(new Error('readError'));
        expect(updateChangelogMock).not.toHaveBeenCalled();
        expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          expect.stringMatching(/^Failed to read changelog/u),
        );
      });

      it('does not throw if the file cannot be found', async () => {
        const originalVersion = '1.0.0';
        const newVersion = '1.0.1';
        const dir = mockDirs[0];
        const name = packageNames[0];
        const manifest = getMockManifest(name, originalVersion);

        readFileMock.mockImplementationOnce(async () => {
          const error = new Error('readError');
          (error as any).code = 'ENOENT';

          throw error;
        });

        const packageMetadata = getMockPackageMetadata(dir, manifest);
        const updateSpecification = {
          newVersion,
          packagesToUpdate: new Set(packageNames),
          repositoryUrl: 'https://fake',
          shouldUpdateChangelog: true,
          synchronizeVersions: false,
        };

        const consoleWarnSpy = vi
          .spyOn(console, 'warn')
          .mockImplementationOnce(() => undefined);

        await updatePackage(packageMetadata, updateSpecification);

        expect(updateChangelogMock).not.toHaveBeenCalled();
        expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
        expect(consoleWarnSpy).toHaveBeenCalledWith(
          expect.stringMatching(/^Failed to read changelog/u),
        );
      });

      it('throws if updated changelog is empty', async () => {
        const originalVersion = '1.0.0';
        const newVersion = '1.0.1';
        const dir = mockDirs[0];
        const name = packageNames[0];
        const manifest = getMockManifest(name, originalVersion);

        const repoUrl = 'https://fake';
        const changelogContent = 'I am a changelog.';
        readFileMock.mockImplementationOnce(async () => changelogContent);

        // no new changelog content and no unreleased changes will cause an error
        updateChangelogMock.mockImplementation(async () => '');
        const actualChangelog = await vi.importActual<
          // eslint-disable-next-line @typescript-eslint/consistent-type-imports
          typeof import('@metamask/auto-changelog')
        >('@metamask/auto-changelog');

        // @ts-expect-error: Partial mock.
        parseChangelogMock.mockImplementationOnce(() => {
          return {
            ...actualChangelog,
            getUnreleasedChanges(): Record<string, never> {
              return {};
            },
          };
        });

        const packageMetadata = getMockPackageMetadata(dir, manifest);
        const updateSpecification = {
          newVersion,
          packagesToUpdate: new Set(packageNames),
          repositoryUrl: repoUrl,
          shouldUpdateChangelog: true,
          synchronizeVersions: false,
        };

        await expect(
          updatePackage(packageMetadata, updateSpecification),
        ).rejects.toThrow(
          '"updateChangelog" returned an empty value for package "name1".',
        );
        expect(writeJsonFile).toHaveBeenCalledTimes(1);
        expect(writeJsonFile).toHaveBeenNthCalledWith(
          1,
          getMockWritePath(dir, 'package.json'),
          {
            ...cloneDeep(manifest),
            [ManifestFieldNames.Version]: newVersion,
          },
        );
        expect(updateChangelogMock).toHaveBeenCalledTimes(1);
        expect(updateChangelogMock).toHaveBeenCalledWith({
          changelogContent,
          currentVersion: newVersion,
          isReleaseCandidate: true,
          projectRootDirectory: dir,
          autoCategorize: true,
          repoUrl,
          formatter: expect.any(Function),
        });
        expect(parseChangelogMock).toHaveBeenCalledTimes(1);
        expect(parseChangelogMock).toHaveBeenCalledWith({
          changelogContent,
          repoUrl,
          formatter: expect.any(Function),
        });
      });

      it('succeeds if updated changelog is empty, but there are unreleased changes', async () => {
        const originalVersion = '1.0.0';
        const newVersion = '1.0.1';
        const dir = mockDirs[0];
        const name = packageNames[0];
        const manifest = getMockManifest(name, originalVersion);

        const repoUrl = 'https://fake';
        const changelogContent = 'I am a changelog.';
        readFileMock.mockImplementationOnce(async () => changelogContent);

        updateChangelogMock.mockImplementation(async () => '');
        const actualChangelog = await vi.importActual<
          // eslint-disable-next-line @typescript-eslint/consistent-type-imports
          typeof import('@metamask/auto-changelog')
        >('@metamask/auto-changelog');

        // @ts-expect-error: Partial mock.
        parseChangelogMock.mockImplementationOnce(() => {
          return {
            ...actualChangelog,
            getUnreleasedChanges(): { Fixed: string[] } {
              return {
                Fixed: ['Something'],
              };
            },
          };
        });

        const packageMetadata = getMockPackageMetadata(dir, manifest);
        const updateSpecification = {
          newVersion,
          packagesToUpdate: new Set(packageNames),
          repositoryUrl: repoUrl,
          shouldUpdateChangelog: true,
          synchronizeVersions: false,
        };

        await updatePackage(packageMetadata, updateSpecification);
        expect(writeJsonFile).toHaveBeenNthCalledWith(
          1,
          getMockWritePath(dir, 'package.json'),
          {
            ...cloneDeep(manifest),
            [ManifestFieldNames.Version]: newVersion,
          },
        );
        expect(updateChangelogMock).toHaveBeenCalledTimes(1);
        expect(updateChangelogMock).toHaveBeenCalledWith({
          changelogContent,
          currentVersion: newVersion,
          isReleaseCandidate: true,
          projectRootDirectory: dir,
          autoCategorize: true,
          repoUrl,
          formatter: expect.any(Function),
        });
        expect(parseChangelogMock).toHaveBeenCalledTimes(1);
        expect(parseChangelogMock).toHaveBeenCalledWith({
          changelogContent,
          repoUrl,
          formatter: expect.any(Function),
        });
      });

      it('throws if updated changelog is empty, and handles missing package name', async () => {
        const originalVersion = '1.0.0';
        const newVersion = '1.0.1';
        const dir = mockDirs[0];
        const name = packageNames[0];
        const manifest = getMockManifest(name, originalVersion);
        delete (manifest as any).name;

        const repoUrl = 'https://fake';
        const changelogContent = 'I am a changelog.';
        readFileMock.mockImplementationOnce(async () => changelogContent);

        // no new changelog content and no unreleased changes will cause an error
        updateChangelogMock.mockImplementation(async () => '');
        const actualChangelog = await vi.importActual<
          // eslint-disable-next-line @typescript-eslint/consistent-type-imports
          typeof import('@metamask/auto-changelog')
        >('@metamask/auto-changelog');

        // @ts-expect-error: Partial mock.
        parseChangelogMock.mockImplementationOnce(() => {
          return {
            ...actualChangelog,
            getUnreleasedChanges(): Record<string, never> {
              return {};
            },
          };
        });

        const packageMetadata = getMockPackageMetadata(dir, manifest);
        const updateSpecification = {
          newVersion,
          packagesToUpdate: new Set(packageNames),
          repositoryUrl: repoUrl,
          shouldUpdateChangelog: true,
          synchronizeVersions: false,
        };

        await expect(
          updatePackage(packageMetadata, updateSpecification),
        ).rejects.toThrow(
          '"updateChangelog" returned an empty value for package at "root/dir1".',
        );
        expect(writeJsonFile).toHaveBeenCalledTimes(1);
        expect(writeJsonFile).toHaveBeenNthCalledWith(
          1,
          getMockWritePath(dir, 'package.json'),
          {
            ...cloneDeep(manifest),
            [ManifestFieldNames.Version]: newVersion,
          },
        );
        expect(updateChangelogMock).toHaveBeenCalledTimes(1);
        expect(updateChangelogMock).toHaveBeenCalledWith({
          changelogContent,
          currentVersion: newVersion,
          isReleaseCandidate: true,
          projectRootDirectory: dir,
          autoCategorize: true,
          repoUrl,
          formatter: expect.any(Function),
        });
        expect(parseChangelogMock).toHaveBeenCalledTimes(1);
        expect(parseChangelogMock).toHaveBeenCalledWith({
          changelogContent,
          repoUrl,
          formatter: expect.any(Function),
        });
      });

      it('updates a package without synchronizing dependency versions', async () => {
        const originalVersion = '1.0.0';
        const newVersion = '1.0.1';
        const dir = mockDirs[0];
        const name = packageNames[0];
        const manifest = getMockManifest(name, originalVersion, {
          dependencies: { foo: 'bar', [packageNames[1]]: originalVersion },
        });

        const packageMetadata = getMockPackageMetadata(dir, manifest);
        const updateSpecification = {
          newVersion,
          packagesToUpdate: new Set(packageNames),
          synchronizeVersions: false,
          repositoryUrl: '',
          shouldUpdateChangelog: false,
        };

        await updatePackage(packageMetadata, updateSpecification);
        expect(writeJsonFile).toHaveBeenCalledTimes(1);
        expect(writeJsonFile).toHaveBeenCalledWith(
          getMockWritePath(dir, 'package.json'),
          {
            ...cloneDeep(manifest),
            [ManifestFieldNames.Version]: newVersion,
          },
        );
        expect(updateChangelogMock).not.toHaveBeenCalled();
      });

      it('updates a package and synchronizes dependency versions', async () => {
        const originalVersion = '1.0.0';
        const newVersion = '1.0.1';
        const dir = mockDirs[0];
        const name = packageNames[0];

        const originalDependencies = {
          dependencies: {
            foo: 'bar',
            [packageNames[1]]: `^${originalVersion}`,
          },
          devDependencies: { [packageNames[2]]: `^${originalVersion}` },
        };
        const expectedDependencies = {
          dependencies: { foo: 'bar', [packageNames[1]]: `^${newVersion}` },
          devDependencies: { [packageNames[2]]: `^${newVersion}` },
        };

        const manifest = getMockManifest(
          name,
          originalVersion,
          originalDependencies,
        );

        const packageMetadata = getMockPackageMetadata(dir, manifest);
        const updateSpecification = {
          newVersion,
          packagesToUpdate: new Set(packageNames),
          synchronizeVersions: true,
          repositoryUrl: '',
          shouldUpdateChangelog: false,
        };

        await updatePackage(packageMetadata, updateSpecification);
        expect(writeJsonFile).toHaveBeenCalledTimes(1);
        expect(writeJsonFile).toHaveBeenCalledWith(
          getMockWritePath(dir, 'package.json'),
          getMockManifest(name, newVersion, expectedDependencies),
        );
        expect(updateChangelogMock).not.toHaveBeenCalled();
      });
    });

    // This method just calls updatePackage in a loop.
    describe('updatePackages (plural)', () => {
      it('updates multiple packages', async () => {
        const originalVersion = '1.0.0';
        const newVersion = '1.0.1';
        const dir1 = mockDirs[0];
        const dir2 = mockDirs[1];
        const name1 = packageNames[0];
        const name2 = packageNames[1];
        const manifest1 = getMockManifest(name1, originalVersion);
        const manifest2 = getMockManifest(name2, originalVersion);

        const packageMetadata1 = getMockPackageMetadata(dir1, manifest1);
        const packageMetadata2 = getMockPackageMetadata(dir2, manifest2);

        const allPackages = {
          [name1]: packageMetadata1,
          [name2]: packageMetadata2,
        };
        const updateSpecification = {
          newVersion,
          packagesToUpdate: new Set([name1, name2]),
          synchronizeVersions: false,
          repositoryUrl: '',
          shouldUpdateChangelog: false,
        };

        await updatePackages(allPackages, updateSpecification);
        expect(writeJsonFile).toHaveBeenCalledTimes(2);
        expect(writeJsonFile).toHaveBeenNthCalledWith(
          1,
          getMockWritePath(dir1, 'package.json'),
          {
            ...cloneDeep(manifest1),
            [ManifestFieldNames.Version]: newVersion,
          },
        );

        expect(writeJsonFile).toHaveBeenNthCalledWith(
          2,
          getMockWritePath(dir2, 'package.json'),
          {
            ...cloneDeep(manifest2),
            [ManifestFieldNames.Version]: newVersion,
          },
        );
      });
    });
  });

  describe('formatChangelog', () => {
    it('formats a changelog', async () => {
      const unformattedChangelog = `#  Changelog
##     1.0.0

 - Some change
## 0.0.1

- Some other change
`;

      expect(await formatChangelog(unformattedChangelog))
        .toMatchInlineSnapshot(`
        "# Changelog

        ## 1.0.0

        - Some change

        ## 0.0.1

        - Some other change
        "
      `);
    });
  });
});
