import * as React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Alert,
  Avatar,
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Checkbox,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  AspectRatio,
  Dialog,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  EmptyState,
  HoverCard,
  Input,
  Kbd,
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Pagination,
  Progress,
  Radio,
  RadioGroup,
  Rating,
  Select,
  Separator,
  Sheet,
  Skeleton,
  Slider,
  Spinner,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  Toggle,
  ToggleGroup,
  ToggleGroupItem,
  Tooltip,
  ToriProvider,
  useTheme,
  useToast,
} from '@toris-dev/ui';

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const dark = resolvedTheme === 'dark';
  return (
    <Switch
      checked={dark}
      onCheckedChange={(next) => setTheme(next ? 'dark' : 'light')}
      label={dark ? 'Dark' : 'Light'}
    />
  );
}

function SliderDemo() {
  const [value, setValue] = React.useState(40);
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={{ fontSize: 13 }}>Volume: {value}</span>
      <Slider value={value} onValueChange={setValue} label="Volume" />
    </label>
  );
}

function PaginationDemo() {
  const [page, setPage] = React.useState(4);
  return <Pagination page={page} count={12} onPageChange={setPage} />;
}

function Showcase() {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [rating, setRating] = React.useState(4);
  const [email, setEmail] = React.useState('');
  const emailError =
    email.length > 0 && !email.includes('@') ? 'Please enter a valid email address.' : undefined;

  return (
    <main className="playground">
      <header className="playground__header">
        <h1 className="playground__title">
          <span>TorisUI Kit</span> Playground
        </h1>
        <ThemeToggle />
      </header>

      <section>
        <h2>Button</h2>
        <div className="playground__row">
          <Button variant="solid">Solid</Button>
          <Button variant="soft">Soft</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="glow">Glow</Button>
          <Button loading>Loading</Button>
          <Button variant="outline" size="sm">
            Small
          </Button>
          <Button variant="glow" size="lg">
            Large
          </Button>
        </div>
      </section>

      <section>
        <h2>Badge · Spinner · Avatar · Skeleton</h2>
        <div className="playground__row">
          <Badge tone="primary">Primary</Badge>
          <Badge tone="success" dot>
            Online
          </Badge>
          <Badge tone="danger" variant="solid">
            Error
          </Badge>
          <Badge tone="warning" variant="solid">
            Degraded
          </Badge>
          <Badge variant="gradient">Gradient</Badge>
          <Spinner size="md" />
          <Avatar name="Toris Dev" status="online" />
          <Avatar name="Ada Lovelace" size="lg" status="busy" />
          <Avatar src="https://avatars.githubusercontent.com/u/66780368?v=4" name="toris-dev" size="lg" />
        </div>
        <div className="playground__grid" style={{ marginTop: 16 }}>
          <Card>
            <div className="playground__row">
              <Skeleton variant="circle" width={40} height={40} />
              <div style={{ flex: 1 }}>
                <Skeleton variant="text" lines={2} />
              </div>
            </div>
          </Card>
          <Card>
            <Skeleton variant="rect" height={72} />
          </Card>
        </div>
      </section>

      <section>
        <h2>Card</h2>
        <div className="playground__grid">
          <Card variant="surface">
            <CardHeader>
              <CardTitle>Surface</CardTitle>
              <CardDescription>The default surface card</CardDescription>
            </CardHeader>
            <CardContent>Uses token-driven background and border.</CardContent>
          </Card>
          <Card
            variant="glass"
            interactive
            onClick={() => toast.info('Card activated — works with Enter/Space too.')}
          >
            <CardHeader>
              <CardTitle>Glass · Interactive</CardTitle>
              <CardDescription>Soft-glass + hover interaction</CardDescription>
            </CardHeader>
            <CardContent>Blurred surface, subtle highlight, keyboard-accessible.</CardContent>
          </Card>
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Elevated</CardTitle>
              <CardDescription>Depth through shadows</CardDescription>
            </CardHeader>
            <CardContent>Floats on a shadow instead of a border.</CardContent>
          </Card>
        </div>
      </section>

      <section>
        <h2>Form controls</h2>
        <div className="playground__grid">
          <Input
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            error={emailError}
            helperText="Used for signing in"
          />
          <Select label="Role" placeholder="Choose a role" helperText="Sets default permissions">
            <option value="admin">Admin</option>
            <option value="editor">Editor</option>
            <option value="viewer">Viewer</option>
          </Select>
          <Textarea label="Bio" placeholder="Tell us about yourself" helperText="Max 200 characters" />
          <div className="playground__row" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
            <Checkbox label="Accept terms" description="Required to create an account" defaultChecked />
            <Checkbox label="Subscribe to updates" />
            <Checkbox label="Select all" indeterminate />
            <Checkbox label="Disabled" disabled />
          </div>
        </div>
      </section>

      <section>
        <h2>Slider · Toggle · Pagination</h2>
        <div className="playground__grid">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <SliderDemo />
            <div className="playground__row">
              <Toggle defaultPressed>Bold</Toggle>
              <ToggleGroup type="single" defaultValue="center" aria-label="Align">
                <ToggleGroupItem value="left">Left</ToggleGroupItem>
                <ToggleGroupItem value="center">Center</ToggleGroupItem>
                <ToggleGroupItem value="right">Right</ToggleGroupItem>
              </ToggleGroup>
            </div>
            <div className="playground__row">
              <span>Press</span> <Kbd>⌘</Kbd> <Kbd>K</Kbd> <span>to search</span>
            </div>
          </div>
          <PaginationDemo />
        </div>
      </section>

      <section>
        <h2>Collapsible · EmptyState</h2>
        <div className="playground__grid">
          <Collapsible defaultOpen>
            <CollapsibleTrigger>▸ What's included?</CollapsibleTrigger>
            <CollapsibleContent>
              28 components, dark mode, zero runtime dependencies, full keyboard a11y.
            </CollapsibleContent>
          </Collapsible>
          <Card>
            <EmptyState
              title="No projects yet"
              description="Create your first project to get started."
              action={<Button variant="glow">New project</Button>}
            />
          </Card>
        </div>
      </section>

      <section>
        <h2>Tabs</h2>
        <Tabs defaultValue="overview">
          <TabsList aria-label="Docs sections">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="props">Props</TabsTrigger>
            <TabsTrigger value="a11y">A11y</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">Use arrow keys to move between tabs.</TabsContent>
          <TabsContent value="props">Props documentation (variant, size, …) goes here.</TabsContent>
          <TabsContent value="a11y">role=tablist/tab/tabpanel + roving tabindex.</TabsContent>
        </Tabs>
      </section>

      <section>
        <h2>Accordion · RadioGroup</h2>
        <div className="playground__grid">
          <Accordion defaultValue="what">
            <AccordionItem value="what">
              <AccordionTrigger>What is TorisUI Kit?</AccordionTrigger>
              <AccordionContent>
                A modern, interactive React component library — soft-glass, dark-first, accessible.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="install">
              <AccordionTrigger>How do I install it?</AccordionTrigger>
              <AccordionContent>Run npm install @toris-dev/ui and import the styles.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="theme">
              <AccordionTrigger>Can I re-brand it?</AccordionTrigger>
              <AccordionContent>Override the --tori-* CSS variables in your own :root.</AccordionContent>
            </AccordionItem>
          </Accordion>
          <RadioGroup defaultValue="pro" aria-label="Plan">
            <Radio value="free" label="Free" description="For personal projects" />
            <Radio value="pro" label="Pro" description="For growing teams" />
            <Radio value="team" label="Team" description="For organizations" />
          </RadioGroup>
        </div>
      </section>

      <section>
        <h2>Progress · Alert · Separator · Breadcrumb</h2>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Components</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Progress</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Separator style={{ margin: '16px 0' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 420 }}>
          <Progress value={72} label="Storage used" />
          <Progress label="Syncing" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16 }}>
          <Alert tone="info" title="Heads up">A new version of the docs is available.</Alert>
          <Alert tone="success" title="Deployed">Your site is live at example.com.</Alert>
          <Alert tone="warning" title="Approaching limit">You have used 90% of your quota.</Alert>
          <Alert tone="danger" title="Build failed" onDismiss={() => toast.info('Alert dismissed.')}>
            Check the logs for details.
          </Alert>
        </div>
      </section>

      <section>
        <h2>Popover · DropdownMenu</h2>
        <div className="playground__row">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">Open popover</Button>
            </PopoverTrigger>
            <PopoverContent>
              <p style={{ margin: 0 }}>
                A non-modal panel. The page stays interactive and Tab flows out.
              </p>
            </PopoverContent>
          </Popover>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="soft">Actions ▾</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Manage</DropdownMenuLabel>
              <DropdownMenuItem onSelect={() => toast.success('Edited')}>Edit</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => toast.info('Duplicated')}>
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled>Archive (soon)</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => toast.error('Deleted')}>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <HoverCard
            content={
              <div>
                <strong>@toris</strong>
                <p style={{ margin: '4px 0 0', color: 'rgb(var(--tori-muted))' }}>
                  Building TorisUI Kit. Hover cards can hold rich, interactive content.
                </p>
              </div>
            }
          >
            <Button variant="ghost">Hover for card</Button>
          </HoverCard>
          <Button variant="outline" onClick={() => setSheetOpen(true)}>
            Open sheet
          </Button>
        </div>
        <Sheet
          open={sheetOpen}
          onOpenChange={setSheetOpen}
          side="right"
          title="Filters"
          description="Refine the results"
          footer={
            <Button variant="solid" onClick={() => setSheetOpen(false)}>
              Apply
            </Button>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Label htmlFor="q" required>
              Query
            </Label>
            <Input id="q" placeholder="Search…" />
          </div>
        </Sheet>
      </section>

      <section>
        <h2>Table · Rating · AspectRatio</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Component</TableHead>
              <TableHead>Category</TableHead>
              <TableHead sort="ascending">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Sheet</TableCell>
              <TableCell>Overlay</TableCell>
              <TableCell>Shipped</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Rating</TableCell>
              <TableCell>Form</TableCell>
              <TableCell>Shipped</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <div className="playground__row" style={{ marginTop: 16 }}>
          <Rating value={rating} onValueChange={setRating} label="Quality" />
          <span style={{ fontSize: 13 }}>{rating} / 5</span>
          <Rating value={5} readOnly size="sm" label="Fixed score" />
        </div>
        <div style={{ maxWidth: 280, marginTop: 16 }}>
          <AspectRatio ratio={16 / 9}>
            <div
              style={{
                display: 'grid',
                placeItems: 'center',
                background: 'var(--tori-gradient-primary)',
                color: '#fff',
                borderRadius: 'var(--tori-radius-md)',
              }}
            >
              16 : 9
            </div>
          </AspectRatio>
        </div>
      </section>

      <section>
        <h2>Dialog · Toast · Tooltip</h2>
        <div className="playground__row">
          <Button variant="outline" onClick={() => setDialogOpen(true)}>
            Open dialog
          </Button>
          <Button variant="soft" onClick={() => toast.success('Saved successfully.')}>
            Success toast
          </Button>
          <Button
            variant="soft"
            onClick={() =>
              toast.promise(new Promise((resolve) => setTimeout(resolve, 1500)), {
                loading: 'Deploying…',
                success: 'Deployed!',
                error: 'Deploy failed',
              })
            }
          >
            Promise toast
          </Button>
          <Tooltip content="Brand gradient button with a kinetic glow on hover">
            <Button variant="glow">Hover me</Button>
          </Tooltip>
        </div>
        <Dialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          role="alertdialog"
          title="Delete project"
          description="This action cannot be undone."
          footer={
            <>
              <Button variant="ghost" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="solid"
                data-autofocus
                onClick={() => {
                  setDialogOpen(false);
                  toast.error('Project deleted.');
                }}
              >
                Delete
              </Button>
            </>
          }
        />
      </section>
    </main>
  );
}

export function App() {
  return (
    <ToriProvider theme="dark">
      <Showcase />
    </ToriProvider>
  );
}
