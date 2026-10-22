import { createRef, useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { WelkRadio } from "./WelkRadio";

describe("WelkRadio", () => {
  it("associates labels and forwards refs and native input props", async () => {
    const ref = createRef<HTMLInputElement>();
    render(
      <WelkRadio
        ref={ref}
        id="hero"
        label="Hero"
        name="role"
        value="hero"
        required
        className="custom"
      />,
    );
    const input = screen.getByRole("radio", { name: "Hero" });
    expect(ref.current).toBe(input);
    expect(input).toHaveAttribute("id", "hero");
    expect(input).toHaveAttribute("name", "role");
    expect(input).toHaveClass("custom");
    expect(input).toBeRequired();
    await userEvent.setup().click(screen.getByText("Hero"));
    expect(input).toBeChecked();
  });

  it("supports controlled selection and keyboard activation", async () => {
    function Controlled() {
      const [checked, setChecked] = useState(false);
      return (
        <WelkRadio
          label="Hero"
          checked={checked}
          onChange={(event) => setChecked(event.target.checked)}
        />
      );
    }
    render(<Controlled />);
    const user = userEvent.setup();
    await user.tab();
    await user.keyboard(" ");
    expect(screen.getByRole("radio")).toBeChecked();
  });

  it("generates unique ids and preserves default selection", () => {
    render(
      <>
        <WelkRadio label="First" defaultChecked />
        <WelkRadio label="Second" />
      </>,
    );
    const [first, second] = screen.getAllByRole("radio");
    expect(first.id).not.toBe(second.id);
    expect(first).toBeChecked();
    expect(second).not.toBeChecked();
  });

  it("does not select a disabled radio", async () => {
    const onChange = vi.fn();
    render(<WelkRadio label="Disabled" disabled onChange={onChange} />);
    await userEvent.setup().click(screen.getByText("Disabled"));
    expect(screen.getByRole("radio")).not.toBeChecked();
    expect(onChange).not.toHaveBeenCalled();
  });
});
