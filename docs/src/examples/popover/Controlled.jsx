import { Button, Input, Popover } from "shelf-ui-react";
import { useState } from "react";

export default function PopoverControlled() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("storefront-web");

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextName = new FormData(event.currentTarget).get("name").trim();
    if (nextName) setName(nextName);
    setOpen(false);
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <span>
        Project: <strong>{name}</strong>
      </span>
      <Popover
        open={open}
        onOpenChange={setOpen}
        trigger={
          <Button size="sm" variant="outline">
            Rename
          </Button>
        }
        title="Rename project"
      >
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
          <Input name="name" label="Project name" defaultValue={name} required />
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <Button size="sm" variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" type="submit">
              Save
            </Button>
          </div>
        </form>
      </Popover>
    </div>
  );
}
