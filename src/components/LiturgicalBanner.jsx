import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { getLiturgicalSeason, GOLD_SEASONS } from "../utils/liturgical";
import { reducedMotionQuery } from "../classic";

/**
 * Thin liturgical-season indicator strip.
 * Shows the current season with its liturgical color.
 */
export default function LiturgicalBanner() {
  const { t } = useTranslation();
  const season = getLiturgicalSeason();
  // Accent is a close lighter sibling of color, so 135deg reads as one calm wash.
  const gradient = `linear-gradient(135deg, ${season.color}, ${season.accent})`;
  // Festal gold seasons (Christmas/Easter) render light → dark text + markers for AA contrast.
  const isGold = GOLD_SEASONS.has(season.key);
  const textColor = isGold ? "#1A1714" : "#fff";
  const dotColor = isGold ? "rgba(26, 23, 20, 0.5)" : "rgba(255, 253, 249, 0.7)";
  const hairline = isGold ? "rgba(26, 23, 20, 0.14)" : "rgba(255, 253, 249, 0.12)";

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia &&
    reducedMotionQuery().matches;
  const duration = prefersReducedMotion ? 0 : 600;

  const prevGradientRef = useRef(gradient);
  const [fadeKey, setFadeKey] = useState(0);

  useEffect(() => {
    if (prevGradientRef.current === gradient) return;
    setFadeKey((n) => n + 1);
    const id = window.setTimeout(() => {
      prevGradientRef.current = gradient;
    }, duration);
    return () => window.clearTimeout(id);
  }, [gradient, duration]);

  const previousGradient = prevGradientRef.current;

  return (
    <div
      style={{
        position: "relative",
        color: textColor,
        textAlign: "center",
        padding: "7px 16px",
        fontSize: 11,
        letterSpacing: 0.5,
        fontVariantCaps: "all-small-caps",
        fontWeight: 600,
        background: previousGradient,
        borderBottom: `1px solid ${hairline}`,
        overflow: "hidden",
      }}
    >
      <div
        key={fadeKey}
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background: gradient,
          opacity: previousGradient === gradient ? 1 : 0,
          animation:
            previousGradient === gradient
              ? "none"
              : `liturgical-fade-in ${duration}ms var(--ease-out-expo, ease) forwards`,
        }}
      />
      <span style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
        <span
          aria-hidden="true"
          style={{
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: dotColor,
            marginRight: 8,
            flexShrink: 0,
          }}
        />
        {t(`home.liturgical.${season.key}`)}
      </span>
      <style>{`@keyframes liturgical-fade-in { from { opacity: 0; } to { opacity: 1; } }`}</style>
    </div>
  );
}
