import { Carousel } from "@shelf-ui/react";
import { useState } from "react";
import dashboard from "./dashboard.svg";
import deployments from "./deployments.svg";
import team from "./team.svg";

const screenshots = [
  {
    title: "Dashboard",
    src: dashboard,
    alt: "Project dashboard with visitor, uptime and build-time stats above a rising traffic chart",
  },
  {
    title: "Deployments",
    src: deployments,
    alt: "Deployment pipeline: build and tests have passed and the release is going to production",
  },
  {
    title: "Team",
    src: team,
    alt: "Five team members chatting in a shared project workspace",
  },
];

export default function CarouselControlled() {
  const [index, setIndex] = useState(0);

  return (
    <div style={{ display: "grid", gap: 12, width: "100%", maxWidth: 560 }}>
      <Carousel label="Product screenshots" index={index} onIndexChange={setIndex} showDots={false}>
        {screenshots.map((screenshot) => (
          <Carousel.Slide key={screenshot.title}>
            <img
              src={screenshot.src}
              alt={screenshot.alt}
              width={800}
              height={450}
              style={{ display: "block", width: "100%", height: "auto" }}
            />
          </Carousel.Slide>
        ))}
      </Carousel>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <div role="group" aria-label="Screenshots" style={{ display: "flex", gap: 8 }}>
          {screenshots.map((screenshot, screenshotIndex) => {
            const current = screenshotIndex === index;
            return (
              <button
                key={screenshot.title}
                type="button"
                aria-label={screenshot.title}
                aria-current={current || undefined}
                onClick={() => setIndex(screenshotIndex)}
                style={{
                  width: 88,
                  padding: 0,
                  overflow: "hidden",
                  border: "2px solid",
                  borderColor: current ? "var(--shelf-color-primary)" : "transparent",
                  borderRadius: 8,
                  background: "none",
                  cursor: "pointer",
                  opacity: current ? 1 : 0.7,
                }}
              >
                <img
                  src={screenshot.src}
                  alt=""
                  width={800}
                  height={450}
                  style={{ display: "block", width: "100%", height: "auto" }}
                />
              </button>
            );
          })}
        </div>
        <span style={{ color: "var(--shelf-color-text-muted)", fontSize: 14 }}>
          Slide {index + 1} of {screenshots.length}: {screenshots[index].title}
        </span>
      </div>
    </div>
  );
}
