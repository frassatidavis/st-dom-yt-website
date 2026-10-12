import { useMemo, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { T } from "../constants/theme";
import { CONFIG } from "../constants/config";
import { Section, SectionTitle } from "../components/Section";
import PremiumPageActions from "../components/PremiumPageActions";

import Seo from "../components/Seo";
import Icon from "../components/Icon";
import HeroImage from "../components/HeroImage";
import DiscoverMassBulletin from "../components/DiscoverMassBulletin";
import { PHOTOS } from "../constants/photos";
import { ExternalLink, FileText } from "lucide-react";
import { useAdminSyncSignal, useBulletins } from "../cms/hooks";
import { getCurrentUrl, getArchive, hasArchive } from "../bulletins/store";

export default function Bulletin() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const syncVersion = useAdminSyncSignal();

  // Admin-set URL takes priority over the config value
  const adminUrl = useMemo(() => getCurrentUrl(), [syncVersion]);
  const bulletinUrl = adminUrl || CONFIG.bulletinUrl;
  const hasBulletin = Boolean(bulletinUrl);

  // Admin-managed archive takes priority over CMS/static data
  const { data: cmsBulletins } = useBulletins();
  const adminArchive = useMemo(() => (hasArchive() ? getArchive() : null), [syncVersion]);
  const bulletins = adminArchive || cmsBulletins;
  // Placeholder entries without links aren't worth showing; past issues live on DiscoverMass.
  const hasLinkedArchive = bulletins.some((b) => b.url);

  return (
    <div style={{ paddingTop: 76 }}>
      <Seo
        title="Weekly Bulletin"
        description="Read the weekly church bulletin from St. Dominic Catholic Church with announcements, Mass intentions, and ministry news."
        image={PHOTOS.bulletinHero}
      />

      {/* ════ Hero ════ */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          background: `linear-gradient(160deg, ${T.burgundyDark} 0%, ${T.burgundy} 60%, #8B2E3F 100%)`,
          color: "#fff",
          padding: "clamp(48px, 10vw, 80px) 24px",
          textAlign: "center",
        }}
      >
        <HeroImage src={PHOTOS.bulletinHero} overlay={0.5} tint="rgba(107,29,42,0.5)" />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 640, margin: "0 auto" }}>
          <div
            style={{
              fontSize: 12,
              letterSpacing: 0.5,
              fontVariantCaps: "all-small-caps",
              color: T.goldLight,
              marginBottom: 16,
              fontWeight: 600,
            }}
          >
            {t("bulletin.hero.sub")}
          </div>
          <h1
            style={{
              fontSize: "clamp(36px, 7vw, 58px)",
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              lineHeight: 1.1,
              marginBottom: 16,
              color: "#fff",
            }}
          >
            {t("bulletin.title")}
          </h1>
          <p
            style={{
              fontSize: 17,
              lineHeight: 1.7,
              color: "rgba(255,255,255,0.8)",
              maxWidth: 520,
              margin: "0 auto",
            }}
          >
            {t("bulletin.hero.desc")}
          </p>
        </div>
      </section>

      <PremiumPageActions
        overlap
        eyebrow={t("bulletin.hero.sub")}
        title={t("bulletin.title")}
        items={[
          {
            title: t("bulletin.heading"),
            description: t("bulletin.reviewed"),
            href: "#current-bulletin",
            icon: "Newspaper",
            primary: true,
          },
          {
            title: t("bulletin.archive.title"),
            description: t("bulletin.archive.sub"),
            href: hasLinkedArchive ? "#bulletin-archive" : CONFIG.diocesanBulletinUrl,
            external: !hasLinkedArchive,
            icon: "FileText",
          },
          {
            title: t("bulletin.info.contact"),
            description: t("bulletin.info.contactDesc"),
            href: `mailto:${CONFIG.email}`,
            icon: "Mail",
          },
        ]}
      />

      {/* ════ Embedded Flipbook ════ */}
      <Section id="current-bulletin">
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2
            style={{
              fontSize: "clamp(24px, 4vw, 34px)",
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              color: T.softBlack,
              textAlign: "center",
              marginBottom: 32,
            }}
          >
            {t("bulletin.heading")}
          </h2>
          <p
            style={{
              fontSize: 13,
              color: T.warmGray,
              textAlign: "center",
              maxWidth: 620,
              margin: "-20px auto 28px",
            }}
          >
            {t("bulletin.reviewed")}
          </p>

          {hasBulletin ? (
            <>
              {/* Flipbook container */}
              <div
                style={{
                  borderRadius: "var(--radius-card)",
                  overflow: "hidden",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
                  border: `1px solid ${T.stone}`,
                  background: T.cream,
                }}
              >
                {/* Responsive aspect-ratio container */}
                <div
                  style={{
                    position: "relative",
                    paddingTop: "max(85%, 600px)",
                    width: "100%",
                    height: 0,
                  }}
                >
                  {/* Loading skeleton */}
                  {loading && (
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 16,
                        background: T.cream,
                        zIndex: 2,
                      }}
                    >
                      <style>{`
                          @keyframes bulletinPulse {
                            0%, 100% { opacity: 0.4; }
                            50% { opacity: 1; }
                          }
                        `}</style>
                      <Icon name="Newspaper" size={48} color={T.stone} />
                      <div
                        style={{
                          fontSize: 14,
                          color: T.warmGray,
                          letterSpacing: 1,
                          animation: "bulletinPulse 1.5s ease infinite",
                        }}
                      >
                        {t("bulletin.loading")}
                      </div>
                    </div>
                  )}

                  <iframe
                    src={bulletinUrl}
                    onLoad={() => setLoading(false)}
                    seamless="seamless"
                    scrolling="no"
                    style={{
                      position: "absolute",
                      width: "100%",
                      height: "100%",
                      left: 0,
                      top: 0,
                      border: "none",
                    }}
                    allowFullScreen
                    allowTransparency="true"
                    title={t("bulletin.heading")}
                  />
                </div>
              </div>

              {/* Fullscreen link */}
              <div style={{ textAlign: "center", marginTop: 16 }}>
                <a
                  href={bulletinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    fontSize: 14,
                    color: T.burgundy,
                    fontWeight: 600,
                    letterSpacing: 0.5,
                    textDecoration: "none",
                    transition: "opacity 0.2s ease",
                  }}
                >
                  <ExternalLink size={14} />
                  {t("bulletin.fullscreen")}
                </a>
              </div>
            </>
          ) : (
            /* This week's cover from DiscoverMass; the box below if it has nothing to show */
            <DiscoverMassBulletin
              fallback={
                <div
                  style={{
                    textAlign: "center",
                    padding: "clamp(48px, 8vw, 80px) 24px",
                    background: T.cream,
                    borderRadius: "var(--radius-card)",
                    border: `1px solid ${T.stone}`,
                  }}
                >
                  <Icon name="Newspaper" size={64} color={T.stone} />
                  <h3
                    style={{
                      fontSize: 24,
                      fontFamily: "var(--font-display)",
                      fontWeight: 600,
                      color: T.softBlack,
                      marginTop: 20,
                      marginBottom: 12,
                    }}
                  >
                    {t("bulletin.fallback.title")}
                  </h3>
                  <p
                    style={{
                      fontSize: 15,
                      color: T.warmGray,
                      lineHeight: 1.7,
                      maxWidth: 480,
                      margin: "0 auto 24px",
                    }}
                  >
                    {t("bulletin.fallback.desc")}
                  </p>
                  <a
                    href={CONFIG.diocesanBulletinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-hover"
                    style={{
                      display: "inline-block",
                      padding: "14px 32px",
                      fontSize: 14,
                      fontWeight: 600,
                      letterSpacing: 0.5,
                      textTransform: "uppercase",
                      background: T.burgundy,
                      color: T.cream,
                      borderRadius: 2,
                      textDecoration: "none",
                      transition: "all 0.3s ease",
                    }}
                  >
                    {t("bulletin.fallback.cta")}
                  </a>
                </div>
              }
            />
          )}
        </div>
      </Section>

      {/* ════ Bulletin Archive ════ (hidden while it only holds placeholders without links) */}
      {hasLinkedArchive && (
        <Section id="bulletin-archive" bg={T.cream}>
          <SectionTitle sub={t("bulletin.archive.sub")}>{t("bulletin.archive.title")}</SectionTitle>
          <div
            style={{
              maxWidth: 680,
              margin: "0 auto",
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {bulletins.map((b, i) => {
              const d = new Date(b.date + "T00:00:00");
              const dateLabel = d.toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              });
              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background: "#fff",
                    border: `1px solid ${T.stone}`,
                    borderRadius: "var(--radius-card)",
                    padding: "14px 20px",
                    gap: 16,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <FileText size={18} color={T.burgundy} />
                    <div>
                      <div
                        style={{
                          fontSize: 15,
                          fontWeight: 600,
                          color: T.softBlack,
                          fontFamily: "var(--font-display)",
                        }}
                      >
                        {b.label}
                      </div>
                      <div style={{ fontSize: 12, color: T.warmGray }}>{dateLabel}</div>
                    </div>
                  </div>
                  {b.url ? (
                    <a
                      href={b.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        fontSize: 12,
                        fontWeight: 700,
                        letterSpacing: 0.5,
                        textTransform: "uppercase",
                        color: T.burgundy,
                        textDecoration: "none",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <ExternalLink size={13} />
                      {t("bulletin.archive.download")}
                    </a>
                  ) : (
                    <span style={{ fontSize: 12, color: T.warmGray, fontStyle: "italic" }}>
                      {t("bulletin.archive.noLink")}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </Section>
      )}

      {/* ════ Bulletin Info ════ */}
      <Section bg={T.cream}>
        <SectionTitle sub={t("bulletin.info.sub")}>{t("bulletin.info.title")}</SectionTitle>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 24,
            maxWidth: 700,
            margin: "0 auto",
          }}
        >
          {/* Deadline card */}
          <div
            className="glass-card"
            style={{
              padding: 32,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 3,
                background: T.burgundy,
              }}
            />
            <div style={{ marginBottom: 14 }}>
              <Icon name="Clock" size={28} color={T.burgundy} />
            </div>
            <h3
              style={{
                fontSize: 18,
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                color: T.softBlack,
                marginBottom: 8,
              }}
            >
              {t("bulletin.info.deadline")}
            </h3>
            <p style={{ fontSize: 14, color: T.warmGray, lineHeight: 1.7 }}>
              <Trans
                i18nKey="bulletin.info.deadlineDesc"
                components={{
                  email: <a href={`mailto:${CONFIG.email}`} style={{ color: T.burgundy, fontWeight: 600 }} />,
                }}
              />
            </p>
          </div>
        </div>
      </Section>
    </div>
  );
}
