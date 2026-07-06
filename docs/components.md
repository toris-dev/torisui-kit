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

## Textarea

```tsx
<Textarea label="Bio" rows={5} helperText="Max 200 characters" error={errors.bio} />
```

Shares the Input field scaffolding (label / helper / error / `wrapperClassName`)
and the `tori-input` visual style; `resize: vertical`, height driven by `rows`.

## Select

```tsx
<Select label="Fruit" placeholder="Pick one" error={errors.fruit}>
  <option value="apple">Apple</option>
  <option value="banana">Banana</option>
</Select>
```

- Styled **native** `<select>` — keyboard, screen-reader, and mobile behavior for free
- `placeholder` renders as a hidden disabled option (uncontrolled mode starts on it;
  in controlled mode pass `value=""` to show it)
- `size`: `'sm' | 'md' | 'lg'`; same field scaffolding as Input
- A searchable Combobox is planned as a separate component

## Checkbox

```tsx
<Checkbox label="Accept terms" description="Required to continue" onCheckedChange={setAgreed} />
<Checkbox indeterminate label="Select all" />
```

- Real `<input type="checkbox">` underneath — controlled (`checked`) and
  uncontrolled (`defaultChecked`) come from the platform
- `onCheckedChange(boolean)` convenience callback (native `onChange` also fires)
- `indeterminate` sets the native mixed state (announced as "mixed")
- Gradient check styling, focus ring on the box, `wrapperClassName` for the label wrapper

## Avatar

```tsx
<Avatar src="/me.png" name="Toris Dev" size="lg" status="online" />
<Avatar name="Ada Lovelace" />  {/* initials fallback: AL */}
```

- Falls back to initials (first letters of the first two words) when `src` is
  missing or fails to load; the fallback exposes `role="img"` + the name
- `size`: `'sm' | 'md' | 'lg' | 'xl'`; `status`: `online | offline | busy | away`
  (dot with a screen-reader label)

## Skeleton

```tsx
<Skeleton variant="text" lines={3} />
<Skeleton variant="circle" width={64} height={64} />
<Skeleton variant="rect" height={160} />
```

- Purely decorative (`aria-hidden`) — announce loading state via `Spinner` or a live region
- `variant="text"` with `lines` renders a stack with a shorter last line
- Shimmer stops under `prefers-reduced-motion` (static block remains)

## Accordion

```tsx
<Accordion defaultValue="a">           {/* single (default); collapsible */}
  <AccordionItem value="a">
    <AccordionTrigger>Section A</AccordionTrigger>
    <AccordionContent>Panel A content</AccordionContent>
  </AccordionItem>
  <AccordionItem value="b">
    <AccordionTrigger>Section B</AccordionTrigger>
    <AccordionContent>Panel B content</AccordionContent>
  </AccordionItem>
</Accordion>

<Accordion type="multiple">…</Accordion>  {/* any number open */}
```

- `type="single"` (default) keeps one item open; `collapsible={false}` forces one always open
- `type="multiple"` allows several open at once
- Controlled via `value`/`onValueChange` (string for single, string[] for multiple)
- `AccordionTrigger` is a real button inside an `<h3>`; panels are `role="region"`
  wired with `aria-controls`/`aria-labelledby`

## RadioGroup

```tsx
<RadioGroup defaultValue="pro" onValueChange={setPlan}>
  <Radio value="free" label="Free" />
  <Radio value="pro" label="Pro" description="Best value" />
  <Radio value="team" label="Team" />
</RadioGroup>
```

- Built on native `<input type="radio">` — arrow-key navigation, form submission,
  and screen-reader semantics come from the platform; wrapped in `role="radiogroup"`
- Controlled (`value`) or uncontrolled (`defaultValue`); `name` auto-generated if omitted
- `orientation`: `vertical | horizontal`; `disabled` cascades to every radio

## Progress

```tsx
<Progress value={64} label="Uploading" />
<Progress label="Loading" />          {/* indeterminate — omit value */}
```

- `role="progressbar"` with `aria-valuenow/min/max`; `value` clamped to `[0, max]`
- Omit `value` (or pass `null`) for a looping indeterminate bar (static fill under reduced motion)
- `size`: `sm | md | lg`; gradient fill

## Alert

```tsx
<Alert tone="success" title="Saved" onDismiss={() => …}>
  Your changes are live.
</Alert>
```

- `tone`: `info | success | warning | danger` — `danger`/`warning` announce via
  `role="alert"`, `info`/`success` via `role="status"`
- Default tone icon; pass a custom `icon` or `icon={false}` to hide it
- `onDismiss` renders a close button

## Separator

```tsx
<Separator />                              {/* decorative, role="none" */}
<Separator decorative={false} orientation="vertical" />
```

Decorative by default (hidden from assistive tech). Set `decorative={false}` when
the rule marks a meaningful grouping boundary.

## Breadcrumb

```tsx
<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Components</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

- `<nav aria-label="Breadcrumb">` landmark with an ordered list
- `BreadcrumbLink` supports `asChild` for router links; `BreadcrumbPage` marks the
  current page (`aria-current="page"`); separators are `aria-hidden`

## Slider

```tsx
<Slider defaultValue={40} min={0} max={100} step={5} label="Volume" onValueChange={setVol} />
```

- Single-thumb, built on native `<input type="range">` — keyboard, touch, and
  `aria-valuenow` come from the platform
- Controlled (`value`) or uncontrolled (`defaultValue`); filled track uses the brand gradient
- `size`: `sm | md | lg`. Range/dual-thumb is a separate future component.

## Toggle & ToggleGroup

```tsx
<Toggle pressed={bold} onPressedChange={setBold}>Bold</Toggle>

<ToggleGroup type="single" defaultValue="left" aria-label="Align">
  <ToggleGroupItem value="left">Left</ToggleGroupItem>
  <ToggleGroupItem value="center">Center</ToggleGroupItem>
  <ToggleGroupItem value="right">Right</ToggleGroupItem>
</ToggleGroup>
```

- `Toggle`: two-state button (`aria-pressed`); pressed = filled gradient (not a faint
  tint) and mapped to the system `Highlight` in forced-colors mode
- `ToggleGroup`: `type="single"` (radio-like) or `type="multiple"`; arrow-key roving
  focus with one tabstop (segmented-control pattern); `size` cascades to items

## Collapsible

```tsx
<Collapsible defaultOpen>
  <CollapsibleTrigger>Show details</CollapsibleTrigger>
  <CollapsibleContent>Body content</CollapsibleContent>
</Collapsible>
```

Single show/hide disclosure (standalone sibling of Accordion). `aria-expanded`/
`aria-controls` wired, content is `role="region"`, controlled/uncontrolled, fade-in
matching Accordion.

## Pagination

```tsx
<Pagination page={page} count={20} siblingCount={1} onPageChange={setPage} />
```

- `<nav aria-label="Pagination">` landmark; current page carries both a filled
  treatment and `aria-current="page"` (not color alone — WCAG 1.4.1)
- Collapses long ranges with ellipses, always showing first + last; ellipses are
  non-interactive; prev/next disable at the ends

## Kbd

```tsx
<Kbd>⌘</Kbd> <Kbd>K</Kbd>
```

Semantic `<kbd>` keycap in the `--tori-font-mono` token font.

## EmptyState

```tsx
<EmptyState
  icon={<InboxIcon />}
  title="No messages"
  description="You're all caught up."
  action={<Button>Refresh</Button>}
  titleAs="h3"
/>
```

Placeholder for empty lists / first-run. Presentational — the title is a real heading
(`titleAs`), the icon is `aria-hidden`; the consumer owns any live-region announcement.
