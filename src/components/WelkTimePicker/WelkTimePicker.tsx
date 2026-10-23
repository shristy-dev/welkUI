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
import styles from "./WelkTimePicker.module.css";
import type { WelkTimePickerProps } from "./WelkTimePicker.types";

const pad = (value: number) => String(value).padStart(2, "0");
const valid = (value: string, seconds: boolean) =>
  (seconds
    ? /^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/
    : /^([01]\d|2[0-3]):[0-5]\d$/
  ).test(value);

function TimeWheel({
  label,
  count,
  value,
  disabled,
  onChange,
}: {
  label: string;
  count: number;
  value: number;
  disabled: boolean;
  onChange: (value: number) => void;
}) {
  const id = useId();
  const wheelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wheel = wheelRef.current;
    const option = wheel?.querySelector<HTMLElement>(`[data-value="${value}"]`);
    if (wheel && option)
      wheel.scrollTop =
        option.offsetTop - (wheel.clientHeight - option.clientHeight) / 2;
  }, [value]);

  return (
    <div className={styles.column}>
      <span id={id} className={styles.wheelLabel}>
        {label}
      </span>
      <div
        ref={wheelRef}
        className={styles.wheel}
        role="listbox"
        tabIndex={disabled ? -1 : 0}
        aria-labelledby={id}
        aria-disabled={disabled}
        aria-activedescendant={`${id}-${value}`}
        onKeyDown={(event) => {
          if (disabled) return;
          let next = value;
          if (event.key === "ArrowDown") next = (value + 1) % count;
          else if (event.key === "ArrowUp") next = (value - 1 + count) % count;
          else if (event.key === "Home") next = 0;
          else if (event.key === "End") next = count - 1;
          else return;
          event.preventDefault();
          onChange(next);
        }}
      >
        {Array.from({ length: count }, (_, index) => (
          <button
            key={index}
            id={`${id}-${index}`}
            data-value={index}
            type="button"
            role="option"
            tabIndex={-1}
            aria-selected={index === value}
            disabled={disabled}
            className={styles.option}
            onClick={() => {
              onChange(index);
              wheelRef.current?.focus({ preventScroll: true });
            }}
          >
            {pad(index)}
          </button>
        ))}
      </div>
    </div>
  );
}

export const WelkTimePicker = forwardRef<HTMLInputElement, WelkTimePickerProps>(
  function WelkTimePicker(
    {
      label,
      value,
      defaultValue = "",
      onValueChange,
      showSeconds = false,
      name,
      id,
      disabled = false,
      required = false,
      className,
    },
    ref,
  ) {
    for (const time of [value, defaultValue]) {
      if (time && !valid(time, showSeconds))
        throw new RangeError(
          `WelkTimePicker: use ${showSeconds ? "HH:mm:ss" : "HH:mm"} in 24-hour format.`,
        );
    }
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const inputRef = useRef<HTMLInputElement>(null);
    useImperativeHandle(ref, () => inputRef.current!, []);
    const [internal, setInternal] = useState(defaultValue);
    const selected = value ?? internal;
    const [draft, setDraft] = useState({
      text: selected,
      forValue: selected,
      seconds: showSeconds,
    });
    const text =
      draft.forValue === selected && draft.seconds === showSeconds
        ? draft.text
        : selected;
    const format = showSeconds ? "HH:mm:ss" : "HH:mm";
    const error =
      text && !valid(text, showSeconds)
        ? `Enter a valid time in ${format} format (24-hour).`
        : "";
    const parts = valid(selected, showSeconds)
      ? selected.split(":").map(Number)
      : [0, 0, 0];

    useEffect(() => {
      inputRef.current?.setCustomValidity(error);
    }, [error]);

    useEffect(() => {
      const form = inputRef.current?.form;
      if (!form || value !== undefined) return;
      const reset = (event: Event) =>
        queueMicrotask(() => {
          if (!event.defaultPrevented) {
            setInternal(defaultValue);
            setDraft({
              text: defaultValue,
              forValue: defaultValue,
              seconds: showSeconds,
            });
          }
        });
      form.addEventListener("reset", reset);
      return () => form.removeEventListener("reset", reset);
    }, [value, defaultValue, showSeconds]);

    const change = (next: string) => {
      setDraft({ text: next, forValue: selected, seconds: showSeconds });
      if (value === undefined) setInternal(next);
      onValueChange?.(next);
    };
    const selectPart = (index: number, number: number) => {
      const next = [parts[0], parts[1], parts[2] ?? 0];
      next[index] = number;
      change(
        next
          .slice(0, showSeconds ? 3 : 2)
          .map(pad)
          .join(":"),
      );
    };

    return (
      <div className={cn(styles.picker, className)}>
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
        <input
          ref={inputRef}
          id={inputId}
          type="text"
          name={name}
          className={styles.input}
          value={text}
          placeholder={format}
          disabled={disabled}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={`${inputId}-hint${error ? ` ${inputId}-error` : ""}`}
          onChange={(event) => {
            const next = event.target.value;
            setDraft({ text: next, forValue: selected, seconds: showSeconds });
            if (!next || valid(next, showSeconds)) change(next);
          }}
        />
        <span id={`${inputId}-hint`} className={styles.hint}>
          {format} · 24-hour
        </span>
        {error && (
          <span id={`${inputId}-error`} role="alert" className={styles.error}>
            {error}
          </span>
        )}
        <div className={styles.wheels}>
          <TimeWheel
            label="Hours"
            count={24}
            value={parts[0]}
            disabled={disabled}
            onChange={(next) => selectPart(0, next)}
          />
          <TimeWheel
            label="Minutes"
            count={60}
            value={parts[1]}
            disabled={disabled}
            onChange={(next) => selectPart(1, next)}
          />
          {showSeconds && (
            <TimeWheel
              label="Seconds"
              count={60}
              value={parts[2] ?? 0}
              disabled={disabled}
              onChange={(next) => selectPart(2, next)}
            />
          )}
        </div>
      </div>
    );
  },
);
