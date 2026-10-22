import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { WelkButton } from "./WelkButton";

describe("WelkButton", () => {
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
