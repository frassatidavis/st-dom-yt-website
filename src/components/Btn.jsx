import { T } from "../constants/theme";

const base = {
  display: "inline-block",
  padding: "14px 32px",
  fontSize: 14,
  fontWeight: 600,
  letterSpacing: 0.5,
  textTransform: "uppercase",
  border: "none",
  cursor: "pointer",
  borderRadius: 2,
  fontFamily: "var(--font-body)",
  minHeight: 44,
};

// Variant keys override base, so spread base FIRST (a later `...base` silently
// reset variant borders to "none" — the old translucent fills masked it).
const variants = {
  primary: { ...base, background: T.burgundy, color: T.cream },
  outline: {
    ...base,
    background: "transparent",
    color: T.burgundy,
    border: `1.5px solid ${T.burgundy}`,
  },
  gold: { ...base, background: T.gold, color: T.softBlack },
  // Hairline ghost for use over photography/dark grounds — no translucent
  // fill, no blur; the hover tint comes from the shared .btn-hover rule.
  light: {
    ...base,
    background: "transparent",
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.85)",
  },
};

export default function Btn({ children, onClick, variant = "primary", style: s = {} }) {
  return (
    <div style={{ display: "inline-block" }}>
      <button
        onClick={onClick}
        className={`btn-hover btn--${variant}`}
        style={{ ...variants[variant], ...s }}
      >
        {children}
      </button>
    </div>
  );
}
