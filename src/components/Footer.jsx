import { useHref, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { T } from "../constants/theme";
import { CONFIG } from "../constants/config";
import { PHOTOS } from "../constants/photos";

function FooterLink({ to, children, style }) {
  const navigate = useNavigate();
  const href = useHref(to);
  const handleClick = (e) => {
    if (
      e.defaultPrevented ||
      e.button !== 0 ||
      e.metaKey ||
      e.altKey ||
      e.ctrlKey ||
      e.shiftKey
    ) {
      return;
    }
    e.preventDefault();
    if (document.startViewTransition) {
      document.startViewTransition(() => navigate(to));
    } else {
      navigate(to);
    }
  };
  return (
    <a href={href} onClick={handleClick} style={style}>
      {children}
    </a>
  );
}

const FOOTER_GROUPS = [
  {
    titleKey: "visit",
    links: [
      { to: "/visit", key: "visit" },
      { to: "/mass-times", key: "massTimes" },
      { to: "/bulletin", key: "bulletin" },
      { to: "/contact", key: "contact" },
      { to: "/give", key: "waysToGive" },
    ],
  },
  {
    titleKey: "sacramentalLife",
    links: [
      { to: "/sacraments", key: "sacraments" },
      { to: "/becoming-catholic", key: "becomingCatholic" },
      { to: "/sacraments/anointing", key: "anointing" },
      { to: "/sacraments/funerals", key: "funerals" },
    ],
  },
  {
    titleKey: "parishLife",
    links: [
      { to: "/get-involved", key: "getInvolved" },
      { to: "/register", key: "register" },
      { to: "/faith-formation", key: "faithFormation" },
      { to: "/events", key: "events" },
    ],
  },
  {
    titleKey: "about",
    links: [
      { to: "/about", key: "about" },
      { to: "/history", key: "history" },
      { to: "/architecture", key: "architecture" },
      { to: "/staff", key: "staff" },
    ],
  },
];

const TRUST_LINKS = [
  { href: "https://doy.org/", key: "diocese" },
  { href: "https://doy.org/safe-environment/", key: "safeEnvironment" },
  { href: "https://virtusonline.org/", key: "virtus" },
];

const groupHeadingStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: 10,
  color: T.goldLight,
  fontVariantCaps: "all-small-caps",
  letterSpacing: "0.08em",
  fontSize: 15,
  fontWeight: 600,
  marginBottom: 10,
};

const ruleBefore = (
  <span
    aria-hidden="true"
    style={{ width: 18, height: 1, background: "rgba(197,165,90,0.55)" }}
  />
);

/**
 * Footer — editorial colophon. Three bands on the soft-black ground:
 *   1. Parish identity set large, with the Dominican crest opposite
 *   2. Link groups + contact address
 *   3. Province mark left, legal line right
 */
export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer
      style={{
        background: T.softBlack,
        color: "rgba(255,255,255,0.72)",
        padding: "clamp(52px, 8vw, 76px) 24px 32px",
      }}
    >
      {/* ── Band 1: identity + crest ── */}
      <div
        style={{
          maxWidth: 1140,
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "36px 64px",
          flexWrap: "wrap",
          paddingBottom: 40,
          borderBottom: "1px solid rgba(255,255,255,0.12)",
        }}
      >
        <div style={{ flex: "1 1 380px", maxWidth: 560 }}>
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(28px, 3.4vw, 38px)",
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: "var(--tracking-display)",
              color: T.goldLight,
              marginBottom: 14,
            }}
          >
            St. Dominic Catholic Church
          </p>
          <p style={{ fontSize: 15, lineHeight: 1.8, maxWidth: "52ch" }}>
            {t("footer.description")}
          </p>

          {/* Visit / call / office hours / email */}
          <address className="footer-contact">
            {[
              {
                key: "visit",
                value: `${CONFIG.address}, ${CONFIG.city}, ${CONFIG.state} ${CONFIG.zip}`,
                href: `https://www.google.com/maps/search/?api=1&query=${CONFIG.mapsQuery}`,
              },
              { key: "call", value: CONFIG.phone, href: CONFIG.phoneLink },
              { key: "hours", value: `${t("footer.cards.hoursDays")} · ${t("footer.cards.hoursTime")}` },
              { key: "email", value: CONFIG.email, href: `mailto:${CONFIG.email}` },
            ].map((item) => {
              const body = (
                <>
                  <span className="footer-contact__label">{t(`footer.cards.${item.key}Title`)}</span>
                  <span className="footer-contact__value">{item.value}</span>
                </>
              );
              return item.href ? (
                <a
                  key={item.key}
                  href={item.href}
                  className="footer-contact__item"
                  {...(item.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  {body}
                </a>
              ) : (
                <div key={item.key} className="footer-contact__item">
                  {body}
                </div>
              );
            })}
          </address>
        </div>

        {/* Dominican crest opposite the parish identity */}
        <div className="footer-mass" style={{ flex: "0 1 280px" }}>
          <img
            src={PHOTOS.stDomCrestLight}
            alt=""
            aria-hidden="true"
            width={130}
            height={180}
            loading="lazy"
            decoding="async"
            style={{
              display: "block",
              height: "clamp(150px, 15vw, 180px)",
              width: "auto",
              margin: "0 auto",
            }}
          />
        </div>
      </div>

      {/* ── Band 2: link groups + contact ── */}
      <div
        style={{
          maxWidth: 1140,
          margin: "0 auto",
          padding: "38px 0 8px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: "28px 32px",
        }}
      >
        {FOOTER_GROUPS.map((group) => (
          <div key={group.titleKey}>
            <h2 style={groupHeadingStyle}>
              {ruleBefore}
              {t(`footer.groups.${group.titleKey}`)}
            </h2>
            {group.links.map((l) => (
              <div key={l.to}>
                <FooterLink
                  to={l.to}
                  style={{
                    display: "inline-block",
                    color: "rgba(255,255,255,0.72)",
                    textDecoration: "none",
                    fontSize: 14,
                    padding: "4px 0",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  {t(`nav.${l.key}`)}
                </FooterLink>
              </div>
            ))}
          </div>
        ))}

        <div style={{ minWidth: 0 }}>
          <h2 style={groupHeadingStyle}>
            {ruleBefore}
            {t("footer.trustTitle")}
          </h2>
          {TRUST_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "block",
                color: "rgba(255,255,255,0.72)",
                fontSize: 14,
                padding: "4px 0",
                textDecoration: "none",
              }}
            >
              {t(`footer.trust.${link.key}`)}
            </a>
          ))}
        </div>
      </div>

      {/* ── Band 3: province mark + legal ── */}
      <div
        style={{
          maxWidth: 1140,
          margin: "28px auto 0",
          paddingTop: 26,
          borderTop: "1px solid rgba(255,255,255,0.12)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "20px 32px",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px 36px", flexWrap: "wrap" }}>
          <a
            href={CONFIG.provinceUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              textDecoration: "none",
              color: "rgba(255,255,255,0.7)",
              transition: "opacity 0.3s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.85")}
          >
            <img
              src={PHOTOS.psjShield}
              alt="Dominican Province of St. Joseph Shield"
              style={{ width: 44, height: 44, objectFit: "contain" }}
            />
            <img
              src={PHOTOS.psjWordmarkWhite}
              alt="Dominican Friars — Province of Saint Joseph"
              style={{ height: 28, objectFit: "contain", opacity: 0.85 }}
            />
          </a>
          <a
            href={CONFIG.dioceseUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "flex", alignItems: "center", opacity: 0.85, transition: "opacity 0.3s" }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.85")}
          >
            <img
              src={PHOTOS.doyLogoWhite}
              alt="Catholic Diocese of Youngstown"
              width={115}
              height={64}
              style={{ height: 64, width: "auto", objectFit: "contain" }}
            />
          </a>
        </div>

        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", textAlign: "right" }}>
          © <span style={{ fontVariantNumeric: "oldstyle-nums" }}>{new Date().getFullYear()}</span>{" "}
          St. Dominic Catholic Church · Youngstown, OH · {t("footer.rights")}
          <span style={{ margin: "0 6px" }}>·</span>
          <FooterLink
            to="/writers-guide"
            style={{
              color: "rgba(255,255,255,0.85)",
              textDecoration: "underline",
              fontSize: 12,
              transition: "color 0.2s",
            }}
          >
            Staff
          </FooterLink>
        </div>
      </div>
    </footer>
  );
}
