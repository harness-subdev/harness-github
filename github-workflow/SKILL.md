---
name: github-workflow
description: Use when a GitHub request spans issues, contribution rules, implementation, PR feedback, pushes, Actions builds, or releases, including harness skill publication with build and version follow-up.
---

# GitHub Workflow

Own request routing, handoffs, cross-domain iteration and the final completion decision. Read only the selected child `SKILL.md` and its relevant mode reference. A single operation may enter its child directly; start multi-step `--harness` publication here.

| Requested work | Owner |
| --- | --- |
| Individual issues, triage, existing labels | [github-issues](../github-issues/SKILL.md) |
| Contribution docs, forms, templates, label definitions | [github-contributing](../github-contributing/SKILL.md) |
| PR metadata, feedback collection, replies, threads, merge | [github-pr](../github-pr/SKILL.md) |
| Project or selected skill publication | [github-remote-push](../github-remote-push/SKILL.md) |
| Actions build setup, runs, failures, artifacts | [github-build](../github-build/SKILL.md) |
| Version policy, version PRs, tags, release setup or operation | [github-release](../github-release/SKILL.md) |
| Review request or technical judgement of feedback | [code-review](../code-review/SKILL.md) |

## Coordinate the requested outcome

1. Establish the repository, checkout, branch/base, current SHA, requested outcome and authorized mutations. Carry existing authorization forward; resolve only missing decisions. Read repository instructions and inspect current state before choosing the next operation.
2. Select the smallest next owner. Reuse `brainstorming` → `writing-plans` → `implement` or `subagent-driven-development` for implementation; reuse `test-driven-development`, `systematic-debugging`, `git-commit`, `using-git-worktrees`, and `resolving-merge-conflicts` when their work is needed. This skill does not replace their procedures.
3. Pass only the task, relevant decisions, exact target/revision, evidence pointers, authorization and expected result. For large independent work, delegate with this bounded context. Children finish one operation and return target, changes, evidence and remaining work; they do not call each other to run the whole loop.
4. Reconcile the returned result with current state and choose the next owner. For a PR cycle: collect via `github-pr` → judge via `code-review` → implement/verify → commit/push within scope → inspect via `github-build` → refresh PR metadata/feedback. Repeat only for actionable work covered by the request.
5. Stop iteration when the outcome is verified, a required decision/access is unavailable, or the same failure persists after two evidenced fix attempts. Report the evidence and remaining action; do not wait indefinitely for human approvals or informational checks. Draft status alone does not authorize marking a PR ready or merging it. A new head SHA invalidates prior build/review evidence where relevant.

## Post-push build and version follow-up

For approved `--harness` publication, carry out the existing reviewed build/version procedure automatically, once per repository whose **actual skill changes** were successfully pushed and verified on the remote. For other pushes, continue only with the follow-up requested or established by repository policy within authorization.

- Track repository, branch, skill-change SHA, paths, version policy, followed run/attempt and version PR/commit in the current work notes. On resume, inspect remote state and existing operations before retrying.
- Exclude unchanged repositories, local-only changes, failed or unconfirmed pushes. Reconcile an uncertain push against the remote before scheduling anything.
- Hand the exact pushed SHA to `github-build`. Inspect the run already triggered by that SHA before dispatching another; use the existing workflow. Return run/attempt and artifact evidence, not a branch's unrelated latest run.
- Then hand the originating skill-change SHA and agreed version policy to `github-release`. Reuse existing version commits/PRs or release preparation for that change; never create a second bump merely because the chat resumed or a build was retried. Follow repository-defined ordering/dependencies if its version workflow also builds artifacts.
- Version-only follow-up commits stay attached to the original operation; they do not recursively restart publication or version handoff. Verify any required build for the resulting version SHA separately.
- Missing infrastructure is an evidenced gap: the responsible build/release owner may prepare requested setup, but publication does not silently authorize a new pipeline. Ask only for an unresolved version decision if policy cannot determine it.
- A push or version PR does not authorize public release publication, deployment, protected-branch merge, or tag replacement. Preserve the reviewed scope and report partial results independently by repository.

Before claiming completion, use [verification-before-completion](../verification-before-completion/SKILL.md). Report changed objects/URLs, verified revisions, checks and outstanding work. Build passed, version prepared, release published and PR merged are separate outcomes.

Author maintenance only: [source adoption and migration notes](references/source-adoption.md).
