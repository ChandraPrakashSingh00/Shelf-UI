import { createElement, createRef } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { getElementRef } from "./getElementRef.js";

describe("getElementRef", () => {
  afterEach(() => {
    vi.doUnmock("react");
    vi.resetModules();
  });

  it("returns an object ref from the element's props without React 19's element.ref warning", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    const ref = createRef();

    expect(getElementRef(createElement("button", { ref }))).toBe(ref);
    expect(consoleError).not.toHaveBeenCalled();
  });

  it("returns callback refs, also on components", () => {
    const ref = () => {};
    function Custom() {
      return null;
    }
    expect(getElementRef(createElement("div", { ref }))).toBe(ref);
    expect(getElementRef(createElement(Custom, { ref }))).toBe(ref);
  });

  it("returns undefined when the element has no ref", () => {
    expect(getElementRef(createElement("span", { id: "plain" }))).toBeUndefined();
  });

  it("reads element.ref on React 18, where the ref isn't a prop", async () => {
    vi.doMock("react", async (importOriginal) => ({
      ...(await importOriginal()),
      version: "18.3.1",
    }));
    vi.resetModules();
    const { getElementRef: getElementRefOnReact18 } = await import("./getElementRef.js");

    const ref = createRef();
    // The shape of a React 18 element: `ref` next to `props`, not inside them.
    expect(getElementRefOnReact18({ type: "button", ref, props: {} })).toBe(ref);
  });
});
