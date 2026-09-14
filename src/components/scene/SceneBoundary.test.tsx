import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useEffect } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { SceneBoundaryView, STATUS_MESSAGE } from "./SceneBoundary";
import type { PortfolioCanvasProps } from "./PortfolioCanvasProps";

/**
 * Regression checks for the failure cases found in review:
 * 1. a render error used to be reported as a module-download failure,
 * 2. recovery only changed the Canvas key, leaving the failed boundary stuck,
 * 3. React.lazy cached a rejected import so a module retry replayed it,
 * 4. an asynchronous initialisation failure was never surfaced at all.
 */

let mountCount = 0;

function WorkingCanvas({ onReady }: PortfolioCanvasProps) {
  useEffect(() => {
    mountCount += 1;
    onReady();
  }, [onReady]);
  return <div data-testid="fake-canvas" />;
}

function NeverReadyCanvas(_props: PortfolioCanvasProps) {
  return <div data-testid="fake-canvas" />;
}

function ThrowingCanvas(_props: PortfolioCanvasProps): never {
  throw new Error("renderer exploded");
}

beforeEach(() => {
  mountCount = 0;
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.useRealTimers();
});

const base = { reduceEffects: false, pageVisible: true } as const;

describe("SceneBoundaryView failure classification", () => {
  it("reports a module download failure, not a render failure", async () => {
    const loadCanvas = vi.fn().mockRejectedValue(new Error("network down"));
    render(<SceneBoundaryView support="supported" {...base} loadCanvas={loadCanvas} />);

    await screen.findByText(STATUS_MESSAGE["module-error"]!, { exact: false });
    expect(screen.queryByText(STATUS_MESSAGE["render-error"]!)).toBeNull();
  });

  it("reports a render failure with its own message", async () => {
    const loadCanvas = vi.fn().mockResolvedValue({ default: ThrowingCanvas });
    render(<SceneBoundaryView support="supported" {...base} loadCanvas={loadCanvas} />);

    await screen.findByText(STATUS_MESSAGE["render-error"]!, { exact: false });
    expect(screen.queryByText(STATUS_MESSAGE["module-error"]!)).toBeNull();
  });

  it("surfaces an asynchronous initialisation failure that never throws", async () => {
    const loadCanvas = vi.fn().mockResolvedValue({ default: NeverReadyCanvas });
    render(
      <SceneBoundaryView
        support="supported"
        {...base}
        loadCanvas={loadCanvas}
        initTimeoutMs={20}
      />,
    );

    await screen.findByText(STATUS_MESSAGE["init-timeout"]!, { exact: false });
  });

  it("shows the unsupported message and never loads the module", async () => {
    const loadCanvas = vi.fn();
    render(<SceneBoundaryView support="unsupported" {...base} loadCanvas={loadCanvas} />);

    await screen.findByText(STATUS_MESSAGE.unsupported!);
    expect(loadCanvas).not.toHaveBeenCalled();
  });
});

describe("deliberate recovery", () => {
  it("retries the import after a module failure instead of replaying a cached rejection", async () => {
    const loadCanvas = vi
      .fn()
      .mockRejectedValueOnce(new Error("network down"))
      .mockResolvedValue({ default: WorkingCanvas });

    render(<SceneBoundaryView support="supported" {...base} loadCanvas={loadCanvas} />);
    await screen.findByText(STATUS_MESSAGE["module-error"]!, { exact: false });

    fireEvent.click(screen.getByRole("button", { name: "Restore graphics" }));

    await waitFor(() => expect(screen.getByTestId("fake-canvas")).toBeTruthy());
    expect(loadCanvas).toHaveBeenCalledTimes(2);
    expect(screen.queryByTestId("scene-status")).toBeNull();
  });

  it("resets the failed error boundary after a render failure", async () => {
    let shouldThrow = true;
    function FlakyCanvas(props: PortfolioCanvasProps) {
      if (shouldThrow) throw new Error("renderer exploded");
      return <WorkingCanvas {...props} />;
    }
    const loadCanvas = vi.fn().mockResolvedValue({ default: FlakyCanvas });

    render(<SceneBoundaryView support="supported" {...base} loadCanvas={loadCanvas} />);
    await screen.findByText(STATUS_MESSAGE["render-error"]!, { exact: false });

    shouldThrow = false;
    fireEvent.click(screen.getByRole("button", { name: "Restore graphics" }));

    await waitFor(() => expect(screen.getByTestId("fake-canvas")).toBeTruthy());
  });

  it("does not retry on its own", async () => {
    vi.useFakeTimers();
    const loadCanvas = vi.fn().mockRejectedValue(new Error("network down"));
    render(<SceneBoundaryView support="supported" {...base} loadCanvas={loadCanvas} />);

    await act(async () => {
      await Promise.resolve();
      vi.advanceTimersByTime(60_000);
    });

    expect(loadCanvas).toHaveBeenCalledTimes(1);
  });
});

describe("canvas persistence", () => {
  it("keeps the same canvas element across unrelated re-renders", async () => {
    const loadCanvas = vi.fn().mockResolvedValue({ default: WorkingCanvas });
    const { rerender } = render(
      <SceneBoundaryView support="supported" {...base} loadCanvas={loadCanvas} />,
    );

    const first = await screen.findByTestId("fake-canvas");

    rerender(
      <SceneBoundaryView
        support="supported"
        reduceEffects={false}
        pageVisible={true}
        loadCanvas={loadCanvas}
      />,
    );

    expect(screen.getByTestId("fake-canvas")).toBe(first);
    expect(mountCount).toBe(1);
    expect(loadCanvas).toHaveBeenCalledTimes(1);
  });
});
