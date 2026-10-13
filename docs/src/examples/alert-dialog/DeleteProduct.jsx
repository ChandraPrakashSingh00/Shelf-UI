import { AlertDialog, Button } from "shelf-ui-react";
import { useState } from "react";

export default function AlertDialogDeleteProduct() {
  const [open, setOpen] = useState(false);
  const [deleted, setDeleted] = useState(false);

  return (
    <div style={{ display: "grid", justifyItems: "center", gap: 12 }}>
      <p style={{ margin: 0 }}>
        {deleted ? "“Cotton Kurta – Indigo” was deleted." : "Cotton Kurta – Indigo · ₹899"}
      </p>
      {/* Both branches are the same Button, so focus returns to it when the dialog closes. */}
      {deleted ? (
        <Button variant="outline" onClick={() => setDeleted(false)}>
          Undo
        </Button>
      ) : (
        <Button variant="danger" onClick={() => setOpen(true)}>
          Delete product
        </Button>
      )}
      <AlertDialog
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={() => setDeleted(true)}
        title="Delete “Cotton Kurta – Indigo”?"
        description="The product, its 4 size variants and 12 photos will be removed from your store. This can't be undone."
        confirmLabel="Delete product"
      />
    </div>
  );
}
