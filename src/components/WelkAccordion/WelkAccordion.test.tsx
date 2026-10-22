import { createRef } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { WelkAccordion } from "./WelkAccordion";
import styles from "./WelkAccordion.module.css";

describe("WelkAccordion", () => {
  it.each([320, "24rem"] as const)(
    "preserves fixed width %s across open and closed states",
    (fixedWidth) => {
      const { rerender } = render(
        <WelkAccordion
          title="Details"
          fixedWidth={fixedWidth}
          style={{ color: "red", width: 100 }}
        >
          Content
        </WelkAccordion>,
      );
      const details = screen.getByText("Details").closest("details")!;
      const width =
        typeof fixedWidth === "number" ? `${fixedWidth}px` : fixedWidth;
      expect(details.style.width).toBe(width);
      expect(details.style.color).toBe("red");
      expect(details).not.toHaveAttribute("fixedWidth");
      rerender(
        <WelkAccordion title="Details" fixedWidth={fixedWidth} open>
          Content
        </WelkAccordion>,
      );
      expect(details.style.width).toBe(width);
    },
  );

  it("preserves native width styling when fixedWidth is omitted", () => {
    render(
      <WelkAccordion title="Details" style={{ width: "50%" }}>
        Content
      </WelkAccordion>,
    );
    expect(screen.getByText("Details").closest("details")?.style.width).toBe(
      "50%",
    );
  });
  it.each(["vertical", "horizontal", "nested"] as const)(
    "supports %s layout and opt-in outside dismissal",
    async (variant) => {
      const onToggle = vi.fn();
      const ref = createRef<HTMLDetailsElement>();
      render(
        <>
          <button>Outside</button>
          <WelkAccordion
            title="Details"
            variant={variant}
            closeOnOutsideClick
            ref={ref}
            onToggle={onToggle}
          >
            Content
          </WelkAccordion>
        </>,
      );
      expect(ref.current).toHaveClass(styles[variant]);
      expect(ref.current).not.toHaveAttribute("variant");
      expect(ref.current).not.toHaveAttribute("closeOnOutsideClick");
      const user = userEvent.setup();
      await user.click(screen.getByText("Details"));
      await user.click(screen.getByText("Content"));
      expect(ref.current).toHaveAttribute("open");
      onToggle.mockClear();
      await user.click(screen.getByRole("button", { name: "Outside" }));
      expect(ref.current).not.toHaveAttribute("open");
      await waitFor(() => expect(onToggle).toHaveBeenCalled());
    },
  );

  it("defaults to vertical and keeps the accordion open after outside taps", async () => {
    const ref = createRef<HTMLDetailsElement>();
    render(
      <>
        <button>Outside</button>
        <WelkAccordion title="Details" ref={ref}>
          Content
        </WelkAccordion>
      </>,
    );
    const user = userEvent.setup();
    await user.click(screen.getByText("Details"));
    await user.click(screen.getByRole("button"));
    expect(ref.current).toHaveAttribute("open");
    expect(ref.current).toHaveClass(styles.vertical);
  });

  it("treats child interactions as inside the parent and dismisses children independently", async () => {
    const parent = createRef<HTMLDetailsElement>();
    const child = createRef<HTMLDetailsElement>();
    render(
      <>
        <button>Outside</button>
        <WelkAccordion title="Parent" closeOnOutsideClick ref={parent}>
          <p>Parent content</p>
          <WelkAccordion
            title="Child"
            variant="nested"
            closeOnOutsideClick
            ref={child}
          >
            Child content
          </WelkAccordion>
        </WelkAccordion>
      </>,
    );
    const user = userEvent.setup();
    await user.click(screen.getByText("Parent"));
    await user.click(screen.getByText("Child"));
    await user.click(screen.getByText("Child content"));
    expect(parent.current).toHaveAttribute("open");
    expect(child.current).toHaveAttribute("open");
    await user.click(screen.getByText("Parent content"));
    expect(parent.current).toHaveAttribute("open");
    expect(child.current).not.toHaveAttribute("open");
    await user.click(screen.getByText("Child"));
    await user.click(screen.getByRole("button"));
    expect(parent.current).not.toHaveAttribute("open");
    expect(child.current).not.toHaveAttribute("open");
  });

  it("supports touch pointers and stops listening when dismissal is disabled or unmounted", () => {
    const ref = createRef<HTMLDetailsElement>();
    const { rerender, unmount } = render(
      <WelkAccordion title="Details" closeOnOutsideClick ref={ref}>
        Content
      </WelkAccordion>,
    );
    const details = ref.current!;
    details.open = true;
    fireEvent.pointerDown(document.body, { pointerType: "touch" });
    expect(details).not.toHaveAttribute("open");
    rerender(
      <WelkAccordion title="Details" closeOnOutsideClick={false} ref={ref}>
        Content
      </WelkAccordion>,
    );
    details.open = true;
    fireEvent.pointerDown(document.body);
    expect(details).toHaveAttribute("open");
    rerender(
      <WelkAccordion title="Details" closeOnOutsideClick ref={ref}>
        Content
      </WelkAccordion>,
    );
    unmount();
    fireEvent.pointerDown(document.body);
    expect(details).toHaveAttribute("open");
    expect(ref.current).toBeNull();
  });

  it("uses native disclosure semantics and forwards attributes and refs", () => {
    const ref = createRef<HTMLDetailsElement>();
    render(
      <WelkAccordion title="Details" ref={ref} className="custom" id="faq">
        Content
      </WelkAccordion>,
    );
    expect(ref.current?.tagName).toBe("DETAILS");
    expect(ref.current).toHaveClass("custom");
    expect(ref.current).toHaveAttribute("id", "faq");
    expect(ref.current).not.toHaveAttribute("open");
    expect(screen.getByText("Content")).not.toBeVisible();
  });

  it("opens and closes through its summary and emits toggle events", async () => {
    const onToggle = vi.fn();
    render(
      <WelkAccordion title="Details" onToggle={onToggle}>
        Content
      </WelkAccordion>,
    );
    const user = userEvent.setup();
    await user.click(screen.getByText("Details"));
    expect(screen.getByText("Content")).toBeVisible();
    await waitFor(() => expect(onToggle).toHaveBeenCalled());
    await user.click(screen.getByText("Details"));
    expect(screen.getByText("Content")).not.toBeVisible();
  });

  it("supports an initially open disclosure", () => {
    render(
      <WelkAccordion title="Details" open>
        Content
      </WelkAccordion>,
    );
    expect(screen.getByText("Content")).toBeVisible();
  });
});
