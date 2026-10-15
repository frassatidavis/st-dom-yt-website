import { useEffect, useRef, useState, useCallback } from "react";
import { reducedMotionQuery } from "../classic";

/**
 * Track how far an element has scrolled through the viewport.
 * Returns a ref to attach to the element and a progress value (0 → 1).
 *
 * progress = 0 when the element's top enters the bottom of the viewport
 * progress = 1 when the element's bottom exits the top of the viewport
 *
 * @param {Object} opts
 * @param {number} opts.offset - Offset from the bottom of the viewport to start tracking (0-1, default 0.8)
 */
export default function useScrollProgress({ offset = 0.85 } = {}) {
  const ref = useRef(null);
  const [progress, setProgress] = useState(0);

  const handleScroll = useCallback(() => {
    // When reduced motion is preferred, jump to fully visible immediately
    if (reducedMotionQuery().matches) {
      const el = ref.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight) setProgress(1);
      }
      return;
    }
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const windowH = window.innerHeight;
    const start = windowH * offset;
    const end = windowH * 0.2;
    const total = start - end;
    const current = start - rect.top;
    setProgress(Math.min(1, Math.max(0, current / total)));
  }, [offset]);

  useEffect(() => {
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [handleScroll]);

  return { ref, progress };
}
