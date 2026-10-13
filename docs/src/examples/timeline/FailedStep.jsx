import { Button, Timeline } from "@shelf-ui/react";

export default function TimelineFailedStep() {
  return (
    <Timeline aria-label="Order #1038 status" style={{ width: "100%", maxWidth: 420 }}>
      <Timeline.Item status="complete" title="Order placed" time="3 Oct, 1:20 PM" />
      <Timeline.Item status="complete" title="Shipped" time="4 Oct, 10:05 AM" />
      <Timeline.Item
        status="error"
        title="Delivery attempt failed"
        time="6 Oct, 5:40 PM"
        description="Nobody was available at the address in Salt Lake, Kolkata. We'll try again tomorrow."
      >
        <Button size="sm" variant="outline">
          Reschedule delivery
        </Button>
      </Timeline.Item>
      <Timeline.Item title="Delivered" />
    </Timeline>
  );
}
