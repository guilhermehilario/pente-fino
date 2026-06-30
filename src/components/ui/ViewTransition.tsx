import { useRef, type ReactNode } from 'react';

// ─── Props ──────────────────────────────────────────────────────────────────

type TransitionDirection = 'forward' | 'backward' | 'none';

interface ViewTransitionProps {
  /** Unique key that changes when the view changes */
  viewKey: string;
  /** Direction of the navigation — 'none' skips the animation (e.g., initial load) */
  direction: TransitionDirection;
  /** The view content to render */
  children: ReactNode;
}

// ─── Component ──────────────────────────────────────────────────────────────

/**
 * Wraps page views with a slide-in animation triggered by a `key` change.
 *
 * When `viewKey` changes, React unmounts the old element and mounts a new
 * one with the CSS animation class. The parent `overflow-hidden` clips the
 * old content during the brief slide, creating a clean transition.
 *
 * - `forward`: slides in from the right (push navigation)
 * - `backward`: slides in from the left (back navigation)
 * - `none`: no animation (initial page load)
 */
export function ViewTransition({ viewKey, direction, children }: ViewTransitionProps) {
  // Skip animation on first mount so the initial page doesn't slide in
  const isFirstRender = useRef(true);
  const skip = isFirstRender.current;
  isFirstRender.current = false;

  const animClass =
    skip || direction === 'none'
      ? ''
      : direction === 'forward'
        ? 'animate-slide-in-right'
        : 'animate-slide-in-left';

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      <div key={viewKey} className={animClass}>
        {children}
      </div>
    </div>
  );
}
