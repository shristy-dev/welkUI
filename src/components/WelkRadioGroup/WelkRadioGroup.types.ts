import type { FieldsetHTMLAttributes, ReactNode } from "react";

export interface WelkRadioOption {
  label: ReactNode;
  value: string;
  disabled?: boolean;
}

export interface WelkRadioGroupProps extends Omit<
  FieldsetHTMLAttributes<HTMLFieldSetElement>,
  "children" | "onChange" | "defaultValue"
> {
  label: ReactNode;
  options: readonly WelkRadioOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  required?: boolean;
}
