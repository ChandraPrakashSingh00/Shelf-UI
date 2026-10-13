import { Radio, RadioGroup } from "shelf-ui-react";

export default function RadioGroupBasic() {
  return (
    <RadioGroup label="Deployment region" defaultValue="mumbai">
      <Radio value="mumbai" label="Mumbai (ap-south-1)" />
      <Radio value="hyderabad" label="Hyderabad (ap-south-2)" />
      <Radio value="singapore" label="Singapore (ap-southeast-1)" />
    </RadioGroup>
  );
}
