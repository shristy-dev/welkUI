import type { InputHTMLAttributes, ReactNode } from "react";

export interface WelkRadioProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "size" | "children"
> {
  label: ReactNode;
}
