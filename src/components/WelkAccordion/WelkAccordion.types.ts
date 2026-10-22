import type { CSSProperties, DetailsHTMLAttributes, ReactNode } from "react";

export interface WelkAccordionProps extends Omit<
  DetailsHTMLAttributes<HTMLDetailsElement>,
  "title"
> {
  title: ReactNode;
  variant?: "vertical" | "horizontal" | "nested";
  closeOnOutsideClick?: boolean;
  fixedWidth?: CSSProperties["width"];
}
