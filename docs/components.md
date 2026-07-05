# Component API

Common to every component:

- TypeScript prop types are exported (`ButtonProps`, etc.)
- `forwardRef` support; styles extend via `className`
- Native HTML attributes pass through (`...props`)
- Dark mode, focus-visible, and reduced-motion are handled by tokens/base styles

## Button

```tsx
<Button variant="glow" size="lg" loading leftIcon={<Icon />}>Deploy</Button>
<Button asChild variant="outline"><a href="/docs">Docs</a></Button>
```

| Prop | Type | Default |
| --- | --- | --- |
| `variant` | `'solid' \| 'soft' \| 'outline' \| 'ghost' \| 'glow'` | `'solid'` |
| `size` | `'sm' \| 'md' \| 'lg' \| 'icon'` | `'md'` |
| `loading` | `boolean` — spinner + blocked interaction + `aria-busy` | `false` |
| `leftIcon` / `rightIcon` | `ReactNode` | — |
| `asChild` | `boolean` — render the child element (links etc.) | `false` |

`asChild` has full parity: spinner, icons, and label wrapping render inside the
child element, and `loading`/`disabled` block activation via `aria-disabled` +
click interception (non-button elements have no native `disabled`).

`IconButton` is the `size="icon"` variant with a required `aria-label`.

## Card

```tsx
<Card variant="glass" interactive onClick={openDetail}>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content</CardContent>
  <CardFooter><Button>Action</Button></CardFooter>
</Card>
```

- `variant`: `'surface'` (default border) · `'glass'` (blurred soft-glass) · `'elevated'` (shadow)
- `interactive`: hover lift / press scale + focus ring. When rendered as a plain
  div it also gets `role="button"`, `tabIndex={0}`, and Enter/Space activation —
  clickable cards stay keyboard-accessible. Override `role`/`tabIndex` to opt out.
- `asChild` supported (e.g. make the whole card a link — then the child provides semantics)

## Input

```tsx
<Input label="Email" helperText="Used for sign-in" error={errors.email} size="md" />
```

- A truthy `error` switches the field to invalid: `aria-invalid` + `role="alert"`
  message (replacing `helperText`); empty string / `false` do not
- label↔input are linked via a generated id; messages via `aria-describedby`
- `size`: `'sm' | 'md' | 'lg'` (the native `size` attribute is omitted)
- `wrapperClassName` styles the outer field wrapper

## Badge

```tsx
<Badge tone="success" dot>Online</Badge>
<Badge variant="gradient">New</Badge>
```

- `variant`: `'solid' | 'soft' | 'outline' | 'gradient'` (default `soft`)
- `tone`: `'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info'`
- `dot`: renders a status dot
- Solid warning/success and gradient badges use dedicated foreground tokens
  (`--tori-warning-fg`, `--tori-success-fg`, `--tori-gradient-fg`) to keep
   12px text at WCAG 4.5:1 in both themes

## Spinner

```tsx
<Spinner size="lg" label="Loading data" />
```

`role="status"` plus a visually-hidden label announces loading to screen readers.
Under reduced motion the spin is slowed, not frozen (a near-zero infinite spin flickers).

## Switch

```tsx
<Switch label="Dark mode" defaultChecked onCheckedChange={setDark} />
<Switch checked={value} onCheckedChange={setValue} />  {/* controlled */}
```

- `role="switch"` + `aria-checked`, Space/Enter keyboard toggle
- Both `checked` (controlled) and `defaultChecked` (uncontrolled) supported
- `className` always styles the switch control; `wrapperClassName` styles the
  `<label>` wrapper (mirrors the Input convention)

## Dialog

```tsx
<Dialog
  open={open}
  onOpenChange={setOpen}
  title="Delete project"
  description="This cannot be undone."
  footer={<Button onClick={confirm}>Delete</Button>}
  role="alertdialog"
/>
```

- Escape / overlay click / close button → `onOpenChange(false)` (state lives in the parent)
- On open, focus moves into the panel (`[data-autofocus]` wins); on close it returns
- Tab focus trap + **ref-counted** body scroll lock (stacked dialogs unlock only
  when the last one closes)
- With stacked dialogs, Escape closes only the **top-most** one, and it respects
  `event.defaultPrevented` from inner widgets
- `role="alertdialog"` disables overlay-click dismissal by default

## Toast

```tsx
const { toast, dismiss } = useToast(); // inside ToriProvider only

toast({ title: 'Saved', description: 'Your changes are live.' });
toast.success('Saved!');
toast.error('Something failed.', { duration: 6000 });
await toast.promise(deploy(), {
  loading: 'Deploying…',
  success: 'Deployed!',
  error: (e) => `Failed: ${String(e)}`,
});
```

- Tones: `default | success | error | info | warning` (error uses `role="alert"`)
- `duration: 0` keeps a toast until manually dismissed; default is
  `DEFAULT_TOAST_DURATION` (4000ms, exported)
- Hovering or focusing a toast pauses its timer; leaving restarts the full duration
- Over the `limit` (default 5), the oldest **dismissible** toasts are evicted first —
  a pending `toast.promise` toast survives and can still resolve
- `ToriProvider` mounts the viewport automatically (bottom-right)

## Tabs

```tsx
<Tabs defaultValue="overview" onValueChange={track}>
  <TabsList aria-label="Doc sections">
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="api">API</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">…</TabsContent>
  <TabsContent value="api">…</TabsContent>
</Tabs>
```

- WAI-ARIA tabs pattern: `tablist/tab/tabpanel`, roving tabindex
- ←/→/Home/End with wrap-around; selection follows focus (automatic activation)
- Keyboard navigation is scoped to the owning tablist — nested `Tabs` instances don't interfere
- When nothing is selected, the first trigger stays keyboard-reachable
- `value` strings are slugged for DOM ids, so values with spaces are safe;
  values must be unique within one `Tabs`

## Tooltip

```tsx
<Tooltip content="Brand gradient" placement="bottom" delay={200}>
  <Button variant="glow">Hover</Button>
</Tooltip>
```

- Shows on hover + keyboard focus, hides on Escape
- The bubble is mounted **only while open** (no hidden DOM cost per tooltip)
- `aria-describedby` is composed with any existing value on the trigger
- `placement`: `top | bottom | left | right` — pure CSS positioning, no viewport
  collision handling; content wraps at `max-width: 280px`

## Primitives & hooks

- `Slot` — merges parent props onto a single child (the `asChild` engine).
  Event handlers compose (child first, then slot); refs chain via `composeRefs`
- `Portal` — SSR-safe `document.body` rendering
- `VisuallyHidden` — screen-reader-only text
- `cx(...classes)` — class name joiner
- `composeRefs(...refs)` — merge callback/object refs
- `useControllableState` — controlled/uncontrolled state with updater-function support
- `useEscapeKey(active, handler)` — document-level Escape handling for overlays
