# 릴리즈 & npm 배포

npm 패키지명: **`@toris-dev/ui`** (scoped public). 배포는 GitHub Release 발행으로만 트리거됩니다.

## 배포 흐름

```txt
1. feat/* 브랜치에서 개발, PR에 pnpm changeset 포함
2. CI 통과 → main merge
3. pnpm changeset version   # 버전 범프 + CHANGELOG 생성 커밋
4. git tag v0.x.y && GitHub Release 발행
5. publish.yml 자동 실행 → 게이트 재검증 → npm publish (Trusted Publishing)
6. npm에서 @toris-dev/ui 새 버전 확인
```

## 1. Trusted Publishing 설정 (기본, 최초 1회)

장기 npm 토큰 없이 GitHub Actions OIDC로 배포합니다.

### 사전 조건

- npm 계정 `toris-dev`에 최초 1회 수동 publish가 필요할 수 있음:

```bash
cd packages/ui
npm login
pnpm build
npm publish --access public
```

### npmjs.com 설정

`@toris-dev/ui` 패키지 → Settings → **Trusted Publisher**:

| 항목 | 값 |
| --- | --- |
| Publisher | GitHub Actions |
| Organization/User | GitHub 저장소 **소유자** 계정 (npm 계정명과 다를 수 있음 — 주의) |
| Repository | `torisui-kit` |
| Workflow filename | `publish.yml` |
| Environment | `npm` |

> 예: 저장소가 `ironjustlikethat/torisui-kit`이면 Organization/User는 `ironjustlikethat`,
> `toris-dev/torisui-kit`이면 `toris-dev`.

### GitHub 저장소 설정

- Settings → Environments → `npm` 환경 생성 (publish.yml의 `environment: npm`과 일치해야 함)
- 워크플로에는 `permissions: id-token: write`가 이미 설정되어 있음
- Trusted Publishing은 npm CLI ≥ 11.5.1 필요 → workflow가 Node 24를 사용하므로 충족

## 2. 토큰 fallback (publish-token.yml)

Trusted Publishing 설정 전이거나 OIDC가 불가한 경우:

1. npmjs.com → Access Tokens → **Granular** 토큰 발급 (packages: `@toris-dev/ui`, read-write)
2. GitHub 저장소 Settings → Secrets → `NPM_TOKEN` 등록
3. Actions 탭 → "Publish Package With Token" → **Run workflow** (수동 트리거 전용)

> 실수 배포를 막기 위해 fallback은 release 이벤트가 아닌 `workflow_dispatch`로만 실행됩니다.

## 3. 배포 전 체크리스트

- [ ] `pnpm verify` 통과 (lint/typecheck/test/build)
- [ ] `cd packages/ui && npm pack --dry-run` — dist/README/LICENSE만 포함되는지 확인
- [ ] `pnpm changeset version` 실행됨 (버전 범프 + CHANGELOG)
- [ ] README 최신화
- [ ] 패키지명 `@toris-dev/ui`, `publishConfig.access: public` 확인
- [ ] GitHub Release note 작성 (Changesets가 만든 CHANGELOG 참고)

## 4. 버전 규칙 (Changesets)

| 변경 | semver |
| --- | --- |
| Props/동작의 breaking change, 토큰 이름 변경 | major |
| 새 컴포넌트, 새 prop, 새 토큰 | minor |
| 버그 수정, 스타일 미세 조정, 문서 | patch |

0.x 동안은 breaking도 minor로 처리합니다 (npm semver 관례).

## 5. 배포 사고 대응

- 잘못된 버전 배포 시: `npm deprecate @toris-dev/ui@x.y.z "use x.y.z+1"` 후 패치 배포 (unpublish는 72시간 제한 + 비권장)
- publish.yml 실패 시: Actions 로그 확인 → 게이트 실패면 코드 수정 후 Release 재발행, OIDC 실패면 Trusted Publisher 설정 값(소유자/repo/워크플로명/environment) 재확인
