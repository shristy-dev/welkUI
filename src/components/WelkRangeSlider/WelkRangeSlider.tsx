"use client";

import { forwardRef, useId } from "react";
import { cn } from "../../utils";
import styles from "./WelkRangeSlider.module.css";
import type { WelkRangeSliderProps } from "./WelkRangeSlider.types";

export const WelkRangeSlider = forwardRef<
  HTMLInputElement,
  WelkRangeSliderProps
>(function WelkRangeSlider(
  {
    label,
    id,
    className,
    min = 0,
    max = 100,
    step = 1,
    onChange,
    onValueChange,
    ...props
  },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={inputId}>
        {label}
      </label>
      <input
        {...props}
        ref={ref}
        id={inputId}
        type="range"
        min={min}
        max={max}
        step={step}
        className={cn(styles.slider, className)}
        onChange={(event) => {
          onChange?.(event);
          onValueChange?.(event.currentTarget.valueAsNumber);
        }}
      />
    </div>
  );
});
