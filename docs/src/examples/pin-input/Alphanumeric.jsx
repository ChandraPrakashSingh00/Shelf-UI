import { PinInput } from "@shelf-ui/react";

export default function PinInputAlphanumeric() {
  return (
    <PinInput
      label="Gift card PIN"
      type="alphanumeric"
      otp={false}
      helperText="Letters and numbers, as printed on the back of the card."
      getInputLabel={(index, length) => `Gift card PIN, character ${index + 1} of ${length}`}
    />
  );
}
