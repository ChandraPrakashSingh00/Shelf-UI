import { Button, Dropdown } from "@shelf-ui/react";
import { useState } from "react";

export default function DropdownBasic() {
  const [action, setAction] = useState(null);

  return (
    <>
      <Dropdown
        trigger={<Button variant="outline">Project actions</Button>}
        items={[
          { id: "rename", label: "Rename" },
          { id: "duplicate", label: "Duplicate" },
          { id: "archive", label: "Archive" },
        ]}
        onSelect={setAction}
      />
      <span>{action ? `Selected: ${action}` : "Nothing selected yet"}</span>
    </>
  );
}
