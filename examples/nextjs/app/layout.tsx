import type { ReactNode } from "react";
import "@welkui/react/styles.css";

export const metadata = {
  title: "welkUI Next.js example",
  description: "Using welkUI with Next.js App Router.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
