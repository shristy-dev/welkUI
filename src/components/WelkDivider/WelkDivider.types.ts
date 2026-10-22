import type { HTMLAttributes } from "react";

export interface WelkDividerProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> {
  orientation?: "horizontal" | "vertical";
  variant?: "plain" | "dotted" | "dashed";
  thickness?: number;
}
