import type { ReactElement } from "react";

export interface WelkTooltipProps {
  content: string;
  children: ReactElement<{ "aria-describedby"?: string }>;
  variant?: "bubble" | "speech" | "speach";
  className?: string;
}
