import { useLayoutEffect, useRef } from "react";
import { createPortal } from "react-dom";

/**
 * BrandFlight — as the page scrolls, carries a piece of hero lettering up
 * into the fixed header, where it takes the place of the header's own copy
 * (.nav-brand-text, which stays hidden while this is mounted: at the top of
 * the page the header shows only its crest). Further down, as a marker
 * element (the dog) passes under the header, the docked "St·Dom's" opens into
 * "St·Dominic's": the "'s" slides right while "inic" unrolls behind it.
 * The header's dog (shown in the crest's place on Home) fades and shrinks
 * into the crest as the lettering arrives. Scrolling back up reverses it all.
 *
 * A fixed copy does the flying, between the hero image's own box (measured
 * live, so the intro zoom and the page's layout are respected) and the
 * header's copy. The light hero version fades into the dark header version as
 * it arrives. Once docked it simply stays there (the header link underneath
 * still takes clicks), and <html> carries .brand-docked, so the docked name
 * stays in the header while the phone menu is open. With reduced motion both
 * changes happen at once, at the same scroll points, without movement.
 *
 * Props:
 *   sourceRef    — the hero <img> to carry (hidden while its copy flies)
 *   lightSrc     — that image (replaced by whichever file the hero loaded)
 *   lightOpacity — the hero image's opacity, matched by the copy
 *   dark         — the header lettering as three layers of the full name,
 *                  each the full name's size: { parts: [left, middle, right],
 *                  closedAspect, midStart, midFrac, midShift } where
 *                  closedAspect is the closed name's width/height, midStart
 *                  and midFrac are where the middle starts and how wide it is
 *                  (fractions of the full width), and midShift is the
 *                  middle's width in heights
 *   expandRef    — the element whose passing opens the name
 */
export default function BrandFlight({ sourceRef, lightSrc, lightOpacity = 1, dark, expandRef }) {
  const flyRef = useRef(null);
  const lightRef = useRef(null);
  const darkRef = useRef(null);

  // Layout effect: the header copy must be hidden before the first paint
  useLayoutEffect(() => {
    const fly = flyRef.current;
    const source = sourceRef.current;
    if (!fly || !source) return undefined;
    const root = document.documentElement;
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const smooth = (t) => t * t * (3 - 2 * t);
    const clamp01 = (t) => Math.min(1, Math.max(0, t));
    const between = (t, a, b) => clamp01((t - a) / (b - a));
    root.style.setProperty("--brand-text-opacity", "0");

    // Room for the name in the header row: up to the menu, less today's
    // times (which slide right as the name opens)
    const room = (slot, slotLeft) => {
      const link = slot.closest("a");
      const row = link?.parentElement;
      if (!row) return Infinity;
      const kids = [...row.children].filter((c) => c !== link && getComputedStyle(c).display !== "none");
      const today = kids.find((c) => c.classList.contains("nav-today"));
      const next = kids.find((c) => c !== today);
      let limit = next ? next.getBoundingClientRect().left - 16 : row.getBoundingClientRect().right;
      if (today) limit -= today.getBoundingClientRect().width + 20;
      return limit - slotLeft;
    };

    let frame = 0;
    const update = () => {
      frame = 0;
      const slot = document.querySelector(".nav-brand-text img");
      if (!slot) return;

      // Where it lands: exactly on the header's own (hidden) copy
      const end = slot.getBoundingClientRect();
      // Where it starts: the hero image as currently laid out (and zoomed);
      // the copy uses the same file the hero picked, so nothing loads twice
      const start = source.getBoundingClientRect();
      if (source.currentSrc && lightRef.current.getAttribute("src") !== source.currentSrc) {
        lightRef.current.setAttribute("src", source.currentSrc);
      }
      // It docks once the page has scrolled as far as its starting point is
      // below the slot, so it rises with the page while shrinking into place
      const distance = start.top + window.scrollY - end.top;
      let p = distance > 0 ? clamp01(window.scrollY / distance) : 1;
      if (reduced) p = p >= 1 ? 1 : 0;

      // Opening: from when the marker's middle is 35% of a screen below the
      // header until it reaches the header's bottom edge
      let q = 0;
      const marker = expandRef?.current;
      if (p >= 1 && marker) {
        const navBottom = slot.closest("nav")?.getBoundingClientRect().bottom ?? end.bottom;
        const m = marker.getBoundingClientRect();
        const center = m.top + m.height / 2;
        const from = navBottom + window.innerHeight * 0.35;
        q = clamp01((from - center) / (from - navBottom));
        if (reduced) q = q >= 0.5 ? 1 : 0;
      }

      // On narrow screens the open name shrinks a little so it never reaches the menu
      let h = end.height;
      let top = end.top;
      if (q > 0) {
        const want = h * (dark.closedAspect + q * dark.midShift);
        const avail = room(slot, end.left);
        if (want > avail) {
          const s = avail / want;
          top += (h - h * s) / 2;
          h *= s;
        }
      }
      root.style.setProperty("--brand-extra", `${(q * dark.midShift * h).toFixed(1)}px`);

      // The dog in the header gives way to the crest while the lettering
      // travels, finishing just before it lands
      root.style.setProperty("--dog-to-crest", smooth(between(p, 0.25, 0.85)).toFixed(4));

      root.classList.toggle("brand-docked", p >= 1);

      const flying = p > 0;
      source.style.visibility = flying ? "hidden" : "";
      fly.style.display = flying ? "block" : "none";
      if (!flying) return;

      const e = smooth(p);
      const height = start.height + (h - start.height) * e;
      const width = start.width + (h * dark.closedAspect - start.width) * e;
      const left = start.left + (end.left - start.left) * e;
      const y = start.top + (top - start.top) * e;
      fly.style.transform = `translate3d(${left}px, ${y}px, 0)`;
      fly.style.width = `${width}px`;
      fly.style.height = `${height}px`;
      const darkness = between(p, 0.55, 0.95);
      lightRef.current.style.opacity = (lightOpacity * (1 - darkness)).toFixed(3);
      darkRef.current.style.opacity = darkness.toFixed(3);
      darkRef.current.style.fontSize = `${height}px`;
      darkRef.current.style.setProperty("--open", q.toFixed(4));
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
    const slot = document.querySelector(".nav-brand-text img");
    if (slot) ro?.observe(slot);
    const tick = window.setInterval(request, 250); // catches the intro zoom between scrolls

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
      ro?.disconnect();
      window.clearInterval(tick);
      source.style.visibility = "";
      root.style.removeProperty("--brand-text-opacity");
      root.style.removeProperty("--brand-extra");
      root.style.removeProperty("--dog-to-crest");
      root.classList.remove("brand-docked");
    };
  }, [sourceRef, expandRef, lightOpacity, dark]);

  return createPortal(
    <div ref={flyRef} className="brand-flight" aria-hidden="true">
      <img ref={lightRef} className="brand-flight__light" src={lightSrc} alt="" />
      <div
        ref={darkRef}
        className="brand-flight__dark"
        style={{ "--mid-start": dark.midStart, "--mid-frac": dark.midFrac, "--mid-shift": dark.midShift }}
      >
        <img src={dark.parts[0]} alt="" />
        <img className="brand-flight__middle" src={dark.parts[1]} alt="" />
        <img className="brand-flight__end" src={dark.parts[2]} alt="" />
      </div>
    </div>,
    document.body,
  );
}
