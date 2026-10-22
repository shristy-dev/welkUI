import type { CSSProperties, ImgHTMLAttributes } from "react";

export interface WelkStickerProps extends Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  "src" | "alt" | "children"
> {
  src: string;
  alt: string;
  fallbackSrc?: string;
  outlineThickness?: number;
  outlineColor?: CSSProperties["color"];
  elevateOnHover?: boolean;
}
