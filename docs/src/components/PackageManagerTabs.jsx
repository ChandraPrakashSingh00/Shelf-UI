import { useState } from "react";
import { packageName } from "../content/site.js";
import { CodeBlock } from "./CodeBlock.jsx";
import { SegmentedControl } from "./SegmentedControl.jsx";

const managers = {
  npm: `npm install ${packageName}`,
  pnpm: `pnpm add ${packageName}`,
  yarn: `yarn add ${packageName}`,
  bun: `bun add ${packageName}`,
};

/** The install command for the package manager the reader picks. */
export function PackageManagerTabs() {
  const [manager, setManager] = useState("npm");

  return (
    <div className="docs-install">
      <SegmentedControl
        legend="Package manager"
        options={Object.keys(managers)}
        value={manager}
        onChange={setManager}
        className="docs-segmented--pills"
      />
      <CodeBlock code={managers[manager]} language="bash" title="terminal" />
    </div>
  );
}
