import type { ComponentPropsWithoutRef, ReactNode } from "react";

export interface WelkTabItem {
  label: ReactNode;
  value: string;
  content: ReactNode;
  disabled?: boolean;
}

export interface WelkTabsProps extends Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "defaultValue" | "onChange"
> {
  label: string;
  items: readonly WelkTabItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  variant?: "default" | "withBg";
  orientation?: "horizontal" | "vertical";
}
