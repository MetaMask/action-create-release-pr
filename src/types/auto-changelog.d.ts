declare module '@metamask/auto-changelog' {
  interface UpdateChangelogOptions {
    changelogContent: string;
    currentVersion: string;
    isReleaseCandidate: boolean;
    projectRootDirectory: string;
    repoUrl: string;
  }

  export function updateChangelog(
    options: UpdateChangelogOptions,
  ): Promise<string | undefined>;
}
