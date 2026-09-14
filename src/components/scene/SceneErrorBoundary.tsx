import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  onError: (error: unknown) => void;
  fallback: ReactNode;
}

interface State {
  failed: boolean;
}

/**
 * Catches scene initialisation and render errors. This covers React render
 * failures only — WebGL context loss and module download failures are
 * handled separately, because an error boundary never sees them.
 */
export class SceneErrorBoundary extends Component<Props, State> {
  override state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  override componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("3D scene failed to render", error, info);
    this.props.onError(error);
  }

  override render() {
    if (this.state.failed) return this.props.fallback;
    return this.props.children;
  }
}
