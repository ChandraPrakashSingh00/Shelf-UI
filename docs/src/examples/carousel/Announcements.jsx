import { Badge, Button, Carousel } from "@shelf-ui/react";
import { useId } from "react";

const announcements = [
  {
    id: "previews",
    tag: "New",
    title: "Preview deployments for every pull request",
    text: "Share a live URL with reviewers before you merge. Available on every plan.",
    action: "Try previews",
  },
  {
    id: "pro",
    tag: "Pricing",
    title: "Pro plan, now ₹999 per month",
    text: "Unlimited projects, custom domains and priority support for growing teams.",
    action: "Compare plans",
  },
  {
    id: "summit",
    tag: "Event",
    title: "Acme Summit 2026 in Bengaluru",
    text: "Two days of talks and hands-on workshops on 14–15 November. Early-bird passes close soon.",
    action: "Book your seat",
  },
];

export default function CarouselAnnouncements() {
  const id = useId();

  return (
    <Carousel label="Announcements" style={{ width: "100%", maxWidth: 640 }}>
      {announcements.map((item) => (
        // Name each slide after its visible heading.
        <Carousel.Slide key={item.id} aria-labelledby={`${id}-${item.id}`}>
          <div
            style={{
              display: "grid",
              alignContent: "center",
              justifyItems: "start",
              gap: 12,
              minHeight: 240,
              padding: "32px 72px",
              background: "var(--shelf-color-primary-subtle)",
            }}
          >
            <Badge variant="primary">{item.tag}</Badge>
            <h3 id={`${id}-${item.id}`} style={{ margin: 0, fontSize: 22, lineHeight: 1.3 }}>
              {item.title}
            </h3>
            <p style={{ margin: 0, maxWidth: 420, color: "var(--shelf-color-text-muted)" }}>
              {item.text}
            </p>
            <Button size="sm">{item.action}</Button>
          </div>
        </Carousel.Slide>
      ))}
    </Carousel>
  );
}
