---
name: github-remote-push
description: Use when a user requests a GitHub project push, UI34521 front project publication with --front, or selected harness skill publication with --harness.
---

# GitHub Remote Push

Perform one authorized publication operation and return remote evidence. [github-workflow](../github-workflow/SKILL.md) owns any sequence across push, review, build and release. A user-facing `--harness` publication request starts there because its existing build/version follow-up is part of the operation; if entered here directly, transfer that request before mutations. When called by the workflow, complete the push and return without invoking downstream skills.

## Select the target

Reject simultaneous `--front` and `--harness` before any mutation. These flags select publication policies, not literal Git CLI options.

| Request | Read and use |
| --- | --- |
| No mode flag | Current project's existing verified remote, or the repository explicitly selected by the user |
| `--front` | [Front project publication](references/front.md): UI34521 by default |
| `--harness` | [Harness publication](references/harness.md) and [skill policy](references/skill-policy.md) |
| Skill naming or classification only | Read [skill policy](references/skill-policy.md) only; no publication is authorized |

Do not read every mode. Without a flag, infer neither UI34521 nor a harness repository. If the destination is ambiguous or no remote exists, resolve the repository choice before configuring it; ordinary push does not imply permission to create a repository.

## Prepare and push

1. Identify the actual project Git root, status, branch, existing staging, remotes and authenticated identity. Do not mistake a containing repository for the project. Keep detached HEAD and active merge/rebase decisions explicit.
2. Resolve fetch and push URLs to the intended repository. Preserve unrelated remotes and changes. If a remote has multiple push destinations, resolve the authorized target before using it. Never place credentials in a URL or output.
3. Review the exact selected changes and repository instructions. Use [git-commit](../git-commit/SKILL.md) for authorized commits; an existing commit can be pushed without inventing another. Include uncommitted work only when the request covers it. Stage explicit paths and inspect the staged diff.
4. Record the target branch's remote SHA before pushing. Fetch enough history to verify the intended fast-forward relationship. Do not resolve divergent or unrelated history with force-push, reset, remote deletion, `--allow-unrelated-histories`, `--mirror`, or all-branch/tag pushes. Respect protected branches; return the unresolved integration decision.
5. Push only the selected branch through the repository's established process. Verify the resulting branch SHA against the actual push destination, using `git rev-parse HEAD` and `git ls-remote <push-target> refs/heads/<branch>` or equivalent authenticated evidence. Verify upstream configuration where applicable.

Reconcile an interrupted or uncertain push with remote state before retry or handoff. For a new operation, a remote already at the selected commit is unchanged. For a resumed operation, retain its recorded before SHA and change evidence to determine whether the interrupted push succeeded; do not lose its follow-up or repeat a successful publication. Never manufacture a commit to trigger work. A successful push alone does not establish CI or release success.

## Return one operation result

For each repository, return its URL, checkout, mode, remote/push target, branch, before SHA, local commit SHA, remotely verified pushed SHA, selected paths, and authorization/version policy carried from the request. Report `changed`, `unchanged`, `failed`, or `unconfirmed`, plus verification evidence and remaining work. Distinguish actual selected changes successfully pushed in this operation from older remote commits, local-only changes and version-only follow-up commits.

Only verified successful pushes with actual in-scope changes are eligible evidence for the workflow's build/release continuation. Return partial outcomes independently. This child never dispatches builds, bumps versions, publishes releases, or runs a cross-domain retry loop.
