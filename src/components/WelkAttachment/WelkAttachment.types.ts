import type { InputHTMLAttributes, ReactNode } from "react";

export interface WelkAttachmentProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "value" | "defaultValue" | "children"
> {
  label: ReactNode;
  maxFileSize?: number;
  maxFiles?: number;
  onFilesChange?: (files: File[]) => void;
}
