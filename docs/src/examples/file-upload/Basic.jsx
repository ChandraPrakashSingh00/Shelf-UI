import { FileUpload } from "@shelf-ui/react";

export default function FileUploadBasic() {
  return (
    <div style={{ width: "100%", maxWidth: 420 }}>
      <FileUpload
        label="GST certificate"
        accept=".pdf"
        maxSize={10 * 1024 * 1024}
        helperText="PDF, up to 10 MB."
      />
    </div>
  );
}
