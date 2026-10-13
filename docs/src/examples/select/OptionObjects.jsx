import { Select } from "@shelf-ui/react";

const plans = [
  { value: "starter", label: "Starter · ₹999 per month" },
  { value: "pro", label: "Pro · ₹2,499 per month" },
  { value: "enterprise", label: "Enterprise · Contact sales", disabled: true },
];

export default function SelectOptionObjects() {
  return (
    <div style={{ width: "100%", maxWidth: 360 }}>
      <Select
        label="Plan"
        name="plan"
        options={plans}
        defaultValue="pro"
        helperText="Billed monthly in INR. Change or cancel any time."
      />
    </div>
  );
}
