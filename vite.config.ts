import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    react(),
    {
      name: "welkui-client-boundaries",
      renderChunk(code, chunk) {
        // Rollup removes directives; restore them on component modules, not the barrel.
        const source = chunk.facadeModuleId
          ? this.getModuleInfo(chunk.facadeModuleId)?.code
          : undefined;
        if (source && /^\s*["']use client["'];/.test(source)) {
          return { code: `"use client";\n${code}`, map: null };
        }
      },
    },
  ],
  build: {
    lib: {
      entry: {
        index: fileURLToPath(new URL("./src/index.ts", import.meta.url)),
        styles: fileURLToPath(
          new URL("./src/styles/index.ts", import.meta.url),
        ),
      },
      formats: ["es"],
      fileName: "index",
      cssFileName: "styles",
    },
    rollupOptions: {
      external: (id) => /^(react|react-dom)(\/|$)/.test(id),
      onwarn(warning, warn) {
        if (
          warning.code === "MODULE_LEVEL_DIRECTIVE" &&
          warning.message.includes('"use client"')
        ) {
          return;
        }
        warn(warning);
      },
      output: {
        preserveModules: true,
        preserveModulesRoot: "src",
        entryFileNames: "[name].js",
      },
    },
  },
});
