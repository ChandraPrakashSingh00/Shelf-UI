import { Button, Select } from "@shelf-ui/react";
import { useState } from "react";

const roles = [
  { value: "admin", label: "Admin" },
  { value: "developer", label: "Developer" },
  { value: "viewer", label: "Viewer" },
];

export default function SelectValidation() {
  const [role, setRole] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      style={{ display: "grid", gap: 16, width: "100%", maxWidth: 360 }}
    >
      <Select
        label="Role for Ananya Iyer"
        required
        placeholder="Select a role"
        options={roles}
        value={role}
        onChange={(event) => setRole(event.target.value)}
        helperText="Admins can also manage billing and team members."
        error={submitted && role === "" ? "Choose a role to send the invite." : undefined}
      />
      <div>
        <Button type="submit">Send invite</Button>
      </div>
    </form>
  );
}
