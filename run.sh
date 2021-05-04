export NEW_VERSION="${1}"
export BRANCH_NAME="release-${1}"
export GITHUB_ACTION_PATH="${2}"
export RELEASE_BODY="$(awk -v version="${NEW_VERSION}" -f ${GITHUB_ACTION_PATH}/scripts/show-changelog.awk CHANGELOG.md)"

git config user.name github-actions
git config user.email github-actions@github.com

git checkout -b "${BRANCH_NAME}"

node "${GITHUB_ACTION_PATH}/scripts/update-package-version.js"

if ! (git add . && git commit -m "Release ${NEW_VERSION}" && git push);
then
    echo "No changes"
fi

hub pull-request \
    --draft \
    --message "${NEW_VERSION} RC" --message "${RELEASE_BODY}" \
    --base "main" \
    --head "${BRANCH_NAME}";
