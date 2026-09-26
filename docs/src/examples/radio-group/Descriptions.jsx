import { Radio, RadioGroup } from "@codecps/ui";

export default function RadioGroupDescriptions() {
  return (
    <RadioGroup
      label="Plan"
      description="You can switch plans at any time."
      defaultValue="pro"
      style={{ width: "100%", maxWidth: 400 }}
    >
      <Radio
        value="starter"
        label="Starter"
        description="₹999 per month · 3 projects · Community support"
      />
      <Radio
        value="pro"
        label="Pro"
        description="₹2,499 per month · Unlimited projects · Priority support"
      />
      <Radio
        value="enterprise"
        label="Enterprise"
        description="Custom pricing · SSO, audit logs and a dedicated manager"
      />
    </RadioGroup>
  );
}
