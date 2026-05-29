import React from "react";

type Props = {
  children: React.ReactNode;
  /** Rendered in place of `children` when a render error is caught. */
  fallback?: React.ReactNode;
  /** Optional label to disambiguate which boundary fired in logs. */
  name?: string;
};

type State = { hasError: boolean };

/**
 * Catches render-time errors in a subtree and renders a fallback instead of
 * letting the whole docs page white-screen. Scoped per-region (nav, content)
 * so one crashing region doesn't take down the others.
 *
 * This is the graceful-degradation net Next.js recommends for client-side
 * exceptions; the actual prevention for known crash classes (e.g. nullish
 * hrefs reaching next/link) lives at the source in the components themselves.
 */
export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Surface in the console (and any attached error reporter) without crashing.
    console.error(
      `[docs ErrorBoundary${this.props.name ? `: ${this.props.name}` : ""}]`,
      error,
      info?.componentStack
    );
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? null;
    }
    return this.props.children;
  }
}
