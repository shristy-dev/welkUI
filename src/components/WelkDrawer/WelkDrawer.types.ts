import type { ReactNode } from "react";

export type WelkDrawerPosition = "left" | "right" | "top" | "bottom";

export interface WelkDrawerProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  children?: ReactNode;
  position?: WelkDrawerPosition;
  closeOnTapOutside?: boolean;
  closeLabel?: string;
  className?: string;
}
