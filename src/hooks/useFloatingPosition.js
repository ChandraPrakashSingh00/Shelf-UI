import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { flushSync } from "react-dom";

// React 18 warns about useLayoutEffect during server rendering, where effects never run anyway.
const useIsomorphicLayoutEffect = typeof document === "undefined" ? useEffect : useLayoutEffect;

const OPPOSITE_SIDE = { top: "bottom", right: "left", bottom: "top", left: "right" };

const isVertical = (side) => side === "top" || side === "bottom";

const clamp = (value, min, max) => Math.max(min, Math.min(value, max));

// Rendered while the position isn't known yet, so the element can be measured
// without showing up in the wrong place.
const UNMEASURED_STYLE = { position: "fixed", top: 0, left: 0, visibility: "hidden" };

// Cross-axis coordinate that lines the floating element up with the anchor.
function alignTo(anchorStart, anchorSize, floatingSize, align) {
  if (align === "start") return anchorStart;
  if (align === "end") return anchorStart + anchorSize - floatingSize;
  return anchorStart + (anchorSize - floatingSize) / 2;
}

function placeOn(side, anchor, floating, align, offset) {
  switch (side) {
    case "top":
    case "bottom":
      return {
        top:
          side === "top"
            ? anchor.top - offset - floating.height
            : anchor.top + anchor.height + offset,
        left: alignTo(anchor.left, anchor.width, floating.width, align),
      };
    default:
      return {
        top: alignTo(anchor.top, anchor.height, floating.height, align),
        left:
          side === "left"
            ? anchor.left - offset - floating.width
            : anchor.left + anchor.width + offset,
      };
  }
}

/**
 * Where to put a floating element (tooltip, popover…) next to its anchor, in
 * viewport coordinates for `position: fixed`. Pure, so it's easy to test.
 *
 * - `anchorRect` / `floatingRect`: `{ top, left, width, height }`, e.g. from
 *   `getBoundingClientRect()`.
 * - `viewport`: `{ width, height }` of the visible area.
 * - `side`: "top", "right", "bottom" or "left" of the anchor. When the element
 *   doesn't fit there but fits on the opposite side, it flips.
 * - `align`: "start", "center" (default) or "end" — alignment along the anchor's edge.
 * - `offset`: gap between the anchor and the element, in px (default 8).
 * - `padding`: minimum distance from the viewport edges, in px (default 8). The
 *   result is always clamped inside the viewport minus this padding.
 *
 * Returns `{ top, left, side }`, where `side` is the side actually used.
 */
export function computePosition(
  anchorRect,
  floatingRect,
  viewport,
  { side, align = "center", offset = 8, padding = 8 },
) {
  const fits = (position, placedSide) =>
    isVertical(placedSide)
      ? position.top >= padding && position.top + floatingRect.height <= viewport.height - padding
      : position.left >= padding && position.left + floatingRect.width <= viewport.width - padding;

  let placedSide = side;
  let position = placeOn(side, anchorRect, floatingRect, align, offset);
  if (!fits(position, side)) {
    const opposite = OPPOSITE_SIDE[side];
    const flipped = placeOn(opposite, anchorRect, floatingRect, align, offset);
    if (fits(flipped, opposite)) {
      placedSide = opposite;
      position = flipped;
    }
  }

  return {
    top: clamp(position.top, padding, viewport.height - padding - floatingRect.height),
    left: clamp(position.left, padding, viewport.width - padding - floatingRect.width),
    side: placedSide,
  };
}

// The visible area without scrollbars; `innerWidth`/`innerHeight` where the
// root element reports no size (e.g. in jsdom).
function getViewport() {
  const root = document.documentElement;
  return {
    width: root.clientWidth || window.innerWidth,
    height: root.clientHeight || window.innerHeight,
  };
}

const samePosition = (a, b) => a.top === b.top && a.left === b.left && a.side === b.side;

/**
 * Positions `floatingRef`'s element next to `anchorRef`'s element with
 * `position: fixed`, flipping to the opposite side and staying inside the
 * viewport (see `computePosition`). While `open`, it measures before every
 * paint and follows the anchor on window resize and on scroll (of the page or
 * any scrolling ancestor).
 *
 * - `open`: whether the floating element is rendered.
 * - `side`: preferred side — "top", "right", "bottom" (default) or "left".
 * - `align`: "start", "center" (default) or "end".
 * - `offset`: gap between the anchor and the floating element, in px (default 8).
 *
 * Returns `{ style, side }`: spread `style` on the floating element; `side` is
 * the side actually used. Until the first measurement, `style` keeps the element
 * hidden at the top-left corner. Its size is measured where it is rendered, so
 * give it a width that doesn't depend on its position (e.g. `width: max-content`).
 */
export function useFloatingPosition(
  anchorRef,
  floatingRef,
  { open, side = "bottom", align = "center", offset = 8 },
) {
  const [position, setPosition] = useState(null);

  const update = useCallback(() => {
    const anchor = anchorRef.current;
    const floating = floatingRef.current;
    if (!anchor || !floating) return;
    const next = computePosition(
      anchor.getBoundingClientRect(),
      floating.getBoundingClientRect(),
      getViewport(),
      { side, align, offset },
    );
    setPosition((current) => (current && samePosition(current, next) ? current : next));
  }, [anchorRef, floatingRef, side, align, offset]);

  // Measure after every render while open (before the browser paints), so a
  // change in content or size is picked up too. Unchanged positions bail out.
  useIsomorphicLayoutEffect(() => {
    if (open) update();
  });

  useEffect(() => {
    if (!open) return;
    // Re-render synchronously so the element doesn't trail its anchor by a frame.
    const handleChange = () => flushSync(update);
    window.addEventListener("resize", handleChange);
    window.addEventListener("scroll", handleChange, { capture: true, passive: true });
    return () => {
      window.removeEventListener("resize", handleChange);
      window.removeEventListener("scroll", handleChange, { capture: true });
    };
  }, [open, update]);

  // Forget the position on close, so the element starts hidden the next time it opens.
  useEffect(() => {
    if (open) return () => setPosition(null);
  }, [open]);

  if (!open || !position) return { style: UNMEASURED_STYLE, side };
  return {
    style: { position: "fixed", top: position.top, left: position.left },
    side: position.side,
  };
}
