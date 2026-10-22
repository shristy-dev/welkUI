import { createRef } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { WelkAccordion } from "./WelkAccordion";

describe("WelkAccordion", () => {
  it("uses native disclosure semantics and forwards attributes and refs", () => {
    const ref = createRef<HTMLDetailsElement>();
    render(
      <WelkAccordion title="Details" ref={ref} className="custom" id="faq">
        Content
      </WelkAccordion>,
    );
    expect(ref.current?.tagName).toBe("DETAILS");
    expect(ref.current).toHaveClass("custom");
    expect(ref.current).toHaveAttribute("id", "faq");
    expect(ref.current).not.toHaveAttribute("open");
    expect(screen.getByText("Content")).not.toBeVisible();
  });

  it("opens and closes through its summary and emits toggle events", async () => {
    const onToggle = vi.fn();
    render(
      <WelkAccordion title="Details" onToggle={onToggle}>
        Content
      </WelkAccordion>,
    );
    const user = userEvent.setup();
    await user.click(screen.getByText("Details"));
    expect(screen.getByText("Content")).toBeVisible();
    await waitFor(() => expect(onToggle).toHaveBeenCalled());
    await user.click(screen.getByText("Details"));
    expect(screen.getByText("Content")).not.toBeVisible();
  });

  it("supports an initially open disclosure", () => {
    render(
      <WelkAccordion title="Details" open>
        Content
      </WelkAccordion>,
    );
    expect(screen.getByText("Content")).toBeVisible();
  });
});
