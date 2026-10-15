# 빌드와 릴리스

`VERSION`이 유일한 제품 버전입니다. 초기값은 `0.1.0`이며 정식 SemVer `MAJOR.MINOR.PATCH`를 사용합니다. 스킬별 버전이나 별도 패키지 관리자는 추가하지 않습니다.

## 빌드

Git, Node.js 24, Bash, tar, shasum을 준비합니다. 빠른 회귀 확인은 `node --test scripts/*.test.mjs`, 커밋된 배포본 검증은 다음 명령으로 실행합니다.

```sh
bash scripts/build.sh
```

빌드는 `git archive HEAD`로 커밋된 소스만 가져와 실제 회귀 테스트와 스킬 이름 검사를 수행합니다. 미커밋된 추적 파일은 거부하고 미추적 파일은 포함하지 않습니다. 숨김 설정과 참조 파일을 포함한 소스 묶음, `build-info.json`, 현재 버전의 `release-notes.md`를 tar.gz로 만들고 SHA-256을 생성합니다. 압축을 다시 풀어 스킬 리소스·출처·릴리스 노트와 체크섬도 검사합니다.

PR, main push, Actions의 Build and Release → Run workflow는 빌드만 수행합니다. Artifacts는 30일 보관합니다. 패키지 이름에는 버전과 커밋, Actions artifact 이름에는 run ID와 attempt가 들어갑니다. `build-info.json`은 전체 SHA, 스킬 목록, workflow, event와 run ID/number/attempt를 기록합니다. PR 빌드는 GitHub의 merge commit을 검사합니다. run 번호는 제품 버전을 대체하지 않습니다.

## 다음 버전 준비

1. 수정 사항은 patch, 호환되는 기능·스킬 추가는 minor, 호출 이름 삭제·변경이나 필수 입력 등 기존 사용법을 깨는 변경은 major로 준비합니다. 여러 변경이 있으면 가장 큰 변경을 따릅니다. 일반 CI는 버전을 자동 증가시키지 않습니다.
2. 브랜치에서 `VERSION`과 `CHANGELOG.md`를 수정하고 PR을 만듭니다. CHANGELOG에는 정확히 `## 0.1.0`과 같은 버전 제목 아래 구성·변경 이유·호환성 영향을 기록합니다. 과거 버전 항목은 보존합니다. 현재 버전의 항목이 없거나 비어 있으면 빌드는 실패합니다.
3. build 성공과 필요한 검토 후 PR을 main에 병합합니다. 버전 준비나 main push는 릴리스 발행을 의미하지 않습니다.

## 릴리스 게시

승인된 게시 대상 main 커밋에서 버전과 태그를 맞춥니다. 첫 릴리스 태그는 `v0.1.0`입니다.

```sh
git switch main
git pull --ff-only
version=$(cat VERSION)
git tag -a "v$version" -m "Release v$version"
git push origin "v$version"
```

태그 push만 GitHub Release를 게시합니다. 버전·태그와 peeled commit이 빌드 커밋과 일치해야 하며, 검증한 바로 그 artifact를 내려받아 체크섬을 확인하고 게시합니다. 릴리스 본문에는 현재 버전의 변경 내역과 정확한 커밋·run/attempt가 담깁니다. 설정 push와 수동 빌드만으로는 기존 버전을 게시하지 않습니다.

## 다운로드 및 설치

GitHub Releases에서 같은 버전의 tar.gz와 sha256 파일을 내려받습니다.

```sh
shasum -a 256 -c harness-github-*.sha256
mkdir harness-github-release
tar -xzf harness-github-*.tar.gz -C harness-github-release
mkdir -p "${CODEX_HOME:-$HOME/.codex}/skills"
cp -R harness-github-release/github-* "${CODEX_HOME:-$HOME/.codex}/skills/"
```

같은 이름의 설치본에 로컬 수정이 있으면 먼저 보관하세요. 공통 리뷰·구현 스킬은 README에 안내된 harness-global에서 같은 사용자 스킬 루트에 설치합니다.

## 실패와 재실행

실패한 정확한 SHA와 run/attempt의 로그를 확인합니다. 재실행은 원래 커밋을 검사하므로 후속 수정은 새 커밋의 빌드로 확인합니다.

릴리스는 태그별로 직렬화하고 기존 draft 또는 release가 있으면 CLI가 실패하도록 둡니다. 자동 덮어쓰기·태그 이동·release 삭제 후 재생성은 하지 않습니다. 업로드가 부분 완료되거나 응답이 불확실하면 기존 태그·asset의 실제 바이트·체크섬을 먼저 확인합니다. 이미 게시한 바이트의 변경은 새 버전으로 준비합니다.
