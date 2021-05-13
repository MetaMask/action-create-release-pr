import * as actionsCore from '@actions/core';
import * as gitOperations from './git-operations';
import * as packageOperations from './package-operations';
import * as utils from './utils';
import { performUpdate } from './update';

jest.mock('@actions/core', () => {
  return {
    setOutput: jest.fn(),
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
    getPackageManifest: jest.fn(),
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
  const WORKSPACE_ROOT = 'rootDir';
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
    getTagsMock = jest
      .spyOn(gitOperations, 'getTags')
      .mockImplementationOnce(async () => [
        new Set(['1.0.0', '1.1.0']),
        '1.1.0',
      ]);
    consoleLogMock = jest
      .spyOn(console, 'log')
      .mockImplementation(() => undefined);
    getPackageManifestMock = jest.spyOn(
      packageOperations,
      'getPackageManifest',
    );
    setActionOutputMock = jest.spyOn(actionsCore, 'setOutput');
  });

  it('updates a polyrepo with release-version input', async () => {
    const packageName = 'A';
    const oldVersion = '1.1.0';
    const newVersion = '2.0.0';

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
        dirPath: WORKSPACE_ROOT,
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
        dirPath: WORKSPACE_ROOT,
        manifest: { name: packageName, version: oldVersion },
      },
      { newVersion, repositoryUrl: mockRepoUrl, shouldUpdateChangelog: true },
    );
    expect(setActionOutputMock).toHaveBeenCalledTimes(1);
    expect(setActionOutputMock).toHaveBeenCalledWith('NEW_VERSION', newVersion);
  });

  it('updates a monorepo', async () => {
    const rootManifestName = 'root';
    const oldVersion = '1.1.0';
    const newVersion = '2.0.0';
    const workspaces: readonly string[] = ['a', 'b', 'c'];

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
      new Set(['1.0.0', '1.1.0']),
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
        dirPath: WORKSPACE_ROOT,
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
});
