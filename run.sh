export BRANCH_NAME="${GITHUB_REF##*}"
export NEW_VERSION="${GITHUB_REF##*/${1}}"
export RELEASE_BODY="$(awk -v version="${NEW_VERSION}" -f scripts/show-changelog.awk CHANGELOG.md)"

node scripts/update-package-version.js

git config user.name github-actions
git config user.email github-actions@github.com

if ! (git add . && git commit -m "Release ${NEW_VERSION}" && git push);
then
    echo "No changes"
fi

hub pull-request \
    --draft \
    --message "${NEW_VERSION} RC" --message "${RELEASE_BODY}" \
    --base "main" \
    --head "${BRANCH_NAME}";