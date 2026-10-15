# Front project publication

Use only for `--front`. Default organization: [`UI34521`](https://github.com/UI34521/), unless the user selected another destination. An actual project publication request in this mode covers the necessary private repository creation, remote configuration and normal branch push. Explaining or editing the skill does not authorize publication.

## Identify the matching repository

- Prefer the user-selected project directory. Otherwise inspect the current directory, README, package metadata and Git state; ask only if several projects remain plausible.
- Confirm the project root with `git rev-parse --show-toplevel`, `git status --short --branch` and `git remote -v`. If Git is absent, initialize the confirmed project root with `git init -b main`.
- Use `gh auth status` when GitHub CLI is available, otherwise an authenticated GitHub connector plus Git CLI. Authentication or permission failures are not repository absence.
- Choose the name from the user's explicit name, then the project's existing remote in the selected organization, then project metadata/folder name. An unrelated organization's remote provides at most a name candidate. Preserve project identity when normalizing names.
- Query the exact candidate, for example `gh repo view "UI34521/<repo>" --json nameWithOwner,url,sshUrl,visibility,defaultBranchRef`. Check related names with `gh repo list UI34521 --limit 1000 --json name,nameWithOwner,url,description` or a paginated API as needed. An incomplete listing cannot prove absence.
- Compare README, description and remote history before reuse. Matching names can represent different projects. Resolve collisions or multiple matching repositories before mutation.

## Create only when absence is established

For a confirmed missing repository, use `gh repo create "UI34521/<repo>" --private`; honor an explicitly selected visibility. Create it empty, without automatic README, license or gitignore commits. An inaccessible or ambiguous 404 does not establish absence. Do not pick another name to bypass authentication or visibility uncertainty. Re-query the same name after an uncertain creation outcome to avoid duplicates.

Use the returned HTTPS or SSH URL compatible with the authenticated identity. If `origin` is absent, add it. If it already resolves to the same repository, retain it and check both fetch and push URLs. If it belongs elsewhere, preserve it and add `ui34521` (or another unused remote name). Replace `origin` only when the user explicitly requested that replacement.

## Commit and publish

Keep the current branch. For an initial commit, inspect project files and ignore rules, then explicitly stage publishable paths. Exclude credentials, private keys, `.env` secrets, dependency directories and unnecessary build outputs; inspect example environment files rather than assuming they are safe. Reuse `git-commit` for commit mechanics.

For an existing history, push the current commit unless the request also covers current changes. Preserve other work and existing staging, and report uncommitted work left behind. Before publishing to an existing repository, inspect its branch history: pushing a new branch does not resolve unrelated default-branch history or prove the project was correctly connected. Follow the shared fast-forward and exact remote SHA checks in the skill body.

Return created/reused status in addition to the common operation result. On failure, retain completed setup and report the remaining problem so a retry reuses the same repository and remote.
