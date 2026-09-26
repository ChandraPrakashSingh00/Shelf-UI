import { Avatar } from "@codecps/ui";
import aditi from "./aditi.svg";

const sizes = ["xs", "sm", "md", "lg", "xl"];

export default function AvatarSizes() {
  return (
    <div style={{ display: "grid", gap: 16, justifyItems: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {sizes.map((size) => (
          <Avatar key={size} src={aditi} name="Aditi Rao" size={size} />
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {sizes.map((size) => (
          <Avatar key={size} name="Rohan Mehta" size={size} />
        ))}
      </div>
    </div>
  );
}
