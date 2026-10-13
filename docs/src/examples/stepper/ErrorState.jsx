import { Button, Stepper } from "shelf-ui-react";
import { useState } from "react";

export default function StepperErrorState() {
  const [paymentFailed, setPaymentFailed] = useState(true);

  const steps = [
    { id: "address", title: "Address", description: "Bengaluru 560034" },
    paymentFailed
      ? {
          id: "payment",
          title: "Payment",
          description: "Payment failed. Try another method.",
          status: "error",
        }
      : { id: "payment", title: "Payment", description: "Paid ₹1,299 via UPI" },
    { id: "review", title: "Review" },
  ];

  return (
    <div style={{ display: "grid", gap: 16, justifyItems: "center", width: "100%", maxWidth: 640 }}>
      <Stepper steps={steps} activeStep={paymentFailed ? 1 : 2} label="Checkout progress" />
      <Button variant="outline" onClick={() => setPaymentFailed(!paymentFailed)}>
        {paymentFailed ? "Retry payment" : "Simulate a failed payment"}
      </Button>
    </div>
  );
}
