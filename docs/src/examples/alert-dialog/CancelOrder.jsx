import { AlertDialog, Badge, Button, Select } from "@shelf-ui/react";
import { useState } from "react";

const reasons = [
  "Customer requested cancellation",
  "Item out of stock",
  "Delivery not possible to this pincode",
  "Suspected fraudulent order",
];

export default function AlertDialogCancelOrder() {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [cancelled, setCancelled] = useState(false);

  const openDialog = () => {
    setReason("");
    setOpen(true);
  };

  return (
    <div style={{ display: "grid", justifyItems: "center", gap: 12, textAlign: "center" }}>
      <p style={{ margin: 0 }}>
        Order #1042 · Priya Sharma, Pune · ₹2,349{" "}
        <Badge variant={cancelled ? "danger" : "primary"}>
          {cancelled ? "Cancelled" : "Processing"}
        </Badge>
      </p>
      {cancelled && (
        <p style={{ margin: 0, color: "var(--shelf-color-text-muted)" }}>Reason: {reason}</p>
      )}
      {cancelled ? (
        <Button variant="outline" onClick={() => setCancelled(false)}>
          Restore order
        </Button>
      ) : (
        <Button variant="outline" onClick={openDialog}>
          Cancel order
        </Button>
      )}
      <AlertDialog
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={() => setCancelled(true)}
        title="Cancel order #1042?"
        description="Priya will get an SMS, and ₹2,349 will be refunded to her UPI account in 3–5 days."
        confirmLabel="Cancel order"
        cancelLabel="Keep order"
        confirmDisabled={reason === ""}
      >
        <Select
          label="Reason"
          placeholder="Choose a reason"
          options={reasons}
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          required
        />
      </AlertDialog>
    </div>
  );
}
