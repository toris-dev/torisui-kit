# 컴포넌트 API

모든 컴포넌트 공통:

- TypeScript Props 타입 export (`ButtonProps` 등)
- `forwardRef` 지원, `className`으로 스타일 확장 가능
- 네이티브 HTML 속성 전달 (`...props`)
- 다크 모드·focus-visible·reduced-motion은 토큰/base 스타일이 자동 처리

## Button

```tsx
<Button variant="glow" size="lg" loading leftIcon={<Icon />}>Deploy</Button>
<Button asChild variant="outline"><a href="/docs">Docs</a></Button>
```

| Prop | 타입 | 기본값 |
| --- | --- | --- |
| `variant` | `'solid' \| 'soft' \| 'outline' \| 'ghost' \| 'glow'` | `'solid'` |
| `size` | `'sm' \| 'md' \| 'lg' \| 'icon'` | `'md'` |
| `loading` | `boolean` — 스피너 표시 + 클릭 차단 + `aria-busy` | `false` |
| `leftIcon` / `rightIcon` | `ReactNode` | — |
| `asChild` | `boolean` — 자식 엘리먼트로 렌더 (링크 등) | `false` |

`IconButton`은 `size="icon"` 고정 + `aria-label` 필수 버전입니다.

## Card

```tsx
<Card variant="glass" interactive>
  <CardHeader>
    <CardTitle>제목</CardTitle>
    <CardDescription>설명</CardDescription>
  </CardHeader>
  <CardContent>내용</CardContent>
  <CardFooter><Button>액션</Button></CardFooter>
</Card>
```

- `variant`: `'surface'`(기본 보더) · `'glass'`(블러 소프트글래스) · `'elevated'`(그림자)
- `interactive`: hover 리프트/press 스케일 + focus ring
- `asChild` 지원 (카드 전체를 링크로 만들 때)

## Input

```tsx
<Input label="이메일" helperText="로그인용" error={errors.email} size="md" />
```

- `error`가 있으면 `aria-invalid` + `role="alert"` 메시지로 전환 (helperText 대체)
- label↔input은 자동 생성 id로 연결, 메시지는 `aria-describedby`로 연결
- `size`: `'sm' | 'md' | 'lg'` (네이티브 `size` 속성은 제외됨)

## Badge

```tsx
<Badge tone="success" dot>Online</Badge>
<Badge variant="gradient">New</Badge>
```

- `variant`: `'solid' | 'soft' | 'outline' | 'gradient'` (기본 `soft`)
- `tone`: `'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info'`
- `dot`: 상태 점 표시

## Spinner

```tsx
<Spinner size="lg" label="불러오는 중" />
```

`role="status"` + 시각적으로 숨긴 label로 스크린리더에 안내됩니다.

## Switch

```tsx
<Switch label="다크 모드" defaultChecked onCheckedChange={setDark} />
<Switch checked={value} onCheckedChange={setValue} />  {/* controlled */}
```

- `role="switch"` + `aria-checked`, Space/Enter 키보드 토글
- `checked`(controlled) / `defaultChecked`(uncontrolled) 모두 지원

## Dialog

```tsx
<Dialog
  open={open}
  onOpenChange={setOpen}
  title="프로젝트 삭제"
  description="이 작업은 되돌릴 수 없습니다."
  footer={<Button onClick={confirm}>삭제</Button>}
  role="alertdialog"
/>
```

- Escape·오버레이 클릭·닫기 버튼 → `onOpenChange(false)` 호출 (상태는 부모 소유)
- 열릴 때 패널로 포커스 이동(`[data-autofocus]` 우선), 닫히면 원래 위치로 복원
- Tab 포커스 트랩 + body 스크롤 잠금
- `role="alertdialog"`이면 오버레이 클릭 닫기가 기본 비활성화

## Toast

```tsx
const { toast, dismiss } = useToast(); // ToriProvider 내부에서만

toast({ title: '저장됨', description: '변경 사항이 반영되었습니다.' });
toast.success('저장되었습니다.');
toast.error('실패했습니다.', { duration: 6000 });
await toast.promise(deploy(), {
  loading: '배포 중…',
  success: '배포 완료!',
  error: (e) => `실패: ${String(e)}`,
});
```

- tone: `default | success | error | info | warning` (error는 `role="alert"`)
- `duration: 0`이면 수동 dismiss까지 유지, 기본 4000ms
- `ToriProvider`가 viewport를 자동 마운트 (우하단, 최대 5개)

## Tabs

```tsx
<Tabs defaultValue="overview" onValueChange={track}>
  <TabsList aria-label="문서 섹션">
    <TabsTrigger value="overview">개요</TabsTrigger>
    <TabsTrigger value="api">API</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">…</TabsContent>
  <TabsContent value="api">…</TabsContent>
</Tabs>
```

- WAI-ARIA tabs 패턴: `tablist/tab/tabpanel`, roving tabindex
- ←/→/Home/End 키 이동(선택이 포커스를 따라가는 automatic activation), 끝에서 순환

## Tooltip

```tsx
<Tooltip content="브랜드 그라디언트" placement="bottom" delay={200}>
  <Button variant="glow">Hover</Button>
</Tooltip>
```

- hover + 키보드 포커스에서 표시, Escape로 닫힘
- 표시 중 트리거에 `aria-describedby` 연결
- `placement`: `top | bottom | left | right` (CSS 포지셔닝)

## Primitives

- `Slot` — 부모 props를 단일 자식에 병합 (`asChild` 구현체)
- `Portal` — SSR-safe `document.body` 렌더링
- `VisuallyHidden` — 스크린리더 전용 텍스트
- `cx(...classes)` — 클래스 조합 유틸
- `useControllableState` — controlled/uncontrolled 패턴 훅
