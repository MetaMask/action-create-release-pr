import * as actionsCore from '@actions/core';
import * as actionUtils from '@ethjs-staging/action-utils';
import * as gitOperations from './git-operations';
import * as packageOperations from './package-operations';
import * as utils from './utils';
import { performUpdate } from './update';

jest.mock('@actions/core', () => {
  return {
    setOutput: jest.fn(),
  };
});

jest.mock('@ethjs-staging/action-utils', () => {
  const actualModule = jest.requireActual('@ethjs-staging/action-utils');
  return {
    ...actualModule,
    getPackageManifest: jest.fn(),
  };
});

jest.mock('./git-operations', () => {
  return {
    getRepositoryHttpsUrl: jest.fn(),
    getTags: jest.fn(),
  };
});

jest.mock('./package-operations', () => {
  const actualModule = jest.requireActual('./package-operations');
  return {
    ...actualModule,
    getMetadataForAllPackages: jest.fn(),
    getPackagesToUpdate: jest.fn(),
    updatePackage: jest.fn(),
    updatePackages: jest.fn(),
  };
});

jest.mock('./utils', () => {
  const actualModule = jest.requireActual('./utils');
  return {
    ...actualModule,
    WORKSPACE_ROOT: 'rootDir',
  };
});

describe('performUpdate', () => {
  const mockRepoUrl = 'https://fake';

  let getRepositoryHttpsUrlMock: jest.SpyInstance;
  let getTagsMock: jest.SpyInstance;
  let consoleLogMock: jest.SpyInstance;
  let getPackageManifestMock: jest.SpyInstance;
  let setActionOutputMock: jest.SpyInstance;

  beforeEach(() => {
    getRepositoryHttpsUrlMock = jest
      .spyOn(gitOperations, 'getRepositoryHttpsUrl')
      .mockImplementationOnce(async () => mockRepoUrl);
    getTagsMock = jest.spyOn(gitOperations, 'getTags');
    consoleLogMock = jest
      .spyOn(console, 'log')
      .mockImplementation(() => undefined);
    getPackageManifestMock = jest.spyOn(actionUtils, 'getPackageManifest');
    setActionOutputMock = jest.spyOn(actionsCore, 'setOutput');
  });

  it('updates a polyrepo with release-version input', async () => {
    const packageName = 'A';
    const oldVersion = '1.1.0';
    const newVersion = '2.0.0';

    getTagsMock.mockImplementationOnce(async () => [
      new Set(['v1.0.0', 'v1.1.0']),
      'v1.1.0',
    ]);

    getPackageManifestMock.mockImplementationOnce(async () => {
      return {
        name: packageName,
        version: oldVersion,
      };
    });

    await performUpdate({ ReleaseType: null, ReleaseVersion: newVersion });
    expect(getRepositoryHttpsUrlMock).toHaveBeenCalledTimes(1);
    expect(getTagsMock).toHaveBeenCalledTimes(1);
    expect(consoleLogMock).toHaveBeenCalledTimes(1);
    expect(consoleLogMock).toHaveBeenCalledWith(
      expect.stringMatching(/Applying polyrepo workflow/u),
    );
    expect(packageOperations.updatePackage).toHaveBeenCalledTimes(1);
    expect(packageOperations.updatePackage).toHaveBeenCalledWith(
      {
        dirPath: './',
        manifest: { name: packageName, version: oldVersion },
      },
      { newVersion, repositoryUrl: mockRepoUrl, shouldUpdateChangelog: true },
    );
    expect(setActionOutputMock).toHaveBeenCalledTimes(1);
    expect(setActionOutputMock).toHaveBeenCalledWith('NEW_VERSION', newVersion);
  });

  it('updates a polyrepo with release-type input', async () => {
    const packageName = 'A';
    const oldVersion = '1.1.0';
    const newVersion = '2.0.0';

    getTagsMock.mockImplementationOnce(async () => [
      new Set(['v1.0.0', 'v1.1.0']),
      'v1.1.0',
    ]);

    getPackageManifestMock.mockImplementationOnce(async () => {
      return {
        name: packageName,
        version: oldVersion,
      };
    });

    await performUpdate({
      ReleaseType: utils.AcceptedSemverReleaseTypes.Major,
      ReleaseVersion: null,
    });
    expect(getRepositoryHttpsUrlMock).toHaveBeenCalledTimes(1);
    expect(getTagsMock).toHaveBeenCalledTimes(1);
    expect(consoleLogMock).toHaveBeenCalledTimes(1);
    expect(consoleLogMock).toHaveBeenCalledWith(
      expect.stringMatching(/Applying polyrepo workflow/u),
    );
    expect(packageOperations.updatePackage).toHaveBeenCalledTimes(1);
    expect(packageOperations.updatePackage).toHaveBeenCalledWith(
      {
        dirPath: './',
        manifest: { name: packageName, version: oldVersion },
      },
      { newVersion, repositoryUrl: mockRepoUrl, shouldUpdateChangelog: true },
    );
    expect(setActionOutputMock).toHaveBeenCalledTimes(1);
    expect(setActionOutputMock).toHaveBeenCalledWith('NEW_VERSION', newVersion);
  });

  it('updates a monorepo (major version bump)', async () => {
    const rootManifestName = 'root';
    const oldVersion = '1.1.0';
    const newVersion = '2.0.0';
    const workspaces: readonly string[] = ['a', 'b', 'c'];

    getTagsMock.mockImplementationOnce(async () => [
      new Set(['v1.0.0', 'v1.1.0']),
      'v1.1.0',
    ]);

    getPackageManifestMock.mockImplementationOnce(async () => {
      return {
        name: rootManifestName,
        version: oldVersion,
        private: true,
        workspaces: [...workspaces],
      };
    });

    const getPackagesMetadataMock = jest
      .spyOn(packageOperations, 'getMetadataForAllPackages')
      .mockImplementationOnce(async () => {
        return { a: {}, b: {}, c: {} } as any;
      });

    const getPackagesToUpdateMock = jest
      .spyOn(packageOperations, 'getPackagesToUpdate')
      .mockImplementationOnce(async () => new Set(workspaces));

    await performUpdate({ ReleaseType: null, ReleaseVersion: newVersion });

    expect(getRepositoryHttpsUrlMock).toHaveBeenCalledTimes(1);
    expect(getTagsMock).toHaveBeenCalledTimes(1);
    expect(consoleLogMock).toHaveBeenCalledTimes(1);
    expect(consoleLogMock).toHaveBeenCalledWith(
      expect.stringMatching(/Applying monorepo workflow/u),
    );
    expect(getPackagesMetadataMock).toHaveBeenCalledTimes(1);

    expect(getPackagesToUpdateMock).toHaveBeenCalledTimes(1);
    expect(getPackagesToUpdateMock).toHaveBeenCalledWith(
      { a: {}, b: {}, c: {} },
      true,
      new Set(['v1.0.0', 'v1.1.0']),
    );

    expect(packageOperations.updatePackages).toHaveBeenCalledTimes(1);
    expect(packageOperations.updatePackages).toHaveBeenCalledWith(
      { a: {}, b: {}, c: {} },
      {
        newVersion,
        packagesToUpdate: new Set(workspaces),
        repositoryUrl: mockRepoUrl,
        shouldUpdateChangelog: true,
        synchronizeVersions: true,
      },
    );

    expect(packageOperations.updatePackage).toHaveBeenCalledTimes(1);
    expect(packageOperations.updatePackage).toHaveBeenCalledWith(
      {
        dirPath: './',
        manifest: {
          name: rootManifestName,
          private: true,
          version: oldVersion,
          workspaces: [...workspaces],
        },
      },
      {
        newVersion,
        packagesToUpdate: new Set(workspaces),
        repositoryUrl: mockRepoUrl,
        shouldUpdateChangelog: false,
        synchronizeVersions: true,
      },
    );

    expect(setActionOutputMock).toHaveBeenCalledTimes(1);
    expect(setActionOutputMock).toHaveBeenCalledWith('NEW_VERSION', newVersion);
  });

  it('updates a monorepo (non-major version bump)', async () => {
    const rootManifestName = 'root';
    const oldVersion = '1.1.0';
    const newVersion = '1.2.0';
    const workspaces: readonly string[] = ['a', 'b', 'c'];

    getTagsMock.mockImplementationOnce(async () => [
      new Set(['v1.0.0', 'v1.1.0']),
      'v1.1.0',
    ]);

    getPackageManifestMock.mockImplementationOnce(async () => {
      return {
        name: rootManifestName,
        version: oldVersion,
        private: true,
        workspaces: [...workspaces],
      };
    });

    const getPackagesMetadataMock = jest
      .spyOn(packageOperations, 'getMetadataForAllPackages')
      .mockImplementationOnce(async () => {
        return { a: {}, b: {}, c: {} } as any;
      });

    const getPackagesToUpdateMock = jest
      .spyOn(packageOperations, 'getPackagesToUpdate')
      .mockImplementationOnce(async () => new Set(workspaces));

    await performUpdate({ ReleaseType: null, ReleaseVersion: newVersion });

    expect(getRepositoryHttpsUrlMock).toHaveBeenCalledTimes(1);
    expect(getTagsMock).toHaveBeenCalledTimes(1);
    expect(consoleLogMock).toHaveBeenCalledTimes(1);
    expect(consoleLogMock).toHaveBeenCalledWith(
      expect.stringMatching(/Applying monorepo workflow/u),
    );
    expect(getPackagesMetadataMock).toHaveBeenCalledTimes(1);

    expect(getPackagesToUpdateMock).toHaveBeenCalledTimes(1);
    expect(getPackagesToUpdateMock).toHaveBeenCalledWith(
      { a: {}, b: {}, c: {} },
      false,
      new Set(['v1.0.0', 'v1.1.0']),
    );

    expect(packageOperations.updatePackages).toHaveBeenCalledTimes(1);
    expect(packageOperations.updatePackages).toHaveBeenCalledWith(
      { a: {}, b: {}, c: {} },
      {
        newVersion,
        packagesToUpdate: new Set(workspaces),
        repositoryUrl: mockRepoUrl,
        shouldUpdateChangelog: true,
        synchronizeVersions: false,
      },
    );

    expect(packageOperations.updatePackage).toHaveBeenCalledTimes(1);
    expect(packageOperations.updatePackage).toHaveBeenCalledWith(
      {
        dirPath: './',
        manifest: {
          name: rootManifestName,
          private: true,
          version: oldVersion,
          workspaces: [...workspaces],
        },
      },
      {
        newVersion,
        packagesToUpdate: new Set(workspaces),
        repositoryUrl: mockRepoUrl,
        shouldUpdateChangelog: false,
        synchronizeVersions: false,
      },
    );

    expect(setActionOutputMock).toHaveBeenCalledTimes(1);
    expect(setActionOutputMock).toHaveBeenCalledWith('NEW_VERSION', newVersion);
  });

  it('updates a monorepo (within major version 0)', async () => {
    const rootManifestName = 'root';
    const oldVersion = '0.1.0';
    const newVersion = '0.2.0';
    const workspaces: readonly string[] = ['a', 'b', 'c'];

    getTagsMock.mockImplementationOnce(async () => [
      new Set(['v0.0.0', 'v0.1.0']),
      'v0.1.0',
    ]);

    getPackageManifestMock.mockImplementationOnce(async () => {
      return {
        name: rootManifestName,
        version: oldVersion,
        private: true,
        workspaces: [...workspaces],
      };
    });

    const getPackagesMetadataMock = jest
      .spyOn(packageOperations, 'getMetadataForAllPackages')
      .mockImplementationOnce(async () => {
        return { a: {}, b: {}, c: {} } as any;
      });

    const getPackagesToUpdateMock = jest
      .spyOn(packageOperations, 'getPackagesToUpdate')
      .mockImplementationOnce(async () => new Set(workspaces));

    await performUpdate({ ReleaseType: null, ReleaseVersion: newVersion });

    expect(getRepositoryHttpsUrlMock).toHaveBeenCalledTimes(1);
    expect(getTagsMock).toHaveBeenCalledTimes(1);
    expect(consoleLogMock).toHaveBeenCalledTimes(1);
    expect(consoleLogMock).toHaveBeenCalledWith(
      expect.stringMatching(/Applying monorepo workflow/u),
    );
    expect(getPackagesMetadataMock).toHaveBeenCalledTimes(1);

    expect(getPackagesToUpdateMock).toHaveBeenCalledTimes(1);
    expect(getPackagesToUpdateMock).toHaveBeenCalledWith(
      { a: {}, b: {}, c: {} },
      true,
      new Set(['v0.0.0', 'v0.1.0']),
    );

    expect(packageOperations.updatePackages).toHaveBeenCalledTimes(1);
    expect(packageOperations.updatePackages).toHaveBeenCalledWith(
      { a: {}, b: {}, c: {} },
      {
        newVersion,
        packagesToUpdate: new Set(workspaces),
        repositoryUrl: mockRepoUrl,
        shouldUpdateChangelog: true,
        synchronizeVersions: true,
      },
    );

    expect(packageOperations.updatePackage).toHaveBeenCalledTimes(1);
    expect(packageOperations.updatePackage).toHaveBeenCalledWith(
      {
        dirPath: './',
        manifest: {
          name: rootManifestName,
          private: true,
          version: oldVersion,
          workspaces: [...workspaces],
        },
      },
      {
        newVersion,
        packagesToUpdate: new Set(workspaces),
        repositoryUrl: mockRepoUrl,
        shouldUpdateChangelog: false,
        synchronizeVersions: true,
      },
    );

    expect(setActionOutputMock).toHaveBeenCalledTimes(1);
    expect(setActionOutputMock).toHaveBeenCalledWith('NEW_VERSION', newVersion);
  });

  it('throws if the new version is less than the current version', async () => {
    const packageName = 'A';
    const oldVersion = '1.1.0';
    const newVersion = '1.0.0';

    getTagsMock.mockImplementationOnce(async () => [
      new Set(['v1.1.0']),
      'v1.1.0',
    ]);

    getPackageManifestMock.mockImplementationOnce(async () => {
      return {
        name: packageName,
        version: oldVersion,
      };
    });

    await expect(
      performUpdate({ ReleaseType: null, ReleaseVersion: newVersion }),
    ).rejects.toThrow(/^The new version "1\.0\.0" is not greater than/u);
  });

  it('throws if the new version is equal to the current version', async () => {
    const packageName = 'A';
    const oldVersion = '1.1.0';
    const newVersion = '1.1.0';

    getTagsMock.mockImplementationOnce(async () => [
      new Set(['v1.1.0']),
      'v1.1.0',
    ]);

    getPackageManifestMock.mockImplementationOnce(async () => {
      return {
        name: packageName,
        version: oldVersion,
      };
    });

    await expect(
      performUpdate({ ReleaseType: null, ReleaseVersion: newVersion }),
    ).rejects.toThrow(/^The new version "1\.1\.0" is not greater than/u);
  });

  it('throws if there is already a tag for the new version', async () => {
    const packageName = 'A';
    const oldVersion = '1.1.0';
    const newVersion = '2.0.0';

    getTagsMock.mockImplementationOnce(async () => [
      new Set(['v1.0.0', 'v1.1.0', 'v2.0.0']),
      'v2.0.0',
    ]);

    getPackageManifestMock.mockImplementationOnce(async () => {
      return {
        name: packageName,
        version: oldVersion,
      };
    });

    await expect(
      performUpdate({ ReleaseType: null, ReleaseVersion: newVersion }),
    ).rejects.toThrow(
      /^Tag "v2\.0\.0" for new version "2\.0\.0" already exists\.$/u,
    );
  });
});
