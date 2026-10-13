import { Trans, useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { T } from "../constants/theme";
import { CONFIG } from "../constants/config";
import { Section, SectionTitle } from "../components/Section";
import Btn from "../components/Btn";

import Seo from "../components/Seo";
import PageHeader from "../components/PageHeader";
import HeroImage from "../components/HeroImage";
import { PHOTOS } from "../constants/photos";
import PremiumPageActions from "../components/PremiumPageActions";

export default function Visit() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${CONFIG.mapsQuery}`;

  return (
    <div style={{ paddingTop: 76 }}>
      <Seo
        title="Start Here"
        description="Visiting St. Dominic Church? Everything you need to know — what to expect, Mass times, parking, and a warm welcome."
        image={PHOTOS.visitHero}
      />

      {/* ════ Split opener: text left, rose window right ════ */}
      <PageHeader
        variant="split"
        title={t("visit.hero.title")}
        lede={t("visit.hero.desc")}
        heroSrc={PHOTOS.visitHero}
      />

      <PremiumPageActions
        items={[
          {
            icon: "Church",
            title: t("visit.schedule.cta"),
            description: t("visit.schedule.confessionNote"),
            to: "/mass-times",
            primary: true,
          },
          {
            icon: "MapPin",
            title: t("visit.directions.cta"),
            description: `${CONFIG.address}, ${CONFIG.city}`,
            href: mapsHref,
            external: true,
          },
          {
            icon: "Phone",
            title: t("visit.cta.contact"),
            description: CONFIG.phone,
            to: "/contact",
          },
        ]}
      />

      {/* ════ Sunday at St. Dominic ════ */}
      <Section>
        <SectionTitle>{t("visit.steps.title")}</SectionTitle>
        <p
          className="u-lede"
          style={{
            fontSize: "clamp(16px, 2vw, 19px)",
            color: T.warmGray,
            lineHeight: 1.7,
            margin: 0,
          }}
        >
          {t("visit.steps.intro")}
        </p>
      </Section>

      {/* ════ What to Know — editorial list, hairline rules ════ */}
      <Section bg={T.cream} width="narrow">
        <SectionTitle>{t("visit.know.title")}</SectionTitle>
        <dl style={{ margin: 0 }}>
          {["dress", "children", "language", "parking"].map((key, i) => (
            <div
              key={key}
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(120px, 200px) 1fr",
                gap: "12px 28px",
                padding: "20px 0",
                borderTop: i === 0 ? `1px solid ${T.stone}` : undefined,
                borderBottom: `1px solid ${T.stone}`,
                marginTop: i === 0 ? 0 : -1,
              }}
            >
              <dt
                className="u-smallcaps"
                style={{
                  color: T.burgundy,
                  fontWeight: 600,
                  fontSize: 16,
                  lineHeight: 1.5,
                }}
              >
                {t(`visit.know.${key}.title`)}
              </dt>
              <dd
                style={{
                  margin: 0,
                  fontSize: 15,
                  color: T.warmGray,
                  lineHeight: 1.75,
                  maxWidth: "58ch",
                }}
              >
                {key === "dress" ? (
                  // "admiratio" links to an article on modesty in dress
                  <Trans
                    i18nKey="visit.know.dress.desc"
                    components={{
                      modesty: (
                        <a
                          href="https://www.ncregister.com/blog/3-doctors-of-the-church-on-the-virtue-of-modesty-in-dress"
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: T.burgundy, textDecoration: "underline" }}
                        />
                      ),
                    }}
                  />
                ) : (
                  t(`visit.know.${key}.desc`)
                )}
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      {/* ════ Quick Mass Schedule ════ */}
      <Section>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 36,
            alignItems: "center",
          }}
        >
          <div>
            <SectionTitle center={false}>
              {t("visit.schedule.title")}
            </SectionTitle>
            <Btn variant="primary" onClick={() => navigate("/mass-times")}>
              {t("visit.schedule.cta")}
            </Btn>
          </div>

          <div
            className="glass-card--dark"
            style={{
              color: "#fff",
              padding: 32,
            }}
          >
            <h3
              style={{
                fontSize: 20,
                color: T.goldLight,
                fontFamily: "var(--font-display)",
                marginBottom: 16,
              }}
            >
              {t("visit.schedule.sundayTitle")}
            </h3>
            {[
              [t("visit.schedule.satVigil"), "5:00 PM"],
              [t("visit.schedule.sun"), "8:00 AM"],
              [t("visit.schedule.sun"), "10:00 AM"],
              [t("visit.schedule.sunEs"), "12:30 PM"],
            ].map(([label, time], i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "10px 0",
                  borderBottom: "1px solid rgba(255,255,255,0.15)",
                  fontSize: 15,
                }}
              >
                <span>{label}</span>
                <span className="u-onum" style={{ fontWeight: 600, color: T.goldLight }}>
                  {time}
                </span>
              </div>
            ))}
            <p
              style={{
                fontSize: 13,
                marginTop: 16,
                color: "rgba(255,255,255,0.6)",
                fontStyle: "italic",
              }}
            >
              {t("visit.schedule.confessionNote")}
            </p>
          </div>
        </div>
      </Section>

      {/* ════ Directions ════ */}
      <Section bg={T.cream} width="narrow">
        <SectionTitle>{t("visit.directions.title")}</SectionTitle>
        <div className="glass-card" style={{ padding: 32, marginBottom: 20, maxWidth: 520 }}>
          <address style={{ fontStyle: "normal", marginBottom: 20 }}>
            <p style={{ fontSize: 18, fontWeight: 600, color: T.softBlack, marginBottom: 4 }}>
              {CONFIG.address}
            </p>
            <p className="u-onum" style={{ fontSize: 16, color: T.warmGray }}>
              {CONFIG.city}, {CONFIG.state} {CONFIG.zip}
            </p>
          </address>
          <Btn
            variant="primary"
            onClick={() =>
              window.open(
                `https://www.google.com/maps/search/?api=1&query=${CONFIG.mapsQuery}`,
                "_blank"
              )
            }
          >
            {t("visit.directions.cta")}
          </Btn>
        </div>
        <p className="u-lede" style={{ fontSize: 14, color: T.warmGray, lineHeight: 1.7 }}>
          {t("visit.directions.parking")}
        </p>
      </Section>

      {/* ════ Closing welcome over the Sacred Heart shrine ════ */}
      <section className="premium-member-cta premium-member-cta--photo">
        <HeroImage src={PHOTOS.sacredHeart} overlay={0.62} position="center 15%" lazy />
        <div className="section-inner">
          <h2
            style={{
              fontSize: "clamp(26px, 5vw, 38px)",
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              color: "#fff",
              marginBottom: 16,
              lineHeight: 1.3,
              letterSpacing: "var(--tracking-display)",
            }}
          >
            {t("visit.cta.title")}
          </h2>
          <p>{t("visit.cta.desc")}</p>
          <div className="premium-centered-actions">
            <Btn variant="gold" onClick={() => navigate("/contact")}>
              {t("visit.cta.contact")}
            </Btn>
            <Btn variant="light" onClick={() => navigate("/becoming-catholic")}>
              {t("visit.cta.becoming")}
            </Btn>
          </div>
        </div>
      </section>
    </div>
  );
}
