import { createRef, useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { WelkSwitch } from "./WelkSwitch";

describe("WelkSwitch", () => {
  it("associates a label and forwards refs, classes and native props", async () => {
    const user = userEvent.setup();
    const ref = createRef<HTMLInputElement>();
    const changed = vi.fn();
    const native = vi.fn();
    render(
      <WelkSwitch
        ref={ref}
        label="Hero mode"
        id="hero-mode"
        className="custom"
        required
        onCheckedChange={changed}
        onChange={native}
      />,
    );
    const input = screen.getByRole("switch", { name: "Hero mode" });
    expect(ref.current).toBe(input);
    expect(input).toHaveAttribute("id", "hero-mode");
    expect(input).toHaveClass("custom");
    expect(input).toBeRequired();
    await user.click(screen.getByText("Hero mode"));
    expect(input).toBeChecked();
    expect(changed).toHaveBeenCalledWith(true);
    expect(native).toHaveBeenCalledOnce();
    await user.click(input);
    expect(changed).toHaveBeenLastCalledWith(false);
  });

  it("supports controlled state and Space keyboard activation", async () => {
    function Controlled() {
      const [checked, setChecked] = useState(false);
      return (
        <WelkSwitch
          label="Hero mode"
          checked={checked}
          onCheckedChange={setChecked}
        />
      );
    }
    render(<Controlled />);
    const user = userEvent.setup();
    await user.tab();
    await user.keyboard(" ");
    expect(screen.getByRole("switch")).toBeChecked();
    await user.keyboard(" ");
    expect(screen.getByRole("switch")).not.toBeChecked();
  });

  it("preserves native form submission and reset behavior", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <form>
        <WelkSwitch
          label="Hero mode"
          name="hero"
          value="enabled"
          defaultChecked
        />
        <button type="reset">Reset</button>
      </form>,
    );
    const form = container.querySelector("form")!;
    expect(new FormData(form).get("hero")).toBe("enabled");
    await user.click(screen.getByRole("switch"));
    expect(new FormData(form).has("hero")).toBe(false);
    await user.click(screen.getByRole("button", { name: "Reset" }));
    expect(screen.getByRole("switch")).toBeChecked();
  });

  it("does not toggle disabled switches and generates unique ids", async () => {
    const user = userEvent.setup();
    const changed = vi.fn();
    render(
      <>
        <WelkSwitch label="Disabled" disabled onCheckedChange={changed} />
        <WelkSwitch label="Enabled" />
      </>,
    );
    const [disabled, enabled] = screen.getAllByRole("switch");
    expect(disabled.id).not.toBe(enabled.id);
    await user.click(screen.getByText("Disabled"));
    expect(disabled).not.toBeChecked();
    expect(changed).not.toHaveBeenCalled();
    await user.tab();
    expect(enabled).toHaveFocus();
  });
});
