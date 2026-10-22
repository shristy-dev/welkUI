import { createRef } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import defaultFallback from "../../../assets/images/comic_bg_02.jpg";
import { WelkImage } from "./WelkImage";
import styles from "./WelkImage.module.css";

describe("WelkImage", () => {
  it("forwards the ref, accessible name, styling and native image attributes", () => {
    const ref = createRef<HTMLImageElement>();
    const onLoad = vi.fn();
    render(
      <WelkImage
        ref={ref}
        src="/hero.jpg"
        alt="Our hero"
        width={320}
        height={200}
        loading="lazy"
        className="custom"
        style={{ objectFit: "contain" }}
        onLoad={onLoad}
      />,
    );
    const image = screen.getByRole("img", { name: "Our hero" });
    expect(ref.current).toBe(image);
    expect(image).toHaveClass(styles.image, "custom");
    expect(image).toHaveAttribute("width", "320");
    expect(image).toHaveAttribute("height", "200");
    expect(image).toHaveAttribute("loading", "lazy");
    expect(image).toHaveStyle({ objectFit: "contain" });
    expect(image).not.toHaveAttribute("variant");
    fireEvent.load(image);
    expect(onLoad).toHaveBeenCalledOnce();
  });

  it("uses the bundled fallback by default after a network error", () => {
    render(<WelkImage src="https://example.com/hero.jpg" alt="Hero" />);
    const image = screen.getByRole("img");
    expect(image).toHaveAttribute("src", "https://example.com/hero.jpg");
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    fireEvent.error(image);
    expect(image).toHaveAttribute("src", defaultFallback);
    expect(image).toHaveAttribute("alt", "Hero");
    expect(screen.getByRole("status")).toHaveTextContent(
      "Unable to load image",
    );
  });

  it("uses a custom fallback without retry loops and reports both errors", () => {
    const onError = vi.fn();
    render(
      <WelkImage
        src="/missing.jpg"
        alt="Hero"
        variant="network"
        fallbackSrc="/fallback.jpg"
        srcSet="/hero-small.jpg 320w, /hero-large.jpg 640w"
        sizes="100vw"
        onError={onError}
      />,
    );
    const image = screen.getByRole("img");
    fireEvent.error(image);
    expect(image).toHaveAttribute("src", "/fallback.jpg");
    expect(image).not.toHaveAttribute("srcset");
    expect(image).not.toHaveAttribute("sizes");
    fireEvent.error(image);
    expect(image).toHaveAttribute("src", "/fallback.jpg");
    expect(onError).toHaveBeenCalledTimes(2);
    expect(screen.getAllByRole("status")).toHaveLength(1);
    expect(image).not.toHaveAttribute("fallbackSrc");
  });

  it("keeps asset errors native and calls the error handler", () => {
    const onError = vi.fn();
    render(
      <WelkImage
        src="/local.jpg"
        alt="Hero"
        variant="asset"
        onError={onError}
      />,
    );
    fireEvent.error(screen.getByRole("img"));
    expect(screen.getByRole("img")).toHaveAttribute("src", "/local.jpg");
    expect(onError).toHaveBeenCalledOnce();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("retries new sources and previously failed sources when props change", () => {
    const { rerender } = render(<WelkImage src="/first.jpg" alt="Hero" />);
    fireEvent.error(screen.getByRole("img"));
    rerender(<WelkImage src="/second.jpg" alt="Hero" />);
    expect(screen.getByRole("img")).toHaveAttribute("src", "/second.jpg");
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    rerender(<WelkImage src="/first.jpg" alt="Hero" />);
    expect(screen.getByRole("img")).toHaveAttribute("src", "/first.jpg");
  });

  it("resets fallback state when responsive sources, fallback or variant change", () => {
    const { rerender } = render(<WelkImage src="/hero.jpg" alt="Hero" />);
    fireEvent.error(screen.getByRole("img"));
    rerender(<WelkImage src="/hero.jpg" alt="Hero" srcSet="/large.jpg 2x" />);
    expect(screen.getByRole("img")).toHaveAttribute("srcset", "/large.jpg 2x");
    fireEvent.error(screen.getByRole("img"));
    rerender(<WelkImage src="/hero.jpg" alt="Hero" fallbackSrc="/new.jpg" />);
    fireEvent.error(screen.getByRole("img"));
    expect(screen.getByRole("img")).toHaveAttribute("src", "/new.jpg");
    rerender(<WelkImage src="/hero.jpg" alt="Hero" variant="asset" />);
    expect(screen.getByRole("img")).toHaveAttribute("src", "/hero.jpg");
  });

  it("supports decorative images with an empty alt", () => {
    const { container } = render(
      <WelkImage src="/art.jpg" alt="" variant="asset" />,
    );
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(container.querySelector("img")).toHaveAttribute("alt", "");
  });
});
