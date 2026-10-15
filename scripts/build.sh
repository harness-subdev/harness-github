#!/usr/bin/env bash
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"
version=$(cat VERSION)
[[ "$version" =~ ^(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)$ ]] || { echo 'VERSION must be stable MAJOR.MINOR.PATCH' >&2; exit 1; }
sha=$(git rev-parse HEAD)
if [[ "${GITHUB_REF_TYPE:-}" == tag ]]; then
  [[ "$GITHUB_REF_NAME" == "v$version" ]] || { echo "Tag/version mismatch" >&2; exit 1; }
  [[ "$(git rev-parse "refs/tags/$GITHUB_REF_NAME^{commit}")" == "$sha" ]] || { echo "Tag/commit mismatch" >&2; exit 1; }
fi
# ponytail: release versions are edited in a reviewed PR; no custom bump engine.
[[ -z "$(git status --porcelain --untracked-files=no)" ]] || { echo 'Commit tracked changes before packaging' >&2; exit 1; }
name="harness-github-$version-${sha:0:12}"
mkdir -p dist
stage=$(mktemp -d)
trap 'rm -rf "$stage"' EXIT
git archive HEAD | tar -xf - -C "$stage"
node --test "$stage"/scripts/*.test.mjs
BUILD_VERSION="$version" BUILD_SHA="$sha" BUILD_STAGE="$stage" node --input-type=module <<'JS'
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import assert from 'node:assert/strict';
const e = process.env;
assert.equal(readFileSync(`${e.BUILD_STAGE}/VERSION`, 'utf8').trim(), e.BUILD_VERSION);
const skills = readdirSync(e.BUILD_STAGE, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && entry.name.startsWith('github-'))
  .map((entry) => entry.name)
  .sort();
assert.ok(skills.length, 'No GitHub skills found');
for (const skill of skills) {
  const content = readFileSync(`${e.BUILD_STAGE}/${skill}/SKILL.md`, 'utf8');
  const name = content.match(/^---\r?\nname:\s*([a-z0-9-]+)\r?\n/)?.[1];
  assert.equal(name, skill, `Skill name/folder mismatch: ${skill}`);
  assert.match(content, /^description:\s*\S/m);
}
const lines = readFileSync(`${e.BUILD_STAGE}/CHANGELOG.md`, 'utf8').split('\n');
const start = lines.indexOf(`## ${e.BUILD_VERSION}`);
assert.ok(start >= 0, 'Current version release notes are missing');
let end = lines.findIndex((line, index) => index > start && line.startsWith('## '));
if (end < 0) end = lines.length;
const changes = lines.slice(start + 1, end).join('\n').trim();
assert.ok(changes, 'Current version release notes are empty');
const runUrl = e.GITHUB_RUN_ID && e.GITHUB_REPOSITORY
  ? `${e.GITHUB_SERVER_URL ?? 'https://github.com'}/${e.GITHUB_REPOSITORY}/actions/runs/${e.GITHUB_RUN_ID}`
  : 'local';
const notes = `# ${e.BUILD_VERSION}\n\n${changes}\n\nCommit: ${e.BUILD_SHA}\nBuild: ${runUrl}\nRun: ${e.GITHUB_RUN_ID ?? 'local'} / attempt ${e.GITHUB_RUN_ATTEMPT ?? 'local'}\n`;
writeFileSync(`${e.BUILD_STAGE}/release-notes.md`, notes);
if (e.GITHUB_STEP_SUMMARY) writeFileSync(e.GITHUB_STEP_SUMMARY, notes, { flag: 'a' });
writeFileSync(`${e.BUILD_STAGE}/build-info.json`, JSON.stringify({
  version: e.BUILD_VERSION, sha: e.BUILD_SHA, skills,
  repository: e.GITHUB_REPOSITORY ?? 'local', workflow: e.GITHUB_WORKFLOW ?? 'local',
  runId: e.GITHUB_RUN_ID ?? null, runNumber: e.GITHUB_RUN_NUMBER ?? null,
  runAttempt: e.GITHUB_RUN_ATTEMPT ?? null, event: e.GITHUB_EVENT_NAME ?? 'local',
}, null, 2) + '\n');
JS
tar -czf "dist/$name.tar.gz" -C "$stage" .
(cd dist && shasum -a 256 "$name.tar.gz" > "$name.sha256")
# Check the actual deliverable, including hidden configuration and skill resources.
mkdir "$stage/unpacked"
tar -xzf "dist/$name.tar.gz" -C "$stage/unpacked"
for skill in "$stage"/github-*/; do
  diff -r "$skill" "$stage/unpacked/$(basename "$skill")"
done
cmp "$stage/build-info.json" "$stage/unpacked/build-info.json"
cmp "$stage/release-notes.md" "$stage/unpacked/release-notes.md"
(cd dist && shasum -a 256 -c "$name.sha256")
if [[ -n "${GITHUB_OUTPUT:-}" ]]; then
  printf 'name=%s\nversion=%s\nsha=%s\n' "$name" "$version" "$sha" >> "$GITHUB_OUTPUT"
fi
