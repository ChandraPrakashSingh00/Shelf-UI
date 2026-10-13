import { Button, PinInput } from "@shelf-ui/react";
import { useState } from "react";

export default function PinInputForm() {
  const [message, setMessage] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const otp = new FormData(event.currentTarget).get("otp");
    setMessage(`Order #OD4271 marked as delivered with OTP ${otp}.`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      onReset={() => setMessage("")}
      style={{ display: "grid", gap: 16, justifyItems: "start" }}
    >
      <PinInput
        label="Delivery OTP"
        name="otp"
        length={4}
        required
        otp={false}
        helperText="Ask the customer for the 4-digit OTP shown in their order."
      />
      <div style={{ display: "flex", gap: 8 }}>
        <Button type="submit">Confirm delivery</Button>
        <Button type="reset" variant="outline">
          Clear
        </Button>
      </div>
      <p role="status" style={{ margin: 0, fontSize: 14 }}>
        {message}
      </p>
    </form>
  );
}
