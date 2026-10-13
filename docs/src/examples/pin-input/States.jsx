import { PinInput } from "@shelf-ui/react";

export default function PinInputStates() {
  return (
    <div style={{ display: "grid", gap: 24 }}>
      <PinInput label="Small" size="sm" length={4} defaultValue="42" />
      <PinInput label="Large" size="lg" length={4} defaultValue="42" />
      <PinInput label="Expired OTP" length={4} defaultValue="7302" error="This OTP has expired." />
      <PinInput label="Disabled" length={4} disabled />
    </div>
  );
}
