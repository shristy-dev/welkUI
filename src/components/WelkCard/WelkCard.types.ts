import type { ButtonHTMLAttributes, ReactNode } from "react";

export interface WelkCardProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "title" | "children"
> {
  title: ReactNode;
  subtitle: ReactNode;
  icon?: ReactNode;
  growOnHover?: boolean;
}
