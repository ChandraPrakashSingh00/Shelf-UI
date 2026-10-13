import { Radio, RadioGroup } from "shelf-ui-react";

export default function RadioGroupDisabled() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 40 }}>
      <RadioGroup label="Build machine" defaultValue="standard">
        <Radio value="standard" label="Standard" description="2 vCPU · 4 GB RAM" />
        <Radio value="performance" label="Performance" description="8 vCPU · 16 GB RAM" />
        <Radio value="turbo" label="Turbo" description="Available on Enterprise" disabled />
      </RadioGroup>
      <RadioGroup
        label="Data residency"
        description="Locked after the project is created."
        defaultValue="india"
        disabled
      >
        <Radio value="india" label="India" />
        <Radio value="eu" label="European Union" />
      </RadioGroup>
    </div>
  );
}
