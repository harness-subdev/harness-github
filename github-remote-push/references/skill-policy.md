# Personal skill naming and repository policy

Read this reference for personal skill creation, modification, classification and authorized renames. Reading it does not authorize a commit or push. Publication mechanics belong to the `--harness` mode of `github-remote-push`, coordinated by `github-workflow`.

| Skill name | Repository |
| --- | --- |
| `game-planning-*`, exact `web-game-planning-html`, and legacy exact `front-game-planning-html` | `harness-subdev/harness-game-planning` |
| `web-*` and legacy `front-*` | `harness-subdev/harness-front` |
| `backend-*` | `harness-subdev/harness-backend` |
| `github-*` | `harness-subdev/harness-github` |
| `devops-*` | `harness-subdev/harness-devops` |
| `data-*` | `harness-subdev/harness-data` |
| Cross-domain common skills without a category prefix | `harness-subdev/harness-global` |

Apply the game-planning suite exception before the general `web-` or legacy `front-` prefix. Recognize both HTML names during migration; classification alone does not rename the skill. Match other domains by a leading prefix including its hyphen; use `harness` for repository names and `devops` for that category. Do not also publish categorized skills to global or auto-enumerate every organization repository. Update the mapping only for explicitly requested categories or destinations. Missing mapped repositories do not authorize creation or fallback routing.

Classify by the skill's primary responsibility after reading its purpose and affected callers: UI/browser presentation → web; server APIs/services → backend; GitHub repositories, issues, PRs, GitHub Actions build/release and remote publication → github; general infrastructure, CI/CD and deployment operations → devops; data processing/analysis → data. A tool mentioned in passing does not determine category. For example, `github-build` belongs in harness-github, while common `code-review` belongs in harness-global.

Give new domain-specific personal skills the corresponding prefix; use `web-` for new frontend skills and retain `harness-front` as the repository name. Legacy `front-` matching supports migration, not new naming. Leave cross-domain common skills unprefixed. Resolve a domain-specific skill's category rather than silently treating a missing prefix as common. Ask only when purpose or an explicit destination conflicts with the mapping.

On edits, preserve correct prefixes. Apply an authorized rename/merge consistently to the folder, frontmatter `name`, invocation metadata and live caller references. Preserve historical records and upstream source identities, and do not bulk-rename unrelated or vendor-managed skills. Validate the skill and references with the available skill-creator validator.

Category migrations require reviewing both the new destination and old published copy. New GitHub skills target harness-github; any prior front/devops/global copies require a separate explicit migration scope. A local refactor or policy correction alone does not authorize those remote changes.
