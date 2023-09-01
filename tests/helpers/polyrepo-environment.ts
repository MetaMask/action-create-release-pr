import Environment, { CommandEnv, EnvironmentOptions } from './environment';
import LocalPolyrepo from './local-polyrepo';

/**
 * A set of options with which to configure the action script or the repos
 * against which the action script is run. In addition to the options listed
 * in {@link EnvironmentOptions}, these include:
 *
 * @property packageVersion - The version with which to initialize the package
 * represented by the "local" repo.
 */
export interface PolyrepoEnvironmentOptions extends EnvironmentOptions {
  packageVersion?: string;
}

/**
 * This class configures Environment such that the "local" repo becomes a
 * polyrepo.
 */
export default class PolyrepoEnvironment extends Environment {
  protected buildLocalRepo(
    projectDir: string,
    remoteRepoDir: string,
    {
      packageVersion = '1.0.0',
      commandEnv = { RELEASE_TYPE: 'major' },
      createInitialCommit = true,
    }: Omit<PolyrepoEnvironmentOptions, 'commandEnv'> & {
      commandEnv: CommandEnv;
    },
  ) {
    return new LocalPolyrepo({
      environmentDir: projectDir,
      packageName: 'polyrepo',
      packageVersion,
      commandEnv,
      createInitialCommit,
      remoteRepoDir,
    });
  }
}
