import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { WelkIconButton } from "./WelkIconButton";
import styles from "./WelkIconButton.module.css";

describe("WelkIconButton", () => {
  it("defaults to a named icon-only button and forwards native attributes and ref", () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <WelkIconButton
        ref={ref}
        icon={<svg data-testid="icon" />}
        label="Add"
        className="custom"
        title="Add item"
      />,
    );
    const button = screen.getByRole("button", { name: "Add" });
    expect(ref.current).toBe(button);
    expect(button).toHaveClass(styles.default, "custom");
    expect(button).toHaveAttribute("type", "button");
    expect(button).toHaveAttribute("title", "Add item");
    expect(screen.queryByText("Add")).not.toBeInTheDocument();
    expect(screen.getByTestId("icon").parentElement).toHaveAttribute(
      "aria-hidden",
      "true",
    );
    expect(button).not.toHaveAttribute("variant");
  });

  it("shows the label beside the icon for the text variant", () => {
    render(<WelkIconButton icon={<svg />} label="Add item" variant="text" />);
    expect(screen.getByRole("button", { name: "Add item" })).toHaveClass(
      styles.text,
    );
    expect(screen.getByText("Add item")).toBeVisible();
  });

  it("supports click, Enter and Space without submitting forms by default", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const onSubmit = vi.fn();
    render(
      <form onSubmit={onSubmit}>
        <WelkIconButton icon={<svg />} label="Add" onClick={onClick} />
      </form>,
    );
    await user.click(screen.getByRole("button"));
    await user.keyboard("{Enter} ");
    expect(onClick).toHaveBeenCalledTimes(3);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("supports disabled and explicit accessible labels", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <WelkIconButton
        icon={<svg />}
        label="Add"
        aria-label="Add a hero"
        disabled
        onClick={onClick}
      />,
    );
    const button = screen.getByRole("button", { name: "Add a hero" });
    expect(button).toBeDisabled();
    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });
});
