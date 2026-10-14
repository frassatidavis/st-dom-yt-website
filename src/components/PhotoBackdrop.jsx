import { useLayoutEffect, useRef, useState } from "react";
import ResponsivePicture from "./ResponsivePicture";

// The photo layer sticks just below the shrunken (scrolled) site header
const STICKY_TOP = 64;

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const smooth = (v) => v * v * (3 - 2 * v);

/**
 * PhotoBackdrop — a page opener whose photo, as the page scrolls, grows out
 * of the header strip to fill the screen and then fades back behind the text
 * that follows (`children`), slowly zooming in on one spot all the while.
 *
 * At the top it looks like PageHeader's photo variant: the photo shows only
 * in the header's box, under the same scrim, with the title. Scrolling opens
 * the photo's window to the whole screen as the scrim lifts, then a light
 * wash rises over it so the text reads, leaving the photo faintly behind.
 * With reduced motion it shows the faint photo behind the text, unmoving.
 *
 * Props:
 *   title    — the page's h1
 *   src      — the photo; needs -480/-1024/-1920 files (ResponsivePicture)
 *   alt      — description of the photo
 *   focus    — the spot it zooms in on, as "x% y%" of the screen-filling photo
 *   position — which part of the photo to keep in view, as "x% y%"
 *   start    — the height (fraction of the photo) to show in the header's box
 *              before scrolling; the photo slides back into place as it opens
 *   children — the content it becomes the background of (transparent sections)
 */
export default function PhotoBackdrop({ title, src, alt, focus = "50% 50%", position = "50% 50%", start, children }) {
  const wrapRef = useRef(null);
  const layerRef = useRef(null);
  const bandRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    const layer = layerRef.current;
    const band = bandRef.current;
    if (!wrap || !layer || !band) return undefined;
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;

    const update = () => {
      frame = 0;
      const H = layer.clientHeight;
      const b = band.offsetHeight;
      const offset = Math.max(0, STICKY_TOP - wrap.getBoundingClientRect().top);
      // Opening: over the first two thirds of the header's height
      const open = reduced ? 1 : smooth(clamp01(offset / (b * 0.65)));
      // Fading behind the text: just behind the opening, so the text never
      // sits on the full-strength photo
      const fade = reduced ? 1 : smooth(clamp01((offset - b * 0.1) / (b * 0.6)));
      // Zoom: across the whole stretch
      const run = Math.max(1, wrap.offsetHeight - H);
      const zoom = reduced ? 0 : clamp01(offset / run);

      // Before scrolling, lift the photo so the `start` height sits in the
      // header's box (just above its middle); it settles as the photo opens
      let lift = 0;
      const img = layer.querySelector("img");
      if (start != null && img?.naturalWidth) {
        const W = layer.clientWidth;
        const s = Math.max(W / img.naturalWidth, H / img.naturalHeight);
        const ch = img.naturalHeight * s;
        const posY = parseFloat(position.split(" ")[1] ?? "50") / 100;
        const top = (H - ch) * posY;
        // never so far that the photo's bottom edge rises into the box
        lift = Math.min(0, Math.max(b - (top + ch), b * 0.55 - (top + start * ch)));
      }
      layer.style.setProperty("--lift", `${(lift * (1 - open)).toFixed(1)}px`);
      layer.style.clipPath = `inset(0 0 ${((H - b) * (1 - open)).toFixed(1)}px 0)`;
      wrap.style.setProperty("--scrim", (1 - open).toFixed(3));
      layer.style.setProperty("--wash", (0.8 * fade).toFixed(3));
      // A small jump as it opens, then a slow push in
      layer.style.setProperty("--zoom", (1 + 0.05 * Math.sin(open * Math.PI) + 0.45 * zoom).toFixed(4));
    };
    const request = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(request) : null;
    ro?.observe(wrap);
    ro?.observe(band);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
      ro?.disconnect();
    };
  }, [start, position, loaded]);

  return (
    <div ref={wrapRef} className="photo-backdrop">
      <div ref={layerRef} className="photo-backdrop__layer">
        <ResponsivePicture
          src={src}
          widths={[480, 1024, 1920]}
          sizes="100vw"
          alt={alt}
          loading="eager"
          fetchPriority="high"
          onLoad={() => setLoaded(true)}
          className="photo-backdrop__img"
          style={{ opacity: loaded ? 1 : 0, objectPosition: position, transformOrigin: focus }}
        />
        <div className="photo-backdrop__scrim" aria-hidden="true" />
        <div className="photo-backdrop__wash" aria-hidden="true" />
      </div>

      {/* The header: same box and title as PageHeader, over the photo */}
      <div ref={bandRef} className="premium-page-header premium-page-header--left premium-page-header--tall photo-backdrop__band">
        <div className="premium-page-header__content">
          <h1>{title}</h1>
        </div>
      </div>

      <div className="photo-backdrop__content">{children}</div>
    </div>
  );
}
