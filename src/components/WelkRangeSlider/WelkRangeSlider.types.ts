import type { InputHTMLAttributes, ReactNode } from "react";

export interface WelkRangeSliderProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "children" | "value" | "defaultValue"
> {
  label: ReactNode;
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
}
