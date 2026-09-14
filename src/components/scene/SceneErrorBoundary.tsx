import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  onError: (error: unknown) => void;
  fallback: ReactNode;
  /**
   * Changing this value clears a previously failed state. A boundary that has
   * caught an error keeps rendering its fallback forever otherwise, so a
   * deliberate recovery action must change this key as well as the Canvas key.
   */
  resetKey?: string | number;
}

interface State {
  failed: boolean;
  resetKey: string | number | undefined;
}

/**
 * Catches scene initialisation and render errors.
 *
 * This covers synchronous React render failures only. Module download
 * failures, WebGL context loss and asynchronous renderer-initialisation
 * failures never reach an error boundary and are handled explicitly in
 * SceneBoundary.
 */
export class SceneErrorBoundary extends Component<Props, State> {
  override state: State = { failed: false, resetKey: this.props.resetKey };

  static getDerivedStateFromError(): Partial<State> {
    return { failed: true };
  }

  static getDerivedStateFromProps(props: Props, state: State): Partial<State> | null {
    if (props.resetKey !== state.resetKey) {
      return { failed: false, resetKey: props.resetKey };
    }
    return null;
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
