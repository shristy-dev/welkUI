"use client";

import { forwardRef } from "react";
import { cn } from "../../utils";
import styles from "./WelkDivider.module.css";
import type { WelkDividerProps } from "./WelkDivider.types";

export const WelkDivider = forwardRef<HTMLDivElement, WelkDividerProps>(
  function WelkDivider(
    {
      orientation = "horizontal",
      variant = "plain",
      thickness = 2,
      className,
      style,
      ...props
    },
    ref,
  ) {
    if (!Number.isFinite(thickness) || thickness <= 0) {
      throw new RangeError(
        "WelkDivider: thickness must be a positive finite number.",
      );
    }

    return (
      <div
        {...props}
        ref={ref}
        role="separator"
        aria-orientation={orientation}
        className={cn(styles.divider, styles[orientation], className)}
        style={{
          borderStyle: variant === "plain" ? "solid" : variant,
          ...(orientation === "horizontal"
            ? { borderTopWidth: thickness }
            : { borderLeftWidth: thickness }),
          ...style,
        }}
      />
    );
  },
);
