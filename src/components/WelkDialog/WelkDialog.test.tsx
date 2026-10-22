import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { WelkDialog } from "./WelkDialog";
import styles from "./WelkDialog.module.css";
import buttonStyles from "../WelkButton/WelkButton.module.css";

const prototype = HTMLDialogElement.prototype;
const originalShowModal = Object.getOwnPropertyDescriptor(
  prototype,
  "showModal",
);
const originalClose = Object.getOwnPropertyDescriptor(prototype, "close");

beforeAll(() => {
  // jsdom does not implement the native dialog top layer or modal methods.
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

describe("WelkDialog", () => {
  it.each(["alert", "info", "warning", "error", "success"] as const)(
    "renders %s with an accessible title, close icon and default Okay action",
    async (variant) => {
      const onClose = vi.fn();
      render(
        <WelkDialog open onClose={onClose} title="Attention" variant={variant}>
          Message
        </WelkDialog>,
      );
      const dialog = screen.getByRole("dialog", { name: "Attention" });
      expect(dialog).toHaveClass(styles[variant]);
      expect(screen.getByText("Message")).toBeVisible();
      expect(
        screen.getByRole("button", { name: "Close dialog" }),
      ).toBeInTheDocument();
      await userEvent
        .setup()
        .click(screen.getByRole("button", { name: "Okay" }));
      expect(dialog).not.toHaveAttribute("open");
      expect(onClose).toHaveBeenCalledOnce();
    },
  );

  it("defaults to alert and follows the open prop", () => {
    const onClose = vi.fn();
    const { rerender } = render(
      <WelkDialog open={false} onClose={onClose} title="Hello" />,
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    rerender(<WelkDialog open onClose={onClose} title="Hello" />);
    expect(screen.getByRole("dialog")).toHaveClass(styles.alert);
    rerender(<WelkDialog open={false} onClose={onClose} title="Hello" />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("allows a custom label and action without implicitly closing", async () => {
    const onPress = vi.fn();
    const onClose = vi.fn();
    render(
      <WelkDialog
        open
        onClose={onClose}
        title="Save"
        buttonText="Save now"
        onPress={onPress}
      />,
    );
    await userEvent
      .setup()
      .click(screen.getByRole("button", { name: "Save now" }));
    expect(onPress).toHaveBeenCalledOnce();
    expect(onClose).not.toHaveBeenCalled();
    expect(screen.getByRole("dialog")).toHaveAttribute("open");
  });

  it.each(["Yes", "No"])(
    "closes confirmation dialogs with %s by default",
    async (label) => {
      const onClose = vi.fn();
      render(
        <WelkDialog
          open
          onClose={onClose}
          title="Continue?"
          type="confirmation"
        />,
      );
      expect(
        screen.queryByRole("button", { name: "Okay" }),
      ).not.toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Yes" })).toHaveClass(
        buttonStyles.success,
      );
      expect(screen.getByRole("button", { name: "No" })).toHaveClass(
        buttonStyles.error,
      );
      await userEvent
        .setup()
        .click(screen.getByRole("button", { name: label }));
      expect(onClose).toHaveBeenCalledOnce();
    },
  );

  it("supports custom confirmation labels and independent handlers", async () => {
    const onYesPress = vi.fn();
    const onNoPress = vi.fn();
    render(
      <WelkDialog
        open
        onClose={vi.fn()}
        title="Continue?"
        type="confirmation"
        yesText="Proceed"
        noText="Cancel"
        onYesPress={onYesPress}
        onNoPress={onNoPress}
      />,
    );
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Proceed" }));
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onYesPress).toHaveBeenCalledOnce();
    expect(onNoPress).toHaveBeenCalledOnce();
    expect(screen.getByRole("dialog")).toHaveAttribute("open");
  });

  it("always closes with its close icon, independently of custom actions", async () => {
    const onClose = vi.fn();
    render(
      <WelkDialog
        open
        onClose={onClose}
        title="Hello"
        closeLabel="Dismiss"
        onPress={vi.fn()}
      />,
    );
    await userEvent
      .setup()
      .click(screen.getByRole("button", { name: "Dismiss" }));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("only dismisses outside taps when opted in and ignores content and drag-out clicks", () => {
    const onClose = vi.fn();
    const { rerender } = render(
      <WelkDialog open onClose={onClose} title="Hello">
        Content
      </WelkDialog>,
    );
    const dialog = screen.getByRole("dialog");
    vi.spyOn(dialog, "getBoundingClientRect").mockReturnValue(
      new DOMRect(100, 100, 400, 300),
    );
    const outsideTap = () => {
      fireEvent.pointerDown(dialog, { clientX: 0, clientY: 0 });
      fireEvent.click(dialog, { clientX: 0, clientY: 0 });
    };
    outsideTap();
    expect(dialog).toHaveAttribute("open");
    rerender(
      <WelkDialog open onClose={onClose} title="Hello" closeOnTapOutside>
        Content
      </WelkDialog>,
    );
    fireEvent.pointerDown(screen.getByText("Content"));
    fireEvent.click(dialog, { clientX: 0, clientY: 0 });
    expect(dialog).toHaveAttribute("open");
    fireEvent.pointerDown(dialog, { clientX: 200, clientY: 200 });
    fireEvent.click(dialog, { clientX: 200, clientY: 200 });
    expect(dialog).toHaveAttribute("open");
    outsideTap();
    expect(dialog).not.toHaveAttribute("open");
    expect(onClose).toHaveBeenCalledOnce();
  });
});
