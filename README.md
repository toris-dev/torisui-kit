# TorisUI Kit

[![npm](https://img.shields.io/npm/v/@toris-dev/ui)](https://www.npmjs.com/package/@toris-dev/ui)
[![CI](https://github.com/toris-dev/torisui-kit/actions/workflows/ci.yml/badge.svg)](https://github.com/toris-dev/torisui-kit/actions/workflows/ci.yml)
[![license: MIT](https://img.shields.io/badge/license-MIT-blue)](./LICENSE)

기존 `torisui` 컴포넌트를 기반으로 한 **인터랙티브하고 모던한 React UI 컴포넌트 패키지** 모노레포입니다.
npm 패키지는 [`@toris-dev/ui`](https://www.npmjs.com/package/@toris-dev/ui)로 배포됩니다.

> Interactive · Modern · Fluid · Soft-glass · Dark-first · Accessible · Developer-friendly

## 설치 & 사용

```bash
npm install @toris-dev/ui
```

```tsx
import { Button, Card, ToriProvider } from '@toris-dev/ui';
import '@toris-dev/ui/styles.css';

export default function App() {
  return (
    <ToriProvider theme="dark">
      <Card interactive>
        <Button variant="glow">Start</Button>
      </Card>
    </ToriProvider>
  );
}
```

## 저장소 구조

```txt
torisui-kit/
├─ packages/ui/        # @toris-dev/ui 라이브러리 (tsup 빌드, vitest 테스트)
├─ apps/docs/          # Vite 기반 컴포넌트 플레이그라운드 (pnpm --filter torisui-docs dev)
├─ docs/               # 프로젝트 문서 (아키텍처, 하네스, 릴리즈, 테마)
└─ .github/workflows/  # CI + npm 배포 자동화
```

## 개발 명령어

```bash
pnpm install          # 의존성 설치
pnpm verify           # lint + typecheck + test + build (전체 품질 게이트)
pnpm --filter torisui-docs dev   # 플레이그라운드 실행 (localhost:5173)
pnpm --filter @toris-dev/ui test:watch  # 컴포넌트 테스트 watch 모드
pnpm changeset        # 릴리즈 노트(버전 범프) 기록
```

## 컴포넌트 (MVP)

| 컴포넌트 | 상태 | 비고 |
| --- | --- | --- |
| Button / IconButton | ✅ | solid·soft·outline·ghost·glow, loading, asChild |
| Card | ✅ | surface·glass·elevated, interactive |
| Input | ✅ | label, helper, error, aria wiring |
| Badge | ✅ | solid·soft·outline·gradient × 6 tones |
| Spinner | ✅ | sm/md/lg, screen-reader label |
| Switch | ✅ | controlled/uncontrolled, keyboard |
| Dialog | ✅ | focus trap, Escape, scroll lock, alertdialog |
| Toast | ✅ | success/error/info/warning/promise, useToast |
| Tabs | ✅ | roving tabindex, arrow-key navigation |
| Tooltip | ✅ | hover/focus, delay, placement |

## 문서

- [시작 가이드](./docs/getting-started.md)
- [아키텍처](./docs/architecture.md)
- [디자인 토큰 & 테마](./docs/theming.md)
- [컴포넌트 API](./docs/components.md)
- [엔지니어링 하네스](./docs/harness.md) — 품질 게이트, CI, 테스트 전략
- [릴리즈 & npm 배포](./docs/release.md) — Changesets + Trusted Publishing

## 라이선스

[MIT](./LICENSE) © toris-dev
