import { useLayoutEffect, useRef } from "react";
import { createPortal } from "react-dom";

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const smooth = (v) => v * v * (3 - 2 * v);

/**
 * NameLeap — the header's lettering leaps down into a spot on the page as
 * that spot scrolls up the screen, sits there a while, then leaps back up
 * into the header as the page scrolls on. The header's own copy is hidden
 * while its double is away; the page spot (`targetRef`, an <img> of the same
 * lettering) is only ever shown by the double. Scrolling back reverses it.
 *
 * Props:
 *   targetRef — the <img> on the page where the name lands
 *   src       — the lettering
 *   behind    — optional selector of an element (a photo) the name passes
 *               behind on its way: over it, only an outline of the name shows
 *   outline   — that outline (same proportions as `src`)
 */
export default function NameLeap({ targetRef, src, behind, outline }) {
  const flyRef = useRef(null);
  const fillRef = useRef(null);
  const lineRef = useRef(null);

  useLayoutEffect(() => {
    const fly = flyRef.current;
    const target = targetRef.current;
    if (!fly || !target) return undefined;
    const root = document.documentElement;
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    target.style.visibility = "hidden";
    let frame = 0;

    const update = () => {
      frame = 0;
      const slot = document.querySelector(".nav-brand-text img");
      if (!slot) return;
      const a = slot.getBoundingClientRect();
      const b = target.getBoundingClientRect();
      const H = window.innerHeight;
      // Down as the spot rises from 85% to 55% of the screen. Home again
      // once the spot has risen level with the header's name: from there it
      // stays level and slides across over the next 160px of scrolling
      const down = clamp01((H * 0.85 - b.top) / (H * 0.3));
      const up = clamp01((a.top - b.top) / 160);
      let p = Math.min(down, 1 - up);
      if (reduced) p = p >= 0.5 ? 1 : 0;
      const e = smooth(p);

      const away = p > 0.001;
      root.style.setProperty("--brand-text-opacity", away ? "0" : "1");
      fly.style.display = away ? "block" : "none";
      if (!away) return;
      let h;
      let x;
      let y;
      if (up > 0 && !reduced) {
        // Going home: level with the crest, straight across to the left
        const across = smooth(up);
        h = b.height + (a.height - b.height) * across;
        y = a.top + (a.height - h) / 2;
        x = b.left + (a.left - b.left) * across;
      } else {
        // Coming down: a little hop above the straight line, like a leap
        const arc = Math.sin(e * Math.PI) * Math.min(80, Math.abs(b.top - a.top) * 0.15);
        h = a.height + (b.height - a.height) * e;
        y = a.top + (b.top - a.top) * e - arc;
        x = a.left + (b.left - a.left) * e;
      }
      const w = h * (b.width / b.height);
      fly.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      fly.style.width = `${w}px`;
      fly.style.height = `${h}px`;
      // Over the photo only the outline shows; the filled name takes over
      // where it comes out from under it
      const cover = behind && document.querySelector(behind)?.getBoundingClientRect();
      let fillClip = "";
      let lineClip = "inset(0 0 100% 0)";
      if (cover && cover.bottom > y && cover.top < y + h) {
        const overTop = cover.top <= y; // the photo covers the name's upper part
        const cut = overTop ? Math.min(h, cover.bottom - y) : Math.max(0, y + h - cover.top);
        fillClip = overTop ? `inset(${cut}px 0 0 0)` : `inset(0 0 ${cut}px 0)`;
        lineClip = overTop ? `inset(0 0 ${h - cut}px 0)` : `inset(${h - cut}px 0 0 0)`;
      }
      fillRef.current.style.clipPath = fillClip;
      lineRef.current.style.clipPath = lineClip;
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
      root.style.removeProperty("--brand-text-opacity");
      target.style.visibility = "";
    };
  }, [targetRef, behind]);

  return createPortal(
    <div ref={flyRef} className="name-leap" aria-hidden="true">
      <img ref={fillRef} src={src} alt="" />
      {outline && <img ref={lineRef} src={outline} alt="" />}
      {!outline && <span ref={lineRef} />}
    </div>,
    document.body,
  );
}
