import type { ComponentPropsWithoutRef, ReactNode } from "react";

export interface WelkBreadCrumbItem extends Omit<
  ComponentPropsWithoutRef<"a">,
  "children" | "aria-current"
> {
  label: ReactNode;
}

export interface WelkBreadCrumbsProps extends Omit<
  ComponentPropsWithoutRef<"nav">,
  "children"
> {
  items: readonly WelkBreadCrumbItem[];
  separator?: ReactNode;
}
