import * as React from 'react';
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Checkbox,
  Dialog,
  Input,
  Select,
  Skeleton,
  Spinner,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
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

function Showcase() {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = React.useState(false);
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
