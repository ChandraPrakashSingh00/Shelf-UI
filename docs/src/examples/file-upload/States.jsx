import { FileUpload } from "@codecps/ui";

export default function FileUploadStates() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: 20,
        width: "100%",
        maxWidth: 640,
      }}
    >
      <FileUpload
        label="Cancelled cheque"
        required
        accept=".pdf,image/*"
        error="Upload a cancelled cheque to receive payouts."
      />
      <FileUpload
        label="Store banner"
        accept="image/*"
        disabled
        helperText="Upgrade to CodeCPS Pro to change the banner."
      />
    </div>
  );
}
