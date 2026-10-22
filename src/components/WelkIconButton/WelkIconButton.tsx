"use client";

import { forwardRef } from "react";
import { cn } from "../../utils";
import styles from "./WelkIconButton.module.css";
import type { WelkIconButtonProps } from "./WelkIconButton.types";

export const WelkIconButton = forwardRef<
  HTMLButtonElement,
  WelkIconButtonProps
>(function WelkIconButton(
  { icon, label, variant = "default", type = "button", className, ...props },
  ref,
) {
  return (
    <button
      aria-label={variant === "default" ? label : undefined}
      {...props}
      ref={ref}
      type={type}
      className={cn(styles.button, styles[variant], className)}
    >
      <span className={styles.icon} aria-hidden="true">
        {icon}
      </span>
      {variant === "text" && <span className={styles.text}>{label}</span>}
    </button>
  );
});
