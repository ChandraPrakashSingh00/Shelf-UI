import { Button, Stepper } from "@codecps/ui";
import { useRef, useState } from "react";

const steps = [
  { id: "address", title: "Address", description: "Where to deliver" },
  { id: "payment", title: "Payment", description: "UPI, card or COD" },
  { id: "review", title: "Review", description: "Check and place order" },
];

const stepContent = [
  "Deliver to Rohan Mehta, 14 Carter Road, Bandra West, Mumbai 400050.",
  "Pay ₹2,349 with UPI: rohan@okicici.",
  "3 items · ₹2,349 · Arrives by Friday, 10 Oct.",
];

export default function StepperCheckout() {
  const [activeStep, setActiveStep] = useState(0);
  const nextRef = useRef(null);
  const isDone = activeStep === steps.length;
  const isLast = activeStep === steps.length - 1;

  const goBack = () => {
    // Back is about to be disabled on the first step: keep focus on a usable button.
    if (activeStep === 1) nextRef.current?.focus();
    setActiveStep(activeStep - 1);
  };

  const goNext = () => setActiveStep(isDone ? 0 : activeStep + 1);

  let nextLabel = "Continue";
  if (isLast) nextLabel = "Place order";
  else if (isDone) nextLabel = "Start over";

  return (
    <div style={{ display: "grid", gap: 20, width: "100%", maxWidth: 640 }}>
      <Stepper steps={steps} activeStep={activeStep} label="Checkout progress" />

      <p
        style={{
          margin: 0,
          padding: 16,
          border: "1px solid var(--cps-color-border)",
          borderRadius: "var(--cps-radius-md)",
          backgroundColor: "var(--cps-color-surface-muted)",
        }}
      >
        {isDone ? "Order #OD-4821 placed! The invoice is in your email." : stepContent[activeStep]}
      </p>

      <div style={{ display: "flex", gap: 12 }}>
        {!isDone && (
          <Button variant="secondary" disabled={activeStep === 0} onClick={goBack}>
            Back
          </Button>
        )}
        <Button ref={nextRef} style={{ marginInlineStart: "auto" }} onClick={goNext}>
          {nextLabel}
        </Button>
      </div>
    </div>
  );
}
