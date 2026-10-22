import type { ReactNode } from "react";

export type WelkSnackBarPosition =
  | "top-left"
  | "top-middle"
  | "top-right"
  | "bottom-left"
  | "bottom-middle"
  | "bottom-right";

export interface WelkSnackBarProps {
  open: boolean;
  onClose: () => void;
  message: ReactNode;
  position?: WelkSnackBarPosition;
  variant?: "default" | "info" | "success" | "warning" | "error";
  /** Milliseconds before requesting dismissal; 0 keeps it open until dismissed. */
  autoHideDuration?: number;
  closeLabel?: string;
  className?: string;
}
