import { ToggleGroup } from "@shelf-ui/react";

const sizes = ["sm", "md", "lg"];

export default function ToggleGroupSizes() {
  return (
    <div style={{ display: "grid", gap: 16, justifyItems: "center" }}>
      {sizes.map((size) => (
        <ToggleGroup key={size} aria-label="Colour" size={size} defaultValue="indigo">
          <ToggleGroup.Item value="indigo">Indigo</ToggleGroup.Item>
          <ToggleGroup.Item value="maroon">Maroon</ToggleGroup.Item>
          <ToggleGroup.Item value="olive">Olive</ToggleGroup.Item>
        </ToggleGroup>
      ))}
    </div>
  );
}
