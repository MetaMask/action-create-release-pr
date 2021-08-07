#!/usr/bin/env bash

set -x
set -e
set -o pipefail

# This script checks whether an organization member or owner other than the
# specified action initiator (i.e., GitHub username) has approved the pull
# request associated with the current git branch. It uses the the GitHub CLI,
# gh, to fetch information about the PR, and jq to parse the result, which is in
# JSON.
#
# This script takes the path to a directory as an argument, which should contain
# GitHub workflow artifacts in the form of text files, each named after a
# release PR number, e.g. 99.txt, and each containing the name of the user that
# created the release PR (via the @metamask/create-release-pr action).
#
# If parsing the result from GitHub fails, or if nobody other than the action
# initiator has approved the pull request, this script will exit with a non-zero
# code.

ARTIFACTS_DIR_PATH=${1}

if [[ -z $ARTIFACTS_DIR_PATH ]]; then
  echo "Error: No artifacts directory specified."
  exit 1
fi

# Get the JSON data from GitHub. For the expect format of this data, see the
# end of this file.
PR_INFO=$(gh pr view --json number,reviews)

if [[ -z $PR_INFO ]]; then
  echo 'Error: "gh pr view" returned an empty value.'
  exit 1
fi

PR_NUMBER=$(echo "${PR_INFO}" | jq '.number')

if [[ -z $PR_NUMBER ]]; then
  echo 'Error: "gh pr view" did not return a PR number.'
  exit 1
fi

ARTIFACT_FILE_PATH="${ARTIFACTS_DIR_PATH}/${PR_NUMBER}.txt"

if [[ ! -f "${ARTIFACT_FILE_PATH}" ]]; then
  echo "Error: The expected artifact file at \"${ARTIFACT_FILE_PATH}\" does not exist."
  exit 1
fi

# Get the first word in the artifact text file, which should be the GitHub
# username of the action initiator.
ACTION_INITIATOR=$(grep -o -m 1 "\w\+" < "${ARTIFACT_FILE_PATH}")

if [[ -z "${ACTION_INITIATOR}" ]]; then
  echo 'Error: The workflow artifact file does not contain a username.'
  exit 1
fi

echo \
  "Identified author of release PR #${PR_NUMBER} as \"${ACTION_INITIATOR}\"." \
  "Looking for approving reviews from other organization members..."

NUM_OTHER_APPROVING_REVIEWERS=$( 
  echo "${PR_INFO}" |
  jq '.reviews |
    map(select(
      .state == "APPROVED" and (
        .authorAssociation == "MEMBER" or .authorAssociation == "OWNER"
      )
    )) |
    map(.author.login) |
    map(select(. != "'"${ACTION_INITIATOR}"'")) |
    length'
)

if (( NUM_OTHER_APPROVING_REVIEWERS > 0 )); then
  echo "Success! Found approving reviews from organization members."
  exit 0
fi

echo "Failure: No approving reviews from other organization members found."
exit 1

# Relevant GitHub documentation:
# https://docs.github.com/en/graphql/reference/enums#pullrequestreviewstate
# https://docs.github.com/en/graphql/reference/enums#commentauthorassociation
#
# Related, but not exactly the same as "gh pr view":
# https://docs.github.com/en/developers/webhooks-and-events/webhooks/webhook-events-and-payloads#pull_request
#
# https://cli.github.com/manual/gh_pr_view
#
# gh pr view --json number,reviews
#
# {
#   "number": 99,
#   "reviews": [
#     {
#       "author": {
#         "login": "username1"
#       },
#       "state": "COMMENTED",
#       "authorAssociation": "OWNER",
#       ...
#     },
#     {
#       "author": {
#         "login": "username2"
#       },
#       "state": "APPROVED",
#       "authorAssociation": "MEMBER",
#       ...
#     },
#     ...
#   ]
# }
