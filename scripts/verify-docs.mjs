// Fails the docs build if its stylesheet is missing the library's styles. Dev
// servers inject CSS from JavaScript, so a production-only loss goes unnoticed.

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const assetsDir = fileURLToPath(new URL("../docs/dist/assets", import.meta.url));

const css = readdirSync(assetsDir)
  .filter((name) => name.endsWith(".css"))
  .map((name) => readFileSync(join(assetsDir, name), "utf8"))
  .join("\n");

// A design token, a component and the docs' own styles.
const expected = ["--shelf-color-primary:", ".shelf-button--secondary", "--docs-header-height:"];
const missing = expected.filter((text) => !css.includes(text));

if (missing.length > 0) {
  console.error("verify-docs: the docs stylesheet is incomplete. Missing:");
  for (const text of missing) console.error(`  - ${text}`);
  process.exit(1);
}

console.log("verify-docs: docs/dist/ includes the library and docs styles.");
