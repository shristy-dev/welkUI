import { createRef, useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { WelkCheckBox } from "./WelkCheckBox";

describe("WelkCheckBox", () => {
  it("supports indeterminate state and native form reset", async () => {
    const ref = createRef<HTMLInputElement>();
    render(
      <form>
        <WelkCheckBox ref={ref} label="All heroes" name="all" defaultChecked />
        <button type="reset">Reset</button>
      </form>,
    );
    const input = ref.current!;
    input.indeterminate = true;
    expect(input.indeterminate).toBe(true);
    const user = userEvent.setup();
    await user.click(input);
    expect(input.indeterminate).toBe(false);
    expect(input).not.toBeChecked();
    await user.click(screen.getByRole("button", { name: "Reset" }));
    expect(input).toBeChecked();
  });
  it("associates its label, forwards its ref and supports uncontrolled changes", async () => {
    const ref = createRef<HTMLInputElement>();
    render(
      <WelkCheckBox
        ref={ref}
        label="Accept terms"
        name="terms"
        defaultChecked
      />,
    );
    const input = screen.getByRole("checkbox", { name: "Accept terms" });
    expect(input).toBeChecked();
    expect(ref.current).toBe(input);
    expect(input).toHaveAttribute("name", "terms");
    await userEvent.setup().click(screen.getByText("Accept terms"));
    expect(input).not.toBeChecked();
  });

  it("supports controlled values and keyboard toggling", async () => {
    function Controlled() {
      const [checked, setChecked] = useState(false);
      return (
        <WelkCheckBox
          label="Subscribe"
          checked={checked}
          onChange={(event) => setChecked(event.target.checked)}
        />
      );
    }
    render(<Controlled />);
    const user = userEvent.setup();
    await user.tab();
    await user.keyboard(" ");
    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  it("preserves explicit ids and generates unique ids", () => {
    render(
      <>
        <WelkCheckBox id="terms" label="Terms" />
        <WelkCheckBox label="First" />
        <WelkCheckBox label="Second" />
      </>,
    );
    const [terms, first, second] = screen.getAllByRole("checkbox");
    expect(terms).toHaveAttribute("id", "terms");
    expect(first.id).not.toBe(second.id);
  });

  it("does not toggle a disabled input", async () => {
    const onChange = vi.fn();
    render(<WelkCheckBox label="Disabled" disabled onChange={onChange} />);
    await userEvent.setup().click(screen.getByText("Disabled"));
    expect(screen.getByRole("checkbox")).not.toBeChecked();
    expect(onChange).not.toHaveBeenCalled();
  });
});
