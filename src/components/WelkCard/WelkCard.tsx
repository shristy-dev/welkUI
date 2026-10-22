"use client";

import { forwardRef, useId } from "react";
import { cn } from "../../utils";
import styles from "./WelkCard.module.css";
import type { WelkCardProps } from "./WelkCard.types";

export const WelkCard = forwardRef<HTMLButtonElement, WelkCardProps>(
  function WelkCard(
    {
      title,
      subtitle,
      icon,
      growOnHover = true,
      className,
      type = "button",
      "aria-labelledby": labelledBy,
      "aria-describedby": describedBy,
      ...props
    },
    ref,
  ) {
    const id = useId();

    return (
      <button
        {...props}
        ref={ref}
        type={type}
        aria-labelledby={
          labelledBy ?? (props["aria-label"] ? undefined : `${id}-title`)
        }
        aria-describedby={describedBy ?? `${id}-subtitle`}
        className={cn(
          styles.card,
          growOnHover && styles.growOnHover,
          className,
        )}
      >
        <span className={styles.title} id={`${id}-title`}>
          {title}
        </span>
        <span className={styles.subtitle} id={`${id}-subtitle`}>
          {subtitle}
        </span>
        {icon != null && (
          <span className={styles.icon} aria-hidden="true">
            {icon}
          </span>
        )}
      </button>
    );
  },
);
