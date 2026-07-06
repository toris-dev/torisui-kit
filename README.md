# TorisUI Kit

[![npm](https://img.shields.io/npm/v/@toris-dev/ui)](https://www.npmjs.com/package/@toris-dev/ui)
[![CI](https://github.com/toris-dev/torisui-kit/actions/workflows/ci.yml/badge.svg)](https://github.com/toris-dev/torisui-kit/actions/workflows/ci.yml)
[![license: MIT](https://img.shields.io/badge/license-MIT-blue)](./LICENSE)

Monorepo for **[`@toris-dev/ui`](https://www.npmjs.com/package/@toris-dev/ui)** — a modern, interactive React UI component library based on TorisUI.

> Interactive · Modern · Fluid · Soft-glass · Dark-first · Accessible · Developer-friendly

## Install & use

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

## Repository layout

```txt
torisui-kit/
├─ packages/ui/        # @toris-dev/ui library (tsup build, vitest tests)
├─ apps/docs/          # Vite component playground (pnpm --filter torisui-docs dev)
├─ docs/               # Project documentation (architecture, harness, releases, theming)
└─ .github/workflows/  # CI + hardened npm publish automation
```

## Development commands

```bash
pnpm install                            # install dependencies
pnpm verify                             # lint + typecheck + test + build (full quality gate)
pnpm --filter torisui-docs dev          # run the playground (localhost:5173)
pnpm --filter @toris-dev/ui test:watch  # component tests in watch mode
pnpm changeset                          # record a version bump / release note
```

## Components

| Component | Status | Notes |
| --- | --- | --- |
| Button / IconButton | ✅ | solid·soft·outline·ghost·glow, loading, icons, `asChild` (full parity) |
| Card | ✅ | surface·glass·elevated; `interactive` is keyboard-accessible |
| Input / Textarea | ✅ | shared field scaffolding: label, helper, error, full ARIA wiring |
| Select | ✅ | styled native select, placeholder option, field scaffolding |
| Checkbox / RadioGroup | ✅ | native inputs, indeterminate, description line, arrow-key nav |
| Slider | ✅ | single-thumb native range, gradient fill, keyboard/touch |
| Toggle / ToggleGroup | ✅ | aria-pressed, single/multiple, roving focus, forced-colors safe |
| Badge | ✅ | solid·soft·outline·gradient × 6 tones, WCAG-checked foregrounds |
| Avatar | ✅ | image with initials fallback, 4 sizes, status dot |
| Alert | ✅ | info/success/warning/danger, default icons, dismissible |
| Progress | ✅ | determinate + indeterminate, gradient fill, reduced-motion safe |
| Spinner / Skeleton | ✅ | loading states; reduced-motion safe shimmer |
| Switch | ✅ | controlled/uncontrolled, keyboard, `wrapperClassName` |
| Accordion / Collapsible | ✅ | multi/single-item and standalone disclosure, region wiring |
| Dialog | ✅ | focus trap, stacked-dialog Escape, ref-counted scroll lock |
| Toast | ✅ | success/error/info/warning/promise, hover-pause, smart eviction |
| Tabs | ✅ | roving tabindex, arrow/Home/End keys, nested-safe |
| Tooltip | ✅ | hover/focus, delay, placement, mounted only while open |
| Pagination | ✅ | nav landmark, non-color current page, ellipsis collapsing |
| Separator / Breadcrumb | ✅ | layout divider; composable navigation trail with `asChild` |
| Kbd / EmptyState | ✅ | semantic keycap; empty/first-run placeholder with action slot |

## Documentation

- [Getting started](./docs/getting-started.md)
- [Architecture](./docs/architecture.md)
- [Design tokens & theming](./docs/theming.md)
- [Component API](./docs/components.md)
- [Engineering harness](./docs/harness.md) — quality gates, CI, testing strategy
- [Releases & npm publishing](./docs/release.md) — Changesets + Trusted Publishing

## License

[MIT](./LICENSE) © toris-dev
