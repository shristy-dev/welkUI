import type { InputHTMLAttributes, ReactNode } from "react";

export interface WelkOTPInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  | "type"
  | "children"
  | "value"
  | "defaultValue"
  | "onChange"
  | "size"
  | "maxLength"
  | "minLength"
  | "pattern"
  | "inputMode"
> {
  label: ReactNode;
  length?: number;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onComplete?: (value: string) => void;
}
