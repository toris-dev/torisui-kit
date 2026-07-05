# 엔지니어링 하네스

이 문서는 TorisUI Kit의 **품질을 기계적으로 보장하는 장치들**(하네스)을 정의합니다.
"사람이 조심하는 것"이 아니라 "도구가 막아주는 것"이 원칙입니다.

## 한눈에 보기

```txt
로컬:  pnpm verify  =  lint → typecheck → test → build
PR/CI: .github/workflows/ci.yml  (동일 게이트 + npm pack --dry-run)
배포:  GitHub Release 발행 → publish.yml → 게이트 재실행 → npm publish (OIDC)
안전망: prepublishOnly, files 필드, exports 제한, publishConfig.access
```

## 1. 품질 게이트

로컬과 CI가 **완전히 동일한** 4단계 게이트를 사용합니다.

| 단계 | 명령 | 도구 | 잡는 것 |
| --- | --- | --- | --- |
| Lint | `pnpm lint` | ESLint 9 flat config + typescript-eslint + react-hooks | 훅 규칙 위반, 미사용 변수, 타입 import 일관성 |
| Typecheck | `pnpm typecheck` | `tsc --noEmit` (strict, `noUncheckedIndexedAccess`) | 타입 오류, 인덱스 접근 실수 |
| Test | `pnpm test` | vitest + @testing-library/react (jsdom) | 동작·접근성·키보드 인터랙션 회귀 |
| Build | `pnpm build` | tsup + build-css.mjs | 번들/타입 선언 생성 실패, CSS 누락 |

`pnpm verify` 하나로 전부 실행됩니다. **PR 전 필수.**

### 테스트 전략

- 위치: `packages/ui/src/__tests__/*.test.tsx`
- 원칙: 구현이 아닌 **접근성 계약**을 테스트한다 — `getByRole`, `aria-*` 검증 중심
  - 예: Switch는 `role="switch"` + `aria-checked`, Tabs는 화살표 키 이동, Dialog는 Escape 닫기
- vitest `globals: true`는 Testing Library의 **자동 cleanup에 필수** — 끄면 렌더가 누적되어 테스트가 오염됨
- 인터랙션은 `fireEvent`가 아닌 `@testing-library/user-event` 사용

## 2. CI (.github/workflows/ci.yml)

트리거: 모든 PR + `main` push. 순서:

```txt
checkout → pnpm/action-setup → setup-node(24, pnpm cache)
→ pnpm install --frozen-lockfile
→ lint → typecheck → test → build
→ npm pack --dry-run   # 배포 tarball 내용물 검증
```

주의점:

- **pnpm/action-setup이 setup-node보다 먼저** 와야 pnpm store 캐시가 동작합니다 (기획서 초안의 순서 버그를 수정함).
- pnpm 버전은 workflow에 하드코딩하지 않고 루트 `package.json`의 `packageManager` 필드에서 읽습니다 — 버전 단일 관리.
- `--frozen-lockfile`로 lockfile 불일치를 CI에서 차단.

## 3. 배포 하네스

상세 절차는 [release.md](./release.md) 참고. 하네스 관점 요약:

- **publish.yml** (기본): GitHub Release 발행 시에만 실행. npm **Trusted Publishing(OIDC)** — 장기 토큰 없음. `environment: npm` + `id-token: write`. 배포 직전에 4단계 게이트 + `npm pack --dry-run`을 다시 실행.
- **publish-token.yml** (fallback): `NPM_TOKEN` 시크릿 기반. 실수 실행을 막기 위해 `workflow_dispatch`(수동)로만 트리거.
- **prepublishOnly**: 로컬에서 `npm publish`를 직접 치더라도 lint/typecheck/test/build가 강제 실행됨.

### 패키지 오염 방지

- `files: ["dist", "README.md", "LICENSE"]` — 소스·테스트·설정 파일은 tarball에서 원천 배제
- `exports` 필드 — 소비자가 접근 가능한 경로를 `.`과 `./styles.css`로 제한
- `publishConfig.access: public` — scoped 패키지 공개 배포 명시
- CI의 `npm pack --dry-run` — 포함 파일 목록이 PR 로그에 항상 남음

## 4. 버저닝 하네스 (Changesets)

- 기능/수정 PR에는 `pnpm changeset`으로 semver 수준 + 요약을 기록
- 릴리즈 시 `pnpm changeset version`이 버전 범프 + CHANGELOG 생성을 자동화
- `apps/docs`(torisui-docs)는 `.changeset/config.json`의 `ignore`에 등록 — 버저닝 제외

## 5. 컴포넌트 품질 기준 (Definition of Done)

새 컴포넌트는 아래를 모두 만족해야 merge 가능:

- [ ] TypeScript Props 타입 export
- [ ] `forwardRef` 지원 (합리적인 경우)
- [ ] `className` 확장 가능, 네이티브 props 전달
- [ ] 상태형 컴포넌트는 controlled/uncontrolled 모두 지원 (`useControllableState`)
- [ ] 스타일은 `--tori-*` 토큰만 사용 (하드코딩 색상 금지) → 다크 모드 자동 대응
- [ ] focus-visible 스타일 (base.css 공용 셀렉터에 추가)
- [ ] 모션은 `--tori-motion-*` 토큰 사용 → reduced-motion 자동 대응
- [ ] 키보드 내비게이션 + 적절한 ARIA role/속성
- [ ] `src/__tests__/`에 동작 테스트 (역할 기반 쿼리)
- [ ] `apps/docs` 플레이그라운드에 데모 추가
- [ ] `src/index.ts`에 export + `pnpm verify` 통과

## 6. 로컬 개발 규칙

- 커밋 prefix: `feat / fix / style / refactor / docs / test / chore`
- 브랜치: `main`(안정) / `feat/*` / `fix/*` / `release/*`
- 포맷: Prettier (`pnpm format`). CI 게이트는 아니지만 PR 전 실행 권장
