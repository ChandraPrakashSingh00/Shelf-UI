import { PinInput } from "@codecps/ui";
import { useState } from "react";

export function PinInputDemo() {
  const [completed, setCompleted] = useState("");
  return (
    <div className="pg-stack">
      <PinInput
        label="Enter OTP"
        helperText={completed ? `Verifying ${completed}…` : "Sent to +91 98XXX XX210."}
        onValueChange={() => setCompleted("")}
        onComplete={setCompleted}
      />
      <div className="pg-row">
        <PinInput label="UPI PIN" length={4} mask otp={false} size="sm" placeholder="○" />
        <PinInput label="Gift card PIN" type="alphanumeric" otp={false} size="sm" />
      </div>
      <div className="pg-row">
        <PinInput
          label="Expired OTP"
          length={4}
          defaultValue="7302"
          error="This OTP has expired."
        />
        <PinInput label="Disabled" length={4} disabled />
      </div>
    </div>
  );
}
