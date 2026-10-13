import { Alert, Button } from "@shelf-ui/react";
import { useState } from "react";

export default function AlertDismissible() {
  const [visible, setVisible] = useState(true);

  if (!visible) {
    return (
      <Button variant="outline" onClick={() => setVisible(true)}>
        Show the alert again
      </Button>
    );
  }

  return (
    <div style={{ width: "100%" }}>
      <Alert
        variant="success"
        title="Project created"
        description="storefront-web is ready to deploy."
        onDismiss={() => setVisible(false)}
      />
    </div>
  );
}
