"use client";

import { forwardRef } from "react";
import { cn } from "../../utils";
import styles from "./WelkBreadCrumbs.module.css";
import type { WelkBreadCrumbsProps } from "./WelkBreadCrumbs.types";

export const WelkBreadCrumbs = forwardRef<HTMLElement, WelkBreadCrumbsProps>(
  function WelkBreadCrumbs(
    {
      items,
      separator = "/",
      className,
      "aria-label": ariaLabel = "Breadcrumb",
      ...props
    },
    ref,
  ) {
    return (
      <nav
        {...props}
        ref={ref}
        aria-label={ariaLabel}
        className={cn(styles.nav, className)}
      >
        <ol className={styles.list}>
          {items.map(({ label, href, ...linkProps }, index) => {
            const current = index === items.length - 1;
            return (
              <li className={styles.item} key={index}>
                {index > 0 && (
                  <span className={styles.separator} aria-hidden="true">
                    {separator}
                  </span>
                )}
                {href !== undefined ? (
                  <a
                    {...linkProps}
                    href={href}
                    aria-current={current ? "page" : undefined}
                    className={cn(
                      styles.crumb,
                      current && styles.current,
                      linkProps.className,
                    )}
                  >
                    {label}
                  </a>
                ) : (
                  <span
                    className={cn(styles.crumb, current && styles.current)}
                    aria-current={current ? "page" : undefined}
                  >
                    {label}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    );
  },
);
