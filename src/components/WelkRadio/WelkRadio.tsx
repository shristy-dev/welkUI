"use client";

import { forwardRef, useId } from "react";
import { cn } from "../../utils";
import styles from "./WelkRadio.module.css";
import type { WelkRadioProps } from "./WelkRadio.types";

export const WelkRadio = forwardRef<HTMLInputElement, WelkRadioProps>(
  function WelkRadio({ label, id, className, ...props }, ref) {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    return (
      <label className={styles.label} htmlFor={inputId}>
        <input
          {...props}
          ref={ref}
          id={inputId}
          type="radio"
          className={cn(styles.input, className)}
        />
        <span>{label}</span>
      </label>
    );
  },
);
