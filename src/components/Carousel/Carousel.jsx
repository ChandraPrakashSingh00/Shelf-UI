import {
  Children,
  createContext,
  forwardRef,
  isValidElement,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { useControllableState } from "../../hooks/useControllableState.js";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion.js";
import { ChevronLeftIcon, ChevronRightIcon, PauseIcon, PlayIcon } from "../../icons/index.jsx";
import { IconButton } from "../../primitives/IconButton.jsx";
import { composeEventHandlers } from "../../utils/composeEventHandlers.js";
import { cx } from "../../utils/cx.js";

// Minimum horizontal distance, in pixels, for a touch swipe to change the slide.
const SWIPE_DISTANCE = 40;

// Position of one slide, provided by `Carousel` around each of its children.
const CarouselSlideContext = createContext(null);

const CarouselRoot = forwardRef(function Carousel(
  {
    label,
    index: indexProp,
    defaultIndex = 0,
    onIndexChange,
    loop = true,
    autoPlay = false,
    interval = 5000,
    showArrows = true,
    showDots = true,
    previousLabel = "Previous slide",
    nextLabel = "Next slide",
    className,
    children,
    onPointerEnter,
    onPointerLeave,
    onFocus,
    onBlur,
    ...rest
  },
  ref,
) {
  const slidesId = useId();
  const slides = Children.toArray(children).filter(isValidElement);
  const count = slides.length;
  const hasControls = count > 1;

  const [index, setIndex] = useControllableState({
    value: indexProp,
    defaultValue: defaultIndex,
    onChange: onIndexChange,
  });
  // Stay on an existing slide when slides are removed or `index` is out of range.
  const activeIndex = Math.min(Math.max(index, 0), Math.max(count - 1, 0));
  const hasPrevious = hasControls && (loop || activeIndex > 0);
  const hasNext = hasControls && (loop || activeIndex < count - 1);

  const goTo = (target) => setIndex((target + count) % count);
  const showPrevious = () => {
    if (hasPrevious) goTo(activeIndex - 1);
  };
  const showNext = () => {
    if (hasNext) goTo(activeIndex + 1);
  };

  // Counts slide changes, including a controlled `index` changed by the parent.
  // Each change flips `data-move` on the track, which restarts the CSS animation
  // that keeps hidden slides visible while the track slides past them.
  const [moves, setMoves] = useState({ index: activeIndex, count: 0 });
  if (moves.index !== activeIndex) setMoves({ index: activeIndex, count: moves.count + 1 });

  // Rotation follows the rotation button once the user has pressed it. Until
  // then it runs, unless the user prefers reduced motion.
  const prefersReducedMotion = usePrefersReducedMotion();
  const [rotationChoice, setRotationChoice] = useState(null);
  const canRotate = autoPlay && hasControls;
  const playing = canRotate && hasNext && (rotationChoice ?? !prefersReducedMotion);

  // Hovering or focusing the carousel pauses rotation, except on the rotation
  // button itself, so that pressing "start" takes effect right away.
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [rotationButtonHovered, setRotationButtonHovered] = useState(false);
  const [rotationButtonFocused, setRotationButtonFocused] = useState(false);
  const paused = (hovered && !rotationButtonHovered) || (focused && !rotationButtonFocused);
  const rotating = playing && !paused;

  // The timer calls the latest `showNext` without restarting on every render.
  const showNextRef = useRef(showNext);
  useEffect(() => {
    showNextRef.current = showNext;
  });

  // Restarts on every slide change, so each slide is shown for a full `interval`.
  useEffect(() => {
    if (!rotating) return undefined;
    const timer = setTimeout(() => showNextRef.current(), interval);
    return () => clearTimeout(timer);
  }, [rotating, interval, activeIndex]);

  const toggleRotation = () => {
    if (playing) {
      setRotationChoice(false);
      return;
    }
    setRotationChoice(true);
    // Without `loop`, rotation ends on the last slide: starting it again replays from the first.
    if (!hasNext) goTo(0);
  };

  const handleBlur = (event) => {
    // Focus moving between elements of the carousel keeps rotation paused.
    if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
  };

  const swipeStart = useRef(null);
  const handlePointerDown = (event) => {
    if (event.pointerType !== "touch" || !event.isPrimary) return;
    swipeStart.current = { pointerId: event.pointerId, x: event.clientX, y: event.clientY };
  };
  const handlePointerUp = (event) => {
    const start = swipeStart.current;
    if (!start || start.pointerId !== event.pointerId) return;
    swipeStart.current = null;

    const deltaX = event.clientX - start.x;
    const deltaY = event.clientY - start.y;
    if (Math.abs(deltaX) < SWIPE_DISTANCE || Math.abs(deltaX) <= Math.abs(deltaY)) return;
    if (deltaX < 0) showNext();
    else showPrevious();
  };
  const handlePointerCancel = () => {
    swipeStart.current = null;
  };

  return (
    <section
      {...rest}
      ref={ref}
      aria-roledescription="carousel"
      aria-label={label}
      className={cx("cps-carousel", className)}
      onPointerEnter={composeEventHandlers(onPointerEnter, () => setHovered(true))}
      onPointerLeave={composeEventHandlers(onPointerLeave, () => setHovered(false))}
      onFocus={composeEventHandlers(onFocus, () => setFocused(true))}
      onBlur={composeEventHandlers(onBlur, handleBlur)}
    >
      {/* First in the Tab order, before the rotating content (placed next to the dots by CSS). */}
      {canRotate && (
        <IconButton
          label={playing ? "Stop automatic slide show" : "Start automatic slide show"}
          aria-controls={slidesId}
          className="cps-carousel__rotation"
          onClick={toggleRotation}
          onPointerEnter={() => setRotationButtonHovered(true)}
          onPointerLeave={() => setRotationButtonHovered(false)}
          onFocus={() => setRotationButtonFocused(true)}
          onBlur={() => setRotationButtonFocused(false)}
        >
          {playing ? <PauseIcon /> : <PlayIcon />}
        </IconButton>
      )}

      <div className="cps-carousel__stage">
        {showArrows && hasControls && (
          <>
            {/* `aria-disabled` instead of `disabled`, so focus stays put at either end. */}
            <IconButton
              label={previousLabel}
              aria-controls={slidesId}
              aria-disabled={!hasPrevious || undefined}
              className="cps-carousel__arrow cps-carousel__arrow--previous"
              onClick={showPrevious}
            >
              <ChevronLeftIcon />
            </IconButton>
            <IconButton
              label={nextLabel}
              aria-controls={slidesId}
              aria-disabled={!hasNext || undefined}
              className="cps-carousel__arrow cps-carousel__arrow--next"
              onClick={showNext}
            >
              <ChevronRightIcon />
            </IconButton>
          </>
        )}

        {/* Announces the slides the user moves to, but stays quiet while rotating. */}
        <div
          id={slidesId}
          className="cps-carousel__viewport"
          aria-live={rotating ? "off" : "polite"}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
        >
          <div
            className="cps-carousel__track"
            data-move={moves.count > 0 ? moves.count % 2 : undefined}
            style={{ transform: `translateX(${activeIndex * -100}%)` }}
          >
            {slides.map((slide, slideIndex) => (
              <CarouselSlideContext.Provider
                key={slide.key}
                value={{ index: slideIndex, count, active: slideIndex === activeIndex }}
              >
                {slide}
              </CarouselSlideContext.Provider>
            ))}
          </div>
        </div>
      </div>

      {showDots && hasControls && (
        <div className="cps-carousel__dots" role="group" aria-label="Choose slide">
          {slides.map((slide, slideIndex) => (
            <button
              key={slide.key}
              type="button"
              aria-label={`Slide ${slideIndex + 1}`}
              aria-current={slideIndex === activeIndex || undefined}
              aria-controls={slidesId}
              className="cps-carousel__dot"
              onClick={() => goTo(slideIndex)}
            />
          ))}
        </div>
      )}
    </section>
  );
});

/**
 * One slide of a `Carousel`: a `<div>` (the `ref` points to it) that screen
 * readers announce as a slide, named "2 of 5". Pass `aria-label` (or
 * `aria-labelledby`) to name it after its content instead. Each child of
 * `Carousel` counts as one slide, so don't wrap slides in a fragment.
 */
export const CarouselSlide = forwardRef(function CarouselSlide(
  { className, "aria-label": ariaLabel, "aria-labelledby": ariaLabelledBy, ...rest },
  ref,
) {
  const slide = useContext(CarouselSlideContext);
  if (!slide) throw new Error("<Carousel.Slide> must be rendered inside <Carousel>.");

  const positionLabel = ariaLabelledBy ? undefined : `${slide.index + 1} of ${slide.count}`;

  // Inactive slides are hidden from screen readers here, and from sight and
  // keyboard focus by CSS (`visibility: hidden`).
  return (
    <div
      {...rest}
      ref={ref}
      role="group"
      aria-roledescription="slide"
      aria-label={ariaLabel ?? positionLabel}
      aria-labelledby={ariaLabelledBy}
      aria-hidden={slide.active ? undefined : true}
      className={cx("cps-carousel__slide", className)}
    />
  );
});

/**
 * Slideshow of images or content following the WAI-ARIA carousel pattern:
 * previous / next buttons, a slide picker and, with `autoPlay`, a button that
 * stops and restarts rotation. Each child is a `Carousel.Slide`. Other props go
 * to the root `<section>`, and the `ref` points to it.
 *
 * - `label` (required): accessible name of the carousel, e.g. "Featured projects".
 *   Leave out the word "carousel": screen readers already announce it.
 * - `index` / `defaultIndex` / `onIndexChange`: controlled or uncontrolled current
 *   slide, counted from `0` (`defaultIndex` defaults to `0`).
 * - `loop`: "next" on the last slide shows the first one and "previous" on the
 *   first slide shows the last one (default `true`). Without it, rotation stops
 *   on the last slide.
 * - `autoPlay`: shows the next slide every `interval` (default `false`). Rotation
 *   pauses while the pointer is over the carousel or focus is inside it (except
 *   on the stop / start button itself), and starts stopped when the user prefers
 *   reduced motion.
 * - `interval`: how long each slide is shown while rotating, in ms (default `5000`).
 * - `showArrows`: shows the previous / next buttons (default `true`).
 * - `showDots`: shows a button for each slide below the slides (default `true`).
 * - `previousLabel` / `nextLabel`: accessible names of the arrow buttons
 *   (default "Previous slide" / "Next slide").
 *
 * @example
 * <Carousel label="Featured projects" autoPlay>
 *   <Carousel.Slide>…</Carousel.Slide>
 *   <Carousel.Slide>…</Carousel.Slide>
 * </Carousel>
 */
export const Carousel = Object.assign(CarouselRoot, { Slide: CarouselSlide });
