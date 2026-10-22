import type { HTMLAttributes } from "react";
import type { WelkSize } from "../../types";

export interface WelkBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "info" | "success" | "warning" | "error";
  size?: WelkSize;
}
