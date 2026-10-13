import { Button, Input, Modal } from "shelf-ui-react";
import { useState } from "react";

export default function ModalWithForm() {
  const [open, setOpen] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setOpen(false);
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>Invite member</Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Invite a team member"
        description="They'll get an email with a link to join your workspace."
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" form="invite-form">
              Send invite
            </Button>
          </>
        }
      >
        <form id="invite-form" onSubmit={handleSubmit}>
          <Input label="Email" type="email" required autoFocus placeholder="teammate@company.com" />
        </form>
      </Modal>
    </>
  );
}
