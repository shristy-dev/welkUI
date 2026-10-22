import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { WelkCard } from "./WelkCard";
import styles from "./WelkCard.module.css";

describe("WelkCard", () => {
  it("renders an accessible title, subtitle and decorative top-right icon", () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <WelkCard
        ref={ref}
        title="Adventure"
        subtitle="Start your story"
        icon={<svg data-testid="icon" />}
        className="custom"
      />,
    );
    const card = screen.getByRole("button", { name: "Adventure" });
    expect(card).toHaveAccessibleDescription("Start your story");
    expect(ref.current).toBe(card);
    expect(card).toHaveAttribute("type", "button");
    expect(card).toHaveClass(styles.card, styles.growOnHover, "custom");
    expect(screen.getByTestId("icon").parentElement).toHaveClass(styles.icon);
    expect(screen.getByTestId("icon").parentElement).toHaveAttribute(
      "aria-hidden",
      "true",
    );
    expect(card).not.toHaveAttribute("growOnHover");
  });

  it("allows hover growth to be turned off", () => {
    render(
      <WelkCard title="Adventure" subtitle="Start here" growOnHover={false} />,
    );
    expect(screen.getByRole("button")).not.toHaveClass(styles.growOnHover);
  });

  it("supports mouse, Enter and Space activation without submitting a form", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const onSubmit = vi.fn();
    render(
      <form onSubmit={onSubmit}>
        <WelkCard title="Adventure" subtitle="Start here" onClick={onClick} />
      </form>,
    );
    await user.click(screen.getByRole("button"));
    await user.keyboard("{Enter} ");
    expect(onClick).toHaveBeenCalledTimes(3);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("preserves native disabled behavior", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <WelkCard
        title="Adventure"
        subtitle="Unavailable"
        disabled
        onClick={onClick}
      />,
    );
    await user.click(screen.getByRole("button"));
    expect(onClick).not.toHaveBeenCalled();
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("respects explicit accessible labels", () => {
    render(
      <WelkCard
        title="Adventure"
        subtitle="Start here"
        aria-label="Open adventure"
      />,
    );
    expect(
      screen.getByRole("button", { name: "Open adventure" }),
    ).toBeInTheDocument();
  });
});
