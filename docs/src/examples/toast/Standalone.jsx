import { Toast } from "@shelf-ui/react";

export default function ToastStandalone() {
  return (
    <div style={{ width: "100%", maxWidth: 380 }}>
      <Toast
        variant="success"
        title="Invite sent"
        message="priya@example.com can now join your workspace."
        duration={Infinity}
      />
    </div>
  );
}
