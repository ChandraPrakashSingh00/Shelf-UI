import { Button, Progress } from "@shelf-ui/react";
import { useEffect, useState } from "react";

const FILE_SIZE_MB = 24;

export default function ProgressUpload() {
  // Megabytes sent so far; null until the upload starts.
  const [uploaded, setUploaded] = useState(null);
  const isUploading = uploaded !== null && uploaded < FILE_SIZE_MB;
  const isDone = uploaded === FILE_SIZE_MB;

  // Simulates the upload: 2 MB every 250 ms until the whole file is sent.
  useEffect(() => {
    if (!isUploading) return;
    const interval = setInterval(() => {
      setUploaded((sent) => Math.min(sent + 2, FILE_SIZE_MB));
    }, 250);
    return () => clearInterval(interval);
  }, [isUploading]);

  return (
    <div style={{ display: "grid", gap: 16, width: "100%", maxWidth: 420 }}>
      <Progress
        label="project-assets.zip"
        value={uploaded ?? 0}
        max={FILE_SIZE_MB}
        showValue
        formatValue={(value, max) => `${value} MB of ${max} MB`}
        variant={isDone ? "success" : "primary"}
      />
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Button size="sm" loading={isUploading} onClick={() => setUploaded(0)}>
          {isUploading ? "Uploading…" : isDone ? "Upload again" : "Start upload"}
        </Button>
        {/* Progress bars aren't announced as they change; this status message is. */}
        <span role="status">{isDone ? "Uploaded" : ""}</span>
      </div>
    </div>
  );
}
