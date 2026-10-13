import { Radio, RadioGroup } from "shelf-ui-react";

export default function RadioGroupHorizontal() {
  return (
    <div style={{ display: "grid", gap: 24 }}>
      <RadioGroup label="Environment" orientation="horizontal" defaultValue="production">
        <Radio value="production" label="Production" />
        <Radio value="preview" label="Preview" />
        <Radio value="development" label="Development" />
      </RadioGroup>
      <RadioGroup label="Billing period" orientation="horizontal" size="sm" defaultValue="yearly">
        <Radio value="monthly" label="Monthly" />
        <Radio value="yearly" label="Yearly (2 months free)" />
      </RadioGroup>
    </div>
  );
}
