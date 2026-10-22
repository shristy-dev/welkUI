"use client";

import { forwardRef, useId } from "react";
import { WelkRadio } from "../WelkRadio";
import { cn } from "../../utils";
import styles from "./WelkRadioGroup.module.css";
import type { WelkRadioGroupProps } from "./WelkRadioGroup.types";

export const WelkRadioGroup = forwardRef<
  HTMLFieldSetElement,
  WelkRadioGroupProps
>(function WelkRadioGroup(
  {
    label,
    options,
    name,
    value,
    defaultValue,
    onValueChange,
    required,
    className,
    "aria-labelledby": labelledBy,
    ...props
  },
  ref,
) {
  const generatedId = useId();
  const groupName = name ?? generatedId;
  const legendId = `${generatedId}-legend`;

  return (
    <fieldset
      {...props}
      ref={ref}
      role="radiogroup"
      aria-labelledby={labelledBy ?? legendId}
      className={cn(styles.group, className)}
    >
      <legend id={legendId} className={styles.legend}>
        {label}
      </legend>
      <div className={styles.options}>
        {options.map((option) => (
          <WelkRadio
            key={option.value}
            label={option.label}
            name={groupName}
            value={option.value}
            disabled={option.disabled}
            required={required}
            checked={value === undefined ? undefined : value === option.value}
            defaultChecked={
              value === undefined ? defaultValue === option.value : undefined
            }
            onChange={(event) => onValueChange?.(event.target.value)}
          />
        ))}
      </div>
    </fieldset>
  );
});
