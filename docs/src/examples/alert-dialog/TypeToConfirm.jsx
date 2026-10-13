import { AlertDialog, Button, Input } from "shelf-ui-react";
import { useRef, useState } from "react";

const CONFIRMATION = "DELETE";

export default function AlertDialogTypeToConfirm() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const inputRef = useRef(null);

  const close = () => {
    setOpen(false);
    setText("");
  };

  return (
    <>
      <Button variant="danger" onClick={() => setOpen(true)}>
        Delete store
      </Button>
      <AlertDialog
        open={open}
        onClose={close}
        onConfirm={close}
        title="Delete “Sharma Handlooms”?"
        description="All 240 products, 1,318 orders and your payout history will be permanently deleted."
        confirmLabel="Delete store"
        confirmDisabled={text !== CONFIRMATION}
        initialFocusRef={inputRef}
      >
        <Input
          ref={inputRef}
          label={`Type ${CONFIRMATION} to confirm`}
          value={text}
          onChange={(event) => setText(event.target.value)}
          autoComplete="off"
          spellCheck={false}
        />
      </AlertDialog>
    </>
  );
}
