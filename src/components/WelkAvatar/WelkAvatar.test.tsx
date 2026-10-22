import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { WelkAvatar } from "./WelkAvatar";
import maleUser from "../../../assets/icons/person/male_user.png";
import femaleUser from "../../../assets/icons/person/female_user.png";
import maleAdmin from "../../../assets/icons/person/male_admin.png";
import femaleAdmin from "../../../assets/icons/person/female_admin.png";
import styles from "./WelkAvatar.module.css";

describe("WelkAvatar", () => {
  it("only enables hover growth when requested", () => {
    const { rerender } = render(<WelkAvatar alt="Profile" />);
    const avatar = screen.getByRole("img");
    expect(avatar).not.toHaveClass(styles.growOnHover);
    rerender(<WelkAvatar alt="Profile" growOnHover />);
    expect(avatar).toHaveClass(styles.growOnHover);
    expect(avatar).not.toHaveAttribute("growOnHover");
    rerender(<WelkAvatar alt="Profile" growOnHover={false} />);
    expect(avatar).not.toHaveClass(styles.growOnHover);
  });
  it("applies the background color without forwarding a color attribute", () => {
    render(<WelkAvatar alt="Profile" color="#82caff" style={{ margin: 4 }} />);
    const avatar = screen.getByRole("img");
    expect(avatar).toHaveStyle({ backgroundColor: "#82caff", margin: "4px" });
    expect(avatar).not.toHaveAttribute("color");
  });

  it("allows an explicit style to override the color prop", () => {
    render(
      <WelkAvatar
        alt="Profile"
        color="red"
        style={{ backgroundColor: "blue" }}
      />,
    );
    expect(screen.getByRole("img")).toHaveStyle({
      backgroundColor: "rgb(0, 0, 255)",
    });
  });

  it.each([
    ["user", maleUser],
    ["male-user", maleUser],
    ["female-user", femaleUser],
    ["male-admin", maleAdmin],
    ["female-admin", femaleAdmin],
  ] as const)("renders the %s portrait", (variant, source) => {
    const { container } = render(
      <WelkAvatar alt="Profile" variant={variant} />,
    );
    expect(screen.getByRole("img", { name: "Profile" })).toBeInTheDocument();
    expect(container.querySelector("img")).toHaveAttribute("src", source);
    expect(container.querySelector("img")).toHaveAttribute("alt", "");
  });

  it("defaults to the user portrait and forwards refs and attributes", () => {
    const ref = createRef<HTMLSpanElement>();
    const { container } = render(
      <WelkAvatar alt="Profile" ref={ref} className="custom" title="Hero" />,
    );
    expect(ref.current).toBe(screen.getByRole("img"));
    expect(ref.current).toHaveClass("custom", styles.md);
    expect(ref.current).toHaveAttribute("title", "Hero");
    expect(container.querySelector("img")).toHaveAttribute("src", maleUser);
  });

  it("prioritizes a custom image over icon and variant", () => {
    const { container } = render(
      <WelkAvatar
        alt="Hero"
        src="/hero.jpg"
        icon={<svg data-testid="custom-icon" />}
        variant="female-admin"
      />,
    );
    expect(container.querySelector("img")).toHaveAttribute("src", "/hero.jpg");
    expect(screen.queryByTestId("custom-icon")).not.toBeInTheDocument();
  });

  it("renders custom icons without duplicate accessible names", () => {
    const { container } = render(
      <WelkAvatar alt="Favorite" icon={<svg data-testid="custom-icon" />} />,
    );
    expect(screen.getAllByRole("img")).toHaveLength(1);
    expect(screen.getByTestId("custom-icon").parentElement).toHaveAttribute(
      "aria-hidden",
      "true",
    );
    expect(container.querySelector("img")).toBeNull();
  });

  it.each(["sm", "md", "lg"] as const)("supports %s size", (size) => {
    render(<WelkAvatar alt="Profile" size={size} />);
    expect(screen.getByRole("img")).toHaveClass(styles[size]);
  });
});
