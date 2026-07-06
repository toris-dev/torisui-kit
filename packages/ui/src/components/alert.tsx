import * as React from 'react';
import { cx } from '../utils/cx';

export type AlertTone = 'info' | 'success' | 'warning' | 'danger';

const DEFAULT_ICONS: Record<AlertTone, React.ReactNode> = {
  info: (
    <svg viewBox="0 0 20 20" width="18" height="18" fill="currentColor" aria-hidden>
      <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 4.5a1 1 0 110 2 1 1 0 010-2zM9 10a1 1 0 112 0v4a1 1 0 11-2 0v-4z" />
    </svg>
  ),
  success: (
    <svg viewBox="0 0 20 20" width="18" height="18" fill="currentColor" aria-hidden>
      <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm3.7 5.3a1 1 0 010 1.4l-4 4a1 1 0 01-1.4 0l-2-2a1 1 0 011.4-1.4l1.3 1.29 3.3-3.29a1 1 0 011.4 0z" />
    </svg>
  ),
  warning: (
    <svg viewBox="0 0 20 20" width="18" height="18" fill="currentColor" aria-hidden>
      <path d="M8.7 3.2a1.5 1.5 0 012.6 0l6 10.5A1.5 1.5 0 0116 16H4a1.5 1.5 0 01-1.3-2.3l6-10.5zM10 7a1 1 0 00-1 1v3a1 1 0 102 0V8a1 1 0 00-1-1zm0 6.5a1 1 0 110 2 1 1 0 010-2z" />
    </svg>
  ),
  danger: (
    <svg viewBox="0 0 20 20" width="18" height="18" fill="currentColor" aria-hidden>
      <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 3a1 1 0 011 1v4a1 1 0 11-2 0V6a1 1 0 011-1zm0 8.5a1 1 0 110 2 1 1 0 010-2z" />
    </svg>
  ),
};

export interface AlertProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  tone?: AlertTone;
  title?: React.ReactNode;
  /** Custom icon. `false` hides it; omit for the tone's default icon. */
  icon?: React.ReactNode | false;
  /** Renders a close button and calls this when dismissed. */
  onDismiss?: () => void;
}

/**
 * Inline status message. `danger`/`warning` announce assertively
 * (`role="alert"`); `info`/`success` use `role="status"`.
 */
export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  { tone = 'info', title, icon, onDismiss, className, children, ...props },
  ref,
) {
  const resolvedIcon = icon === false ? null : (icon ?? DEFAULT_ICONS[tone]);
  const assertive = tone === 'danger' || tone === 'warning';

  return (
    <div
      ref={ref}
      role={assertive ? 'alert' : 'status'}
      className={cx('tori-alert', `tori-alert--${tone}`, className)}
      {...props}
    >
      {resolvedIcon != null && (
        <span className="tori-alert__icon" aria-hidden>
          {resolvedIcon}
        </span>
      )}
      <div className="tori-alert__content">
        {title != null && <div className="tori-alert__title">{title}</div>}
        {children != null && <div className="tori-alert__description">{children}</div>}
      </div>
      {onDismiss && (
        <button
          type="button"
          className="tori-alert__close"
          aria-label="Dismiss"
          onClick={onDismiss}
        >
          ×
        </button>
      )}
    </div>
  );
});
