import { Textarea } from "shelf-ui-react";

export default function TextareaAutoResize() {
  return (
    <div style={{ width: "100%", maxWidth: 420 }}>
      <Textarea
        label="Commit message"
        autoResize
        rows={2}
        defaultValue={
          "Fix build cache on Windows runners\n\nThe cache key now includes the lockfile hash."
        }
        helperText="Grows as you type. Press Enter for a new line."
      />
    </div>
  );
}
