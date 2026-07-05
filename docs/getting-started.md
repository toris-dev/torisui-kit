# 시작 가이드

## 요구 사항

- Node.js ≥ 20 (CI는 24 사용)
- pnpm 9.x (`packageManager` 필드로 고정: `pnpm@9.14.2`)

## 셋업

```bash
git clone https://github.com/toris-dev/torisui-kit.git
cd torisui-kit
pnpm install
```

## 자주 쓰는 명령어

| 명령어 | 설명 |
| --- | --- |
| `pnpm verify` | lint + typecheck + test + build 전체 게이트 (PR 전 필수) |
| `pnpm lint` | ESLint (루트 flat config, 전체 워크스페이스) |
| `pnpm typecheck` | 모든 패키지 `tsc --noEmit` |
| `pnpm test` | vitest 단위/인터랙션 테스트 |
| `pnpm build` | 모든 패키지 빌드 (ui: tsup + styles.css 번들) |
| `pnpm --filter torisui-docs dev` | 플레이그라운드 dev 서버 (localhost:5173) |
| `pnpm --filter @toris-dev/ui test:watch` | 테스트 watch 모드 |
| `pnpm changeset` | 릴리즈 노트/버전 범프 기록 |
| `pnpm format` | Prettier 포맷 |

## 플레이그라운드 (apps/docs)

`apps/docs`는 Vite 기반 데모 앱으로, 모든 컴포넌트의 variant/상태를 한 화면에서 확인합니다.

- 라이브러리를 **dist가 아니라 소스로 alias** 하므로 (`vite.config.ts`), `packages/ui/src`를 수정하면 즉시 HMR 반영됩니다.
- 실제 소비자용 import 경로는 `@toris-dev/ui` + `@toris-dev/ui/styles.css` 입니다 (README 참고).

## 새 컴포넌트 추가 절차

1. `packages/ui/src/components/<name>.tsx` 작성 — [harness.md](./harness.md)의 품질 기준 준수
2. `packages/ui/src/styles/components.css`에 `tori-<name>` 스타일 추가 (토큰만 사용)
3. `packages/ui/src/index.ts`에 컴포넌트 + Props 타입 export
4. `packages/ui/src/__tests__/<name>.test.tsx` 테스트 작성
5. `apps/docs/src/App.tsx`에 데모 섹션 추가
6. `pnpm verify` 통과 확인 → `pnpm changeset`으로 변경 기록 → PR
