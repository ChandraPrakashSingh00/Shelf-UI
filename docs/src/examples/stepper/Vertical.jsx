import { Button, Stepper } from "shelf-ui-react";
import { useState } from "react";

const steps = [
  { id: "business", title: "Business details", description: "Store name and category" },
  { id: "gst", title: "GST and PAN", description: "Verified in a few minutes" },
  { id: "bank", title: "Bank account", description: "For weekly payouts" },
  { id: "logo", title: "Store logo", description: "Shown on your storefront", optional: true },
  { id: "product", title: "First product", description: "Go live with one listing" },
];

export default function StepperVertical() {
  const [activeStep, setActiveStep] = useState(2);
  const isDone = activeStep === steps.length;

  return (
    <div style={{ display: "grid", gap: 20, justifyItems: "start" }}>
      <Stepper
        steps={steps}
        activeStep={activeStep}
        orientation="vertical"
        label="Seller onboarding"
      />
      <Button size="sm" onClick={() => setActiveStep(isDone ? 0 : activeStep + 1)}>
        {isDone ? "Start again" : "Complete this step"}
      </Button>
    </div>
  );
}
