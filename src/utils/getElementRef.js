import { version } from "react";

// React 19 passes `ref` to components as a regular prop and warns when
// `element.ref` is read; React 18 keeps it on the element itself.
const refIsProp = Number.parseInt(version, 10) >= 19;

/**
 * Returns the `ref` attached to a React element (or `undefined`), so a
 * component that clones its child can merge that ref with its own instead of
 * replacing it.
 */
export function getElementRef(element) {
  return refIsProp ? element.props.ref : element.ref;
}
