"use client";

import { forwardRef, useCallback, useEffect, useRef } from "react";
import { cn } from "../../utils";
import styles from "./WelkAccordion.module.css";
import type { WelkAccordionProps } from "./WelkAccordion.types";

export const WelkAccordion = forwardRef<HTMLDetailsElement, WelkAccordionProps>(
  function WelkAccordion(
    {
      title,
      children,
      className,
      variant = "vertical",
      closeOnOutsideClick = false,
      fixedWidth,
      style,
      ...props
    },
    ref,
  ) {
    const detailsRef = useRef<HTMLDetailsElement>(null);
    const setRef = useCallback(
      (node: HTMLDetailsElement | null) => {
        detailsRef.current = node;
        if (typeof ref === "function") return ref(node);
        if (ref) ref.current = node;
      },
      [ref],
    );

    useEffect(() => {
      const details = detailsRef.current;
      if (!closeOnOutsideClick || !details) return;
      const document = details.ownerDocument;
      const handlePointerDown = (event: PointerEvent) => {
        if (details.open && !event.composedPath().includes(details)) {
          details.open = false;
        }
      };
      document.addEventListener("pointerdown", handlePointerDown, true);
      return () =>
        document.removeEventListener("pointerdown", handlePointerDown, true);
    }, [closeOnOutsideClick]);

    return (
      <details
        {...props}
        ref={setRef}
        className={cn(styles.accordion, styles[variant], className)}
        style={{
          ...style,
          ...(fixedWidth !== undefined && { width: fixedWidth }),
        }}
      >
        <summary className={styles.summary}>{title}</summary>
        <div className={styles.content}>{children}</div>
      </details>
    );
  },
);
