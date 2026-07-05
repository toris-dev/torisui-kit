# 디자인 토큰 & 테마

## 토큰 개요

모든 토큰은 `packages/ui/src/styles/tokens.css`에 CSS 변수로 정의되며 `--tori-` prefix를 사용합니다.

### 색상 — RGB triplet 규칙

색상 토큰은 `rgb()` 값이 아니라 **공백으로 구분된 RGB triplet**으로 저장합니다.

```css
:root {
  --tori-primary: 124 58 237; /* ❌ #7c3aed, ❌ rgb(124,58,237) */
}
```

이유: 알파 합성이 가능해집니다.

```css
.tori-btn--soft {
  background: rgb(var(--tori-primary) / 0.14); /* primary 14% 투명도 */
}
```

### 토큰 카테고리

| 카테고리 | 토큰 예시 |
| --- | --- |
| 색상 | `--tori-bg` `--tori-fg` `--tori-primary` `--tori-success` `--tori-danger` `--tori-muted` `--tori-border` `--tori-surface(-raised)` |
| 그라디언트 | `--tori-gradient-primary` (glow 버튼, gradient 배지, 스위치 on 상태) |
| 글래스 | `--tori-glass-bg` `--tori-glass-border` `--tori-glass-blur` |
| radius | `--tori-radius-sm/md/lg/full` |
| 그림자 | `--tori-shadow-sm/md/lg`, `--tori-glow` |
| 모션 | `--tori-motion-fast/normal/slow`, `--tori-ease` |
| 타이포 | `--tori-font-sans` |
| 포커스 | `--tori-focus-ring` (모든 인터랙티브 요소가 공유) |

## 다크 모드

`[data-theme='dark']` 셀렉터가 토큰 값을 통째로 교체합니다. 컴포넌트 CSS는 테마를 모릅니다 — 토큰만 참조하므로 다크 모드 대응 코드가 컴포넌트에 존재하지 않습니다.

```tsx
<ToriProvider theme="dark">   {/* 'light' | 'dark' | 'system' */}
```

- `system`: OS `prefers-color-scheme`를 구독해 자동 전환
- 런타임 전환: `const { setTheme } = useTheme(); setTheme('dark');`

## 브랜드 커스터마이징

소비자 프로젝트의 전역 CSS에서 변수만 override하면 됩니다. 빌드 설정 불필요.

```css
/* 소비자 프로젝트 global.css — @toris-dev/ui/styles.css 이후에 로드 */
:root {
  --tori-primary: 59 130 246; /* 파란 브랜드로 교체 */
  --tori-radius-md: 18px;
  --tori-gradient-primary: linear-gradient(135deg, rgb(59 130 246), rgb(16 185 129));
}

[data-theme='dark'] {
  --tori-primary: 96 165 250;
}
```

## 모션 정책 (reduced motion)

`prefers-reduced-motion: reduce` 환경에서는:

1. 모션 토큰(`--tori-motion-*`)이 0.01ms로 축소되고,
2. base.css의 전역 규칙이 모든 `tori-*` 요소의 animation/transition을 강제로 죽입니다.

즉, 컴포넌트를 새로 만들 때 모션 토큰만 사용하면 reduced-motion 대응이 자동으로 따라옵니다.
