# 변경 이력

## 0.1.1

- README에 조율자와 6개 하위 스킬의 책임 및 인계 구조를 Mermaid로 추가했습니다.
- PR 피드백·수정 반복과 harness 게시 후 빌드·버전 준비 흐름 및 승인 경계를 문서화했습니다.
- 문서 보완에 따른 patch 버전이며 스킬 호출 이름, 입력과 실행 동작은 바뀌지 않습니다.

## 0.1.0

- GitHub workflow, issues, contributing, PR, remote push, build, release 스킬 7개를 제공합니다.
- 기존 게시·DevOps 스킬을 역할에 따라 통합하고 공통 리뷰는 harness-global의 code-review를 재사용합니다.
- GitHub Actions 테스트·소스 패키징·체크섬·버전 및 커밋 출처 검증을 추가했습니다.
- PR과 main push는 빌드만 수행하고, 버전과 커밋이 일치하는 v* 태그에서 릴리스를 게시합니다.
