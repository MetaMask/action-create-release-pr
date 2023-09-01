import fs from 'fs';
import path from 'path';
import Repo from './repo';

/**
 * A facade for the "remote" repo, which is only used to hold tags so that
 * `@metamask/auto-changelog` can run `git fetch --tags`.
 */
export default class RemoteRepo extends Repo {
  /**
   * Initializes a bare repo.
   */
  async customInitialize() {
    await fs.promises.mkdir(this.getWorkingDir(), { recursive: true });
    await this.runCommand('git', ['init', '--bare']);
  }

  /**
   * Gets the directory where this repo is located.
   *
   * @returns The directory where this repo is located.
   */
  protected getWorkingDir() {
    return path.join(this.environmentDir, 'remote-repo');
  }
}
