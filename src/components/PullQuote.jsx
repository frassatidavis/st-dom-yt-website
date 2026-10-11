import { T } from "../constants/theme";

/**
 * Editorial pull-quote used across the site for scripture and saint quotes.
 *
 * Replaces the old repeated "gold left-bar" blockquote (which read as a
 * templated AI "side-tab"). A short gold rule above the quote echoes the
 * SectionTitle divider, so the motif feels hand-set and on-brand.
 *
 * Props:
 *   text / children — the quote (one or the other)
 *   src / cite      — attribution line (optional)
 *   align           — "center" (default) | "left"
 *   tone            — "light" (default, dark text) | "dark" (light text on dark bg)
 *   variant         — "rule" (default, short gold rule above) | "margin"
 *                     (asymmetric: hairline at the left margin, hanging quote,
 *                     small-caps attribution — the editorial deployment)
 */
export default function PullQuote({
  children,
  text,
  src,
  cite,
  align = "center",
  tone = "light",
  variant = "rule",
}) {
  const body = children ?? text;
  const source = src ?? cite;
  const dark = tone === "dark";
  const ruleColor = dark ? T.goldLight : T.gold;
  const edge = align === "center" ? "0 auto" : "0";

  if (variant === "margin") {
    return (
      <figure
        style={{
          margin: "0 0 28px",
          maxWidth: 560,
          padding: "6px 0 6px 24px",
          borderLeft: `1px solid ${ruleColor}`,
          textAlign: "left",
        }}
      >
        <blockquote
          className="hang-quote"
          style={{
            margin: 0,
            padding: 0,
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontSize: "clamp(19px, 2.8vw, 25px)",
            lineHeight: 1.45,
            color: dark ? "rgba(255,255,255,0.92)" : T.charcoal,
          }}
        >
          {body}
        </blockquote>
        {source && (
          <figcaption
            style={{
              marginTop: 10,
              fontFamily: "var(--font-body)",
              fontVariantCaps: "all-small-caps",
              letterSpacing: "0.08em",
              fontSize: 14,
              fontWeight: 600,
              color: dark ? T.goldLight : T.goldText,
            }}
          >
            {source}
          </figcaption>
        )}
      </figure>
    );
  }

  return (
    <figure style={{ margin: "0 auto 28px", maxWidth: 640, padding: 0, textAlign: align }}>
      <span
        aria-hidden="true"
        style={{
          display: "block",
          width: 36,
          height: 2,
          background: ruleColor,
          borderRadius: 1,
          margin: align === "center" ? "0 auto 16px" : "0 0 16px",
        }}
      />
      <blockquote
        style={{
          margin: 0,
          padding: 0,
          fontFamily: "var(--font-display)",
          fontStyle: "italic",
          fontSize: "clamp(18px, 2.6vw, 23px)",
          lineHeight: 1.5,
          color: dark ? "rgba(255,255,255,0.92)" : T.charcoal,
        }}
      >
        {body}
      </blockquote>
      {source && (
        <figcaption
          style={{
            marginTop: 12,
            marginInline: edge,
            fontFamily: "var(--font-body)",
            fontSize: 12,
            letterSpacing: 0.5,
            fontVariantCaps: "all-small-caps",
            color: dark ? T.goldLight : T.goldText,
          }}
        >
          {source}
        </figcaption>
      )}
    </figure>
  );
}
