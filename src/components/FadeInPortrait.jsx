import { useLayoutEffect, useRef } from "react";
import ResponsivePicture from "./ResponsivePicture";

const clamp01 = (v) => Math.min(1, Math.max(0, v));

/**
 * FadeInPortrait — a section whose background picture slowly comes into
 * view as the section scrolls up the screen: it starts invisible and a
 * little large and settles, faint, behind the text (`children`).
 *
 * Props:
 *   src      — the picture (-480/-1024/-1920 files, ResponsivePicture)
 *   bg       — the section's ground colour, which the picture fades over
 *   strength — how visible it ends up (0–1)
 *   position — the picture's focal point (object-position)
 *   children — the section's content
 */
export default function FadeInPortrait({ src, bg, strength = 0.22, position = "50% 30%", children }) {
  const wrapRef = useRef(null);

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return undefined;
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    const update = () => {
      frame = 0;
      const r = wrap.getBoundingClientRect();
      // From when the section's top enters the screen until it nears the top
      const p = reduced ? 1 : clamp01((window.innerHeight - r.top) / (window.innerHeight * 0.9));
      wrap.style.setProperty("--portrait", (p * p * (3 - 2 * p)).toFixed(3));
    };
    const request = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
    };
  }, []);

  return (
    <div ref={wrapRef} className="fade-portrait" style={{ background: bg, "--portrait-strength": strength }}>
      <div className="fade-portrait__picture" aria-hidden="true">
        <ResponsivePicture src={src} widths={[480, 1024, 1920]} sizes="100vw" alt="" style={{ objectPosition: position }} />
      </div>
      <div className="fade-portrait__content">{children}</div>
    </div>
  );
}
