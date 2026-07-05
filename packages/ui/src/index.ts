// Provider & theme
export { ToriProvider, useTheme } from './provider';
export type { ToriProviderProps, ToriTheme, ToriThemeContextValue } from './provider';

// Components
export { Button } from './components/button';
export type { ButtonProps, ButtonVariant, ButtonSize } from './components/button';

export { IconButton } from './components/icon-button';
export type { IconButtonProps } from './components/icon-button';

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from './components/card';
export type { CardProps, CardVariant, CardSectionProps } from './components/card';

export { Input } from './components/input';
export type { InputProps, InputSize } from './components/input';

export { Badge } from './components/badge';
export type { BadgeProps, BadgeVariant, BadgeTone } from './components/badge';

export { Spinner } from './components/spinner';
export type { SpinnerProps } from './components/spinner';

export { Switch } from './components/switch';
export type { SwitchProps } from './components/switch';

export { Dialog } from './components/dialog';
export type { DialogProps } from './components/dialog';

export { ToastProvider, useToast } from './components/toast';
export type {
  ToastProviderProps,
  ToastOptions,
  ToastTone,
  ToastApi,
  UseToastReturn,
  PromiseToastMessages,
} from './components/toast';

export { Tabs, TabsList, TabsTrigger, TabsContent } from './components/tabs';
export type {
  TabsProps,
  TabsListProps,
  TabsTriggerProps,
  TabsContentProps,
} from './components/tabs';

export { Tooltip } from './components/tooltip';
export type { TooltipProps, TooltipPlacement } from './components/tooltip';

// Primitives
export { Slot } from './primitives/slot';
export type { SlotProps } from './primitives/slot';
export { Portal } from './primitives/portal';
export type { PortalProps } from './primitives/portal';
export { VisuallyHidden } from './primitives/visually-hidden';
export type { VisuallyHiddenProps } from './primitives/visually-hidden';

// Utilities
export { cx } from './utils/cx';
export { useControllableState } from './hooks/use-controllable-state';
