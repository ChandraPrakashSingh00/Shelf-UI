import { Button, Stepper } from "@codecps/ui";
import { useState } from "react";

const checkoutSteps = [
  { id: "address", title: "Address", description: "Mumbai 400050" },
  { id: "payment", title: "Payment", description: "UPI, card or COD" },
  { id: "review", title: "Review", description: "Place your order" },
];

const onboardingSteps = [
  { id: "business", title: "Business details", description: "Store name and category" },
  { id: "gst", title: "GST and PAN", description: "Verification failed", status: "error" },
  { id: "bank", title: "Bank account", description: "For weekly payouts" },
  { id: "logo", title: "Store logo", optional: true },
];

export function StepperDemo() {
  const [activeStep, setActiveStep] = useState(1);

  return (
    <div className="pg-stack">
      <Stepper
        steps={checkoutSteps}
        activeStep={activeStep}
        onStepClick={setActiveStep}
        label="Checkout progress"
      />
      <div className="pg-row">
        <Button
          variant="secondary"
          disabled={activeStep === 0}
          onClick={() => setActiveStep(activeStep - 1)}
        >
          Back
        </Button>
        <Button
          disabled={activeStep === checkoutSteps.length}
          onClick={() => setActiveStep(activeStep + 1)}
        >
          {activeStep >= checkoutSteps.length - 1 ? "Place order" : "Continue"}
        </Button>
      </div>

      <div className="pg-grid">
        <Stepper
          steps={onboardingSteps}
          activeStep={1}
          orientation="vertical"
          label="Seller onboarding"
        />
        <div className="pg-narrow" style={{ maxWidth: 300 }}>
          <p className="pg-muted">Small, in a narrow container (compact layout):</p>
          <Stepper steps={checkoutSteps} activeStep={1} size="sm" />
        </div>
      </div>
    </div>
  );
}
