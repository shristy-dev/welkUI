import type { ImgHTMLAttributes } from "react";

export interface WelkImageProps extends Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  "src" | "alt" | "children"
> {
  src: string;
  alt: string;
  variant?: "network" | "asset";
  fallbackSrc?: string;
}
