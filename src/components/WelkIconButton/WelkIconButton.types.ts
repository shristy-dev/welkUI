import type { ButtonHTMLAttributes, ReactNode } from "react";

export interface WelkIconButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children"
> {
  icon: ReactNode;
  label: string;
  variant?: "default" | "text";
}
