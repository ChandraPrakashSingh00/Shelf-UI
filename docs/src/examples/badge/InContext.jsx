import { Badge } from "shelf-ui-react";

const deployments = [
  { name: "storefront-web", status: "success", label: "Ready" },
  { name: "storefront-api", status: "warning", label: "Building" },
  { name: "storefront-docs", status: "danger", label: "Failed" },
];

export default function BadgeInContext() {
  return (
    <ul
      style={{
        display: "grid",
        gap: 12,
        width: "100%",
        maxWidth: 360,
        margin: 0,
        padding: 0,
        listStyle: "none",
      }}
    >
      {deployments.map((deployment) => (
        <li
          key={deployment.name}
          style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
        >
          {deployment.name}
          <Badge variant={deployment.status}>{deployment.label}</Badge>
        </li>
      ))}
    </ul>
  );
}
