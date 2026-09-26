import { Carousel } from "@codecps/ui";
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

export default function CarouselImages() {
  return (
    <Carousel label="Product screenshots" style={{ width: "100%", maxWidth: 640 }}>
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
  );
}
