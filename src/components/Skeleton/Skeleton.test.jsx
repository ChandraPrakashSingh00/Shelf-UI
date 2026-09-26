import { render } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { Skeleton } from "./Skeleton.jsx";

const renderSkeleton = (props) => render(<Skeleton {...props} />).container.firstElementChild;

describe("Skeleton", () => {
  it("renders an animated text line that screen readers skip", () => {
    const skeleton = renderSkeleton();

    expect(skeleton.tagName).toBe("SPAN");
    expect(skeleton).toHaveAttribute("aria-hidden", "true");
    expect(skeleton).toHaveClass("cps-skeleton", "cps-skeleton--text", "cps-skeleton--animated");
    expect(skeleton).toBeEmptyDOMElement();
  });

  it("stays hidden from screen readers even when aria-hidden is overridden", () => {
    expect(renderSkeleton({ "aria-hidden": false })).toHaveAttribute("aria-hidden", "true");
  });

  it.each(["text", "circular", "rectangular"])("applies the %s variant", (variant) => {
    expect(renderSkeleton({ variant })).toHaveClass(`cps-skeleton--${variant}`);
  });

  it("reads numbers as pixels and keeps strings as CSS lengths", () => {
    const skeleton = renderSkeleton({ variant: "rectangular", width: "60%", height: 160 });
    expect(skeleton.style.width).toBe("60%");
    expect(skeleton.style.height).toBe("160px");
  });

  it("uses one dimension for both sides of a circle", () => {
    const byWidth = renderSkeleton({ variant: "circular", width: 48 });
    expect(byWidth.style.width).toBe("48px");
    expect(byWidth.style.height).toBe("48px");

    const byHeight = renderSkeleton({ variant: "circular", height: "3rem" });
    expect(byHeight.style.width).toBe("3rem");
    expect(byHeight.style.height).toBe("3rem");
  });

  it("leaves the size to the stylesheet when width and height aren't given", () => {
    expect(renderSkeleton({ variant: "circular" })).not.toHaveAttribute("style");
  });

  it("renders several text lines, each sized by height", () => {
    const skeleton = renderSkeleton({ lines: 3, width: 240, height: 12 });

    expect(skeleton).toHaveClass("cps-skeleton", "cps-skeleton--lines", "cps-skeleton--animated");
    expect(skeleton).toHaveAttribute("aria-hidden", "true");
    expect(skeleton.style.width).toBe("240px");

    const lines = skeleton.querySelectorAll(".cps-skeleton__line");
    expect(lines).toHaveLength(3);
    for (const line of lines) expect(line.style.height).toBe("12px");
  });

  it("renders a single line for lines={1}, and ignores lines for other variants", () => {
    expect(renderSkeleton({ lines: 1 }).querySelector(".cps-skeleton__line")).toBeNull();

    const circle = renderSkeleton({ variant: "circular", lines: 3 });
    expect(circle).toHaveClass("cps-skeleton--circular");
    expect(circle).toBeEmptyDOMElement();
  });

  it("can turn the shimmer off", () => {
    expect(renderSkeleton({ animated: false })).not.toHaveClass("cps-skeleton--animated");
    expect(renderSkeleton({ lines: 2, animated: false })).not.toHaveClass("cps-skeleton--animated");
  });

  it("forwards the ref and native attributes, and merges className and style", () => {
    const ref = createRef();
    const { container } = render(
      <Skeleton
        ref={ref}
        className="custom"
        data-testid="title-placeholder"
        width={200}
        style={{ fontSize: "1.5rem", width: "50%" }}
      />,
    );

    const skeleton = container.firstElementChild;
    expect(ref.current).toBe(skeleton);
    expect(skeleton).toHaveClass("cps-skeleton", "custom");
    expect(skeleton).toHaveAttribute("data-testid", "title-placeholder");
    expect(skeleton.style.fontSize).toBe("1.5rem");
    // An explicit `style` wins over the `width` prop.
    expect(skeleton.style.width).toBe("50%");
  });
});
