import { Stepper } from "shelf-ui-react";
import { useState } from "react";

const steps = [
  { id: "cart", title: "Cart" },
  { id: "address", title: "Address" },
  { id: "payment", title: "Payment" },
  { id: "review", title: "Review" },
];

export default function StepperClickable() {
  const [activeStep, setActiveStep] = useState(3);

  return (
    <div style={{ display: "grid", gap: 16, width: "100%", maxWidth: 640 }}>
      {/* Completed steps become buttons that go back to that step. */}
      <Stepper
        steps={steps}
        activeStep={activeStep}
        onStepClick={setActiveStep}
        label="Checkout progress"
      />
      <p style={{ margin: 0, color: "var(--shelf-color-text-muted)", textAlign: "center" }}>
        Editing: {steps[activeStep].title}
      </p>
    </div>
  );
}
