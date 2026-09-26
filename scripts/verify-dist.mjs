// Fails the build if `dist/` contains output that would break consumers.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const distDir = fileURLToPath(new URL("../dist", import.meta.url));

// Yields the path of every file under `dir`, recursively.
function* files(dir) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) yield* files(path);
    else yield path;
  }
}

// [file name, problem] pairs.
const problems = [];

for (const file of files(distDir)) {
  const name = relative(distDir, file).replaceAll("\\", "/");
  const source = readFileSync(file, "utf8");

  if (name.endsWith(".js")) {
    // The dev runtime's `jsxDEV` is undefined in production React.
    if (source.includes("react/jsx-dev-runtime")) {
      problems.push([name, "imports react/jsx-dev-runtime (built with NODE_ENV=development?)"]);
    }
    if (!source.startsWith('"use client";')) {
      problems.push([name, 'is missing the "use client" directive']);
    }
  }
}

if (problems.length > 0) {
  console.error("verify-dist: the build output is not publishable:");
  for (const [name, problem] of problems) console.error(`  - dist/${name} ${problem}`);
  process.exit(1);
}

console.log("verify-dist: dist/ looks good.");
