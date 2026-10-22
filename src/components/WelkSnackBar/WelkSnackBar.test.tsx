import { useState } from "react";
import { renderToString } from "react-dom/server";
import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { WelkSnackBar } from "./WelkSnackBar";
import type { WelkSnackBarPosition } from "./WelkSnackBar.types";

const props = { open: true, onClose: vi.fn(), message: "POW! Saved." };

afterEach(() => {
  vi.useRealTimers();
  vi.clearAllMocks();
});

describe("WelkSnackBar", () => {
  it("portals a polite announcement to the body without moving focus", () => {
    const { container, rerender } = render(
      <>
        <button>Save</button>
        <WelkSnackBar {...props} open={false} />
      </>,
    );
    screen.getByRole("button", { name: "Save" }).focus();
    rerender(
      <>
        <button>Save</button>
        <WelkSnackBar {...props} />
      </>,
    );
    const message = screen.getByRole("status");
    expect(message).toHaveTextContent("POW! Saved.");
    expect(message).toHaveAttribute("aria-atomic", "true");
    expect(container).not.toContainElement(message);
    expect(screen.getByRole("button", { name: "Save" })).toHaveFocus();
  });

  it.each<WelkSnackBarPosition>([
    "top-left",
    "top-middle",
    "top-right",
    "bottom-left",
    "bottom-middle",
    "bottom-right",
  ])("supports the %s position", (position) => {
    render(<WelkSnackBar {...props} position={position} />);
    const wrapper = screen.getByRole("status").parentElement!.parentElement!;
    expect(wrapper.className).toContain(position);
  });

  it("supports controlled dismissal and retains an inaccessible exit frame", async () => {
    vi.useFakeTimers();
    function Demo() {
      const [open, setOpen] = useState(true);
      return (
        <WelkSnackBar {...props} open={open} onClose={() => setOpen(false)} />
      );
    }
    render(<Demo />);
    fireEvent.click(
      screen.getByRole("button", { name: "Dismiss notification" }),
    );
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    const leavingMessage = screen.getByText("POW! Saved.");
    expect(leavingMessage.parentElement?.className).toContain("leaving");
    expect(screen.getByRole("button", { hidden: true })).toBeDisabled();
    act(() => vi.advanceTimersByTime(200));
    expect(screen.queryByText("POW! Saved.")).not.toBeInTheDocument();
  });

  it("requests dismissal using the custom close label and Escape", async () => {
    const user = userEvent.setup();
    render(<WelkSnackBar {...props} closeLabel="Close message" />);
    const close = screen.getByRole("button", { name: "Close message" });
    await user.click(close);
    expect(props.onClose).toHaveBeenCalledTimes(1);
    await user.keyboard("{Escape}");
    expect(props.onClose).toHaveBeenCalledTimes(2);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("stays open by default and supports optional auto-hide", () => {
    vi.useFakeTimers();
    const { rerender } = render(<WelkSnackBar {...props} />);
    act(() => vi.advanceTimersByTime(10000));
    expect(props.onClose).not.toHaveBeenCalled();
    rerender(<WelkSnackBar {...props} autoHideDuration={5000} />);
    act(() => vi.advanceTimersByTime(4999));
    expect(props.onClose).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(1));
    expect(props.onClose).toHaveBeenCalledTimes(1);
  });

  it("pauses while hovered or focused and resumes after interaction ends", () => {
    vi.useFakeTimers();
    render(<WelkSnackBar {...props} autoHideDuration={1000} />);
    const snackbar = screen.getByRole("status").parentElement!;
    const close = screen.getByRole("button");
    fireEvent.mouseEnter(snackbar);
    act(() => vi.advanceTimersByTime(2000));
    expect(props.onClose).not.toHaveBeenCalled();
    fireEvent.focus(close);
    fireEvent.mouseLeave(snackbar);
    act(() => vi.advanceTimersByTime(2000));
    expect(props.onClose).not.toHaveBeenCalled();
    fireEvent.blur(close, { relatedTarget: document.body });
    act(() => vi.advanceTimersByTime(1000));
    expect(props.onClose).toHaveBeenCalledTimes(1);
  });

  it("does not restart auto-hide when a parent supplies a new callback", () => {
    vi.useFakeTimers();
    const latest = vi.fn();
    const { rerender } = render(
      <WelkSnackBar {...props} autoHideDuration={1000} />,
    );
    act(() => vi.advanceTimersByTime(500));
    rerender(
      <WelkSnackBar {...props} onClose={latest} autoHideDuration={1000} />,
    );
    act(() => vi.advanceTimersByTime(500));
    expect(latest).toHaveBeenCalledTimes(1);
    expect(props.onClose).not.toHaveBeenCalled();
  });

  it("cancels a pending exit and restarts the timer when reopened", () => {
    vi.useFakeTimers();
    const { rerender } = render(
      <WelkSnackBar {...props} autoHideDuration={1000} />,
    );
    fireEvent.mouseEnter(screen.getByRole("status").parentElement!);
    rerender(<WelkSnackBar {...props} open={false} autoHideDuration={1000} />);
    act(() => vi.advanceTimersByTime(100));
    rerender(<WelkSnackBar {...props} autoHideDuration={1000} />);
    act(() => vi.advanceTimersByTime(200));
    expect(screen.getByRole("status")).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(800));
    expect(props.onClose).toHaveBeenCalledTimes(1);
  });

  it("cleans up timers on unmount", () => {
    vi.useFakeTimers();
    const { unmount } = render(
      <WelkSnackBar {...props} autoHideDuration={1000} />,
    );
    unmount();
    act(() => vi.advanceTimersByTime(1000));
    expect(props.onClose).not.toHaveBeenCalled();
  });

  it("renders no portal when closed or server-rendered", () => {
    render(<WelkSnackBar {...props} open={false} />);
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(renderToString(<WelkSnackBar {...props} />)).toBe("");
  });

  it.each([-1, NaN, Infinity])(
    "rejects invalid auto-hide duration %s",
    (autoHideDuration) => {
      expect(() =>
        render(<WelkSnackBar {...props} autoHideDuration={autoHideDuration} />),
      ).toThrow(RangeError);
    },
  );
});
