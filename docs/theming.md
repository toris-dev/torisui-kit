# Design Tokens & Theming

## Token overview

All tokens live in `packages/ui/src/styles/tokens.css` as CSS variables with the `--tori-` prefix.

### Colors — the RGB triplet rule

Color tokens are stored as **space-separated RGB triplets**, not `rgb()` values.

```css
:root {
  --tori-primary: 124 58 237; /* ❌ #7c3aed, ❌ rgb(124,58,237) */
}
```

Why: it enables alpha composition.

```css
.tori-btn--soft {
  background: rgb(var(--tori-primary) / 0.14); /* primary at 14% opacity */
}
```

### Token categories

| Category | Example tokens |
| --- | --- |
| Colors | `--tori-bg` `--tori-fg` `--tori-primary` `--tori-success` `--tori-danger` `--tori-muted` `--tori-border` `--tori-surface(-raised)` |
| On-color foregrounds | `--tori-gradient-fg` (text on the brand gradient), `--tori-warning-fg` / `--tori-success-fg` (text on bright solid badges) — WCAG-checked in both themes |
| Gradient | `--tori-gradient-primary` (glow buttons, gradient badges, switch on-state) |
| Glass | `--tori-glass-bg` `--tori-glass-border` `--tori-glass-blur` |
| Radius | `--tori-radius-sm/md/lg/full` |
| Shadows | `--tori-shadow-sm/md/lg`, `--tori-glow` |
| Motion | `--tori-motion-fast/normal/slow`, `--tori-ease` |
| Typography | `--tori-font-sans` |
| Focus | `--tori-focus-ring` (shared by every interactive element) |

## Dark mode

The `[data-theme='dark']` selector swaps token values wholesale. Component CSS is
theme-agnostic — it only references tokens, so components contain zero dark-mode code.

```tsx
<ToriProvider theme="dark">   {/* 'light' | 'dark' | 'system' */}
```

- `system`: subscribes to the OS `prefers-color-scheme` and switches automatically
- Runtime switching: `const { setTheme } = useTheme(); setTheme('dark');`
- The `theme` prop is authoritative: changing it overrides any earlier `setTheme()` call

### Avoiding the SSR theme flash

`ToriProvider` applies `data-theme` in an effect, so server-rendered pages paint
one frame with the default theme. To avoid the flash, set the attribute before
hydration (e.g. in your HTML `<head>`):

```html
<script>
  try {
    var theme = localStorage.getItem('theme') ||
      (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
  } catch (_) {}
</script>
```

## Brand customization

Override variables in your project's global CSS. No build configuration needed.

```css
/* consumer global.css — load after @toris-dev/ui/styles.css */
:root {
  --tori-primary: 59 130 246; /* switch to a blue brand */
  --tori-radius-md: 18px;
  --tori-gradient-primary: linear-gradient(135deg, rgb(59 130 246), rgb(16 185 129));
}

[data-theme='dark'] {
  --tori-primary: 96 165 250;
}
```

If you customize `--tori-gradient-primary`, verify text contrast against both
gradient stops and adjust `--tori-gradient-fg` if needed (4.5:1 for small text).

## Motion policy (reduced motion)

Under `prefers-reduced-motion: reduce`:

1. Motion tokens (`--tori-motion-*`) collapse to 0.01ms, and
2. A global rule in base.css kills animations/transitions on all `tori-*` elements —
   except the spinner, which is slowed down instead (progress indication is
   essential motion; a near-zero infinite spin renders as flicker).

Use the motion tokens in new components and reduced-motion support comes for free.
