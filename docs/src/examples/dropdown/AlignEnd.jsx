import { Button, Dropdown } from "@codecps/ui";

export default function DropdownAlignEnd() {
  return (
    <div style={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
      <Dropdown
        align="end"
        label="Account"
        trigger={<Button variant="ghost">Priya Sharma</Button>}
        items={[
          { id: "profile", label: "Profile" },
          { id: "settings", label: "Settings" },
          { id: "sign-out", label: "Sign out" },
        ]}
      />
    </div>
  );
}
