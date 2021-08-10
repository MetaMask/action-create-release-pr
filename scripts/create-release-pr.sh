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

ACTION_INITIATOR="${3}"

ARTIFACTS_DIR_PATH="${4}"

if [[ -n $ARTIFACTS_DIR_PATH && -z $ACTION_INITIATOR ]]; then
  echo "Error: Must specify action initiator if artifacts directory is specified."
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

if [[ -n $ARTIFACTS_DIR_PATH ]]; then
  # Write PR number to file so that it can be uploaded as an artifact
  PR_NUMBER=$(gh pr view --json number | jq '.number')

  if [[ -z $PR_NUMBER ]]; then
    echo 'Error: "gh pr view" did not return a PR number.'
    exit 1
  fi

  # Write release author artifact to artifacts directory.
  mkdir -p "$ARTIFACTS_DIR_PATH"
  echo "${ACTION_INITIATOR}" > "${ARTIFACTS_DIR_PATH}/${PR_NUMBER}.txt"
fi
