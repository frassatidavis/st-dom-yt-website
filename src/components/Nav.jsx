import { useState, useEffect, useRef, useCallback } from "react";
import { useHref, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { T } from "../constants/theme";
import { Menu, X, ChevronDown, MapPin, Church, Gift } from "lucide-react";
import LanguageToggle from "./LanguageToggle";
import SiteSearch from "./SiteSearch";
import NavToday from "./NavToday";
import { PHOTOS } from "../constants/photos";
import { CONFIG } from "../constants/config";

/** Navigate with View Transition when supported */
function NavLink({ to, children, style, ...props }) {
  const navigate = useNavigate();
  const href = useHref(to);
  const handleClick = (e) => {
    if (
      e.defaultPrevented ||
      e.button !== 0 ||
      e.metaKey ||
      e.altKey ||
      e.ctrlKey ||
      e.shiftKey ||
      props.target
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
    <a href={href} onClick={handleClick} style={style} {...props}>
      {children}
    </a>
  );
}

const NAV_ITEMS = [
  { key: "visit", to: "/visit" },
  { key: "massTimes", to: "/mass-times" },
  {
    key: "sacraments",
    children: [
      { key: "sacraments", to: "/sacraments" },
      { key: "becomingCatholic", to: "/becoming-catholic" },
      { key: "baptism", to: "/sacraments/baptism" },
      { key: "firstCommunion", to: "/sacraments/first-communion" },
      { key: "confirmation", to: "/sacraments/confirmation" },
      { key: "marriage", to: "/sacraments/marriage" },
      { key: "anointing", to: "/sacraments/anointing" },
      { key: "funerals", to: "/sacraments/funerals" },
    ],
  },
  {
    key: "getInvolved",
    children: [
      { key: "getInvolved", to: "/get-involved" },
      { key: "register", to: "/register" },
      { key: "faithFormation", to: "/faith-formation" },
      { key: "events", to: "/events" },
      { key: "connect", to: "/connect" },
    ],
  },
  {
    key: "more",
    // Pure dropdown trigger — "More" is not a destination, so it renders as a
    // <button> (also fixes the Lighthouse link-text audit).
    linkless: true,
    children: [
      { key: "about", to: "/about" },
      { key: "bulletin", to: "/bulletin" },
      { key: "contact", to: "/contact" },
      { key: "history", to: "/history" },
      { key: "architecture", to: "/architecture" },
      { key: "gallery", to: "/gallery" },
      { key: "staff", to: "/staff" },
    ],
  },
];

export default function Nav() {
  const { t } = useTranslation();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileAccordion, setMobileAccordion] = useState(null);
  const menuRef = useRef(null);
  const brandRef = useRef(null);
  const hoverTimeout = useRef(null);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 40);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    document.body.classList.toggle("nav-open", mobileOpen);
    return () => {
      document.body.style.overflow = "";
      document.body.classList.remove("nav-open");
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMobileOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [mobileOpen]);

  // Close everything on route change
  useEffect(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
    setMobileAccordion(null);
  }, [location]);

  // Close dropdown/mobile menu on Escape + trap focus in mobile menu
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") {
        if (mobileOpen) setMobileOpen(false);
        else setOpenDropdown(null);
      }
      // Focus trap for mobile menu
      if (e.key === "Tab" && mobileOpen && menuRef.current) {
        const focusable = menuRef.current.querySelectorAll(
          'a, button, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [mobileOpen]);

  const isActive = useCallback(
    (to) => (to === "/" ? location.pathname === "/" : location.pathname.startsWith(to)),
    [location.pathname]
  );

  const isGroupActive = useCallback(
    (item) => {
      if (item.to) return isActive(item.to);
      return item.children?.some((c) => isActive(c.to));
    },
    [isActive]
  );

  const handleMouseEnter = (key) => {
    clearTimeout(hoverTimeout.current);
    hoverTimeout.current = setTimeout(() => setOpenDropdown(key), 80);
  };

  const handleMouseLeave = () => {
    clearTimeout(hoverTimeout.current);
    hoverTimeout.current = setTimeout(() => setOpenDropdown(null), 150);
  };

  const linkStyle = (active) => ({
    textDecoration: "none",
    padding: "8px 11px",
    fontSize: 13.5,
    fontWeight: active ? 600 : 400,
    color: active ? T.burgundy : T.charcoal,
    // Reset the default button border with longhand sides only — mixing the
    // `border` shorthand with `borderBottom` triggers a React rerender warning.
    borderTop: "none",
    borderRight: "none",
    borderLeft: "none",
    borderBottom: active ? `2px solid ${T.gold}` : "2px solid transparent",
    transition: "all 0.3s",
    fontFamily: "var(--font-body)",
    letterSpacing: 0.3,
    display: "flex",
    alignItems: "center",
    gap: 3,
    cursor: "pointer",
    background: "none",
  });

  return (
    <nav
      ref={menuRef}
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        background: scrolled ? "rgba(255,253,249,0.97)" : "rgba(255,253,249,0.85)",
        backdropFilter: "blur(12px)",
        borderBottom: scrolled ? `1px solid ${T.stone}` : "1px solid transparent",
        transition: "all 0.4s ease",
      }}
    >
      <div
        style={{
          // 1440px fits the name, today's times and the full link row on one line
          maxWidth: 1440, margin: "0 auto", padding: "0 24px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          height: scrolled ? 64 : 76, transition: "height 0.4s ease",
        }}
      >
        {/* Logo */}
        <NavLink to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
          <img
            src={PHOTOS.stDomLogoSmall}
            alt=""
            width={40}
            height={40}
            style={{
              width: 40, height: 40, borderRadius: "50%", background: "#fff",
              border: `1px solid ${T.stone}`, objectFit: "contain", padding: 2, display: "block",
            }}
          />
          <div style={{ minWidth: 0 }}>
            <div ref={brandRef} className="nav-brand" style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: T.burgundy, letterSpacing: "0.04em", textTransform: "uppercase" }}>
              {t("nav.brand")}
            </div>
            <div className="nav-subtitle" style={{ letterSpacing: 0.5, fontVariantCaps: "all-small-caps", color: T.warmGray, fontWeight: 500 }}>
              {t("nav.subtitle")}
            </div>
          </div>
        </NavLink>

        {/* Today's Masses and confessions, when the row has room for them */}
        <NavToday brandRef={brandRef} />

        {/* Desktop links */}
        <div style={{ display: "flex", gap: 2, alignItems: "center" }} className="nav-desktop">
          {NAV_ITEMS.map((item) =>
            item.children ? (
              <div
                key={item.key}
                style={{ position: "relative" }}
                onMouseEnter={() => handleMouseEnter(item.key)}
                onMouseLeave={handleMouseLeave}
                onFocus={() => {
                  clearTimeout(hoverTimeout.current);
                  setOpenDropdown(item.key);
                }}
                onBlur={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget)) {
                    setOpenDropdown(null);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    setOpenDropdown(null);
                    e.currentTarget.querySelector("a, button")?.focus();
                  }
                }}
              >
                {item.linkless ? (
                  <button
                    type="button"
                    className="premium-nav-link"
                    style={linkStyle(isGroupActive(item))}
                    aria-haspopup="menu"
                    aria-expanded={openDropdown === item.key}
                    onClick={() =>
                      setOpenDropdown(openDropdown === item.key ? null : item.key)
                    }
                  >
                    {t(`nav.${item.key}`)}
                    <ChevronDown
                      size={13}
                      style={{
                        transition: "transform 0.2s",
                        transform: openDropdown === item.key ? "rotate(180deg)" : "rotate(0)",
                        opacity: 0.5,
                      }}
                    />
                  </button>
                ) : (
                  <NavLink
                    to={item.children[0].to}
                    className="premium-nav-link"
                    style={linkStyle(isGroupActive(item))}
                    aria-haspopup="menu"
                    aria-expanded={openDropdown === item.key}
                  >
                    {t(`nav.${item.key}`)}
                    <ChevronDown
                      size={13}
                      style={{
                        transition: "transform 0.2s",
                        transform: openDropdown === item.key ? "rotate(180deg)" : "rotate(0)",
                        opacity: 0.5,
                      }}
                    />
                  </NavLink>
                )}

                {/* Dropdown panel */}
                {openDropdown === item.key && (
                  <div
                    role="menu"
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: "50%",
                      transform: "translateX(-50%)",
                      minWidth: 200,
                      background: "rgba(255,253,249,0.98)",
                      backdropFilter: "blur(12px)",
                      borderTop: `2px solid ${T.gold}`,
                      boxShadow: "0 6px 20px rgba(0,0,0,0.10)",
                      borderRadius: "0 0 var(--radius-modal) var(--radius-modal)",
                      padding: "8px 0",
                      animation: "dropdownFadeIn 0.2s ease",
                    }}
                  >
                    {item.children.map((child) => (
                      <NavLink
                        key={child.to}
                        to={child.to}
                        role="menuitem"
                        className="premium-dropdown-link"
                        style={{
                          display: "block",
                          padding: "10px 20px",
                          fontSize: 13.5,
                          fontWeight: isActive(child.to) ? 600 : 400,
                          color: isActive(child.to) ? T.burgundy : T.charcoal,
                          textDecoration: "none",
                          fontFamily: "var(--font-body)",
                          transition: "background 0.2s",
                          whiteSpace: "nowrap",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = T.cream)}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                      >
                        {t(`nav.${child.key}`)}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <NavLink
                key={item.key}
                to={item.to}
                className="premium-nav-link"
                style={linkStyle(isActive(item.to))}
              >
                {t(`nav.${item.key}`)}
              </NavLink>
            )
          )}
          {/* Give goes straight to the parish's Flocknote giving form (it can't be embedded) */}
          <a
            href={CONFIG.flocknoteGivingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="premium-give-link"
            style={{
              textDecoration: "none", padding: "8px 16px", fontSize: 13, fontWeight: 600,
              background: T.gold, color: T.softBlack, borderRadius: 2, letterSpacing: 0.5,
              fontFamily: "var(--font-body)", marginLeft: 4,
            }}
          >
            {t("nav.give")}
          </a>
          <SiteSearch />
          <div style={{ marginLeft: 6 }}>
            <LanguageToggle />
          </div>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          className="nav-mobile-toggle"
          style={{
            background: "none", border: "none", cursor: "pointer",
            padding: 8, fontSize: 24, color: T.burgundy, lineHeight: 1, flexShrink: 0,
          }}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          style={{
            background: T.warmWhite, borderTop: `1px solid ${T.stone}`,
            padding: "8px 24px 20px", animation: "slideDown 0.3s ease",
            minHeight: "calc(100vh - 76px)",
            maxHeight: "calc(100vh - 76px)",
            overflowY: "auto",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: 8,
              padding: "8px 0 10px",
            }}
          >
            {[
              { to: "/visit", label: t("nav.visit"), icon: MapPin },
              { to: "/mass-times", label: t("nav.massTimes"), icon: Church },
              { href: CONFIG.flocknoteGivingUrl, label: t("nav.give"), icon: Gift },
            ].map(({ to, href, label, icon: IconComp }) => {
              const Tile = href ? "a" : NavLink;
              const linkProps = href
                ? { href, target: "_blank", rel: "noopener noreferrer", onClick: () => setMobileOpen(false) }
                : { to };
              return (
              <Tile
                key={to || href}
                {...linkProps}
                style={{
                  minHeight: 76,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  padding: "10px 8px",
                  borderRadius: "var(--radius-card)",
                  border: `1px solid ${isActive(to) ? T.gold : T.stone}`,
                  background: isActive(to) ? "rgba(197,165,90,0.14)" : "#fff",
                  color: isActive(to) ? T.burgundy : T.charcoal,
                  textDecoration: "none",
                  textAlign: "center",
                  fontSize: 12,
                  fontWeight: 700,
                  lineHeight: 1.15,
                  fontFamily: "var(--font-body)",
                }}
              >
                <IconComp size={18} color={isActive(to) ? T.burgundy : T.goldText} />
                {label}
              </Tile>
              );
            })}
          </div>

          {NAV_ITEMS.map((item) =>
            item.children ? (
              <div key={item.key}>
                {/* Accordion header */}
                <button
                  onClick={() =>
                    setMobileAccordion(mobileAccordion === item.key ? null : item.key)
                  }
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    padding: "14px 0",
                    fontSize: 16,
                    fontWeight: isGroupActive(item) ? 600 : 400,
                    color: isGroupActive(item) ? T.burgundy : T.charcoal,
                    fontFamily: "var(--font-body)",
                    background: "none",
                    // Longhand-only border: a bottom divider, no other sides.
                    borderTop: "none",
                    borderRight: "none",
                    borderLeft: "none",
                    borderBottomWidth: 1,
                    borderBottomStyle: "solid",
                    borderBottomColor: T.stoneLight,
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  {t(`nav.${item.key}`)}
                  <ChevronDown
                    size={16}
                    style={{
                      transition: "transform 0.2s",
                      transform:
                        mobileAccordion === item.key ? "rotate(180deg)" : "rotate(0)",
                      opacity: 0.5,
                    }}
                  />
                </button>

                {/* Accordion children */}
                {mobileAccordion === item.key && (
                  <div style={{ paddingLeft: 16, background: T.cream, marginBottom: 2 }}>
                    {item.children.map((child) => (
                      <NavLink
                        key={child.to}
                        to={child.to}
                        style={{
                          display: "block",
                          textDecoration: "none",
                          padding: "12px 0",
                          fontSize: 15,
                          fontWeight: isActive(child.to) ? 600 : 400,
                          color: isActive(child.to) ? T.burgundy : T.charcoal,
                          borderBottom: `1px solid ${T.stoneLight}`,
                          fontFamily: "var(--font-body)",
                        }}
                      >
                        {t(`nav.${child.key}`)}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <NavLink
                key={item.key}
                to={item.to}
                style={{
                  display: "block",
                  textDecoration: "none",
                  padding: "14px 0",
                  fontSize: 16,
                  fontWeight: isActive(item.to) ? 600 : 400,
                  color: isActive(item.to) ? T.burgundy : T.charcoal,
                  borderBottom: `1px solid ${T.stoneLight}`,
                  fontFamily: "var(--font-body)",
                }}
              >
                {t(`nav.${item.key}`)}
              </NavLink>
            )
          )}
          <a
            href={CONFIG.flocknoteGivingUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMobileOpen(false)}
            style={{
              display: "block",
              textDecoration: "none",
              padding: "14px 0",
              fontSize: 16,
              fontWeight: 400,
              color: T.goldText,
              borderBottom: `1px solid ${T.stoneLight}`,
              fontFamily: "var(--font-body)",
            }}
          >
            {t("nav.give")}
          </a>
          <div style={{ paddingTop: 16, display: "flex", alignItems: "center", gap: 12 }}>
            <SiteSearch />
            <LanguageToggle />
          </div>
        </div>
      )}

      <style>{`
        @keyframes dropdownFadeIn {
          from { opacity: 0; transform: translateX(-50%) translateY(-4px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </nav>
  );
}
