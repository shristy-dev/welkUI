"use client";

import { forwardRef } from "react";
import { cn } from "../../utils";
import styles from "./WelkAccordion.module.css";
import type { WelkAccordionProps } from "./WelkAccordion.types";

export const WelkAccordion = forwardRef<HTMLDetailsElement, WelkAccordionProps>(
  function WelkAccordion({ title, children, className, ...props }, ref) {
    return (
      <details {...props} ref={ref} className={cn(styles.accordion, className)}>
        <summary className={styles.summary}>{title}</summary>
        <div className={styles.content}>{children}</div>
      </details>
    );
  },
);
