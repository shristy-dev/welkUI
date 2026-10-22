import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { WelkBadge } from "./WelkBadge";

describe("WelkBadge", () => {
  it("renders text or numeric children without implying interactivity or live announcements", () => {
    const { rerender } = render(<WelkBadge>NEW!</WelkBadge>);
    expect(screen.getByText("NEW!").tagName).toBe("SPAN");
    expect(screen.getByText("NEW!")).not.toHaveAttribute("role");
    rerender(<WelkBadge>{0}</WelkBadge>);
    expect(screen.getByText("0")).toBeInTheDocument();
  });
  it("forwards refs, className, style and native accessibility props", () => {
    const ref = createRef<HTMLSpanElement>();
    render(
      <WelkBadge
        ref={ref}
        className="custom"
        style={{ margin: 4 }}
        role="status"
        aria-label="Mission status"
      >
        Ready
      </WelkBadge>,
    );
    expect(ref.current).toBe(
      screen.getByRole("status", { name: "Mission status" }),
    );
    expect(ref.current).toHaveClass("custom");
    expect(ref.current).toHaveStyle({ margin: "4px" });
  });
  it.each(["default", "info", "success", "warning", "error"] as const)(
    "supports %s badges",
    (variant) => {
      render(
        <WelkBadge variant={variant} size="sm">
          Ready
        </WelkBadge>,
      );
      expect(screen.getByText("Ready").className).toContain("sm");
      if (variant !== "default")
        expect(screen.getByText("Ready").className).toContain(variant);
    },
  );
});
