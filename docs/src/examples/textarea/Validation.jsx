import { Textarea } from "@shelf-ui/react";
import { useState } from "react";

const MIN_LENGTH = 20;

export default function TextareaValidation() {
  const [feedback, setFeedback] = useState("The build was slow");
  const tooShort = feedback.trim().length < MIN_LENGTH;

  return (
    <div style={{ width: "100%", maxWidth: 420 }}>
      <Textarea
        label="What could we improve?"
        required
        value={feedback}
        onChange={(event) => setFeedback(event.target.value)}
        showCount
        maxLength={500}
        helperText="Your feedback goes straight to the Acme product team."
        error={tooShort ? `Tell us a little more: at least ${MIN_LENGTH} characters.` : undefined}
      />
    </div>
  );
}
