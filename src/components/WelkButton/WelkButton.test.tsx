import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { WelkButton } from "./WelkButton";
import styles from "./WelkButton.module.css";

describe("WelkButton", () => {
  it("defaults to the primary variant", () => {
    render(<WelkButton>Default</WelkButton>);
    expect(screen.getByRole("button")).toHaveClass(styles.primary);
  });

  it.each([
    "primary",
    "error",
    "warning",
    "ghost",
    "info",
    "success",
    "secondary",
  ] as const)("supports the %s variant and disabled state", async (variant) => {
    const onClick = vi.fn();
    const { rerender } = render(
      <WelkButton variant={variant} onClick={onClick}>
        Action
      </WelkButton>,
    );
    const button = screen.getByRole("button");
    expect(button).toHaveClass(styles.button, styles[variant], styles.md);
    expect(button).not.toHaveAttribute("variant");
    const user = userEvent.setup();
    await user.click(button);
    expect(onClick).toHaveBeenCalledOnce();
    rerender(
      <WelkButton variant={variant} disabled onClick={onClick}>
        Action
      </WelkButton>,
    );
    expect(button).toBeDisabled();
    await user.click(button);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("forwards its ref and native attributes without submitting by default", () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <WelkButton ref={ref} className="custom" aria-label="Save changes">
        Save
      </WelkButton>,
    );
    const button = screen.getByRole("button", { name: "Save changes" });
    expect(ref.current).toBe(button);
    expect(button).toHaveAttribute("type", "button");
    expect(button).toHaveClass("custom");
  });

  it("supports keyboard activation and explicit form submission", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <WelkButton type="submit" onClick={onClick}>
        Save
      </WelkButton>,
    );
    await user.tab();
    await user.keyboard("{Enter}");
    expect(onClick).toHaveBeenCalledOnce();
    expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
  });

  it("does not activate when disabled", async () => {
    const onClick = vi.fn();
    render(
      <WelkButton disabled onClick={onClick}>
        Save
      </WelkButton>,
    );
    await userEvent.setup().click(screen.getByRole("button"));
    expect(onClick).not.toHaveBeenCalled();
  });
});
