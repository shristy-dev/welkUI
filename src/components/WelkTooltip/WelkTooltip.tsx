"use client";

import { cloneElement, useEffect, useId, useRef, useState } from "react";
import { cn } from "../../utils";
import styles from "./WelkTooltip.module.css";
import type { WelkTooltipProps } from "./WelkTooltip.types";

export function WelkTooltip({
  content,
  children,
  variant = "bubble",
  className,
}: WelkTooltipProps) {
  const id = useId();
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const open = (hovered || focused) && !dismissed;

  useEffect(() => () => clearTimeout(leaveTimer.current), []);

  useEffect(() => {
    if (!open) return;
    const dismiss = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDismissed(true);
    };
    document.addEventListener("keydown", dismiss);
    return () => document.removeEventListener("keydown", dismiss);
  }, [open]);

  return (
    <span
      className={styles.trigger}
      onMouseEnter={() => {
        clearTimeout(leaveTimer.current);
        if (!focused) setDismissed(false);
        setHovered(true);
      }}
      onMouseLeave={(event) => {
        if (
          !(event.relatedTarget instanceof Node) ||
          !event.currentTarget.contains(event.relatedTarget)
        )
          leaveTimer.current = setTimeout(() => setHovered(false), 100);
      }}
      onFocus={() => {
        if (!hovered) setDismissed(false);
        setFocused(true);
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setFocused(false);
      }}
    >
      {cloneElement(children, {
        "aria-describedby":
          cn(children.props["aria-describedby"], open && id) || undefined,
      })}
      {open && (
        <span
          id={id}
          role="tooltip"
          className={cn(
            styles.tooltip,
            styles[variant === "speach" ? "speech" : variant],
            className,
          )}
        >
          {content}
        </span>
      )}
    </span>
  );
}
