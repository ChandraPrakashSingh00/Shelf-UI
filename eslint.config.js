import js from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";

export default [
  { ignores: ["**/dist/", "coverage/"] },

  js.configs.recommended,
  reactHooks.configs.flat.recommended,

  {
    files: ["**/*.{js,jsx,mjs}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },

  // Build tooling runs in Node.
  {
    files: ["*.config.js", "docs/vite.config.js", "scripts/**/*.mjs"],
    languageOptions: { globals: globals.node },
  },
];
