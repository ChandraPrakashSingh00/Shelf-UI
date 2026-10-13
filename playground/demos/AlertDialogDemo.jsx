import { AlertDialog, Button, Input } from "shelf-ui-react";
import { useRef, useState } from "react";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export function AlertDialogDemo() {
  const [dialog, setDialog] = useState(null);
  const [lastAction, setLastAction] = useState("Nothing confirmed yet.");
  const [confirmation, setConfirmation] = useState("");
  const inputRef = useRef(null);

  const close = () => {
    setDialog(null);
    setConfirmation("");
  };

  return (
    <div className="pg-stack">
      <div className="pg-row">
        <Button variant="danger" onClick={() => setDialog("delete")}>
          Delete product
        </Button>
        <Button onClick={() => setDialog("ship")}>Mark 18 orders as shipped</Button>
        <Button variant="outline" onClick={() => setDialog("fail")}>
          Refund (fails)
        </Button>
        <Button variant="outline" onClick={() => setDialog("store")}>
          Delete store
        </Button>
      </div>
      <p className="pg-muted">{lastAction}</p>

      <AlertDialog
        open={dialog === "delete"}
        onClose={close}
        onConfirm={() => setLastAction("Deleted “Cotton Kurta – Indigo”.")}
        title="Delete “Cotton Kurta – Indigo”?"
        description="The product and its 4 variants will be removed. This can't be undone."
        confirmLabel="Delete product"
      />

      <AlertDialog
        open={dialog === "ship"}
        onClose={close}
        onConfirm={async () => {
          await wait(1500);
          setLastAction("18 orders marked as shipped.");
        }}
        variant="primary"
        title="Mark 18 orders as shipped?"
        description="Customers will get an SMS with their tracking link."
        confirmLabel="Mark as shipped"
      />

      <AlertDialog
        open={dialog === "fail"}
        onClose={close}
        onConfirm={async () => {
          await wait(1000);
          setLastAction("The refund failed, so the dialog stayed open (see the console).");
          throw new Error("Payment gateway timed out");
        }}
        title="Refund ₹2,349 to Priya Sharma?"
        description="The refund goes back to her UPI account in 3–5 days."
        confirmLabel="Refund"
      />

      <AlertDialog
        open={dialog === "store"}
        onClose={close}
        onConfirm={() => setLastAction("Store deleted.")}
        title="Delete “Sharma Handlooms”?"
        description="All products, orders and payout history will be permanently deleted."
        confirmLabel="Delete store"
        confirmDisabled={confirmation !== "DELETE"}
        initialFocusRef={inputRef}
      >
        <Input
          ref={inputRef}
          label="Type DELETE to confirm"
          value={confirmation}
          onChange={(event) => setConfirmation(event.target.value)}
          autoComplete="off"
        />
      </AlertDialog>
    </div>
  );
}
