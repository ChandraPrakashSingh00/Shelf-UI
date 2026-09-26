import { Select } from "@codecps/ui";

function GlobeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
    </svg>
  );
}

export default function SelectGroups() {
  return (
    <div style={{ width: "100%", maxWidth: 360 }}>
      <Select
        label="Region"
        defaultValue="ap-south-1"
        leftIcon={<GlobeIcon />}
        helperText="Run your functions close to your users."
      >
        <optgroup label="Asia Pacific">
          <option value="ap-south-1">Mumbai (ap-south-1)</option>
          <option value="ap-south-2">Hyderabad (ap-south-2)</option>
          <option value="ap-southeast-1">Singapore (ap-southeast-1)</option>
        </optgroup>
        <optgroup label="Europe">
          <option value="eu-central-1">Frankfurt (eu-central-1)</option>
          <option value="eu-west-2">London (eu-west-2)</option>
        </optgroup>
        <optgroup label="North America">
          <option value="us-east-1">N. Virginia (us-east-1)</option>
        </optgroup>
      </Select>
    </div>
  );
}
