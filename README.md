# MetaMask/action-create-release-pr

## Description

This action creates a new release branch and PR. It also makes a commit that includes any release preparation that can be easily automated, which includes version bumps and a partial changelog updates (using `@metamask/auto-changelog`).

This action is only tested with Yarn v1.

### Monorepos

This action is compatible with monorepos, but only if they use workspaces. It uses the `workspaces` property of `package.json` to determine if the repo is a monorepo, and to find each workspace.

The release type and git history determine which packages are bumped. For major releases, all packages are bumped. But for minor and patch releases, the git history will be scanned to determine whether each package has changed since the previous version. Only packages with changes since the previous version will be bumped.

This action uses a synchronized versioning strategy, meaning that the version of the root `package.json` file will be set on any updated packages. Packages in the monorepo may fall behind in version if they don't have any changes, but they'll jump directly to the current version of the entire monorepo if they change at all. As a result, the version change for individual packages might be beyond what SemVer would recommend. For example, packages might get major version bumps despite having no breaking changes. This is unfortunate, but for us the benefits of this simplified versioning scheme outweigh the harms.

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

**The workflow file self-references this action with the string "`/.`". Replace that string with "`@metamask/action-create-release-pr@v1`".**

- [`.github/workflows/create-release-pr.yml`](https://github.com/MetaMask/action-create-release-pr/blob/main/.github/workflows/create-release-pr.yml)

### Require Additional Reviewer Workflow

If you wish to prevent authors from creating and merging releases without third-party review,
add the following workflow and script files to your repository at the specified paths.
Remember that the workflow file must be configured to check for the same branch prefix as `@metamask/action-create-release-pr`.

- [`.github/workflows/require-additional-reviewer.yml`](https://github.com/MetaMask/action-create-release-pr/blob/main/.github/workflows/require-additional-reviewer.yml)
- [`.github/workflows/scripts/require-additional-reviewer.sh`](https://github.com/MetaMask/action-create-release-pr/blob/main/.github/workflows/scripts/require-additional-reviewer.sh)

Once the Require Additional Reviewer workflow has run once, you can add it as a mandatory check in your GitHub branch protection settings.

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
