import { createRef, useState } from "react";
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { WelkDropDown } from "./WelkDropDown";

const options = [
  { value: "superman", label: "Superman" },
  { value: "batman", label: "Batman" },
  { value: "flash", label: "Flash", disabled: true },
  { value: "wonder", label: "Wonder Woman" },
];

describe("WelkDropDown", () => {
  it("uses a native select by default with a forwarded ref and form value", async () => {
    const user = userEvent.setup();
    const changed = vi.fn();
    const ref = createRef<HTMLSelectElement>();
    const { container } = render(
      <form>
        <WelkDropDown
          label="Hero"
          options={options}
          name="hero"
          ref={ref}
          onValueChange={changed}
        />
      </form>,
    );
    expect(ref.current).toBe(screen.getByRole("combobox", { name: "Hero" }));
    await user.selectOptions(ref.current!, "batman");
    expect(changed).toHaveBeenCalledWith("batman");
    expect(new FormData(container.querySelector("form")!).get("hero")).toBe(
      "batman",
    );
  });

  it("filters labels case-insensitively and selects by mouse", async () => {
    const user = userEvent.setup();
    const changed = vi.fn();
    render(
      <WelkDropDown
        label="Hero"
        searchable
        options={options}
        onValueChange={changed}
      />,
    );
    const input = screen.getByRole("combobox", { name: "Hero" });
    await user.type(input, "BAT");
    expect(screen.getAllByRole("option")).toHaveLength(1);
    await user.click(screen.getByRole("option", { name: "Batman" }));
    expect(input).toHaveValue("Batman");
    expect(input).toHaveAttribute("aria-expanded", "false");
    expect(changed).toHaveBeenCalledWith("batman");
  });

  it("supports keyboard navigation, skipping disabled values and preventing form submission", async () => {
    const user = userEvent.setup();
    const submit = vi.fn();
    render(
      <form onSubmit={submit}>
        <WelkDropDown label="Hero" searchable options={options} />
      </form>,
    );
    const input = screen.getByRole("combobox", { name: "Hero" });
    input.focus();
    await user.keyboard("{ArrowDown}{ArrowDown}{ArrowDown}{Enter}");
    expect(input).toHaveValue("Wonder Woman");
    expect(submit).not.toHaveBeenCalled();
    await user.keyboard("{ArrowDown}{Home}{End}{ArrowUp}{Enter}");
    expect(input).toHaveValue("Batman");
  });

  it("shows empty results and restores the selection on Escape, outside click and Tab", async () => {
    const user = userEvent.setup();
    render(
      <>
        <WelkDropDown
          label="Hero"
          searchable
          options={options}
          defaultValue="superman"
        />
        <button>Outside</button>
      </>,
    );
    const input = screen.getByRole("combobox", { name: "Hero" });
    await user.click(input);
    await user.type(input, "nothing");
    expect(screen.getByRole("status")).toHaveTextContent("No results found");
    await user.keyboard("{Escape}");
    expect(input).toHaveValue("Superman");
    await user.click(input);
    fireEvent.pointerDown(document.body);
    expect(input).toHaveAttribute("aria-expanded", "false");
    await user.click(input);
    await user.tab();
    expect(input).toHaveValue("Superman");
    expect(screen.getByRole("button", { name: "Outside" })).toHaveFocus();
  });

  it("supports controlled values without committing search text", async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [value, setValue] = useState("batman");
      return (
        <WelkDropDown
          label="Hero"
          options={options}
          searchable
          value={value}
          onValueChange={setValue}
        />
      );
    }
    render(<Controlled />);
    const input = screen.getByRole("combobox", { name: "Hero" });
    await user.type(input, "super");
    await user.keyboard("{ArrowDown}{Enter}");
    expect(input).toHaveValue("Superman");
  });

  it("starts a fresh search when a selected control receives keyboard focus", async () => {
    const user = userEvent.setup();
    render(
      <WelkDropDown
        label="Hero"
        options={options}
        searchable
        defaultValue="batman"
      />,
    );
    await user.tab();
    await user.keyboard("super{ArrowDown}{Enter}");
    expect(screen.getByRole("combobox", { name: "Hero" })).toHaveValue(
      "Superman",
    );
  });

  it("preserves native required validation, form values and reset in searchable mode", async () => {
    const user = userEvent.setup();
    const ref = createRef<HTMLSelectElement>();
    const { container } = render(
      <form>
        <WelkDropDown
          label="Hero"
          options={options}
          searchable
          required
          name="hero"
          ref={ref}
        />
        <button type="reset">Reset</button>
      </form>,
    );
    expect(ref.current).toBeInvalid();
    const input = screen.getByRole("combobox", { name: "Hero" });
    await user.type(input, "bat");
    expect(new FormData(container.querySelector("form")!).get("hero")).toBe("");
    await user.keyboard("{ArrowDown}{Enter}");
    expect(ref.current).toBeValid();
    expect(new FormData(container.querySelector("form")!).get("hero")).toBe(
      "batman",
    );
    await user.click(screen.getByRole("button", { name: "Reset" }));
    await waitFor(() => expect(input).toHaveValue(""));
    expect(ref.current).toBeInvalid();
  });

  it("does not select disabled options and disables the whole control", async () => {
    const user = userEvent.setup();
    const changed = vi.fn();
    const { rerender } = render(
      <WelkDropDown
        label="Hero"
        options={options}
        searchable
        onValueChange={changed}
      />,
    );
    await user.click(screen.getByRole("combobox"));
    await user.click(
      within(screen.getByRole("listbox")).getByRole("option", {
        name: "Flash",
      }),
    );
    expect(changed).not.toHaveBeenCalled();
    rerender(
      <WelkDropDown label="Hero" options={options} searchable disabled />,
    );
    expect(screen.getByRole("combobox")).toBeDisabled();
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });
});
