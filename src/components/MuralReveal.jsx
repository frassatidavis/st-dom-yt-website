import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown, X } from "lucide-react";
import ResponsivePicture from "./ResponsivePicture";
import DominicanDivider from "./DominicanDivider";
import { MURAL_MAP, MURAL_MAP_IDS, MURAL_MAP_SIZE } from "../data/muralSaintMap";

// The header sticks just below the shrunken (scrolled) site header
const STICKY_TOP = 64;
// Scroll runway, in stage heights: opening the picture, then holding it
const OPEN_RUNWAY = 0.8;
// A figure's frame, as fractions of the picture: halo to chest, 4:5
const FRAME_W = 0.15;
const FRAME_H = 0.1875;
const FRAME_ABOVE = 0.075; // from the face's centre up to the frame's top
// Zoomed in, the frame fills this share of the open picture's height,
// centred this far down it (the card with the life sits below)
const ZOOM_FRAME_H = 0.5;
const ZOOM_FRAME_Y = 0.33;
const CARD_TOP = 0.64;
const ZOOM_MS = 900;
// Open, the picture fills the space below the header, trimming at most this
// much (its size over the space's smaller side; beyond it, dark bands show).
// Upright screens trim the sides, so less there: the figures reach 14–86%.
const OPEN_MAX_COVER = 1.75;
const OPEN_MAX_COVER_UPRIGHT = 1.3;
// Where the open picture's trim falls (0 = keep the top, 1 = keep the bottom)
const OPEN_FOCUS_Y = 0.43;

// Who is where on the picture (decoded once): the figure's id per grid cell
let figureMap = null;
function figureAt(fx, fy) {
  if (!figureMap) {
    figureMap = new Uint8Array(MURAL_MAP_SIZE * MURAL_MAP_SIZE);
    let i = 0;
    for (const run of MURAL_MAP.split(" ")) {
      const [id, n] = run.split(".").map(Number);
      figureMap.fill(id, i, i + n);
      i += n;
    }
  }
  if (fx < 0 || fy < 0 || fx >= 1 || fy >= 1) return null;
  const id = figureMap[Math.floor(fy * MURAL_MAP_SIZE) * MURAL_MAP_SIZE + Math.floor(fx * MURAL_MAP_SIZE)];
  return id ? MURAL_MAP_IDS[id - 1] : null;
}

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const between = (v, a, b) => clamp01((v - a) / (b - a));
const smooth = (v) => v * v * (3 - 2 * v);

// Frame of a figure (fractions of the picture), from the centre of its face
const frameOf = (spot) => ({
  left: spot.x / 100 - FRAME_W / 2,
  top: spot.y / 100 - FRAME_ABOVE,
  width: FRAME_W,
  height: FRAME_H,
});

/**
 * MuralReveal — a page opener that starts as the usual photo header (the
 * same box, crop, scrim and title as PageHeader) and, as the page scrolls,
 * opens out into the whole square picture on a dark ground, where it stays
 * for a while before the page moves on.
 *
 * The picture never jumps: at the top it is laid out exactly like the
 * header's cover crop, and the visible window and the picture then move
 * together until the window is the picture's own square. Scrolling back up
 * reverses it. With reduced motion the picture opens at once, half way along.
 *
 * Once open, each figure in `spots` is outlined in softly glowing gold
 * (its `glow` image, drawn from the photo; muralSaintMap says which figure
 * is under the pointer). Pointing at one brightens it and names it; choosing
 * one zooms in on that figure's face in a gold frame, in colour,
 * with the rest of the picture in black and white, and shows a short life
 * below it. A click anywhere (or Escape, or scrolling back up) zooms back out.
 *
 * Props:
 *   title    — the page's h1
 *   src      — the square photo; needs -480/-1024/-1920 files (ResponsivePicture)
 *   alt      — description of the picture
 *   caption  — line under the header before the picture opens
 *   position — the header crop's focal point, as "x% y%"
 *   spots    — [{ id, x, y, name, bio, glow }]: x/y the centre of the face, in %
 *              of the picture; glow its outline image (transparent, picture-sized)
 */
export default function MuralReveal({ title, src, alt, caption, position = "50% 50%", spots = [] }) {
  const { t } = useTranslation();
  const wrapRef = useRef(null);
  const stageRef = useRef(null);
  const bandRef = useRef(null);
  const windowRef = useRef(null);
  const stackRef = useRef(null);
  const scrimRef = useRef(null);
  const darkRef = useRef(null);
  const captionRef = useRef(null);
  const spotsRef = useRef(null);
  const cardRef = useRef(null);
  const closeRef = useRef(null);
  const lastSpotRef = useRef(null);
  const selectedRef = useRef(null);
  const relayoutRef = useRef(() => {});
  const [loaded, setLoaded] = useState(false);
  const [open, setOpen] = useState(false); // the whole picture is in view
  const [selected, setSelected] = useState(null);
  const [zooming, setZooming] = useState(false);
  const [hover, setHover] = useState(null); // { id, x, y } under the pointer
  const [focused, setFocused] = useState(null);

  const spot = spots.find((s) => s.id === selected) || null;

  // Scroll: lay out the picture, its window and the overlays for the progress
  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    const stage = stageRef.current;
    if (!wrap || !stage) return undefined;
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const [fx, fy] = position.split(" ").map((v) => parseFloat(v) / 100);
    let geo = null;
    let frame = 0;
    let wasOpen = false;

    const measure = () => {
      const W = stage.clientWidth;
      const H = stage.clientHeight;
      const b = bandRef.current.offsetHeight;
      // Keep the open picture clear of the fixed Mass & Confession bar
      const bar = document.querySelector(".parish-action-bar");
      const barTop = bar && getComputedStyle(bar).display !== "none" ? bar.getBoundingClientRect().top : Infinity;
      const avail = Math.min(H, barTop - STICKY_TOP);
      const S0 = Math.max(W, b); // header: cover crop of the square
      // Open: covering the space, up to OPEN_MAX_COVER times its smaller side
      const S1 = Math.min(Math.max(W, avail), Math.min(W, avail) * (W < avail ? OPEN_MAX_COVER_UPRIGHT : OPEN_MAX_COVER));
      // The window: the part of the open picture that fits the space
      const ww = Math.min(W, S1);
      const wh = Math.min(avail, S1);
      const wx = (W - ww) / 2;
      const wy = (avail - wh) / 2;
      const x1 = (W - S1) / 2;
      const y1 = wy + (wh - S1) * OPEN_FOCUS_Y;
      const SZ = (wh * ZOOM_FRAME_H) / FRAME_H; // the picture's size when zoomed in
      geo = {
        W, H, b, avail, S0, S1, SZ, ww, wh, wx, wy, x1, y1,
        box: Math.max(S0, S1, SZ), // drawn at the largest size and scaled down, so it stays sharp
        x0: (W - S0) * fx,
        y0: (b - S0) * fy,
      };
      stackRef.current.style.width = `${geo.box}px`;
      stackRef.current.style.height = `${geo.box}px`;
      captionRef.current.style.top = `${b}px`;
      captionRef.current.style.height = `${Math.max(0, avail - b)}px`;
      // The lights sit over the open picture
      Object.assign(spotsRef.current.style, {
        left: `${geo.x1}px`, top: `${geo.y1}px`, width: `${S1}px`, height: `${S1}px`,
      });
      // The life: below the frame, over the picture and on into the space under it
      if (cardRef.current) {
        const side = Math.max(12, (ww - 760) / 2);
        Object.assign(cardRef.current.style, {
          left: `${wx + side}px`,
          right: `${W - wx - ww + side}px`,
          top: `${wy + wh * CARD_TOP}px`,
          maxHeight: `${Math.max(120, avail - 12 - (wy + wh * CARD_TOP))}px`,
        });
      }
    };

    const update = () => {
      frame = 0;
      if (!geo) measure();
      const { W, H, b, S0, S1, SZ, box, x0, y0, x1, y1, ww, wh, wx, wy } = geo;
      const runway = H * OPEN_RUNWAY;
      const offset = STICKY_TOP - wrap.getBoundingClientRect().top;
      let p = clamp01(offset / runway);
      if (reduced) p = offset >= runway / 2 ? 1 : 0;
      const e = smooth(p);

      let size = S0 + (S1 - S0) * e;
      let x = x0 + (x1 - x0) * e;
      let y = y0 + (y1 - y0) * e;
      const chosen = selectedRef.current;
      if (chosen && p >= 1) {
        // Zoomed in: the figure's frame centred near the top of the open picture
        const f = frameOf(chosen);
        size = SZ;
        x = wx + ww / 2 - (f.left + f.width / 2) * SZ;
        y = wy + wh * ZOOM_FRAME_Y - (f.top + f.height / 2) * SZ;
      }
      const scale = size / box;
      stackRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
      stackRef.current.style.setProperty("--scale", scale.toFixed(4));
      // The window: the header's box at the top, the space it fills when open
      const top = wy * e;
      const left = wx * e;
      const right = (W - wx - ww) * e;
      const bottom = H - (b + (wy + wh - b) * e);
      windowRef.current.style.clipPath = `inset(${top}px ${right}px ${bottom}px ${left}px round ${4 * e}px)`;

      bandRef.current.style.opacity = (1 - smooth(between(p, 0, 0.35))).toFixed(3);
      scrimRef.current.style.opacity = (1 - smooth(between(p, 0, 0.6))).toFixed(3);
      captionRef.current.style.opacity = (1 - smooth(between(p, 0, 0.25))).toFixed(3);
      darkRef.current.style.opacity = smooth(between(p, 0.15, 0.85)).toFixed(3);

      const isOpen = p >= 1;
      if (isOpen !== wasOpen) {
        wasOpen = isOpen;
        setOpen(isOpen);
      }
    };
    const request = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    const remeasure = () => {
      geo = null;
      request();
    };
    relayoutRef.current = remeasure;

    update();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", remeasure);
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(remeasure) : null;
    ro?.observe(stage);
    ro?.observe(bandRef.current);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", remeasure);
      ro?.disconnect();
    };
  }, [position]);

  // Choosing or closing a figure: animate the zoom, then lay out again
  useLayoutEffect(() => {
    selectedRef.current = spots.find((s) => s.id === selected) || null;
    setZooming(true);
    relayoutRef.current();
    const id = window.setTimeout(() => setZooming(false), ZOOM_MS);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- a figure's place doesn't change
  }, [selected]);

  // Scrolling back up closes the figure; Escape closes it too
  useEffect(() => {
    if (!open && selected) setSelected(null);
  }, [open, selected]);
  useEffect(() => {
    if (!selected) return undefined;
    closeRef.current?.focus({ preventScroll: true });
    const onKey = (e) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- close() only reads refs
  }, [selected]);

  const choose = (s, button) => {
    lastSpotRef.current = button;
    setSelected(s.id);
  };
  const close = () => {
    setSelected(null);
    // Back to the light that opened it (after it reappears)
    window.setTimeout(() => lastSpotRef.current?.focus({ preventScroll: true }), 0);
  };

  // The figure under a point, if the point is on the visible picture
  const figureUnder = (e) => {
    const w = windowRef.current.getBoundingClientRect();
    const clip = getComputedStyle(windowRef.current).clipPath.match(/inset\(([\d.]+)px ([\d.]+)px ([\d.]+)px ([\d.]+)px/);
    if (clip) {
      const [, t, r, b, l] = clip.map(Number);
      if (e.clientX < w.left + l || e.clientX > w.right - r || e.clientY < w.top + t || e.clientY > w.bottom - b) return null;
    }
    const r = spotsRef.current.getBoundingClientRect();
    return figureAt((e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height);
  };
  const pointAt = (e) => {
    const r = spotsRef.current.getBoundingClientRect();
    const id = figureUnder(e);
    setHover(id ? { id, x: e.clientX - r.left, y: e.clientY - r.top } : null);
  };
  const active = hover?.id || focused;
  const showFigures = open && !spot && spots.length > 0;

  const f = spot && frameOf(spot);
  const pct = (v) => `${(v * 100).toFixed(3)}%`;

  return (
    <div ref={wrapRef} className="mural-reveal">
      {/* Zoomed in, a click anywhere zooms back out */}
      <div
        ref={stageRef}
        className={`mural-reveal__stage${spot ? " is-zoomed" : ""}`}
        onClick={spot ? close : undefined}
      >
        <div ref={darkRef} className="mural-reveal__dark" aria-hidden="true" />

        <div ref={captionRef} className="mural-reveal__caption">
          <DominicanDivider />
          <p>{caption}</p>
          <ChevronDown size={22} strokeWidth={1.5} aria-hidden="true" />
        </div>

        <div ref={windowRef} className="mural-reveal__window">
          <div
            ref={stackRef}
            className={`mural-reveal__stack${zooming ? " is-zooming" : ""}${spot ? " is-focused" : ""}`}
          >
            <ResponsivePicture
              src={src}
              widths={[480, 1024, 1920]}
              sizes="100vw"
              alt={alt}
              loading="eager"
              fetchPriority="high"
              onLoad={() => setLoaded(true)}
              className="mural-reveal__picture"
              style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.8s ease, filter 0.6s ease" }}
            />
            {/* Each figure's glowing outline */}
            {showFigures &&
              spots.map((s) => (
                <img
                  key={s.id}
                  src={s.glow}
                  alt=""
                  aria-hidden="true"
                  className={`mural-reveal__glow${active === s.id ? " is-active" : ""}`}
                />
              ))}
            {/* The chosen figure in colour, inside its gold frame */}
            {f && (
              <>
                <ResponsivePicture
                  src={src}
                  widths={[480, 1024, 1920]}
                  sizes="100vw"
                  alt=""
                  loading="eager"
                  className="mural-reveal__focus"
                  style={{ clipPath: `inset(${pct(f.top)} ${pct(1 - f.left - f.width)} ${pct(1 - f.top - f.height)} ${pct(f.left)})` }}
                />
                <div
                  className="mural-reveal__frame"
                  aria-hidden="true"
                  style={{ left: pct(f.left), top: pct(f.top), width: pct(f.width), height: pct(f.height) }}
                />
              </>
            )}
          </div>
          <div ref={scrimRef} className="mural-reveal__scrim" aria-hidden="true" />
        </div>

        {/* Over the open picture: the pointer finds the figure under it; the
            buttons (one per face) are for keyboards and screen readers */}
        <div
          ref={spotsRef}
          className={`mural-reveal__spots${hover ? " is-over" : ""}`}
          hidden={!showFigures}
          onPointerMove={pointAt}
          onPointerLeave={() => setHover(null)}
          onClick={(e) => {
            if (e.target !== e.currentTarget) return;
            const id = figureUnder(e);
            const s = spots.find((x) => x.id === id);
            if (s) choose(s, spotsRef.current.querySelector(`[data-id="${s.id}"]`));
          }}
        >
          {spots.map((s) => (
            <button
              key={s.id}
              type="button"
              data-id={s.id}
              className="mural-reveal__spot"
              style={{ left: `${s.x}%`, top: `${s.y}%` }}
              aria-label={t("friars.saints.open", { name: s.name })}
              onFocus={() => setFocused(s.id)}
              onBlur={() => setFocused(null)}
              onClick={(e) => choose(s, e.currentTarget)}
            >
              <span className="mural-reveal__spot-label" aria-hidden="true">{s.name}</span>
            </button>
          ))}
          {hover && (
            <span className="mural-reveal__pointer-label" aria-hidden="true" style={{ left: hover.x, top: hover.y }}>
              {spots.find((s) => s.id === hover.id)?.name}
            </span>
          )}
        </div>

        {spot && (
          <div
            ref={cardRef}
            className="mural-reveal__card"
            role="dialog"
            aria-labelledby="mural-reveal-card-title"
          >
            <button ref={closeRef} type="button" className="mural-reveal__close" onClick={close} aria-label={t("friars.saints.close")}>
              <X size={18} aria-hidden="true" />
            </button>
            <h2 id="mural-reveal-card-title">{spot.name}</h2>
            <p>{spot.bio}</p>
          </div>
        )}

        {/* The header: same box and title as PageHeader, over the picture */}
        <div ref={bandRef} className="premium-page-header premium-page-header--left mural-reveal__band">
          <div className="premium-page-header__content">
            <h1>{title}</h1>
          </div>
        </div>
      </div>
    </div>
  );
}
