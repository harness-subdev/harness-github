# Harness GitHub

GitHub 저장소 작업을 위한 Codex 스킬입니다. 복합 작업은 `github-workflow`로 시작하고, 단일 작업은 해당 하위 스킬을 직접 사용합니다.

| 스킬 | 범위 |
| --- | --- |
| [github-workflow](github-workflow/SKILL.md) | 요청 분류, 작업 간 인계, 반복과 완료 판단 |
| [github-issues](github-issues/SKILL.md) | 개별 이슈 조회·작성·수정·분류 |
| [github-contributing](github-contributing/SKILL.md) | 기여 문서·이슈 폼·PR 템플릿·라벨 정의 |
| [github-pr](github-pr/SKILL.md) | PR 작성·수정, 리뷰 대화와 병합 상태 |
| [github-remote-push](github-remote-push/SKILL.md) | 프로젝트 및 선택 스킬 게시 |
| [github-build](github-build/SKILL.md) | GitHub Actions 빌드 설정·운영·산출물 검증 |
| [github-release](github-release/SKILL.md) | 버전 준비·릴리스 설정·발행·복구 |

각 스킬 폴더를 사용자 스킬 디렉터리에 설치합니다. 공통 리뷰와 구현·Git 도구는 [harness-global](https://github.com/harness-subdev/harness-global)의 `code-review`, `git-commit`, `systematic-debugging`, `test-driven-development`, `brainstorming`, `writing-plans`, `implement`, `subagent-driven-development`, `using-git-worktrees`, `resolving-merge-conflicts`, `verification-before-completion`을 재사용합니다. 스킬의 상대 경로는 설치 후 같은 스킬 루트에 배치된 공통 스킬을 가리킵니다.

- 일반 프로젝트 push: `github-remote-push`
- UI34521 프로젝트 게시: `github-remote-push --front`
- harness 스킬 게시와 기존 빌드/버전 후속: `github-workflow`에서 `--harness` 요청

## 통합된 이전 스킬

`front-reference-push`, 잘못 변경된 중복 이름 `web-reference-publish`, `my-herness-skills-push`는 `github-remote-push`로 통합했습니다. `devops-build-version-setup`과 `devops-build-release-manage`는 빌드/릴리스 책임에 따라 `github-build`와 `github-release`로 재편했습니다. 이전 저장소의 해당 복사본을 중복 설치하지 않습니다.

공통 `requesting-code-review`와 `receiving-code-review`는 harness-global의 `code-review` 요청/피드백 모드로 통합했습니다. 현재 분류와 저장소 매핑은 [공통 스킬 정책](github-remote-push/references/skill-policy.md), 채택 출처는 [출처 및 이관 기록](github-workflow/references/source-adoption.md)을 확인하세요.

이 저장소에는 현재 자동 빌드나 버전/릴리스 파이프라인이 없습니다. 게시 시 스킬 validator와 참조 검사를 수행하며, 원격 push 자체가 빌드 성공이나 릴리스 발행을 뜻하지 않습니다.
