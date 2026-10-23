import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig(({ command }) => ({
  plugins: [react()],
  resolve: {
    alias:
      command === "serve"
        ? [
            {
              find: "@welkui/react/styles.css",
              replacement: fileURLToPath(
                new URL("../../src/styles/index.css", import.meta.url),
              ),
            },
            {
              find: /^@welkui\/react$/,
              replacement: fileURLToPath(
                new URL("../../src/index.ts", import.meta.url),
              ),
            },
          ]
        : [],
  },
  // Serve the shared favicon files from the repository assets folder.
  publicDir: "../../assets/favicons",
  // Bundle the library during pre-rendering so its CSS imports resolve.
  ssr: { noExternal: ["@welkui/react"] },
}));
