"use client";

import { forwardRef } from "react";
import { cn } from "../../utils";
import styles from "./WelkBadge.module.css";
import type { WelkBadgeProps } from "./WelkBadge.types";

export const WelkBadge = forwardRef<HTMLSpanElement, WelkBadgeProps>(
  function WelkBadge(
    { variant = "default", size = "md", className, ...props },
    ref,
  ) {
    return (
      <span
        {...props}
        ref={ref}
        className={cn(styles.badge, styles[variant], styles[size], className)}
      />
    );
  },
);
