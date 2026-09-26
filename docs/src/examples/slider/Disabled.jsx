import { Slider } from "@codecps/ui";

export default function SliderDisabled() {
  return (
    <div style={{ width: "100%", maxWidth: 360 }}>
      <Slider
        label="Log retention"
        min={1}
        max={30}
        defaultValue={7}
        formatValue={(value) => `${value} days`}
        helperText="Upgrade to Pro to keep logs for up to 30 days."
        disabled
      />
    </div>
  );
}
