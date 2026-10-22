"use client";

import { useEffect, useId, useRef } from "react";
import { cn } from "../../utils";
import styles from "./WelkDrawer.module.css";
import type { WelkDrawerProps } from "./WelkDrawer.types";

export function WelkDrawer({
  open,
  onClose,
  title,
  children,
  position = "right",
  closeOnTapOutside = false,
  closeLabel = "Close drawer",
  className,
}: WelkDrawerProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open) {
      if (!dialog.open) dialog.showModal();
      const body = dialog.ownerDocument.body;
      const overflow = body.style.overflow;
      body.style.overflow = "hidden";
      return () => {
        body.style.overflow = overflow;
      };
    }
    if (!dialog.open) return;
    const timeout = window.setTimeout(() => dialog.close(), 200);
    return () => window.clearTimeout(timeout);
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !open || !closeOnTapOutside) return;
    let outsidePress = false;
    const isOutside = (event: MouseEvent) => {
      const bounds = dialog.getBoundingClientRect();
      return (
        event.target === dialog &&
        (event.clientX < bounds.left ||
          event.clientX > bounds.right ||
          event.clientY < bounds.top ||
          event.clientY > bounds.bottom)
      );
    };
    const pointerDown = (event: PointerEvent) => {
      outsidePress = isOutside(event);
    };
    const click = (event: MouseEvent) => {
      if (outsidePress && isOutside(event)) onClose();
      outsidePress = false;
    };
    dialog.addEventListener("pointerdown", pointerDown);
    dialog.addEventListener("click", click);
    return () => {
      dialog.removeEventListener("pointerdown", pointerDown);
      dialog.removeEventListener("click", click);
    };
  }, [open, closeOnTapOutside, onClose]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      className={cn(
        styles.drawer,
        styles[position],
        !open && styles.closing,
        className,
      )}
      onCancel={(event) => {
        event.preventDefault();
        if (open) onClose();
      }}
      onClose={() => {
        if (open) onClose();
      }}
    >
      <header className={styles.header}>
        <h2 id={titleId} className={styles.title}>
          {title}
        </h2>
        <button
          type="button"
          className={styles.close}
          aria-label={closeLabel}
          disabled={!open}
          onClick={onClose}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            aria-hidden="true"
          >
            <path d="m6 6 12 12M18 6 6 18" />
          </svg>
        </button>
      </header>
      <div className={styles.content}>{children}</div>
    </dialog>
  );
}
