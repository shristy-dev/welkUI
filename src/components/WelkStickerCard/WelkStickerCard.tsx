"use client";

import { forwardRef } from "react";
import { WelkCard } from "../WelkCard";
import { WelkSticker } from "../WelkSticker";
import { cn } from "../../utils";
import styles from "./WelkStickerCard.module.css";
import type { WelkStickerCardProps } from "./WelkStickerCard.types";

export const WelkStickerCard = forwardRef<
  HTMLButtonElement,
  WelkStickerCardProps
>(function WelkStickerCard(
  { sticker, className, disabled, growOnHover = true, ...props },
  ref,
) {
  return (
    <div
      className={cn(
        styles.root,
        growOnHover && !disabled && styles.growOnHover,
        disabled && styles.disabled,
      )}
    >
      <WelkCard
        {...props}
        ref={ref}
        disabled={disabled}
        growOnHover={false}
        className={cn(styles.card, className)}
      />
      <span className={styles.art} aria-hidden="true">
        <WelkSticker
          {...sticker}
          elevateOnHover={false}
          alt=""
          className={styles.image}
        />
      </span>
    </div>
  );
});
