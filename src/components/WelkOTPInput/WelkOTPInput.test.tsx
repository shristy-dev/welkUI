import { createRef, useState } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { WelkOTPInput } from "./WelkOTPInput";

describe("WelkOTPInput", () => {
  it("renders six slots and one accessible autofill-ready input", () => {
    const ref = createRef<HTMLInputElement>();
    render(<WelkOTPInput label="Code" ref={ref} required />);
    const input = screen.getByRole("textbox", { name: "Code" });
    expect(ref.current).toBe(input);
    expect(input).toHaveAttribute("inputmode", "numeric");
    expect(input).toHaveAttribute("autocomplete", "one-time-code");
    expect(input).toHaveAccessibleDescription("Enter 6 digits");
    expect(input.nextElementSibling?.children).toHaveLength(6);
    expect(input).toBeRequired();
  });

  it("filters non-digits and completes only changed full values", async () => {
    const user = userEvent.setup();
    const complete = vi.fn();
    const changed = vi.fn();
    render(
      <WelkOTPInput
        label="Code"
        onComplete={complete}
        onValueChange={changed}
      />,
    );
    await user.type(screen.getByRole("textbox"), "a123456");
    expect(screen.getByRole("textbox")).toHaveValue("123456");
    expect(complete).toHaveBeenCalledExactlyOnceWith("123456");
    await user.keyboard("7");
    expect(complete).toHaveBeenCalledOnce();
    expect(changed).toHaveBeenLastCalledWith("123456");
  });

  it("supports paste with separators and leading zeros", async () => {
    const user = userEvent.setup();
    render(<WelkOTPInput label="Code" />);
    screen.getByRole("textbox").focus();
    await user.paste("01-23 45");
    expect(screen.getByRole("textbox")).toHaveValue("012345");
  });

  it("supports native keyboard editing and configurable length", async () => {
    const user = userEvent.setup();
    render(<WelkOTPInput label="Code" length={4} defaultValue="1234" />);
    const input = screen.getByRole("textbox");
    await user.click(input);
    await user.keyboard("{End}{Backspace}{ArrowLeft}{Delete}9");
    expect(input).toHaveValue("129");
    expect(input).toBeInvalid();
    await user.keyboard("0");
    expect(input).toHaveValue("1290");
    expect(input).toBeValid();
  });

  it("supports controlled values and native form reset/submission", async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [value, setValue] = useState("");
      return (
        <WelkOTPInput label="Code" value={value} onValueChange={setValue} />
      );
    }
    const { rerender, container } = render(<Controlled />);
    await user.type(screen.getByRole("textbox"), "123456");
    expect(screen.getByRole("textbox")).toHaveValue("123456");
    rerender(
      <form>
        <WelkOTPInput label="Code" name="otp" defaultValue="012345" />
        <button type="reset">Reset</button>
      </form>,
    );
    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "999999" },
    });
    expect(new FormData(container.querySelector("form")!).get("otp")).toBe(
      "999999",
    );
    await user.click(screen.getByRole("button", { name: "Reset" }));
    await waitFor(() =>
      expect(screen.getByRole("textbox")).toHaveValue("012345"),
    );
  });

  it("supports disabled and read-only states", async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <WelkOTPInput label="Code" disabled defaultValue="123" />,
    );
    expect(screen.getByRole("textbox")).toBeDisabled();
    rerender(<WelkOTPInput label="Code" readOnly defaultValue="123" />);
    await user.type(screen.getByRole("textbox"), "456");
    expect(screen.getByRole("textbox")).toHaveValue("123");
  });

  it("rejects invalid configuration", () => {
    expect(() => render(<WelkOTPInput label="Code" length={0} />)).toThrow(
      RangeError,
    );
    expect(() => render(<WelkOTPInput label="Code" value="abc" />)).toThrow(
      RangeError,
    );
  });
});
