import { createRef } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import { WelkAttachment } from "./WelkAttachment";

const file = new File(["hello"], "mission.txt", { type: "text/plain" });

describe("WelkAttachment", () => {
  beforeEach(() => {
    let index = 0;
    vi.stubGlobal(
      "URL",
      class extends URL {
        static createObjectURL = vi.fn(() => `blob:preview-${++index}`);
        static revokeObjectURL = vi.fn();
      },
    );
  });
  afterEach(() => vi.unstubAllGlobals());

  it("previews images and revokes URLs on replacement, clear and unmount", async () => {
    const user = userEvent.setup();
    const first = new File(["image"], "first.png", { type: "image/png" });
    const second = new File(["image"], "second.png", { type: "image/png" });
    const { unmount } = render(<WelkAttachment label="Files" />);
    const input = screen.getByLabelText("Files");
    await user.upload(input, first);
    expect(screen.getByAltText("Preview of first.png")).toHaveAttribute(
      "src",
      "blob:preview-1",
    );
    await user.upload(input, second);
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:preview-1");
    expect(screen.getByAltText("Preview of second.png")).toHaveAttribute(
      "src",
      "blob:preview-2",
    );
    await user.click(screen.getByRole("button", { name: "Clear attachments" }));
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:preview-2");
    await user.upload(input, first);
    unmount();
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:preview-3");
  });

  it("uses native media controls, reports decoding failures and skips document previews", async () => {
    const user = userEvent.setup();
    const { container } = render(<WelkAttachment label="Files" />);
    await user.upload(screen.getByLabelText("Files"), [
      new File(["video"], "clip.mp4", { type: "video/mp4" }),
      new File(["audio"], "sound.mp3", { type: "audio/mpeg" }),
      new File(["doc"], "doc.pdf", { type: "application/pdf" }),
    ]);
    expect(container.querySelector("video")).toHaveAttribute("controls");
    expect(container.querySelector("audio")).toHaveAttribute("controls");
    expect(URL.createObjectURL).toHaveBeenCalledTimes(2);
    fireEvent.error(container.querySelector("video")!);
    expect(screen.getByRole("status")).toHaveTextContent(
      "Preview unavailable for clip.mp4",
    );
  });

  it("releases preview URLs on form reset", async () => {
    const user = userEvent.setup();
    render(
      <form>
        <WelkAttachment label="Files" />
        <button type="reset">Reset</button>
      </form>,
    );
    await user.upload(
      screen.getByLabelText("Files"),
      new File(["image"], "hero.png", { type: "image/png" }),
    );
    await user.click(screen.getByRole("button", { name: "Reset" }));
    await waitFor(() =>
      expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:preview-1"),
    );
  });
  it("selects files using a native input, forwards its ref and reports files", async () => {
    const user = userEvent.setup();
    const changed = vi.fn();
    const ref = createRef<HTMLInputElement>();
    render(
      <WelkAttachment
        label="Files"
        ref={ref}
        name="attachments"
        onFilesChange={changed}
      />,
    );
    const input = screen.getByLabelText("Files");
    expect(ref.current).toBe(input);
    await user.upload(input, file);
    expect(ref.current?.files?.[0]).toBe(file);
    expect(changed).toHaveBeenCalledWith([file]);
    expect(
      screen.getByRole("list", { name: "Selected files" }),
    ).toHaveTextContent("mission.txt");
  });

  it("rejects an entire selection above the count limit with an explicit error", async () => {
    const user = userEvent.setup();
    const changed = vi.fn();
    render(
      <WelkAttachment label="Files" maxFiles={1} onFilesChange={changed} />,
    );
    const input = screen.getByLabelText<HTMLInputElement>("Files");
    await user.upload(input, [file, new File(["a"], "other.txt")]);
    expect(screen.getByRole("alert")).toHaveTextContent("no more than 1 file");
    expect(input.files).toHaveLength(0);
    expect(changed).toHaveBeenCalledWith([]);
  });

  it("allows the exact size threshold and rejects larger files", async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <WelkAttachment label="Files" maxFileSize={5} />,
    );
    await user.upload(screen.getByLabelText("Files"), file);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    rerender(<WelkAttachment label="Files" maxFileSize={4} />);
    await user.upload(
      screen.getByLabelText("Files"),
      new File(["12345"], "large.txt"),
    );
    expect(screen.getByRole("alert")).toHaveTextContent(
      "exceeds the 4-byte limit",
    );
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });

  it("validates accepted extensions and MIME wildcards, not just picker hints", async () => {
    const user = userEvent.setup({ applyAccept: false });
    render(<WelkAttachment label="Files" accept="image/*,.PDF" />);
    const input = screen.getByLabelText("Files");
    await user.upload(input, [
      new File(["a"], "a.PNG", { type: "image/png" }),
      new File(["b"], "b.pdf"),
    ]);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    await user.upload(input, file);
    expect(screen.getByRole("alert")).toHaveTextContent(
      "not an accepted file type",
    );
  });

  it("clears native files and permits reselecting the same file", async () => {
    const user = userEvent.setup();
    const changed = vi.fn();
    render(<WelkAttachment label="Files" onFilesChange={changed} />);
    const input = screen.getByLabelText<HTMLInputElement>("Files");
    await user.upload(input, file);
    await user.click(screen.getByRole("button", { name: "Clear attachments" }));
    expect(input.files).toHaveLength(0);
    expect(changed).toHaveBeenLastCalledWith([]);
    await user.upload(input, file);
    expect(changed).toHaveBeenLastCalledWith([file]);
  });

  it("resets the list with its form and respects prevented resets", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <form>
        <WelkAttachment label="Files" />
        <button type="reset">Reset</button>
      </form>,
    );
    await user.upload(screen.getByLabelText("Files"), file);
    const prevent = (event: Event) => event.preventDefault();
    container.querySelector("form")!.addEventListener("reset", prevent);
    await user.click(screen.getByRole("button", { name: "Reset" }));
    expect(screen.getByRole("list")).toBeInTheDocument();
    container.querySelector("form")!.removeEventListener("reset", prevent);
    fireEvent.reset(container.querySelector("form")!);
    await waitFor(() =>
      expect(screen.queryByRole("list")).not.toBeInTheDocument(),
    );
  });

  it("supports single selection, required, disabled and native callbacks", async () => {
    const user = userEvent.setup();
    const changed = vi.fn();
    const { rerender } = render(
      <WelkAttachment
        label="Files"
        multiple={false}
        required
        onChange={changed}
      />,
    );
    const input = screen.getByLabelText("Files");
    expect(input).not.toHaveAttribute("multiple");
    expect(input).toBeRequired();
    await user.upload(input, file);
    expect(changed).toHaveBeenCalledOnce();
    rerender(<WelkAttachment label="Files" disabled />);
    expect(input).toBeDisabled();
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it.each([
    { maxFiles: 0 },
    { maxFiles: 1.5 },
    { maxFileSize: -1 },
    { maxFileSize: Infinity },
  ])("rejects invalid limits %s", (limits) => {
    expect(() => render(<WelkAttachment label="Files" {...limits} />)).toThrow(
      RangeError,
    );
  });
});
