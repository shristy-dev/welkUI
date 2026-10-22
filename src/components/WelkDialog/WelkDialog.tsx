"use client";

import { useEffect, useId, useRef } from "react";
import { WelkButton } from "../WelkButton";
import { cn } from "../../utils";
import styles from "./WelkDialog.module.css";
import type { WelkDialogProps } from "./WelkDialog.types";

export function WelkDialog({
  open,
  onClose,
  title,
  children,
  variant = "alert",
  type = "default",
  closeOnTapOutside = false,
  closeLabel = "Close dialog",
  buttonText = "Okay",
  onPress,
  yesText = "Yes",
  noText = "No",
  onYesPress,
  onNoPress,
  className,
}: WelkDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    else if (!open && dialog.open) dialog.close();
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !closeOnTapOutside) return;
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
      if (outsidePress && isOutside(event)) dialog.close();
      outsidePress = false;
    };
    dialog.addEventListener("pointerdown", pointerDown);
    dialog.addEventListener("click", click);
    return () => {
      dialog.removeEventListener("pointerdown", pointerDown);
      dialog.removeEventListener("click", click);
    };
  }, [closeOnTapOutside]);

  const close = () => dialogRef.current?.close();

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      className={cn(styles.dialog, styles[variant], className)}
      onClose={onClose}
    >
      <header className={styles.header}>
        <h2 className={styles.title} id={titleId}>
          {title}
        </h2>
        <button
          className={styles.close}
          type="button"
          aria-label={closeLabel}
          onClick={close}
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
      {children != null && <div className={styles.content}>{children}</div>}
      <footer className={styles.footer}>
        {type === "confirmation" ? (
          <>
            <WelkButton variant="success" onClick={onYesPress ?? close}>
              {yesText}
            </WelkButton>
            <WelkButton variant="error" onClick={onNoPress ?? close}>
              {noText}
            </WelkButton>
          </>
        ) : (
          <WelkButton
            variant={variant === "alert" ? "primary" : variant}
            onClick={onPress ?? close}
          >
            {buttonText}
          </WelkButton>
        )}
      </footer>
    </dialog>
  );
}
