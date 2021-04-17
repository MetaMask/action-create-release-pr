# MetaMask/action-monorepo-release-pr

Add the following Workflow File to your repository in the path `.github/workflows/create-release-pr.yml`

```yaml
name: Create Monorepo Release Pull Request

on:
    workflow_dispatch:
        inputs:
            release-type:
                description: 'A SemVer version diff, i.e. major, minor, patch, prerelease etc. Mutually exclusive with "release-version".'
                required: false
            release-version:
                description: 'A specific version to bump to. Mutually exclusive with "release-type".'
                required: false

jobs:
    monorepo-release-pr:
        runs-on: ubuntu-latest
        steps:
            - uses: actions/checkout@v2
              with:
                  # This is to guarantee that the most recent tag is fetched.
                  # This can be configured to a more reasonable value by consumers.
                  fetch-depth: 0
            - name: Get Node.js version
              id: nvm
              run: echo ::set-output name=NODE_VERSION::$(cat .nvmrc)
            - uses: actions/setup-node@v2
              with:
                  node-version: ${{ steps.nvm.outputs.NODE_VERSION }}
            - uses: MetaMask/action-monorepo-release-pr@0.0.1
              env:
                  GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```
