"use client";

import { forwardRef, useId, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { cn } from "../../utils";
import styles from "./WelkTabs.module.css";
import type { WelkTabsProps } from "./WelkTabs.types";

export const WelkTabs = forwardRef<HTMLDivElement, WelkTabsProps>(
  function WelkTabs(
    {
      label,
      items,
      value,
      defaultValue,
      onValueChange,
      variant = "default",
      orientation = "horizontal",
      className,
      ...props
    },
    ref,
  ) {
    const generatedId = useId();
    const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
    const [uncontrolledValue, setUncontrolledValue] = useState(
      defaultValue ?? items.find((item) => !item.disabled)?.value,
    );
    const requestedValue = value ?? uncontrolledValue;
    const selectedIndex = items.findIndex(
      (item) => item.value === requestedValue && !item.disabled,
    );
    const activeIndex =
      selectedIndex >= 0
        ? selectedIndex
        : items.findIndex((item) => !item.disabled);
    const activeValue = activeIndex >= 0 ? items[activeIndex].value : undefined;

    const select = (nextValue: string) => {
      if (nextValue === activeValue) return;
      if (value === undefined) setUncontrolledValue(nextValue);
      onValueChange?.(nextValue);
    };

    const handleKeyDown = (
      event: KeyboardEvent<HTMLButtonElement>,
      currentIndex: number,
    ) => {
      const previousKey =
        orientation === "horizontal" ? "ArrowLeft" : "ArrowUp";
      const nextKey = orientation === "horizontal" ? "ArrowRight" : "ArrowDown";
      let nextIndex: number | undefined;

      if (event.key === "Home") {
        nextIndex = items.findIndex((item) => !item.disabled);
      } else if (event.key === "End") {
        nextIndex = items.reduce(
          (lastEnabled, item, index) => (!item.disabled ? index : lastEnabled),
          -1,
        );
      } else if (event.key === previousKey || event.key === nextKey) {
        const direction = event.key === nextKey ? 1 : -1;
        for (let offset = 1; offset <= items.length; offset++) {
          const index =
            (currentIndex + direction * offset + items.length) % items.length;
          if (!items[index].disabled) {
            nextIndex = index;
            break;
          }
        }
      }

      if (nextIndex === undefined || nextIndex < 0) return;
      event.preventDefault();
      tabRefs.current[nextIndex]?.focus();
      select(items[nextIndex].value);
    };

    return (
      <div
        {...props}
        ref={ref}
        className={cn(
          styles.tabs,
          styles[orientation],
          variant === "withBg" && styles.withBg,
          className,
        )}
      >
        <div
          className={styles.tabList}
          role="tablist"
          aria-label={label}
          aria-orientation={orientation}
        >
          {items.map((item, index) => {
            const selected = index === activeIndex;
            const tabId = `${generatedId}-tab-${index}`;
            const panelId = `${generatedId}-panel-${index}`;

            return (
              <button
                key={item.value}
                ref={(node) => {
                  tabRefs.current[index] = node;
                }}
                id={tabId}
                type="button"
                role="tab"
                className={styles.tab}
                aria-selected={selected}
                aria-controls={panelId}
                tabIndex={selected ? 0 : -1}
                disabled={item.disabled}
                onClick={() => select(item.value)}
                onKeyDown={(event) => handleKeyDown(event, index)}
              >
                {item.label}
              </button>
            );
          })}
        </div>
        <div className={styles.panels}>
          {items.map((item, index) => (
            <div
              key={item.value}
              id={`${generatedId}-panel-${index}`}
              role="tabpanel"
              aria-labelledby={`${generatedId}-tab-${index}`}
              className={styles.panel}
              tabIndex={0}
              hidden={index !== activeIndex}
            >
              {item.content}
            </div>
          ))}
        </div>
      </div>
    );
  },
);
