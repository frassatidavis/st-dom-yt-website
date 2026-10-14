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
 *               behind on its way: the part of it over that element is cut away
 */
export default function NameLeap({ targetRef, src, behind }) {
  const flyRef = useRef(null);

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
      // Down as the spot rises from 85% to 55% of the screen; back up only
      // once the heading has passed under the header, over the next 140px
      const navBottom = slot.closest("nav")?.getBoundingClientRect().bottom ?? a.bottom;
      const down = clamp01((H * 0.85 - b.top) / (H * 0.3));
      const up = clamp01((navBottom - b.bottom) / 140);
      let p = Math.min(down, 1 - up);
      if (reduced) p = p >= 0.5 ? 1 : 0;
      const e = smooth(p);

      const away = p > 0.001;
      root.style.setProperty("--brand-text-opacity", away ? "0" : "1");
      fly.style.display = away ? "block" : "none";
      if (!away) return;
      const h = a.height + (b.height - a.height) * e;
      const w = h * (b.width / b.height);
      // A little hop above the straight line, like a leap
      const arc = Math.sin(e * Math.PI) * Math.min(80, Math.abs(b.top - a.top) * 0.15);
      fly.style.transform = `translate3d(${a.left + (b.left - a.left) * e}px, ${a.top + (b.top - a.top) * e - arc}px, 0)`;
      fly.style.width = `${w}px`;
      fly.style.height = `${h}px`;
      // Passing behind the photo: cut away the part over it
      const cover = behind && document.querySelector(behind)?.getBoundingClientRect();
      const y = a.top + (b.top - a.top) * e - arc;
      if (cover && cover.bottom > y && cover.top < y + h) {
        const top = Math.max(0, cover.bottom - y);
        const bottom = Math.max(0, y + h - cover.top);
        fly.style.clipPath = cover.top <= y ? `inset(${top}px 0 0 0)` : `inset(0 0 ${bottom}px 0)`;
      } else {
        fly.style.clipPath = "";
      }
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
    <img ref={flyRef} src={src} alt="" aria-hidden="true" className="name-leap" />,
    document.body,
  );
}
