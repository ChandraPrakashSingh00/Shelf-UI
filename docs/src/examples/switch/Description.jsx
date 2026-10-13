import { Switch } from "shelf-ui-react";

export default function SwitchDescription() {
  return (
    <div style={{ display: "grid", gap: 16, width: "100%", maxWidth: 400 }}>
      <Switch
        label="Auto-deploy"
        description="Deploy every push to the main branch."
        defaultChecked
      />
      <Switch
        label="Preview deployments"
        description="Create a preview URL for every pull request."
      />
    </div>
  );
}
