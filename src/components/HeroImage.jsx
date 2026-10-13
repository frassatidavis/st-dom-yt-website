import { useState } from "react";
import ResponsivePicture from "./ResponsivePicture";

/**
 * HeroImage — a background image layer for hero sections.
 *
 * Renders as an absolutely-positioned cover image with overlays.
 * If `src` is falsy, renders nothing (parent keeps its CSS gradient).
 * Lazy-loads and fades in smoothly when the image is ready.
 *
 * Props:
 *   src       — image URL
 *   overlay   — dark overlay opacity (0–1), default 0.55
 *   tint      — optional CSS color for a tinted gradient overlay
 *               e.g. "rgba(107,29,42,0.5)" for a burgundy tint
 *   position  — backgroundPosition, default "center"
 *   lazy      — for photos further down a page: load when near, at normal priority
 */
export default function HeroImage({ src, overlay = 0.55, tint, position = "center", lazy = false }) {
  const [loaded, setLoaded] = useState(false);

  if (!src) return null;

  return (
    <>
      {/* photo layer */}
      <ResponsivePicture
        src={src}
        widths={[480, 1024, 1920]}
        sizes="100vw"
        alt=""
        loading={lazy ? "lazy" : "eager"}
        fetchPriority={lazy ? undefined : "high"}
        onLoad={() => setLoaded(true)}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: position,
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.8s ease",
          zIndex: 0,
        }}
      />

      {/* dark overlay for text legibility */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background: tint
            ? `linear-gradient(160deg, ${tint}, rgba(0,0,0,${overlay}))`
            : `rgba(0,0,0,${overlay})`,
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.8s ease",
          zIndex: 0,
        }}
      />
    </>
  );
}
