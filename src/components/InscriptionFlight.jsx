import { useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import ResponsivePicture from "./ResponsivePicture";

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const between = (v, a, b) => clamp01((v - a) / (b - a));
const smooth = (v) => v * v * (3 - 2 * v);

/**
 * InscriptionFlight — a photo with a carved "St·Dominic's" in it. For the
 * first part of the scroll the carving simply moves up with the photo; then a
 * gold outline of the name lifts off the stone (appearing only as it leaves)
 * and glides up into the header's own lettering (upper left), filling in
 * burgundy as it lands. The header's lettering is hidden until
 * then; scrolling back reverses it all. With reduced motion it simply
 * appears in place.
 *
 * Props:
 *   src      — the photo (-480/-1024/-1920 files, ResponsivePicture)
 *   alt      — description of the photo
 *   box      — where the carved name is: [left, top, width, height] as
 *              fractions of the photo
 *   position — the photo's focal point (object-position), "x% y%"
 *   outline  — the name drawn as a gold outline (same proportions as `fill`)
 *   fill     — the header's burgundy name
 *   aspect   — the name's width / height
 */
export default function InscriptionFlight({ src, alt, box, position = "50% 50%", outline, fill, aspect }) {
  const photoRef = useRef(null);
  const flyRef = useRef(null);
  const outlineRef = useRef(null);
  const fillRef = useRef(null);
  const [natural, setNatural] = useState(null);

  useLayoutEffect(() => {
    const photo = photoRef.current;
    const fly = flyRef.current;
    if (!photo || !fly || !natural) return undefined;
    const root = document.documentElement;
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const [px, py] = position.split(" ").map((v) => parseFloat(v) / 100);
    let frame = 0;

    // The carved name's box on screen (object-fit: cover), as the name's
    // own proportions, fitted to the carving's width and centred on it
    const startRect = () => {
      const r = photo.getBoundingClientRect();
      const s = Math.max(r.width / natural.w, r.height / natural.h);
      const dw = natural.w * s;
      const dh = natural.h * s;
      const left = r.left + (r.width - dw) * px + box[0] * dw;
      const top = r.top + (r.height - dh) * py + box[1] * dh;
      const w = box[2] * dw;
      const h = w / aspect;
      return { left, top: top + (box[3] * dh - h) / 2, width: w, height: h };
    };

    const update = () => {
      frame = 0;
      const slot = document.querySelector(".nav-brand-text img");
      if (!slot) return;
      const end = slot.getBoundingClientRect();
      const start = startRect();
      // Lands once the page has scrolled as far as the carving is below the slot
      // (it stays in the stone for the first third of that)
      const distance = start.top + window.scrollY - end.top;
      const hold = distance * 0.35;
      let p = distance > 0 ? clamp01((window.scrollY - hold) / (distance - hold)) : 1;
      if (reduced) p = p >= 0.5 ? 1 : 0;
      const e = smooth(p);

      const width = start.width + (end.width - start.width) * e;
      const left = start.left + (end.left - start.left) * e;
      const top = start.top + (end.top - start.top) * e;
      fly.style.transform = `translate3d(${left}px, ${top}px, 0)`;
      fly.style.width = `${width}px`;
      fly.style.height = `${width / aspect}px`;
      // Gold only once it leaves the stone; then it gives way to the burgundy name
      const leaving = between(p, 0, 0.12);
      const landing = between(p, 0.6, 0.95);
      outlineRef.current.style.opacity = (leaving * (1 - landing)).toFixed(3);
      fillRef.current.style.opacity = landing.toFixed(3);
      fly.style.display = p > 0 && p < 1 ? "block" : "none";
      root.style.setProperty("--brand-text-opacity", p >= 1 ? "1" : "0");
    };
    const request = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(request) : null;
    ro?.observe(photo);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
      ro?.disconnect();
      root.style.removeProperty("--brand-text-opacity");
    };
  }, [natural, box, position, aspect]);

  return (
    <>
      <div ref={photoRef} className="inscription-flight">
        <ResponsivePicture
          src={src}
          widths={[480, 1024, 1920]}
          sizes="100vw"
          alt={alt}
          loading="eager"
          fetchPriority="high"
          onLoad={(e) => setNatural({ w: e.currentTarget.naturalWidth, h: e.currentTarget.naturalHeight })}
          style={{ objectPosition: position }}
        />
      </div>
      {createPortal(
        <div ref={flyRef} className="inscription-flight__fly" aria-hidden="true">
          <img ref={outlineRef} src={outline} alt="" />
          <img ref={fillRef} src={fill} alt="" style={{ opacity: 0 }} />
        </div>,
        document.body,
      )}
    </>
  );
}
