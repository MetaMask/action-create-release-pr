import { promises as fs } from 'fs';
import pathUtils from 'path';

import { didPackageChange } from './git-operations';
import {
  isTruthyString,
  isValidSemver,
  readJsonFile,
  WORKSPACE_ROOT,
  writeJsonFile,
} from './utils';

const PACKAGE_JSON = 'package.json';

export enum PackageDependencyFields {
  Production = 'dependencies',
  Development = 'devDependencies',
  Peer = 'peerDependencies',
  Bundled = 'bundledDependencies',
  Optional = 'optionalDependencies',
}

export interface PackageManifest
  extends Partial<Record<PackageDependencyFields, Record<string, string>>> {
  readonly name: string;
  readonly version: string;
}

export interface PackageMetadata {
  readonly dirName: string;
  readonly manifest: PackageManifest;
  readonly name: string;
  readonly dirPath: string;
}

interface UpdateSpecification {
  readonly newVersion: string;
  readonly packagesToUpdate: Set<string>;
  readonly synchronizeVersions: boolean;
}

/**
 * Reads the contents of the monorepo's packages directory, and collects
 * metadata for each package therein. Assumes that all folders in the packages
 * directory are the root folders of distinct npm packages.
 *
 * @param rootDir - The monorepo root directory.
 * @param packagesDir - The packages directory of the monorepo.
 * @returns The metadata for all packages in the monorepo.
 */
export async function getMetadataForAllPackages(
  rootDir: string = WORKSPACE_ROOT,
  packagesDir = 'packages',
): Promise<Record<string, PackageMetadata>> {
  const packagesPath = pathUtils.join(rootDir, packagesDir);
  const packagesDirContents = await fs.readdir(packagesPath);

  const result: Record<string, PackageMetadata> = {};
  await Promise.all(
    packagesDirContents.map(async (packageDir) => {
      const packagePath = pathUtils.join(packagesPath, packageDir);

      if ((await fs.lstat(packagePath)).isDirectory()) {
        const manifest = await getPackageManifest(packagePath);
        result[manifest.name] = {
          dirName: packageDir,
          manifest,
          name: manifest.name,
          dirPath: packagePath,
        };
      }
    }),
  );
  return result;
}

/**
 * @param allPackages - The metadata of all packages in the monorepo.
 * @param synchronizeVersions - Whether to synchronize the versions of all
 * packages.
 * @returns The names of the packages to update.
 */
export async function getPackagesToUpdate(
  allPackages: Record<string, PackageMetadata>,
  synchronizeVersions: boolean,
): Promise<Set<string>> {
  // In order to synchronize versions, we must update every package.
  if (synchronizeVersions) {
    return new Set(Object.keys(allPackages));
  }

  // If we're not synchronizing versions, we only update changed packages.
  const shouldBeUpdated: Set<string> = new Set();
  // We use a for-loop here instead of Promise.all because didPackageChange
  // must be called serially.
  for (const packageName of Object.keys(allPackages)) {
    if (await didPackageChange(allPackages[packageName])) {
      shouldBeUpdated.add(packageName);
    }
  }

  if (shouldBeUpdated.size === 0) {
    throw new Error(`There are no packages to update.`);
  }
  return shouldBeUpdated;
}

/**
 * Updates the manifests of all packages in the monorepo per the update
 * specification. Writes the new manifests to disk. The following changes are
 * made to the new manifests:
 *
 * - The "version" field is replaced with the new version
 * - If package versions are being synchronized, updates their version ranges
 * wherever they appear as dependencies
 *
 * @param allPackages - The metadata of all monorepo packages
 * @param updateSpecification - The update specification.
 */
export async function updatePackages(
  allPackages: Record<string, Pick<PackageMetadata, 'dirPath' | 'manifest'>>,
  updateSpecification: UpdateSpecification,
): Promise<void> {
  const { packagesToUpdate } = updateSpecification;
  await Promise.all(
    Array.from(packagesToUpdate.keys()).map(async (packageName) =>
      updatePackage(allPackages[packageName], updateSpecification),
    ),
  );
}

/**
 * Updates the given manifest per the update specification and writes it to
 * disk. The following changes are made to the new manifest:
 *
 * - The "version" field is replaced with the new version
 * - If package versions are being synchronized, updates their version ranges
 * wherever they appear as dependencies
 *
 * @param packageMetadata - The metadata of the package to update.
 * @param updateSpecification - The update specification, which determines how
 * the update is performed.
 */
export async function updatePackage(
  packageMetadata: { dirPath: string; manifest: Partial<PackageManifest> },
  updateSpecification: UpdateSpecification,
): Promise<void> {
  await writeJsonFile(
    pathUtils.join(packageMetadata.dirPath, PACKAGE_JSON),
    getUpdatedManifest(packageMetadata.manifest, updateSpecification),
  );
}

/**
 * Updates the given manifest per the update specification as follows:
 *
 * - Updates the manifest's "version" field to the new version
 * - If monorepo package versions are being synchronized, updates their version
 * ranges wherever they appear as dependencies
 *
 * @param currentManifest - The package's current manifest, as read from disk.
 * @param updateSpecification - The update specification, which determines how
 * the update is performed.
 * @returns The updated manifest.
 */
function getUpdatedManifest(
  currentManifest: Partial<PackageManifest>,
  updateSpecification: UpdateSpecification,
) {
  const { newVersion, synchronizeVersions } = updateSpecification;
  if (synchronizeVersions) {
    // If we're synchronizing the versions of our updated packages, we also
    // synchronize their versions whenever they appear as a dependency.
    return {
      ...currentManifest,
      ...getUpdatedDependencyFields(currentManifest, updateSpecification),
      version: newVersion,
    };
  }

  // If we're not synchronizing versions, we leave all dependencies as they are.
  return { ...currentManifest, version: newVersion };
}

/**
 * Gets the updated dependency fields of the given manifest per the given
 * update specification.
 *
 * @param currentManifest - The package's current manifest, as read from disk.
 * @param updateSpecification - The update specification, which determines how
 * the update is performed.
 * @returns The updated dependency fields of the manifest.
 */
function getUpdatedDependencyFields(
  manifest: Partial<PackageManifest>,
  updateSpecification: UpdateSpecification,
): Partial<Pick<PackageManifest, PackageDependencyFields>> {
  const { newVersion, packagesToUpdate } = updateSpecification;
  return Object.values(PackageDependencyFields).reduce(
    (newDepsFields: Record<string, unknown>, fieldName) => {
      if (fieldName in manifest) {
        newDepsFields[fieldName] = getUpdatedDependencyField(
          manifest[fieldName] as Record<string, string>,
          packagesToUpdate,
          newVersion,
        );
      }

      return newDepsFields;
    },
    {},
  );
}

/**
 * Updates the version range of every package in the list that's present in the
 * dependency object to "^<VERSION>", where <VERSION> is the specified new
 * version.
 *
 * @param dependencyObject - The package.json dependency object to update.
 * @param packagesToUpdate - The packages to update the version of.
 * @param newVersion - The new version of the given packages.
 * @returns The updated dependency object.
 */
function getUpdatedDependencyField(
  dependencyObject: Record<string, string>,
  packagesToUpdate: Set<string>,
  newVersion: string,
): Record<string, string> {
  const newVersionRange = `^${newVersion}`;
  return Object.keys(dependencyObject).reduce(
    (newDeps: Record<string, string>, packageName) => {
      newDeps[packageName] = packagesToUpdate.has(packageName)
        ? newVersionRange
        : dependencyObject[packageName];

      return newDeps;
    },
    {},
  );
}

/**
 * Read, parse, validate, and return the object corresponding to the
 * package.json file in the given directory.
 *
 * An error is thrown if validation fails.
 *
 * @param containingDirPath - The path to the directory containing the
 * package.json file.
 * @param requiredFields - The manifest fields that will be required during
 * validation.
 * @returns The object corresponding to the parsed package.json file.
 */
export async function getPackageManifest<T extends keyof PackageManifest>(
  containingDirPath: string,
  requiredFields?: T[],
): Promise<Pick<PackageManifest, T>> {
  const manifest = await readJsonFile(
    pathUtils.join(containingDirPath, PACKAGE_JSON),
  );

  validatePackageManifest(manifest, containingDirPath, requiredFields);
  return manifest as Pick<PackageManifest, T>;
}

/**
 * Validates a manifest by ensuring that the given required fields are present
 * and properly formatted.
 *
 * @param manifest - The manifest to validate.
 * @param manifestDirPath - The path to the directory containing the
 * package.json file.
 * @param requiredFields - The manifest fields that will be required during
 * validation.
 */
function validatePackageManifest(
  manifest: Record<string, unknown>,
  manifestDirPath: string,
  requiredFields: (keyof PackageManifest)[] = ['name', 'version'],
): void {
  if (requiredFields.length === 0) {
    return;
  }

  // Just for logging purposes
  const legiblePath = manifestDirPath.split('/').splice(-2).join('/');

  if (requiredFields.includes('name') && !isTruthyString(manifest.name)) {
    throw new Error(
      `Manifest in "${legiblePath}" does not have a valid "name" field.`,
    );
  }

  if (requiredFields.includes('version') && !isValidSemver(manifest.version)) {
    throw new Error(
      `${
        manifest.name
          ? `"${manifest.name}" manifest "version"`
          : `"version" of manifest in "${legiblePath}"`
      } is not a valid SemVer version: ${manifest.version}`,
    );
  }
}
