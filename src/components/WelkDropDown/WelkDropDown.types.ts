import type { ReactNode } from "react";

export interface WelkDropDownOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface WelkDropDownProps {
  label: ReactNode;
  options: readonly WelkDropDownOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  searchable?: boolean;
  placeholder?: string;
  name?: string;
  id?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}
