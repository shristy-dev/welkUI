"use client";

import {
  forwardRef,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { cn } from "../../utils";
import styles from "./WelkOTPInput.module.css";
import type { WelkOTPInputProps } from "./WelkOTPInput.types";

export const WelkOTPInput = forwardRef<HTMLInputElement, WelkOTPInputProps>(
  function WelkOTPInput(
    {
      label,
      length = 6,
      value,
      defaultValue = "",
      onValueChange,
      onComplete,
      id,
      className,
      autoComplete = "one-time-code",
      onSelect,
      ...props
    },
    ref,
  ) {
    if (!Number.isInteger(length) || length < 1)
      throw new RangeError("WelkOTPInput: length must be a positive integer.");
    const validate = (code: string) => {
      if (!/^\d*$/.test(code) || code.length > length)
        throw new RangeError(
          "WelkOTPInput: values must contain only digits and fit the configured length.",
        );
    };
    validate(defaultValue);
    if (value !== undefined) validate(value);
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const inputRef = useRef<HTMLInputElement>(null);
    useImperativeHandle(ref, () => inputRef.current!, []);
    const [internalValue, setInternalValue] = useState(defaultValue);
    const code = value ?? internalValue.slice(0, length);
    const [position, setPosition] = useState(code.length);

    useEffect(() => {
      const form = inputRef.current?.form;
      if (!form || value !== undefined) return;
      const reset = (event: Event) =>
        queueMicrotask(() => {
          if (!event.defaultPrevented) {
            setInternalValue(defaultValue);
            setPosition(defaultValue.length);
          }
        });
      form.addEventListener("reset", reset);
      return () => form.removeEventListener("reset", reset);
    }, [defaultValue, value]);

    const change = (next: string) => {
      if (value === undefined) setInternalValue(next);
      setPosition(next.length);
      if (next === code) return;
      onValueChange?.(next);
      if (next.length === length) onComplete?.(next);
    };

    return (
      <div className={cn(styles.field, className)}>
        <label className={styles.label} htmlFor={inputId}>
          {label}
        </label>
        <div className={styles.control}>
          <input
            {...props}
            ref={inputRef}
            id={inputId}
            className={styles.input}
            type="text"
            inputMode="numeric"
            autoComplete={autoComplete}
            pattern={`[0-9]{${length}}`}
            maxLength={length}
            value={code}
            aria-describedby={cn(`${inputId}-hint`, props["aria-describedby"])}
            onChange={(event) =>
              change(event.target.value.replace(/\D/g, "").slice(0, length))
            }
            onPaste={(event) => {
              props.onPaste?.(event);
              if (event.defaultPrevented || props.readOnly || props.disabled)
                return;
              event.preventDefault();
              const digits = event.clipboardData
                .getData("text")
                .replace(/\D/g, "");
              if (!digits) return;
              const start = event.currentTarget.selectionStart ?? code.length;
              const end = event.currentTarget.selectionEnd ?? start;
              const next = (
                code.slice(0, start) +
                digits +
                code.slice(end)
              ).slice(0, length);
              change(next);
            }}
            onSelect={(event) => {
              setPosition(event.currentTarget.selectionStart ?? code.length);
              onSelect?.(event);
            }}
          />
          <div
            className={cn(styles.slots, props.disabled && styles.disabled)}
            aria-hidden="true"
          >
            {Array.from({ length }, (_, index) => (
              <span
                key={index}
                className={cn(
                  styles.slot,
                  index === Math.min(position, length - 1) && styles.active,
                )}
              >
                {code[index] ?? ""}
              </span>
            ))}
          </div>
        </div>
        <span id={`${inputId}-hint`} className={styles.hint}>
          Enter {length} digits
        </span>
      </div>
    );
  },
);
