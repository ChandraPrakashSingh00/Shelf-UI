import { Alert, Button, FileUpload, Progress } from "@shelf-ui/react";
import { useEffect, useState } from "react";

export default function FileUploadUpload() {
  const [files, setFiles] = useState([]);
  // null before uploading, then 0–100.
  const [progress, setProgress] = useState(null);
  const uploading = progress != null && progress < 100;

  // Stands in for a real upload that reports its progress.
  useEffect(() => {
    if (!uploading) return;
    const timeout = setTimeout(() => setProgress((value) => Math.min(value + 20, 100)), 400);
    return () => clearTimeout(timeout);
  }, [uploading, progress]);

  if (progress === 100) {
    return (
      <div style={{ width: "100%", maxWidth: 420 }}>
        <Alert
          variant="success"
          title={`${files.length} ${files.length === 1 ? "invoice" : "invoices"} uploaded`}
          description="They're attached to purchase order #PO-2291 from Sharma Traders, Delhi."
          action={
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setFiles([]);
                setProgress(null);
              }}
            >
              Upload more
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gap: 16, width: "100%", maxWidth: 420 }}>
      <FileUpload
        label="Supplier invoices"
        multiple
        accept=".pdf,image/png,image/jpeg"
        maxSize={10 * 1024 * 1024}
        helperText="PDF, PNG or JPG, up to 10 MB each."
        value={files}
        onValueChange={setFiles}
        disabled={uploading}
      />
      {uploading ? (
        <Progress label="Uploading invoices" value={progress} showValue />
      ) : (
        <Button disabled={files.length === 0} onClick={() => setProgress(0)}>
          {files.length > 1 ? `Upload ${files.length} files` : "Upload"}
        </Button>
      )}
    </div>
  );
}
