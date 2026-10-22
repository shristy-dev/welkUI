import type { InputHTMLAttributes, MouseEventHandler, ReactNode } from "react";

export interface WelkInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "children"
> {
  label: ReactNode;
  type?: "text" | "email" | "password" | "search" | "tel" | "url";
  endAction?: {
    icon: ReactNode;
    label: string;
    onClick: MouseEventHandler<HTMLButtonElement>;
    disabled?: boolean;
  };
}
