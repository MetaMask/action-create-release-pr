import Environment, {
  CommandEnv,
  EnvironmentOptions,
  PackageSpecification,
} from './environment';
import LocalMonorepo from './local-monorepo';

/**
 * A set of options with which to configure the action script or the repos
 * against which the action script is run. In addition to the options listed
 * in {@link EnvironmentOptions}, these include:
 *
 * @property packages - The known packages within this repo (including the
 * root).
 * @property workspaces - The known workspaces within this repo.
 */
export interface MonorepoEnvironmentOptions extends EnvironmentOptions {
  packages?: Record<string, PackageSpecification>;
  workspaces?: Record<string, string[]>;
}

/**
 * This class configures Environment such that the "local" repo becomes a
 * monorepo.
 */
export default class MonorepoEnvironment extends Environment {
  protected buildLocalRepo(
    projectDir: string,
    remoteRepoDir: string,
    {
      packages = {},
      workspaces = {},
      commandEnv = { RELEASE_TYPE: 'major' },
      createInitialCommit = true,
    }: Omit<MonorepoEnvironmentOptions, 'commandEnv'> & {
      commandEnv: CommandEnv;
    },
  ) {
    return new LocalMonorepo({
      environmentDir: projectDir,
      packages,
      workspaces,
      commandEnv,
      createInitialCommit,
      remoteRepoDir,
    });
  }
}
