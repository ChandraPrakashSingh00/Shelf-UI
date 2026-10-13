import { Button } from "@shelf-ui/react";
import { useState } from "react";

export default function ButtonLoading() {
  const [saving, setSaving] = useState(false);

  const save = () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 2000);
  };

  return (
    <Button loading={saving} onClick={save}>
      {saving ? "Saving…" : "Save changes"}
    </Button>
  );
}
