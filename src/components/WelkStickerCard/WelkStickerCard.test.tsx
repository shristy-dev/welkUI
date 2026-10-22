import { createRef } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { WelkStickerCard } from "./WelkStickerCard";

const props = {
  title: "Hero mission",
  subtitle: "Start an adventure",
  sticker: { src: "/hero.png", alt: "Hero" },
};

describe("WelkStickerCard", () => {
  it("preserves card semantics, native props and the forwarded ref", async () => {
    const user = userEvent.setup();
    const click = vi.fn();
    const ref = createRef<HTMLButtonElement>();
    render(
      <WelkStickerCard {...props} ref={ref} onClick={click} name="mission" />,
    );
    const card = screen.getByRole("button", { name: "Hero mission" });
    expect(ref.current).toBe(card);
    expect(card).toHaveAccessibleDescription("Start an adventure");
    expect(card).toHaveAttribute("type", "button");
    expect(card).toHaveAttribute("name", "mission");
    await user.click(card);
    await user.keyboard("{Enter}");
    expect(click).toHaveBeenCalledTimes(2);
  });

  it("reuses the sticker outline, load animation and fallback", () => {
    const { container } = render(
      <WelkStickerCard
        {...props}
        sticker={{
          ...props.sticker,
          fallbackSrc: "/fallback.png",
          outlineThickness: 8,
          outlineColor: "yellow",
        }}
      />,
    );
    const image = container.querySelector("img")!;
    expect(image).toHaveAttribute("alt", "");
    expect(image.closest('[aria-hidden="true"]')).not.toBeNull();
    expect(container.querySelector("feMorphology")).toHaveAttribute(
      "radius",
      "8",
    );
    fireEvent.error(image);
    expect(image).toHaveAttribute("src", "/fallback.png");
    fireEvent.load(image);
    expect(image.parentElement?.className).toContain("stuck");
  });

  it("disables interaction", async () => {
    const user = userEvent.setup();
    const click = vi.fn();
    render(<WelkStickerCard {...props} disabled onClick={click} />);
    await user.click(screen.getByRole("button"));
    expect(click).not.toHaveBeenCalled();
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("applies hover growth to the joined wrapper, not the card or sticker alone", () => {
    const { rerender, container } = render(
      <WelkStickerCard
        {...props}
        sticker={{ ...props.sticker, elevateOnHover: true }}
      />,
    );
    const card = screen.getByRole("button");
    expect(card.parentElement?.className).toContain("growOnHover");
    expect(card.className).not.toContain("growOnHover");
    const image = container.querySelector("img")!;
    fireEvent.load(image);
    expect(image.parentElement?.className).not.toContain("elevateOnHover");
    rerender(<WelkStickerCard {...props} growOnHover={false} />);
    expect(card.parentElement?.className).not.toContain("growOnHover");
    rerender(<WelkStickerCard {...props} disabled />);
    expect(card.parentElement?.className).not.toContain("growOnHover");
  });
});
