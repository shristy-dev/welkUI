import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { WelkBreadCrumbs } from "./WelkBreadCrumbs";

describe("WelkBreadCrumbs", () => {
  it("renders ordered navigation with a single current-page item and hidden separators", () => {
    render(
      <WelkBreadCrumbs
        items={[
          { label: "Home", href: "#home" },
          { label: "Heroes", href: "#heroes" },
          { label: "Superman" },
        ]}
      />,
    );
    expect(
      screen.getByRole("navigation", { name: "Breadcrumb" }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute(
      "href",
      "#home",
    );
    expect(screen.getByText("Superman")).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: "Heroes" })).not.toHaveAttribute(
      "aria-current",
    );
    for (const separator of screen.getAllByText("/"))
      expect(separator).toHaveAttribute("aria-hidden", "true");
  });

  it("forwards nav refs/attributes and native link props with keyboard access", async () => {
    const user = userEvent.setup();
    const ref = createRef<HTMLElement>();
    const click = vi.fn((event) => event.preventDefault());
    render(
      <WelkBreadCrumbs
        ref={ref}
        aria-label="Mission path"
        className="custom"
        separator=">"
        items={[
          { label: "Home", href: "#home", onClick: click },
          { label: "Mission", href: "#mission", title: "Current mission" },
        ]}
      />,
    );
    expect(ref.current).toBe(
      screen.getByRole("navigation", { name: "Mission path" }),
    );
    expect(ref.current).toHaveClass("custom");
    await user.tab();
    expect(screen.getByRole("link", { name: "Home" })).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(click).toHaveBeenCalledOnce();
    expect(screen.getByRole("link", { name: "Mission" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByText(">")).toHaveAttribute("aria-hidden", "true");
  });

  it("supports single-item and empty trails", () => {
    const { rerender } = render(
      <WelkBreadCrumbs items={[{ label: "Home" }]} />,
    );
    expect(screen.getByText("Home")).toHaveAttribute("aria-current", "page");
    expect(screen.queryByText("/")).not.toBeInTheDocument();
    rerender(<WelkBreadCrumbs items={[]} />);
    expect(screen.queryByRole("listitem")).not.toBeInTheDocument();
  });
});
