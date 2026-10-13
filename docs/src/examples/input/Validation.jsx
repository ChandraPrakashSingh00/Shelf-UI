import { Input } from "@shelf-ui/react";
import { useState } from "react";

const isValidEmail = (value) => /^\S+@\S+\.\S+$/.test(value);

export default function InputValidation() {
  const [email, setEmail] = useState("hello@");
  const showError = email !== "" && !isValidEmail(email);

  return (
    <div style={{ width: "100%", maxWidth: 360 }}>
      <Input
        label="Email"
        type="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        error={showError ? "Enter a valid email address, like you@company.com." : undefined}
      />
    </div>
  );
}
