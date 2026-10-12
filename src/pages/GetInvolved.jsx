import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { T } from "../constants/theme";
import { CONFIG } from "../constants/config";
import { Section, SectionTitle } from "../components/Section";
import Btn from "../components/Btn";
import PremiumPageActions from "../components/PremiumPageActions";

import { useMinistries } from "../cms/hooks";
import Seo from "../components/Seo";
import Icon from "../components/Icon";
import PageHeader from "../components/PageHeader";
import { PHOTOS } from "../constants/photos";
import { X, Mail, Phone } from "lucide-react";

/* ── Accent per ministry — muted, warm-leaning, brand-harmonized.
      (Replaced the flat-UI palette: #C0392B/#2E7D32/#1565C0/#6A1B9A…) ── */
const ACCENTS = {
  liturgical: T.burgundy,
  hispanic: "#9A4438", // terracotta
  layDominicans: T.softBlack,
  familyLife: "#4A7C59", // moss — matches the events "education" green
  mensFellowship: "#5B7FA6", // slate blue — matches events "community"
  svdp: "#7B5EA7", // muted violet — matches events "prayer"
  music: T.goldText, // AA-safe dark gold (#7A5A0F) — bright T.gold fails contrast as a bare icon / white-on-accent
  religiousEd: "#B26A3A", // sienna
  daughters: "#A04E68", // dusty rose
  conversatio: "#3E7E83", // muted teal
  knights: "#5B7FA6", // slate blue
  estudioBiblia: "#4E342E", // walnut
};

export default function GetInvolved() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: ministries } = useMinistries();
  const [selected, setSelected] = useState(null);

  const close = useCallback(() => setSelected(null), []);

  useEffect(() => {
    if (!selected) return;
    const onKey = (e) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [selected, close]);

  return (
    <div style={{ paddingTop: "var(--nav-h)" }}>
      <Seo
        title="Get Involved"
        description="Explore ministries and volunteer opportunities at St. Dominic Church — Hispanic Ministry, music, religious education, and more."
        image={PHOTOS.getInvolvedHero}
      />

      <PageHeader
        title={t("getInvolved.heading")}
        heroSrc={PHOTOS.getInvolvedHero}
        kicker={t("getInvolved.sub")}
      />

      <PremiumPageActions
        overlap
        eyebrow={t("getInvolved.sub")}
        title={t("getInvolved.heading")}
        items={[
          {
            title: t("getInvolved.register.title"),
            description: t("getInvolved.register.desc"),
            to: "/register",
            icon: "ClipboardList",
            primary: true,
          },
          {
            title: t("contact.title"),
            description: CONFIG.phone,
            to: "/contact",
            icon: "Phone",
          },
          {
            title: t("nav.faithFormation"),
            description: t("faithFormation.intro.desc"),
            to: "/faith-formation",
            icon: "BookOpenText",
          },
        ]}
      />

      {/* ════ Ministries ════ */}
      <Section bg={T.cream}>
        <SectionTitle sub={t("getInvolved.sub")}>{t("getInvolved.title")}</SectionTitle>
        <p
          className="u-lede"
          style={{ fontSize: 17, lineHeight: 1.8, color: T.warmGray, margin: "0 0 36px" }}
        >
          {t("getInvolved.desc")}
        </p>

        <style>{`
            .ministry-grid {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 20px;
            }
            .ministry-card {
              position: relative;
              overflow: hidden;
              border-radius: 6px;
              padding: 28px 28px 28px 32px;
              background: ${T.warmWhite};
              border: 1px solid ${T.stone};
              cursor: pointer;
              transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1),
                          box-shadow 0.35s cubic-bezier(0.22, 1, 0.36, 1),
                          border-color 0.35s ease;
            }
            .ministry-card:hover {
              transform: translateY(-2px);
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.07);
              border-color: var(--accent, ${T.burgundy});
            }
            .ministry-card:focus-visible {
              outline: 2px solid ${T.burgundy};
              outline-offset: 2px;
            }
            .ministry-hint {
              font-size: 12px;
              letter-spacing: 1px;
              text-transform: uppercase;
              color: ${T.warmGray};
              margin-top: 12px;
              opacity: 0;
              transition: opacity 0.3s ease;
            }
            .ministry-card:hover .ministry-hint {
              opacity: 1;
            }
            .ministry-modal-backdrop {
              position: fixed;
              inset: 0;
              background: rgba(0, 0, 0, 0.6);
              backdrop-filter: blur(6px);
              -webkit-backdrop-filter: blur(6px);
              z-index: 1000;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 24px;
              animation: mFadeIn 0.2s ease;
            }
            .ministry-modal {
              background: #fff;
              border-radius: var(--radius-modal);
              max-width: 520px;
              width: 100%;
              max-height: 90vh;
              overflow-y: auto;
              position: relative;
              animation: mSlideUp 0.3s cubic-bezier(0.22, 1, 0.36, 1);
              box-shadow: 0 24px 64px rgba(0, 0, 0, 0.3);
            }
            .ministry-modal-close {
              position: absolute;
              top: 16px;
              right: 16px;
              width: 36px;
              height: 36px;
              border-radius: 50%;
              border: none;
              background: rgba(255, 255, 255, 0.2);
              cursor: pointer;
              display: flex;
              align-items: center;
              justify-content: center;
              transition: background 0.2s ease;
              z-index: 1;
            }
            .ministry-modal-close:hover {
              background: rgba(255, 255, 255, 0.35);
            }
            @keyframes mFadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes mSlideUp {
              from { opacity: 0; transform: translateY(24px) scale(0.96); }
              to { opacity: 1; transform: translateY(0) scale(1); }
            }
            @media (max-width: 768px) {
              .ministry-grid {
                grid-template-columns: 1fr;
              }
            }
            @media (min-width: 769px) and (max-width: 1024px) {
              .ministry-grid {
                grid-template-columns: repeat(2, 1fr);
              }
            }
          `}</style>

        <div className="ministry-grid">
          {ministries.map((m) => {
            const accent = ACCENTS[m.key] || T.burgundy;

            return (
              <div
                key={m.id}
                className="ministry-card"
                role="button"
                tabIndex={0}
                aria-label={m.title || t(`getInvolved.ministries.${m.key}.title`)}
                onClick={() => setSelected({ ...m, accent })}
                onKeyDown={(e) => e.key === "Enter" && setSelected({ ...m, accent })}
                style={{ "--accent": accent }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 16,
                  }}
                >
                  <Icon name={m.icon} size={24} color={accent} style={{ flexShrink: 0, marginTop: 2 }} />
                  <div style={{ flex: 1 }}>
                    <h3
                      style={{
                        fontSize: 18,
                        fontFamily: "var(--font-display)",
                        fontWeight: 600,
                        marginBottom: 8,
                        lineHeight: 1.3,
                        color: T.softBlack,
                      }}
                    >
                      {m.title || t(`getInvolved.ministries.${m.key}.title`)}
                    </h3>
                    <p
                      style={{
                        fontSize: 14,
                        color: T.warmGray,
                        lineHeight: 1.7,
                      }}
                    >
                      {m.description || t(`getInvolved.ministries.${m.key}.desc`)}
                    </p>
                    <div className="ministry-hint">{t("getInvolved.clickHint")}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      {/* ════ Register CTA ════ */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          background: `linear-gradient(135deg, ${T.burgundyDark}, ${T.burgundy})`,
          padding: "clamp(48px, 10vw, 80px) 24px",
          textAlign: "center",
        }}
      >
        <div style={{ position: "relative", zIndex: 1, maxWidth: 600, margin: "0 auto" }}>
          <h2
            style={{
              fontSize: "clamp(26px, 5vw, 38px)",
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              color: "#fff",
              marginBottom: 16,
              lineHeight: 1.3,
            }}
          >
            {t("getInvolved.register.title")}
          </h2>
          <p
            style={{
              fontSize: 16,
              color: "rgba(255,255,255,0.8)",
              marginBottom: 24,
              maxWidth: 500,
              margin: "0 auto 24px",
              lineHeight: 1.8,
            }}
          >
            {t("getInvolved.register.desc")}
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 16,
              justifyContent: "center",
            }}
          >
            <Btn onClick={() => navigate("/register")} variant="gold">
              {t("getInvolved.register.cta")}
            </Btn>
          </div>
          <div style={{ marginTop: 24 }}>
            <div style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>
              <a href={CONFIG.phoneLink} className="contact-link" style={{ color: T.goldLight }}>
                {CONFIG.phone}
              </a>
            </div>
            <div style={{ fontSize: 14 }}>
              <a
                href={`mailto:${CONFIG.email}`}
                className="contact-link"
                style={{ color: "rgba(255,255,255,0.75)" }}
              >
                {CONFIG.email}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ════ Ministry Modal ════ */}
      {selected && (
        <div
          className="ministry-modal-backdrop"
          onClick={(e) => e.target === e.currentTarget && close()}
        >
          <div className="ministry-modal" role="dialog" aria-modal="true">
            <button className="ministry-modal-close" onClick={close} aria-label="Close">
              <X size={18} color="#fff" />
            </button>

            {/* Header with accent color */}
            <div
              style={{
                background: selected.accent,
                padding: "44px 32px 32px",
                textAlign: "center",
                borderRadius: "var(--radius-modal) var(--radius-modal) 0 0",
              }}
            >
              <Icon
                name={selected.icon}
                size={40}
                color="#fff"
                style={{ display: "block", margin: "0 auto 16px" }}
              />
              <h2
                style={{
                  fontSize: 26,
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  color: "#fff",
                  lineHeight: 1.2,
                }}
              >
                {selected.title || t(`getInvolved.ministries.${selected.key}.title`)}
              </h2>
            </div>

            {/* Body */}
            <div style={{ padding: 32 }}>
              <p
                style={{
                  fontSize: 15,
                  lineHeight: 1.8,
                  color: T.warmGray,
                  marginBottom: 24,
                }}
              >
                {selected.description || t(`getInvolved.ministries.${selected.key}.detail`)}
              </p>

              <p
                style={{
                  fontSize: 14,
                  fontStyle: "italic",
                  color: T.softBlack,
                  marginBottom: 20,
                  lineHeight: 1.6,
                }}
              >
                {t("getInvolved.modal.joinCta")}
              </p>

              <div
                style={{
                  borderTop: `1px solid ${T.stone}`,
                  paddingTop: 20,
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    letterSpacing: 0.5,
                    fontVariantCaps: "all-small-caps",
                    color: T.warmGray,
                    marginBottom: 12,
                    fontWeight: 600,
                  }}
                >
                  {t("getInvolved.modal.contact")}
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                  }}
                >
                  <a
                    href={CONFIG.phoneLink}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      color: T.softBlack,
                      textDecoration: "none",
                      fontSize: 15,
                    }}
                  >
                    <Phone size={16} color={selected.accent} />
                    {CONFIG.phone}
                  </a>
                  <a
                    href={`mailto:${CONFIG.email}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      color: T.softBlack,
                      textDecoration: "none",
                      fontSize: 15,
                    }}
                  >
                    <Mail size={16} color={selected.accent} />
                    {CONFIG.email}
                  </a>
                </div>
                <p
                  style={{
                    fontSize: 12,
                    color: T.warmGray,
                    fontStyle: "italic",
                    marginTop: 12,
                  }}
                >
                  {t("getInvolved.modal.reachVia")}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
