import type { ButtonHTMLAttributes } from "react";
import type { WelkSize } from "../../types";

export interface WelkButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  size?: WelkSize;
}
