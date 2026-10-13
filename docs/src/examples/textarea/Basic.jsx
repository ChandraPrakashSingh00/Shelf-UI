import { Textarea } from "@shelf-ui/react";

export default function TextareaBasic() {
  return (
    <div style={{ width: "100%", maxWidth: 420 }}>
      <Textarea
        label="Project description"
        placeholder="What are you building?"
        helperText="Shown on the project's overview page."
      />
    </div>
  );
}
