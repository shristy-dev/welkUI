import type { DetailsHTMLAttributes, ReactNode } from "react";

export interface WelkAccordionProps extends Omit<
  DetailsHTMLAttributes<HTMLDetailsElement>,
  "title"
> {
  title: ReactNode;
}
