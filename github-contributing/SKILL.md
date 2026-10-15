---
name: github-contributing
description: Use when auditing or maintaining repository contribution rules, CONTRIBUTING, SECURITY, CODEOWNERS, issue forms, PR templates, or label definitions.
---

# GitHub Contributing

Improve the contribution surface needed by the request. Existing repository policy and working automation take priority over generic templates.

## Audit before editing

Read repository instructions, contribution/security/ownership docs, issue forms and config, PR templates, actual build/test commands, label definitions and any consumers of them. Check supported versions, reporting channels, project language and who owns the relevant paths. Distinguish a missing file from a failed read or unavailable permission.

Return a focused gap list: affected contributor action, current evidence, proposed file/metadata change and verification. For a review-only request, stop at that list. For authorized maintenance, fix the demonstrated gaps without generating a standard bundle of files.

## Maintain the relevant surface

| Surface | Preserve and verify |
| --- | --- |
| CONTRIBUTING and related docs | Actual setup/test commands, contribution flow, existing language and conventions; links and prerequisites work. |
| SECURITY | Verified reporting contact/process and supported versions; do not invent an email, promise response times or publish vulnerability details. GHSA incident operation is outside this skill. |
| CODEOWNERS | Existing ownership intent, pattern precedence and real users/teams with required access; avoid widening ownership or exposing private team details. |
| Issue forms/config | Existing form IDs and automation-sensitive values; required information, valid YAML, working links, and labels that actually exist. |
| PR templates | Repository-required review information with useful prompts; preserve custom sections and avoid duplicate templates. |
| Label definitions | Inventory names, descriptions, colors, current issue use and bot/workflow references. Create/update only the needed definitions; verify by reading them back. |

Do not impose rating tiers, emoji, fixed priority/state names, extra languages or unused bot labels. An issue's existing-label assignment is `github-issues` work. For label definition changes, distinguish additive creation, definition update, rename and deletion. Show affected automation and issue usage before a destructive rename/deletion; obtain coverage for that concrete scope if the request does not already authorize it. An authentication error is not evidence of absence. Use existence/read → create or update, and paginate inventories.

Review the focused diff, run the existing format/schema/link checks for changed files, and verify metadata mutations through the remote. Local edits do not imply commit/push authorization. Build configuration and release configuration belong to their respective owners when requested; return those gaps to [github-workflow](../github-workflow/SKILL.md).

Return changed paths or metadata, applied/skipped gaps, checks and remaining work. Do not launch a repository-wide standardization or publication loop.
