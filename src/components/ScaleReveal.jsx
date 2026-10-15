import { useEffect, useState } from "react";
import useScrollProgress from "../hooks/useScrollProgress";
import { reducedMotionQuery } from "../classic";
import { classicPhoto } from "../constants/photos";

/**
 * ScaleReveal — image that scales up from small to full size on scroll.
 *
 * Apple-style effect where an image starts slightly smaller with rounded
 * corners and smoothly expands to fill its container as you scroll into it.
 *
 * Props:
 *   src       — image URL
 *   alt       — alt text
 *   caption   — optional caption below image
 *   maxWidth  — max width of the image (default 800)
 */
export default function ScaleReveal({
  src,
  alt,
  caption,
  maxWidth = 800,
}) {
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const mq = reducedMotionQuery();
    setReducedMotion(mq.matches);
    const handler = (e) => setReducedMotion(e.matches);
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, []);

  const { ref, progress } = useScrollProgress({ offset: 0.95 });

  // Ease the progress for smoother feel
  const eased = reducedMotion
    ? 1
    : 1 - Math.pow(1 - Math.min(1, progress * 1.3), 3);

  const scale = reducedMotion ? 1 : 0.88 + eased * 0.12;
  const radius = reducedMotion ? 0 : Math.round(16 * (1 - eased));
  const opacity = reducedMotion ? 1 : 0.7 + eased * 0.3;
  const shadow = reducedMotion ? 0 : eased * 20;

  return (
    <figure
      ref={ref}
      style={{
        margin: "40px auto",
        textAlign: "center",
        maxWidth,
      }}
    >
      <div
        style={{
          overflow: "hidden",
          borderRadius: radius,
          transform: reducedMotion ? "none" : `scale(${scale})`,
          opacity,
          boxShadow: reducedMotion
            ? "none"
            : `0 ${shadow * 0.5}px ${shadow}px rgba(0,0,0,${0.08 + eased * 0.07})`,
          transition: reducedMotion ? "none" : "border-radius 0.1s linear",
          willChange: reducedMotion ? "auto" : "transform, opacity",
        }}
      >
        <img
          src={classicPhoto(src)}
          alt={alt}
          loading="lazy"
          style={{
            width: "100%",
            display: "block",
          }}
        />
      </div>
      {caption && (
        <figcaption
          style={{
            fontSize: 13,
            color: "#8A8580",
            fontStyle: "italic",
            marginTop: 12,
            opacity: reducedMotion ? 1 : Math.min(1, progress * 2),
          }}
        >
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
