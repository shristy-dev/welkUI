import type { WelkCardProps } from "../WelkCard";
import type { WelkStickerProps } from "../WelkSticker";

export interface WelkStickerCardProps extends WelkCardProps {
  sticker: Omit<WelkStickerProps, "className" | "style" | "width" | "height">;
}
