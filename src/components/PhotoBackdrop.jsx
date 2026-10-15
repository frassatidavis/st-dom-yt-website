import { useLayoutEffect, useRef, useState } from "react";
import ResponsivePicture from "./ResponsivePicture";
import { isClassic, reducedMotionQuery } from "../classic";
import PageHeader from "./PageHeader";

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
 *   subject  — [x, y], the spot (fractions of the photo) it zooms around and
 *              shows in the header's box before scrolling; the photo slides
 *              back into place as it opens
 *   zoom     — [from, to]: the scale at the top and at the end of the stretch
 *              ([1, 1.45] pushes in on the subject; [1.7, 1] starts close on
 *              it and pulls back)
 *   subjectAt — how far down the header's box the subject sits before
 *              scrolling (0 = top, 1 = bottom; the title is near the bottom)
 *   position — which part of the photo to keep in view, as "x% y%"
 *   tone     — "light" (a cream wash; dark text) | "dark" (darkness closes in
 *              from the edges and falls to near-black; the text turns light).
 *              With "dark", a child marked data-dawn brings the light back:
 *              as it rises up the screen the black lifts to white and the
 *              text turns dark again.
 *   classicBig — Classic Mode: a much taller header, so more of the photo shows
 *   children — the content it becomes the background of (transparent sections)
 */
export default function PhotoBackdrop(props) {
  // Classic Mode: a plain photo header, then the text on paper
  if (isClassic()) {
    return (
      <>
        <div className={props.classicBig ? "classic-big-header" : undefined}>
          <PageHeader title={props.title} heroSrc={props.src} position={props.position} tall />
        </div>
        {props.children}
      </>
    );
  }
  return <PhotoBackdropScroll {...props} />;
}

function PhotoBackdropScroll({ title, src, alt, subject = [0.5, 0.5], zoom = [1, 1.45], subjectAt = 0.55, position = "50% 50%", tone = "light", children }) {
  const [zoomFrom, zoomTo] = zoom;
  const [subjectX, subjectY] = subject;
  const wrapRef = useRef(null);
  const layerRef = useRef(null);
  const bandRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    const layer = layerRef.current;
    const band = bandRef.current;
    if (!wrap || !layer || !band) return undefined;
    const reduced = reducedMotionQuery().matches;
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
      const stretch = Math.max(1, wrap.offsetHeight - H);
      const run = reduced ? 1 : clamp01(offset / stretch);

      // Where the subject is on the screen-filling photo (object-fit: cover)
      let lift = 0;
      let shift = 0;
      const img = layer.querySelector("img");
      if (img?.naturalWidth) {
        const W = layer.clientWidth;
        const s = Math.max(W / img.naturalWidth, H / img.naturalHeight);
        const cw = img.naturalWidth * s;
        const ch = img.naturalHeight * s;
        const [posX, posY] = position.split(" ").map((v) => parseFloat(v) / 100);
        const left = (W - cw) * posX;
        const top = (H - ch) * posY;
        // The zoom is around the subject
        img.style.transformOrigin = `${(left + subjectX * cw).toFixed(1)}px ${(top + subjectY * ch).toFixed(1)}px`;
        // Before scrolling, lift the photo so the subject sits in the header's
        // box (just above its middle), never so far that the photo's bottom
        // edge rises into the box; it settles as the photo opens
        // (the drawn photo is clipped to the screen-sized frame, so it is
        // the frame's edges, scaled around the subject, that must cover)
        const oy = top + subjectY * ch;
        lift = Math.min(0, Math.max(b - oy - zoomFrom * (H - oy), b * subjectAt - oy));
        // ...and across, so it sits right of the title (at 62% of the width),
        // as far as the (zoomed) photo still covers the screen
        const ox = left + subjectX * cw;
        const lo = W - ox - zoomFrom * (W - ox);
        const hi = -ox - zoomFrom * (0 - ox);
        shift = Math.min(hi, Math.max(lo, W * 0.62 - ox));
      }
      layer.style.setProperty("--lift", `${(lift * (1 - open)).toFixed(1)}px`);
      layer.style.setProperty("--shift", `${(shift * (1 - open)).toFixed(1)}px`);
      layer.style.clipPath = `inset(0 0 ${((H - b) * (1 - open)).toFixed(1)}px 0)`;
      wrap.style.setProperty("--scrim", (1 - open).toFixed(3));
      layer.style.setProperty("--wash", ((tone === "dark" ? 0.88 : 0.8) * fade).toFixed(3));
      // Dark: dawn as the marked child rises from 85% to 35% of the screen
      const marker = wrap.querySelector("[data-dawn]");
      let dawn = 0;
      if (tone === "dark" && marker) {
        const top = marker.getBoundingClientRect().top;
        dawn = smooth(clamp01((window.innerHeight * 0.85 - top) / (window.innerHeight * 0.5)));
      }
      wrap.style.setProperty("--dawn", dawn.toFixed(3));
      wrap.classList.toggle("is-dawn", dawn > 0.5);
      // Dark: the edges close in first, then the rest falls away
      layer.style.setProperty("--vignette", smooth(clamp01((offset - b * 0.05) / (b * 0.45))).toFixed(3));
      // A small jump as it opens, then a slow zoom from `from` to `to`
      layer.style.setProperty("--zoom", (zoomFrom + (zoomTo - zoomFrom) * run + 0.05 * Math.sin(open * Math.PI)).toFixed(4));
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
  }, [subjectX, subjectY, subjectAt, zoomFrom, zoomTo, position, tone, loaded]);

  return (
    <div ref={wrapRef} className={`photo-backdrop photo-backdrop--${tone}`}>
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
          style={{ opacity: loaded ? 1 : 0, objectPosition: position }}
        />
        <div className="photo-backdrop__scrim" aria-hidden="true" />
        {tone === "dark" && <div className="photo-backdrop__vignette" aria-hidden="true" />}
        <div className="photo-backdrop__wash" aria-hidden="true" />
        {tone === "dark" && <div className="photo-backdrop__dawn" aria-hidden="true" />}
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
