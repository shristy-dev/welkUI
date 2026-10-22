import type { InputHTMLAttributes, ReactNode } from "react";

export interface WelkSwitchProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "size" | "children" | "role"
> {
  label: ReactNode;
  onCheckedChange?: (checked: boolean) => void;
}
