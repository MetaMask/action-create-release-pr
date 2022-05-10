import fs from 'fs';
import cloneDeep from 'lodash.clonedeep';
import * as actionUtils from '@metamask/action-utils/dist/file-utils';
import {
  ManifestDependencyFieldNames,
  ManifestFieldNames,
} from '@metamask/action-utils';
import * as autoChangelog from '@metamask/auto-changelog';
import { DepGraph } from 'dependency-graph';
import * as gitOps from './git-operations';
import * as graphUtils from './graph-utils';
import {
  getMetadataForAllPackages,
  getCompletePackageMetadata,
  shouldUpdateMonorepoPackage,
  updateMonorepoPackages,
  updatePackageChangelog,
  updateRepoRootManifest,
} from './package-operations';
import { VersionSynchronizationStrategies } from './utils';

jest.mock('fs', () => ({
  promises: {
    lstat: jest.fn(),
    readdir: jest.fn(),
    readFile: jest.fn(),
    writeFile: jest.fn(),
  },
}));

jest.mock('glob', () => {
  return (
    _pattern: string,
    _options: Record<string, unknown>,
    callback: (error: Error | null, results: string[]) => unknown,
  ) => {
    callback(null, [
      'packages/dir1',
      'packages/dir2',
      'packages/dir3',
      'packages/dir4',
      'packages/dir5',
      'packages/someFile',
    ]);
  };
});

jest.mock('@metamask/action-utils/dist/file-utils', () => {
  const actualModule = jest.requireActual(
    '@metamask/action-utils/dist/file-utils',
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

jest.mock('./utils', () => {
  const actualModule = jest.requireActual('./utils');
  return {
    ...actualModule,
    WORKSPACE_ROOT: 'root',
  };
});

const MOCK_PACKAGES_DIR = 'packages';

// This is just needed for type checks.
const MOCK_TAGS: any = Object.freeze({});

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

const version = '1.0.0';
const names = Object.freeze(['name1', 'name2', 'name3', 'name4', 'name5']);
const dirs = Object.freeze(['dir1', 'dir2', 'dir3', 'dir4', 'dir5']);

const getMockPackageMetadata = (index: number, shouldUpdate: boolean) => {
  return {
    dirName: dirs[index],
    manifest: getMockManifest(names[index], version),
    [ManifestFieldNames.Name]: names[index],
    dirPath: `${MOCK_PACKAGES_DIR}/${dirs[index]}`,
    shouldUpdate,
  };
};

// console.log([names[1], getMockPackageMetadata(1, true)]);

describe('package-operations', () => {
  describe('getMetadataForAllPackages', () => {
    let didPackageChangeMock: jest.SpyInstance;

    const didChange = Object.freeze([true, false, true, true, false]);
    const SOME_FILE = 'someFile';

    const getDependencyGraphMock = (cycle = true) => () => {
      const graph = new DepGraph<string>({ circular: true });
      names.forEach((name) => graph.addNode(name));
      graph.addDependency('name1', 'name2');
      graph.addDependency('name2', 'name4');
      cycle && graph.addDependency('name4', 'name1');

      // 1 -> 2 -> 4 -> 1
      return graph;
    };

    function getMockReadJsonFile() {
      let mockIndex = -1;
      return async () => {
        mockIndex += 1;
        return getMockManifest(names[mockIndex], version);
      };
    }

    beforeEach(() => {
      didPackageChangeMock = jest.spyOn(gitOps, 'didPackageChange');
      didChange.forEach((value) => {
        didPackageChangeMock.mockReturnValueOnce(Promise.resolve(value));
      });

      jest
        .spyOn(graphUtils, 'getMonorepoDependencyGraph')
        .mockImplementation(getDependencyGraphMock());

      jest.spyOn(fs.promises, 'lstat').mockImplementation((async (
        path: string,
      ) => {
        return path.endsWith(SOME_FILE)
          ? { isDirectory: () => false }
          : { isDirectory: () => true };
      }) as any);

      jest
        .spyOn(actionUtils, 'readJsonObjectFile')
        .mockImplementation(getMockReadJsonFile());
    });

    it('does not throw', async () => {
      const strategy = VersionSynchronizationStrategies.transitive;

      const [allMetadata, changedPackages] = await getMetadataForAllPackages(
        ['packages/*'],
        MOCK_TAGS,
        strategy,
      );

      expect(changedPackages).toStrictEqual(
        new Set(['name1', 'name3', 'name4']),
      );

      expect(allMetadata).toStrictEqual(
        new Map([
          [names[0], getMockPackageMetadata(0, true)],
          [names[1], getMockPackageMetadata(1, true)],
          [names[2], getMockPackageMetadata(2, true)],
          [names[3], getMockPackageMetadata(3, true)],
          [names[4], getMockPackageMetadata(4, false)],
        ]),
      );

      // for (const metadata of allMetadata.values()) {
      //   expect(metadata.shouldUpdate).toBe(true);
      // }
    });
  });

  // describe('getPackagesToUpdate', () => {
  //   beforeEach(() => {
  //     didPackageChangeMock = jest.spyOn(gitOps, 'didPackageChange');
  //   });

  //   it('returns all packages if synchronizeVersions is true', async () => {
  //     expect(
  //       await getPackagesToUpdate(mockMetadataRecord as any, true, new Set()),
  //     ).toStrictEqual(new Set(packageNames));
  //     expect(didPackageChangeMock).not.toHaveBeenCalled();
  //   });
  // });

  // describe('Updating packages', () => {
  //   const writeFileMock = jest
  //     .spyOn(fs.promises, 'writeFile')
  //     .mockImplementation(() => Promise.resolve());
  //   const readFileMock = jest.spyOn(fs.promises, 'readFile');

  //   const updateChangelogMock = jest.spyOn(autoChangelog, 'updateChangelog');

  //   const getMockPackageMetadata = (
  //     dirPath: string,
  //     manifest: ReturnType<typeof getMockManifest>,
  //   ) => {
  //     return {
  //       dirPath,
  //       manifest,
  //     };
  //   };

  //   const getMockWritePath = (dirPath: string, fileName: string) =>
  //     `root/${dirPath}/${fileName}`;

  //   const mockDirs = ['dir1', 'dir2', 'dir3'];
  //   const packageNames = ['name1', 'name2', 'name3'];

  //   describe('updatePackage (singular)', () => {
  //     it('updates a package without dependencies', async () => {
  //       const originalVersion = '1.0.0';
  //       const newVersion = '1.0.1';
  //       const dir = mockDirs[0];
  //       const name = packageNames[0];
  //       const manifest = getMockManifest(name, originalVersion);

  //       const packageMetadata = getMockPackageMetadata(dir, manifest);
  //       const updateSpecification = {
  //         newVersion,
  //         packagesToUpdate: new Set(packageNames),
  //         repositoryUrl: '',
  //         shouldUpdateChangelog: false,
  //         synchronizeVersions: false,
  //       };

  //       await updatePackage(packageMetadata, updateSpecification);
  //       expect(writeFileMock).toHaveBeenCalledTimes(1);
  //       expect(writeFileMock).toHaveBeenCalledWith(
  //         getMockWritePath(dir, 'package.json'),
  //         jsonStringify({
  //           ...cloneDeep(manifest),
  //           [ManifestFieldNames.Version]: newVersion,
  //         }),
  //       );
  //       expect(updateChangelogMock).not.toHaveBeenCalled();
  //     });

  //     it('updates a package and its changelog', async () => {
  //       const originalVersion = '1.0.0';
  //       const newVersion = '1.0.1';
  //       const dir = mockDirs[0];
  //       const name = packageNames[0];
  //       const manifest = getMockManifest(name, originalVersion);

  //       const repoUrl = 'https://fake';
  //       const changelogContent = 'I am a changelog.';
  //       readFileMock.mockImplementationOnce(async () => changelogContent);

  //       const mockNewChangelog = 'I am a new changelog.';
  //       updateChangelogMock.mockImplementation(async () => mockNewChangelog);

  //       const packageMetadata = getMockPackageMetadata(dir, manifest);
  //       const updateSpecification = {
  //         newVersion,
  //         packagesToUpdate: new Set(packageNames),
  //         repositoryUrl: repoUrl,
  //         shouldUpdateChangelog: true,
  //         synchronizeVersions: false,
  //       };

  //       await updatePackage(packageMetadata, updateSpecification);
  //       expect(writeFileMock).toHaveBeenCalledTimes(2);
  //       expect(writeFileMock).toHaveBeenNthCalledWith(
  //         1,
  //         getMockWritePath(dir, 'package.json'),
  //         jsonStringify({
  //           ...cloneDeep(manifest),
  //           [ManifestFieldNames.Version]: newVersion,
  //         }),
  //       );
  //       expect(updateChangelogMock).toHaveBeenCalledTimes(1);
  //       expect(updateChangelogMock).toHaveBeenCalledWith({
  //         changelogContent,
  //         currentVersion: newVersion,
  //         isReleaseCandidate: true,
  //         projectRootDirectory: dir,
  //         repoUrl,
  //       });
  //       expect(writeFileMock).toHaveBeenNthCalledWith(
  //         2,
  //         getMockWritePath(dir, 'CHANGELOG.md'),
  //         mockNewChangelog,
  //       );
  //     });

  //     it('re-throws changelog read error', async () => {
  //       const originalVersion = '1.0.0';
  //       const newVersion = '1.0.1';
  //       const dir = mockDirs[0];
  //       const name = packageNames[0];
  //       const manifest = getMockManifest(name, originalVersion);

  //       readFileMock.mockImplementationOnce(async () => {
  //         throw new Error('readError');
  //       });

  //       const packageMetadata = getMockPackageMetadata(dir, manifest);
  //       const updateSpecification = {
  //         newVersion,
  //         packagesToUpdate: new Set(packageNames),
  //         repositoryUrl: 'https://fake',
  //         shouldUpdateChangelog: true,
  //         synchronizeVersions: false,
  //       };

  //       const consoleErrorSpy = jest
  //         .spyOn(console, 'error')
  //         .mockImplementationOnce(() => undefined);

  //       await expect(
  //         updatePackage(packageMetadata, updateSpecification),
  //       ).rejects.toThrow(new Error('readError'));
  //       expect(updateChangelogMock).not.toHaveBeenCalled();
  //       expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
  //       expect(consoleErrorSpy).toHaveBeenCalledWith(
  //         expect.stringMatching(/^Failed to read changelog/u),
  //       );
  //     });

  //     it('throws if updated changelog is empty', async () => {
  //       const originalVersion = '1.0.0';
  //       const newVersion = '1.0.1';
  //       const dir = mockDirs[0];
  //       const name = packageNames[0];
  //       const manifest = getMockManifest(name, originalVersion);

  //       const repoUrl = 'https://fake';
  //       const changelogContent = 'I am a changelog.';
  //       readFileMock.mockImplementationOnce(async () => changelogContent);

  //       // This will cause an error
  //       updateChangelogMock.mockImplementation(async () => '');

  //       const packageMetadata = getMockPackageMetadata(dir, manifest);
  //       const updateSpecification = {
  //         newVersion,
  //         packagesToUpdate: new Set(packageNames),
  //         repositoryUrl: repoUrl,
  //         shouldUpdateChangelog: true,
  //         synchronizeVersions: false,
  //       };

  //       await expect(
  //         updatePackage(packageMetadata, updateSpecification),
  //       ).rejects.toThrow(
  //         '"updateChangelog" returned an empty value for package "name1".',
  //       );
  //       expect(writeFileMock).toHaveBeenCalledTimes(1);
  //       expect(writeFileMock).toHaveBeenNthCalledWith(
  //         1,
  //         getMockWritePath(dir, 'package.json'),
  //         jsonStringify({
  //           ...cloneDeep(manifest),
  //           [ManifestFieldNames.Version]: newVersion,
  //         }),
  //       );
  //       expect(updateChangelogMock).toHaveBeenCalledTimes(1);
  //       expect(updateChangelogMock).toHaveBeenCalledWith({
  //         changelogContent,
  //         currentVersion: newVersion,
  //         isReleaseCandidate: true,
  //         projectRootDirectory: dir,
  //         repoUrl,
  //       });
  //     });

  //     it('throws if updated changelog is empty, and handles missing package name', async () => {
  //       const originalVersion = '1.0.0';
  //       const newVersion = '1.0.1';
  //       const dir = mockDirs[0];
  //       const name = packageNames[0];
  //       const manifest = getMockManifest(name, originalVersion);
  //       delete (manifest as any).name;

  //       const repoUrl = 'https://fake';
  //       const changelogContent = 'I am a changelog.';
  //       readFileMock.mockImplementationOnce(async () => changelogContent);

  //       // This will cause an error
  //       updateChangelogMock.mockImplementation(async () => '');

  //       const packageMetadata = getMockPackageMetadata(dir, manifest);
  //       const updateSpecification = {
  //         newVersion,
  //         packagesToUpdate: new Set(packageNames),
  //         repositoryUrl: repoUrl,
  //         shouldUpdateChangelog: true,
  //         synchronizeVersions: false,
  //       };

  //       await expect(
  //         updatePackage(packageMetadata, updateSpecification),
  //       ).rejects.toThrow(
  //         '"updateChangelog" returned an empty value for package at "root/dir1".',
  //       );
  //       expect(writeFileMock).toHaveBeenCalledTimes(1);
  //       expect(writeFileMock).toHaveBeenNthCalledWith(
  //         1,
  //         getMockWritePath(dir, 'package.json'),
  //         jsonStringify({
  //           ...cloneDeep(manifest),
  //           [ManifestFieldNames.Version]: newVersion,
  //         }),
  //       );
  //       expect(updateChangelogMock).toHaveBeenCalledTimes(1);
  //       expect(updateChangelogMock).toHaveBeenCalledWith({
  //         changelogContent,
  //         currentVersion: newVersion,
  //         isReleaseCandidate: true,
  //         projectRootDirectory: dir,
  //         repoUrl,
  //       });
  //     });

  //     it('updates a package without synchronizing dependency versions', async () => {
  //       const originalVersion = '1.0.0';
  //       const newVersion = '1.0.1';
  //       const dir = mockDirs[0];
  //       const name = packageNames[0];
  //       const manifest = getMockManifest(name, originalVersion, {
  //         dependencies: { foo: 'bar', [packageNames[1]]: originalVersion },
  //       });

  //       const packageMetadata = getMockPackageMetadata(dir, manifest);
  //       const updateSpecification = {
  //         newVersion,
  //         packagesToUpdate: new Set(packageNames),
  //         synchronizeVersions: false,
  //         repositoryUrl: '',
  //         shouldUpdateChangelog: false,
  //       };

  //       await updatePackage(packageMetadata, updateSpecification);
  //       expect(writeFileMock).toHaveBeenCalledTimes(1);
  //       expect(writeFileMock).toHaveBeenCalledWith(
  //         getMockWritePath(dir, 'package.json'),
  //         jsonStringify({
  //           ...cloneDeep(manifest),
  //           [ManifestFieldNames.Version]: newVersion,
  //         }),
  //       );
  //       expect(updateChangelogMock).not.toHaveBeenCalled();
  //     });

  //     it('updates a package and synchronizes dependency versions', async () => {
  //       const originalVersion = '1.0.0';
  //       const newVersion = '1.0.1';
  //       const dir = mockDirs[0];
  //       const name = packageNames[0];

  //       const originalDependencies = {
  //         dependencies: {
  //           foo: 'bar',
  //           [packageNames[1]]: `^${originalVersion}`,
  //         },
  //         devDependencies: { [packageNames[2]]: `^${originalVersion}` },
  //       };
  //       const expectedDependencies = {
  //         dependencies: { foo: 'bar', [packageNames[1]]: `^${newVersion}` },
  //         devDependencies: { [packageNames[2]]: `^${newVersion}` },
  //       };

  //       const manifest = getMockManifest(
  //         name,
  //         originalVersion,
  //         originalDependencies,
  //       );

  //       const packageMetadata = getMockPackageMetadata(dir, manifest);
  //       const updateSpecification = {
  //         newVersion,
  //         packagesToUpdate: new Set(packageNames),
  //         synchronizeVersions: true,
  //         repositoryUrl: '',
  //         shouldUpdateChangelog: false,
  //       };

  //       await updatePackage(packageMetadata, updateSpecification);
  //       expect(writeFileMock).toHaveBeenCalledTimes(1);
  //       expect(writeFileMock).toHaveBeenCalledWith(
  //         getMockWritePath(dir, 'package.json'),
  //         jsonStringify(
  //           getMockManifest(name, newVersion, expectedDependencies),
  //         ),
  //       );
  //       expect(updateChangelogMock).not.toHaveBeenCalled();
  //     });
  //   });

  //   describe('updateMonorepoPackages', () => {
  //     it('updates multiple packages', async () => {
  //       const originalVersion = '1.0.0';
  //       const newVersion = '1.0.1';
  //       const dir1 = mockDirs[0];
  //       const dir2 = mockDirs[1];
  //       const name1 = packageNames[0];
  //       const name2 = packageNames[1];
  //       const manifest1 = getMockManifest(name1, originalVersion);
  //       const manifest2 = getMockManifest(name2, originalVersion);

  //       const packageMetadata1 = getMockPackageMetadata(dir1, manifest1);
  //       const packageMetadata2 = getMockPackageMetadata(dir2, manifest2);

  //       const allPackages = {
  //         [name1]: packageMetadata1,
  //         [name2]: packageMetadata2,
  //       };
  //       const updateSpecification = {
  //         newVersion,
  //         packagesToUpdate: new Set([name1, name2]),
  //         synchronizeVersions: false,
  //         repositoryUrl: '',
  //         shouldUpdateChangelog: false,
  //       };

  //       await updateMonorepoPackages(allPackages, updateSpecification);
  //       expect(writeFileMock).toHaveBeenCalledTimes(2);
  //       expect(writeFileMock).toHaveBeenNthCalledWith(
  //         1,
  //         getMockWritePath(dir1, 'package.json'),
  //         jsonStringify({
  //           ...cloneDeep(manifest1),
  //           [ManifestFieldNames.Version]: newVersion,
  //         }),
  //       );
  //       expect(writeFileMock).toHaveBeenNthCalledWith(
  //         2,
  //         getMockWritePath(dir2, 'package.json'),
  //         jsonStringify({
  //           ...cloneDeep(manifest2),
  //           [ManifestFieldNames.Version]: newVersion,
  //         }),
  //       );
  //     });
  //   });
  // });
});
