import { useLocation } from "react-router-dom";
import HeroImage from "./HeroImage";
import ResponsivePicture from "./ResponsivePicture";
import { PHOTOS } from "../constants/photos";

/**
 * PageHeader — page opener, two families:
 *
 *   variant="photo" (default) — photography with a reduced burgundy scrim,
 *     composition set bottom-left. Use only where the photo earns its place
 *     (sacraments, staff, events).
 *   variant="text" — no photo. Warm-white ground, left-set serif h1 behind a
 *     hanging gold rule, optional small-caps kicker, optional `aside` slot
 *     (e.g. office hours) on the right end of the baseline.
 *
 * Props:
 *   title     — heading text
 *   variant   — "photo" | "text"
 *   heroSrc   — photo variant: custom hero image (falls back to PHOTOS.pageHeader)
 *   position  — photo variant: which part of the photo stays in view (CSS
 *               object-position, default "center")
 *   overlay   — photo variant: scrim opacity (default 0.38 — let the photo read)
 *   tint      — photo variant: scrim tint color
 *   tall      — photo variant: taller padding
 *   kicker    — optional small-caps line above the title
 *   aside     — text variant: right-hand slot content
 *
 * The element keeps a per-sacrament viewTransitionName on its root in every
 * variant so the card -> detail page transition pairs stay valid. Slugs are
 * camelCased to match the card names (sacrament-firstCommunion).
 */
export default function PageHeader({
  title,
  variant = "photo",
  heroSrc,
  position,
  overlay = 0.38,
  tint = "rgba(74,16,25,0.55)",
  tall = false,
  kicker,
  lede,
  aside,
}) {
  const location = useLocation();
  const sacramentMatch = location.pathname.match(/^\/sacraments\/([\w-]+)$/);
  const vtName = sacramentMatch
    ? `sacrament-${sacramentMatch[1].replace(/-(\w)/g, (_, c) => c.toUpperCase())}`
    : undefined;
  const vtStyle = vtName ? { viewTransitionName: vtName } : {};

  if (variant === "text") {
    return (
      <header className="premium-page-header--text" style={vtStyle}>
        <div className="premium-page-header__text-inner">
          <div>
            {kicker && <p className="kicker">{kicker}</p>}
            <h1>{title}</h1>
          </div>
          {aside && <div className="premium-page-header__aside">{aside}</div>}
        </div>
      </header>
    );
  }

  if (variant === "split") {
    return (
      <header className="premium-page-header--text premium-page-header--split" style={vtStyle}>
        <div className="premium-page-header__text-inner">
          <div>
            {kicker && <p className="kicker">{kicker}</p>}
            <h1>{title}</h1>
            {lede && <p className="premium-page-header__lede u-lede">{lede}</p>}
          </div>
          {heroSrc && (
            <div className="premium-page-header__media" aria-hidden="true">
              <ResponsivePicture
                src={heroSrc}
                widths={[480, 1024]}
                sizes="(max-width: 760px) 100vw, 460px"
                alt=""
                loading="eager"
              />
            </div>
          )}
        </div>
      </header>
    );
  }

  return (
    <div
      className={`premium-page-header premium-page-header--left${
        tall ? " premium-page-header--tall" : ""
      }`}
      style={vtStyle}
    >
      <HeroImage src={heroSrc || PHOTOS.pageHeader} position={position} overlay={overlay} tint={tint} />
      <div className="premium-page-header__content">
        {kicker && <p className="kicker kicker--light">{kicker}</p>}
        <h1>{title}</h1>
      </div>
    </div>
  );
}
