import * as React from 'react';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Dialog,
  Input,
  Spinner,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Tooltip,
  ToriProvider,
  useTheme,
  useToast,
} from '@toris-dev/ui';

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const dark = resolvedTheme === 'dark';
  return <Switch checked={dark} onCheckedChange={(next) => setTheme(next ? 'dark' : 'light')} label={dark ? 'Dark' : 'Light'} />;
}

function Showcase() {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const emailError =
    email.length > 0 && !email.includes('@') ? '올바른 이메일 형식이 아닙니다.' : undefined;

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
        <h2>Badge & Spinner</h2>
        <div className="playground__row">
          <Badge tone="primary">Primary</Badge>
          <Badge tone="success" dot>
            Online
          </Badge>
          <Badge tone="danger" variant="solid">
            Error
          </Badge>
          <Badge tone="info" variant="outline">
            Beta
          </Badge>
          <Badge variant="gradient">Gradient</Badge>
          <Spinner size="sm" />
          <Spinner size="md" />
          <Spinner size="lg" />
        </div>
      </section>

      <section>
        <h2>Card</h2>
        <div className="playground__grid">
          <Card variant="surface">
            <CardHeader>
              <CardTitle>Surface</CardTitle>
              <CardDescription>기본 서피스 카드</CardDescription>
            </CardHeader>
            <CardContent>토큰 기반 배경과 보더를 사용합니다.</CardContent>
          </Card>
          <Card variant="glass" interactive>
            <CardHeader>
              <CardTitle>Glass · Interactive</CardTitle>
              <CardDescription>Soft-glass + hover 인터랙션</CardDescription>
            </CardHeader>
            <CardContent>블러 서피스와 은은한 하이라이트.</CardContent>
          </Card>
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Elevated</CardTitle>
              <CardDescription>그림자 기반 깊이감</CardDescription>
            </CardHeader>
            <CardContent>보더 없이 그림자로 띄웁니다.</CardContent>
          </Card>
        </div>
      </section>

      <section>
        <h2>Input</h2>
        <div className="playground__grid">
          <Input
            label="이메일"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            error={emailError}
            helperText="로그인에 사용할 이메일"
          />
          <Input label="비활성" placeholder="Disabled" disabled />
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
          <TabsContent value="overview">화살표 키로 탭 사이를 이동할 수 있습니다.</TabsContent>
          <TabsContent value="props">variant, size 등 props 문서가 들어갑니다.</TabsContent>
          <TabsContent value="a11y">role=tablist/tab/tabpanel + roving tabindex.</TabsContent>
        </Tabs>
      </section>

      <section>
        <h2>Dialog · Toast · Tooltip</h2>
        <div className="playground__row">
          <Button variant="outline" onClick={() => setDialogOpen(true)}>
            Open dialog
          </Button>
          <Button variant="soft" onClick={() => toast.success('저장되었습니다.')}>
            Success toast
          </Button>
          <Button
            variant="soft"
            onClick={() =>
              toast.promise(new Promise((resolve) => setTimeout(resolve, 1500)), {
                loading: '배포 중…',
                success: '배포 완료!',
                error: '배포 실패',
              })
            }
          >
            Promise toast
          </Button>
          <Tooltip content="브랜드 그라디언트 버튼">
            <Button variant="glow">Hover me</Button>
          </Tooltip>
        </div>
        <Dialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          title="프로젝트 삭제"
          description="이 작업은 되돌릴 수 없습니다."
          footer={
            <>
              <Button variant="ghost" onClick={() => setDialogOpen(false)}>
                취소
              </Button>
              <Button
                variant="solid"
                onClick={() => {
                  setDialogOpen(false);
                  toast.error('삭제되었습니다.');
                }}
              >
                삭제
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
