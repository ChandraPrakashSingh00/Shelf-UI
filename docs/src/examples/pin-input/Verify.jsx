import { Alert, Button, PinInput } from "@shelf-ui/react";
import { useEffect, useState } from "react";

// In a real app, check the code with your API. In this demo, 246810 is correct.
const DEMO_CODE = "246810";

export default function PinInputVerify() {
  const [code, setCode] = useState("");
  const [checking, setChecking] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (checking == null) return;
    const timeout = setTimeout(() => {
      setResult(checking === DEMO_CODE ? "verified" : "wrong");
      setChecking(null);
    }, 800);
    return () => clearTimeout(timeout);
  }, [checking]);

  const startAgain = () => {
    setCode("");
    setResult(null);
  };

  if (result === "verified") {
    return (
      <Alert
        variant="success"
        title="Phone number verified"
        description="Order #OD4271 will be delivered to Andheri East, Mumbai."
        action={
          <Button size="sm" variant="outline" onClick={startAgain}>
            Start again
          </Button>
        }
      />
    );
  }

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <PinInput
        label="Enter the 6-digit OTP"
        helperText="Sent to +91 98XXX XX210. Hint: try 246810."
        error={
          result === "wrong" ? "That OTP is incorrect. Check the SMS and try again." : undefined
        }
        value={code}
        onValueChange={(value) => {
          setCode(value);
          setResult(null);
        }}
        onComplete={setChecking}
      />
      <p role="status" style={{ margin: 0, minHeight: 20, fontSize: 14 }}>
        {checking != null ? "Verifying…" : ""}
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 14 }}>
        <span style={{ color: "var(--shelf-color-text-muted)" }}>Didn&apos;t get it?</span>
        <Button size="sm" variant="ghost" onClick={startAgain}>
          Resend OTP
        </Button>
      </div>
    </div>
  );
}
