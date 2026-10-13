import { Textarea } from "@shelf-ui/react";

export default function TextareaCharacterCount() {
  return (
    <div style={{ display: "grid", gap: 16, width: "100%", maxWidth: 420 }}>
      <Textarea
        label="Deployment note"
        showCount
        maxLength={140}
        defaultValue="Hotfix: retry failed Razorpay webhooks."
        helperText="Shown next to the deployment in the activity feed."
      />
      <Textarea label="Release notes" showCount rows={4} placeholder="What changed in v2.4?" />
    </div>
  );
}
