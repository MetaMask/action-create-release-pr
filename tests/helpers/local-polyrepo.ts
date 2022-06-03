import LocalRepo, { LocalRepoOptions } from './local-repo';

/**
 * A set of options with which to customize the action script or configuration
 * files within this repo.
 *
 * @property packageName - The name of the package represented by this repo.
 * @property packageVersion - The version of the package represented by this
 * repo.
 */
interface LocalPolyrepoOptions extends LocalRepoOptions {
  packageName: string;
  packageVersion: string;
}

/**
 * Represents the repo that the action script is run against, containing logic
 * specific to a polyrepo.
 */
export default class LocalPolyrepo extends LocalRepo {
  /**
   * The name of the package represented by this repo.
   */
  #packageName: string;

  /**
   * The version of the package represented by this repo.
   */
  #packageVersion: string;

  constructor({ packageName, packageVersion, ...rest }: LocalPolyrepoOptions) {
    super(rest);
    this.#packageName = packageName;
    this.#packageVersion = packageVersion;
  }

  /**
   * Returns the name of the package represented by this repo.
   */
  protected getPackageName() {
    return this.#packageName;
  }

  /**
   * Returns the version of the package represented by this repo.
   */
  protected getPackageVersion() {
    return this.#packageVersion;
  }
}
