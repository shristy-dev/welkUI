import { createRef } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { WelkSticker } from "./WelkSticker";
import styles from "./WelkSticker.module.css";

describe("WelkSticker", () => {
  it("only enables hover elevation when requested and loaded", () => {
    const { rerender } = render(<WelkSticker src="/hero.png" alt="Hero" />);
    const image = screen.getByRole("img");
    fireEvent.load(image);
    expect(image.parentElement).not.toHaveClass(styles.elevateOnHover);
    rerender(<WelkSticker src="/hero.png" alt="Hero" elevateOnHover />);
    expect(image.parentElement).toHaveClass(styles.elevateOnHover);
    expect(image).not.toHaveAttribute("elevateOnHover");
    rerender(<WelkSticker src="/hero.png" alt="Hero" elevateOnHover={false} />);
    expect(image.parentElement).not.toHaveClass(styles.elevateOnHover);
    rerender(<WelkSticker src="/new.png" alt="Hero" elevateOnHover />);
    expect(screen.getByRole("img").parentElement).not.toHaveClass(
      styles.elevateOnHover,
    );
  });
  it("updates outline thickness and color without forwarding them to the image", () => {
    const { container, rerender } = render(
      <WelkSticker
        src="/hero.png"
        alt="Hero"
        outlineThickness={10}
        outlineColor="#ffda57"
      />,
    );
    expect(container.querySelector("feMorphology")).toHaveAttribute(
      "radius",
      "10",
    );
    expect(container.querySelector("feFlood")).toHaveAttribute(
      "flood-color",
      "#ffda57",
    );
    expect(screen.getByRole("img").parentElement).toHaveStyle({
      padding: "14px",
    });
    expect(screen.getByRole("img")).not.toHaveAttribute("outlineThickness");
    expect(screen.getByRole("img")).not.toHaveAttribute("outlineColor");
    rerender(<WelkSticker src="/hero.png" alt="Hero" outlineThickness={0} />);
    expect(container.querySelector("feMorphology")).toHaveAttribute(
      "radius",
      "0",
    );
    expect(container.querySelector("feFlood")).toHaveAttribute(
      "flood-color",
      "white",
    );
  });

  it.each([-1, NaN, Infinity])(
    "rejects invalid outline thickness %s",
    (outlineThickness) => {
      expect(() =>
        render(
          <WelkSticker
            src="/hero.png"
            alt="Hero"
            outlineThickness={outlineThickness}
          />,
        ),
      ).toThrow(RangeError);
    },
  );
  it("tries a fallback once and animates after it loads", () => {
    const onError = vi.fn();
    render(
      <WelkSticker
        src="/missing.png"
        fallbackSrc="/comic.jpg"
        alt="Hero"
        onError={onError}
        srcSet="/missing-large.png 2x"
      />,
    );
    const image = screen.getByRole("img");
    fireEvent.error(image);
    expect(image).toHaveAttribute("src", "/comic.jpg");
    expect(image).not.toHaveAttribute("srcset");
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    fireEvent.load(image);
    expect(image.parentElement).toHaveClass(styles.stuck);
    expect(onError).toHaveBeenCalledOnce();
  });

  it("reports a failed fallback without retrying", () => {
    const onError = vi.fn();
    render(
      <WelkSticker
        src="/missing.png"
        fallbackSrc="/missing-backup.jpg"
        alt="Hero"
        onError={onError}
      />,
    );
    const image = screen.getByRole("img");
    fireEvent.error(image);
    fireEvent.error(image);
    expect(image).toHaveAttribute("src", "/missing-backup.jpg");
    expect(screen.getByRole("status")).toHaveTextContent(
      "Unable to load sticker",
    );
    expect(onError).toHaveBeenCalledTimes(2);
  });
  it("renders an accessible image, forwards native props/ref and defines a silhouette outline", () => {
    const ref = createRef<HTMLImageElement>();
    const { container } = render(
      <WelkSticker
        src="/hero.png"
        alt="Hero"
        ref={ref}
        width={160}
        height={160}
        loading="lazy"
        className="custom"
      />,
    );
    const image = screen.getByRole("img", { name: "Hero" });
    expect(ref.current).toBe(image);
    expect(image).toHaveClass(styles.image, "custom");
    expect(image).toHaveAttribute("width", "160");
    expect(image).toHaveAttribute("loading", "lazy");
    expect(container.querySelector("feMorphology")).toHaveAttribute(
      "radius",
      "6",
    );
    expect(container.querySelector("feFlood")).toHaveAttribute(
      "flood-color",
      "white",
    );
    expect(image.style.filter).toContain(container.querySelector("filter")!.id);
    expect(image.parentElement).not.toHaveClass(styles.stuck);
  });

  it("starts the sticking animation only after load and preserves callbacks", () => {
    const onLoad = vi.fn();
    render(<WelkSticker src="/hero.png" alt="Hero" onLoad={onLoad} />);
    fireEvent.load(screen.getByRole("img"));
    expect(screen.getByRole("img").parentElement).toHaveClass(styles.stuck);
    expect(onLoad).toHaveBeenCalledOnce();
  });

  it("resets the animation when its source changes", () => {
    const { rerender } = render(<WelkSticker src="/hero.png" alt="Hero" />);
    fireEvent.load(screen.getByRole("img"));
    rerender(<WelkSticker src="/new.png" alt="Hero" />);
    expect(screen.getByRole("img").parentElement).not.toHaveClass(styles.stuck);
    fireEvent.load(screen.getByRole("img"));
    expect(screen.getByRole("img").parentElement).toHaveClass(styles.stuck);
  });

  it("reports load failures visibly and through onError", () => {
    const onError = vi.fn();
    render(<WelkSticker src="/missing.png" alt="Hero" onError={onError} />);
    fireEvent.error(screen.getByRole("img"));
    expect(screen.getByRole("status")).toHaveTextContent(
      "Unable to load sticker",
    );
    expect(onError).toHaveBeenCalledOnce();
    expect(screen.getByRole("img").parentElement).not.toHaveClass(styles.stuck);
  });

  it("assigns each sticker a unique filter", () => {
    const { container } = render(
      <>
        <WelkSticker src="/one.png" alt="One" />
        <WelkSticker src="/two.png" alt="Two" />
      </>,
    );
    const filters = [...container.querySelectorAll("filter")];
    expect(filters[0].id).not.toBe(filters[1].id);
  });
});
