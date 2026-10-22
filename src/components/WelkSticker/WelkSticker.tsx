"use client";

import {
  forwardRef,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { cn } from "../../utils";
import styles from "./WelkSticker.module.css";
import type { WelkStickerProps } from "./WelkSticker.types";

const StickerImage = forwardRef<HTMLImageElement, WelkStickerProps>(
  function StickerImage(
    {
      src,
      alt,
      fallbackSrc,
      className,
      onLoad,
      onError,
      srcSet,
      sizes,
      outlineThickness = 6,
      outlineColor = "white",
      elevateOnHover = false,
      ...props
    },
    ref,
  ) {
    if (!Number.isFinite(outlineThickness) || outlineThickness < 0) {
      throw new RangeError(
        "WelkSticker: outlineThickness must be a non-negative finite number.",
      );
    }
    const filterId = `welk-sticker-${useId()}`;
    const imageRef = useRef<HTMLImageElement>(null);
    const [usingFallback, setUsingFallback] = useState(false);
    useImperativeHandle(ref, () => imageRef.current!, []);
    const [status, setStatus] = useState<"loading" | "loaded" | "error">(
      "loading",
    );

    useEffect(() => {
      const image = imageRef.current;
      if (image?.complete && image.naturalWidth > 0) setStatus("loaded");
    }, []);

    return (
      <span
        className={cn(
          styles.sticker,
          status === "loaded" && styles.stuck,
          elevateOnHover && status === "loaded" && styles.elevateOnHover,
        )}
        style={{ padding: outlineThickness + 4 }}
      >
        <svg
          className={styles.filters}
          aria-hidden="true"
          focusable="false"
          width="0"
          height="0"
        >
          <defs>
            <filter
              id={filterId}
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
              colorInterpolationFilters="sRGB"
            >
              <feMorphology
                in="SourceAlpha"
                operator="dilate"
                radius={outlineThickness}
                result="expanded"
              />
              <feFlood floodColor={outlineColor} result="white" />
              <feComposite
                in="white"
                in2="expanded"
                operator="in"
                result="outline"
              />
              <feMerge result="outlined">
                <feMergeNode in="outline" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
              <feDropShadow
                in="outlined"
                dx="2"
                dy="3"
                stdDeviation="1"
                floodColor="#242424"
                floodOpacity="0.4"
              />
            </filter>
          </defs>
        </svg>
        <img
          {...props}
          ref={imageRef}
          src={usingFallback ? fallbackSrc : src}
          srcSet={usingFallback ? undefined : srcSet}
          sizes={usingFallback ? undefined : sizes}
          alt={alt}
          className={cn(styles.image, className)}
          style={{ filter: `url("#${filterId}")`, ...props.style }}
          onLoad={(event) => {
            setStatus("loaded");
            onLoad?.(event);
          }}
          onError={(event) => {
            if (fallbackSrc && !usingFallback && fallbackSrc !== src) {
              setUsingFallback(true);
              setStatus("loading");
            } else {
              setStatus("error");
            }
            onError?.(event);
          }}
        />
        {status === "error" && (
          <span className={styles.error} role="status">
            Unable to load sticker
          </span>
        )}
      </span>
    );
  },
);

export const WelkSticker = forwardRef<HTMLImageElement, WelkStickerProps>(
  function WelkSticker(props, ref) {
    return (
      <StickerImage
        {...props}
        ref={ref}
        key={JSON.stringify([
          props.src,
          props.srcSet,
          props.sizes,
          props.fallbackSrc,
        ])}
      />
    );
  },
);
