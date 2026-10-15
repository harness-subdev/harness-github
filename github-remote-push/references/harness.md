# Harness skill publication

Use only for `--harness`, under `github-workflow`. The workflow retains the existing build/version continuation; this reference prepares and publishes one selected set, then returns evidence. Read [skill policy](skill-policy.md) for names and repository mapping.

## Prepare the concrete scope

1. Establish actual created, modified, renamed and deleted skill artifacts from session context and before/after evidence. Without a session baseline, distinguish observed local-versus-repository differences from confirmed session changes. A file change, watcher signal, prefix, policy load or earlier setup request does not authorize a push.
2. Group the selected changes by the shared mapping. Inspect each destination's instructions, layout, default branch, remote and content through authenticated tools. Reuse a suitable clean checkout or prepare an isolated one. Do not assume `main` or root-level skill directories.
3. Prepare a reviewable per-repository diff limited to the selected `SKILL.md` and necessary `agents/`, `references/`, `scripts/` or `assets/` artifacts. Exclude credentials, caches, temporary outputs, transcripts and hook state. Route supporting skills by their own category, including them only when in scope.
4. Present the repository, branch, exact paths, change summary, inclusion rationale and validation, including the existing build/version procedure that follows successful publication. Derive the increment from explicit repository policy or user input; do not invent it. Make deletions, renames and repository migrations explicit. Moving categories may require coordinated edits in two repositories; do not silently remove the old published copy.
5. Obtain approval for this concrete commit/push scope unless the user already authorized that same scope. Carry that authorization forward instead of repeatedly asking. If content or destination changes materially since review, update the concrete proposal and resolve the changed scope before publication.

Missing or inaccessible mapped repositories are blocked independently. Do not create one automatically, publish to global as a fallback, or route to another organization's repository.

## Publish and return

Recheck destination state and the prepared diff. Stage only approved paths, inspect the staged diff, and use `git-commit` for a focused commit. Push the intended branch through the normal protected-branch process and verify its exact remote SHA as described in the skill body.

Handle repositories independently: keep successful outcomes, retain failed work for retry, and avoid reapplying already published changes. Resolve uncertain pushes against the remote before classifying them. Unchanged repositories, local-only commits, failed/unconfirmed pushes and every other mapped repository are ineligible for continuation.

Return the common operation result with the reviewed build/version policy and any known existing run or version PR. `github-workflow` follows build then release preparation once for each eligible actual skill-change push, reusing existing runs/version commits/PRs. Version-only follow-up commits must not restart that handoff. If infrastructure or bump policy is missing, return the gap; the parent owns the next decision. Push authorization does not grant public release, production deployment or protected-branch merge authority.

This mode does not detect session termination, install a watcher/hook, or run in the background. Use verified hook capabilities only when a separate request actually requires integration.
