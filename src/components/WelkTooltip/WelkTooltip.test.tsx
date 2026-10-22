import { createRef } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { WelkTooltip } from "./WelkTooltip";
import styles from "./WelkTooltip.module.css";

describe("WelkTooltip", () => {
  it("opens a thinking bubble on hover and stays open over the tooltip", async () => {
    const user = userEvent.setup();
    render(
      <WelkTooltip content="Thinking..." className="custom">
        <button>Think</button>
      </WelkTooltip>,
    );
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    await user.hover(screen.getByRole("button"));
    const tooltip = screen.getByRole("tooltip");
    expect(tooltip).toHaveClass(styles.bubble, "custom");
    expect(screen.getByRole("button")).toHaveAccessibleDescription(
      "Thinking...",
    );
    await user.hover(tooltip);
    expect(tooltip).toBeInTheDocument();
    await user.unhover(tooltip);
    await waitFor(() =>
      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument(),
    );
  });

  it.each(["speech", "speach"] as const)(
    "supports the %s speech variant",
    async (variant) => {
      const user = userEvent.setup();
      render(
        <WelkTooltip content="Hello!" variant={variant}>
          <button>Speak</button>
        </WelkTooltip>,
      );
      await user.tab();
      expect(screen.getByRole("tooltip")).toHaveClass(styles.speech);
      await user.tab();
      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    },
  );

  it("dismisses with Escape, retains focus, and reopens after leaving", async () => {
    const user = userEvent.setup();
    render(
      <WelkTooltip content="Hello!">
        <button>Speak</button>
      </WelkTooltip>,
    );
    await user.tab();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    expect(screen.getByRole("button")).toHaveFocus();
    await user.tab();
    await user.tab({ shift: true });
    expect(screen.getByRole("tooltip")).toBeInTheDocument();
  });

  it("keeps the tooltip open while focused after the pointer leaves", async () => {
    const user = userEvent.setup();
    render(
      <WelkTooltip content="Hello!">
        <button>Speak</button>
      </WelkTooltip>,
    );
    await user.hover(screen.getByRole("button"));
    await user.tab();
    await user.unhover(screen.getByRole("button"));
    expect(screen.getByRole("tooltip")).toBeInTheDocument();
  });

  it("preserves child refs, handlers and existing descriptions", async () => {
    const user = userEvent.setup();
    const ref = createRef<HTMLButtonElement>();
    const onClick = vi.fn();
    render(
      <>
        <span id="existing">Existing hint</span>
        <WelkTooltip content="New hint">
          <button ref={ref} onClick={onClick} aria-describedby="existing">
            Help
          </button>
        </WelkTooltip>
      </>,
    );
    const button = screen.getByRole("button");
    expect(ref.current).toBe(button);
    await user.click(button);
    expect(onClick).toHaveBeenCalledOnce();
    expect(button).toHaveAccessibleDescription("Existing hint New hint");
    await user.keyboard("{Escape}");
    expect(button).toHaveAttribute("aria-describedby", "existing");
  });
});
