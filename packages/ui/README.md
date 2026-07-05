# @toris-dev/ui

A modern, interactive React UI component library based on TorisUI.
Soft-glass surfaces, kinetic interactions, gradient accents — dark-first and accessible.

## Install

```bash
npm install @toris-dev/ui
# or
pnpm add @toris-dev/ui
```

## Usage

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

## Components

Button · IconButton · Card · Input · Badge · Spinner · Switch · Dialog · Toast (`useToast`) · Tabs · Tooltip
plus primitives: Slot · Portal · VisuallyHidden.

## Theming

All design tokens are CSS variables (`--tori-*`). Override them in your own `:root` to re-brand:

```css
:root {
  --tori-primary: 59 130 246; /* RGB triplet */
  --tori-radius-md: 18px;
}
```

Dark mode is driven by `data-theme="dark"` on the document element — `ToriProvider` manages it (`light` / `dark` / `system`).

Full documentation lives in the [torisui-kit repository](https://github.com/toris-dev/torisui-kit) under `docs/`.

## License

MIT © toris-dev
