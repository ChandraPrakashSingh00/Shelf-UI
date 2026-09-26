import { useEffect } from "react";

// Shared across instances so nested overlays only unlock when the last one closes.
let lockCount = 0;
let savedOverflow = "";
let savedPaddingRight = "";

/** Prevents the page behind an overlay from scrolling while mounted. */
export function useScrollLock() {
  useEffect(() => {
    const { body, documentElement } = document;

    if (lockCount === 0) {
      const scrollbarWidth = window.innerWidth - documentElement.clientWidth;
      savedOverflow = body.style.overflow;
      savedPaddingRight = body.style.paddingRight;
      body.style.overflow = "hidden";
      // Compensate for the disappearing scrollbar so the layout doesn't shift.
      if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;
    }
    lockCount += 1;

    return () => {
      lockCount -= 1;
      if (lockCount === 0) {
        body.style.overflow = savedOverflow;
        body.style.paddingRight = savedPaddingRight;
      }
    };
  }, []);
}
