import { Button, Checkbox } from "shelf-ui-react";
import { useState } from "react";

export default function CheckboxValidation() {
  const [accepted, setAccepted] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      style={{ display: "grid", gap: 16, width: "100%", maxWidth: 420 }}
    >
      <Checkbox
        name="terms"
        label="I agree to the Acme Terms of Service and Privacy Policy"
        required
        checked={accepted}
        onCheckedChange={setAccepted}
        error={submitted && !accepted ? "Accept the terms to create your workspace." : undefined}
      />
      <div>
        <Button type="submit">Create workspace</Button>
      </div>
    </form>
  );
}
