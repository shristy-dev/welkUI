import type { InputHTMLAttributes, ReactNode } from "react";

export interface WelkCheckBoxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "size" | "children"
> {
  label: ReactNode;
}
