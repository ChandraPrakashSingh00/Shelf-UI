import { Select } from "shelf-ui-react";

const frameworks = ["Vite", "Next.js", "Remix", "Astro", "Other"];

export default function SelectBasic() {
  return (
    <div style={{ width: "100%", maxWidth: 360 }}>
      <Select
        label="Framework preset"
        placeholder="Choose a framework"
        options={frameworks}
        helperText="Sets the build command and output folder."
      />
    </div>
  );
}
