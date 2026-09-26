import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { computePosition, useFloatingPosition } from "./useFloatingPosition.js";

const viewport = { width: 1000, height: 800 };
// A 100×40 anchor in the middle of the viewport and a 120×30 floating element.
const anchor = { top: 400, left: 500, width: 100, height: 40 };
const floating = { width: 120, height: 30 };

const position = (anchorRect, options, floatingRect = floating, area = viewport) =>
  computePosition(anchorRect, floatingRect, area, options);

describe("computePosition", () => {
  it.each([
    ["top", { top: 362, left: 490, side: "top" }],
    ["right", { top: 405, left: 608, side: "right" }],
    ["bottom", { top: 448, left: 490, side: "bottom" }],
    ["left", { top: 405, left: 372, side: "left" }],
  ])("places the element centered on the %s side, 8px away", (side, expected) => {
    expect(position(anchor, { side })).toEqual(expected);
  });

  it("aligns to the start or end of a horizontal edge", () => {
    expect(position(anchor, { side: "bottom", align: "start" })).toMatchObject({ left: 500 });
    expect(position(anchor, { side: "bottom", align: "end" })).toMatchObject({ left: 480 });
    expect(position(anchor, { side: "top", align: "start" })).toMatchObject({ left: 500 });
  });

  it("aligns to the start or end of a vertical edge", () => {
    expect(position(anchor, { side: "right", align: "start" })).toMatchObject({ top: 400 });
    expect(position(anchor, { side: "right", align: "end" })).toMatchObject({ top: 410 });
    expect(position(anchor, { side: "left", align: "end" })).toMatchObject({ top: 410 });
  });

  it("uses a custom offset", () => {
    expect(position(anchor, { side: "top", offset: 4 })).toMatchObject({ top: 366 });
    expect(position(anchor, { side: "right", offset: 0 })).toMatchObject({ left: 600 });
  });

  it("flips from top to bottom when there's no room above", () => {
    const nearTop = { ...anchor, top: 20 };
    expect(position(nearTop, { side: "top" })).toEqual({ top: 68, left: 490, side: "bottom" });
  });

  it("flips from bottom to top when there's no room below", () => {
    const nearBottom = { ...anchor, top: 760, height: 30 };
    expect(position(nearBottom, { side: "bottom" })).toEqual({ top: 722, left: 490, side: "top" });
  });

  it("flips from left to right and from right to left", () => {
    const nearLeft = { ...anchor, left: 20 };
    expect(position(nearLeft, { side: "left" })).toEqual({ top: 405, left: 128, side: "right" });

    const nearRight = { ...anchor, left: 880 };
    expect(position(nearRight, { side: "right" })).toEqual({ top: 405, left: 752, side: "left" });
  });

  it("keeps the preferred side when it fits, even if the opposite side fits too", () => {
    expect(position(anchor, { side: "top" }).side).toBe("top");
    expect(position(anchor, { side: "left" }).side).toBe("left");
  });

  it("keeps the preferred side and clamps when neither side fits", () => {
    const shortViewport = { width: 1000, height: 60 };
    const tallAnchor = { top: 10, left: 500, width: 100, height: 40 };
    expect(position(tallAnchor, { side: "top" }, floating, shortViewport)).toEqual({
      top: 8,
      left: 490,
      side: "top",
    });
    expect(position(tallAnchor, { side: "bottom" }, floating, shortViewport)).toEqual({
      top: 22,
      left: 490,
      side: "bottom",
    });
  });

  it("shifts along the edge to stay inside the viewport horizontally", () => {
    const atLeftEdge = { ...anchor, left: 0, width: 40 };
    expect(position(atLeftEdge, { side: "top" })).toMatchObject({ left: 8, side: "top" });

    const atRightEdge = { ...anchor, left: 960, width: 40 };
    expect(position(atRightEdge, { side: "bottom" })).toMatchObject({ left: 872, side: "bottom" });
  });

  it("shifts along the edge to stay inside the viewport vertically", () => {
    const tall = { width: 120, height: 100 };
    const atTopEdge = { ...anchor, top: 0, height: 20 };
    expect(position(atTopEdge, { side: "right" }, tall)).toMatchObject({ top: 8, side: "right" });

    const atBottomEdge = { ...anchor, top: 790, height: 10 };
    expect(position(atBottomEdge, { side: "left" }, tall)).toMatchObject({
      top: 692,
      side: "left",
    });
  });

  it("pins an element larger than the viewport to the top-left padding", () => {
    const huge = { width: 1200, height: 900 };
    expect(position(anchor, { side: "bottom" }, huge)).toMatchObject({ top: 8, left: 8 });
  });

  it("uses a custom padding for flipping and clamping", () => {
    const atLeftEdge = { ...anchor, left: 0, width: 40 };
    expect(position(atLeftEdge, { side: "top", padding: 16 })).toMatchObject({ left: 16 });

    // 12px of room above: enough with the default 8px padding, not with 16px.
    const nearTop = { ...anchor, top: 50 };
    expect(position(nearTop, { side: "top" }).side).toBe("top");
    expect(position(nearTop, { side: "top", padding: 16 }).side).toBe("bottom");
  });
});

// jsdom has no layout: fake the rects. Its viewport is 1024×768 (window.innerWidth/Height).
function setup(initialOptions) {
  const anchorRef = { current: document.createElement("button") };
  const floatingRef = { current: document.createElement("div") };

  const rects = { anchor, floating: { top: 0, left: 0, ...floating } };
  anchorRef.current.getBoundingClientRect = () => rects.anchor;
  floatingRef.current.getBoundingClientRect = () => rects.floating;

  const renders = [];
  const hook = renderHook(
    (options) => {
      const result = useFloatingPosition(anchorRef, floatingRef, options);
      renders.push(result);
      return result;
    },
    { initialProps: initialOptions },
  );
  return { ...hook, rects, renders };
}

describe("useFloatingPosition", () => {
  it("keeps the element hidden while closed", () => {
    const { result } = setup({ open: false, side: "top" });
    expect(result.current).toEqual({
      style: { position: "fixed", top: 0, left: 0, visibility: "hidden" },
      side: "top",
    });
  });

  it("renders hidden first, then at the measured position", () => {
    const { result, renders } = setup({ open: true, side: "bottom" });
    expect(renders[0].style).toMatchObject({ visibility: "hidden" });
    expect(result.current).toEqual({
      style: { position: "fixed", top: 448, left: 490 },
      side: "bottom",
    });
  });

  it("returns the side it flipped to", () => {
    const { result, rects, rerender } = setup({ open: false, side: "top" });
    rects.anchor = { ...anchor, top: 10 };
    rerender({ open: true, side: "top" });
    expect(result.current.side).toBe("bottom");
    expect(result.current.style).toMatchObject({ top: 58 });
  });

  it("follows the anchor on window resize and on scroll of any ancestor, only re-rendering when it moved", () => {
    const { result, rects, renders } = setup({ open: true, side: "bottom", align: "start" });
    expect(result.current.style).toMatchObject({ top: 448, left: 500 });

    rects.anchor = { ...anchor, top: 100, left: 200 };
    act(() => window.dispatchEvent(new Event("resize")));
    expect(result.current.style).toMatchObject({ top: 148, left: 200 });

    // Scroll events don't bubble: the capture listener still sees them.
    const scroller = document.createElement("div");
    document.body.append(scroller);
    rects.anchor = { ...anchor, top: 50, left: 200 };
    act(() => scroller.dispatchEvent(new Event("scroll")));
    expect(result.current.style).toMatchObject({ top: 98, left: 200 });
    scroller.remove();

    // Nothing moved: React may call the component once more before it bails
    // out, but the position isn't recomputed into new renders after that.
    act(() => window.dispatchEvent(new Event("resize")));
    const renderCount = renders.length;
    act(() => window.dispatchEvent(new Event("resize")));
    act(() => window.dispatchEvent(new Event("resize")));
    expect(renders).toHaveLength(renderCount);
  });

  it("measures again when it re-renders, e.g. after its content changed size", () => {
    const { result, rects, rerender } = setup({ open: true, side: "top" });
    expect(result.current.style).toMatchObject({ top: 362 });

    rects.floating = { top: 0, left: 0, width: 120, height: 50 };
    rerender({ open: true, side: "top" });
    expect(result.current.style).toMatchObject({ top: 342 });
  });

  it("listens passively in the capture phase only while open, and starts hidden when reopened", () => {
    const addListener = vi.spyOn(window, "addEventListener");
    const removeListener = vi.spyOn(window, "removeEventListener");
    const { result, rerender, renders } = setup({ open: true, side: "bottom" });

    const scrollCall = addListener.mock.calls.find(([type]) => type === "scroll");
    expect(scrollCall?.[2]).toEqual({ capture: true, passive: true });
    const listener = scrollCall?.[1];
    expect(addListener).toHaveBeenCalledWith("resize", listener);

    rerender({ open: false, side: "bottom" });
    expect(removeListener).toHaveBeenCalledWith("scroll", listener, { capture: true });
    expect(removeListener).toHaveBeenCalledWith("resize", listener);
    expect(result.current.style).toMatchObject({ visibility: "hidden" });

    const reopenedAt = renders.length;
    rerender({ open: true, side: "bottom" });
    expect(renders[reopenedAt].style).toMatchObject({ visibility: "hidden" });
    expect(result.current.style).toEqual({ position: "fixed", top: 448, left: 490 });
  });
});
