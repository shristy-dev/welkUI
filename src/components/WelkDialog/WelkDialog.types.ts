import type { MouseEventHandler, ReactNode } from "react";

export interface WelkDialogProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  children?: ReactNode;
  variant?: "alert" | "info" | "warning" | "error" | "success";
  type?: "default" | "confirmation";
  closeOnTapOutside?: boolean;
  closeLabel?: string;
  buttonText?: string;
  onPress?: MouseEventHandler<HTMLButtonElement>;
  yesText?: string;
  noText?: string;
  onYesPress?: MouseEventHandler<HTMLButtonElement>;
  onNoPress?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
}
