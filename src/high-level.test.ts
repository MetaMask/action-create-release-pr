import {
  withMonorepoProjectEnvironment,
  withPolyrepoProjectEnvironment,
} from '../tests/helpers/with';
import { buildChangelog } from '../tests/helpers/utils';

describe('action-create-release-pr', () => {
  describe('with a polyrepo', () => {
    describe('given an exact release version', () => {
      describe('if the specified version is greater than the current version', () => {
        describe('if the repo has no tags whatsoever', () => {
          it('updates the current version to the specified version', async () => {
            await withPolyrepoProjectEnvironment(
              {
                packageVersion: '1.0.0',
                commandEnv: { RELEASE_VERSION: '1.2.3' },
              },
              async (environment) => {
                await environment.runAction();

                const rootManifest = await environment.readJsonFile(
                  'package.json',
                );
                expect(rootManifest.version).toStrictEqual('1.2.3');
              },
            );
          });

          it('updates the changelog by adding a new section which lists all commits concerning the package over the entire history of the repo', async () => {
            await withPolyrepoProjectEnvironment(
              {
                packageVersion: '1.0.0',
                commandEnv: { RELEASE_VERSION: '1.2.3' },
                createInitialCommit: false,
              },
              async (environment) => {
                await environment.writeFile(
                  'CHANGELOG.md',
                  buildChangelog(`
                    ## [Unreleased]

                    [Unreleased]: https://github.com/example-org/example-repo
                  `),
                );
                await environment.createCommit('Initial commit');

                await environment.runAction();

                expect(
                  await environment.readFile('CHANGELOG.md'),
                ).toStrictEqual(
                  buildChangelog(`
                    ## [Unreleased]

                    ## [1.2.3]
                    ### Uncategorized
                    - Initial commit

                    [Unreleased]: https://github.com/example-org/example-repo/compare/v1.2.3...HEAD
                    [1.2.3]: https://github.com/example-org/example-repo/releases/tag/v1.2.3
                  `),
                );
              },
            );
          });
        });

        describe('if the repo has a tag for the current version of the package', () => {
          it('updates the current version to the specified version', async () => {
            await withPolyrepoProjectEnvironment(
              {
                commandEnv: { RELEASE_VERSION: '1.2.3' },
              },
              async (environment) => {
                await environment.updateJsonFile('package.json', {
                  name: 'root',
                  version: '1.0.0',
                });
                await environment.createCommit('Release v1.0.0');
                await environment.runCommand('git', ['tag', 'v1.0.0']);
                await environment.runCommand('git', ['push', '--tags']);

                await environment.runAction();

                const rootManifest = await environment.readJsonFile(
                  'package.json',
                );
                expect(rootManifest.version).toStrictEqual('1.2.3');
              },
            );
          });

          it('updates the changelog by adding a new section which lists all commits that have been added since the latest tag', async () => {
            await withPolyrepoProjectEnvironment(
              {
                commandEnv: { RELEASE_VERSION: '1.2.3' },
                createInitialCommit: false,
              },
              async (environment) => {
                // Create and tag a release
                await environment.updateJsonFile('package.json', {
                  name: 'root',
                  version: '1.0.0',
                });

                await environment.writeFile(
                  'CHANGELOG.md',
                  buildChangelog(`
                    ## [Unreleased]

                    ## [1.0.0]
                    ### Added
                    - Initial commit

                    [Unreleased]: https://github.com/example-org/example-repo/compare/v1.0.0...HEAD
                    [1.0.0]: https://github.com/example-org/example-repo/releases/tag/v1.0.0
                  `),
                );
                await environment.createCommit('Release v1.0.0');
                await environment.runCommand('git', ['tag', 'v1.0.0']);

                // Push all tags
                await environment.runCommand('git', ['push', '--tags']);

                // Make some changes
                await environment.writeFile('dummy.txt', 'Some content');
                await environment.createCommit('Update');

                // Run the action
                await environment.runAction();

                // Only the last commit should be added to the changelog
                expect(
                  await environment.readFile('CHANGELOG.md'),
                ).toStrictEqual(
                  buildChangelog(`
                    ## [Unreleased]

                    ## [1.2.3]
                    ### Uncategorized
                    - Update

                    ## [1.0.0]
                    ### Added
                    - Initial commit

                    [Unreleased]: https://github.com/example-org/example-repo/compare/v1.2.3...HEAD
                    [1.2.3]: https://github.com/example-org/example-repo/compare/v1.0.0...v1.2.3
                    [1.0.0]: https://github.com/example-org/example-repo/releases/tag/v1.0.0
                  `),
                );
              },
            );
          });
        });
      });

      describe('if the specified version is the same as the current version', () => {
        it('throws an error', async () => {
          await withPolyrepoProjectEnvironment(
            {
              packageVersion: '1.0.0',
              commandEnv: { RELEASE_VERSION: '1.0.0' },
            },
            async (environment) => {
              await expect(environment.runAction()).rejects.toThrow(
                expect.objectContaining({
                  message: expect.stringContaining(
                    'The new version "1.0.0" is not greater than the current version "1.0.0".',
                  ),
                }),
              );
            },
          );
        });
      });

      describe('if the specified version is less than the current version', () => {
        it('throws an error', async () => {
          await withPolyrepoProjectEnvironment(
            {
              packageVersion: '1.0.0',
              commandEnv: { RELEASE_VERSION: '0.7.3' },
            },
            async (environment) => {
              await expect(environment.runAction()).rejects.toThrow(
                expect.objectContaining({
                  message: expect.stringContaining(
                    'The new version "0.7.3" is not greater than the current version "1.0.0".',
                  ),
                }),
              );
            },
          );
        });
      });
    });

    describe('given a release type of "major"', () => {
      describe('if the repo has no tags whatsoever', () => {
        it('bumps the major part of the current version', async () => {
          await withPolyrepoProjectEnvironment(
            {
              packageVersion: '1.2.3',
              commandEnv: { RELEASE_TYPE: 'major' },
            },
            async (environment) => {
              await environment.runAction();

              const rootManifest = await environment.readJsonFile(
                'package.json',
              );
              expect(rootManifest.version).toStrictEqual('2.0.0');
            },
          );
        });

        it('updates the changelog by adding a new section which lists all commits over the entire history of the repo', async () => {
          await withPolyrepoProjectEnvironment(
            {
              packageVersion: '1.0.0',
              commandEnv: { RELEASE_TYPE: 'major' },
              createInitialCommit: false,
            },
            async (environment) => {
              await environment.writeFile(
                'CHANGELOG.md',
                buildChangelog(`
                  ## [Unreleased]

                  [Unreleased]: https://github.com/example-org/example-repo
                `),
              );
              await environment.createCommit('Initial commit');

              await environment.runAction();

              expect(await environment.readFile('CHANGELOG.md')).toStrictEqual(
                buildChangelog(`
                  ## [Unreleased]

                  ## [2.0.0]
                  ### Uncategorized
                  - Initial commit

                  [Unreleased]: https://github.com/example-org/example-repo/compare/v2.0.0...HEAD
                  [2.0.0]: https://github.com/example-org/example-repo/releases/tag/v2.0.0
                `),
              );
            },
          );
        });
      });

      describe('if the repo has a tag for the current version of the package', () => {
        it('updates the current version to the specified version', async () => {
          await withPolyrepoProjectEnvironment(
            {
              commandEnv: { RELEASE_TYPE: 'major' },
            },
            async (environment) => {
              await environment.updateJsonFile('package.json', {
                name: 'root',
                version: '1.2.3',
              });
              await environment.createCommit('Release v1.2.3');
              await environment.runCommand('git', ['tag', 'v1.2.3']);
              await environment.runCommand('git', ['push', '--tags']);

              await environment.runAction();

              const rootManifest = await environment.readJsonFile(
                'package.json',
              );
              expect(rootManifest.version).toStrictEqual('2.0.0');
            },
          );
        });

        it('updates the changelog by adding a new section which lists all commits that have been added since the latest tag', async () => {
          await withPolyrepoProjectEnvironment(
            {
              commandEnv: { RELEASE_TYPE: 'major' },
              createInitialCommit: false,
            },
            async (environment) => {
              // Create and tag a release
              await environment.updateJsonFile('package.json', {
                name: 'root',
                version: '1.0.0',
              });

              await environment.writeFile(
                'CHANGELOG.md',
                buildChangelog(`
                  ## [Unreleased]

                  ## [1.0.0]
                  ### Added
                  - Initial commit

                  [Unreleased]: https://github.com/example-org/example-repo/compare/v1.0.0...HEAD
                  [1.0.0]: https://github.com/example-org/example-repo/releases/tag/v1.0.0
                `),
              );
              await environment.createCommit('Release v1.0.0');
              await environment.runCommand('git', ['tag', 'v1.0.0']);

              // Push all tags
              await environment.runCommand('git', ['push', '--tags']);

              // Make some changes
              await environment.writeFile('dummy.txt', 'Some content');
              await environment.createCommit('Update');

              // Run the action
              await environment.runAction();

              // Only the last commit should be added to the changelog
              expect(await environment.readFile('CHANGELOG.md')).toStrictEqual(
                buildChangelog(`
                  ## [Unreleased]

                  ## [2.0.0]
                  ### Uncategorized
                  - Update

                  ## [1.0.0]
                  ### Added
                  - Initial commit

                  [Unreleased]: https://github.com/example-org/example-repo/compare/v2.0.0...HEAD
                  [2.0.0]: https://github.com/example-org/example-repo/compare/v1.0.0...v2.0.0
                  [1.0.0]: https://github.com/example-org/example-repo/releases/tag/v1.0.0
                `),
              );
            },
          );
        });
      });
    });

    describe('given a release type of "minor"', () => {
      describe('if the repo has no tags whatsoever', () => {
        it('bumps the minor part of the current version', async () => {
          await withPolyrepoProjectEnvironment(
            {
              packageVersion: '1.2.3',
              commandEnv: { RELEASE_TYPE: 'minor' },
            },
            async (environment) => {
              await environment.runAction();

              const rootManifest = await environment.readJsonFile(
                'package.json',
              );
              expect(rootManifest.version).toStrictEqual('1.3.0');
            },
          );
        });

        it('updates the changelog by adding a new section which lists all commits over the entire history of the repo', async () => {
          await withPolyrepoProjectEnvironment(
            {
              packageVersion: '1.0.0',
              commandEnv: { RELEASE_TYPE: 'minor' },
              createInitialCommit: false,
            },
            async (environment) => {
              await environment.writeFile(
                'CHANGELOG.md',
                buildChangelog(`
                  ## [Unreleased]

                  [Unreleased]: https://github.com/example-org/example-repo
                `),
              );
              await environment.createCommit('Initial commit');

              await environment.runAction();

              expect(await environment.readFile('CHANGELOG.md')).toStrictEqual(
                buildChangelog(`
                  ## [Unreleased]

                  ## [1.1.0]
                  ### Uncategorized
                  - Initial commit

                  [Unreleased]: https://github.com/example-org/example-repo/compare/v1.1.0...HEAD
                  [1.1.0]: https://github.com/example-org/example-repo/releases/tag/v1.1.0
                `),
              );
            },
          );
        });
      });

      describe('if the repo has a tag for the current version of the package', () => {
        it('updates the current version to the specified version', async () => {
          await withPolyrepoProjectEnvironment(
            {
              commandEnv: { RELEASE_TYPE: 'minor' },
            },
            async (environment) => {
              await environment.updateJsonFile('package.json', {
                name: 'root',
                version: '1.2.3',
              });
              await environment.createCommit('Release v1.2.3');
              await environment.runCommand('git', ['tag', 'v1.2.3']);
              await environment.runCommand('git', ['push', '--tags']);

              await environment.runAction();

              const rootManifest = await environment.readJsonFile(
                'package.json',
              );
              expect(rootManifest.version).toStrictEqual('1.3.0');
            },
          );
        });

        it('updates the changelog by adding a new section which lists all commits that have been added since the latest tag', async () => {
          await withPolyrepoProjectEnvironment(
            {
              commandEnv: { RELEASE_TYPE: 'minor' },
              createInitialCommit: false,
            },
            async (environment) => {
              // Create and tag a release
              await environment.updateJsonFile('package.json', {
                name: 'root',
                version: '1.0.0',
              });

              await environment.writeFile(
                'CHANGELOG.md',
                buildChangelog(`
                  ## [Unreleased]

                  ## [1.0.0]
                  ### Added
                  - Initial commit

                  [Unreleased]: https://github.com/example-org/example-repo/compare/v1.0.0...HEAD
                  [1.0.0]: https://github.com/example-org/example-repo/releases/tag/v1.0.0
                `),
              );
              await environment.createCommit('Release v1.0.0');
              await environment.runCommand('git', ['tag', 'v1.0.0']);

              // Push all tags
              await environment.runCommand('git', ['push', '--tags']);

              // Make some changes
              await environment.writeFile('dummy.txt', 'Some content');
              await environment.createCommit('Update');

              // Run the action
              await environment.runAction();

              // Only the last commit should be added to the changelog
              expect(await environment.readFile('CHANGELOG.md')).toStrictEqual(
                buildChangelog(`
                  ## [Unreleased]

                  ## [1.1.0]
                  ### Uncategorized
                  - Update

                  ## [1.0.0]
                  ### Added
                  - Initial commit

                  [Unreleased]: https://github.com/example-org/example-repo/compare/v1.1.0...HEAD
                  [1.1.0]: https://github.com/example-org/example-repo/compare/v1.0.0...v1.1.0
                  [1.0.0]: https://github.com/example-org/example-repo/releases/tag/v1.0.0
                `),
              );
            },
          );
        });
      });
    });

    describe('given a release type of "patch"', () => {
      describe('if the repo has no tags whatsoever', () => {
        it('bumps the patch part of the current version', async () => {
          await withPolyrepoProjectEnvironment(
            {
              packageVersion: '1.2.3',
              commandEnv: { RELEASE_TYPE: 'patch' },
            },
            async (environment) => {
              await environment.runAction();

              const rootManifest = await environment.readJsonFile(
                'package.json',
              );
              expect(rootManifest.version).toStrictEqual('1.2.4');
            },
          );
        });

        it('updates the changelog by adding a new section which lists all commits over the entire history of the repo', async () => {
          await withPolyrepoProjectEnvironment(
            {
              packageVersion: '1.0.0',
              commandEnv: { RELEASE_TYPE: 'patch' },
              createInitialCommit: false,
            },
            async (environment) => {
              await environment.writeFile(
                'CHANGELOG.md',
                buildChangelog(`
                  ## [Unreleased]

                  [Unreleased]: https://github.com/example-org/example-repo
                `),
              );
              await environment.createCommit('Initial commit');

              await environment.runAction();

              expect(await environment.readFile('CHANGELOG.md')).toStrictEqual(
                buildChangelog(`
                  ## [Unreleased]

                  ## [1.0.1]
                  ### Uncategorized
                  - Initial commit

                  [Unreleased]: https://github.com/example-org/example-repo/compare/v1.0.1...HEAD
                  [1.0.1]: https://github.com/example-org/example-repo/releases/tag/v1.0.1
                `),
              );
            },
          );
        });
      });

      describe('if the repo has a tag for the current version of the package', () => {
        it('updates the current version to the specified version', async () => {
          await withPolyrepoProjectEnvironment(
            {
              commandEnv: { RELEASE_TYPE: 'patch' },
            },
            async (environment) => {
              await environment.updateJsonFile('package.json', {
                name: 'root',
                version: '1.2.3',
              });
              await environment.createCommit('Release v1.2.3');
              await environment.runCommand('git', ['tag', 'v1.2.3']);
              await environment.runCommand('git', ['push', '--tags']);

              await environment.runAction();

              const rootManifest = await environment.readJsonFile(
                'package.json',
              );
              expect(rootManifest.version).toStrictEqual('1.2.4');
            },
          );
        });

        it('updates the changelog by adding a new section which lists all commits that have been added since the latest tag', async () => {
          await withPolyrepoProjectEnvironment(
            {
              commandEnv: { RELEASE_TYPE: 'patch' },
              createInitialCommit: false,
            },
            async (environment) => {
              // Create and tag a release
              await environment.updateJsonFile('package.json', {
                name: 'root',
                version: '1.0.0',
              });

              await environment.writeFile(
                'CHANGELOG.md',
                buildChangelog(`
                  ## [Unreleased]

                  ## [1.0.0]
                  ### Added
                  - Initial commit

                  [Unreleased]: https://github.com/example-org/example-repo/compare/v1.0.0...HEAD
                  [1.0.0]: https://github.com/example-org/example-repo/releases/tag/v1.0.0
                `),
              );
              await environment.createCommit('Release v1.0.0');
              await environment.runCommand('git', ['tag', 'v1.0.0']);

              // Push all tags
              await environment.runCommand('git', ['push', '--tags']);

              // Make some changes
              await environment.writeFile('dummy.txt', 'Some content');
              await environment.createCommit('Update');

              // Run the action
              await environment.runAction();

              // Only the last commit should be added to the changelog
              expect(await environment.readFile('CHANGELOG.md')).toStrictEqual(
                buildChangelog(`
                  ## [Unreleased]

                  ## [1.0.1]
                  ### Uncategorized
                  - Update

                  ## [1.0.0]
                  ### Added
                  - Initial commit

                  [Unreleased]: https://github.com/example-org/example-repo/compare/v1.0.1...HEAD
                  [1.0.1]: https://github.com/example-org/example-repo/compare/v1.0.0...v1.0.1
                  [1.0.0]: https://github.com/example-org/example-repo/releases/tag/v1.0.0
                `),
              );
            },
          );
        });
      });
    });
  });

  describe('with a monorepo', () => {
    describe('given an exact release version', () => {
      describe('if the specified version is past 0.x', () => {
        describe('if the specified version is a major bump from the current root version', () => {
          describe('if the repo has no tags whatsoever', () => {
            it('updates the root package to the specified version, and updates all workspace packages to match, even if they are currently less than the root version', async () => {
              await withMonorepoProjectEnvironment(
                {
                  packages: {
                    $root$: {
                      name: 'root',
                      version: '1.1.9',
                      directory: '.',
                    },
                    a: {
                      name: 'a',
                      version: '0.1.2',
                      directory: 'packages/a',
                    },
                    b: {
                      name: 'b',
                      version: '1.1.4',
                      directory: 'packages/b',
                    },
                  },
                  workspaces: {
                    '.': ['packages/*'],
                  },
                  commandEnv: { RELEASE_VERSION: '2.0.0' },
                },
                async (environment) => {
                  await environment.runAction();

                  expect(
                    await environment.readJsonFile('package.json'),
                  ).toMatchObject({
                    name: 'root',
                    version: '2.0.0',
                  });

                  expect(
                    await environment.readJsonFile('packages/a/package.json'),
                  ).toMatchObject({
                    name: 'a',
                    version: '2.0.0',
                  });

                  expect(
                    await environment.readJsonFile('packages/b/package.json'),
                  ).toMatchObject({
                    name: 'b',
                    version: '2.0.0',
                  });
                },
              );
            });

            it("updates each workspace package's changelog by adding a new section which lists all commits concerning the package over the entire history of the repo", async () => {
              await withMonorepoProjectEnvironment(
                {
                  packages: {
                    $root$: {
                      name: 'root',
                      version: '1.0.0',
                      directory: '.',
                    },
                    a: {
                      name: 'a',
                      version: '1.0.0',
                      directory: 'packages/a',
                    },
                    b: {
                      name: 'b',
                      version: '1.0.0',
                      directory: 'packages/b',
                    },
                  },
                  workspaces: {
                    '.': ['packages/*'],
                  },
                  commandEnv: { RELEASE_VERSION: '2.0.0' },
                  createInitialCommit: false,
                },
                async (environment) => {
                  // Create an initial commit
                  await environment.writeFile(
                    'packages/a/CHANGELOG.md',
                    buildChangelog(`
                      ## [Unreleased]

                      [Unreleased]: https://github.com/example-org/example-repo
                    `),
                  );

                  await environment.writeFile(
                    'packages/b/CHANGELOG.md',
                    buildChangelog(`
                      ## [Unreleased]

                      [Unreleased]: https://github.com/example-org/example-repo
                    `),
                  );
                  await environment.createCommit('Initial commit');

                  // Create another commit that only changes "a"
                  await environment.writeFile(
                    'packages/a/dummy.txt',
                    'Some content',
                  );
                  await environment.createCommit('Update "a"');

                  // Run the action
                  await environment.runAction();

                  // Both changelogs should get updated, with an additional
                  // commit listed for "a"
                  expect(
                    await environment.readFile('packages/a/CHANGELOG.md'),
                  ).toStrictEqual(
                    buildChangelog(`
                      ## [Unreleased]

                      ## [2.0.0]
                      ### Uncategorized
                      - Update "a"
                      - Initial commit

                      [Unreleased]: https://github.com/example-org/example-repo/compare/v2.0.0...HEAD
                      [2.0.0]: https://github.com/example-org/example-repo/releases/tag/v2.0.0
                    `),
                  );

                  expect(
                    await environment.readFile('packages/b/CHANGELOG.md'),
                  ).toStrictEqual(
                    buildChangelog(`
                      ## [Unreleased]

                      ## [2.0.0]
                      ### Uncategorized
                      - Initial commit

                      [Unreleased]: https://github.com/example-org/example-repo/compare/v2.0.0...HEAD
                      [2.0.0]: https://github.com/example-org/example-repo/releases/tag/v2.0.0
                    `),
                  );
                },
              );
            });
          });

          describe('if the repo has a tag for the current version of each workspace package', () => {
            it("updates the root package to the specified version, and updates each workspace package to match, even if it has not changed since its current version's tag", async () => {
              await withMonorepoProjectEnvironment(
                {
                  workspaces: {
                    '.': ['packages/*'],
                  },
                  commandEnv: { RELEASE_VERSION: '2.0.0' },
                  createInitialCommit: false,
                },
                async (environment) => {
                  // Create and tag releases
                  await environment.updateJsonFile('package.json', {
                    name: 'root',
                    version: '1.1.9',
                  });
                  await environment.createCommit('Release v1.1.9');
                  await environment.runCommand('git', ['tag', 'v1.1.9']);
                  await environment.writeJsonFile('packages/a/package.json', {
                    name: 'a',
                    version: '0.1.2',
                  });
                  await environment.createCommit('Release v0.1.2');
                  await environment.runCommand('git', ['tag', 'v0.1.2']);
                  await environment.writeJsonFile('packages/b/package.json', {
                    name: 'b',
                    version: '1.1.4',
                  });
                  await environment.createCommit('Release v1.1.4');
                  await environment.runCommand('git', ['tag', 'v1.1.4']);

                  // Make some changes to "a" and "b"
                  await environment.writeFile(
                    'packages/a/dummy.txt',
                    'Some content',
                  );
                  await environment.createCommit('Update "a"');
                  await environment.writeFile(
                    'packages/b/dummy.txt',
                    'Some content',
                  );
                  await environment.createCommit('Update "b"');

                  // Release 0.1.3 (only bumps "a")
                  await environment.updateJsonFile('package.json', {
                    version: '0.1.3',
                  });

                  await environment.updateJsonFile('packages/a/package.json', {
                    version: '0.1.3',
                  });
                  await environment.createCommit('Release v0.1.3');
                  await environment.runCommand('git', ['tag', 'v0.1.3']);

                  // Push all tags
                  await environment.runCommand('git', ['push', '--tags']);

                  // Run the action
                  await environment.runAction();

                  // All manifests should be bumped
                  expect(
                    await environment.readJsonFile('package.json'),
                  ).toMatchObject({
                    name: 'root',
                    version: '2.0.0',
                  });

                  expect(
                    await environment.readJsonFile('packages/a/package.json'),
                  ).toMatchObject({
                    name: 'a',
                    version: '2.0.0',
                  });

                  expect(
                    await environment.readJsonFile('packages/b/package.json'),
                  ).toMatchObject({
                    name: 'b',
                    version: '2.0.0',
                  });
                },
              );
            });

            it("updates the changelog of each workspace package — even if it has not changed since its current version's tag — by adding a new section for the new release which lists all commits concerning the package that have been added since the latest tag of the whole repo", async () => {
              await withMonorepoProjectEnvironment(
                {
                  workspaces: {
                    '.': ['packages/*'],
                  },
                  commandEnv: { RELEASE_VERSION: '2.0.0' },
                  createInitialCommit: false,
                },
                async (environment) => {
                  // Create and tag releases
                  await environment.updateJsonFile('package.json', {
                    name: 'root',
                    version: '1.0.0',
                  });

                  await environment.writeJsonFile('packages/a/package.json', {
                    name: 'a',
                    version: '1.0.0',
                  });

                  await environment.writeFile(
                    'packages/a/CHANGELOG.md',
                    buildChangelog(`
                      ## [Unreleased]

                      ## [1.0.0]
                      ### Added
                      - Initial commit

                      [Unreleased]: https://github.com/example-org/example-repo/compare/v1.0.0...HEAD
                      [1.0.0]: https://github.com/example-org/example-repo/releases/tag/v1.0.0
                    `),
                  );

                  await environment.writeJsonFile('packages/b/package.json', {
                    name: 'b',
                    version: '1.0.0',
                  });

                  await environment.writeFile(
                    'packages/b/CHANGELOG.md',
                    buildChangelog(`
                      ## [Unreleased]

                      ## [1.0.0]
                      ### Added
                      - Initial commit

                      [Unreleased]: https://github.com/example-org/example-repo/compare/v1.0.0...HEAD
                      [1.0.0]: https://github.com/example-org/example-repo/releases/tag/v1.0.0
                    `),
                  );
                  await environment.createCommit('Release v1.0.0');
                  await environment.runCommand('git', ['tag', 'v1.0.0']);

                  // Push all tags
                  await environment.runCommand('git', ['push', '--tags']);

                  // Make some changes to just "a"
                  await environment.writeFile(
                    'packages/a/dummy.txt',
                    'Some content',
                  );
                  await environment.createCommit('Update "a"');

                  // Run the action
                  await environment.runAction();

                  // All package changelogs should be updated with a new
                  // section, even though there are no new changes in "b" since
                  // its last release
                  expect(
                    await environment.readFile('packages/a/CHANGELOG.md'),
                  ).toStrictEqual(
                    buildChangelog(`
                      ## [Unreleased]

                      ## [2.0.0]
                      ### Uncategorized
                      - Update "a"

                      ## [1.0.0]
                      ### Added
                      - Initial commit

                      [Unreleased]: https://github.com/example-org/example-repo/compare/v2.0.0...HEAD
                      [2.0.0]: https://github.com/example-org/example-repo/compare/v1.0.0...v2.0.0
                      [1.0.0]: https://github.com/example-org/example-repo/releases/tag/v1.0.0
                    `),
                  );

                  expect(
                    await environment.readFile('packages/b/CHANGELOG.md'),
                  ).toStrictEqual(
                    buildChangelog(`
                      ## [Unreleased]

                      ## [2.0.0]

                      ## [1.0.0]
                      ### Added
                      - Initial commit

                      [Unreleased]: https://github.com/example-org/example-repo/compare/v2.0.0...HEAD
                      [2.0.0]: https://github.com/example-org/example-repo/compare/v1.0.0...v2.0.0
                      [1.0.0]: https://github.com/example-org/example-repo/releases/tag/v1.0.0
                    `),
                  );
                },
              );
            });

            it("does not backfill a workspace package's changelog with commits that can be found in a past release, or past releases altogether, which exist but were not added to the changelog when they were created", async () => {
              await withMonorepoProjectEnvironment(
                {
                  workspaces: {
                    '.': ['packages/*'],
                  },
                  commandEnv: { RELEASE_VERSION: '2.0.0' },
                  createInitialCommit: false,
                },
                async (environment) => {
                  // Make some commits for "a" and "b"
                  await environment.writeFile(
                    'packages/a/dummy.txt',
                    'Some content',
                  );
                  await environment.createCommit('Update "a"');
                  await environment.writeFile(
                    'packages/b/dummy.txt',
                    'Some content',
                  );
                  await environment.createCommit('Update "b"');

                  // Create a release. Note how the release is not listed in the
                  // changelog for "a", whereas it is listed for "b" but none of
                  // the commits in the actual release are listed.
                  await environment.updateJsonFile('package.json', {
                    name: 'root',
                    version: '1.0.0',
                  });

                  await environment.writeJsonFile('packages/a/package.json', {
                    name: 'a',
                    version: '1.0.0',
                  });

                  await environment.writeFile(
                    'packages/a/CHANGELOG.md',
                    buildChangelog(`
                      ## [Unreleased]

                      [Unreleased]: https://github.com/example-org/example-repo
                    `),
                  );

                  await environment.writeJsonFile('packages/b/package.json', {
                    name: 'b',
                    version: '1.0.0',
                  });

                  await environment.writeFile(
                    'packages/b/CHANGELOG.md',
                    buildChangelog(`
                      ## [Unreleased]

                      ## [1.0.0]

                      [Unreleased]: https://github.com/example-org/example-repo/compare/v1.0.0...HEAD
                      [1.0.0]: https://github.com/example-org/example-repo/releases/tag/v1.0.0
                    `),
                  );
                  await environment.createCommit('Release v1.0.0');
                  await environment.runCommand('git', ['tag', 'v1.0.0']);

                  // Push all tags
                  await environment.runCommand('git', ['push', '--tags']);

                  // Run the action
                  await environment.runAction();

                  // The changelog for "a" and "b" should get updated with the
                  // new release, but neither commits nor releases should get
                  // backfilled
                  expect(
                    await environment.readFile('packages/a/CHANGELOG.md'),
                  ).toStrictEqual(
                    buildChangelog(`
                      ## [Unreleased]

                      ## [2.0.0]

                      [Unreleased]: https://github.com/example-org/example-repo/compare/v2.0.0...HEAD
                      [2.0.0]: https://github.com/example-org/example-repo/releases/tag/v2.0.0
                    `),
                  );

                  expect(
                    await environment.readFile('packages/b/CHANGELOG.md'),
                  ).toStrictEqual(
                    buildChangelog(`
                      ## [Unreleased]

                      ## [2.0.0]

                      ## [1.0.0]

                      [Unreleased]: https://github.com/example-org/example-repo/compare/v2.0.0...HEAD
                      [2.0.0]: https://github.com/example-org/example-repo/compare/v1.0.0...v2.0.0
                      [1.0.0]: https://github.com/example-org/example-repo/releases/tag/v1.0.0
                    `),
                  );
                },
              );
            });
          });

          describe('when a workspace package exists for which no tag matches its current version', () => {
            it('does not throw an error', async () => {
              await withMonorepoProjectEnvironment(
                {
                  workspaces: {
                    '.': ['packages/*'],
                  },
                  commandEnv: { RELEASE_VERSION: '2.0.0' },
                  createInitialCommit: false,
                },
                async (environment) => {
                  // Create and tag releases
                  await environment.updateJsonFile('package.json', {
                    name: 'root',
                    version: '1.0.0',
                  });

                  await environment.writeJsonFile('packages/a/package.json', {
                    name: 'a',
                    version: '1.0.0',
                  });

                  await environment.writeFile(
                    'packages/a/CHANGELOG.md',
                    buildChangelog(`
                      ## [Unreleased]

                      ## [1.0.0]
                      ### Added
                      - Initial commit

                      [Unreleased]: https://github.com/example-org/example-repo/compare/v1.0.0...HEAD
                      [1.0.0]: https://github.com/example-org/example-repo/releases/tag/v1.0.0
                    `),
                  );
                  await environment.createCommit('Release v1.0.0');
                  await environment.runCommand('git', ['tag', 'v1.0.0']);

                  // Bump "a", but don't push a release tag
                  await environment.writeJsonFile('packages/a/package.json', {
                    name: 'a',
                    version: '9.0.0',
                  });
                  await environment.createCommit('Update "a"');

                  // Run the action
                  const result = await environment.runAction();

                  // This should work
                  expect(result.exitCode).toBe(0);
                },
              );
            });
          });
        });

        describe('if the specified version is a minor bump from the current root version', () => {
          describe('if the repo has no tags whatsoever', () => {
            it('updates the root package to the specified version, and updates all workspace packages to match, even if they are current less than the root version', async () => {
              await withMonorepoProjectEnvironment(
                {
                  packages: {
                    $root$: {
                      name: 'root',
                      version: '1.1.4',
                      directory: '.',
                    },
                    a: {
                      name: 'a',
                      version: '0.1.2',
                      directory: 'packages/a',
                    },
                    b: {
                      name: 'b',
                      version: '0.1.4',
                      directory: 'packages/b',
                    },
                  },
                  workspaces: {
                    '.': ['packages/*'],
                  },
                  commandEnv: { RELEASE_VERSION: '1.2.3' },
                },
                async (environment) => {
                  await environment.runAction();

                  expect(
                    await environment.readJsonFile('package.json'),
                  ).toMatchObject({
                    name: 'root',
                    version: '1.2.3',
                  });

                  expect(
                    await environment.readJsonFile('packages/a/package.json'),
                  ).toMatchObject({
                    name: 'a',
                    version: '1.2.3',
                  });

                  expect(
                    await environment.readJsonFile('packages/b/package.json'),
                  ).toMatchObject({
                    name: 'b',
                    version: '1.2.3',
                  });
                },
              );
            });

            it("updates each workspace package's changelog by adding a new section concerning the package which lists all commits over the entire history of the repo", async () => {
              await withMonorepoProjectEnvironment(
                {
                  packages: {
                    $root$: {
                      name: 'root',
                      version: '1.1.4',
                      directory: '.',
                    },
                    a: {
                      name: 'a',
                      version: '0.1.2',
                      directory: 'packages/a',
                    },
                    b: {
                      name: 'b',
                      version: '0.1.4',
                      directory: 'packages/b',
                    },
                  },
                  workspaces: {
                    '.': ['packages/*'],
                  },
                  commandEnv: { RELEASE_VERSION: '1.2.3' },
                  createInitialCommit: false,
                },
                async (environment) => {
                  // Create an initial commit
                  await environment.writeFile(
                    'packages/a/CHANGELOG.md',
                    buildChangelog(`
                      ## [Unreleased]

                      [Unreleased]: https://github.com/example-org/example-repo
                    `),
                  );

                  await environment.writeFile(
                    'packages/b/CHANGELOG.md',
                    buildChangelog(`
                      ## [Unreleased]

                      [Unreleased]: https://github.com/example-org/example-repo
                    `),
                  );
                  await environment.createCommit('Initial commit');

                  // Create another commit that only changes "a"
                  await environment.writeFile(
                    'packages/a/dummy.txt',
                    'Some content',
                  );
                  await environment.createCommit('Update "a"');

                  // Run the action
                  await environment.runAction();

                  // Both changelogs should get updated, with an additional
                  // commit listed for "a"
                  expect(
                    await environment.readFile('packages/a/CHANGELOG.md'),
                  ).toStrictEqual(
                    buildChangelog(`
                      ## [Unreleased]

                      ## [1.2.3]
                      ### Uncategorized
                      - Update "a"
                      - Initial commit

                      [Unreleased]: https://github.com/example-org/example-repo/compare/v1.2.3...HEAD
                      [1.2.3]: https://github.com/example-org/example-repo/releases/tag/v1.2.3
                    `),
                  );

                  expect(
                    await environment.readFile('packages/b/CHANGELOG.md'),
                  ).toStrictEqual(
                    buildChangelog(`
                      ## [Unreleased]

                      ## [1.2.3]
                      ### Uncategorized
                      - Initial commit

                      [Unreleased]: https://github.com/example-org/example-repo/compare/v1.2.3...HEAD
                      [1.2.3]: https://github.com/example-org/example-repo/releases/tag/v1.2.3
                    `),
                  );
                },
              );
            });
          });

          describe('if the repo has a tag for the current version of each workspace package', () => {
            it("updates the version for the root package, but also only each workspace package that has changed since its current version's tag", async () => {
              await withMonorepoProjectEnvironment(
                {
                  workspaces: {
                    '.': ['packages/*'],
                  },
                  commandEnv: { RELEASE_VERSION: '1.2.0' },
                  createInitialCommit: false,
                },
                async (environment) => {
                  // Create and tag releases
                  await environment.updateJsonFile('package.json', {
                    name: 'root',
                    version: '1.1.9',
                  });
                  await environment.createCommit('Release v0.1.4');
                  await environment.runCommand('git', ['tag', 'v0.1.4']);
                  await environment.writeJsonFile('packages/a/package.json', {
                    name: 'a',
                    version: '1.0.0',
                  });
                  await environment.createCommit('Release v0.1.2');
                  await environment.runCommand('git', ['tag', 'v0.1.2']);
                  await environment.writeJsonFile('packages/b/package.json', {
                    name: 'b',
                    version: '0.1.4',
                  });
                  await environment.createCommit('Release v1.1.9');
                  await environment.runCommand('git', ['tag', 'v1.1.9']);

                  // Make some changes to "a" and "b"
                  await environment.writeFile(
                    'packages/a/dummy.txt',
                    'Some content',
                  );
                  await environment.createCommit('Update "a"');
                  await environment.writeFile(
                    'packages/b/dummy.txt',
                    'Some content',
                  );
                  await environment.createCommit('Update "b"');

                  // Release 1.1.0 (only bumps "a")
                  await environment.updateJsonFile('package.json', {
                    version: '1.1.0',
                  });

                  await environment.updateJsonFile('packages/a/package.json', {
                    version: '1.1.0',
                  });
                  await environment.createCommit('Release v1.1.0');
                  await environment.runCommand('git', ['tag', 'v1.1.0']);

                  // Push all tags
                  await environment.runCommand('git', ['push', '--tags']);

                  // Run the action
                  await environment.runAction();

                  // Only "b" (and the root) should have been bumped
                  expect(
                    await environment.readJsonFile('package.json'),
                  ).toMatchObject({
                    name: 'root',
                    version: '1.2.0',
                  });

                  expect(
                    await environment.readJsonFile('packages/a/package.json'),
                  ).toMatchObject({
                    name: 'a',
                    version: '1.1.0',
                  });

                  expect(
                    await environment.readJsonFile('packages/b/package.json'),
                  ).toMatchObject({
                    name: 'b',
                    version: '1.2.0',
                  });
                },
              );
            });

            it("updates the changelog of each workspace package that has changed since its current version's tag by adding a new section which lists all commits concerning the package that have been added since the latest tag of the whole repo", async () => {
              await withMonorepoProjectEnvironment(
                {
                  workspaces: {
                    '.': ['packages/*'],
                  },
                  commandEnv: { RELEASE_VERSION: '1.1.0' },
                  createInitialCommit: false,
                },
                async (environment) => {
                  // Create and tag releases
                  await environment.updateJsonFile('package.json', {
                    name: 'root',
                    version: '1.0.0',
                  });

                  await environment.writeJsonFile('packages/a/package.json', {
                    name: 'a',
                    version: '1.0.0',
                  });

                  await environment.writeFile(
                    'packages/a/CHANGELOG.md',
                    buildChangelog(`
                      ## [Unreleased]

                      ## [1.0.0]
                      ### Added
                      - Initial commit

                      [Unreleased]: https://github.com/example-org/example-repo/compare/v1.0.0...HEAD
                      [1.0.0]: https://github.com/example-org/example-repo/releases/tag/v1.0.0
                    `),
                  );

                  await environment.writeJsonFile('packages/b/package.json', {
                    name: 'b',
                    version: '1.0.0',
                  });

                  await environment.writeFile(
                    'packages/b/CHANGELOG.md',
                    buildChangelog(`
                      ## [Unreleased]

                      ## [1.0.0]
                      ### Added
                      - Initial commit

                      [Unreleased]: https://github.com/example-org/example-repo/compare/v1.0.0...HEAD
                      [1.0.0]: https://github.com/example-org/example-repo/releases/tag/v1.0.0
                    `),
                  );
                  await environment.createCommit('Release v1.0.0');
                  await environment.runCommand('git', ['tag', 'v1.0.0']);

                  // Push all tags
                  await environment.runCommand('git', ['push', '--tags']);

                  // Make some changes to just "a"
                  await environment.writeFile(
                    'packages/a/dummy.txt',
                    'Some content',
                  );
                  await environment.createCommit('Update "a"');

                  // Run the action
                  await environment.runAction();

                  // Only the changelog for "a" should have been updated
                  expect(
                    await environment.readFile('packages/a/CHANGELOG.md'),
                  ).toStrictEqual(
                    buildChangelog(`
                      ## [Unreleased]

                      ## [1.1.0]
                      ### Uncategorized
                      - Update "a"

                      ## [1.0.0]
                      ### Added
                      - Initial commit

                      [Unreleased]: https://github.com/example-org/example-repo/compare/v1.1.0...HEAD
                      [1.1.0]: https://github.com/example-org/example-repo/compare/v1.0.0...v1.1.0
                      [1.0.0]: https://github.com/example-org/example-repo/releases/tag/v1.0.0
                    `),
                  );

                  expect(
                    await environment.readFile('packages/b/CHANGELOG.md'),
                  ).toStrictEqual(
                    buildChangelog(`
                      ## [Unreleased]

                      ## [1.0.0]
                      ### Added
                      - Initial commit

                      [Unreleased]: https://github.com/example-org/example-repo/compare/v1.0.0...HEAD
                      [1.0.0]: https://github.com/example-org/example-repo/releases/tag/v1.0.0
                    `),
                  );
                },
              );
            });

            it("does not backfill a workspace package's changelog with commits that can be found in a past release, or past releases altogether, which exist but were not added to the changelog when they were created", async () => {
              await withMonorepoProjectEnvironment(
                {
                  workspaces: {
                    '.': ['packages/*'],
                  },
                  commandEnv: { RELEASE_VERSION: '1.2.0' },
                  createInitialCommit: false,
                },
                async (environment) => {
                  // Make some commits for "a" and "b"
                  await environment.writeFile(
                    'packages/a/dummy.txt',
                    'Some content',
                  );
                  await environment.createCommit('Update "a"');
                  await environment.writeFile(
                    'packages/b/dummy.txt',
                    'Some content',
                  );
                  await environment.createCommit('Update "b"');

                  // Create a release. Note how the release is not listed in the
                  // changelog for "a", whereas it is listed for "b" but none of
                  // the commits in the actual release are listed.
                  await environment.updateJsonFile('package.json', {
                    name: 'root',
                    version: '1.0.0',
                  });

                  await environment.writeJsonFile('packages/a/package.json', {
                    name: 'a',
                    version: '1.0.0',
                  });

                  await environment.writeFile(
                    'packages/a/CHANGELOG.md',
                    buildChangelog(`
                      ## [Unreleased]

                      [Unreleased]: https://github.com/example-org/example-repo
                    `),
                  );

                  await environment.writeJsonFile('packages/b/package.json', {
                    name: 'b',
                    version: '1.0.0',
                  });

                  await environment.writeFile(
                    'packages/b/CHANGELOG.md',
                    buildChangelog(`
                      ## [Unreleased]

                      ## [1.0.0]

                      [Unreleased]: https://github.com/example-org/example-repo/compare/v1.0.0...HEAD
                      [1.0.0]: https://github.com/example-org/example-repo/releases/tag/v1.0.0
                    `),
                  );
                  await environment.createCommit('Release v1.0.0');
                  await environment.runCommand('git', ['tag', 'v1.0.0']);

                  // Push all tags
                  await environment.runCommand('git', ['push', '--tags']);

                  // Run the action (which will fail because of nothing to
                  // update)
                  await expect(environment.runAction()).rejects.toThrow(
                    expect.objectContaining({
                      message: expect.stringContaining(
                        'There are no packages to update.',
                      ),
                    }),
                  );

                  // Nothing should get updated
                  expect(
                    await environment.readFile('packages/a/CHANGELOG.md'),
                  ).toStrictEqual(
                    buildChangelog(`
                      ## [Unreleased]

                      [Unreleased]: https://github.com/example-org/example-repo
                    `),
                  );

                  expect(
                    await environment.readFile('packages/b/CHANGELOG.md'),
                  ).toStrictEqual(
                    buildChangelog(`
                      ## [Unreleased]

                      ## [1.0.0]

                      [Unreleased]: https://github.com/example-org/example-repo/compare/v1.0.0...HEAD
                      [1.0.0]: https://github.com/example-org/example-repo/releases/tag/v1.0.0
                    `),
                  );
                },
              );
            });
          });

          describe('when a workspace package exists for which no tag matches its current version', () => {
            it('throws an error', async () => {
              await withMonorepoProjectEnvironment(
                {
                  workspaces: {
                    '.': ['packages/*'],
                  },
                  commandEnv: { RELEASE_VERSION: '1.1.0' },
                  createInitialCommit: false,
                },
                async (environment) => {
                  // Create and tag releases
                  await environment.updateJsonFile('package.json', {
                    name: 'root',
                    version: '1.0.0',
                  });

                  await environment.writeJsonFile('packages/a/package.json', {
                    name: 'a',
                    version: '1.0.0',
                  });

                  await environment.writeFile(
                    'packages/a/CHANGELOG.md',
                    buildChangelog(`
                      ## [Unreleased]

                      ## [1.0.0]
                      ### Added
                      - Initial commit

                      [Unreleased]: https://github.com/example-org/example-repo/compare/v1.0.0...HEAD
                      [1.0.0]: https://github.com/example-org/example-repo/releases/tag/v1.0.0
                    `),
                  );
                  await environment.createCommit('Release v1.0.0');
                  await environment.runCommand('git', ['tag', 'v1.0.0']);

                  // Bump "a", but don't push a release tag
                  await environment.writeJsonFile('packages/a/package.json', {
                    name: 'a',
                    version: '9.0.0',
                  });
                  await environment.createCommit('Update "a"');

                  // The action shouldn't work
                  await expect(environment.runAction()).rejects.toThrow(
                    expect.objectContaining({
                      message: expect.stringContaining(
                        'Package "a" has version "9.0.0" in its manifest, but no corresponding tag "v9.0.0" exists.',
                      ),
                    }),
                  );
                },
              );
            });
          });
        });

        describe('if the specified version is a patch bump from the current root version', () => {
          describe('if the repo has no tags whatsoever', () => {
            it('updates the root package to the specified version, and updates all workspace packages to match, even if they are current less than the root version', async () => {
              await withMonorepoProjectEnvironment(
                {
                  packages: {
                    $root$: {
                      name: 'root',
                      version: '1.1.0',
                      directory: '.',
                    },
                    a: {
                      name: 'a',
                      version: '1.0.0',
                      directory: 'packages/a',
                    },
                    b: {
                      name: 'b',
                      version: '0.2.1',
                      directory: 'packages/b',
                    },
                  },
                  workspaces: {
                    '.': ['packages/*'],
                  },
                  commandEnv: { RELEASE_VERSION: '1.1.1' },
                },
                async (environment) => {
                  await environment.runAction();

                  expect(
                    await environment.readJsonFile('package.json'),
                  ).toMatchObject({
                    name: 'root',
                    version: '1.1.1',
                  });

                  expect(
                    await environment.readJsonFile('packages/a/package.json'),
                  ).toMatchObject({
                    name: 'a',
                    version: '1.1.1',
                  });

                  expect(
                    await environment.readJsonFile('packages/b/package.json'),
                  ).toMatchObject({
                    name: 'b',
                    version: '1.1.1',
                  });
                },
              );
            });

            it("updates each workspace package's changelog by adding a new section concerning the package which lists all commits over the entire history of the repo", async () => {
              await withMonorepoProjectEnvironment(
                {
                  packages: {
                    $root$: {
                      name: 'root',
                      version: '1.1.0',
                      directory: '.',
                    },
                    a: {
                      name: 'a',
                      version: '1.0.0',
                      directory: 'packages/a',
                    },
                    b: {
                      name: 'b',
                      version: '0.2.1',
                      directory: 'packages/b',
                    },
                  },
                  workspaces: {
                    '.': ['packages/*'],
                  },
                  commandEnv: { RELEASE_VERSION: '1.1.1' },
                  createInitialCommit: false,
                },
                async (environment) => {
                  // Create an initial commit
                  await environment.writeFile(
                    'packages/a/CHANGELOG.md',
                    buildChangelog(`
                      ## [Unreleased]

                      [Unreleased]: https://github.com/example-org/example-repo
                    `),
                  );

                  await environment.writeFile(
                    'packages/b/CHANGELOG.md',
                    buildChangelog(`
                      ## [Unreleased]

                      [Unreleased]: https://github.com/example-org/example-repo
                    `),
                  );
                  await environment.createCommit('Initial commit');

                  // Create another commit that only changes "a"
                  await environment.writeFile(
                    'packages/a/dummy.txt',
                    'Some content',
                  );
                  await environment.createCommit('Update "a"');

                  // Run the action
                  await environment.runAction();

                  // Both changelogs should get updated, with an additional
                  // commit listed for "a"
                  expect(
                    await environment.readFile('packages/a/CHANGELOG.md'),
                  ).toStrictEqual(
                    buildChangelog(`
                      ## [Unreleased]

                      ## [1.1.1]
                      ### Uncategorized
                      - Update "a"
                      - Initial commit

                      [Unreleased]: https://github.com/example-org/example-repo/compare/v1.1.1...HEAD
                      [1.1.1]: https://github.com/example-org/example-repo/releases/tag/v1.1.1
                    `),
                  );

                  expect(
                    await environment.readFile('packages/b/CHANGELOG.md'),
                  ).toStrictEqual(
                    buildChangelog(`
                      ## [Unreleased]

                      ## [1.1.1]
                      ### Uncategorized
                      - Initial commit

                      [Unreleased]: https://github.com/example-org/example-repo/compare/v1.1.1...HEAD
                      [1.1.1]: https://github.com/example-org/example-repo/releases/tag/v1.1.1
                    `),
                  );
                },
              );
            });
          });

          describe('if the repo has a tag for the current version of each workspace package', () => {
            it("updates the version for the root package, but also only each workspace package that has changed since its current version's tag", async () => {
              await withMonorepoProjectEnvironment(
                {
                  workspaces: {
                    '.': ['packages/*'],
                  },
                  commandEnv: { RELEASE_VERSION: '1.1.1' },
                  createInitialCommit: false,
                },
                async (environment) => {
                  // Create and tag releases
                  await environment.updateJsonFile('package.json', {
                    name: 'root',
                    version: '1.1.0',
                  });
                  await environment.createCommit('Release v1.1.0');
                  await environment.runCommand('git', ['tag', 'v1.1.0']);
                  await environment.writeJsonFile('packages/a/package.json', {
                    name: 'a',
                    version: '1.0.0',
                  });
                  await environment.createCommit('Release v1.0.0');
                  await environment.runCommand('git', ['tag', 'v1.0.0']);
                  await environment.writeJsonFile('packages/b/package.json', {
                    name: 'b',
                    version: '0.1.4',
                  });
                  await environment.createCommit('Release v0.1.4');
                  await environment.runCommand('git', ['tag', 'v0.1.4']);

                  // Make some changes to "a" and "b"
                  await environment.writeFile(
                    'packages/a/dummy.txt',
                    'Some content',
                  );
                  await environment.createCommit('Update "a"');
                  await environment.writeFile(
                    'packages/b/dummy.txt',
                    'Some content',
                  );
                  await environment.createCommit('Update "b"');

                  // Release 1.0.1 (only bumps "a")
                  await environment.updateJsonFile('package.json', {
                    version: '1.0.1',
                  });

                  await environment.updateJsonFile('packages/a/package.json', {
                    version: '1.0.1',
                  });
                  await environment.createCommit('Release v1.0.1');
                  await environment.runCommand('git', ['tag', 'v1.0.1']);

                  // Push all tags
                  await environment.runCommand('git', ['push', '--tags']);

                  // Run the action
                  await environment.runAction();

                  // Only "b" (and the root) should have been bumped
                  expect(
                    await environment.readJsonFile('package.json'),
                  ).toMatchObject({
                    name: 'root',
                    version: '1.1.1',
                  });

                  expect(
                    await environment.readJsonFile('packages/a/package.json'),
                  ).toMatchObject({
                    name: 'a',
                    version: '1.0.1',
                  });

                  expect(
                    await environment.readJsonFile('packages/b/package.json'),
                  ).toMatchObject({
                    name: 'b',
                    version: '1.1.1',
                  });
                },
              );
            });

            it("updates the changelog of each workspace package that has changed since its current version's tag by adding a new section which lists all commits concerning the package that have been added since the latest tag of the whole repo", async () => {
              await withMonorepoProjectEnvironment(
                {
                  workspaces: {
                    '.': ['packages/*'],
                  },
                  commandEnv: { RELEASE_VERSION: '1.0.1' },
                  createInitialCommit: false,
                },
                async (environment) => {
                  // Create and tag releases
                  await environment.updateJsonFile('package.json', {
                    name: 'root',
                    version: '1.0.0',
                  });

                  await environment.writeJsonFile('packages/a/package.json', {
                    name: 'a',
                    version: '1.0.0',
                  });

                  await environment.writeFile(
                    'packages/a/CHANGELOG.md',
                    buildChangelog(`
                      ## [Unreleased]

                      ## [1.0.0]
                      ### Added
                      - Initial commit

                      [Unreleased]: https://github.com/example-org/example-repo/compare/v1.0.0...HEAD
                      [1.0.0]: https://github.com/example-org/example-repo/releases/tag/v1.0.0
                    `),
                  );

                  await environment.writeJsonFile('packages/b/package.json', {
                    name: 'b',
                    version: '1.0.0',
                  });

                  await environment.writeFile(
                    'packages/b/CHANGELOG.md',
                    buildChangelog(`
                      ## [Unreleased]

                      ## [1.0.0]
                      ### Added
                      - Initial commit

                      [Unreleased]: https://github.com/example-org/example-repo/compare/v1.0.0...HEAD
                      [1.0.0]: https://github.com/example-org/example-repo/releases/tag/v1.0.0
                    `),
                  );
                  await environment.createCommit('Release v1.0.0');
                  await environment.runCommand('git', ['tag', 'v1.0.0']);

                  // Push all tags
                  await environment.runCommand('git', ['push', '--tags']);

                  // Make some changes to just "a"
                  await environment.writeFile(
                    'packages/a/dummy.txt',
                    'Some content',
                  );
                  await environment.createCommit('Update "a"');

                  // Run the action
                  await environment.runAction();

                  // Only the changelog for "a" should have been updated
                  expect(
                    await environment.readFile('packages/a/CHANGELOG.md'),
                  ).toStrictEqual(
                    buildChangelog(`
                      ## [Unreleased]

                      ## [1.0.1]
                      ### Uncategorized
                      - Update "a"

                      ## [1.0.0]
                      ### Added
                      - Initial commit

                      [Unreleased]: https://github.com/example-org/example-repo/compare/v1.0.1...HEAD
                      [1.0.1]: https://github.com/example-org/example-repo/compare/v1.0.0...v1.0.1
                      [1.0.0]: https://github.com/example-org/example-repo/releases/tag/v1.0.0
                    `),
                  );

                  expect(
                    await environment.readFile('packages/b/CHANGELOG.md'),
                  ).toStrictEqual(
                    buildChangelog(`
                      ## [Unreleased]

                      ## [1.0.0]
                      ### Added
                      - Initial commit

                      [Unreleased]: https://github.com/example-org/example-repo/compare/v1.0.0...HEAD
                      [1.0.0]: https://github.com/example-org/example-repo/releases/tag/v1.0.0
                    `),
                  );
                },
              );
            });

            it("does not backfill a workspace package's changelog with commits that can be found in a past release, or past releases altogether, which exist but were not added to the changelog when they were created", async () => {
              await withMonorepoProjectEnvironment(
                {
                  workspaces: {
                    '.': ['packages/*'],
                  },
                  commandEnv: { RELEASE_VERSION: '1.0.1' },
                  createInitialCommit: false,
                },
                async (environment) => {
                  // Make some commits for "a" and "b"
                  await environment.writeFile(
                    'packages/a/dummy.txt',
                    'Some content',
                  );
                  await environment.createCommit('Update "a"');
                  await environment.writeFile(
                    'packages/b/dummy.txt',
                    'Some content',
                  );
                  await environment.createCommit('Update "b"');

                  // Create a release. Note how the release is not listed in the
                  // changelog for "a", whereas it is listed for "b" but none of
                  // the commits in the actual release are listed.
                  await environment.updateJsonFile('package.json', {
                    name: 'root',
                    version: '1.0.0',
                  });

                  await environment.writeJsonFile('packages/a/package.json', {
                    name: 'a',
                    version: '1.0.0',
                  });

                  await environment.writeFile(
                    'packages/a/CHANGELOG.md',
                    buildChangelog(`
                      ## [Unreleased]

                      [Unreleased]: https://github.com/example-org/example-repo
                    `),
                  );

                  await environment.writeJsonFile('packages/b/package.json', {
                    name: 'b',
                    version: '1.0.0',
                  });

                  await environment.writeFile(
                    'packages/b/CHANGELOG.md',
                    buildChangelog(`
                      ## [Unreleased]

                      ## [1.0.0]

                      [Unreleased]: https://github.com/example-org/example-repo/compare/v1.0.0...HEAD
                      [1.0.0]: https://github.com/example-org/example-repo/releases/tag/v1.0.0
                    `),
                  );
                  await environment.createCommit('Release v1.0.0');
                  await environment.runCommand('git', ['tag', 'v1.0.0']);

                  // Push all tags
                  await environment.runCommand('git', ['push', '--tags']);

                  // Run the action (which will fail because of nothing to
                  // update)
                  await expect(environment.runAction()).rejects.toThrow(
                    expect.objectContaining({
                      message: expect.stringContaining(
                        'There are no packages to update.',
                      ),
                    }),
                  );

                  // Nothing should get updated
                  expect(
                    await environment.readFile('packages/a/CHANGELOG.md'),
                  ).toStrictEqual(
                    buildChangelog(`
                      ## [Unreleased]

                      [Unreleased]: https://github.com/example-org/example-repo
                    `),
                  );

                  expect(
                    await environment.readFile('packages/b/CHANGELOG.md'),
                  ).toStrictEqual(
                    buildChangelog(`
                      ## [Unreleased]

                      ## [1.0.0]

                      [Unreleased]: https://github.com/example-org/example-repo/compare/v1.0.0...HEAD
                      [1.0.0]: https://github.com/example-org/example-repo/releases/tag/v1.0.0
                    `),
                  );
                },
              );
            });
          });

          describe('when a workspace package exists for which no tag matches its current version', () => {
            it('throws an error', async () => {
              await withMonorepoProjectEnvironment(
                {
                  workspaces: {
                    '.': ['packages/*'],
                  },
                  commandEnv: { RELEASE_VERSION: '1.0.1' },
                  createInitialCommit: false,
                },
                async (environment) => {
                  // Create and tag releases
                  await environment.updateJsonFile('package.json', {
                    name: 'root',
                    version: '1.0.0',
                  });

                  await environment.writeJsonFile('packages/a/package.json', {
                    name: 'a',
                    version: '1.0.0',
                  });

                  await environment.writeFile(
                    'packages/a/CHANGELOG.md',
                    buildChangelog(`
                      ## [Unreleased]

                      ## [1.0.0]
                      ### Added
                      - Initial commit

                      [Unreleased]: https://github.com/example-org/example-repo/compare/v1.0.0...HEAD
                      [1.0.0]: https://github.com/example-org/example-repo/releases/tag/v1.0.0
                    `),
                  );
                  await environment.createCommit('Release v1.0.0');
                  await environment.runCommand('git', ['tag', 'v1.0.0']);

                  // Bump "a", but don't push a release tag
                  await environment.writeJsonFile('packages/a/package.json', {
                    name: 'a',
                    version: '9.0.0',
                  });
                  await environment.createCommit('Update "a"');

                  // The action shouldn't work
                  await expect(environment.runAction()).rejects.toThrow(
                    expect.objectContaining({
                      message: expect.stringContaining(
                        'Package "a" has version "9.0.0" in its manifest, but no corresponding tag "v9.0.0" exists.',
                      ),
                    }),
                  );
                },
              );
            });
          });
        });
      });

      describe('if the specified version is within 0.x', () => {
        describe('if the repo has no tags whatsoever', () => {
          it('updates the root package to the specified version, and updates all workspace packages to match, even if they are current less than the root version', async () => {
            await withMonorepoProjectEnvironment(
              {
                packages: {
                  $root$: {
                    name: 'root',
                    version: '0.1.4',
                    directory: '.',
                  },
                  a: {
                    name: 'a',
                    version: '0.1.2',
                    directory: 'packages/a',
                  },
                  b: {
                    name: 'b',
                    version: '0.5.0',
                    directory: 'packages/b',
                  },
                },
                workspaces: {
                  '.': ['packages/*'],
                },
                commandEnv: { RELEASE_VERSION: '0.7.9' },
              },
              async (environment) => {
                await environment.runAction();

                expect(
                  await environment.readJsonFile('package.json'),
                ).toMatchObject({
                  name: 'root',
                  version: '0.7.9',
                });

                expect(
                  await environment.readJsonFile('packages/a/package.json'),
                ).toMatchObject({
                  name: 'a',
                  version: '0.7.9',
                });

                expect(
                  await environment.readJsonFile('packages/b/package.json'),
                ).toMatchObject({
                  name: 'b',
                  version: '0.7.9',
                });
              },
            );
          });

          it("updates each workspace package's changelog by adding a new section which lists all commits concerning the package over the entire history of the repo", async () => {
            await withMonorepoProjectEnvironment(
              {
                packages: {
                  $root$: {
                    name: 'root',
                    version: '0.1.4',
                    directory: '.',
                  },
                  a: {
                    name: 'a',
                    version: '0.1.2',
                    directory: 'packages/a',
                  },
                  b: {
                    name: 'b',
                    version: '0.5.0',
                    directory: 'packages/b',
                  },
                },
                workspaces: {
                  '.': ['packages/*'],
                },
                commandEnv: { RELEASE_VERSION: '0.7.9' },
                createInitialCommit: false,
              },
              async (environment) => {
                // Create an initial commit
                await environment.writeFile(
                  'packages/a/CHANGELOG.md',
                  buildChangelog(`
                    ## [Unreleased]

                    [Unreleased]: https://github.com/example-org/example-repo
                  `),
                );

                await environment.writeFile(
                  'packages/b/CHANGELOG.md',
                  buildChangelog(`
                    ## [Unreleased]

                    [Unreleased]: https://github.com/example-org/example-repo
                  `),
                );
                await environment.createCommit('Initial commit');

                // Create another commit that only changes "a"
                await environment.writeFile(
                  'packages/a/dummy.txt',
                  'Some content',
                );
                await environment.createCommit('Update "a"');

                // Run the action
                await environment.runAction();

                // Both changelogs should get updated, with an additional
                // commit listed for "a"
                expect(
                  await environment.readFile('packages/a/CHANGELOG.md'),
                ).toStrictEqual(
                  buildChangelog(`
                    ## [Unreleased]

                    ## [0.7.9]
                    ### Uncategorized
                    - Update "a"
                    - Initial commit

                    [Unreleased]: https://github.com/example-org/example-repo/compare/v0.7.9...HEAD
                    [0.7.9]: https://github.com/example-org/example-repo/releases/tag/v0.7.9
                  `),
                );

                expect(
                  await environment.readFile('packages/b/CHANGELOG.md'),
                ).toStrictEqual(
                  buildChangelog(`
                    ## [Unreleased]

                    ## [0.7.9]
                    ### Uncategorized
                    - Initial commit

                    [Unreleased]: https://github.com/example-org/example-repo/compare/v0.7.9...HEAD
                    [0.7.9]: https://github.com/example-org/example-repo/releases/tag/v0.7.9
                  `),
                );
              },
            );
          });
        });

        describe('if the repo has a tag for the current version of each workspace package', () => {
          it("updates the root package to the specified version, and updates each workspace package to match, even if it has not changed since its current version's tag", async () => {
            await withMonorepoProjectEnvironment(
              {
                workspaces: {
                  '.': ['packages/*'],
                },
                commandEnv: { RELEASE_VERSION: '0.2.0' },
                createInitialCommit: false,
              },
              async (environment) => {
                // Create and tag releases
                await environment.updateJsonFile('package.json', {
                  name: 'root',
                  version: '0.1.8',
                });
                await environment.createCommit('Release v0.1.8');
                await environment.runCommand('git', ['tag', 'v0.1.8']);
                await environment.writeJsonFile('packages/a/package.json', {
                  name: 'a',
                  version: '0.1.3',
                });
                await environment.createCommit('Release v0.1.3');
                await environment.runCommand('git', ['tag', 'v0.1.3']);
                await environment.writeJsonFile('packages/b/package.json', {
                  name: 'b',
                  version: '0.1.1',
                });
                await environment.createCommit('Release v0.1.9');
                await environment.runCommand('git', ['tag', 'v0.1.9']);

                // Make some changes to "a" and "b"
                await environment.writeFile(
                  'packages/a/dummy.txt',
                  'Some content',
                );
                await environment.createCommit('Update "a"');
                await environment.writeFile(
                  'packages/b/dummy.txt',
                  'Some content',
                );
                await environment.createCommit('Update "b"');

                // Release 0.1.4 (only bumps "a")
                await environment.updateJsonFile('package.json', {
                  version: '0.1.4',
                });

                await environment.updateJsonFile('packages/a/package.json', {
                  version: '0.1.4',
                });
                await environment.createCommit('Release v0.1.4');
                await environment.runCommand('git', ['tag', 'v0.1.4']);

                // Push all tags
                await environment.runCommand('git', ['push', '--tags']);

                // Run the action
                await environment.runAction();

                // All manifests should be bumped
                expect(
                  await environment.readJsonFile('package.json'),
                ).toMatchObject({
                  name: 'root',
                  version: '0.2.0',
                });

                expect(
                  await environment.readJsonFile('packages/a/package.json'),
                ).toMatchObject({
                  name: 'a',
                  version: '0.2.0',
                });

                expect(
                  await environment.readJsonFile('packages/b/package.json'),
                ).toMatchObject({
                  name: 'b',
                  version: '0.2.0',
                });
              },
            );
          });

          it("updates the changelog of each workspace package — even if it has not changed since its current version's tag — by adding a new section for the new release which lists all commits concerning the package that have been added since the latest tag of the whole repo", async () => {
            await withMonorepoProjectEnvironment(
              {
                workspaces: {
                  '.': ['packages/*'],
                },
                commandEnv: { RELEASE_VERSION: '0.2.0' },
                createInitialCommit: false,
              },
              async (environment) => {
                // Create and tag releases
                await environment.updateJsonFile('package.json', {
                  name: 'root',
                  version: '0.1.0',
                });

                await environment.writeJsonFile('packages/a/package.json', {
                  name: 'a',
                  version: '0.1.0',
                });

                await environment.writeFile(
                  'packages/a/CHANGELOG.md',
                  buildChangelog(`
                    ## [Unreleased]

                    ## [0.1.0]
                    ### Added
                    - Initial commit

                    [Unreleased]: https://github.com/example-org/example-repo/compare/v0.1.0...HEAD
                    [0.1.0]: https://github.com/example-org/example-repo/releases/tag/v0.1.0
                  `),
                );

                await environment.writeJsonFile('packages/b/package.json', {
                  name: 'b',
                  version: '0.1.0',
                });

                await environment.writeFile(
                  'packages/b/CHANGELOG.md',
                  buildChangelog(`
                    ## [Unreleased]

                    ## [0.1.0]
                    ### Added
                    - Initial commit

                    [Unreleased]: https://github.com/example-org/example-repo/compare/v0.1.0...HEAD
                    [0.1.0]: https://github.com/example-org/example-repo/releases/tag/v0.1.0
                  `),
                );
                await environment.createCommit('Release v0.1.0');
                await environment.runCommand('git', ['tag', 'v0.1.0']);

                // Push all tags
                await environment.runCommand('git', ['push', '--tags']);

                // Make some changes to just "a"
                await environment.writeFile(
                  'packages/a/dummy.txt',
                  'Some content',
                );
                await environment.createCommit('Update "a"');

                // Run the action
                await environment.runAction();

                // All changelogs should have been updated
                expect(
                  await environment.readFile('packages/a/CHANGELOG.md'),
                ).toStrictEqual(
                  buildChangelog(`
                    ## [Unreleased]

                    ## [0.2.0]
                    ### Uncategorized
                    - Update "a"

                    ## [0.1.0]
                    ### Added
                    - Initial commit

                    [Unreleased]: https://github.com/example-org/example-repo/compare/v0.2.0...HEAD
                    [0.2.0]: https://github.com/example-org/example-repo/compare/v0.1.0...v0.2.0
                    [0.1.0]: https://github.com/example-org/example-repo/releases/tag/v0.1.0
                  `),
                );

                expect(
                  await environment.readFile('packages/b/CHANGELOG.md'),
                ).toStrictEqual(
                  buildChangelog(`
                    ## [Unreleased]

                    ## [0.2.0]

                    ## [0.1.0]
                    ### Added
                    - Initial commit

                    [Unreleased]: https://github.com/example-org/example-repo/compare/v0.2.0...HEAD
                    [0.2.0]: https://github.com/example-org/example-repo/compare/v0.1.0...v0.2.0
                    [0.1.0]: https://github.com/example-org/example-repo/releases/tag/v0.1.0
                  `),
                );
              },
            );
          });

          it("does not backfill a workspace package's changelog with commits that can be found in a past release, or past releases altogether, which exist but were not added to the changelog when they were created", async () => {
            await withMonorepoProjectEnvironment(
              {
                workspaces: {
                  '.': ['packages/*'],
                },
                commandEnv: { RELEASE_VERSION: '0.2.0' },
                createInitialCommit: false,
              },
              async (environment) => {
                // Make some commits for "a" and "b"
                await environment.writeFile(
                  'packages/a/dummy.txt',
                  'Some content',
                );
                await environment.createCommit('Update "a"');
                await environment.writeFile(
                  'packages/b/dummy.txt',
                  'Some content',
                );
                await environment.createCommit('Update "b"');

                // Create a release. Note how the release is not listed in the
                // changelog for "a", whereas it is listed for "b" but none of
                // the commits in the actual release are listed.
                await environment.updateJsonFile('package.json', {
                  name: 'root',
                  version: '0.1.0',
                });

                await environment.writeJsonFile('packages/a/package.json', {
                  name: 'a',
                  version: '0.1.0',
                });

                await environment.writeFile(
                  'packages/a/CHANGELOG.md',
                  buildChangelog(`
                    ## [Unreleased]

                    [Unreleased]: https://github.com/example-org/example-repo
                  `),
                );

                await environment.writeJsonFile('packages/b/package.json', {
                  name: 'b',
                  version: '0.1.0',
                });

                await environment.writeFile(
                  'packages/b/CHANGELOG.md',
                  buildChangelog(`
                    ## [Unreleased]

                    ## [0.1.0]

                    [Unreleased]: https://github.com/example-org/example-repo/compare/v0.1.0...HEAD
                    [0.1.0]: https://github.com/example-org/example-repo/releases/tag/v0.1.0
                  `),
                );
                await environment.createCommit('Release v0.1.0');
                await environment.runCommand('git', ['tag', 'v0.1.0']);

                // Push all tags
                await environment.runCommand('git', ['push', '--tags']);

                // Run the action
                await environment.runAction();

                // The changelog for "a" and "b" should get updated with the
                // new release, but neither commits nor releases should get
                // backfilled
                expect(
                  await environment.readFile('packages/a/CHANGELOG.md'),
                ).toStrictEqual(
                  buildChangelog(`
                    ## [Unreleased]

                    ## [0.2.0]

                    [Unreleased]: https://github.com/example-org/example-repo/compare/v0.2.0...HEAD
                    [0.2.0]: https://github.com/example-org/example-repo/releases/tag/v0.2.0
                  `),
                );

                expect(
                  await environment.readFile('packages/b/CHANGELOG.md'),
                ).toStrictEqual(
                  buildChangelog(`
                    ## [Unreleased]

                    ## [0.2.0]

                    ## [0.1.0]

                    [Unreleased]: https://github.com/example-org/example-repo/compare/v0.2.0...HEAD
                    [0.2.0]: https://github.com/example-org/example-repo/compare/v0.1.0...v0.2.0
                    [0.1.0]: https://github.com/example-org/example-repo/releases/tag/v0.1.0
                  `),
                );
              },
            );
          });
        });

        describe('when a workspace package exists for which no tag matches its current version', () => {
          it('does not throw an error', async () => {
            await withMonorepoProjectEnvironment(
              {
                workspaces: {
                  '.': ['packages/*'],
                },
                commandEnv: { RELEASE_VERSION: '0.1.1' },
                createInitialCommit: false,
              },
              async (environment) => {
                // Create and tag releases
                await environment.updateJsonFile('package.json', {
                  name: 'root',
                  version: '0.1.0',
                });

                await environment.writeJsonFile('packages/a/package.json', {
                  name: 'a',
                  version: '0.1.0',
                });

                await environment.writeFile(
                  'packages/a/CHANGELOG.md',
                  buildChangelog(`
                    ## [Unreleased]

                    ## [0.1.0]
                    ### Added
                    - Initial commit

                    [Unreleased]: https://github.com/example-org/example-repo/compare/v0.1.0...HEAD
                    [0.1.0]: https://github.com/example-org/example-repo/releases/tag/v0.1.0
                  `),
                );
                await environment.createCommit('Release v0.1.0');
                await environment.runCommand('git', ['tag', 'v0.1.0']);

                // Bump "a", but don't push a release tag
                await environment.writeJsonFile('packages/a/package.json', {
                  name: 'a',
                  version: '9.0.0',
                });
                await environment.createCommit('Update "a"');

                // Run the action
                const result = await environment.runAction();

                // This should work
                expect(result.exitCode).toBe(0);
              },
            );
          });
        });
      });

      describe('if the specified version is the same as the current root version', () => {
        it('throws an error', async () => {
          await withMonorepoProjectEnvironment(
            {
              packages: {
                $root$: {
                  name: 'root',
                  version: '1.0.0',
                  directory: '.',
                },
                a: {
                  name: 'a',
                  version: '1.1.3',
                  directory: 'packages/a',
                },
                b: {
                  name: 'b',
                  version: '0.2.1',
                  directory: 'packages/b',
                },
              },
              workspaces: {
                '.': ['packages/*'],
              },
              commandEnv: { RELEASE_VERSION: '1.0.0' },
            },
            async (environment) => {
              await expect(environment.runAction()).rejects.toThrow(
                expect.objectContaining({
                  message: expect.stringContaining(
                    'The new version "1.0.0" is not greater than the current version "1.0.0".',
                  ),
                }),
              );
            },
          );
        });
      });

      describe('if the specified version is less than the current version of the root package', () => {
        it('throws an error', async () => {
          await withMonorepoProjectEnvironment(
            {
              packages: {
                $root$: {
                  name: 'root',
                  version: '0.2.0',
                  directory: '.',
                },
                a: {
                  name: 'a',
                  version: '1.1.3',
                  directory: 'packages/a',
                },
                b: {
                  name: 'b',
                  version: '0.2.1',
                  directory: 'packages/b',
                },
              },
              workspaces: {
                '.': ['packages/*'],
              },
              commandEnv: { RELEASE_VERSION: '0.1.0' },
            },
            async (environment) => {
              await expect(environment.runAction()).rejects.toThrow(
                expect.objectContaining({
                  message: expect.stringContaining(
                    'The new version "0.1.0" is not greater than the current version "0.2.0".',
                  ),
                }),
              );
            },
          );
        });
      });

      describe('if the specified version is greater than the current version of the root package, but less than the current version of a workspace package', () => {
        it('does not throw an error', async () => {
          await withMonorepoProjectEnvironment(
            {
              workspaces: {
                '.': ['packages/*'],
              },
              commandEnv: { RELEASE_VERSION: '0.1.1' },
              createInitialCommit: false,
            },
            async (environment) => {
              await environment.updateJsonFile('package.json', {
                name: 'root',
                version: '0.1.0',
              });
              await environment.createCommit('Release v0.1.0');
              await environment.runCommand('git', ['tag', 'v0.1.0']);
              await environment.writeJsonFile('packages/a/package.json', {
                name: 'a',
                version: '0.2.0',
              });

              await environment.writeFile(
                'packages/a/CHANGELOG.md',
                buildChangelog(`
                 ## [Unreleased]

                 ## [0.2.0]
                 ### Added
                 - Some commit

                 [Unreleased]: https://github.com/example-org/example-repo/compare/v0.2.0...HEAD
                 [0.2.0]: https://github.com/example-org/example-repo/releases/tag/v0.2.0
               `),
              );
              await environment.createCommit('Release v0.2.0');
              await environment.runCommand('git', ['tag', 'v0.2.0']);

              const result = await environment.runAction();

              expect(result.exitCode).toBe(0);
            },
          );
        });
      });

      describe('if the specified version is greater than the current version of the root package, but the same as the current version of a workspace package (assuming there is an associated release tag)', () => {
        it('throws an error', async () => {
          await withMonorepoProjectEnvironment(
            {
              workspaces: {
                '.': ['packages/*'],
              },
              commandEnv: { RELEASE_VERSION: '0.1.1' },
              createInitialCommit: false,
            },
            async (environment) => {
              await environment.updateJsonFile('package.json', {
                name: 'root',
                version: '0.1.0',
              });
              await environment.createCommit('Release v0.1.0');
              await environment.runCommand('git', ['tag', 'v0.1.0']);
              await environment.writeJsonFile('packages/a/package.json', {
                name: 'a',
                version: '0.1.1',
              });

              await environment.writeFile(
                'packages/a/CHANGELOG.md',
                buildChangelog(`
                 ## [Unreleased]

                 ## [0.1.1]
                 ### Added
                 - Some commit

                 [Unreleased]: https://github.com/example-org/example-repo/compare/v0.1.1...HEAD
                 [0.1.1]: https://github.com/example-org/example-repo/releases/tag/v0.1.1
               `),
              );
              await environment.createCommit('Release v0.1.1');
              await environment.runCommand('git', ['tag', 'v0.1.1']);

              await expect(environment.runAction()).rejects.toThrow(
                expect.objectContaining({
                  message: expect.stringContaining(
                    'Tag "v0.1.1" for new version "0.1.1" already exists.',
                  ),
                }),
              );
            },
          );
        });
      });
    });

    describe('given a release type of "major"', () => {
      describe('if the repo has no tags whatsoever', () => {
        it('bumps the major part of the version of the root package, and updates the version of all workspace packages to match, even if they are different', async () => {
          await withMonorepoProjectEnvironment(
            {
              packages: {
                $root$: {
                  name: 'root',
                  version: '1.1.9',
                  directory: '.',
                },
                a: {
                  name: 'a',
                  version: '0.1.2',
                  directory: 'packages/a',
                },
                b: {
                  name: 'b',
                  version: '1.1.4',
                  directory: 'packages/b',
                },
              },
              workspaces: {
                '.': ['packages/*'],
              },
              commandEnv: { RELEASE_TYPE: 'major' },
            },
            async (environment) => {
              await environment.runAction();

              expect(
                await environment.readJsonFile('package.json'),
              ).toMatchObject({
                name: 'root',
                version: '2.0.0',
              });

              expect(
                await environment.readJsonFile('packages/a/package.json'),
              ).toMatchObject({
                name: 'a',
                version: '2.0.0',
              });

              expect(
                await environment.readJsonFile('packages/b/package.json'),
              ).toMatchObject({
                name: 'b',
                version: '2.0.0',
              });
            },
          );
        });

        it("updates each workspace package's changelog by adding a new section which lists all commits over the entire history of the repo", async () => {
          await withMonorepoProjectEnvironment(
            {
              packages: {
                $root$: {
                  name: 'root',
                  version: '1.0.0',
                  directory: '.',
                },
                a: {
                  name: 'a',
                  version: '1.0.0',
                  directory: 'packages/a',
                },
                b: {
                  name: 'b',
                  version: '1.0.0',
                  directory: 'packages/b',
                },
              },
              workspaces: {
                '.': ['packages/*'],
              },
              commandEnv: { RELEASE_TYPE: 'major' },
              createInitialCommit: false,
            },
            async (environment) => {
              await environment.writeFile(
                'packages/a/CHANGELOG.md',
                buildChangelog(`
                  ## [Unreleased]

                  [Unreleased]: https://github.com/example-org/example-repo
                `),
              );

              await environment.writeFile(
                'packages/b/CHANGELOG.md',
                buildChangelog(`
                  ## [Unreleased]

                  [Unreleased]: https://github.com/example-org/example-repo
                `),
              );
              await environment.createCommit('Initial commit');

              await environment.runAction();

              expect(
                await environment.readFile('packages/a/CHANGELOG.md'),
              ).toStrictEqual(
                buildChangelog(`
                  ## [Unreleased]

                  ## [2.0.0]
                  ### Uncategorized
                  - Initial commit

                  [Unreleased]: https://github.com/example-org/example-repo/compare/v2.0.0...HEAD
                  [2.0.0]: https://github.com/example-org/example-repo/releases/tag/v2.0.0
                `),
              );

              expect(
                await environment.readFile('packages/b/CHANGELOG.md'),
              ).toStrictEqual(
                buildChangelog(`
                  ## [Unreleased]

                  ## [2.0.0]
                  ### Uncategorized
                  - Initial commit

                  [Unreleased]: https://github.com/example-org/example-repo/compare/v2.0.0...HEAD
                  [2.0.0]: https://github.com/example-org/example-repo/releases/tag/v2.0.0
                `),
              );
            },
          );
        });
      });

      describe('if the repo has a tag for the current version of each workspace package', () => {
        it("updates the root package to the specified version, and updates each workspace package to match, even if it has not changed since its current version's tag", async () => {
          await withMonorepoProjectEnvironment(
            {
              workspaces: {
                '.': ['packages/*'],
              },
              commandEnv: { RELEASE_TYPE: 'major' },
              createInitialCommit: false,
            },
            async (environment) => {
              // Create and tag releases
              await environment.updateJsonFile('package.json', {
                name: 'root',
                version: '1.1.9',
              });
              await environment.createCommit('Release v1.1.9');
              await environment.runCommand('git', ['tag', 'v1.1.9']);
              await environment.writeJsonFile('packages/a/package.json', {
                name: 'a',
                version: '0.1.2',
              });
              await environment.createCommit('Release v0.1.2');
              await environment.runCommand('git', ['tag', 'v0.1.2']);
              await environment.writeJsonFile('packages/b/package.json', {
                name: 'b',
                version: '1.1.4',
              });
              await environment.createCommit('Release v1.1.4');
              await environment.runCommand('git', ['tag', 'v1.1.4']);

              // Make some changes to "a" and "b"
              await environment.writeFile(
                'packages/a/dummy.txt',
                'Some content',
              );
              await environment.createCommit('Update "a"');
              await environment.writeFile(
                'packages/b/dummy.txt',
                'Some content',
              );
              await environment.createCommit('Update "b"');

              // Release 1.1.10 (only bumps "a")
              await environment.updateJsonFile('package.json', {
                version: '1.1.10',
              });

              await environment.updateJsonFile('packages/a/package.json', {
                version: '1.1.10',
              });
              await environment.createCommit('Release v1.1.10');
              await environment.runCommand('git', ['tag', 'v1.1.10']);

              // Push all tags
              await environment.runCommand('git', ['push', '--tags']);

              // Run the action
              await environment.runAction();

              // All manifests should be bumped
              expect(
                await environment.readJsonFile('package.json'),
              ).toMatchObject({
                name: 'root',
                version: '2.0.0',
              });

              expect(
                await environment.readJsonFile('packages/a/package.json'),
              ).toMatchObject({
                name: 'a',
                version: '2.0.0',
              });

              expect(
                await environment.readJsonFile('packages/b/package.json'),
              ).toMatchObject({
                name: 'b',
                version: '2.0.0',
              });
            },
          );
        });

        it("updates the changelog of each workspace package — even if it has not changed since its current version's tag — by adding a new section for the new release which lists all commits that have been added since the latest tag of the whole repo", async () => {
          await withMonorepoProjectEnvironment(
            {
              workspaces: {
                '.': ['packages/*'],
              },
              commandEnv: { RELEASE_TYPE: 'major' },
              createInitialCommit: false,
            },
            async (environment) => {
              // Create and tag releases
              await environment.updateJsonFile('package.json', {
                name: 'root',
                version: '1.0.0',
              });

              await environment.writeJsonFile('packages/a/package.json', {
                name: 'a',
                version: '1.0.0',
              });

              await environment.writeFile(
                'packages/a/CHANGELOG.md',
                buildChangelog(`
                  ## [Unreleased]

                  ## [1.0.0]
                  ### Added
                  - Initial commit

                  [Unreleased]: https://github.com/example-org/example-repo/compare/v1.0.0...HEAD
                  [1.0.0]: https://github.com/example-org/example-repo/releases/tag/v1.0.0
                `),
              );

              await environment.writeJsonFile('packages/b/package.json', {
                name: 'b',
                version: '1.0.0',
              });

              await environment.writeFile(
                'packages/b/CHANGELOG.md',
                buildChangelog(`
                  ## [Unreleased]

                  ## [1.0.0]
                  ### Added
                  - Initial commit

                  [Unreleased]: https://github.com/example-org/example-repo/compare/v1.0.0...HEAD
                  [1.0.0]: https://github.com/example-org/example-repo/releases/tag/v1.0.0
                `),
              );
              await environment.createCommit('Release v1.0.0');
              await environment.runCommand('git', ['tag', 'v1.0.0']);

              // Push all tags
              await environment.runCommand('git', ['push', '--tags']);

              // Make some changes to just "a"
              await environment.writeFile(
                'packages/a/dummy.txt',
                'Some content',
              );
              await environment.createCommit('Update "a"');

              // Run the action
              await environment.runAction();

              // All package changelogs should be updated with a new
              // section, even though there are no new changes in "b" since
              // its last release
              expect(
                await environment.readFile('packages/a/CHANGELOG.md'),
              ).toStrictEqual(
                buildChangelog(`
                  ## [Unreleased]

                  ## [2.0.0]
                  ### Uncategorized
                  - Update "a"

                  ## [1.0.0]
                  ### Added
                  - Initial commit

                  [Unreleased]: https://github.com/example-org/example-repo/compare/v2.0.0...HEAD
                  [2.0.0]: https://github.com/example-org/example-repo/compare/v1.0.0...v2.0.0
                  [1.0.0]: https://github.com/example-org/example-repo/releases/tag/v1.0.0
                `),
              );

              expect(
                await environment.readFile('packages/b/CHANGELOG.md'),
              ).toStrictEqual(
                buildChangelog(`
                  ## [Unreleased]

                  ## [2.0.0]

                  ## [1.0.0]
                  ### Added
                  - Initial commit

                  [Unreleased]: https://github.com/example-org/example-repo/compare/v2.0.0...HEAD
                  [2.0.0]: https://github.com/example-org/example-repo/compare/v1.0.0...v2.0.0
                  [1.0.0]: https://github.com/example-org/example-repo/releases/tag/v1.0.0
                `),
              );
            },
          );
        });

        it("does not backfill a workspace package's changelog with commits that can be found in a past release, or past releases altogether, which exist but were not added to the changelog when they were created", async () => {
          await withMonorepoProjectEnvironment(
            {
              workspaces: {
                '.': ['packages/*'],
              },
              commandEnv: { RELEASE_TYPE: 'major' },
              createInitialCommit: false,
            },
            async (environment) => {
              // Make some commits for "a" and "b"
              await environment.writeFile(
                'packages/a/dummy.txt',
                'Some content',
              );
              await environment.createCommit('Update "a"');
              await environment.writeFile(
                'packages/b/dummy.txt',
                'Some content',
              );
              await environment.createCommit('Update "b"');

              // Create a release. Note how the release is not listed in the
              // changelog for "a", whereas it is listed for "b" but none of
              // the commits in the actual release are listed.
              await environment.updateJsonFile('package.json', {
                name: 'root',
                version: '1.0.0',
              });

              await environment.writeJsonFile('packages/a/package.json', {
                name: 'a',
                version: '1.0.0',
              });

              await environment.writeFile(
                'packages/a/CHANGELOG.md',
                buildChangelog(`
                  ## [Unreleased]

                  [Unreleased]: https://github.com/example-org/example-repo
                `),
              );

              await environment.writeJsonFile('packages/b/package.json', {
                name: 'b',
                version: '1.0.0',
              });

              await environment.writeFile(
                'packages/b/CHANGELOG.md',
                buildChangelog(`
                  ## [Unreleased]

                  ## [1.0.0]

                  [Unreleased]: https://github.com/example-org/example-repo/compare/v1.0.0...HEAD
                  [1.0.0]: https://github.com/example-org/example-repo/releases/tag/v1.0.0
                `),
              );
              await environment.createCommit('Release v1.0.0');
              await environment.runCommand('git', ['tag', 'v1.0.0']);

              // Push all tags
              await environment.runCommand('git', ['push', '--tags']);

              // Run the action
              await environment.runAction();

              // The changelog for "a" and "b" should get updated with the
              // new release, but neither commits nor releases should get
              // backfilled
              expect(
                await environment.readFile('packages/a/CHANGELOG.md'),
              ).toStrictEqual(
                buildChangelog(`
                  ## [Unreleased]

                  ## [2.0.0]

                  [Unreleased]: https://github.com/example-org/example-repo/compare/v2.0.0...HEAD
                  [2.0.0]: https://github.com/example-org/example-repo/releases/tag/v2.0.0
                `),
              );

              expect(
                await environment.readFile('packages/b/CHANGELOG.md'),
              ).toStrictEqual(
                buildChangelog(`
                  ## [Unreleased]

                  ## [2.0.0]

                  ## [1.0.0]

                  [Unreleased]: https://github.com/example-org/example-repo/compare/v2.0.0...HEAD
                  [2.0.0]: https://github.com/example-org/example-repo/compare/v1.0.0...v2.0.0
                  [1.0.0]: https://github.com/example-org/example-repo/releases/tag/v1.0.0
                `),
              );
            },
          );
        });
      });

      describe('when a workspace package exists for which no tag matches its current version', () => {
        it('does not throw an error', async () => {
          await withMonorepoProjectEnvironment(
            {
              workspaces: {
                '.': ['packages/*'],
              },
              commandEnv: { RELEASE_TYPE: 'major' },
              createInitialCommit: false,
            },
            async (environment) => {
              // Create and tag releases
              await environment.updateJsonFile('package.json', {
                name: 'root',
                version: '1.0.0',
              });

              await environment.writeJsonFile('packages/a/package.json', {
                name: 'a',
                version: '1.0.0',
              });

              await environment.writeFile(
                'packages/a/CHANGELOG.md',
                buildChangelog(`
                  ## [Unreleased]

                  ## [1.0.0]
                  ### Added
                  - Initial commit

                  [Unreleased]: https://github.com/example-org/example-repo/compare/v1.0.0...HEAD
                  [1.0.0]: https://github.com/example-org/example-repo/releases/tag/v1.0.0
                `),
              );
              await environment.createCommit('Release v1.0.0');
              await environment.runCommand('git', ['tag', 'v1.0.0']);

              // Bump "a", but don't push a release tag
              await environment.writeJsonFile('packages/a/package.json', {
                name: 'a',
                version: '9.0.0',
              });
              await environment.createCommit('Update "a"');

              // Run the action
              const result = await environment.runAction();

              // This should work
              expect(result.exitCode).toBe(0);
            },
          );
        });
      });
    });

    describe('given a release type of "minor"', () => {
      describe('if the repo has no tags whatsoever', () => {
        it('updates the root package to the specified version, and updates all workspace packages to match, even if they are currently less than the root version', async () => {
          await withMonorepoProjectEnvironment(
            {
              packages: {
                $root$: {
                  name: 'root',
                  version: '1.1.4',
                  directory: '.',
                },
                a: {
                  name: 'a',
                  version: '0.1.2',
                  directory: 'packages/a',
                },
                b: {
                  name: 'b',
                  version: '0.1.4',
                  directory: 'packages/b',
                },
              },
              workspaces: {
                '.': ['packages/*'],
              },
              commandEnv: { RELEASE_TYPE: 'minor' },
            },
            async (environment) => {
              await environment.runAction();

              expect(
                await environment.readJsonFile('package.json'),
              ).toMatchObject({
                name: 'root',
                version: '1.2.0',
              });

              expect(
                await environment.readJsonFile('packages/a/package.json'),
              ).toMatchObject({
                name: 'a',
                version: '1.2.0',
              });

              expect(
                await environment.readJsonFile('packages/b/package.json'),
              ).toMatchObject({
                name: 'b',
                version: '1.2.0',
              });
            },
          );
        });

        it("updates each workspace package's changelog by adding a new section which lists all commits concerning the package over the entire history of the repo", async () => {
          await withMonorepoProjectEnvironment(
            {
              packages: {
                $root$: {
                  name: 'root',
                  version: '1.1.4',
                  directory: '.',
                },
                a: {
                  name: 'a',
                  version: '0.1.2',
                  directory: 'packages/a',
                },
                b: {
                  name: 'b',
                  version: '0.1.4',
                  directory: 'packages/b',
                },
              },
              workspaces: {
                '.': ['packages/*'],
              },
              commandEnv: { RELEASE_TYPE: 'minor' },
              createInitialCommit: false,
            },
            async (environment) => {
              // Create an initial commit
              await environment.writeFile(
                'packages/a/CHANGELOG.md',
                buildChangelog(`
                  ## [Unreleased]

                  [Unreleased]: https://github.com/example-org/example-repo
                `),
              );

              await environment.writeFile(
                'packages/b/CHANGELOG.md',
                buildChangelog(`
                  ## [Unreleased]

                  [Unreleased]: https://github.com/example-org/example-repo
                `),
              );
              await environment.createCommit('Initial commit');

              // Create another commit that only changes "a"
              await environment.writeFile(
                'packages/a/dummy.txt',
                'Some content',
              );
              await environment.createCommit('Update "a"');

              // Run the action
              await environment.runAction();

              // Both changelogs should get updated, with an additional
              // commit listed for "a"
              expect(
                await environment.readFile('packages/a/CHANGELOG.md'),
              ).toStrictEqual(
                buildChangelog(`
                  ## [Unreleased]

                  ## [1.2.0]
                  ### Uncategorized
                  - Update "a"
                  - Initial commit

                  [Unreleased]: https://github.com/example-org/example-repo/compare/v1.2.0...HEAD
                  [1.2.0]: https://github.com/example-org/example-repo/releases/tag/v1.2.0
                `),
              );

              expect(
                await environment.readFile('packages/b/CHANGELOG.md'),
              ).toStrictEqual(
                buildChangelog(`
                  ## [Unreleased]

                  ## [1.2.0]
                  ### Uncategorized
                  - Initial commit

                  [Unreleased]: https://github.com/example-org/example-repo/compare/v1.2.0...HEAD
                  [1.2.0]: https://github.com/example-org/example-repo/releases/tag/v1.2.0
                `),
              );
            },
          );
        });
      });

      describe('if the repo has a tag for the current version of each workspace package', () => {
        it("updates the version for the root package, but also only each workspace package that has changed since its current version's tag", async () => {
          await withMonorepoProjectEnvironment(
            {
              workspaces: {
                '.': ['packages/*'],
              },
              commandEnv: { RELEASE_TYPE: 'minor' },
              createInitialCommit: false,
            },
            async (environment) => {
              // Create and tag releases
              await environment.updateJsonFile('package.json', {
                name: 'root',
                version: '1.1.9',
              });
              await environment.createCommit('Release v0.1.4');
              await environment.runCommand('git', ['tag', 'v0.1.4']);
              await environment.writeJsonFile('packages/a/package.json', {
                name: 'a',
                version: '1.0.0',
              });
              await environment.createCommit('Release v0.1.2');
              await environment.runCommand('git', ['tag', 'v0.1.2']);
              await environment.writeJsonFile('packages/b/package.json', {
                name: 'b',
                version: '0.1.4',
              });
              await environment.createCommit('Release v1.1.9');
              await environment.runCommand('git', ['tag', 'v1.1.9']);

              // Make some changes to "a" and "b"
              await environment.writeFile(
                'packages/a/dummy.txt',
                'Some content',
              );
              await environment.createCommit('Update "a"');
              await environment.writeFile(
                'packages/b/dummy.txt',
                'Some content',
              );
              await environment.createCommit('Update "b"');

              // Release 1.1.0 (only bumps "a")
              await environment.updateJsonFile('package.json', {
                version: '1.1.0',
              });

              await environment.updateJsonFile('packages/a/package.json', {
                version: '1.1.0',
              });
              await environment.createCommit('Release v1.1.0');
              await environment.runCommand('git', ['tag', 'v1.1.0']);

              // Push all tags
              await environment.runCommand('git', ['push', '--tags']);

              // Run the action
              await environment.runAction();

              // Only "b" (and the root) should have been bumped
              expect(
                await environment.readJsonFile('package.json'),
              ).toMatchObject({
                name: 'root',
                version: '1.2.0',
              });

              expect(
                await environment.readJsonFile('packages/a/package.json'),
              ).toMatchObject({
                name: 'a',
                version: '1.1.0',
              });

              expect(
                await environment.readJsonFile('packages/b/package.json'),
              ).toMatchObject({
                name: 'b',
                version: '1.2.0',
              });
            },
          );
        });

        it("updates the changelog of each workspace package that has changed since its current version's tag by adding a new section which lists all commits concerning the package that have been added since the latest tag of the whole repo", async () => {
          await withMonorepoProjectEnvironment(
            {
              workspaces: {
                '.': ['packages/*'],
              },
              commandEnv: { RELEASE_TYPE: 'minor' },
              createInitialCommit: false,
            },
            async (environment) => {
              // Create and tag releases
              await environment.updateJsonFile('package.json', {
                name: 'root',
                version: '1.0.0',
              });

              await environment.writeJsonFile('packages/a/package.json', {
                name: 'a',
                version: '1.0.0',
              });

              await environment.writeFile(
                'packages/a/CHANGELOG.md',
                buildChangelog(`
                  ## [Unreleased]

                  ## [1.0.0]
                  ### Added
                  - Initial commit

                  [Unreleased]: https://github.com/example-org/example-repo/compare/v1.0.0...HEAD
                  [1.0.0]: https://github.com/example-org/example-repo/releases/tag/v1.0.0
                `),
              );

              await environment.writeJsonFile('packages/b/package.json', {
                name: 'b',
                version: '1.0.0',
              });

              await environment.writeFile(
                'packages/b/CHANGELOG.md',
                buildChangelog(`
                  ## [Unreleased]

                  ## [1.0.0]
                  ### Added
                  - Initial commit

                  [Unreleased]: https://github.com/example-org/example-repo/compare/v1.0.0...HEAD
                  [1.0.0]: https://github.com/example-org/example-repo/releases/tag/v1.0.0
                `),
              );
              await environment.createCommit('Release v1.0.0');
              await environment.runCommand('git', ['tag', 'v1.0.0']);

              // Push all tags
              await environment.runCommand('git', ['push', '--tags']);

              // Make some changes to just "a"
              await environment.writeFile(
                'packages/a/dummy.txt',
                'Some content',
              );
              await environment.createCommit('Update "a"');

              // Run the action
              await environment.runAction();

              // Only the changelog for "a" should have been updated
              expect(
                await environment.readFile('packages/a/CHANGELOG.md'),
              ).toStrictEqual(
                buildChangelog(`
                  ## [Unreleased]

                  ## [1.1.0]
                  ### Uncategorized
                  - Update "a"

                  ## [1.0.0]
                  ### Added
                  - Initial commit

                  [Unreleased]: https://github.com/example-org/example-repo/compare/v1.1.0...HEAD
                  [1.1.0]: https://github.com/example-org/example-repo/compare/v1.0.0...v1.1.0
                  [1.0.0]: https://github.com/example-org/example-repo/releases/tag/v1.0.0
                `),
              );

              expect(
                await environment.readFile('packages/b/CHANGELOG.md'),
              ).toStrictEqual(
                buildChangelog(`
                  ## [Unreleased]

                  ## [1.0.0]
                  ### Added
                  - Initial commit

                  [Unreleased]: https://github.com/example-org/example-repo/compare/v1.0.0...HEAD
                  [1.0.0]: https://github.com/example-org/example-repo/releases/tag/v1.0.0
                `),
              );
            },
          );
        });

        it("does not backfill a workspace package's changelog with commits that can be found in a past release, or past releases altogether, which exist but were not added to the changelog when they were created", async () => {
          await withMonorepoProjectEnvironment(
            {
              workspaces: {
                '.': ['packages/*'],
              },
              commandEnv: { RELEASE_TYPE: 'minor' },
              createInitialCommit: false,
            },
            async (environment) => {
              // Make some commits for "a" and "b"
              await environment.writeFile(
                'packages/a/dummy.txt',
                'Some content',
              );
              await environment.createCommit('Update "a"');
              await environment.writeFile(
                'packages/b/dummy.txt',
                'Some content',
              );
              await environment.createCommit('Update "b"');

              // Create a release. Note how the release is not listed in the
              // changelog for "a", whereas it is listed for "b" but none of
              // the commits in the actual release are listed.
              await environment.updateJsonFile('package.json', {
                name: 'root',
                version: '1.0.0',
              });

              await environment.writeJsonFile('packages/a/package.json', {
                name: 'a',
                version: '1.0.0',
              });

              await environment.writeFile(
                'packages/a/CHANGELOG.md',
                buildChangelog(`
                  ## [Unreleased]

                  [Unreleased]: https://github.com/example-org/example-repo
                `),
              );

              await environment.writeJsonFile('packages/b/package.json', {
                name: 'b',
                version: '1.0.0',
              });

              await environment.writeFile(
                'packages/b/CHANGELOG.md',
                buildChangelog(`
                  ## [Unreleased]

                  ## [1.0.0]

                  [Unreleased]: https://github.com/example-org/example-repo/compare/v1.0.0...HEAD
                  [1.0.0]: https://github.com/example-org/example-repo/releases/tag/v1.0.0
                `),
              );
              await environment.createCommit('Release v1.0.0');
              await environment.runCommand('git', ['tag', 'v1.0.0']);

              // Push all tags
              await environment.runCommand('git', ['push', '--tags']);

              // Run the action (which will fail because of nothing to
              // update)
              await expect(environment.runAction()).rejects.toThrow(
                expect.objectContaining({
                  message: expect.stringContaining(
                    'There are no packages to update.',
                  ),
                }),
              );

              // Nothing should get updated
              expect(
                await environment.readFile('packages/a/CHANGELOG.md'),
              ).toStrictEqual(
                buildChangelog(`
                  ## [Unreleased]

                  [Unreleased]: https://github.com/example-org/example-repo
                `),
              );

              expect(
                await environment.readFile('packages/b/CHANGELOG.md'),
              ).toStrictEqual(
                buildChangelog(`
                  ## [Unreleased]

                  ## [1.0.0]

                  [Unreleased]: https://github.com/example-org/example-repo/compare/v1.0.0...HEAD
                  [1.0.0]: https://github.com/example-org/example-repo/releases/tag/v1.0.0
                `),
              );
            },
          );
        });
      });

      describe('when a workspace package exists for which no tag matches its current version', () => {
        it('throws an error', async () => {
          await withMonorepoProjectEnvironment(
            {
              workspaces: {
                '.': ['packages/*'],
              },
              commandEnv: { RELEASE_TYPE: 'minor' },
              createInitialCommit: false,
            },
            async (environment) => {
              // Create and tag releases
              await environment.updateJsonFile('package.json', {
                name: 'root',
                version: '1.0.0',
              });

              await environment.writeJsonFile('packages/a/package.json', {
                name: 'a',
                version: '1.0.0',
              });

              await environment.writeFile(
                'packages/a/CHANGELOG.md',
                buildChangelog(`
                  ## [Unreleased]

                  ## [1.0.0]
                  ### Added
                  - Initial commit

                  [Unreleased]: https://github.com/example-org/example-repo/compare/v1.0.0...HEAD
                  [1.0.0]: https://github.com/example-org/example-repo/releases/tag/v1.0.0
                `),
              );
              await environment.createCommit('Release v1.0.0');
              await environment.runCommand('git', ['tag', 'v1.0.0']);

              // Bump "a", but don't push a release tag
              await environment.writeJsonFile('packages/a/package.json', {
                name: 'a',
                version: '9.0.0',
              });
              await environment.createCommit('Update "a"');

              // The action shouldn't work
              await expect(environment.runAction()).rejects.toThrow(
                expect.objectContaining({
                  message: expect.stringContaining(
                    'Package "a" has version "9.0.0" in its manifest, but no corresponding tag "v9.0.0" exists.',
                  ),
                }),
              );
            },
          );
        });
      });
    });

    describe('given a release type of "patch"', () => {
      describe('if the repo has no tags whatsoever', () => {
        it('updates the root package to the specified version, and updates all workspace packages to match, even if they are current less than the root version', async () => {
          await withMonorepoProjectEnvironment(
            {
              packages: {
                $root$: {
                  name: 'root',
                  version: '1.1.0',
                  directory: '.',
                },
                a: {
                  name: 'a',
                  version: '1.0.0',
                  directory: 'packages/a',
                },
                b: {
                  name: 'b',
                  version: '0.2.1',
                  directory: 'packages/b',
                },
              },
              workspaces: {
                '.': ['packages/*'],
              },
              commandEnv: { RELEASE_TYPE: 'patch' },
            },
            async (environment) => {
              await environment.runAction();

              expect(
                await environment.readJsonFile('package.json'),
              ).toMatchObject({
                name: 'root',
                version: '1.1.1',
              });

              expect(
                await environment.readJsonFile('packages/a/package.json'),
              ).toMatchObject({
                name: 'a',
                version: '1.1.1',
              });

              expect(
                await environment.readJsonFile('packages/b/package.json'),
              ).toMatchObject({
                name: 'b',
                version: '1.1.1',
              });
            },
          );
        });

        it("updates each workspace package's changelog by adding a new section which lists all commits concerning the package over the entire history of the repo", async () => {
          await withMonorepoProjectEnvironment(
            {
              packages: {
                $root$: {
                  name: 'root',
                  version: '1.1.0',
                  directory: '.',
                },
                a: {
                  name: 'a',
                  version: '1.0.0',
                  directory: 'packages/a',
                },
                b: {
                  name: 'b',
                  version: '0.2.1',
                  directory: 'packages/b',
                },
              },
              workspaces: {
                '.': ['packages/*'],
              },
              commandEnv: { RELEASE_TYPE: 'patch' },
              createInitialCommit: false,
            },
            async (environment) => {
              // Create an initial commit
              await environment.writeFile(
                'packages/a/CHANGELOG.md',
                buildChangelog(`
                  ## [Unreleased]

                  [Unreleased]: https://github.com/example-org/example-repo
                `),
              );

              await environment.writeFile(
                'packages/b/CHANGELOG.md',
                buildChangelog(`
                  ## [Unreleased]

                  [Unreleased]: https://github.com/example-org/example-repo
                `),
              );
              await environment.createCommit('Initial commit');

              // Create another commit that only changes "a"
              await environment.writeFile(
                'packages/a/dummy.txt',
                'Some content',
              );
              await environment.createCommit('Update "a"');

              // Run the action
              await environment.runAction();

              // Both changelogs should get updated, with an additional
              // commit listed for "a"
              expect(
                await environment.readFile('packages/a/CHANGELOG.md'),
              ).toStrictEqual(
                buildChangelog(`
                  ## [Unreleased]

                  ## [1.1.1]
                  ### Uncategorized
                  - Update "a"
                  - Initial commit

                  [Unreleased]: https://github.com/example-org/example-repo/compare/v1.1.1...HEAD
                  [1.1.1]: https://github.com/example-org/example-repo/releases/tag/v1.1.1
                `),
              );

              expect(
                await environment.readFile('packages/b/CHANGELOG.md'),
              ).toStrictEqual(
                buildChangelog(`
                  ## [Unreleased]

                  ## [1.1.1]
                  ### Uncategorized
                  - Initial commit

                  [Unreleased]: https://github.com/example-org/example-repo/compare/v1.1.1...HEAD
                  [1.1.1]: https://github.com/example-org/example-repo/releases/tag/v1.1.1
                `),
              );
            },
          );
        });
      });

      describe('if the repo has a tag for the current version of each workspace package', () => {
        it("updates the version for the root package, but also only each workspace package that has changed since its current version's tag", async () => {
          await withMonorepoProjectEnvironment(
            {
              workspaces: {
                '.': ['packages/*'],
              },
              commandEnv: { RELEASE_TYPE: 'patch' },
              createInitialCommit: false,
            },
            async (environment) => {
              // Create and tag releases
              await environment.updateJsonFile('package.json', {
                name: 'root',
                version: '1.0.0',
              });
              await environment.createCommit('Release v1.1.0');
              await environment.runCommand('git', ['tag', 'v1.1.0']);
              await environment.writeJsonFile('packages/a/package.json', {
                name: 'a',
                version: '0.8.9',
              });
              await environment.createCommit('Release v0.8.9');
              await environment.runCommand('git', ['tag', 'v0.8.9']);
              await environment.writeJsonFile('packages/b/package.json', {
                name: 'b',
                version: '0.1.4',
              });
              await environment.createCommit('Release v0.1.4');
              await environment.runCommand('git', ['tag', 'v0.1.4']);

              // Make some changes to "a" and "b"
              await environment.writeFile(
                'packages/a/dummy.txt',
                'Some content',
              );
              await environment.createCommit('Update "a"');
              await environment.writeFile(
                'packages/b/dummy.txt',
                'Some content',
              );
              await environment.createCommit('Update "b"');

              // Release 1.0.1 (only bumps "a")
              await environment.updateJsonFile('package.json', {
                version: '1.0.1',
              });

              await environment.updateJsonFile('packages/a/package.json', {
                version: '1.0.1',
              });
              await environment.createCommit('Release v1.0.1');
              await environment.runCommand('git', ['tag', 'v1.0.1']);

              // Push all tags
              await environment.runCommand('git', ['push', '--tags']);

              // Run the action
              await environment.runAction();

              // Only "b" (and the root) should have been bumped
              expect(
                await environment.readJsonFile('package.json'),
              ).toMatchObject({
                name: 'root',
                version: '1.0.2',
              });

              expect(
                await environment.readJsonFile('packages/a/package.json'),
              ).toMatchObject({
                name: 'a',
                version: '1.0.1',
              });

              expect(
                await environment.readJsonFile('packages/b/package.json'),
              ).toMatchObject({
                name: 'b',
                version: '1.0.2',
              });
            },
          );
        });

        it("updates the changelog of each workspace package that has changed since its current version's tag by adding a new section which lists all commits concerning the package that have been added since the latest tag of the whole repo", async () => {
          await withMonorepoProjectEnvironment(
            {
              workspaces: {
                '.': ['packages/*'],
              },
              commandEnv: { RELEASE_TYPE: 'patch' },
              createInitialCommit: false,
            },
            async (environment) => {
              // Create and tag releases
              await environment.updateJsonFile('package.json', {
                name: 'root',
                version: '1.0.0',
              });

              await environment.writeJsonFile('packages/a/package.json', {
                name: 'a',
                version: '1.0.0',
              });

              await environment.writeFile(
                'packages/a/CHANGELOG.md',
                buildChangelog(`
                  ## [Unreleased]

                  ## [1.0.0]
                  ### Added
                  - Initial commit

                  [Unreleased]: https://github.com/example-org/example-repo/compare/v1.0.0...HEAD
                  [1.0.0]: https://github.com/example-org/example-repo/releases/tag/v1.0.0
                `),
              );

              await environment.writeJsonFile('packages/b/package.json', {
                name: 'b',
                version: '1.0.0',
              });

              await environment.writeFile(
                'packages/b/CHANGELOG.md',
                buildChangelog(`
                  ## [Unreleased]

                  ## [1.0.0]
                  ### Added
                  - Initial commit

                  [Unreleased]: https://github.com/example-org/example-repo/compare/v1.0.0...HEAD
                  [1.0.0]: https://github.com/example-org/example-repo/releases/tag/v1.0.0
                `),
              );
              await environment.createCommit('Release v1.0.0');
              await environment.runCommand('git', ['tag', 'v1.0.0']);

              // Push all tags
              await environment.runCommand('git', ['push', '--tags']);

              // Make some changes to just "a"
              await environment.writeFile(
                'packages/a/dummy.txt',
                'Some content',
              );
              await environment.createCommit('Update "a"');

              // Run the action
              await environment.runAction();

              // Only the changelog for "a" should have been updated
              expect(
                await environment.readFile('packages/a/CHANGELOG.md'),
              ).toStrictEqual(
                buildChangelog(`
                  ## [Unreleased]

                  ## [1.0.1]
                  ### Uncategorized
                  - Update "a"

                  ## [1.0.0]
                  ### Added
                  - Initial commit

                  [Unreleased]: https://github.com/example-org/example-repo/compare/v1.0.1...HEAD
                  [1.0.1]: https://github.com/example-org/example-repo/compare/v1.0.0...v1.0.1
                  [1.0.0]: https://github.com/example-org/example-repo/releases/tag/v1.0.0
                `),
              );

              expect(
                await environment.readFile('packages/b/CHANGELOG.md'),
              ).toStrictEqual(
                buildChangelog(`
                  ## [Unreleased]

                  ## [1.0.0]
                  ### Added
                  - Initial commit

                  [Unreleased]: https://github.com/example-org/example-repo/compare/v1.0.0...HEAD
                  [1.0.0]: https://github.com/example-org/example-repo/releases/tag/v1.0.0
                `),
              );
            },
          );
        });

        it("does not backfill a workspace package's changelog with commits that can be found in a past release, or past releases altogether, which exist but were not added to the changelog when they were created", async () => {
          await withMonorepoProjectEnvironment(
            {
              workspaces: {
                '.': ['packages/*'],
              },
              commandEnv: { RELEASE_TYPE: 'patch' },
              createInitialCommit: false,
            },
            async (environment) => {
              // Make some commits for "a" and "b"
              await environment.writeFile(
                'packages/a/dummy.txt',
                'Some content',
              );
              await environment.createCommit('Update "a"');
              await environment.writeFile(
                'packages/b/dummy.txt',
                'Some content',
              );
              await environment.createCommit('Update "b"');

              // Create a release. Note how the release is not listed in the
              // changelog for "a", whereas it is listed for "b" but none of
              // the commits in the actual release are listed.
              await environment.updateJsonFile('package.json', {
                name: 'root',
                version: '1.0.0',
              });

              await environment.writeJsonFile('packages/a/package.json', {
                name: 'a',
                version: '1.0.0',
              });

              await environment.writeFile(
                'packages/a/CHANGELOG.md',
                buildChangelog(`
                  ## [Unreleased]

                  [Unreleased]: https://github.com/example-org/example-repo
                `),
              );

              await environment.writeJsonFile('packages/b/package.json', {
                name: 'b',
                version: '1.0.0',
              });

              await environment.writeFile(
                'packages/b/CHANGELOG.md',
                buildChangelog(`
                  ## [Unreleased]

                  ## [1.0.0]

                  [Unreleased]: https://github.com/example-org/example-repo/compare/v1.0.0...HEAD
                  [1.0.0]: https://github.com/example-org/example-repo/releases/tag/v1.0.0
                `),
              );
              await environment.createCommit('Release v1.0.0');
              await environment.runCommand('git', ['tag', 'v1.0.0']);

              // Push all tags
              await environment.runCommand('git', ['push', '--tags']);

              // Run the action (which will fail because of nothing to
              // update)
              await expect(environment.runAction()).rejects.toThrow(
                expect.objectContaining({
                  message: expect.stringContaining(
                    'There are no packages to update.',
                  ),
                }),
              );

              // Nothing should get updated
              expect(
                await environment.readFile('packages/a/CHANGELOG.md'),
              ).toStrictEqual(
                buildChangelog(`
                  ## [Unreleased]

                  [Unreleased]: https://github.com/example-org/example-repo
                `),
              );

              expect(
                await environment.readFile('packages/b/CHANGELOG.md'),
              ).toStrictEqual(
                buildChangelog(`
                  ## [Unreleased]

                  ## [1.0.0]

                  [Unreleased]: https://github.com/example-org/example-repo/compare/v1.0.0...HEAD
                  [1.0.0]: https://github.com/example-org/example-repo/releases/tag/v1.0.0
                `),
              );
            },
          );
        });
      });

      describe('when a workspace package exists for which no tag matches its current version', () => {
        it('throws an error', async () => {
          await withMonorepoProjectEnvironment(
            {
              workspaces: {
                '.': ['packages/*'],
              },
              commandEnv: { RELEASE_TYPE: 'patch' },
              createInitialCommit: false,
            },
            async (environment) => {
              // Create and tag releases
              await environment.updateJsonFile('package.json', {
                name: 'root',
                version: '1.0.0',
              });

              await environment.writeJsonFile('packages/a/package.json', {
                name: 'a',
                version: '1.0.0',
              });

              await environment.writeFile(
                'packages/a/CHANGELOG.md',
                buildChangelog(`
                  ## [Unreleased]

                  ## [1.0.0]
                  ### Added
                  - Initial commit

                  [Unreleased]: https://github.com/example-org/example-repo/compare/v1.0.0...HEAD
                  [1.0.0]: https://github.com/example-org/example-repo/releases/tag/v1.0.0
                `),
              );
              await environment.createCommit('Release v1.0.0');
              await environment.runCommand('git', ['tag', 'v1.0.0']);

              // Bump "a", but don't push a release tag
              await environment.writeJsonFile('packages/a/package.json', {
                name: 'a',
                version: '9.0.0',
              });
              await environment.createCommit('Update "a"');

              // The action shouldn't work
              await expect(environment.runAction()).rejects.toThrow(
                expect.objectContaining({
                  message: expect.stringContaining(
                    'Package "a" has version "9.0.0" in its manifest, but no corresponding tag "v9.0.0" exists.',
                  ),
                }),
              );
            },
          );
        });
      });
    });
  });
});
