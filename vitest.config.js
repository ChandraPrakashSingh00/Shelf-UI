import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

const libraryEntry = fileURLToPath(new URL("./src/index.js", import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    // The docs import the library by its package name.
    alias: [{ find: /^@shelf-ui\/react$/, replacement: libraryEntry }],
  },
  test: {
    environment: "jsdom",
    include: ["src/**/*.test.{js,jsx}", "docs/src/**/*.test.{js,jsx}"],
    setupFiles: ["./test/setup.js"],
    // CSS imports are empty in tests, but the docs read the design tokens' source (`?raw`).
    css: { include: [/src[\\/]styles[\\/]tokens\.css/] },
    clearMocks: true,
    restoreMocks: true,
  },
});
