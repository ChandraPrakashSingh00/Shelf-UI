import { Carousel } from "@codecps/ui";

const steps = [
  {
    title: "Connect your repository",
    text: "Import a project from GitHub, GitLab or Bitbucket in a couple of clicks.",
  },
  {
    title: "Check the build settings",
    text: "We detect Vite, Next.js and Astro projects. Change the build command only if you need to.",
  },
  {
    title: "Go live",
    text: "Every push to main deploys to production on codecps.app in about a minute.",
  },
];

export default function CarouselNoLoop() {
  return (
    <Carousel label="Getting started" loop={false} style={{ width: "100%", maxWidth: 560 }}>
      {steps.map((step, stepIndex) => (
        <Carousel.Slide key={step.title} aria-label={`Step ${stepIndex + 1} of ${steps.length}`}>
          <div
            style={{
              display: "grid",
              alignContent: "center",
              justifyItems: "center",
              gap: 8,
              minHeight: 200,
              padding: "28px 72px",
              textAlign: "center",
              background: "var(--cps-color-surface-muted)",
            }}
          >
            <span
              aria-hidden="true"
              style={{
                display: "grid",
                placeItems: "center",
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "var(--cps-color-primary)",
                color: "var(--cps-color-on-primary)",
                fontWeight: 600,
              }}
            >
              {stepIndex + 1}
            </span>
            <strong style={{ fontSize: 16 }}>{step.title}</strong>
            <span style={{ color: "var(--cps-color-text-muted)" }}>{step.text}</span>
          </div>
        </Carousel.Slide>
      ))}
    </Carousel>
  );
}
