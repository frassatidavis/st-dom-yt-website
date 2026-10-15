import { useEffect, useRef, useState, useCallback } from "react";
import { T } from "../constants/theme";
import { reducedMotionQuery } from "../classic";

/**
 * StickyScrub — Apple-style sticky section that scrubs text panels past
 * a pinned background image. The image stays fixed while each panel
 * fades in, holds, and fades out as the user scrolls.
 *
 * Props:
 *   image          — background image URL
 *   overlay        — dark overlay opacity (default 0.4)
 *   panels         — ordered list of { id, title, body }
 *   height         — total scroll runway (default "300vh")
 *   viewportHeight — sticky inner height (default "100vh")
 */
export default function StickyScrub({
  image,
  overlay = 0.4,
  panels = [],
  height = "300vh",
  viewportHeight = "100vh",
}) {
  const wrapperRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = reducedMotionQuery();
    setReducedMotion(mq.matches);
    const handler = (e) => setReducedMotion(e.matches);
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, []);

  const handleScroll = useCallback(() => {
    if (reducedMotion) return;
    const el = wrapperRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const h = el.offsetHeight;
    const scrollRange = h - window.innerHeight;
    if (scrollRange <= 0) {
      setProgress(0);
      return;
    }
    const p = Math.min(1, Math.max(0, -rect.top / scrollRange));
    setProgress(p);
  }, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion) return;
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll, reducedMotion]);

  const count = Math.max(1, panels.length);

  // Compute opacity for a panel band [start..end] with fade-in 0->0.2,
  // hold 0.2->0.8, fade-out 0.8->1.0 (within the band, normalized).
  const panelOpacity = (i) => {
    if (reducedMotion) return 1;
    const start = i / count;
    const end = (i + 1) / count;
    if (progress < start || progress > end) return 0;
    const local = (progress - start) / (end - start);
    if (local < 0.2) return local / 0.2;
    if (local > 0.8) return Math.max(0, (1 - local) / 0.2);
    return 1;
  };

  // Subtle lift on each panel as it moves through its band.
  const panelY = (i) => {
    if (reducedMotion) return 0;
    const start = i / count;
    const end = (i + 1) / count;
    if (progress < start || progress > end) return 0;
    const local = (progress - start) / (end - start);
    return (local - 0.5) * -24;
  };

  return (
    <div ref={wrapperRef} style={{ height, position: "relative" }}>
      <div
        style={{
          position: "sticky",
          top: 0,
          height: viewportHeight,
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Preload image */}
        {image && (
          <img
            src={image}
            alt=""
            aria-hidden="true"
            onLoad={() => setLoaded(true)}
            style={{ position: "absolute", width: 0, height: 0, opacity: 0, pointerEvents: "none" }}
          />
        )}

        {/* Pinned background */}
        {image && (
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
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
            opacity: loaded ? 1 : 0,
            transition: loaded ? "none" : "opacity 0.8s ease",
          }}
        />

        {/* Panels stack */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            width: "100%",
            maxWidth: 640,
            padding: "0 24px",
            textAlign: "center",
          }}
        >
          {panels.map((panel, i) => {
            const op = panelOpacity(i);
            const ty = panelY(i);
            const isStaticStacked = reducedMotion;
            return (
              <div
                key={panel.id || i}
                style={{
                  position: isStaticStacked ? "relative" : "absolute",
                  top: isStaticStacked ? "auto" : 0,
                  left: isStaticStacked ? "auto" : 0,
                  right: isStaticStacked ? "auto" : 0,
                  marginBottom: isStaticStacked ? 48 : 0,
                  opacity: op,
                  transform: `translateY(${ty}px)`,
                  pointerEvents: op > 0.05 ? "auto" : "none",
                  willChange: "transform, opacity",
                  color: T.warmWhite,
                }}
              >
                {panel.title && (
                  <h2
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "clamp(2rem, 5vw, 3.25rem)",
                      fontWeight: 500,
                      lineHeight: 1.1,
                      letterSpacing: "-0.01em",
                      margin: "0 0 20px",
                      color: T.warmWhite,
                    }}
                  >
                    {panel.title}
                  </h2>
                )}
                {panel.body && (
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "clamp(1rem, 1.6vw, 1.2rem)",
                      lineHeight: 1.6,
                      fontWeight: 300,
                      margin: 0,
                      color: "rgba(255,255,255,0.9)",
                    }}
                  >
                    {panel.body}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
