# MetaMask/action-create-release-pr

## Usage

This Action can be used on its own, but we recommend using it with [MetaMask/action-publish-release](https://github.com/MetaMask/action-publish-release).

Add the following Workflow File to your repository in the path `.github/workflows/create-release-pr.yml`:

```yaml
name: Create Release Pull Request

on:
  workflow_dispatch:
    inputs:
      base-branch:
        description: 'The base branch for git operations and the pull request.'
        default: 'main'
        required: true
      release-type:
        description: 'A SemVer version diff, i.e. major, minor, patch, prerelease etc. Mutually exclusive with "release-version".'
        required: false
      release-version:
        description: 'A specific version to bump to. Mutually exclusive with "release-type".'
        required: false

jobs:
  create-release-pr:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: write
    steps:
      - uses: actions/checkout@v2
        with:
          # This is to guarantee that the most recent tag is fetched.
          # This can be configured to a more reasonable value by consumers.
          fetch-depth: 0
          # We check out the specified branch, which will be used as the base
          # branch for all git operations and the release PR.
          ref: ${{ inputs.base-branch }}
      - name: Get Node.js version
        id: nvm
        run: echo ::set-output name=NODE_VERSION::$(cat .nvmrc)
      - uses: actions/setup-node@v2
        with:
          node-version: ${{ steps.nvm.outputs.NODE_VERSION }}
      - uses: MetaMask/action-create-release-pr@0.0.16
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          release-type: ${{ github.event.inputs.release-type }}
          release-version: ${{ github.event.inputs.release-version }}
```

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
