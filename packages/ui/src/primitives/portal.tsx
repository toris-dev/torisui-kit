import * as React from 'react';
import { createPortal } from 'react-dom';

export interface PortalProps {
  children?: React.ReactNode;
  /** Target container. Defaults to `document.body`. */
  container?: Element | null;
}

/** Renders children into `document.body` (or a given container). SSR-safe. */
export function Portal({ children, container }: PortalProps) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  const target = container ?? globalThis.document?.body;
  return target ? createPortal(children, target) : null;
}
