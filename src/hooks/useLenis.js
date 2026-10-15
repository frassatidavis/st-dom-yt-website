import { useEffect, useRef } from "react";
import { reducedMotionQuery } from "../classic";

/**
 * Lenis smooth scroll — physics-based smooth scrolling.
 * Respects prefers-reduced-motion.
 */
export default function useLenis() {
  const lenisRef = useRef(null);

  useEffect(() => {
    // Skip on reduced motion preference
    if (reducedMotionQuery().matches) return;

    let raf;
    import("lenis").then(({ default: Lenis }) => {
      const lenis = new Lenis({
        lerp: 0.1,
        duration: 1.2,
        smoothWheel: true,
        touchMultiplier: 1.5,
      });
      lenisRef.current = lenis;

      function animate(time) {
        lenis.raf(time);
        raf = requestAnimationFrame(animate);
      }
      raf = requestAnimationFrame(animate);
    });

    return () => {
      cancelAnimationFrame(raf);
      lenisRef.current?.destroy();
    };
  }, []);

  return lenisRef;
}
