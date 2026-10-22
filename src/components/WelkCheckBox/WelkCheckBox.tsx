"use client";

import { forwardRef, useId } from "react";
import { cn } from "../../utils";
import styles from "./WelkCheckBox.module.css";
import type { WelkCheckBoxProps } from "./WelkCheckBox.types";

export const WelkCheckBox = forwardRef<HTMLInputElement, WelkCheckBoxProps>(
  function WelkCheckBox({ label, id, className, ...props }, ref) {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    return (
      <label className={styles.label} htmlFor={inputId}>
        <input
          {...props}
          ref={ref}
          id={inputId}
          type="checkbox"
          className={cn(styles.input, className)}
        />
        <span>{label}</span>
      </label>
    );
  },
);
