import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const libraryEntry = fileURLToPath(new URL("./src/index.js", import.meta.url));

// `npm run dev` serves the playground (index.html); `npm run build` builds the library.
export default defineConfig(({ command }) => {
  // Vite respects an existing NODE_ENV, so a machine-wide NODE_ENV=development
  // would compile JSX to `react/jsx-dev-runtime`, which crashes in consumers'
  // production builds. The published package is always a production build.
  if (command === "build") process.env.NODE_ENV = "production";

  return {
    plugins: [react()],
    resolve: {
      // Lets the playground import the library exactly the way consumers do.
      alias: [{ find: /^@codecps\/ui$/, replacement: libraryEntry }],
    },
    publicDir: false,
    build: {
      lib: {
        entry: libraryEntry,
        formats: ["es"],
        cssFileName: "styles",
      },
      sourcemap: true,
      emptyOutDir: true,
      rolldownOptions: {
        external: [/^react($|\/)/, /^react-dom($|\/)/],
        output: {
          // One output file per source module keeps the package tree-shakeable.
          preserveModules: true,
          preserveModulesRoot: "src",
          entryFileNames: "[name].js",
          // Components use hooks, so frameworks with React Server Components
          // (e.g. the Next.js App Router) must treat them as client modules.
          banner: '"use client";',
        },
      },
    },
  };
});
