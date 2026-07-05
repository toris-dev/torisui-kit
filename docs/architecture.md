# Architecture

## Monorepo layout

```txt
torisui-kit/
├─ packages/ui/            # @toris-dev/ui — the only published package
│  ├─ src/
│  │  ├─ components/       # Public components (Button, Card, Dialog, …)
│  │  ├─ primitives/       # Low-level primitives (Slot, Portal, VisuallyHidden)
│  │  ├─ hooks/            # Shared hooks (useControllableState, useEscapeKey)
│  │  ├─ styles/           # tokens.css / base.css / components.css
│  │  ├─ utils/            # cx and friends
│  │  ├─ __tests__/        # vitest + Testing Library tests
│  │  ├─ provider.tsx      # ToriProvider (theme + toast system)
│  │  └─ index.ts          # Public API (single entry point for all exports)
│  ├─ scripts/build-css.mjs # styles.css bundler
│  └─ tsup.config.ts        # ESM + CJS + d.ts build
├─ apps/docs/              # Vite playground (not published)
├─ docs/                   # Project documentation
└─ .github/workflows/      # ci.yml / publish.yml / publish-token.yml
```

## Layer structure

```txt
Design Tokens (CSS variables, --tori-*)
  ↓
Primitive Components (Slot, Portal, VisuallyHidden)
  ↓
TorisUI Styled Components (Button, Card, Dialog, …)
  ↓
Public API (src/index.ts)
  ↓
Consumer Project (imports @toris-dev/ui)
```

- **Design Tokens** — colors, radius, shadows, motion, and typography as CSS
  variables. They never enter the JS bundle, so consumers can re-brand with CSS alone.
- **Primitives** — behavior-focused low-level components. `Slot` implements the
  `asChild` pattern (render as an arbitrary element) with handler composition and
  ref chaining; `Portal` provides SSR-safe body rendering.
- **Styled Components** — use `tori-` prefixed classes and tokens only. No runtime
  style computation.
- **Public API** — `src/index.ts` is the single gate for exports. Anything not
  exported there is private.

## Build pipeline

```txt
tsup: src/index.ts ──▶ dist/index.js (ESM) + dist/index.cjs (CJS) + dist/index.d.ts + dist/index.d.cts
build-css.mjs: tokens.css + base.css + components.css ──▶ dist/styles.css
```

Key decisions:

- **CSS ships separately from JS** (`@toris-dev/ui/styles.css`). No CSS-in-JS →
  zero runtime cost, RSC-friendly.
- Every bundle starts with a `'use client'` banner — import it directly in the
  Next.js App Router.
- `react` and `react-dom` are peerDependencies (>=18) and external to the bundle.
- `sideEffects` lists only CSS → consumers tree-shake unused components.
- The `exports` field exposes exactly two entry points — `.` and `./styles.css` —
  with **per-condition type declarations**: `import` resolves `index.d.ts`,
  `require` resolves `index.d.cts`, so both ESM and CJS TypeScript consumers get
  correctly-flavored types.

## Theme system

- `ToriProvider` sets `data-theme="light|dark"` on `document.documentElement`
  (or a custom `target` element for scoped/multi-provider setups).
- `theme="system"` subscribes to `prefers-color-scheme` (with a legacy
  `addListener` fallback for Safari < 14).
- The toast system (`ToastProvider` + `useToast`) is mounted by `ToriProvider`.
- SSR: the attribute is applied in an effect, so add a pre-hydration inline
  script to avoid a theme flash — see [theming.md](./theming.md).

## Why apps/docs reads source directly

`apps/docs` aliases `@toris-dev/ui` to `packages/ui/src/index.ts`
(vite alias + tsconfig paths). Because of this:

1. Component edits hot-reload without a rebuild, and
2. `pnpm typecheck` passes on a fresh clone without building ui first
   (no CI ordering dependency).
