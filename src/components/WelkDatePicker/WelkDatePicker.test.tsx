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
import { WelkDatePicker } from "./WelkDatePicker";

describe("WelkDatePicker", () => {
  it("renders all days in a leap month and forwards its input ref and form attributes", () => {
    const ref = createRef<HTMLInputElement>();
    render(
      <WelkDatePicker
        label="Adventure date"
        defaultValue="2024-02-10"
        name="date"
        id="adventure"
        required
        ref={ref}
        className="custom"
      />,
    );
    const input = screen.getByLabelText("Adventure date");
    expect(ref.current).toBe(input);
    expect(input).toHaveAttribute("id", "adventure");
    expect(input).toBeRequired();
    expect(input).toHaveAttribute("type", "text");
    expect(input.closest(".custom")).toBeInTheDocument();
    expect(
      within(screen.getByRole("table", { name: "February 2024" })).getAllByRole(
        "button",
      ),
    ).toHaveLength(29);
    expect(
      screen.getByRole("button", { name: "Saturday, February 10, 2024" }),
    ).toHaveAttribute("aria-pressed", "true");
  });

  it("selects dates, notifies and submits an ISO date without submitting on click", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const onSubmit = vi.fn();
    const { container } = render(
      <form onSubmit={onSubmit}>
        <WelkDatePicker
          label="Date"
          defaultValue="2025-01-10"
          name="date"
          onValueChange={onValueChange}
        />
      </form>,
    );
    await user.click(
      screen.getByRole("button", { name: "Friday, January 24, 2025" }),
    );
    expect(screen.getByLabelText("Date")).toHaveValue("2025-01-24");
    expect(onValueChange).toHaveBeenLastCalledWith("2025-01-24");
    expect(new FormData(container.querySelector("form")!).get("date")).toBe(
      "2025-01-24",
    );
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("updates the calendar from the manual top field, including clearing", () => {
    const onValueChange = vi.fn();
    render(
      <WelkDatePicker
        label="Date"
        defaultValue="2025-01-10"
        onValueChange={onValueChange}
      />,
    );
    fireEvent.change(screen.getByLabelText("Date"), {
      target: { value: "2026-03-12" },
    });
    expect(
      screen.getByRole("table", { name: "March 2026" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Thursday, March 12, 2026" }),
    ).toHaveAttribute("aria-pressed", "true");
    fireEvent.change(screen.getByLabelText("Date"), { target: { value: "" } });
    expect(onValueChange).toHaveBeenLastCalledWith("");
    expect(screen.getByLabelText("Date")).toHaveValue("");
  });

  it("supports controlled selection and external changes", async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [value, setValue] = useState("2025-01-10");
      return (
        <WelkDatePicker label="Date" value={value} onValueChange={setValue} />
      );
    }
    const { rerender } = render(<Controlled />);
    await user.click(
      screen.getByRole("button", { name: "Friday, January 24, 2025" }),
    );
    expect(screen.getByLabelText("Date")).toHaveValue("2025-01-24");
    rerender(<WelkDatePicker label="Date" value="2026-05-03" />);
    expect(screen.getByRole("table", { name: "May 2026" })).toBeInTheDocument();
  });

  it("navigates across years without changing the selected date", async () => {
    const user = userEvent.setup();
    render(<WelkDatePicker label="Date" defaultValue="2025-12-15" />);
    await user.click(screen.getByRole("button", { name: "Next month" }));
    expect(
      screen.getByRole("table", { name: "January 2026" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Date")).toHaveValue("2025-12-15");
    await user.click(screen.getByRole("button", { name: "Previous month" }));
    expect(
      screen.getByRole("table", { name: "December 2025" }),
    ).toBeInTheDocument();
  });

  it("supports arrows, Home and End including moving between months", async () => {
    const user = userEvent.setup();
    render(<WelkDatePicker label="Date" defaultValue="2025-01-31" />);
    screen.getByRole("button", { name: "Friday, January 31, 2025" }).focus();
    await user.keyboard("{ArrowRight}");
    expect(
      screen.getByRole("button", { name: "Saturday, February 1, 2025" }),
    ).toHaveFocus();
    await user.keyboard("{Home}");
    expect(
      screen.getByRole("button", { name: "Sunday, January 26, 2025" }),
    ).toHaveFocus();
    await user.keyboard("{End}{ArrowDown}");
    expect(
      screen.getByRole("button", { name: "Saturday, February 8, 2025" }),
    ).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(screen.getByLabelText("Date")).toHaveValue("2025-02-08");
  });

  it("enforces calendar limits and native field validity", async () => {
    const user = userEvent.setup();
    render(
      <WelkDatePicker
        label="Date"
        defaultValue="2025-01-15"
        min="2025-01-10"
        max="2025-01-20"
      />,
    );
    expect(
      screen.getByRole("button", { name: "Thursday, January 9, 2025" }),
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Tuesday, January 21, 2025" }),
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Previous month" }),
    ).toBeDisabled();
    expect(screen.getByRole("button", { name: "Next month" })).toBeDisabled();
    screen.getByRole("button", { name: "Friday, January 10, 2025" }).focus();
    await user.keyboard("{ArrowLeft}");
    expect(
      screen.getByRole("button", { name: "Friday, January 10, 2025" }),
    ).toHaveFocus();
    fireEvent.change(screen.getByLabelText("Date"), {
      target: { value: "2025-01-09" },
    });
    expect(screen.getByLabelText("Date")).toBeInvalid();
  });

  it("disables all controls", () => {
    render(<WelkDatePicker label="Date" defaultValue="2025-01-10" disabled />);
    expect(screen.getByLabelText("Date")).toBeDisabled();
    for (const button of screen.getAllByRole("button"))
      expect(button).toBeDisabled();
  });

  it("keeps partial and invalid text editable without changing the calendar", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <WelkDatePicker
        label="Date"
        defaultValue="2025-01-10"
        onValueChange={onValueChange}
      />,
    );
    const input = screen.getByRole("textbox", { name: "Date" });
    fireEvent.change(input, { target: { value: "2025-02-" } });
    expect(input).toHaveValue("2025-02-");
    expect(input).toBeInvalid();
    expect(screen.getByRole("alert")).toHaveTextContent("YYYY-MM-DD");
    expect(
      screen.getByRole("table", { name: "January 2025" }),
    ).toBeInTheDocument();
    await user.type(input, "30");
    expect(input).toBeInvalid();
    expect(onValueChange).not.toHaveBeenCalled();
    await user.clear(input);
    await user.type(input, "2024-02-29");
    expect(input).toBeValid();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(onValueChange).toHaveBeenLastCalledWith("2024-02-29");
    expect(
      screen.getByRole("table", { name: "February 2024" }),
    ).toBeInTheDocument();
  });

  it("resets uncontrolled state with the form", async () => {
    const user = userEvent.setup();
    render(
      <form>
        <WelkDatePicker label="Date" defaultValue="2025-01-10" />
        <button type="reset">Reset</button>
      </form>,
    );
    await user.click(
      screen.getByRole("button", { name: "Friday, January 24, 2025" }),
    );
    await user.click(screen.getByRole("button", { name: "Reset" }));
    await waitFor(() =>
      expect(screen.getByLabelText("Date")).toHaveValue("2025-01-10"),
    );
    expect(
      screen.getByRole("button", { name: "Friday, January 10, 2025" }),
    ).toHaveAttribute("aria-pressed", "true");
  });

  it("handles years below 100 and year navigation boundaries", () => {
    const { rerender } = render(
      <WelkDatePicker label="Date" defaultValue="0001-01-01" />,
    );
    expect(
      screen.getByRole("button", { name: "Previous month" }),
    ).toBeDisabled();
    rerender(<WelkDatePicker label="Date" value="9999-12-31" />);
    expect(screen.getByRole("button", { name: "Next month" })).toBeDisabled();
  });

  it.each(["2025-02-29", "not-a-date", "0000-01-01"])(
    "reports invalid date props: %s",
    (value) => {
      expect(() =>
        render(<WelkDatePicker label="Date" value={value} />),
      ).toThrow(RangeError);
    },
  );
});
