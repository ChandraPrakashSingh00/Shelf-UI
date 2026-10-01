import { AlertDialog, Button } from "@codecps/ui";
import { useState } from "react";

// Stands in for your API call.
const markAsShipped = () => new Promise((resolve) => setTimeout(resolve, 1500));

export default function AlertDialogAsyncConfirm() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("18 orders are packed and ready to ship.");

  return (
    <div style={{ display: "grid", justifyItems: "center", gap: 12, textAlign: "center" }}>
      <p style={{ margin: 0 }}>{message}</p>
      <Button onClick={() => setOpen(true)}>Mark as shipped</Button>
      <AlertDialog
        open={open}
        onClose={() => setOpen(false)}
        // Returning a promise shows a spinner until it settles, then closes the dialog.
        // If it rejects, the dialog stays open so the seller can try again.
        onConfirm={async () => {
          await markAsShipped();
          setMessage("Done! 18 customers will get an SMS with their tracking link.");
        }}
        variant="primary"
        title="Mark 18 orders as shipped?"
        description="Customers in Mumbai, Delhi and Bengaluru will get an SMS with their tracking link."
        confirmLabel="Mark as shipped"
      />
    </div>
  );
}
