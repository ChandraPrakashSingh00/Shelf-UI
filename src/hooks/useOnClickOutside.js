import { useEffect, useRef } from "react";

/** Calls `handler` when a pointer press starts outside `ref`, while `enabled`. */
export function useOnClickOutside(ref, handler, enabled = true) {
  const handlerRef = useRef(handler);
  useEffect(() => {
    handlerRef.current = handler;
  });

  useEffect(() => {
    if (!enabled) return;

    const listener = (event) => {
      const element = ref.current;
      if (!element || !(event.target instanceof Node) || element.contains(event.target)) return;
      handlerRef.current(event);
    };

    document.addEventListener("pointerdown", listener);
    return () => document.removeEventListener("pointerdown", listener);
  }, [ref, enabled]);
}
