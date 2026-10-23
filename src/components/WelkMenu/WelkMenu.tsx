"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { cn } from "../../utils";
import styles from "./WelkMenu.module.css";
import type { WelkMenuItem, WelkMenuProps } from "./WelkMenu.types";

function Arrow({ down = false }: { down?: boolean }) {
  return (
    <svg
      className={styles.arrow}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      aria-hidden="true"
    >
      <path d={down ? "m5 9 7 7 7-7" : "M4 12h15m-6-6 6 6-6 6"} />
    </svg>
  );
}

function MenuItems({
  items,
  nested,
  activeRoute,
}: {
  items: readonly WelkMenuItem[];
  nested: boolean;
  activeRoute?: string;
}) {
  return (
    <ul className={styles.list}>
      {items.map((item, index) => (
        <li key={`${item.route}-${index}`} className={styles.item}>
          {nested && !!item.children?.length ? (
            <details className={styles.branch}>
              <summary className={styles.link}>
                <span>{item.title}</span>
                <Arrow down />
              </summary>
              <div className={styles.panel}>
                <a
                  className={styles.link}
                  href={item.route}
                  aria-current={activeRoute === item.route ? "page" : undefined}
                >
                  <span>Go to {item.title}</span>
                  <Arrow />
                </a>
                <MenuItems
                  items={item.children}
                  nested
                  activeRoute={activeRoute}
                />
              </div>
            </details>
          ) : (
            <a
              className={styles.link}
              href={item.route}
              aria-current={activeRoute === item.route ? "page" : undefined}
            >
              <span>{item.title}</span>
              <Arrow />
            </a>
          )}
        </li>
      ))}
    </ul>
  );
}

export const WelkMenu = forwardRef<HTMLElement, WelkMenuProps>(
  function WelkMenu(
    {
      items,
      variant = "default",
      activeRoute,
      collapsible = false,
      className,
      "aria-label": label = "Main navigation",
      ...props
    },
    ref,
  ) {
    const rootRef = useRef<HTMLElement | null>(null);
    const toggleRef = useRef<HTMLButtonElement>(null);
    const contentId = useId();
    const [expanded, setExpanded] = useState(true);
    const setRef = useCallback(
      (node: HTMLElement | null) => {
        rootRef.current = node;
        if (typeof ref === "function") return ref(node);
        if (ref) ref.current = node;
      },
      [ref],
    );

    useEffect(() => {
      const root = rootRef.current;
      if (!root) return;
      const closeAll = () => {
        root
          .querySelectorAll<HTMLDetailsElement>("details[open]")
          .forEach((branch) => {
            branch.open = false;
          });
      };
      const outside = (event: Event) => {
        if (event.target instanceof Node && !root.contains(event.target))
          closeAll();
      };
      const escape = (event: KeyboardEvent) => {
        if (
          event.key !== "Escape" ||
          !(event.target instanceof Element) ||
          !root.contains(event.target)
        )
          return;
        const branch =
          event.target.closest<HTMLDetailsElement>("details[open]");
        if (!branch) {
          if (collapsible && expanded) {
            event.preventDefault();
            event.stopPropagation();
            setExpanded(false);
            toggleRef.current?.focus();
          }
          return;
        }
        event.preventDefault();
        event.stopPropagation();
        branch
          .querySelectorAll<HTMLDetailsElement>("details[open]")
          .forEach((child) => {
            child.open = false;
          });
        branch.open = false;
        branch.querySelector("summary")?.focus();
      };
      const followLink = (event: MouseEvent) => {
        if (event.target instanceof Element && event.target.closest("a"))
          closeAll();
      };
      const document = root.ownerDocument;
      document.addEventListener("pointerdown", outside);
      document.addEventListener("focusin", outside);
      root.addEventListener("keydown", escape);
      root.addEventListener("click", followLink);
      return () => {
        document.removeEventListener("pointerdown", outside);
        document.removeEventListener("focusin", outside);
        root.removeEventListener("keydown", escape);
        root.removeEventListener("click", followLink);
      };
    }, [collapsible, expanded]);

    return (
      <nav
        {...props}
        ref={setRef}
        aria-label={label}
        className={cn(styles.menu, className)}
      >
        {collapsible && (
          <button
            ref={toggleRef}
            type="button"
            className={styles.toggle}
            aria-label={expanded ? "Collapse menu" : "Expand menu"}
            aria-expanded={expanded}
            aria-controls={contentId}
            onClick={() => setExpanded((current) => !current)}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              aria-hidden="true"
            >
              <path
                d={
                  expanded ? "m6 6 12 12M18 6 6 18" : "M4 6h16M4 12h16M4 18h16"
                }
              />
            </svg>
          </button>
        )}
        <div
          id={contentId}
          className={cn(
            styles.collapse,
            collapsible && !expanded && styles.collapsed,
          )}
          aria-hidden={(collapsible && !expanded) || undefined}
          inert={(collapsible && !expanded) || undefined}
        >
          <div className={styles.collapseInner}>
            <MenuItems
              items={items}
              nested={variant === "nested"}
              activeRoute={activeRoute}
            />
          </div>
        </div>
      </nav>
    );
  },
);
