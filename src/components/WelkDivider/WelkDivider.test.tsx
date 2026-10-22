import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { WelkDivider } from "./WelkDivider";
import styles from "./WelkDivider.module.css";

describe("WelkDivider", () => {
  it("defaults to a horizontal plain 2px separator and forwards refs/attributes", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <WelkDivider ref={ref} className="custom" aria-label="Section break" />,
    );
    const divider = screen.getByRole("separator", { name: "Section break" });
    expect(ref.current).toBe(divider);
    expect(divider).toHaveAttribute("aria-orientation", "horizontal");
    expect(divider).toHaveClass(styles.horizontal, "custom");
    expect(divider).toHaveStyle({
      borderStyle: "solid",
      borderTopWidth: "2px",
    });
    expect(divider).not.toHaveAttribute("thickness");
    expect(divider).not.toHaveAttribute("variant");
  });

  it.each(["horizontal", "vertical"] as const)(
    "supports all line variants in %s orientation",
    (orientation) => {
      const { rerender } = render(<WelkDivider orientation={orientation} />);
      for (const variant of ["plain", "dotted", "dashed"] as const) {
        rerender(
          <WelkDivider
            orientation={orientation}
            variant={variant}
            thickness={4}
          />,
        );
        const divider = screen.getByRole("separator");
        expect(divider).toHaveAttribute("aria-orientation", orientation);
        expect(divider).toHaveStyle({
          borderStyle: variant === "plain" ? "solid" : variant,
          [orientation === "horizontal" ? "borderTopWidth" : "borderLeftWidth"]:
            "4px",
        });
      }
    },
  );

  it("supports custom dimensions and color through style", () => {
    render(
      <WelkDivider
        orientation="vertical"
        thickness={1.5}
        style={{ height: 80, borderColor: "red" }}
      />,
    );
    const divider = screen.getByRole("separator");
    expect(divider.style.height).toBe("80px");
    expect(divider.style.borderColor).toBe("red");
    expect(divider.style.borderLeftWidth).toBe("1.5px");
  });

  it.each([0, -1, NaN, Infinity])(
    "rejects invalid thickness %s",
    (thickness) => {
      expect(() => render(<WelkDivider thickness={thickness} />)).toThrow(
        RangeError,
      );
    },
  );
});
