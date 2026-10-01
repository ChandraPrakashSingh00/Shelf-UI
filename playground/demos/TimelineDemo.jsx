import { Button, Timeline } from "@codecps/ui";
import { useState } from "react";

const steps = [
  { title: "Order placed", time: "6 Oct, 10:42 AM", description: "Paid ₹2,499 via UPI." },
  { title: "Packed", time: "6 Oct, 6:15 PM", description: "Bhiwandi warehouse" },
  { title: "Shipped", time: "7 Oct, 9:30 AM", description: "Blue Dart · AWB 7788 1234 56" },
  { title: "Out for delivery", time: "8 Oct, 8:05 AM", description: "Arriving by 7 PM" },
  { title: "Delivered", time: "8 Oct, 5:12 PM", description: "Handed to Priya" },
];

const statusOf = (index, current) =>
  index < current || current === steps.length
    ? "complete"
    : index === current
      ? "current"
      : "upcoming";

export function TimelineDemo() {
  const [current, setCurrent] = useState(3);

  return (
    <div className="pg-stack">
      <div className="pg-row">
        <Button
          size="sm"
          variant="outline"
          disabled={current === 0}
          onClick={() => setCurrent((step) => step - 1)}
        >
          Previous step
        </Button>
        <Button
          size="sm"
          disabled={current === steps.length}
          onClick={() => setCurrent((step) => step + 1)}
        >
          Next step
        </Button>
      </div>
      <div className="pg-grid">
        <Timeline aria-label="Order #1042 status">
          {steps.map((step, index) => {
            const status = statusOf(index, current);
            return (
              <Timeline.Item
                key={step.title}
                status={status}
                title={step.title}
                time={status === "upcoming" ? undefined : step.time}
                description={status === "upcoming" ? undefined : step.description}
              />
            );
          })}
        </Timeline>
        <Timeline aria-label="Order #1038 status" size="sm">
          <Timeline.Item status="complete" title="Order placed" time="3 Oct, 1:20 PM" />
          <Timeline.Item status="complete" title="Shipped" time="4 Oct, 10:05 AM" />
          <Timeline.Item
            status="error"
            title="Delivery attempt failed"
            time="6 Oct, 5:40 PM"
            description="Customer unavailable. We'll try again tomorrow."
          />
          <Timeline.Item title="Delivered" />
        </Timeline>
      </div>
      <Timeline orientation="horizontal" aria-label="Order #1041 status">
        {steps.map((step, index) => (
          <Timeline.Item
            key={step.title}
            status={statusOf(index, current)}
            title={step.title}
            time={index <= current ? step.time : undefined}
          />
        ))}
      </Timeline>
    </div>
  );
}
