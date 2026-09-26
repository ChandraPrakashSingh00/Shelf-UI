import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const docsRoot = fileURLToPath(new URL(".", import.meta.url));
const libraryEntry = fileURLToPath(new URL("../src/index.js", import.meta.url));
const libraryStyles = fileURLToPath(new URL("../src/styles/index.css", import.meta.url));

// Documentation site. It renders the library straight from `src/`, so the docs
// always show the current components (run with `npm run docs:dev`).
export default defineConfig(({ command }) => {
  // Build React's production code even if NODE_ENV=development is set machine-wide.
  if (command === "build") process.env.NODE_ENV = "production";

  return {
    root: docsRoot,
    // GitHub Pages serves the site from /<repo>/; CI sets DOCS_BASE_PATH to that.
    base: process.env.DOCS_BASE_PATH || "/",
    plugins: [react()],
    resolve: {
      alias: [
        { find: /^@codecps\/ui$/, replacement: libraryEntry },
        { find: /^@codecps\/ui\/styles\.css$/, replacement: libraryStyles },
      ],
    },
    build: {
      outDir: "dist",
      emptyOutDir: true,
      rolldownOptions: {
        output: {
          // Vendor chunks change rarely, so browsers keep them cached across docs deploys.
          codeSplitting: {
            groups: [
              { name: "react", test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/ },
              { name: "router", test: /node_modules[\\/]react-router[\\/]/ },
            ],
          },
        },
      },
    },
  };
});
