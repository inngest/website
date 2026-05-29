import React from "react";

type Props = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  name?: string;
};

type State = {
  hasError: boolean;
};

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error(
      `[docs ErrorBoundary${this.props.name ? `: ${this.props.name}` : ""}]`,
      error,
      info.componentStack
    );
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? null;
    }

    return this.props.children;
  }
}
