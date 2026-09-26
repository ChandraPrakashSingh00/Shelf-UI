import { createPortal } from "react-dom";
import { useIsClient } from "../hooks/useIsClient.js";

/**
 * Renders children into `document.body` (client-side only, SSR-safe). Pass a
 * `container` element to mount somewhere else.
 */
export function Portal({ children, container }) {
  const isClient = useIsClient();
  if (!isClient) return null;
  return createPortal(children, container ?? document.body);
}
