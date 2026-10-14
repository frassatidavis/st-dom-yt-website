import { useLayoutEffect, useRef } from "react";
import ResponsivePicture from "./ResponsivePicture";

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const smooth = (v) => v * v * (3 - 2 * v);

/**
 * StoneFinale — a photo at the foot of a page that stays put while the
 * site footer scrolls up over it. As the footer rises, everything but one
 * cut-out part of the photo (`keep`) fades to black, and a soft gold outline
 * (`outline`) traces that part.
 *
 * The photo sticks below the site header inside a box as tall as the
 * screen plus the footer, which is pulled up over its last stretch; the
 * footer's own background is cleared while this is on the page, so its text
 * reads over the darkened photo.
 *
 * Props:
 *   src      — the photo (-480/-1024/-1920 files, ResponsivePicture)
 *   keep     — the part that stays: the photo's own pixels, transparent elsewhere
 *   outline  — the outline of that part, transparent elsewhere (same size)
 *   alt      — description of the photo
 *   position — the photo's focal point (object-position), shared by all layers
 */
export default function StoneFinale({ src, keep, outline, alt, position = "50% 50%" }) {
  const wrapRef = useRef(null);

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    const footer = document.querySelector("footer");
    if (!wrap || !footer) return undefined;
    document.body.classList.add("has-stone-finale");
    let frame = 0;
    const update = () => {
      frame = 0;
      // The footer, plus any space the page keeps below it (room for the
      // fixed contact bar), is pulled up over the photo's last stretch
      const tail = Math.max(0, document.documentElement.scrollHeight - (footer.getBoundingClientRect().bottom + window.scrollY));
      wrap.style.setProperty("--footer-h", `${footer.offsetHeight + tail}px`);
      // Black falls as the footer rises over the first half of the screen
      const top = footer.getBoundingClientRect().top;
      const p = smooth(clamp01((window.innerHeight - top) / (window.innerHeight * 0.5)));
      wrap.style.setProperty("--black", p.toFixed(3));
    };
    const request = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(request) : null;
    ro?.observe(footer);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
      ro?.disconnect();
      document.body.classList.remove("has-stone-finale");
    };
  }, []);

  const layer = { objectPosition: position };
  return (
    <div ref={wrapRef} className="stone-finale">
      <div className="stone-finale__stage">
        <ResponsivePicture
          src={src}
          widths={[480, 1024, 1920]}
          sizes="100vw"
          alt={alt}
          className="stone-finale__img"
          style={layer}
        />
        <div className="stone-finale__black" aria-hidden="true" />
        <img src={keep} alt="" aria-hidden="true" loading="lazy" className="stone-finale__img" style={layer} />
        <img src={outline} alt="" aria-hidden="true" loading="lazy" className="stone-finale__img stone-finale__outline" style={layer} />
      </div>
    </div>
  );
}
