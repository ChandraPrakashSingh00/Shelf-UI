import { Slider } from "@codecps/ui";

export default function SliderBasic() {
  return (
    <div style={{ display: "grid", gap: 24, width: "100%", maxWidth: 360 }}>
      <Slider label="Volume" defaultValue={60} />
      <Slider label="Brightness" defaultValue={80} />
    </div>
  );
}
