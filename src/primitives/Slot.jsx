import { Children, cloneElement, isValidElement } from "react";
import { cx } from "../utils/cx.js";

const isHandlerName = (name) => /^on[A-Z]/.test(name);

/**
 * Powers the `asChild` pattern: instead of rendering its own element, a
 * component passes its props to its single child (e.g. a router `<Link>`).
 * Class names and styles are merged; event handlers of both run (child first).
 */
export function Slot({ children, ...slotProps }) {
  const child = Children.only(children);
  if (!isValidElement(child)) return null;

  const childProps = child.props;
  const merged = { ...slotProps, ...childProps };

  for (const [name, slotValue] of Object.entries(slotProps)) {
    const childValue = childProps[name];
    if (
      isHandlerName(name) &&
      typeof slotValue === "function" &&
      typeof childValue === "function"
    ) {
      merged[name] = (...args) => {
        childValue(...args);
        slotValue(...args);
      };
    }
  }

  merged.className = cx(slotProps.className, childProps.className) || undefined;
  merged.style = { ...slotProps.style, ...childProps.style };

  return cloneElement(child, merged);
}
