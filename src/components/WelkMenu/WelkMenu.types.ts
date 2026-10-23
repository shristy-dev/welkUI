import type { ComponentPropsWithoutRef } from "react";

export interface WelkMenuItem {
  title: string;
  route: string;
  children?: readonly WelkMenuItem[];
}

export interface WelkMenuProps extends Omit<
  ComponentPropsWithoutRef<"nav">,
  "children"
> {
  items: readonly WelkMenuItem[];
  variant?: "default" | "nested";
  activeRoute?: string;
  collapsible?: boolean;
}
