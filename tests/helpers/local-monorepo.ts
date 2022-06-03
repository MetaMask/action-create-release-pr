import path from 'path';
import { PackageSpecification } from './environment';
import LocalRepo, { LocalRepoOptions } from './local-repo';
import { knownKeysOf } from './utils';

/**
 * A set of options with which to customize the action script or configuration
 * files within this repo.
 *
 * @property packages - The known packages within this repo (including the
 * root).
 * @property workspaces - The known workspaces within this repo.
 */
export interface LocalMonorepoOptions<PackageNames extends string>
  extends LocalRepoOptions {
  packages: Record<PackageNames, PackageSpecification>;
  workspaces: Record<string, string[]>;
}

/**
 * Represents the repo that the action script is run against, containing logic
 * specific to a monorepo.
 */
export default class LocalMonorepo<
  PackageNames extends string
> extends LocalRepo {
  /**
   * The known packages within this repo (including the root).
   */
  #packages: Record<'$root$' | PackageNames, PackageSpecification>;

  /**
   * The known workspaces within this repo.
   */
  #workspaces: Record<string, string[]>;

  constructor({
    packages,
    workspaces,
    ...rest
  }: LocalMonorepoOptions<PackageNames>) {
    super(rest);
    this.#packages = {
      $root$: {
        name: 'monorepo',
        version: '1.0.0',
        directory: '.',
      },
      ...packages,
    };
    this.#workspaces = workspaces;
  }

  /**
   * Initializes the repo by writing an initial package.json for the root
   * package as well as any workspace packages (if specified).
   */
  protected async customInitialize() {
    await super.customInitialize();

    await this.writeJsonFile('package.json', { private: true });

    // Update manifests for root and workspace packages with `name`, `version`,
    // and (optionally) `workspaces`
    await Promise.all(
      knownKeysOf(this.#packages).map((packageName) => {
        const pkg = this.#packages[packageName];
        const content = {
          name: pkg.name,
          version: pkg.version,
          ...(pkg.directory in this.#workspaces
            ? { workspaces: this.#workspaces[pkg.directory] }
            : {}),
        };
        return this.updateJsonFile(
          path.join(pkg.directory, 'package.json'),
          content,
        );
      }),
    );
  }

  /**
   * Returns the name of the root package.
   */
  protected getPackageName() {
    return this.#packages.$root$.name;
  }

  /**
   * Returns the version of the root package.
   */
  protected getPackageVersion() {
    return this.#packages.$root$.version;
  }
}
