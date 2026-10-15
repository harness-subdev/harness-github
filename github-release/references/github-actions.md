# GitHub Actions release details

Read setup, preparation or recovery sections as the operation requires. Discover values before substituting them in examples. Commands explain mechanics and do not grant authorization. Consult local `gh --help` and current official documentation for the target host/version when behavior differs.

## Establish repository and release identity

Read current instructions, Git root/status/remotes, default branch, manifests, lockfiles, all current version declarations, release configuration and the actual runner. Trace what consumers install/download. Do not assume npm, SemVer, `main`, compiled binaries or an earlier project's path. Determine the canonical version, derived fields, release trigger, monorepo/prerelease policy and authorized operation.

Resolve the GitHub host explicitly. CLI `--repo` uses `OWNER/REPO` on github.com or observed `HOST/OWNER/REPO` on Enterprise; `gh api --hostname HOST` still uses `OWNER/REPO` in REST paths. Check authentication without printing tokens. Query/authentication failure is never repository, tag, draft or candidate absence.

## Setup: reuse version policy

Retain working Changesets, Release Please, semantic-release, ecosystem-native commands or the equivalent maintained tool. Let its own change/version checker validate input. Repair missing checks rather than introducing a second release controller or imposing a new commit convention. If no convention exists, briefly explain the version source and trigger within the user's setup scope. A manually prepared version PR is a useful default for user-controlled timing; commit-derived automatic release needs a suitable repository convention. Ask only for a missing material product decision.

Distinguish current version fields from historical changelogs, fixtures, migration evidence, frozen reports and provenance. Never globally replace an old version string. For custom bump logic, validate every target before any edit and leave a small runnable check covering supported increments, inconsistent inputs, and preservation of historical evidence. Test on an isolated copy when a real bump was not requested. Preserve native mobile/store counter constraints separately from product release versions.

Honor explicit tag policy such as `vMAJOR.MINOR.PATCH` from the real version, for example `v0.1.0`. Inspect actual Git tags, release titles, run numbers and artifact names separately when a user reports a numeric tag such as `1`. An existing immutable tag or published asset requires a new appropriate version for changed bytes. Keep workflow-local run numbers and increasing retry attempts in build metadata, not in the release version. Avoid production version bumps on every CI run unless the product explicitly requires them.

Release title contract: the title is exactly `vMAJOR.MINOR.PATCH`, matching the product version tag (for example `v0.1.1`). Set `--title "$TAG"` in the maintained publisher and all create/edit commands. Keep repository/product names, change descriptions and build identifiers in the release body or artifact metadata. An existing publisher that uses a title such as `harness-github v0.1.1` must be corrected when release setup or repair is authorized; do not inherit that format as repository policy. For an authorized metadata-only correction, edit the title without moving the tag or replacing asset bytes.


Require version-specific notes from the actual diff or maintained changelog: shipped components, relevant features/fixes, compatibility impact and verification. Surface those with version, exact SHA and run/attempt in build summaries and release body. Reject missing or stale-version notes before publication; a bare version or generic commit list is insufficient.

## Setup: connect preparation and publication

Use the established release trigger. For artifact-only setup, retain the existing release integration and document its entrypoint. For version-change publication, unchanged versions skip; first installation must not accidentally publish the existing version. For tag-driven projects, retain the existing tag convention rather than introducing a second version-change publisher.

Check current event/token semantics for the target host. Token-generated pushes/tags and bot PR events may differ in triggering/approval behavior. Use a supported dispatch, validated workflow, or the existing authorized GitHub App strategy; do not silently add a PAT or alter protections to bypass trigger rules. A manual-dispatch workflow must be available on the required/default branch for its UI entrypoint. If Actions creates PRs, verify the repository option permitting that operation while preserving organizational policy and protections.

Grant `contents: write` or `pull-requests: write` only to trusted jobs that actually need them; ordinary CI stays read-only. Keep untrusted PR code away from publishing credentials and privileged downstream artifact consumption. Validate external shell input through environment variables or structured arguments. Review/pin new or updated actions to full commit SHAs compatible with runner/runtime. Offline, preserve a trusted known pin and state unverified remote compatibility.

Serialize publishers without canceling active publication. Verify the platform's current concurrency semantics: `cancel-in-progress: false` alone does not guarantee every pending publication is retained. Define tested-revision/tag/asset conflict behavior before granting writes. If custom publishing is unavoidable, leave a small isolated check covering identical retry, partial draft, tag mismatch, asset conflict and API failure; do not test on a real public release.

Validate the workflow with the installed validator, shell syntax checks, version checks and relevant project tests. YAML parsing alone does not validate Actions expressions/events. Read diagnostics; verify a specific documented platform/validator incompatibility rather than disabling validation wholesale. Update the existing release/contributor guide with real inputs, checks, artifact locations and which entrypoint prepares a PR versus publishes. Local validation does not establish a real remote run or published release. Do not dispatch a publishing workflow to test its button.

## Preparation: reuse an existing operation

Inspect current remote version, open release PRs/branches, tags, all accessible drafts and matching runs before creating a candidate. Resolve bump/version from the user's request or explicit policy. Confirm target ref, intended SHA, command inputs and expected diff before the authorized preparation operation. No missing pipeline should be silently created during status inspection.

A push may already have triggered the needed run or version PR. Reuse it. A new bump dispatch is new work, not a failed run's retry. After timeout or ambiguity, reconcile existing runs, candidate branches/PRs and version commits before dispatching again. Version-only commits from the same operation do not recursively restart a skill-change post-push handoff. The caller owns broader build/review/release sequencing.

For a workflow that actually declares the selected `bump` input:

```bash
gh workflow view "$workflow" --repo "$repo" --ref "$ref" --yaml
gh workflow run "$workflow" --repo "$repo" --ref "$ref" -f "bump=$bump"
gh run list --repo "$repo" --workflow "$workflow" --commit "$sha" \
  --json databaseId,workflowDatabaseId,headSha,headBranch,event,status,conclusion,url
gh run view "$run_id" --repo "$repo" \
  --json databaseId,workflowDatabaseId,headSha,headBranch,event,attempt,status,conclusion,jobs,url
```

Record dispatch time, ref and inputs and resolve the resulting run from actual data. CLI success does not necessarily supply a run ID or mean completion. Inspect workflow/event/ref/SHA rather than selecting by name or latest run. Distinguish PR head, event/merge SHA and built SHA. A rerun executes the original revision; a new version commit needs checks for its own SHA. For several indistinguishable candidates, resolve identity before another mutation.

Verify actual candidate version, changed files, base/head SHA, lockstep fields, required checks and artifact provenance. Preserve historical releases and records. Pending, approval-waiting, canceled, skipped, absent-check and API-error states are separate from success. Return missing build evidence to the caller. Preparation stops at the requested deliverable, often a version PR; merge/publication needs existing authorization and required checks/approvals.

## Publication or recovery: immutable identity and bytes

Use the maintained publisher; do not create a parallel tag/upload sequence. Read its exact intended commit, idempotency guarantees and current remote state before operating it. Inspect all accessible releases including drafts:

```bash
git ls-remote --tags "$remote" "refs/tags/$tag" "refs/tags/$tag^{}"
gh api "repos/$repo/releases?per_page=100" --paginate --slurp
```

An annotated tag object's SHA differs from the release commit. Use its peeled commit or follow the Git tag API until a commit object is reached. A tag-specific published-release lookup cannot prove no draft exists; a draft may require suitable access to appear. An API failure cannot establish absence.

Resume a partial draft only when version and intended tested commit match, every existing asset's bytes match the expected artifact, and the publisher uploads only missing assets while refusing conflicts. A checksum file alone cannot prove existing remote asset bytes match: download/inspect the actual assets and compare each digest to the correct bytes. Keep an inner package checksum distinct from an outer Actions artifact ZIP digest and verify producing run/SHA/attempt through available provenance. If artifact/attempt identity cannot be proved, report the gap rather than substituting a similarly named artifact.

Never force-move tags, overwrite/clobber assets, delete/recreate a release, or make a new bump to conceal a failed publication. Conflicting published bytes stop that mutation; corrected bytes need a new version under repository policy. After an uncertain publish/upload result, inspect remote state before retrying.

Verify final peeled tag/commit, publication/draft/prerelease state, title exactly equal to the expected version tag, version-bearing artifact names, release notes, asset contents and checksums. Include exact run/attempt separately from product version. A successful command or CI run is not proof that the actual release was published. Keep preparation, local logic validation and verified public publication distinct in the report.

## Sources and inherited limits

Release safeguards were redistributed from the two former local build/version skills during the 2026-10-15 refactor. Historical reviews retained here do not claim current remote execution:

- [Microsoft beachball-change-file, `e21fe2054d8cf47074a385e412d67b2379be8abd`](https://github.com/microsoft/beachball/blob/e21fe2054d8cf47074a385e412d67b2379be8abd/skills/beachball-change-file/SKILL.md), reviewed 2026-09-13: discover the actual repository and use its own change/version validator. No imported Beachball installation, package layout, change-file or pre-1.0 policy. Repository tool tests did not establish skill behavioral evaluation.
- [Skill Evolver source, `b6b4c8b305c8f7977cd2755f74ed85453d1f0435`](https://github.com/gyungsubLee/skill-evolver/tree/b6b4c8b305c8f7977cd2755f74ed85453d1f0435) and [CI evidence](https://github.com/gyungsubLee/skill-evolver/actions/runs/34704995747), reviewed 2026-09-13: partial-draft retry invariants and tested source packaging, without importing platform/path/version/retention choices. CI passed in that rollout; actual publication was not exercised.

Primary references: [workflow dispatch](https://cli.github.com/manual/gh_workflow_run), [trigger/token rules](https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/trigger-a-workflow), [manual dispatch prerequisites](https://docs.github.com/en/actions/how-tos/manage-workflow-runs/manually-run-a-workflow), [permissions](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax#permissions), [release API/drafts](https://docs.github.com/en/rest/releases/releases), [annotated tag API](https://docs.github.com/en/rest/git/tags). Verify current host contracts when operating them.
