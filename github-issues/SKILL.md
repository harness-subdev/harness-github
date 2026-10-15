---
name: github-issues
description: Use when querying, creating, editing or triaging individual GitHub issues, applying existing labels, or preparing an issue for implementation.
---

# GitHub Issues

Handle one issue operation and return the result and next work. Use the connected GitHub tools or authenticated `gh`; discover their supported fields rather than assuming a particular MCP server. Read all relevant pages of results.

## Establish the issue

- Resolve repository and issue identity explicitly; a bare number is ambiguous across repositories. Read repository instructions, issue forms, the full issue, comments and existing metadata. Reuse answered questions and prior triage notes.
- Search open and closed issues/PRs for duplicates, the codebase for an existing implementation by domain concept, and relevant ADRs or recorded rejected decisions. Cite what was checked. Similar wording alone does not prove duplication or justify closure.
- For a bug, distinguish reproduced behavior, unsupported claims and missing reproduction details. For a feature/task, identify the intended outcome, constraints and acceptance criteria. Ask only for information that changes the next decision; preserve what is already established.

## Apply the requested operation

1. Query only: return findings and recommendations without mutation. For creation, reuse a matching issue if one already covers the request; otherwise prepare the repository's issue form/template with known evidence and explicit unknowns.
2. Fetch current metadata before updating. Send only intended fields. Preserve unrelated labels, assignees, milestone, type, links and body sections. Prefer additive/removal operations for individual labels; a replacing array must retain every label outside the requested change.
3. Use the repository's actual taxonomy and available issue types. Apply existing labels for classification/state within the request; do not invent a fixed taxonomy, emoji or organization-level type. Definition/rename/recolor/deletion of labels belongs to `github-contributing` as a separate operation.
4. Apply only the requested write scope. Creating/editing an issue does not authorize closing other issues, posting unrelated comments, changing project-wide settings or starting implementation. A triage finding is a recommendation until action is authorized. Write multiline bodies through structured tool arguments or a temporary body file.
5. Re-read the affected issue and verify content and metadata, including preserved values. Report its URL, applied changes, supporting evidence and any unresolved information.

For implementation handoff, return: problem and observed evidence, relevant code/decisions, acceptance criteria, constraints, unanswered questions and recommended next action. If several domains must continue, return to [github-workflow](../github-workflow/SKILL.md); do not start a child-to-child loop.
