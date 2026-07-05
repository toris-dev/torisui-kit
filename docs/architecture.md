# 아키텍처

## 모노레포 구조

```txt
torisui-kit/
├─ packages/ui/            # @toris-dev/ui — 배포되는 유일한 패키지
│  ├─ src/
│  │  ├─ components/       # Public 컴포넌트 (Button, Card, Dialog, …)
│  │  ├─ primitives/       # 저수준 프리미티브 (Slot, Portal, VisuallyHidden)
│  │  ├─ hooks/            # 공용 훅 (useControllableState)
│  │  ├─ styles/           # tokens.css / base.css / components.css
│  │  ├─ utils/            # cx 등 유틸
│  │  ├─ __tests__/        # vitest + Testing Library 테스트
│  │  ├─ provider.tsx      # ToriProvider (테마 + Toast 시스템)
│  │  └─ index.ts          # Public API (모든 export의 단일 진입점)
│  ├─ scripts/build-css.mjs # styles.css 번들러
│  └─ tsup.config.ts        # ESM + CJS + d.ts 빌드
├─ apps/docs/              # Vite 플레이그라운드 (비배포)
├─ docs/                   # 프로젝트 문서
└─ .github/workflows/      # ci.yml / publish.yml / publish-token.yml
```

## 레이어 구조

```txt
Design Tokens (CSS 변수, --tori-*)
  ↓
Primitive Components (Slot, Portal, VisuallyHidden)
  ↓
TorisUI Styled Components (Button, Card, Dialog, …)
  ↓
Public API (src/index.ts)
  ↓
Consumer Project (@toris-dev/ui import)
```

- **Design Tokens** — 색상·radius·shadow·motion·타이포를 CSS 변수로 정의. JS 번들에 포함되지 않으므로 소비자가 CSS만으로 재브랜딩 가능.
- **Primitives** — 기능 중심 저수준 컴포넌트. `Slot`은 `asChild` 패턴(임의 엘리먼트로 렌더)을, `Portal`은 SSR-safe한 body 렌더링을 담당.
- **Styled Components** — `tori-` prefix 클래스 + 토큰만 사용. 런타임 스타일 계산 없음.
- **Public API** — `src/index.ts` 하나로 export를 통제. 여기 없는 것은 비공개 취급.

## 빌드 파이프라인

```txt
tsup: src/index.ts ──▶ dist/index.js (ESM) + dist/index.cjs (CJS) + dist/index.d.ts
build-css.mjs: tokens.css + base.css + components.css ──▶ dist/styles.css
```

핵심 결정 사항:

- **CSS는 JS와 분리 배포** (`@toris-dev/ui/styles.css`). CSS-in-JS 미사용 → zero runtime, RSC 친화적.
- 모든 번들 상단에 `'use client'` 배너 삽입 — Next.js App Router에서 그대로 import 가능.
- `react`, `react-dom`은 peerDependencies (>=18). 번들에서 external 처리.
- `sideEffects`에 CSS만 명시 → 소비자 번들러가 미사용 컴포넌트를 tree-shaking.
- `exports` 필드로 진입점 제한: `.`(JS/타입)과 `./styles.css` 둘뿐.

## 테마 시스템

- `ToriProvider`가 `document.documentElement`에 `data-theme="light|dark"`를 세팅.
- `theme="system"`이면 `prefers-color-scheme`를 구독해 자동 전환.
- Toast 시스템(`ToastProvider` + `useToast`)도 `ToriProvider`가 함께 마운트.

## apps/docs가 소스를 직접 보는 이유

`apps/docs`는 `@toris-dev/ui`를 dist가 아닌 `packages/ui/src/index.ts`로 alias합니다
(vite alias + tsconfig paths). 이 덕분에:

1. 컴포넌트 수정이 재빌드 없이 HMR로 즉시 반영되고,
2. fresh clone에서 `pnpm typecheck`가 ui 빌드 없이도 통과합니다 (CI 순서 의존성 제거).
