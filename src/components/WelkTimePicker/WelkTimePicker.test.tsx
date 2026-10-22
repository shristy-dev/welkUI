import { createRef, useState } from "react";
import {
  fireEvent,
  render,
  screen,
  within,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { WelkTimePicker } from "./WelkTimePicker";

describe("WelkTimePicker", () => {
  it("renders custom hours/minutes wheels and a text input", () => {
    const ref = createRef<HTMLInputElement>();
    render(<WelkTimePicker label="Time" defaultValue="14:30" ref={ref} />);
    expect(ref.current).toBe(screen.getByRole("textbox", { name: "Time" }));
    expect(ref.current).toHaveAttribute("type", "text");
    expect(
      within(screen.getByRole("listbox", { name: "Hours" })).getAllByRole(
        "option",
      ),
    ).toHaveLength(24);
    expect(
      within(screen.getByRole("listbox", { name: "Minutes" })).getAllByRole(
        "option",
      ),
    ).toHaveLength(60);
    expect(
      screen.queryByRole("listbox", { name: "Seconds" }),
    ).not.toBeInTheDocument();
  });

  it("selects hours and minutes without submitting the form", async () => {
    const user = userEvent.setup();
    const changed = vi.fn();
    const submit = vi.fn();
    const { container } = render(
      <form onSubmit={submit}>
        <WelkTimePicker
          label="Time"
          defaultValue="14:30"
          name="time"
          onValueChange={changed}
        />
      </form>,
    );
    await user.click(
      within(screen.getByRole("listbox", { name: "Hours" })).getByRole(
        "option",
        { name: "09" },
      ),
    );
    await user.click(
      within(screen.getByRole("listbox", { name: "Minutes" })).getByRole(
        "option",
        { name: "05" },
      ),
    );
    expect(screen.getByRole("textbox")).toHaveValue("09:05");
    expect(changed).toHaveBeenLastCalledWith("09:05");
    expect(new FormData(container.querySelector("form")!).get("time")).toBe(
      "09:05",
    );
    expect(submit).not.toHaveBeenCalled();
  });

  it("keeps the selected number centered regardless of the wheel's page position", async () => {
    const user = userEvent.setup();
    render(<WelkTimePicker label="Time" defaultValue="00:30" />);
    const hours = screen.getByRole("listbox", { name: "Hours" });
    const minutes = screen.getByRole("listbox", { name: "Minutes" });
    const option = within(hours).getByRole("option", { name: "09" });
    Object.defineProperties(hours, {
      offsetTop: { value: 180 },
      clientHeight: { value: 120 },
    });
    Object.defineProperties(option, {
      offsetTop: { value: 360 },
      clientHeight: { value: 40 },
    });
    minutes.scrollTop = 1160;
    const focus = vi.spyOn(hours, "focus");

    await user.click(option);

    expect(hours.scrollTop).toBe(320);
    expect(minutes.scrollTop).toBe(1160);
    expect(option).toHaveAttribute("aria-selected", "true");
    expect(focus).toHaveBeenCalledWith({ preventScroll: true });
  });

  it("supports seconds and keyboard wrapping, Home and End", async () => {
    const user = userEvent.setup();
    render(<WelkTimePicker label="Time" showSeconds defaultValue="23:59:59" />);
    const wheel = screen.getByRole("listbox", { name: "Seconds" });
    wheel.focus();
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("textbox")).toHaveValue("23:59:00");
    await user.keyboard("{ArrowUp}{Home}{End}");
    expect(screen.getByRole("textbox")).toHaveValue("23:59:59");
  });

  it("supports manual entry, invalid drafts and clearing", async () => {
    const user = userEvent.setup();
    const changed = vi.fn();
    render(<WelkTimePicker label="Time" onValueChange={changed} required />);
    const input = screen.getByRole("textbox");
    expect(input).toBeInvalid();
    await user.type(input, "25:99");
    expect(input).toBeInvalid();
    expect(screen.getByRole("alert")).toHaveTextContent("HH:mm");
    expect(changed).not.toHaveBeenCalled();
    await user.clear(input);
    await user.type(input, "08:45");
    expect(input).toBeValid();
    expect(
      within(screen.getByRole("listbox", { name: "Hours" })).getByRole(
        "option",
        { selected: true },
      ),
    ).toHaveTextContent("08");
    expect(changed).toHaveBeenLastCalledWith("08:45");
  });

  it("supports controlled values", async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [value, setValue] = useState("00:00");
      return (
        <WelkTimePicker label="Time" value={value} onValueChange={setValue} />
      );
    }
    render(<Controlled />);
    await user.click(
      within(screen.getByRole("listbox", { name: "Hours" })).getByRole(
        "option",
        { name: "12" },
      ),
    );
    expect(screen.getByRole("textbox")).toHaveValue("12:00");
  });

  it("resets with the form and disables controls", async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <form>
        <WelkTimePicker label="Time" defaultValue="10:20" />
        <button type="reset">Reset</button>
      </form>,
    );
    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "12:34" },
    });
    await user.click(screen.getByRole("button", { name: "Reset" }));
    await waitFor(() =>
      expect(screen.getByRole("textbox")).toHaveValue("10:20"),
    );
    rerender(<WelkTimePicker label="Time" disabled />);
    expect(screen.getByRole("textbox")).toBeDisabled();
    for (const option of screen.getAllByRole("option"))
      expect(option).toBeDisabled();
  });

  it.each(["24:00", "12:60", "9:00", "12:30:00"])(
    "rejects invalid time props %s",
    (value) => {
      expect(() =>
        render(<WelkTimePicker label="Time" value={value} />),
      ).toThrow(RangeError);
    },
  );
});
