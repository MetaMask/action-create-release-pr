import path from 'path';
import { ExecaChildProcess } from 'execa';
import { ACTION_EXECUTABLE_PATH, TS_NODE_PATH } from './constants';
import LocalRepo from './local-repo';
import RemoteRepo from './remote-repo';
import Repo from './repo';

/**
 * The environment variables that act as inputs to the action script.
 *
 * @property RELEASE_TYPE - The SemVer version diff that will be used to bump
 * package versions ("major", "minor", or "patch").
 * @property RELEASE_VERSION - The exact version that will be used to set
 * package versions.
 */
export interface CommandEnv {
  RELEASE_TYPE?: string;
  RELEASE_VERSION?: string;
}

/**
 * Describes the package that is used to initialize a polyrepo, or one of the
 * packages that is used to initialize a monorepo.
 *
 * @property name - The desired name of the package.
 * @property version - The desired version of the package.
 * @property directory - The path relative to the repo's root directory that
 * holds this package.
 */
export interface PackageSpecification {
  name: string;
  version: string;
  directory: string;
}

/**
 * A set of options with which to configure the action script or the repos
 * against which the action script is run.
 *
 * @property name - The name of this environment.
 * @property environmentsDir - The directory out of which all environments
 * (including this one) will operate.
 * @property commandEnv - Environment variables to use when running commands
 * (such as the action script) in the context of repos within this environment.
 * @property createInitialCommit - Usually when a repo is initialized, a commit
 * is created (which will contain starting `package.json` files). You can use
 * this option to disable that if you need to create your own commits for
 * clarity.
 */
export interface EnvironmentOptions {
  name: string;
  environmentsDir: string;
  commandEnv?: CommandEnv;
  createInitialCommit?: boolean;
}

/**
 * This class sets up each test and acts as a facade to all of the actions that
 * we need to take from within the test.
 */
export default abstract class Environment {
  #remoteRepo: Repo;

  #localRepo: Repo;

  readJsonFile: LocalRepo['readJsonFile'];

  readFile: LocalRepo['readFile'];

  updateJsonFile: LocalRepo['updateJsonFile'];

  writeJsonFile: LocalRepo['writeJsonFile'];

  writeFile: LocalRepo['writeFile'];

  runCommand: LocalRepo['runCommand'];

  createCommit: LocalRepo['createCommit'];

  constructor(options: EnvironmentOptions) {
    const { environmentsDir, name } = options;
    const projectDir = path.join(environmentsDir, name);
    const remoteRepoDir = path.resolve(projectDir, 'remote-repo');

    this.#remoteRepo = new RemoteRepo({ environmentDir: projectDir });

    this.#localRepo = this.buildLocalRepo(projectDir, remoteRepoDir, options);
    this.readJsonFile = this.#localRepo.readJsonFile.bind(this.#localRepo);
    this.readFile = this.#localRepo.readFile.bind(this.#localRepo);
    this.updateJsonFile = this.#localRepo.updateJsonFile.bind(this.#localRepo);
    this.writeJsonFile = this.#localRepo.writeJsonFile.bind(this.#localRepo);
    this.writeFile = this.#localRepo.writeFile.bind(this.#localRepo);
    this.runCommand = this.#localRepo.runCommand.bind(this.#localRepo);
    this.createCommit = this.#localRepo.createCommit.bind(this.#localRepo);
  }

  /**
   * Creates two repos: a "remote" repo so that the action script can run
   * commands such as `git fetch --tags`, and a "local" repo, which is the one
   * against which the action script is run.
   */
  async initialize() {
    await this.#remoteRepo.initialize();
    await this.#localRepo.initialize();
  }

  /**
   * Runs the script that powers this action within the context of the project.
   *
   * @returns The result of the command.
   */
  async runAction(): Promise<ExecaChildProcess<string>> {
    return await this.#localRepo.runCommand(TS_NODE_PATH, [
      '--transpileOnly',
      ACTION_EXECUTABLE_PATH,
    ]);
  }

  /**
   * This method is overridden in subclasses to return either a LocalPolyrepo or
   * a LocalMonorepo, depending on the use case.
   */
  protected abstract buildLocalRepo(
    projectDir: string,
    remoteRepoDir: string,
    options: EnvironmentOptions,
  ): LocalRepo;
}
