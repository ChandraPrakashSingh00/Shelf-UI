import { categories, componentDocs } from "../content/components/index.js";
import { BoxesIcon, FeatherIcon, FolderIcon, UnlockIcon } from "./icons.jsx";

const stats = [
  { value: String(componentDocs.length), label: "Components", Icon: BoxesIcon },
  { value: String(categories.length), label: "Categories", Icon: FolderIcon },
  { value: "0", label: "Runtime dependencies", Icon: FeatherIcon },
  { value: "MIT", label: "Open source & free", Icon: UnlockIcon },
];

/** The library at a glance: component and category counts, dependencies, license. */
export function StatList({ className }) {
  return (
    <ul
      className={["docs-stats__list", className].filter(Boolean).join(" ")}
      aria-label="CodeCPS UI at a glance"
    >
      {stats.map(({ value, label, Icon }) => (
        <li key={label} className="docs-stat">
          <Icon className="docs-stat__icon" />
          <span className="docs-stat__value">{value}</span>
          <span className="docs-stat__label">{label}</span>
        </li>
      ))}
    </ul>
  );
}
