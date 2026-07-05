# TorisUI Kit — 에이전트 가이드

pnpm workspace 모노레포. 배포 대상은 `packages/ui`(npm: `@toris-dev/ui`) 하나이며,
`apps/docs`는 배포하지 않는 Vite 플레이그라운드다.

## 하네스 (필수 통과 게이트)

```bash
pnpm verify   # lint → typecheck → test → build. PR 전 반드시 통과.
```

- lint: 루트 `eslint.config.mjs` (flat config) 하나로 전체 커버
- test: `packages/ui`의 vitest + Testing Library (jsdom). `globals: true`는 RTL 자동 cleanup에 필요 — 끄지 말 것
- build: tsup(ESM+CJS+d.ts) 후 `scripts/build-css.mjs`가 tokens→base→components 순서로 `dist/styles.css` 생성. 순서 변경 금지(캐스케이드 의존)

## 컨벤션

- 컴포넌트 품질 기준: forwardRef, className 확장, controlled/uncontrolled, 다크모드, focus-visible, reduced-motion, 테스트 동반 — docs/harness.md 참고
- CSS는 `tori-` prefix BEM 유사 클래스 + `--tori-*` CSS 변수만 사용. CSS-in-JS 금지
- 색상 토큰은 RGB triplet(`124 58 237`) 형식 — `rgb(var(--tori-primary) / 0.4)` 알파 합성용
- 커밋: `feat|fix|style|refactor|docs|test|chore:` prefix
- 버전/배포: Changesets. 기능 PR에는 `pnpm changeset`으로 노트 추가. 배포는 GitHub Release 발행 → publish.yml (npm Trusted Publishing)

## 주의

- `apps/docs`는 라이브러리를 dist가 아닌 **소스 alias**로 import한다 (vite.config.ts + tsconfig paths). 새 export를 추가해도 재빌드 없이 플레이그라운드에 반영됨
- `packages/ui/package.json`의 `files`, `exports`, `publishConfig.access: public`은 배포 안전장치 — 임의 수정 금지
