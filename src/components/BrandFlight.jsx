import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

/**
 * BrandFlight — as the page scrolls, carries a piece of hero lettering up
 * into the fixed header, where it takes the place of the header's text name
 * (.nav-brand-text). Scrolling back up returns it to the hero.
 *
 * A fixed copy does the flying, between the hero image's own box (measured
 * live, so the intro zoom and the page's layout are respected) and a slot
 * beside the header crest. The light hero version fades into a dark one as it
 * arrives, so it reads on the light header. Once docked it simply stays there
 * (the header link underneath still takes clicks). With reduced motion it
 * swaps at the same point without flying.
 *
 * Props:
 *   sourceRef  — the hero <img> to carry (hidden while its copy flies)
 *   lightSrc   — that image (light lettering, for over the photo); replaced
 *                by whichever file the hero image actually loaded
 *   lightOpacity — the hero image's opacity, matched by the copy
 *   darkSrc    — the same lettering, solid and dark, for the header
 *   aspect     — width / height of the lettering
 */
export default function BrandFlight({ sourceRef, lightSrc, lightOpacity = 1, darkSrc, aspect }) {
  const flyRef = useRef(null);
  const lightRef = useRef(null);
  const darkRef = useRef(null);

  useEffect(() => {
    const fly = flyRef.current;
    const source = sourceRef.current;
    if (!fly || !source) return undefined;
    const root = document.documentElement;
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const smooth = (t) => t * t * (3 - 2 * t);
    const between = (t, a, b) => Math.min(1, Math.max(0, (t - a) / (b - a)));

    let frame = 0;
    const update = () => {
      frame = 0;
      const text = document.querySelector(".nav-brand-text");
      if (!text) return;
      const row = text.closest("a")?.parentElement || text;

      // Where it lands: beside the crest, vertically centered in the header row
      const rowBox = row.getBoundingClientRect();
      const textBox = text.getBoundingClientRect();
      const endH = Math.min(54, rowBox.height - 20);
      const end = { left: textBox.left, top: rowBox.top + (rowBox.height - endH) / 2, width: endH * aspect, height: endH };

      // Where it starts: the hero image as currently laid out (and zoomed);
      // the copy uses the same file the hero picked, so nothing loads twice
      const start = source.getBoundingClientRect();
      if (source.currentSrc && lightRef.current.getAttribute("src") !== source.currentSrc) {
        lightRef.current.setAttribute("src", source.currentSrc);
      }
      // It docks once the page has scrolled as far as its starting point is
      // below the slot, so it rises with the page while shrinking into place
      const distance = start.top + window.scrollY - end.top;
      let p = distance > 0 ? Math.min(1, Math.max(0, window.scrollY / distance)) : 1;
      if (reduced) p = p >= 1 ? 1 : 0;

      const flying = p > 0;
      source.style.visibility = flying ? "hidden" : "";
      fly.style.display = flying ? "block" : "none";
      // The header's text name fades out as the lettering arrives
      root.style.setProperty("--brand-text-opacity", (1 - between(p, 0.55, 0.9)).toFixed(3));
      if (!flying) return;

      const e = smooth(p);
      const left = start.left + (end.left - start.left) * e;
      const top = start.top + (end.top - start.top) * e;
      const width = start.width + (end.width - start.width) * e;
      fly.style.transform = `translate3d(${left}px, ${top}px, 0)`;
      fly.style.width = `${width}px`;
      fly.style.height = `${width / aspect}px`;
      const dark = between(p, 0.55, 0.95);
      lightRef.current.style.opacity = (lightOpacity * (1 - dark)).toFixed(3);
      darkRef.current.style.opacity = dark.toFixed(3);
    };
    const request = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    // The header changes height when scrolled and the hero lettering zooms
    // during the intro; keep following both
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(request) : null;
    ro?.observe(source);
    const text = document.querySelector(".nav-brand-text");
    if (text) ro?.observe(text.closest("a")?.parentElement || text);
    const tick = window.setInterval(request, 250); // catches the intro zoom between scrolls

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
      ro?.disconnect();
      window.clearInterval(tick);
      source.style.visibility = "";
      root.style.removeProperty("--brand-text-opacity");
    };
  }, [sourceRef, aspect, lightOpacity]);

  return createPortal(
    <div ref={flyRef} className="brand-flight" aria-hidden="true">
      <img ref={lightRef} src={lightSrc} alt="" />
      <img ref={darkRef} src={darkSrc} alt="" />
    </div>,
    document.body,
  );
}
