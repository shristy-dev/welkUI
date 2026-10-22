import type { ReactNode } from "react";

export interface WelkTimePickerProps {
  label: ReactNode;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  showSeconds?: boolean;
  name?: string;
  id?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}
