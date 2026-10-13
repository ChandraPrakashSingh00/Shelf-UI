import { Alert, Button } from "@shelf-ui/react";

export default function AlertWithAction() {
  return (
    <div style={{ width: "100%" }}>
      <Alert
        variant="warning"
        title="Your API key expires in 7 days"
        description="Rotate it now to avoid interrupting your integrations."
        action={
          <Button size="sm" variant="outline">
            Rotate key
          </Button>
        }
      />
    </div>
  );
}
