import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },

  test: {
    environment: "jsdom",

    setupFiles: ["./vitest.setup.ts"],

    include: ["tests/components/**/*.test.tsx"],

    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      exclude: [
        "node_modules/",
        "tests/",
        "**/*.d.ts",
        ".next/",
      ],
    },
  },
});