import { createRef, useState } from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { WelkTabs } from "./WelkTabs";
import styles from "./WelkTabs.module.css";

const items = [
  { label: "Overview", value: "overview", content: "Overview content" },
  { label: "Details", value: "details", content: "Details content" },
  {
    label: "History",
    value: "history",
    content: "History content",
    disabled: true,
  },
];

describe("WelkTabs", () => {
  it.each(["horizontal", "vertical"] as const)(
    "supports the withBg variant with %s tabs without changing selection behavior",
    async (orientation) => {
      const ref = createRef<HTMLDivElement>();
      render(
        <WelkTabs
          ref={ref}
          label="Project sections"
          items={items}
          variant="withBg"
          orientation={orientation}
        />,
      );
      expect(ref.current).toHaveClass(styles.withBg, styles[orientation]);
      expect(ref.current).not.toHaveAttribute("variant");
      const user = userEvent.setup();
      await user.tab();
      await user.keyboard(
        orientation === "horizontal" ? "{ArrowRight}" : "{ArrowDown}",
      );
      expect(screen.getByRole("tab", { name: "Details" })).toHaveFocus();
      expect(screen.getByRole("tabpanel", { name: "Details" })).toBeVisible();
      expect(screen.getByRole("tab", { name: "History" })).toBeDisabled();
    },
  );

  it("labels the tablist and forwards refs and attributes", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <WelkTabs ref={ref} label="Project sections" items={items} id="tabs" />,
    );
    const tablist = screen.getByRole("tablist", { name: "Project sections" });
    expect(ref.current).toHaveAttribute("id", "tabs");
    expect(within(tablist).getAllByRole("tab")).toHaveLength(3);
    const panels = screen.getAllByRole("tabpanel", { hidden: true });
    expect(panels[0]).toBeVisible();
    expect(panels[1]).not.toBeVisible();
  });

  it("supports uncontrolled selection and reports changes", async () => {
    const onValueChange = vi.fn();
    render(
      <WelkTabs
        label="Project sections"
        items={items}
        defaultValue="details"
        onValueChange={onValueChange}
      />,
    );
    const user = userEvent.setup();
    expect(screen.getByRole("tab", { name: "Details" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await user.click(screen.getByRole("tab", { name: "Overview" }));
    const panels = screen.getAllByRole("tabpanel", { hidden: true });
    expect(panels[0]).toBeVisible();
    expect(panels[1]).not.toBeVisible();
    expect(onValueChange).toHaveBeenCalledWith("overview");
  });

  it("supports controlled selection", async () => {
    function Controlled() {
      const [value, setValue] = useState("overview");
      return (
        <WelkTabs
          label="Project sections"
          items={items}
          value={value}
          onValueChange={setValue}
        />
      );
    }
    render(<Controlled />);
    await userEvent.setup().click(screen.getByRole("tab", { name: "Details" }));
    expect(screen.getByRole("tab", { name: "Details" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  it("moves focus and selection with arrow keys, skipping disabled tabs", async () => {
    render(<WelkTabs label="Project sections" items={items} />);
    const user = userEvent.setup();
    await user.tab();
    expect(screen.getByRole("tab", { name: "Overview" })).toHaveFocus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Details" })).toHaveFocus();
    expect(screen.getByRole("tab", { name: "Details" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Overview" })).toHaveFocus();
    await user.keyboard("{End}");
    expect(screen.getByRole("tab", { name: "Details" })).toHaveFocus();
  });

  it("uses vertical arrow keys when the orientation is vertical", async () => {
    render(
      <WelkTabs
        label="Project sections"
        items={items}
        orientation="vertical"
      />,
    );
    const user = userEvent.setup();
    await user.tab();
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("tab", { name: "Details" })).toHaveFocus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Details" })).toHaveFocus();
  });
});
