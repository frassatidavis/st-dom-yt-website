import { useNavigate } from "react-router-dom";
import { T } from "../constants/theme";
import Icon from "./Icon";

export function PastoralActionPanel({
  eyebrow,
  title,
  description,
  primaryLabel,
  primaryHref,
  primaryTo,
  secondaryLabel,
  secondaryHref,
  secondaryTo,
  urgent = false,
}) {
  const navigate = useNavigate();
  const primaryStyle = urgent
    ? { background: T.gold, color: T.softBlack }
    : { background: T.burgundy, color: "#fff" };

  const renderAction = ({ label, href, to, style, variant }) => {
    if (!label) return null;
    const sharedStyle = {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      minHeight: 44,
      padding: "12px 22px",
      borderRadius: "var(--radius-control)",
      border: variant === "secondary" ? `1px solid ${urgent ? "rgba(255,255,255,0.42)" : T.burgundy}` : "none",
      textDecoration: "none",
      fontSize: 13,
      fontWeight: 700,
      letterSpacing: 0.5,
      textTransform: "uppercase",
      fontFamily: "var(--font-body)",
      cursor: "pointer",
      ...style,
    };

    if (href) {
      return (
        <a href={href} style={sharedStyle}>
          {label}
        </a>
      );
    }

    return (
      <button type="button" onClick={() => navigate(to)} style={sharedStyle}>
        {label}
      </button>
    );
  };

  return (
    <div
      style={{
        background: urgent
          ? `linear-gradient(135deg, ${T.burgundyDark} 0%, ${T.burgundy} 100%)`
          : T.warmWhite,
        color: urgent ? "#fff" : T.charcoal,
        border: urgent ? "none" : `1px solid ${T.stone}`,
        borderRadius: "var(--radius-modal)",
        padding: "clamp(28px, 5vw, 44px)",
        boxShadow: urgent ? "0 8px 24px rgba(74,16,25,0.22)" : "0 2px 8px rgba(0,0,0,0.05)",
      }}
    >
      <div style={{ display: "flex", gap: 16, alignItems: "flex-start", flexWrap: "wrap" }}>
        <Icon
          name={urgent ? "PhoneCall" : "Compass"}
          size={26}
          color={urgent ? T.goldLight : T.burgundy}
          aria-hidden="true"
          style={{ flex: "0 0 auto", marginTop: 4 }}
        />
        <div style={{ flex: "1 1 280px" }}>
          {eyebrow && (
            <div
              style={{
                fontSize: 12,
                letterSpacing: 0.5,
                fontVariantCaps: "all-small-caps",
                color: urgent ? T.goldLight : T.goldText,
                fontWeight: 700,
                marginBottom: 8,
              }}
            >
              {eyebrow}
            </div>
          )}
          <h2
            style={{
              fontSize: "clamp(25px, 4vw, 36px)",
              color: urgent ? "#fff" : T.softBlack,
              marginBottom: 10,
            }}
          >
            {title}
          </h2>
          <p
            style={{
              fontSize: 16,
              lineHeight: 1.75,
              color: urgent ? "rgba(255,255,255,0.86)" : T.warmGray,
              maxWidth: 760,
            }}
          >
            {description}
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 22 }}>
            {renderAction({
              label: primaryLabel,
              href: primaryHref,
              to: primaryTo,
              style: primaryStyle,
            })}
            {renderAction({
              label: secondaryLabel,
              href: secondaryHref,
              to: secondaryTo,
              variant: "secondary",
              style: urgent
                ? { background: "transparent", color: "#fff" }
                : { background: "transparent", color: T.burgundy },
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export function NextSteps({ eyebrow, title, items }) {
  const navigate = useNavigate();

  return (
    <section
      style={{
        background: T.cream,
        borderTop: `1px solid ${T.stone}`,
        padding: "clamp(42px, 8vw, 66px) 24px",
      }}
    >
      <div style={{ maxWidth: 1060, margin: "0 auto" }}>
        <div style={{ marginBottom: 24 }}>
          {eyebrow && (
            <div
              style={{
                color: T.goldText,
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 0.5,
                fontVariantCaps: "all-small-caps",
                marginBottom: 8,
              }}
            >
              {eyebrow}
            </div>
          )}
          <h2 style={{ fontSize: "clamp(26px, 4vw, 38px)", color: T.softBlack }}>{title}</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 14 }}>
          {items.map((item) => {
            const content = (
              <>
                <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Icon name={item.icon || "ArrowRight"} size={20} color={T.burgundy} />
                  <span style={{ fontWeight: 700, color: T.softBlack }}>{item.title}</span>
                </span>
                <span style={{ display: "block", color: T.warmGray, fontSize: 14, lineHeight: 1.55, marginTop: 8 }}>
                  {item.description}
                </span>
              </>
            );

            const style = {
              display: "block",
              width: "100%",
              height: "100%",
              textAlign: "left",
              background: T.warmWhite,
              border: `1px solid ${T.stone}`,
              borderRadius: "var(--radius-card)",
              padding: 20,
              textDecoration: "none",
              cursor: "pointer",
              fontFamily: "var(--font-body)",
            };

            if (item.href) {
              return (
                <a key={item.title} href={item.href} style={style}>
                  {content}
                </a>
              );
            }

            return (
              <button key={item.title} type="button" onClick={() => navigate(item.to)} style={style}>
                {content}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
