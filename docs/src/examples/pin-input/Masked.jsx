import { PinInput } from "shelf-ui-react";

export default function PinInputMasked() {
  return (
    <PinInput
      label="Enter UPI PIN"
      length={4}
      mask
      otp={false}
      placeholder="○"
      helperText="Never share your UPI PIN, not even with Acme support."
    />
  );
}
