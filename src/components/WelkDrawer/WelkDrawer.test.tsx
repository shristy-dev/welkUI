import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { WelkDrawer } from "./WelkDrawer";

const prototype = HTMLDialogElement.prototype;
const originalShowModal = Object.getOwnPropertyDescriptor(
  prototype,
  "showModal",
);
const originalClose = Object.getOwnPropertyDescriptor(prototype, "close");
beforeAll(() => {
  Object.defineProperties(prototype, {
    showModal: {
      configurable: true,
      value() {
        this.open = true;
      },
    },
    close: {
      configurable: true,
      value() {
        if (!this.open) return;
        this.open = false;
        this.dispatchEvent(new Event("close"));
      },
    },
  });
});
afterAll(() => {
  for (const [name, descriptor] of [
    ["showModal", originalShowModal],
    ["close", originalClose],
  ] as const) {
    if (descriptor) Object.defineProperty(prototype, name, descriptor);
    else Reflect.deleteProperty(prototype, name);
  }
});
afterEach(() => vi.useRealTimers());

describe("WelkDrawer", () => {
  it.each(["left", "right", "top", "bottom"] as const)(
    "opens a labeled %s drawer",
    (position) => {
      render(
        <WelkDrawer open title="Mission" onClose={vi.fn()} position={position}>
          Details
        </WelkDrawer>,
      );
      expect(
        screen.getByRole("dialog", { name: "Mission" }).className,
      ).toContain(position);
      expect(screen.getByText("Details")).toBeVisible();
    },
  );

  it("requests controlled dismissal using close and Escape", async () => {
    const close = vi.fn();
    render(
      <WelkDrawer
        open
        title="Mission"
        onClose={close}
        closeLabel="Dismiss panel"
      />,
    );
    await userEvent
      .setup()
      .click(screen.getByRole("button", { name: "Dismiss panel" }));
    const dialog = screen.getByRole("dialog");
    expect(close).toHaveBeenCalledOnce();
    expect(dialog).toHaveAttribute("open");
    fireEvent(dialog, new Event("cancel", { cancelable: true }));
    expect(close).toHaveBeenCalledTimes(2);
    expect(dialog).toHaveAttribute("open");
  });

  it("animates closing, cancels a pending exit on reopen and restores body scrolling", () => {
    vi.useFakeTimers();
    const close = vi.fn();
    document.body.style.overflow = "auto";
    const { rerender, unmount } = render(
      <WelkDrawer open title="Mission" onClose={close} />,
    );
    expect(document.body.style.overflow).toBe("hidden");
    rerender(<WelkDrawer open={false} title="Mission" onClose={close} />);
    expect(document.body.style.overflow).toBe("auto");
    expect(screen.getByRole("dialog").className).toContain("closing");
    act(() => vi.advanceTimersByTime(100));
    rerender(<WelkDrawer open title="Mission" onClose={close} />);
    act(() => vi.advanceTimersByTime(200));
    expect(screen.getByRole("dialog")).toHaveAttribute("open");
    rerender(<WelkDrawer open={false} title="Mission" onClose={close} />);
    act(() => vi.advanceTimersByTime(200));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(close).not.toHaveBeenCalled();
    unmount();
    document.body.style.overflow = "";
  });

  it("only dismisses backdrop clicks when enabled, not inside clicks or drag-outs", () => {
    const close = vi.fn();
    const { rerender } = render(
      <WelkDrawer open title="Mission" onClose={close} />,
    );
    const dialog = screen.getByRole("dialog");
    const outside = { clientX: -10, clientY: -10 };
    fireEvent.pointerDown(dialog, outside);
    fireEvent.click(dialog, outside);
    expect(close).not.toHaveBeenCalled();
    rerender(
      <WelkDrawer open title="Mission" onClose={close} closeOnTapOutside />,
    );
    fireEvent.pointerDown(screen.getByText("Mission"));
    fireEvent.click(dialog, outside);
    expect(close).not.toHaveBeenCalled();
    fireEvent.pointerDown(dialog, outside);
    fireEvent.click(dialog, outside);
    expect(close).toHaveBeenCalledOnce();
  });

  it("starts closed and restores scrolling on unmount", () => {
    const { rerender, unmount } = render(
      <WelkDrawer open={false} title="Mission" onClose={vi.fn()} />,
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    const overflow = document.body.style.overflow;
    rerender(<WelkDrawer open title="Mission" onClose={vi.fn()} />);
    unmount();
    expect(document.body.style.overflow).toBe(overflow);
  });
});
