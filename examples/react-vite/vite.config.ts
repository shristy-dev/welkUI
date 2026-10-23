import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  // Serve the shared favicon files from the repository assets folder.
  publicDir: "../../assets/favicons",
  // Bundle the library during pre-rendering so its CSS imports resolve.
  ssr: { noExternal: ["@welkui/react"] },
});
