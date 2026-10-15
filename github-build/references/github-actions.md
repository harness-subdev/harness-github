# GitHub Actions build details

Read setup sections when changing configuration, and operations sections when inspecting or repairing a run. Resolve variables from current files/API responses before using examples. Commands illustrate mechanics, not authorization. Check local `gh --help` and current official documentation for the target GitHub host/version when features differ.

## Repository and scope

```bash
git rev-parse --show-toplevel
git status --short --branch
git remote -v
gh repo view --json nameWithOwner,defaultBranchRef,url
gh workflow list --repo "$repo"
gh workflow view "$workflow" --repo "$repo" --ref "$ref" --yaml
```

The examples use `repo=OWNER/REPO` on github.com. For Enterprise, use observed `HOST/OWNER/REPO` for CLI `--repo` and `--hostname HOST` for `gh api`; REST paths retain `OWNER/REPO`. A remembered default host must not choose the target. Check authentication without printing tokens. An Actions permission error differs from a Git push missing OAuth `workflow` scope; diagnose the actual response before changing credentials.

A status-only request permits inspection and requested downloads into a temporary directory, without source edits, dispatches, reruns, settings or authentication changes. Missing CI is not a request to install it.

## Setup: commands, packaging and identity

Read `.github/workflows`, repository instructions, build/test scripts, lockfiles, output consumers and existing release integration. Reuse a working build system and installed tools; do not invent a package ecosystem, runner or default branch. Preserve runner constraints and any native mobile/store build-counter contract.

Build from a clean checkout of the chosen revision, including required lockfiles, submodules and LFS inputs. Use the actual build/pack command for compiled packages; use `git archive` for a tracked-source deliverable. Include required hidden/configuration files and validate the unpacked artifact through its installed loader, entrypoint or native package validator. Source tests alone do not establish that the packaged product works. Make archives deterministic when identical retries must reproduce bytes.

Keep release version distinct from build identity. Read the authoritative version for display without bumping it during ordinary CI. Record version, full SHA, workflow identity, `GITHUB_RUN_ID`, `GITHUB_RUN_NUMBER` and `GITHUB_RUN_ATTEMPT` in artifact metadata as appropriate. Run numbers are workflow-local; retries retain the number and increase the attempt. Include attempt identity where uploads could collide. Artifact names and summaries should show the actual version; never substitute a run number for a requested `vMAJOR.MINOR.PATCH` version. Choose an explicit retention period; temporary Actions storage is not a durable release archive. Preserve native integrity metadata or checksum manifests for durable deliverables.

Build summaries must describe shipped components, relevant fixes/features, compatibility impact and verification evidence grounded in the diff or maintained changelog. Keep version and exact SHA/run/attempt with those notes. A bare version or generic commit list does not describe build contents.

## Setup: events and permissions

Inspect event/ref/path filters and the workflow's availability on the required/default branch. For manual dispatch, verify its entrypoint requirements on the target host. Check current token-event rules: `GITHUB_TOKEN`-produced pushes/tags and bot PR events can differ in triggering and approval behavior. Distinguish suppressed triggers from approval waits using actual run evidence. Do not silently add a PAT or bypass protections to make checks appear green.

Give CI `contents: read` unless the actual job needs more. Grant publication or PR writes only to the trusted job that needs them. Never execute untrusted PR code with privileged `pull_request_target` credentials or in a privileged downstream artifact-consumer context. Put dynamic shell values in environment variables or structured arguments and validate external inputs. Pin added or updated third-party actions to reviewed full commit SHAs; verify runner/runtime support. Offline, reuse a trusted existing pin and report unverified remote compatibility rather than inventing a SHA.

Validate with an installed workflow validator, shell syntax checks and relevant project tests/build/package checks. Read every diagnostic: a YAML parse does not validate Actions expressions/events. If a validator lags a documented platform feature, identify that incompatibility and verify platform acceptance; do not disable validation wholesale. When remote integration is outside scope, state the specific remaining remote check. Never dispatch a publishing workflow merely to prove an entrypoint exists.

## Operations: select the exact run and attempt

```bash
gh run list --repo "$repo" --workflow "$workflow" --commit "$sha" \
  --json databaseId,workflowDatabaseId,headSha,headBranch,event,status,conclusion,url
gh run view "$run_id" --repo "$repo" \
  --json databaseId,workflowDatabaseId,headSha,headBranch,event,attempt,status,conclusion,jobs,url
```

Establish PR identity with `gh pr view` when relevant. Inspect workflow checkout behavior/logs: the PR head, generated merge/event SHA and built SHA may differ. Select by workflow, event, ref and intended revision, rather than the latest run or a similar workflow name. Reuse a matching existing run. Capture attempt before collecting evidence because reruns retain run ID.

```bash
gh run view "$run_id" --repo "$repo" --attempt "$attempt" --log-failed
gh api "repos/$repo/actions/runs/$run_id/attempts/$attempt/jobs?per_page=100" --paginate
gh run view --repo "$repo" --job "$job_id" --log
```

For missing aggregate logs, inspect that attempt's job metadata and individual job logs. Empty jobs/logs do not prove infrastructure failure. A nonzero CLI exit may mean a failed run or failed query: retain stderr and metadata. An external CI link marks a provider boundary; report it, and use another provider only with an available authorized tool.

| Evidence | Interpretation |
| --- | --- |
| Completed failed job and logs | Diagnose reproducible defect or infrastructure/permissions cause. |
| Workflow/environment approval wait | Identify the exact approval; do not bypass it. |
| Successful query with no matching run | Inspect event filters, actor/token, branch availability and policy. |
| Auth, permission, network or API error | Reading failed; this is not no checks. |
| Pending, queued, canceled or skipped | Report the actual state; this is not a passing build. |

## Operations: repair and retry

Trace the first relevant failure through all affected callers. Separate code defects from runner availability, permissions, missing checks and approvals. Reproduce with the smallest useful check, fix the shared cause and run affected checks. Commit/push/PR changes only within existing authorization and the appropriate Git mechanics.

A safe authorized rerun may target failed jobs:

```bash
gh run rerun "$run_id" --repo "$repo" --failed
gh run view "$run_id" --repo "$repo" --json attempt,headSha,status,conclusion,url
```

Inspect workflow side effects and dependency ordering before this command. A release/deploy job may mutate external state. A rerun retains the old SHA and cannot validate a later fix; follow a new run after the fix reaches GitHub. Verify the attempt advanced and SHA remained expected. For ambiguous/time-out responses, inspect remote run/attempt state before another request. Do not rerun deterministic failures to erase them, or repeatedly retry a pending job. Bound retries by new evidence and side-effect risk; an unexplained repeated failure requires a changed diagnosis. Poll the explicit identity at reasonable intervals and provide progress updates while working.

## Operations: verify artifact bytes and provenance

```bash
gh api "repos/$repo/actions/runs/$run_id/artifacts?per_page=100" --paginate
gh run download "$run_id" --repo "$repo" --name "$artifact_name" --dir "$artifact_dir"
```

List from the selected run, not repository-wide filename search. Record ID/name, expiry, API digest when supplied, producing run/SHA and attempt from upload logs or embedded provenance. Artifact APIs may not expose attempt and `gh run download` does not select an attempt. Explicitly report when that mapping cannot be proved; never substitute another artifact with the same filename.

Inspect downloaded contents in a temporary directory without executing untrusted bundled code. A checksum of an inner build ZIP differs from the digest of GitHub's outer artifact ZIP: compare each checksum with its own bytes. Check package contents/loader and any maintained integrity metadata. Missing, expired or unverifiable provenance remains a stated limitation.

## Sources and inherited limits

Operational safeguards were redistributed from the two former local build/version skills during the 2026-10-15 refactor. These historical source reviews are retained; they are not a claim of newly executed external evaluations:

- [OpenAI gh-fix-ci, `77963424cd7687fd52e5fcfdd3f08d826ab9b1ab`](https://github.com/openai/skills/blob/77963424cd7687fd52e5fcfdd3f08d826ab9b1ab/skills/.curated/gh-fix-ci/SKILL.md), reviewed 2026-09-13: failed-check/log inspection and external-provider boundaries. Its separate approval gate was not imported over existing user authorization. No dedicated execution-test evidence was established. This integrated guidance avoids a duplicate gh-fix-ci installation.
- [Sentry iterate-pr, `aaa85152005936dddd0ea1451d791ff234f04771`](https://github.com/getsentry/skills/blob/aaa85152005936dddd0ea1451d791ff234f04771/skills/iterate-pr/SKILL.md) and [scenario specification](https://github.com/getsentry/skills/blob/aaa85152005936dddd0ea1451d791ff234f04771/skills/iterate-pr/SPEC.md), reviewed 2026-09-13: failed/no-check distinctions, adapted to exact run/SHA/attempt and preserved query errors. Source/scenario inspection did not establish executed evaluation results; cross-domain iteration belongs to the workflow skill.
- [Skill Evolver source, `b6b4c8b305c8f7977cd2755f74ed85453d1f0435`](https://github.com/gyungsubLee/skill-evolver/tree/b6b4c8b305c8f7977cd2755f74ed85453d1f0435) and [CI evidence](https://github.com/gyungsubLee/skill-evolver/actions/runs/34704995747), reviewed 2026-09-13: tested source packaging as a worked example, without importing its platform, paths, version or retention. CI passed in that rollout; actual release publication was not exercised.

Primary references: [run list](https://cli.github.com/manual/gh_run_list), [run view/attempts](https://cli.github.com/manual/gh_run_view), [rerun](https://cli.github.com/manual/gh_run_rerun), [download](https://cli.github.com/manual/gh_run_download), [artifact API](https://docs.github.com/en/rest/actions/artifacts), [trigger/token rules](https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/trigger-a-workflow), [build variables](https://docs.github.com/en/actions/reference/workflows-and-actions/variables), [artifact retention](https://docs.github.com/en/actions/tutorials/store-and-share-data), [workflow permissions](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax#permissions). Verify current host contracts when operating them.
