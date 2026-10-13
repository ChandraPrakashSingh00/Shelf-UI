import { Button, Divider, Input } from "shelf-ui-react";

export default function DividerWithLabel() {
  return (
    <div style={{ display: "grid", width: "100%", maxWidth: 360 }}>
      <Input label="Mobile number" type="tel" placeholder="98765 43210" />
      <Button fullWidth style={{ marginTop: 12 }}>
        Get OTP
      </Button>

      <Divider label="OR" spacing="lg" />

      <Button variant="outline" fullWidth>
        Continue with email
      </Button>

      <Divider label="Delivery preferences" labelPosition="start" spacing="lg" />
      <p style={{ margin: 0, color: "var(--shelf-color-text-muted)", fontSize: 14 }}>
        Leave the parcel with the security guard if nobody is home.
      </p>
      <Divider label="Step 1 of 2" labelPosition="end" spacing="lg" />
    </div>
  );
}
