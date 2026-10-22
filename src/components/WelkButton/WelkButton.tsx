"use client";

import { forwardRef } from "react";
import { cn } from "../../utils";
import styles from "./WelkButton.module.css";
import type { WelkButtonProps } from "./WelkButton.types";

export const WelkButton = forwardRef<HTMLButtonElement, WelkButtonProps>(
  function WelkButton(
    { variant = "primary", size = "md", type = "button", className, ...props },
    ref,
  ) {
    return (
      <button
        {...props}
        ref={ref}
        type={type}
        className={cn(styles.button, styles[variant], styles[size], className)}
      />
    );
  },
);
