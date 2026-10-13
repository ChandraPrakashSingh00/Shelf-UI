import { Timeline } from "shelf-ui-react";

export default function TimelineHorizontal() {
  return (
    <Timeline orientation="horizontal" aria-label="Order #1041 status">
      <Timeline.Item status="complete" title="Placed" time="5 Oct" dateTime="2026-10-05" />
      <Timeline.Item status="complete" title="Packed" time="5 Oct" dateTime="2026-10-05" />
      <Timeline.Item status="current" title="Shipped" time="6 Oct" dateTime="2026-10-06" />
      <Timeline.Item title="Out for delivery" />
      <Timeline.Item title="Delivered" time="Expected 9 Oct" />
    </Timeline>
  );
}
