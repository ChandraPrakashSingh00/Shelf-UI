import { Timeline } from "@shelf-ui/react";

export default function TimelineOrderTracking() {
  return (
    <Timeline aria-label="Order #1042 status" style={{ width: "100%", maxWidth: 420 }}>
      <Timeline.Item
        status="complete"
        title="Order placed"
        time="6 Oct, 10:42 AM"
        dateTime="2026-10-06T10:42"
        description="Paid ₹2,499 via UPI."
      />
      <Timeline.Item
        status="complete"
        title="Packed"
        time="6 Oct, 6:15 PM"
        dateTime="2026-10-06T18:15"
        description="Packed at our Bhiwandi warehouse."
      />
      <Timeline.Item
        status="complete"
        title="Shipped"
        time="7 Oct, 9:30 AM"
        dateTime="2026-10-07T09:30"
        description="Blue Dart · AWB 7788 1234 56"
      />
      <Timeline.Item
        status="current"
        title="Out for delivery"
        time="8 Oct, 8:05 AM"
        dateTime="2026-10-08T08:05"
        description="Arriving today by 7 PM in Andheri West, Mumbai."
      />
      <Timeline.Item title="Delivered" description="Expected today" />
    </Timeline>
  );
}
