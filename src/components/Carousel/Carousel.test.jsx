import { act, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Carousel, CarouselSlide } from "./Carousel.jsx";

const projects = ["Dashboard", "Deployments", "Team"];

const slides = projects.map((name) => (
  <Carousel.Slide key={name}>
    <h3>{name}</h3>
    <a href={`#${name.toLowerCase()}`}>Open {name}</a>
  </Carousel.Slide>
));

function renderCarousel(props = {}) {
  return render(
    <>
      <Carousel label="Featured projects" {...props}>
        {slides}
      </Carousel>
      <button type="button">Outside</button>
    </>,
  );
}

// Only the current slide is exposed to assistive technology.
const currentSlide = () => screen.getByRole("group", { name: / of \d$/ });
// Hidden slides have no computed accessible name, so find them by role description.
const allSlides = () =>
  screen
    .getAllByRole("group", { hidden: true })
    .filter((group) => group.getAttribute("aria-roledescription") === "slide");
const liveRegion = () => currentSlide().closest("[aria-live]");
const button = (name) => screen.getByRole("button", { name });

describe("Carousel", () => {
  it("renders a labelled carousel region whose slides are named by their position", () => {
    renderCarousel();

    const carousel = screen.getByRole("region", { name: "Featured projects" });
    expect(carousel.tagName).toBe("SECTION");
    expect(carousel).toHaveAttribute("aria-roledescription", "carousel");

    const groups = allSlides();
    expect(groups.map((slide) => slide.getAttribute("aria-label"))).toEqual([
      "1 of 3",
      "2 of 3",
      "3 of 3",
    ]);
    for (const slide of groups) {
      expect(slide).toHaveAttribute("aria-roledescription", "slide");
    }
  });

  it("exposes only the current slide and moves the track to it", () => {
    renderCarousel({ defaultIndex: 1 });
    const [first, second, third] = allSlides();

    expect(first).toHaveAttribute("aria-hidden", "true");
    expect(second).not.toHaveAttribute("aria-hidden");
    expect(third).toHaveAttribute("aria-hidden", "true");
    expect(currentSlide()).toHaveTextContent("Deployments");
    expect(screen.queryByRole("link", { name: "Open Dashboard" })).not.toBeInTheDocument();
    expect(second.parentElement).toHaveStyle({ transform: "translateX(-100%)" });
  });

  it("shows the previous and next slides, wrapping around by default, and keeps focus on the button", async () => {
    const user = userEvent.setup();
    renderCarousel();
    const next = button("Next slide");
    const previous = button("Previous slide");
    expect(next).toHaveAttribute("aria-controls", liveRegion().id);
    expect(previous).toHaveAttribute("aria-controls", liveRegion().id);

    await user.click(next);
    expect(currentSlide()).toHaveAccessibleName("2 of 3");
    expect(next).toHaveFocus();

    await user.keyboard("{Enter}");
    expect(currentSlide()).toHaveAccessibleName("3 of 3");
    await user.keyboard(" ");
    expect(currentSlide()).toHaveAccessibleName("1 of 3");

    await user.click(previous);
    expect(currentSlide()).toHaveAccessibleName("3 of 3");
    expect(currentSlide()).toHaveTextContent("Team");
  });

  it("stops at both ends without loop, keeping the arrows focusable but aria-disabled", async () => {
    const user = userEvent.setup();
    const onIndexChange = vi.fn();
    renderCarousel({ loop: false, onIndexChange });
    const previous = button("Previous slide");
    const next = button("Next slide");

    expect(previous).toHaveAttribute("aria-disabled", "true");
    expect(next).not.toHaveAttribute("aria-disabled");
    await user.click(previous);
    expect(currentSlide()).toHaveAccessibleName("1 of 3");
    expect(onIndexChange).not.toHaveBeenCalled();

    await user.click(next);
    await user.keyboard("{Enter}");
    expect(currentSlide()).toHaveAccessibleName("3 of 3");
    expect(next).toHaveAttribute("aria-disabled", "true");
    expect(next).toHaveFocus();
    expect(previous).not.toHaveAttribute("aria-disabled");

    await user.keyboard("{Enter}");
    expect(currentSlide()).toHaveAccessibleName("3 of 3");
    expect(onIndexChange.mock.calls).toEqual([[1], [2]]);
  });

  it("picks a slide with the dots, marking the current one", async () => {
    const user = userEvent.setup();
    renderCarousel();

    const picker = screen.getByRole("group", { name: "Choose slide" });
    const dots = within(picker).getAllByRole("button");
    expect(dots.map((dot) => dot.getAttribute("aria-label"))).toEqual([
      "Slide 1",
      "Slide 2",
      "Slide 3",
    ]);
    expect(dots[0]).toHaveAttribute("aria-current", "true");
    expect(dots[2]).not.toHaveAttribute("aria-current");

    await user.click(within(picker).getByRole("button", { name: "Slide 3" }));
    expect(currentSlide()).toHaveAccessibleName("3 of 3");
    expect(dots[2]).toHaveAttribute("aria-current", "true");
    expect(dots[0]).not.toHaveAttribute("aria-current");
  });

  it("supports controlled usage", async () => {
    const user = userEvent.setup();
    const onIndexChange = vi.fn();
    const { rerender } = render(
      <Carousel label="Featured projects" index={1} onIndexChange={onIndexChange}>
        {slides}
      </Carousel>,
    );

    await user.click(button("Next slide"));
    expect(onIndexChange).toHaveBeenCalledWith(2);
    // The parent did not update `index`, so the slide stays put.
    expect(currentSlide()).toHaveAccessibleName("2 of 3");

    rerender(
      <Carousel label="Featured projects" index={0} onIndexChange={onIndexChange}>
        {slides}
      </Carousel>,
    );
    expect(currentSlide()).toHaveAccessibleName("1 of 3");
  });

  it("announces slide changes politely while not rotating", () => {
    renderCarousel();
    expect(liveRegion()).toHaveAttribute("aria-live", "polite");
  });

  it("puts the rotation button first in the Tab order, before the rotating content", async () => {
    const user = userEvent.setup();
    renderCarousel({ autoPlay: true });

    await user.tab();
    expect(button("Stop automatic slide show")).toHaveFocus();
    await user.tab();
    expect(button("Previous slide")).toHaveFocus();
  });

  it("hides the arrows and dots on request, and every control when there is one slide", () => {
    const { unmount } = renderCarousel({ showArrows: false, showDots: false });
    expect(screen.getAllByRole("button")).toEqual([button("Outside")]);
    unmount();

    const onIndexChange = vi.fn();
    render(
      <Carousel label="Plans" autoPlay onIndexChange={onIndexChange}>
        <Carousel.Slide>Starter</Carousel.Slide>
      </Carousel>,
    );
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    const slide = screen.getByRole("group", { name: "1 of 1" });
    expect(slide).toHaveTextContent("Starter");

    const touch = { pointerId: 1, pointerType: "touch", isPrimary: true, clientY: 100 };
    fireEvent.pointerDown(slide, { ...touch, clientX: 200 });
    fireEvent.pointerUp(slide, { ...touch, clientX: 100 });
    expect(onIndexChange).not.toHaveBeenCalled();
  });

  it("changes slides with horizontal touch swipes only", () => {
    renderCarousel();
    const swipe = ({ from, to, pointerType = "touch", toY = 100 }) => {
      const target = currentSlide();
      const init = { pointerId: 1, pointerType, isPrimary: true, clientY: 100 };
      fireEvent.pointerDown(target, { ...init, clientX: from });
      fireEvent.pointerUp(target, { ...init, clientX: to, clientY: toY });
    };

    swipe({ from: 200, to: 150 });
    expect(currentSlide()).toHaveAccessibleName("2 of 3");
    swipe({ from: 150, to: 200 });
    expect(currentSlide()).toHaveAccessibleName("1 of 3");

    swipe({ from: 200, to: 170 }); // too short
    swipe({ from: 200, to: 150, toY: 180 }); // mostly vertical
    swipe({ from: 200, to: 100, pointerType: "mouse" });
    expect(currentSlide()).toHaveAccessibleName("1 of 3");

    const target = currentSlide();
    fireEvent.pointerDown(target, { pointerId: 1, pointerType: "touch", isPrimary: true });
    fireEvent.pointerCancel(target, { pointerId: 1, pointerType: "touch" });
    fireEvent.pointerUp(target, { pointerId: 1, pointerType: "touch", clientX: -100 });
    expect(currentSlide()).toHaveAccessibleName("1 of 3");
  });

  it("lets a slide's own label win, forwards refs and merges className and props", () => {
    const ref = createRef();
    const slideRef = createRef();
    const onFocus = vi.fn();
    render(
      <Carousel ref={ref} label="Plans" className="custom" data-testid="plans" onFocus={onFocus}>
        <CarouselSlide ref={slideRef} aria-label="Starter plan" className="slide-class">
          Starter
        </CarouselSlide>
        <Carousel.Slide>Pro</Carousel.Slide>
      </Carousel>,
    );

    const region = screen.getByRole("region", { name: "Plans" });
    expect(ref.current).toBe(region);
    expect(region).toHaveClass("shelf-carousel", "custom");
    expect(region).toHaveAttribute("data-testid", "plans");
    expect(slideRef.current).toBe(screen.getByRole("group", { name: "Starter plan" }));
    expect(slideRef.current).toHaveClass("shelf-carousel__slide", "slide-class");
    expect(allSlides()[1]).toHaveAttribute("aria-label", "2 of 2");
    expect(Carousel.Slide).toBe(CarouselSlide);

    act(() => button("Next slide").focus());
    expect(onFocus).toHaveBeenCalledTimes(1);
  });

  it("explains misuse outside <Carousel>", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<Carousel.Slide>Orphan</Carousel.Slide>)).toThrow(
      "<Carousel.Slide> must be rendered inside <Carousel>.",
    );
  });
});

describe("Carousel autoPlay", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    delete window.matchMedia;
  });

  // Each slide change schedules the next one after React re-renders, so move
  // the clock forward one interval at a time.
  const advance = (ms, times = 1) => {
    for (let step = 0; step < times; step += 1) {
      act(() => vi.advanceTimersByTime(ms));
    }
  };

  it("shows the next slide every interval and stops and restarts from the rotation button", () => {
    renderCarousel({ autoPlay: true, interval: 3000 });
    const rotation = button("Stop automatic slide show");
    expect(rotation).toHaveAttribute("aria-controls", liveRegion().id);
    expect(liveRegion()).toHaveAttribute("aria-live", "off");

    advance(2999);
    expect(currentSlide()).toHaveAccessibleName("1 of 3");
    advance(1);
    expect(currentSlide()).toHaveAccessibleName("2 of 3");
    advance(3000, 2);
    expect(currentSlide()).toHaveAccessibleName("1 of 3");

    fireEvent.click(rotation);
    expect(rotation).toHaveAccessibleName("Start automatic slide show");
    expect(liveRegion()).toHaveAttribute("aria-live", "polite");
    advance(3000, 3);
    expect(currentSlide()).toHaveAccessibleName("1 of 3");

    // Pointing at and focusing the rotation button itself doesn't pause rotation.
    fireEvent.pointerEnter(rotation);
    act(() => rotation.focus());
    fireEvent.click(rotation);
    expect(rotation).toHaveAccessibleName("Stop automatic slide show");
    expect(liveRegion()).toHaveAttribute("aria-live", "off");
    advance(3000);
    expect(currentSlide()).toHaveAccessibleName("2 of 3");
  });

  it("pauses while the pointer is over the carousel", () => {
    renderCarousel({ autoPlay: true, interval: 3000 });

    fireEvent.pointerEnter(currentSlide());
    expect(liveRegion()).toHaveAttribute("aria-live", "polite");
    advance(3000, 3);
    expect(currentSlide()).toHaveAccessibleName("1 of 3");

    fireEvent.pointerLeave(screen.getByRole("region", { name: "Featured projects" }));
    expect(liveRegion()).toHaveAttribute("aria-live", "off");
    advance(3000);
    expect(currentSlide()).toHaveAccessibleName("2 of 3");
  });

  it("pauses while focus is inside the carousel, except on the rotation button", () => {
    renderCarousel({ autoPlay: true, interval: 3000 });

    act(() => button("Stop automatic slide show").focus());
    advance(3000);
    expect(currentSlide()).toHaveAccessibleName("2 of 3");

    act(() => button("Slide 1").focus());
    expect(liveRegion()).toHaveAttribute("aria-live", "polite");
    advance(3000, 3);
    expect(currentSlide()).toHaveAccessibleName("2 of 3");

    act(() => button("Outside").focus());
    expect(liveRegion()).toHaveAttribute("aria-live", "off");
    advance(3000);
    expect(currentSlide()).toHaveAccessibleName("3 of 3");
  });

  it("starts stopped when the user prefers reduced motion", () => {
    window.matchMedia = vi.fn(() => ({
      matches: true,
      addEventListener: () => {},
      removeEventListener: () => {},
    }));
    renderCarousel({ autoPlay: true, interval: 3000 });

    const rotation = button("Start automatic slide show");
    expect(liveRegion()).toHaveAttribute("aria-live", "polite");
    advance(3000, 3);
    expect(currentSlide()).toHaveAccessibleName("1 of 3");

    fireEvent.click(rotation);
    expect(rotation).toHaveAccessibleName("Stop automatic slide show");
    advance(3000);
    expect(currentSlide()).toHaveAccessibleName("2 of 3");
  });

  it("stops on the last slide without loop, and replays from the first when restarted", () => {
    renderCarousel({ autoPlay: true, loop: false, interval: 3000 });

    advance(3000, 2);
    expect(currentSlide()).toHaveAccessibleName("3 of 3");
    const rotation = button("Start automatic slide show");
    expect(liveRegion()).toHaveAttribute("aria-live", "polite");
    advance(3000, 2);
    expect(currentSlide()).toHaveAccessibleName("3 of 3");

    fireEvent.click(rotation);
    expect(currentSlide()).toHaveAccessibleName("1 of 3");
    expect(rotation).toHaveAccessibleName("Stop automatic slide show");
    advance(3000);
    expect(currentSlide()).toHaveAccessibleName("2 of 3");
  });

  it("gives every slide a full interval after the user changes slides", () => {
    renderCarousel({ autoPlay: true, interval: 3000 });

    advance(2000);
    fireEvent.click(button("Next slide"));
    expect(currentSlide()).toHaveAccessibleName("2 of 3");
    advance(2999);
    expect(currentSlide()).toHaveAccessibleName("2 of 3");
    advance(1);
    expect(currentSlide()).toHaveAccessibleName("3 of 3");
  });
});
