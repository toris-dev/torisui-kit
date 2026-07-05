import * as React from 'react';
import { cx } from '../utils/cx';

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';
export type AvatarStatus = 'online' | 'offline' | 'busy' | 'away';

export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Image source. Falls back to initials when missing or failed to load. */
  src?: string;
  /** Accessible name for the image. Defaults to `name`. */
  alt?: string;
  /** Used for the initials fallback (first letters of the first two words). */
  name?: string;
  size?: AvatarSize;
  /** Renders a status dot on the bottom-right corner. */
  status?: AvatarStatus;
}

function initialsOf(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0] ?? '')
    .join('')
    .toUpperCase();
}

export const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  { src, alt, name, size = 'md', status, className, ...props },
  ref,
) {
  const [failed, setFailed] = React.useState(false);
  // A new src deserves a fresh attempt.
  React.useEffect(() => {
    setFailed(false);
  }, [src]);

  const showImage = src != null && !failed;
  const accessibleName = alt ?? name;

  return (
    <span
      ref={ref}
      className={cx('tori-avatar', `tori-avatar--${size}`, className)}
      // The fallback is text, not an image — expose the name for readers.
      role={showImage ? undefined : 'img'}
      aria-label={showImage ? undefined : accessibleName}
      {...props}
    >
      {showImage ? (
        <img
          className="tori-avatar__image"
          src={src}
          alt={accessibleName ?? ''}
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="tori-avatar__fallback" aria-hidden>
          {name ? initialsOf(name) : '?'}
        </span>
      )}
      {status && (
        <span className={cx('tori-avatar__status', `tori-avatar__status--${status}`)}>
          <span className="tori-sr-only">{status}</span>
        </span>
      )}
    </span>
  );
});
