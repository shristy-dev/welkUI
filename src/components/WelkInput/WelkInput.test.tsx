import { createRef, useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { WelkInput } from "./WelkInput";

describe("WelkInput", () => {
  it("activates an accessible custom end action by mouse and keyboard without submitting", async () => {
    const onClick = vi.fn();
    const onSubmit = vi.fn((event) => event.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <WelkInput
          label="Search"
          endAction={{
            icon: <svg data-testid="icon" />,
            label: "Run search",
            onClick,
          }}
        />
      </form>,
    );
    const user = userEvent.setup();
    const button = screen.getByRole("button", { name: "Run search" });
    expect(button).toHaveAttribute("type", "button");
    expect(screen.getByTestId("icon").parentElement).toHaveAttribute(
      "aria-hidden",
      "true",
    );
    await user.click(button);
    await user.keyboard("{Enter}");
    await user.keyboard(" ");
    expect(onClick).toHaveBeenCalledTimes(3);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("disables end actions with the input or independently", async () => {
    const onClick = vi.fn();
    const endAction = { icon: "X", label: "Clear", onClick };
    const { rerender } = render(
      <WelkInput label="Name" disabled endAction={endAction} />,
    );
    expect(screen.getByRole("button")).toBeDisabled();
    await userEvent.setup().click(screen.getByRole("button"));
    expect(onClick).not.toHaveBeenCalled();
    rerender(
      <WelkInput label="Name" endAction={{ ...endAction, disabled: true }} />,
    );
    expect(screen.getByRole("button")).toBeDisabled();
    expect(screen.getByRole("textbox")).not.toBeDisabled();
  });

  it("associates its label and forwards refs and native attributes", async () => {
    const ref = createRef<HTMLInputElement>();
    render(
      <WelkInput
        label="Hero name"
        ref={ref}
        name="hero"
        required
        className="custom"
        placeholder="Your name"
      />,
    );
    const input = screen.getByRole("textbox", { name: "Hero name" });
    expect(ref.current).toBe(input);
    expect(input).toHaveAttribute("type", "text");
    expect(input).toHaveClass("custom");
    expect(input).toBeRequired();
    expect(input).toHaveAttribute("placeholder", "Your name");
    await userEvent.setup().click(screen.getByText("Hero name"));
    expect(input).toHaveFocus();
  });

  it("supports uncontrolled values and form submission data", async () => {
    render(
      <form aria-label="Hero form">
        <WelkInput label="Hero" name="hero" defaultValue="Captain" />
      </form>,
    );
    const input = screen.getByRole("textbox");
    await userEvent.setup().type(input, " Welk");
    expect(input).toHaveValue("Captain Welk");
    const form = screen.getByRole<HTMLFormElement>("form");
    expect(new FormData(form).get("hero")).toBe("Captain Welk");
  });

  it("supports controlled values and keyboard input", async () => {
    function Controlled() {
      const [value, setValue] = useState("");
      return (
        <WelkInput
          label="Hero"
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
      );
    }
    render(<Controlled />);
    const user = userEvent.setup();
    await user.tab();
    await user.keyboard("Captain Welk");
    expect(screen.getByRole("textbox")).toHaveValue("Captain Welk");
  });

  it("preserves explicit ids and generates unique ids", () => {
    render(
      <>
        <WelkInput label="First" id="first" />
        <WelkInput label="Second" />
        <WelkInput label="Third" />
      </>,
    );
    const [first, second, third] = screen.getAllByRole("textbox");
    expect(first).toHaveAttribute("id", "first");
    expect(second.id).not.toBe(third.id);
  });

  it.each(["disabled", "readOnly"] as const)(
    "prevents editing when %s",
    async (state) => {
      render(
        <WelkInput
          label="Hero"
          defaultValue="Captain"
          {...{ [state]: true }}
        />,
      );
      const input = screen.getByRole("textbox");
      await userEvent.setup().type(input, " Welk");
      expect(input).toHaveValue("Captain");
      if (state === "disabled") expect(input).toBeDisabled();
      else expect(input).toHaveAttribute("readonly");
    },
  );

  it("supports text-like input types and accessible validation descriptions", () => {
    render(
      <>
        <WelkInput
          label="Email"
          type="email"
          aria-invalid="true"
          aria-describedby="error"
        />
        <p id="error">Enter a valid email.</p>
      </>,
    );
    const input = screen.getByRole("textbox", { name: "Email" });
    expect(input).toHaveAttribute("type", "email");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription("Enter a valid email.");
  });
});
