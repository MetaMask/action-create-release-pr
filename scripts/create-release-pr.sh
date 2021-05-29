#!/usr/bin/env bash

set -x
set -e
set -o pipefail

NEW_VERSION="${1}"

if [[ -z $NEW_VERSION ]]; then
  echo "Error: No new version specified."
  exit 1
fi

RELEASE_BRANCH_PREFIX="${2}"

if [[ -z $RELEASE_BRANCH_PREFIX ]]; then
  echo "Error: No release branch prefix specified."
  exit 1
fi

RELEASE_BRANCH_NAME="${RELEASE_BRANCH_PREFIX}${NEW_VERSION}"
RELEASE_BODY="This is the release candidate for version ${NEW_VERSION}."

git config user.name github-actions
git config user.email github-actions@github.com

git checkout -b "${RELEASE_BRANCH_NAME}"

if ! (git add . && git commit -m "${NEW_VERSION}");
then
    echo "Error: No changes detected."
    exit 1
fi

git push --set-upstream origin "${RELEASE_BRANCH_NAME}"

gh pr create \
  --draft \
  --title "${NEW_VERSION}" \
  --body "${RELEASE_BODY}" \
  --head "${RELEASE_BRANCH_NAME}";
