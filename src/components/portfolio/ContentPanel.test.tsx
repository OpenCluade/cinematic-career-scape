import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { PortfolioNavigationProvider } from "@/context/PortfolioNavigation";

import { ContentPanel } from "./ContentPanel";
import { SectionNavigation } from "./SectionNavigation";

afterEach(cleanup);

function renderPortfolio() {
  return render(
    <PortfolioNavigationProvider>
      <SectionNavigation />
      <ContentPanel />
    </PortfolioNavigationProvider>,
  );
}

describe("ContentPanel", () => {
  it("resets its scroll position when the section changes", () => {
    renderPortfolio();
    const panel = document.getElementById("portfolio-panel")!;

    panel.scrollTop = 420;
    fireEvent.click(screen.getByRole("button", { name: "Experience" }));

    expect(panel.scrollTop).toBe(0);
  });

  it("switches all four sections and keeps the same panel element", () => {
    renderPortfolio();
    const panel = document.getElementById("portfolio-panel")!;

    for (const label of ["Experience", "Projects", "Contact", "About"]) {
      fireEvent.click(screen.getByRole("button", { name: label }));
      expect(document.getElementById("portfolio-panel")).toBe(panel);
    }
  });

  it("activates a section from the keyboard without moving focus into the panel", () => {
    renderPortfolio();
    const button = screen.getByRole("button", { name: "Projects" });

    button.focus();
    fireEvent.keyDown(button, { key: "Enter" });
    fireEvent.click(button);

    expect(button.getAttribute("aria-current")).toBe("true");
    expect(document.activeElement).toBe(button);
  });
});
