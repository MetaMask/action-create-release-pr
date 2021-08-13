# MetaMask/action-create-release-pr

## Description

This action creates a new release branch and PR. It also makes a commit that includes any release preparation that can be easily automated, which includes version bumps and a partial changelog updates (using `@metamask/auto-changelog`).

This action is only tested with Yarn v1.

### Monorepos

This action is compatible with monorepos, but only if they use workspaces. It uses the `workspaces` property of `package.json` to determine if the repo is a monorepo, and to find each workspace.

The release type and git history determine which packages are bumped. For major releases, all packages are bumped. But for minor and patch releases, the git history will be scanned to determine whether each package has changed since the previous version. Only packages with changes since the previous version will be bumped.

This action uses a synchronized versioning strategy, meaning that the version of the root `package.json` file will be set on any updated packages. Packages in the monorepo may fall behind in version if they don't have any changes, but they'll jump directly to the current version of the entire monorepo if they change at all. As a result, the version change for individual packages might be beyond what SemVer would recommend. For example, packages might get major version bumps despite having no breaking changes. This is unfortunate, but for us the benefits of this simplified versioning scheme outweigh the harms.

#### Adding New Packages

In order for this action to continue working after new packages have been added to a monorepo with previously released packages, simply make the following changes to the new package:

1. Set the `version` field in its `package.json` to the version of the most recently released package in the monorepo.
2. Run `yarn auto-changelog init` in the root directory of the new package.

## Usage

This Action can be used on its own, but we recommend using it with [MetaMask/action-publish-release](https://github.com/MetaMask/action-publish-release).

In order for this action to run, the project must have a [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)-compatible changelog, even if it's empty.
You should use [`@metamask/auto-changelog`](https://github.com/MetaMask/auto-changelog) to do this.

You must add the [Create Release Pull Request Workflow](#create-pull-request-workflow) (or something equivalent) to use this action.
Depending on the review processes of your organization, you may also want to add the [Require Additional Reviewer Workflow](#require-additional-reviewer-workflow).

### Create Release Pull Request Workflow

Add the workflow file referenced below to your repository in the path `.github/workflows/create-release-pr.yml`.
You'll notice that the workflow is manually triggered using the `workflow_dispatch` event.
Once you've added the workflow file, you trigger the workflow via the Actions tab of the [GitHub Web UI](https://github.blog/changelog/2020-07-06-github-actions-manual-triggers-with-workflow_dispatch/) or the [`gh` CLI](https://cli.github.com/manual/gh_workflow_run).

A `release-branch-prefix` input must be specified to the Action, which will be used as the prefix for the names of release PR branches.
The SemVer version being released is appended to the prefix.
The default prefix is `release/`, which creates branches named e.g. `release/1.0.0`.

If this Action is used with [MetaMask/action-publish-release](https://github.com/MetaMask/action-publish-release), both Actions must be configured to use the same branch prefix.
Their branch prefix defaults are the same within major versions.

- [`.github/workflows/create-release-pr.yml`](https://github.com/MetaMask/action-create-release-pr/blob/main/.github/workflows/create-release-pr.yml)
  \_ **This workflow file self-references this action with the string "`/.`". Replace that string with "`MetaMask/action-create-release-pr@v1`" in your workflow.**

## Contributing

### Setup

- Install [Node.js](https://nodejs.org) version 12
  - If you are using [nvm](https://github.com/creationix/nvm#installation) (recommended) running `nvm use` will automatically choose the right node version for you.
- Install [Yarn v1](https://yarnpkg.com/en/docs/install)
- Run `yarn setup` to install dependencies and run any requried post-install scripts
  - **Warning**: Do not use the `yarn` / `yarn install` command directly. Use `yarn setup` instead. The normal install command will skip required post-install scripts, leaving your development environment in an invalid state.

### Testing and Linting

Run `yarn test` to run the tests once. To run tests on file changes, run `yarn test:watch`.

Run `yarn lint` to run the linter, or run `yarn lint:fix` to run the linter and fix any automatically fixable issues.

### Releasing

The project follows the same release process as the other GitHub Actions in the MetaMask organization. The GitHub Actions [`action-create-release-pr`](https://github.com/MetaMask/action-create-release-pr) and [`action-publish-release`](https://github.com/MetaMask/action-publish-release) are used to automate the release process; see those repositories for more information about how they work.

1. Choose a release version.

   - The release version should be chosen according to SemVer. Analyze the changes to see whether they include any breaking changes, new features, or deprecations, then choose the appropriate SemVer version. See [the SemVer specification](https://semver.org/) for more information.

2. If this release is backporting changes onto a previous release, then ensure there is a major version branch for that version (e.g. `1.x` for a `v1` backport release).

   - The major version branch should be set to the most recent release with that major version. For example, when backporting a `v1.0.2` release, you'd want to ensure there was a `1.x` branch that was set to the `v1.0.1` tag.

3. Trigger the [`workflow_dispatch`](https://docs.github.com/en/actions/reference/events-that-trigger-workflows#workflow_dispatch) event [manually](https://docs.github.com/en/actions/managing-workflow-runs/manually-running-a-workflow) for the `Create Release Pull Request` action to create the release PR.

   - For a backport release, the base branch should be the major version branch that you ensured existed in step 2. For a normal release, the base branch should be the main branch for that repository (which should be the default value).
   - This should trigger the [`action-create-release-pr`](https://github.com/MetaMask/action-create-release-pr) workflow to create the release PR.

4. Update the changelog to move each change entry into the appropriate change category ([See here](https://keepachangelog.com/en/1.0.0/#types) for the full list of change categories, and the correct ordering), and edit them to be more easily understood by users of the package.

   - Generally any changes that don't affect consumers of the package (e.g. lockfile changes or development environment changes) are omitted. Exceptions may be made for changes that might be of interest despite not having an effect upon the published package (e.g. major test improvements, security improvements, improved documentation, etc.).
   - Try to explain each change in terms that users of the package would understand (e.g. avoid referencing internal variables/concepts).
   - Consolidate related changes into one change entry if it makes it easier to explain.
   - Run `yarn auto-changelog validate --rc` to check that the changelog is correctly formatted.

5. Review and QA the release.

   - If changes are made to the base branch, the release branch will need to be updated with these changes and review/QA will need to restart again. As such, it's probably best to avoid merging other PRs into the base branch while review is underway.

6. Squash & Merge the release.

   - This should trigger the [`action-publish-release`](https://github.com/MetaMask/action-publish-release) workflow to tag the final release commit and publish the release on GitHub. Since this repository is a GitHub Action, this completes the release process.
     - Note that the shorthand major version tag is automatically updated when the release PR is merged. See [`publish-release.yml`](https://github.com/MetaMask/action-create-release-pr/blob/main/.github/workflows/publish-release.yml) for details.
