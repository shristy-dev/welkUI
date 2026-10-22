import { createRef, useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { WelkRangeSlider } from "./WelkRangeSlider";

describe("WelkRangeSlider", () => {
  it("renders a named native range and forwards refs and attributes", () => {
    const ref = createRef<HTMLInputElement>();
    render(
      <WelkRangeSlider
        label="Power"
        ref={ref}
        className="custom"
        id="power"
        name="power"
        defaultValue={40}
      />,
    );
    const slider = screen.getByRole("slider", { name: "Power" });
    expect(ref.current).toBe(slider);
    expect(slider).toHaveAttribute("type", "range");
    expect(slider).toHaveAttribute("min", "0");
    expect(slider).toHaveAttribute("max", "100");
    expect(slider).toHaveAttribute("step", "1");
    expect(slider).toHaveValue("40");
    expect(slider).toHaveClass("custom");
  });

  it("notifies native and numeric change handlers", () => {
    const onChange = vi.fn();
    const onValueChange = vi.fn();
    render(
      <WelkRangeSlider
        label="Power"
        min={10}
        max={30}
        step={5}
        onChange={onChange}
        onValueChange={onValueChange}
      />,
    );
    fireEvent.change(screen.getByRole("slider"), { target: { value: "25" } });
    expect(onChange).toHaveBeenCalledOnce();
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith(25);
  });

  it("supports controlled values", () => {
    function Controlled() {
      const [value, setValue] = useState(20);
      return (
        <WelkRangeSlider label="Power" value={value} onValueChange={setValue} />
      );
    }
    render(<Controlled />);
    fireEvent.change(screen.getByRole("slider"), { target: { value: "70" } });
    expect(screen.getByRole("slider")).toHaveValue("70");
  });

  it("preserves native form submission and reset", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <form>
        <WelkRangeSlider label="Power" name="power" defaultValue={30} />
        <button type="reset">Reset</button>
      </form>,
    );
    fireEvent.change(screen.getByRole("slider"), { target: { value: "80" } });
    expect(new FormData(container.querySelector("form")!).get("power")).toBe(
      "80",
    );
    await user.click(screen.getByRole("button"));
    expect(screen.getByRole("slider")).toHaveValue("30");
  });

  it("supports disabled and accessible value text", () => {
    render(
      <WelkRangeSlider
        label="Power"
        disabled
        aria-valuetext="Half power"
        defaultValue={50}
      />,
    );
    expect(screen.getByRole("slider")).toBeDisabled();
    expect(screen.getByRole("slider")).toHaveAttribute(
      "aria-valuetext",
      "Half power",
    );
  });
});
