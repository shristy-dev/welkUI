import { createRef, useState } from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { WelkRadioGroup } from "./WelkRadioGroup";

const options = [
  { label: "Hero", value: "hero" },
  { label: "Sidekick", value: "sidekick" },
  { label: "Villain", value: "villain", disabled: true },
];

describe("WelkRadioGroup", () => {
  it("labels the group and forwards refs and attributes", () => {
    const ref = createRef<HTMLFieldSetElement>();
    render(
      <WelkRadioGroup
        ref={ref}
        label="Role"
        options={options}
        id="roles"
        className="custom"
      />,
    );
    const group = screen.getByRole("radiogroup", { name: "Role" });
    expect(ref.current).toBe(group);
    expect(group).toHaveClass("custom");
    expect(group).toHaveAttribute("id", "roles");
    expect(within(group).getAllByRole("radio")).toHaveLength(3);
  });

  it("supports exclusive uncontrolled selection, change callbacks, form values and reset", async () => {
    const onValueChange = vi.fn();
    render(
      <form aria-label="Profile">
        <WelkRadioGroup
          label="Role"
          name="role"
          options={options}
          defaultValue="hero"
          onValueChange={onValueChange}
        />
        <button type="reset">Reset</button>
      </form>,
    );
    const user = userEvent.setup();
    expect(screen.getByRole("radio", { name: "Hero" })).toBeChecked();
    await user.click(screen.getByRole("radio", { name: "Sidekick" }));
    expect(screen.getByRole("radio", { name: "Hero" })).not.toBeChecked();
    expect(screen.getByRole("radio", { name: "Sidekick" })).toBeChecked();
    expect(onValueChange).toHaveBeenCalledWith("sidekick");
    const form = screen.getByRole<HTMLFormElement>("form");
    expect(new FormData(form).get("role")).toBe("sidekick");
    await user.click(screen.getByRole("button", { name: "Reset" }));
    expect(screen.getByRole("radio", { name: "Hero" })).toBeChecked();
  });

  it("supports controlled selection", async () => {
    function Controlled() {
      const [value, setValue] = useState("hero");
      return (
        <WelkRadioGroup
          label="Role"
          options={options}
          value={value}
          onValueChange={setValue}
        />
      );
    }
    render(<Controlled />);
    await userEvent
      .setup()
      .click(screen.getByRole("radio", { name: "Sidekick" }));
    expect(screen.getByRole("radio", { name: "Sidekick" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "Hero" })).not.toBeChecked();
  });

  it("uses arrow keys to move selection and skips disabled options", async () => {
    render(
      <WelkRadioGroup label="Role" options={options} defaultValue="hero" />,
    );
    const user = userEvent.setup();
    await user.tab();
    expect(screen.getByRole("radio", { name: "Hero" })).toHaveFocus();
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("radio", { name: "Sidekick" })).toBeChecked();
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("radio", { name: "Hero" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "Villain" })).not.toBeChecked();
  });

  it("disables the whole group", async () => {
    const onValueChange = vi.fn();
    render(
      <WelkRadioGroup
        label="Role"
        options={options}
        disabled
        onValueChange={onValueChange}
      />,
    );
    for (const input of screen.getAllByRole("radio"))
      expect(input).toBeDisabled();
    await userEvent.setup().click(screen.getByText("Hero"));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("keeps automatically named groups independent", async () => {
    render(
      <>
        <WelkRadioGroup label="First" options={options} />
        <WelkRadioGroup label="Second" options={options} />
      </>,
    );
    const [first, second] = screen.getAllByRole("radiogroup");
    const a = within(first).getByRole("radio", { name: "Hero" });
    const b = within(second).getByRole("radio", { name: "Hero" });
    expect(a.getAttribute("name")).not.toBe(b.getAttribute("name"));
    const user = userEvent.setup();
    await user.click(a);
    await user.click(b);
    expect(a).toBeChecked();
    expect(b).toBeChecked();
  });

  it("supports required native form validation", async () => {
    render(
      <form aria-label="Profile">
        <WelkRadioGroup label="Role" name="role" options={options} required />
      </form>,
    );
    const form = screen.getByRole<HTMLFormElement>("form");
    expect(form.checkValidity()).toBe(false);
    await userEvent.setup().click(screen.getByRole("radio", { name: "Hero" }));
    expect(form.checkValidity()).toBe(true);
  });
});
