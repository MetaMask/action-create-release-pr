# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.0.19]
### Fixed
- Monorepo package diffing ([#31](https://github.com/MetaMask/action-create-release-pr/pull/31))
  - If any package had changed, every package would be marked as changed.

## [0.0.18]
### Fixed
- Changelog updating ([#28](https://github.com/MetaMask/action-create-release-pr/pull/28))
  - The updated changelog content was never written to disk.

## [0.0.17]
### Changed
- **(BREAKING)** Re-implement in TypeScript, add monorepo support ([#15](https://github.com/MetaMask/action-create-release-pr/pull/15))
- Use `workspaces` manifest entry to find workspaces ([#20](https://github.com/MetaMask/action-create-release-pr/pull/20))
- Add `@lavamoat/allow-scripts` and `setup` command ([#21](https://github.com/MetaMask/action-create-release-pr/pull/21))
- Add README description ([#22](https://github.com/MetaMask/action-create-release-pr/pull/22))
- Remove package manager restriction ([#23](https://github.com/MetaMask/action-create-release-pr/pull/23))
  - Previously, use of Yarn `^1.0.0` was mandated.
- Migrate various utilities to `@metamask/action-utils` ([#24](https://github.com/MetaMask/action-create-release-pr/pull/24))

## [0.0.16]
### Uncategorized
- First semi-stable release. Polyrepos only.

[Unreleased]: https://github.com/MetaMask/action-create-release-pr/compare/v0.0.19...HEAD
[0.0.19]: https://github.com/MetaMask/action-create-release-pr/compare/v0.0.18...v0.0.19
[0.0.18]: https://github.com/MetaMask/action-create-release-pr/compare/v0.0.17...v0.0.18
[0.0.17]: https://github.com/MetaMask/action-create-release-pr/compare/v0.0.16...v0.0.17
[0.0.16]: https://github.com/MetaMask/action-create-release-pr/releases/tag/v0.0.16
