import { Carousel } from "shelf-ui-react";
import { definePlayground } from "../../components/LivePlayground.jsx";
import Announcements from "../../examples/carousel/Announcements.jsx";
import announcementsCode from "../../examples/carousel/Announcements.jsx?raw";
import AutoPlay from "../../examples/carousel/AutoPlay.jsx";
import autoPlayCode from "../../examples/carousel/AutoPlay.jsx?raw";
import Controlled from "../../examples/carousel/Controlled.jsx";
import controlledCode from "../../examples/carousel/Controlled.jsx?raw";
import dashboard from "../../examples/carousel/dashboard.svg";
import deployments from "../../examples/carousel/deployments.svg";
import Images from "../../examples/carousel/Images.jsx";
import imagesCode from "../../examples/carousel/Images.jsx?raw";
import NoLoop from "../../examples/carousel/NoLoop.jsx";
import noLoopCode from "../../examples/carousel/NoLoop.jsx?raw";
import team from "../../examples/carousel/team.svg";
import { expr, formatJsx, withImport } from "../../lib/jsx.js";

const intervals = ["3000", "5000", "8000"];
const playgroundSlides = ["Instant rollbacks", "Preview deployments", "Usage insights"];

function CarouselThumbnail() {
  return (
    // `zoom` shrinks the arrows and dots along with the slides.
    <Carousel label="Preview" style={{ width: 256, zoom: 0.72 }}>
      {[dashboard, deployments, team].map((src) => (
        <Carousel.Slide key={src}>
          <img
            src={src}
            alt=""
            width={800}
            height={450}
            style={{ display: "block", width: "100%", height: "auto" }}
          />
        </Carousel.Slide>
      ))}
    </Carousel>
  );
}

export const carouselDoc = {
  slug: "carousel",
  name: "Carousel",
  category: "Media",
  summary: "Shows a set of slides one at a time, with arrows, dots and optional auto-play.",
  description:
    "A slideshow for images or content, like product screenshots or announcements. People move between slides with the arrows, the dots or a swipe; with `autoPlay`, slides also advance on their own, with a button to stop them. Compose it from `Carousel.Slide` elements.",
  keywords: [
    "slider",
    "slideshow",
    "gallery",
    "image slider",
    "banner",
    "rotator",
    "swipe",
    "autoplay",
  ],
  imports: ["Carousel"],
  Thumbnail: CarouselThumbnail,
  Playground: definePlayground({
    defaults: {
      autoPlay: false,
      interval: "5000",
      loop: true,
      showArrows: true,
      showDots: true,
    },
    controls: {
      autoPlay: { type: "boolean", label: "Auto-play" },
      interval: { type: "select", label: "Interval (ms)", options: intervals },
      loop: { type: "boolean", label: "Loop" },
      showArrows: { type: "boolean", label: "Show arrows" },
      showDots: { type: "boolean", label: "Show dots" },
    },
    render: (values) => (
      <Carousel
        label="Release highlights"
        autoPlay={values.autoPlay}
        interval={Number(values.interval)}
        loop={values.loop}
        showArrows={values.showArrows}
        showDots={values.showDots}
        style={{ width: "100%", maxWidth: 520 }}
      >
        {playgroundSlides.map((title) => (
          <Carousel.Slide key={title}>
            <div
              style={{
                display: "grid",
                placeItems: "center",
                minHeight: 180,
                padding: "24px 72px",
                background: "var(--shelf-color-primary-subtle)",
                color: "var(--shelf-color-primary-text)",
                fontSize: 20,
                fontWeight: 600,
              }}
            >
              {title}
            </div>
          </Carousel.Slide>
        ))}
      </Carousel>
    ),
    code: (values) => {
      // formatJsx writes a self-closing tag; open it up around the slides.
      const openingTag = formatJsx(
        "Carousel",
        {
          label: "Release highlights",
          autoPlay: values.autoPlay,
          interval: values.autoPlay ? Number(values.interval) : undefined,
          loop: values.loop ? undefined : expr("false"),
          showArrows: values.showArrows ? undefined : expr("false"),
          showDots: values.showDots ? undefined : expr("false"),
        },
        undefined,
        { defaults: { interval: 5000 } },
      ).replace(/ ?\/>$/, ">");
      const slides = playgroundSlides.map((title) => `  <Carousel.Slide>${title}</Carousel.Slide>`);
      return withImport(["Carousel"], [openingTag, ...slides, "</Carousel>"].join("\n"));
    },
  }),
  examples: [
    {
      id: "images",
      title: "Image slider",
      description:
        "Use the arrows or the dots, or swipe on a touch screen. Give every image meaningful `alt` text.",
      Component: Images,
      code: imagesCode,
    },
    {
      id: "content",
      title: "Content slides",
      description:
        "Slides can hold any content, including links and buttons. Only the current slide can be focused. Name slides after a visible heading with `aria-labelledby`.",
      Component: Announcements,
      code: announcementsCode,
    },
    {
      id: "auto-play",
      title: "Auto-play",
      description:
        "Slides advance every `interval` milliseconds. Rotation pauses while you point at the carousel or focus is inside it, and the button next to the dots stops and restarts it. It starts stopped for people who prefer reduced motion.",
      Component: AutoPlay,
      code: autoPlayCode,
    },
    {
      id: "controlled",
      title: "Controlled",
      description:
        "Pass `index` and `onIndexChange` to drive the slide from your own state, here from a row of thumbnails.",
      Component: Controlled,
      code: controlledCode,
    },
    {
      id: "no-loop",
      title: "Without looping",
      description:
        "With `loop={false}`, the carousel stops at the first and last slides, where the arrows are disabled. Slides here are named “Step 1 of 3” with `aria-label`.",
      Component: NoLoop,
      code: noLoopCode,
    },
  ],
  api: [
    {
      title: "Carousel",
      description:
        "Root `<section>`; accepts its native attributes, and the `ref` points to it. Its children must be `Carousel.Slide` elements.",
      props: [
        {
          name: "label",
          type: "string",
          required: true,
          description:
            "Accessible name, e.g. “Featured projects”. Leave out the word “carousel”: screen readers already announce it.",
        },
        {
          name: "index",
          type: "number",
          description: "Current slide, counted from 0 (controlled).",
        },
        {
          name: "defaultIndex",
          type: "number",
          default: "0",
          description: "Initial slide (uncontrolled).",
        },
        {
          name: "onIndexChange",
          type: "function(index)",
          description: "Called with the index of the slide to show.",
        },
        {
          name: "loop",
          type: "boolean",
          default: "true",
          description:
            "Next on the last slide shows the first, and previous on the first shows the last. Without it, the arrows are disabled at the ends and rotation stops on the last slide.",
        },
        {
          name: "autoPlay",
          type: "boolean",
          default: "false",
          description:
            "Advances to the next slide every `interval` and adds a button to stop and restart rotation. Pauses on hover and while focus is inside; starts stopped when the user prefers reduced motion.",
        },
        {
          name: "interval",
          type: "number",
          default: "5000",
          description: "How long each slide is shown while rotating, in milliseconds.",
        },
        {
          name: "showArrows",
          type: "boolean",
          default: "true",
          description: "Shows the previous and next buttons over the slides.",
        },
        {
          name: "showDots",
          type: "boolean",
          default: "true",
          description: "Shows a button for each slide below the slides.",
        },
        {
          name: "previousLabel",
          type: "string",
          default: '"Previous slide"',
          description: "Accessible name of the previous button.",
        },
        {
          name: "nextLabel",
          type: "string",
          default: '"Next slide"',
          description: "Accessible name of the next button.",
        },
        { name: "children", type: "node", description: "The slides." },
      ],
    },
    {
      title: "Carousel.Slide",
      description:
        "A `<div>`; also exported as `CarouselSlide`. Accepts its native attributes, and the `ref` points to it.",
      props: [
        {
          name: "aria-label",
          type: "string",
          description:
            "Accessible name. Defaults to the slide's position, like “2 of 5”. To use a visible heading instead, pass `aria-labelledby` with its `id`.",
        },
        { name: "children", type: "node", description: "The slide's content." },
      ],
    },
  ],
  keyboard: [
    {
      keys: ["Tab", "Shift + Tab"],
      description:
        "Moves through the rotation button, the arrows, the current slide's content and the dots. Hidden slides are skipped.",
    },
    {
      keys: ["Enter", "Space"],
      description:
        "Activates the focused button. Focus stays on it, so you can press it again to keep going.",
    },
  ],
  accessibility: [
    'Follows the WAI-ARIA carousel pattern: a `<section>` landmark with `aria-roledescription="carousel"`, named by `label`, containing slides with `role="group"` and `aria-roledescription="slide"`.',
    "Only the current slide is exposed. The others are `aria-hidden` and hidden with `visibility: hidden`, so their links and buttons can't be focused.",
    'The slides sit in a polite live region, so screen readers announce the slides people move to. While the carousel rotates on its own, it is set to `aria-live="off"`.',
    "Automatic rotation pauses while the pointer is over the carousel or focus is inside it, and starts stopped when the user prefers reduced motion. The stop/start button comes first in the Tab order, before the rotating content.",
    "Arrows, dots and the rotation button are native buttons, and every swipe has a button alternative. Without `loop`, the arrows at the ends are marked `aria-disabled` rather than `disabled`, so keyboard focus isn't lost.",
  ],
};
