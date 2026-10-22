"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { cn } from "../../utils";
import styles from "./WelkSnackBar.module.css";
import type { WelkSnackBarProps } from "./WelkSnackBar.types";

const subscribe = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

export function WelkSnackBar({
  open,
  onClose,
  message,
  position = "bottom-middle",
  variant = "default",
  autoHideDuration = 0,
  closeLabel = "Dismiss notification",
  className,
}: WelkSnackBarProps) {
  if (!Number.isFinite(autoHideDuration) || autoHideDuration < 0) {
    throw new RangeError(
      "WelkSnackBar: autoHideDuration must be a non-negative finite number.",
    );
  }
  const mounted = useSyncExternalStore(
    subscribe,
    clientSnapshot,
    serverSnapshot,
  );
  const [present, setPresent] = useState(open);
  const [previousOpen, setPreviousOpen] = useState(open);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const closeRef = useRef(onClose);

  if (previousOpen !== open) {
    setPreviousOpen(open);
    if (open) setPresent(true);
    setHovered(false);
    setFocused(false);
  }

  useEffect(() => {
    closeRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (open) return;
    const timeout = window.setTimeout(() => setPresent(false), 200);
    return () => window.clearTimeout(timeout);
  }, [open]);

  useEffect(() => {
    if (!open || !autoHideDuration || hovered || focused) return;
    const timeout = window.setTimeout(
      () => closeRef.current(),
      autoHideDuration,
    );
    return () => window.clearTimeout(timeout);
  }, [open, autoHideDuration, hovered, focused]);

  if (!mounted || !present) return null;

  return createPortal(
    <div
      className={cn(styles.position, styles[position])}
      aria-hidden={!open || undefined}
    >
      <div
        className={cn(
          styles.snackbar,
          styles[variant],
          !open && styles.leaving,
          className,
        )}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setFocused(true)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget))
            setFocused(false);
        }}
      >
        <svg className={styles.burst} viewBox="0 0 32 32" aria-hidden="true">
          <path d="m17 1 2 9 9-5-4 10 7 4-11 2-1 10-6-8-11 4 5-10-6-7 11 1Z" />
          <path d="m17 8-6 10h5l-1 7 7-12h-6Z" className={styles.bolt} />
        </svg>
        <div className={styles.message} role="status" aria-atomic="true">
          {message}
        </div>
        <button
          type="button"
          className={styles.close}
          aria-label={closeLabel}
          disabled={!open}
          onClick={onClose}
          onKeyDown={(event) => {
            if (open && event.key === "Escape") {
              event.preventDefault();
              event.stopPropagation();
              onClose();
            }
          }}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m6 6 12 12M18 6 6 18" />
          </svg>
        </button>
      </div>
    </div>,
    document.body,
  );
}
