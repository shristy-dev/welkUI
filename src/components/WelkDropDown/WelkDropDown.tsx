"use client";

import { forwardRef, useEffect, useId, useRef, useState } from "react";
import { cn } from "../../utils";
import styles from "./WelkDropDown.module.css";
import type { WelkDropDownProps } from "./WelkDropDown.types";

export const WelkDropDown = forwardRef<HTMLSelectElement, WelkDropDownProps>(
  function WelkDropDown(
    {
      label,
      options,
      value,
      defaultValue = "",
      onValueChange,
      searchable = false,
      placeholder = "Select an option",
      name,
      id,
      disabled = false,
      required = false,
      className,
    },
    ref,
  ) {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const listId = `${inputId}-options`;
    const rootRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const selectRef = useRef<HTMLSelectElement | null>(null);
    const [internal, setInternal] = useState(defaultValue);
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [active, setActive] = useState(-1);
    const selected = value ?? internal;
    const selectedLabel =
      options.find((option) => option.value === selected)?.label ?? "";
    const filtered = options.filter((option) =>
      option.label.toLocaleLowerCase().includes(query.toLocaleLowerCase()),
    );
    const expanded = searchable && open && !disabled;
    const activeOption = expanded ? filtered[active] : undefined;

    useEffect(() => {
      if (!expanded) return;
      const dismiss = (event: PointerEvent) => {
        if (
          event.target instanceof Node &&
          !rootRef.current?.contains(event.target)
        ) {
          setOpen(false);
          setQuery("");
          setActive(-1);
        }
      };
      document.addEventListener("pointerdown", dismiss);
      return () => document.removeEventListener("pointerdown", dismiss);
    }, [expanded]);

    useEffect(() => {
      const form = selectRef.current?.form;
      if (!form) return;
      const reset = (event: Event) =>
        queueMicrotask(() => {
          if (event.defaultPrevented) return;
          if (value === undefined) setInternal(defaultValue);
          setOpen(false);
          setQuery("");
          setActive(-1);
        });
      form.addEventListener("reset", reset);
      return () => form.removeEventListener("reset", reset);
    }, [value, defaultValue]);

    useEffect(() => {
      if (expanded && activeOption) {
        rootRef.current
          ?.querySelector<HTMLElement>(`[data-index="${active}"]`)
          ?.scrollIntoView?.({ block: "nearest" });
      }
    }, [expanded, active, activeOption]);

    const close = () => {
      setOpen(false);
      setQuery("");
      setActive(-1);
    };
    const choose = (next: string) => {
      if (value === undefined) setInternal(next);
      onValueChange?.(next);
      close();
    };
    const move = (direction: number, edge = false) => {
      const enabled = filtered
        .map((option, index) => (option.disabled ? -1 : index))
        .filter((index) => index !== -1);
      setOpen(true);
      if (!enabled.length) {
        setActive(-1);
        return;
      }
      const current = enabled.indexOf(active);
      setActive(
        edge
          ? enabled[direction > 0 ? 0 : enabled.length - 1]
          : enabled[
              current < 0
                ? direction > 0
                  ? 0
                  : enabled.length - 1
                : (current + direction + enabled.length) % enabled.length
            ],
      );
    };

    return (
      <div
        ref={rootRef}
        className={cn(styles.root, className)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) close();
        }}
      >
        <label
          id={`${inputId}-label`}
          className={styles.label}
          htmlFor={inputId}
        >
          {label}
        </label>
        <select
          ref={(node) => {
            selectRef.current = node;
            if (typeof ref === "function") return ref(node);
            if (ref) ref.current = node;
          }}
          id={searchable ? `${inputId}-native` : inputId}
          aria-label={searchable ? "Selected value" : undefined}
          aria-hidden={searchable || undefined}
          tabIndex={searchable ? -1 : undefined}
          className={searchable ? styles.native : styles.control}
          name={name}
          value={selected}
          disabled={disabled}
          required={required}
          onInvalid={() => {
            if (searchable) inputRef.current?.focus();
          }}
          onChange={(event) => choose(event.target.value)}
        >
          <option value="" disabled={required}>
            {placeholder}
          </option>
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        {searchable && (
          <>
            <div className={styles.field}>
              <input
                ref={inputRef}
                id={inputId}
                className={styles.control}
                role="combobox"
                autoComplete="off"
                aria-autocomplete="list"
                aria-expanded={expanded}
                aria-controls={expanded ? listId : undefined}
                aria-activedescendant={
                  activeOption ? `${listId}-${active}` : undefined
                }
                aria-required={required}
                placeholder={placeholder}
                disabled={disabled}
                value={expanded ? query : selectedLabel}
                onFocus={() => setOpen(true)}
                onClick={() => setOpen(true)}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setOpen(true);
                  setActive(-1);
                }}
                onKeyDown={(event) => {
                  if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                    event.preventDefault();
                    move(event.key === "ArrowDown" ? 1 : -1);
                  } else if (
                    expanded &&
                    (event.key === "Home" || event.key === "End")
                  ) {
                    event.preventDefault();
                    move(event.key === "Home" ? 1 : -1, true);
                  } else if (expanded && event.key === "Enter") {
                    event.preventDefault();
                    if (activeOption && !activeOption.disabled)
                      choose(activeOption.value);
                  } else if (event.key === "Escape" && expanded) {
                    event.preventDefault();
                    event.stopPropagation();
                    close();
                  } else if (event.key === "Tab") close();
                }}
              />
              <span className={styles.arrow} aria-hidden="true">
                ▼
              </span>
            </div>
            {expanded && (
              <div className={styles.popup}>
                <ul
                  id={listId}
                  className={styles.list}
                  role="listbox"
                  aria-labelledby={`${inputId}-label`}
                >
                  {filtered.map((option, index) => (
                    <li key={option.value} role="none">
                      <button
                        type="button"
                        tabIndex={-1}
                        disabled={option.disabled}
                        id={`${listId}-${index}`}
                        data-index={index}
                        role="option"
                        aria-selected={option.value === selected}
                        aria-disabled={option.disabled || undefined}
                        className={cn(
                          styles.option,
                          index === active && styles.active,
                        )}
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => {
                          if (!option.disabled) choose(option.value);
                        }}
                      >
                        {option.label}
                      </button>
                    </li>
                  ))}
                </ul>
                {!filtered.length && (
                  <div role="status" className={styles.empty}>
                    No results found
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    );
  },
);
