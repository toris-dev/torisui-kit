# @toris-dev/ui

## 0.3.0

### Minor Changes

- Add six self-contained components: **Slider** (single-thumb, native range, gradient
  fill), **Toggle** + **ToggleGroup** (aria-pressed, single/multiple, roving focus,
  forced-colors-safe), **Collapsible** (single disclosure), **Pagination** (nav landmark,
  non-color current page, ellipsis collapsing), **Kbd** (semantic keycap), and
  **EmptyState** (heading + description + action). Brings the library to 28 components.

  Foundation fixes from review: the focus-visible ring is now a zero-specificity
  `:where()` rule so every future `tori-` component gets it by default (previously a
  hardcoded allowlist); added a `--tori-z-*` z-index token scale (overlays retrofitted
  off magic numbers) and a `--tori-font-mono` token.

## 0.2.0

### Minor Changes

- Add six components across new categories: **Accordion** (single/multiple
  disclosure), **RadioGroup / Radio** (native-input single-select with arrow-key
  navigation), **Progress** (determinate + indeterminate), **Alert**
  (info/success/warning/danger, dismissible), **Separator** (horizontal/vertical),
  and **Breadcrumb** (composable navigation with `asChild` links). Brings the
  library to 22 components. Reduced-motion handling extended to the indeterminate
  progress bar.
