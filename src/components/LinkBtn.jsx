import { T } from "../constants/theme";

/**
 * LinkBtn — a link that looks like a button, for other websites and
 * documents (forms, PDFs). Btn is for actions inside the site.
 *
 * Props:
 *   href     — where it goes
 *   variant  — "primary" (burgundy) | "gold" | "dark" (black, bold white text)
 *   size     — "md" (same as Btn) | "lg" (larger, for the page's main document)
 *   newTab   — open in a new tab (default true)
 */
const base = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 10,
  padding: "14px 32px",
  minHeight: 44,
  fontSize: 14,
  fontWeight: 600,
  letterSpacing: 0.5,
  textTransform: "uppercase",
  textDecoration: "none",
  borderRadius: 2,
  fontFamily: "var(--font-body)",
};

const variants = {
  primary: { background: T.burgundy, color: T.cream },
  gold: { background: T.gold, color: T.softBlack },
  dark: { background: T.softBlack, color: "#fff", fontWeight: 800 },
};

const sizes = {
  md: {},
  lg: { padding: "20px clamp(20px, 5vw, 44px)", minHeight: 64, fontSize: 17, letterSpacing: 0.8 },
};

export default function LinkBtn({ href, children, variant = "primary", size = "md", newTab = true, style }) {
  return (
    <a
      href={href}
      className={`btn-hover btn--${variant} link-btn`}
      {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      style={{ ...base, ...variants[variant], ...sizes[size], ...style }}
    >
      {children}
    </a>
  );
}
