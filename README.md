# MetaMask/action-create-release-pr

This repository can be used on its own but is better used along with: https://github.com/MetaMask/action-publish-release


Add the following Workflow File to your repository in the path `.github/workflows/create-release-pr.yml`


```
name: Create Release Pull Request

on:
  create:
    branches:
      - "release-v*"

jobs:
  release_pr:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Get Node.js version
        id: nvm
        run: echo ::set-output name=NODE_VERSION::$(cat .nvmrc)
      - uses: actions/setup-node@v2
        with:
          node-version: ${{ steps.nvm.outputs.NODE_VERSION }}
      - uses: MetaMask/action-create-release-pr@0.0.2
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

```