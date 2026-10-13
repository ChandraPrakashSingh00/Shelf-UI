import { FileUpload } from "@shelf-ui/react";
import { useState } from "react";

const MAX_SIZE = 2 * 1024 * 1024;

function explain({ file, errors }) {
  switch (errors[0].code) {
    case "file-invalid-type":
      return `${file.name} isn't a CSV file. In Excel, use File → Save As → CSV and try again.`;
    case "file-too-large":
      return `${file.name} is over 2 MB. Split your catalogue into smaller files.`;
    default:
      return errors[0].message;
  }
}

export default function FileUploadCustomErrors() {
  const [error, setError] = useState();

  return (
    <div style={{ width: "100%", maxWidth: 420 }}>
      <FileUpload
        label="Bulk product import"
        accept=".csv"
        maxSize={MAX_SIZE}
        helperText="One CSV file, up to 2 MB, in the template's column order."
        browseText="Choose a CSV file"
        error={error}
        onValueChange={() => setError(undefined)}
        onReject={(rejections) => setError(explain(rejections[0]))}
      />
    </div>
  );
}
