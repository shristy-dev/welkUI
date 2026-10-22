"use client";

import { forwardRef, useId } from "react";
import { cn } from "../../utils";
import styles from "./WelkSwitch.module.css";
import type { WelkSwitchProps } from "./WelkSwitch.types";

export const WelkSwitch = forwardRef<HTMLInputElement, WelkSwitchProps>(
  function WelkSwitch(
    { label, id, className, onChange, onCheckedChange, ...props },
    ref,
  ) {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    return (
      <label htmlFor={inputId} className={styles.label}>
        <input
          {...props}
          ref={ref}
          id={inputId}
          type="checkbox"
          role="switch"
          className={cn(styles.input, className)}
          onChange={(event) => {
            onCheckedChange?.(event.currentTarget.checked);
            onChange?.(event);
          }}
        />
        <span>{label}</span>
      </label>
    );
  },
);
