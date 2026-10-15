import { useEffect, useRef, useState, useCallback } from "react";
import { classicPhoto } from "../constants/photos";
import { reducedMotionQuery } from "../classic";

/**
 * ParallaxSection — a full-width image band with parallax depth effect.
 *
 * The background image moves slower than the scroll, creating depth.
 * Content (children) sits on top with normal flow.
 *
 * Props:
 *   image     — background image URL
 *   height    — section height (default "50vh")
 *   speed     — parallax intensity (default 0.35, higher = more movement)
 *   overlay   — dark overlay opacity (default 0.4)
 *   children  — optional content rendered on top
 */
export default function ParallaxSection({
  image: everydayImage,
  height = "50vh",
  speed = 0.35,
  overlay = 0.4,
  position = "center",
  children,
}) {
  // Classic Mode may have its own photo for this band
  const image = classicPhoto(everydayImage);
  const ref = useRef(null);
  const [offset, setOffset] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const handleScroll = useCallback(() => {
    // Respect prefers-reduced-motion
    if (reducedMotionQuery().matches) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const windowH = window.innerHeight;
    if (rect.bottom < -100 || rect.top > windowH + 100) return;
    const center = rect.top + rect.height / 2 - windowH / 2;
    // the photo extends 80px past each edge; moving it further would show a gap
    setOffset(Math.max(-80, Math.min(80, center * speed)));
  }, [speed]);

  useEffect(() => {
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <section
      ref={ref}
      style={{
        position: "relative",
        height,
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Preload */}
      {image && (
        <img
          src={image}
          alt=""
          aria-hidden="true"
          onLoad={() => setLoaded(true)}
          style={{ position: "absolute", width: 0, height: 0, opacity: 0, pointerEvents: "none" }}
        />
      )}

      {/* Parallax background — oversized to allow movement */}
      {image && (
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: -80,
            left: 0,
            right: 0,
            bottom: -80,
            backgroundImage: `url(${image})`,
            backgroundSize: "cover",
            backgroundPosition: position,
            transform: `translateY(${offset}px)`,
            opacity: loaded ? 1 : 0,
            transition: loaded ? "none" : "opacity 0.8s ease",
            willChange: "transform",
          }}
        />
      )}

      {/* Overlay */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background: `rgba(0,0,0,${overlay})`,
        }}
      />

      {/* Content */}
      {children && (
        <div style={{ position: "relative", zIndex: 1, padding: "0 24px" }}>
          {children}
        </div>
      )}
    </section>
  );
}
