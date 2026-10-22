"use client";

import { forwardRef, useId } from "react";
import { cn } from "../../utils";
import styles from "./WelkInput.module.css";
import type { WelkInputProps } from "./WelkInput.types";

export const WelkInput = forwardRef<HTMLInputElement, WelkInputProps>(
  function WelkInput(
    { label, id, type = "text", className, endAction, ...props },
    ref,
  ) {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    return (
      <div className={styles.field}>
        <label className={styles.label} htmlFor={inputId}>
          {label}
        </label>
        <div className={styles.control}>
          <input
            {...props}
            ref={ref}
            id={inputId}
            type={type}
            className={cn(
              styles.input,
              endAction && styles.withAction,
              className,
            )}
          />
          {endAction && (
            <button
              type="button"
              className={styles.action}
              aria-label={endAction.label}
              disabled={props.disabled || endAction.disabled}
              onClick={endAction.onClick}
            >
              <span className={styles.icon} aria-hidden="true">
                {endAction.icon}
              </span>
            </button>
          )}
        </div>
      </div>
    );
  },
);
