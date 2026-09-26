import { Toast } from "@codecps/ui";

export default function ToastStandalone() {
  return (
    <div style={{ width: "100%", maxWidth: 380 }}>
      <Toast
        variant="success"
        title="Invite sent"
        message="priya@codecps.com can now join your workspace."
        duration={Infinity}
      />
    </div>
  );
}
