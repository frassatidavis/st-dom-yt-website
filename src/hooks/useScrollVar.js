import { useEffect } from "react";
import { reducedMotionQuery } from "../classic";

/**
 * Write how far an element has travelled through the viewport to a CSS custom
 * property on it, so styles can respond to scrolling without React
 * re-rendering on every scroll event.
 *
 * mode "through" (default):
 *   0 when the element's top is at the bottom of the viewport,
 *   0.5 when it is centered, 1 when its bottom is at the top of the viewport
 * mode "exit" (for heroes at the top of the page):
 *   0 while its top is at or below the top of the viewport,
 *   1 once its bottom reaches the top
 *
 * Updates at most once per frame, and only while the element is near the
 * viewport. Nothing is written when reduced motion is preferred, so the
 * styles' fallback (the settled look) applies.
 *
 * @param {React.RefObject<HTMLElement>} ref
 * @param {Object} [opts]
 * @param {string} [opts.name] - custom property name (default "--scroll")
 * @param {"through"|"exit"} [opts.mode]
 * @param {boolean} [opts.enabled] - false skips everything (default true)
 */
export default function useScrollVar(ref, { name = "--scroll", mode = "through", enabled = true } = {}) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return undefined;
    if (reducedMotionQuery().matches) return undefined;

    let frame = 0;
    let near = true;
    const update = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const raw = mode === "exit" ? -r.top / (r.height || 1) : (vh - r.top) / (vh + r.height);
      const value = Math.min(1, Math.max(0, raw));
      el.style.setProperty(name, value.toFixed(4));
    };
    const request = () => {
      if (near && !frame) frame = window.requestAnimationFrame(update);
    };

    const io =
      typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver(
            ([entry]) => {
              near = entry.isIntersecting;
              if (near) request();
            },
            { rootMargin: "200px 0px" },
          )
        : null;
    io?.observe(el);

    update();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    return () => {
      window.cancelAnimationFrame(frame);
      io?.disconnect();
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
      el.style.removeProperty(name);
    };
  }, [ref, name, mode, enabled]);
}
