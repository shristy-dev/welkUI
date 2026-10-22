"use client";

import { forwardRef, useState } from "react";
import defaultFallback from "../../../assets/images/comic_bg_02.jpg";
import { cn } from "../../utils";
import styles from "./WelkImage.module.css";
import type { WelkImageProps } from "./WelkImage.types";

const ImageWithFallback = forwardRef<HTMLImageElement, WelkImageProps>(
  function ImageWithFallback(
    {
      src,
      alt,
      variant = "network",
      fallbackSrc = defaultFallback,
      srcSet,
      sizes,
      onError,
      className,
      ...props
    },
    ref,
  ) {
    const [failed, setFailed] = useState(false);
    const usingFallback = variant === "network" && failed;

    return (
      <span className={styles.frame}>
        <img
          {...props}
          ref={ref}
          alt={alt}
          src={usingFallback ? fallbackSrc : src}
          srcSet={usingFallback ? undefined : srcSet}
          sizes={usingFallback ? undefined : sizes}
          className={cn(styles.image, className)}
          onError={(event) => {
            if (variant === "network" && !failed) setFailed(true);
            onError?.(event);
          }}
        />
        {usingFallback && (
          <span className={styles.error} role="status">
            Unable to load image
          </span>
        )}
      </span>
    );
  },
);

export const WelkImage = forwardRef<HTMLImageElement, WelkImageProps>(
  function WelkImage(props, ref) {
    return (
      <ImageWithFallback
        {...props}
        ref={ref}
        key={JSON.stringify([
          props.src,
          props.srcSet,
          props.variant,
          props.fallbackSrc,
        ])}
      />
    );
  },
);
