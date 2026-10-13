import { Carousel } from "shelf-ui-react";

const tips = [
  {
    title: "Roll back in one click",
    text: "Every deployment is kept. Promote an earlier build from the Deployments tab if a release breaks.",
  },
  {
    title: "Protect preview links",
    text: "Turn on password protection for preview deployments in Settings → Security.",
  },
  {
    title: "Stay under your quota",
    text: "Get an email when bandwidth crosses 80% of your plan's monthly limit.",
  },
];

export default function CarouselAutoPlay() {
  return (
    <Carousel label="Tips" autoPlay interval={4000} style={{ width: "100%", maxWidth: 560 }}>
      {tips.map((tip) => (
        <Carousel.Slide key={tip.title}>
          <div
            style={{
              display: "grid",
              alignContent: "center",
              gap: 8,
              minHeight: 168,
              padding: "28px 72px",
              border: "1px solid var(--shelf-color-border)",
              borderRadius: 12,
              background: "var(--shelf-color-surface)",
            }}
          >
            <strong style={{ fontSize: 16 }}>{tip.title}</strong>
            <span style={{ color: "var(--shelf-color-text-muted)" }}>{tip.text}</span>
          </div>
        </Carousel.Slide>
      ))}
    </Carousel>
  );
}
