---
name: github-release
description: Use when configuring GitHub Actions release versioning or publication, preparing a version PR or release candidate, checking version/tag consistency, publishing an authorized release, or recovering a partial draft.
---

# GitHub Release

Own GitHub Actions release policy/configuration, version preparation, publication and recovery. A single release task may enter here directly. Return one operation's result and remaining work; `github-workflow` owns sequences spanning push, review, build and release.

## Establish scope and policy

Read repository instructions, status/remotes, default branch, release runner, version declarations, manifests and existing tool configuration. Discover what users actually install/download. Resolve host/repository, version, intended commit/ref and operation: setup, inspect, prepare, publish or recover.

Honor existing authorization. A status check stays read-only; setup, a skill-change push or candidate preparation alone does not authorize publication, deployment or protected-branch merge. Do not repeat authorization questions for the same approved scope. Prepare reviewable local changes before requesting any missing permission.

Reuse Changesets, Release Please, semantic-release, ecosystem-native commands or the existing maintained publisher. Do not add a second release controller. Read only the relevant setup, preparation or recovery sections of [GitHub Actions release details](references/github-actions.md).

## Configure or prepare

- Identify the authoritative version and derived fields that must agree, distinct from historical evidence. Preserve existing monorepo/prerelease/tag policy and meaningful requested tag conventions. Never use run/attempt numbers as release versions.
- Inspect current remote version, existing version PRs/branches, matching runs, tags and all accessible drafts before another candidate. Resolve a bump from explicit user/repository policy; do not invent one. Reuse an existing matching operation and reconcile uncertain dispatches before retrying.
- Use the existing command/inputs. Validate the expected version diff, lockstep fields, candidate base/head SHA, required checks and build-artifact provenance. Version-only follow-up commits must not recursively trigger a new skill-publication handoff.
- Validate custom bump logic on isolated copies, preserving historical versions. Require version-specific shipped contents/change notes from the actual diff or maintained changelog. Keep real version, exact SHA and run/attempt in artifact names, summaries and release body.

## Publish or recover

Release titles must be exactly the version tag, such as `v0.1.1` (`vMAJOR.MINOR.PATCH`). Use `--title "$TAG"` with `gh release create` or `gh release edit`; repository names, product names and descriptive text belong in the release body, never the title. Apply this contract when configuring publishers, preparing release commands, publishing or repairing release metadata. After publication, fetch the release and require its title to equal the expected version tag before reporting success.

Use the maintained publisher only within authorization and required approvals. Establish tag/version/tested-commit agreement, including peeled annotated tags. Treat tags and published asset bytes as immutable: never force-move tags, overwrite assets, or delete/recreate releases to make a retry pass.

Resume a partial draft only for the same version/commit with verified existing asset bytes and an idempotent publisher that adds only missing assets and refuses conflicts. Query uncertain remote state before retrying. Verify actual published bytes/checksums, tag, title, notes and publication state; command success alone is insufficient.

## Return evidence

Use `verification-before-completion`. Return repository, version source/policy, operation, intended and candidate/published SHA, run/attempt/status URLs, version PR/tag/release links, shipped contents, verification and remaining action. Preparation stops at its requested deliverable. Report missing build or permission evidence to the caller without starting cross-domain loops or silently scheduling monitoring.
