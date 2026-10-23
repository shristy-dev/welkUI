import { createRef } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { WelkMenu } from "./WelkMenu";

const items = [
  { title: "Home", route: "#home" },
  {
    title: "Heroes",
    route: "#heroes",
    children: [
      { title: "Superman", route: "#superman" },
      {
        title: "Batman",
        route: "#batman",
        children: [{ title: "Gotham", route: "#gotham" }],
      },
    ],
  },
];

describe("WelkMenu", () => {
  it("toggles the whole menu with an accessible icon button and Escape", async () => {
    const user = userEvent.setup();
    const { rerender } = render(<WelkMenu items={items} collapsible />);
    const toggle = screen.getByRole("button", { name: "Collapse menu" });
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    await user.click(toggle);
    expect(
      screen.queryByRole("link", { name: "Home" }),
    ).not.toBeInTheDocument();
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    const content = document.getElementById(
      toggle.getAttribute("aria-controls")!,
    );
    expect(content).toHaveAttribute("inert");
    expect(content).toHaveAttribute("aria-hidden", "true");
    await user.click(toggle);
    expect(content).not.toHaveAttribute("inert");
    screen.getByRole("link", { name: "Home" }).focus();
    await user.keyboard("{Escape}");
    expect(toggle).toHaveFocus();
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    rerender(<WelkMenu items={items} />);
    expect(screen.getByRole("link", { name: "Home" })).toBeVisible();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
  it("renders flat native navigation links with forward icons and current route", () => {
    const ref = createRef<HTMLElement>();
    render(
      <WelkMenu
        ref={ref}
        items={items}
        activeRoute="#home"
        aria-label="Hero navigation"
        className="custom"
      />,
    );
    expect(ref.current).toBe(
      screen.getByRole("navigation", { name: "Hero navigation" }),
    );
    expect(ref.current).toHaveClass("custom");
    expect(screen.getAllByRole("link")).toHaveLength(2);
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: "Heroes" })).toHaveAttribute(
      "href",
      "#heroes",
    );
    expect(screen.queryByText("Superman")).not.toBeInTheDocument();
  });

  it("opens recursive child lists and retains parent routes", async () => {
    const user = userEvent.setup();
    render(<WelkMenu items={items} variant="nested" />);
    await user.click(screen.getByText("Heroes"));
    expect(screen.getByRole("link", { name: "Go to Heroes" })).toHaveAttribute(
      "href",
      "#heroes",
    );
    expect(screen.getByRole("link", { name: "Superman" })).toBeVisible();
    await user.click(screen.getByText("Batman"));
    expect(screen.getByRole("link", { name: "Gotham" })).toBeVisible();
    await user.click(screen.getByRole("link", { name: "Gotham" }));
    expect(screen.getByText("Heroes").closest("details")).not.toHaveAttribute(
      "open",
    );
  });

  it("supports Escape closing the nearest level and restoring trigger focus", async () => {
    const user = userEvent.setup();
    render(<WelkMenu items={items} variant="nested" />);
    await user.click(screen.getByText("Heroes"));
    expect(screen.getByRole("link", { name: "Superman" })).toBeVisible();
    const batman = screen.getByText("Batman").closest("summary")!;
    await user.click(batman);
    const gotham = screen.getByRole("link", { name: "Gotham" });
    gotham.focus();
    await user.keyboard("{Escape}");
    expect(batman).toHaveFocus();
    expect(batman.closest("details")).not.toHaveAttribute("open");
    expect(screen.getByRole("link", { name: "Superman" })).toBeVisible();
    await user.keyboard("{Escape}");
    expect(screen.getByText("Heroes").closest("details")).not.toHaveAttribute(
      "open",
    );
  });

  it("dismisses on outside pointer or focus and handles empty children", async () => {
    const user = userEvent.setup();
    render(
      <>
        <WelkMenu
          items={[...items, { title: "About", route: "#about", children: [] }]}
          variant="nested"
        />
        <button>Outside</button>
      </>,
    );
    expect(screen.getByRole("link", { name: "About" })).toBeVisible();
    await user.click(screen.getByText("Heroes"));
    fireEvent.pointerDown(document.body);
    expect(screen.getByText("Heroes").closest("details")).not.toHaveAttribute(
      "open",
    );
    await user.click(screen.getByText("Heroes"));
    screen.getByRole("button", { name: "Outside" }).focus();
    expect(screen.getByText("Heroes").closest("details")).not.toHaveAttribute(
      "open",
    );
  });
});
