import fs from 'fs';
import cloneDeep from 'lodash.clonedeep';
import * as gitOps from './git-operations';
import * as utils from './utils';
import {
  getMetadataForAllPackages,
  getPackageManifest,
  getPackagesToUpdate,
  PackageDependencyFields,
  updatePackage,
  updatePackages,
} from './package-operations';

jest.mock('fs', () => ({
  promises: {
    readdir: jest.fn(),
    writeFile: jest.fn(),
    lstat: jest.fn(),
  },
}));

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
    readJsonFile: jest.fn(),
  };
});

// We don't actually use it, so it doesn't matter what it is.
process.env.GITHUB_WORKSPACE = 'root';
const MOCK_ROOT_DIR = 'root';
const MOCK_PACKAGES_DIR = 'packages';

type DependencyFieldsDict = Partial<
  Record<PackageDependencyFields, Record<string, string>>
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
  describe('getPackageManifest', () => {
    const readJsonFileMock = jest.spyOn(utils, 'readJsonFile');

    it('gets and returns a valid manifest', async () => {
      const validManifest = { name: 'fooName', version: '1.0.0' };

      readJsonFileMock.mockImplementationOnce(async () => {
        return { ...validManifest };
      });

      expect(await getPackageManifest('fooPath')).toStrictEqual(validManifest);
    });

    it('gets and returns a valid manifest, with different fields specified', async () => {
      const validManifest = { name: 'fooName', version: '1.0.0' };

      readJsonFileMock.mockImplementation(async () => {
        return { ...validManifest };
      });

      expect(await getPackageManifest('fooPath', ['name'])).toStrictEqual(
        validManifest,
      );
      expect(await getPackageManifest('fooPath', ['version'])).toStrictEqual(
        validManifest,
      );
      expect(await getPackageManifest('fooPath', [])).toStrictEqual(
        validManifest,
      );
    });

    it('throws an error if the manifest is missing required fields', async () => {
      readJsonFileMock
        .mockImplementationOnce(async () => {
          return { foo: 'bar' };
        })
        .mockImplementationOnce(async () => {
          return { version: '1.0.0' };
        })
        .mockImplementationOnce(async () => {
          return { version: '1.0.0' };
        })
        .mockImplementationOnce(async () => {
          return { name: 'fooName' };
        })
        .mockImplementationOnce(async () => {
          return { name: 'fooName' };
        });

      await expect(getPackageManifest('fooPath')).rejects.toThrow(/"name"/u);
      await expect(getPackageManifest('fooPath')).rejects.toThrow(/"name"/u);
      await expect(getPackageManifest('fooPath', ['name'])).rejects.toThrow(
        /"name"/u,
      );
      await expect(getPackageManifest('fooPath')).rejects.toThrow(/"version"/u);
      await expect(getPackageManifest('fooPath', ['version'])).rejects.toThrow(
        /"version"/u,
      );
    });
  });

  describe('getMetadataForAllPackages', () => {
    const readdirMock = jest.spyOn(fs.promises, 'readdir');

    const names = ['name1', 'name2', 'name3'];
    const dirs = ['dir1', 'dir2', 'dir3'];
    const version = '1.0.0';

    const getMockPackageMetadata = (index: number) => {
      return {
        dirName: dirs[index],
        manifest: getMockManifest(names[index], version),
        name: names[index],
        dirPath: `${MOCK_ROOT_DIR}/${MOCK_PACKAGES_DIR}/${dirs[index]}`,
      };
    };

    function getMockReadJsonFile() {
      let mockIndex = -1;
      return async () => {
        mockIndex += 1;
        return getMockManifest(names[mockIndex], version);
      };
    }

    beforeEach(() => {
      jest.spyOn(fs.promises, 'lstat').mockImplementation((async () => {
        return { isDirectory: async () => true };
      }) as any);

      jest
        .spyOn(utils, 'readJsonFile')
        .mockImplementation(getMockReadJsonFile());
    });

    it('placeholder', async () => {
      readdirMock.mockImplementationOnce((async () => {
        return [...dirs];
      }) as any);

      expect(await getMetadataForAllPackages(MOCK_ROOT_DIR)).toStrictEqual({
        [names[0]]: getMockPackageMetadata(0),
        [names[1]]: getMockPackageMetadata(1),
        [names[2]]: getMockPackageMetadata(2),
      });
    });
  });

  describe('getPackagesToUpdate', () => {
    const didPackageChangeMock = jest.spyOn(gitOps, 'didPackageChange');

    const packageNames = ['name1', 'name2', 'name3'];

    const mockMetadataRecord = {
      [packageNames[0]]: {},
      [packageNames[1]]: {},
      [packageNames[2]]: {},
    };

    it('returns all packages if synchronizeVersions is true', async () => {
      expect(
        await getPackagesToUpdate(mockMetadataRecord as any, true),
      ).toStrictEqual(new Set(packageNames));
      expect(didPackageChangeMock).not.toHaveBeenCalled();
    });

    it('returns changed packages if synchronizeVersions is false', async () => {
      didPackageChangeMock
        .mockImplementationOnce(async () => false)
        .mockImplementationOnce(async () => true)
        .mockImplementationOnce(async () => false);

      expect(
        await getPackagesToUpdate(mockMetadataRecord as any, false),
      ).toStrictEqual(new Set([packageNames[1]]));
      expect(didPackageChangeMock).toHaveBeenCalledTimes(3);
    });

    it('throws an error if there are no packages to update', async () => {
      didPackageChangeMock.mockImplementation(async () => false);

      await expect(
        getPackagesToUpdate(mockMetadataRecord as any, false),
      ).rejects.toThrow(/no packages to update/u);
      expect(didPackageChangeMock).toHaveBeenCalledTimes(3);
    });
  });

  describe('Updating packages', () => {
    const writeFileMock = jest
      .spyOn(fs.promises, 'writeFile')
      .mockImplementation(() => Promise.resolve());

    const getMockPackageMetadata = (
      dirPath: string,
      manifest: ReturnType<typeof getMockManifest>,
    ) => {
      return {
        dirPath,
        manifest,
      };
    };

    const getMockWritePath = (dirPath: string) => `${dirPath}/package.json`;

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
          synchronizeVersions: false,
        };

        await updatePackage(packageMetadata, updateSpecification);
        expect(writeFileMock).toHaveBeenCalledTimes(1);
        expect(writeFileMock).toHaveBeenCalledWith(
          getMockWritePath(dir),
          jsonStringify({
            ...cloneDeep(manifest),
            version: newVersion,
          }),
        );
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
        };

        await updatePackage(packageMetadata, updateSpecification);
        expect(writeFileMock).toHaveBeenCalledTimes(1);
        expect(writeFileMock).toHaveBeenCalledWith(
          getMockWritePath(dir),
          jsonStringify({
            ...cloneDeep(manifest),
            version: newVersion,
          }),
        );
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
        };

        await updatePackage(packageMetadata, updateSpecification);
        expect(writeFileMock).toHaveBeenCalledTimes(1);
        expect(writeFileMock).toHaveBeenCalledWith(
          getMockWritePath(dir),
          jsonStringify(
            getMockManifest(name, newVersion, expectedDependencies),
          ),
        );
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
        };

        await updatePackages(allPackages, updateSpecification);
        expect(writeFileMock).toHaveBeenCalledTimes(2);
        expect(writeFileMock).toHaveBeenNthCalledWith(
          1,
          getMockWritePath(dir1),
          jsonStringify({
            ...cloneDeep(manifest1),
            version: newVersion,
          }),
        );
        expect(writeFileMock).toHaveBeenNthCalledWith(
          2,
          getMockWritePath(dir2),
          jsonStringify({
            ...cloneDeep(manifest2),
            version: newVersion,
          }),
        );
      });
    });
  });
});
