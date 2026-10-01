import { Button, FileUpload } from "@codecps/ui";
import { useState } from "react";

export default function FileUploadForm() {
  const [submitted, setSubmitted] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    const documents = new FormData(event.currentTarget).getAll("documents");
    setSubmitted(documents.filter((file) => file.name).map((file) => file.name));
  };

  return (
    <form
      onSubmit={handleSubmit}
      onReset={() => setSubmitted(null)}
      style={{ display: "grid", gap: 16, width: "100%", maxWidth: 420 }}
    >
      <FileUpload
        label="KYC documents"
        name="documents"
        multiple
        maxFiles={3}
        required
        accept=".pdf,image/png,image/jpeg"
        helperText="PAN card, Aadhaar and address proof — PDF or image."
      />
      <div style={{ display: "flex", gap: 8 }}>
        <Button type="submit">Submit for review</Button>
        <Button type="reset" variant="outline">
          Reset
        </Button>
      </div>
      {submitted && (
        <p role="status" style={{ margin: 0, fontSize: 14 }}>
          Submitted {submitted.length} {submitted.length === 1 ? "file" : "files"}:{" "}
          {submitted.join(", ")}
        </p>
      )}
    </form>
  );
}
