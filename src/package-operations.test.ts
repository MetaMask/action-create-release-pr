import fs from 'fs';
import cloneDeep from 'lodash.clonedeep';
import * as actionUtils from '@ethjs-staging/action-utils';
import {
  ManifestDependencyFieldNames,
  ManifestFieldNames,
} from '@ethjs-staging/action-utils';
import * as autoChangelog from '@metamask/auto-changelog';
import glob from 'glob';
import * as gitOps from './git-operations';
import {
  getMetadataForAllPackages,
  getPackagesToUpdate,
  updatePackage,
  updatePackages,
} from './package-operations';

jest.mock('fs', () => ({
  promises: {
    lstat: jest.fn(),
    readdir: jest.fn(),
    readFile: jest.fn(),
    writeFile: jest.fn(),
  },
}));

jest.mock('glob');

jest.mock('@ethjs-staging/action-utils/dist/file-utils', () => {
  const actualModule = jest.requireActual(
    '@ethjs-staging/action-utils/dist/file-utils',
  );
  return {
    ...actualModule,
    readJsonObjectFile: jest.fn(),
  };
});

jest.mock('@metamask/auto-changelog', () => {
  return {
    updateChangelog: jest.fn(),
  };
});

jest.mock('./git-operations', () => {
  const actualModule = jest.requireActual('./git-operations');
  return {
    ...actualModule,
    didPackageChange: jest.fn(),
  };
});

jest.mock('./utils', () => {
  const actualModule = jest.requireActual('./utils');
  return {
    ...actualModule,
    WORKSPACE_ROOT: 'root',
  };
});

const MOCK_PACKAGES_DIR = 'packages';

type DependencyFieldsDict = Partial<
  Record<ManifestDependencyFieldNames, Record<string, string>>
>;

// Convenience method to match behavior of utils.writeJsonFile
const jsonStringify = (value: unknown) => `${JSON.stringify(value, null, 2)}\n`;

const getMockManifest = (
  name: string,
  version: string,
  dependencyFields: DependencyFieldsDict = {},
) => {
  return { name, version, ...dependencyFields };
};

describe('package-operations', () => {
  describe('getMetadataForAllPackages', () => {
    const names = ['name1', 'name2', 'name3'];
    const dirs = ['dir1', 'dir2', 'dir3'];
    const version = '1.0.0';
    const SOME_FILE = 'someFile';

    const getMockPackageMetadata = (index: number) => {
      return {
        dirName: dirs[index],
        manifest: getMockManifest(names[index], version),
        [ManifestFieldNames.Name]: names[index],
        dirPath: `${MOCK_PACKAGES_DIR}/${dirs[index]}`,
      };
    };

    /**
     * Returns a mock implementation for `readJsonObjectFile` which is used to
     * obtain a mock manifest for a package used within the tests in this test
     * group.
     *
     * @returns A function that returns a mock manifest.
     */
    function getMockReadJsonFile() {
      let mockIndex = -1;
      return async () => {
        mockIndex += 1;
        return getMockManifest(names[mockIndex], version);
      };
    }

    beforeEach(() => {
      jest.spyOn(fs.promises, 'lstat').mockImplementation((async (
        path: string,
      ) => {
        return path.endsWith(SOME_FILE)
          ? { isDirectory: () => false }
          : { isDirectory: () => true };
      }) as any);
    });

    it('does not throw', async () => {
      (glob as jest.MockedFunction<any>).mockImplementation(
        (
          _pattern: string,
          _options: unknown,
          callback: (error: null, data: string[]) => void,
        ) =>
          callback(null, [
            'packages/dir1',
            'packages/dir2',
            'packages/dir3',
            'packages/someFile',
          ]),
      );

      jest
        .spyOn(actionUtils, 'readJsonObjectFile')
        .mockImplementation(getMockReadJsonFile());

      expect(await getMetadataForAllPackages(['packages/*'])).toStrictEqual({
        [names[0]]: getMockPackageMetadata(0),
        [names[1]]: getMockPackageMetadata(1),
        [names[2]]: getMockPackageMetadata(2),
      });
    });

    it('resolves recursive workspaces', async () => {
      (glob as jest.MockedFunction<any>)
        .mockImplementationOnce(
          (
            _pattern: string,
            _options: unknown,
            callback: (error: null, data: string[]) => void,
          ) => callback(null, ['packages/dir1']),
        )
        .mockImplementationOnce(
          (
            _pattern: string,
            _options: unknown,
            callback: (error: null, data: string[]) => void,
          ) => callback(null, ['packages/dir2']),
        );

      jest
        .spyOn(actionUtils, 'readJsonObjectFile')
        .mockImplementationOnce(async () => ({
          ...getMockManifest(names[0], version),
          private: true,
          workspaces: ['packages/*'],
        }))
        .mockImplementationOnce(async () => getMockManifest(names[1], version));

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
      (glob as jest.MockedFunction<any>).mockImplementationOnce(
        (
          _pattern: string,
          _options: unknown,
          callback: (error: null, data: string[]) => void,
        ) => callback(null, ['packages/dir1']),
      );

      jest
        .spyOn(actionUtils, 'readJsonObjectFile')
        .mockImplementationOnce(async () => ({
          ...getMockManifest(names[0], version),
          private: true,
          workspaces: ['packages/*'],
          name: undefined,
        }));

      await expect(getMetadataForAllPackages(['packages/*'])).rejects.toThrow(
        'Expected sub-workspace in "packages/dir1" to have a name.',
      );
    });
  });

  describe('getPackagesToUpdate', () => {
    let didPackageChangeMock: jest.SpyInstance;

    const packageNames = ['name1', 'name2', 'name3'];

    const mockMetadataRecord = {
      [packageNames[0]]: {},
      [packageNames[1]]: {},
      [packageNames[2]]: {},
    };

    beforeEach(() => {
      didPackageChangeMock = jest.spyOn(gitOps, 'didPackageChange');
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
    const writeFileMock = jest
      .spyOn(fs.promises, 'writeFile')
      .mockImplementation(() => Promise.resolve());
    const readFileMock = jest.spyOn(fs.promises, 'readFile');

    const updateChangelogMock = jest.spyOn(autoChangelog, 'updateChangelog');

    const getMockPackageMetadata = (
      dirPath: string,
      manifest: ReturnType<typeof getMockManifest>,
    ) => {
      return {
        dirPath,
        manifest,
      };
    };

    const getMockWritePath = (dirPath: string, fileName: string) =>
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
        expect(writeFileMock).toHaveBeenCalledTimes(1);
        expect(writeFileMock).toHaveBeenCalledWith(
          getMockWritePath(dir, 'package.json'),
          jsonStringify({
            ...cloneDeep(manifest),
            [ManifestFieldNames.Version]: newVersion,
          }),
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
        expect(writeFileMock).toHaveBeenCalledTimes(2);
        expect(writeFileMock).toHaveBeenNthCalledWith(
          1,
          getMockWritePath(dir, 'package.json'),
          jsonStringify({
            ...cloneDeep(manifest),
            [ManifestFieldNames.Version]: newVersion,
          }),
        );
        expect(updateChangelogMock).toHaveBeenCalledTimes(1);
        expect(updateChangelogMock).toHaveBeenCalledWith({
          changelogContent,
          currentVersion: newVersion,
          isReleaseCandidate: true,
          projectRootDirectory: dir,
          repoUrl,
        });

        expect(writeFileMock).toHaveBeenNthCalledWith(
          2,
          getMockWritePath(dir, 'CHANGELOG.md'),
          mockNewChangelog,
        );
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

        const consoleErrorSpy = jest
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

        const consoleWarnSpy = jest
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

        // This will cause an error
        updateChangelogMock.mockImplementation(async () => '');

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
        expect(writeFileMock).toHaveBeenCalledTimes(1);
        expect(writeFileMock).toHaveBeenNthCalledWith(
          1,
          getMockWritePath(dir, 'package.json'),
          jsonStringify({
            ...cloneDeep(manifest),
            [ManifestFieldNames.Version]: newVersion,
          }),
        );
        expect(updateChangelogMock).toHaveBeenCalledTimes(1);
        expect(updateChangelogMock).toHaveBeenCalledWith({
          changelogContent,
          currentVersion: newVersion,
          isReleaseCandidate: true,
          projectRootDirectory: dir,
          repoUrl,
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

        // This will cause an error
        updateChangelogMock.mockImplementation(async () => '');

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
        expect(writeFileMock).toHaveBeenCalledTimes(1);
        expect(writeFileMock).toHaveBeenNthCalledWith(
          1,
          getMockWritePath(dir, 'package.json'),
          jsonStringify({
            ...cloneDeep(manifest),
            [ManifestFieldNames.Version]: newVersion,
          }),
        );
        expect(updateChangelogMock).toHaveBeenCalledTimes(1);
        expect(updateChangelogMock).toHaveBeenCalledWith({
          changelogContent,
          currentVersion: newVersion,
          isReleaseCandidate: true,
          projectRootDirectory: dir,
          repoUrl,
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
        expect(writeFileMock).toHaveBeenCalledTimes(1);
        expect(writeFileMock).toHaveBeenCalledWith(
          getMockWritePath(dir, 'package.json'),
          jsonStringify({
            ...cloneDeep(manifest),
            [ManifestFieldNames.Version]: newVersion,
          }),
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
        expect(writeFileMock).toHaveBeenCalledTimes(1);
        expect(writeFileMock).toHaveBeenCalledWith(
          getMockWritePath(dir, 'package.json'),
          jsonStringify(
            getMockManifest(name, newVersion, expectedDependencies),
          ),
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
        expect(writeFileMock).toHaveBeenCalledTimes(2);
        expect(writeFileMock).toHaveBeenNthCalledWith(
          1,
          getMockWritePath(dir1, 'package.json'),
          jsonStringify({
            ...cloneDeep(manifest1),
            [ManifestFieldNames.Version]: newVersion,
          }),
        );

        expect(writeFileMock).toHaveBeenNthCalledWith(
          2,
          getMockWritePath(dir2, 'package.json'),
          jsonStringify({
            ...cloneDeep(manifest2),
            [ManifestFieldNames.Version]: newVersion,
          }),
        );
      });
    });
  });
});
