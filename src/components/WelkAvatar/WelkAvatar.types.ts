import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import type { WelkSize } from "../../types";

export interface WelkAvatarProps extends Omit<
  HTMLAttributes<HTMLSpanElement>,
  "children" | "color"
> {
  alt: string;
  src?: string;
  icon?: ReactNode;
  variant?:
    "user" | "male-user" | "female-user" | "male-admin" | "female-admin";
  size?: WelkSize;
  color?: CSSProperties["backgroundColor"];
  growOnHover?: boolean;
}
