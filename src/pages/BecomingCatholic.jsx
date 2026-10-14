import { useTranslation } from "react-i18next";
import PullQuote from "../components/PullQuote";
import { T } from "../constants/theme";
import { CONFIG } from "../constants/config";
import { PHOTOS } from "../constants/photos";
import { Section, SectionTitle } from "../components/Section";
import Btn from "../components/Btn";
import PageHeader from "../components/PageHeader";
import ParallaxSection from "../components/ParallaxSection";
import Seo from "../components/Seo";
import PremiumPageActions from "../components/PremiumPageActions";

export default function BecomingCatholic() {
  const { t } = useTranslation();

  const cards = [{ key: "new" }, { key: "returning" }, { key: "ready" }];

  return (
    <div style={{ paddingTop: 76 }}>
      <Seo
        title="Becoming Catholic"
        description="Interested in becoming Catholic? Learn about OCIA (formerly RCIA) and the journey of faith at St. Dominic Church, Youngstown OH."
        image={PHOTOS.stockRcia}
      />
      <PageHeader
        title={t("becomingCatholic.title")}
        variant="text"
      />

      {/* ════ Intro ════ */}
      <Section>
        <SectionTitle sub={t("becomingCatholic.intro.sub")}>
          {t("becomingCatholic.intro.title")}
        </SectionTitle>
        <PullQuote variant="margin" text={t("becomingCatholic.quote")} src={t("becomingCatholic.quoteSrc")} />
        <p
          style={{
            fontSize: 17,
            lineHeight: 1.8,
            color: T.warmGray,
            maxWidth: 720,
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          {t("becomingCatholic.intro.desc")}
        </p>
      </Section>

      {/* ════ Cards ════ */}
      <Section bg={T.cream}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 28,
          }}
        >
          {cards.map(({ key }) => (
            <div
              key={key}
              style={{
                background: "#fff",
                borderRadius: "var(--radius-card)",
                overflow: "hidden",
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              }}
            >
              <div style={{ height: 4, background: T.burgundy }} />
              <div style={{ padding: 32 }}>
                <h3
                  style={{
                    fontSize: 20,
                    fontFamily: "var(--font-display)",
                    marginBottom: 10,
                    color: T.softBlack,
                  }}
                >
                  {t(`becomingCatholic.cards.${key}.title`)}
                </h3>
                <p
                  style={{
                    fontSize: 15,
                    lineHeight: 1.7,
                    color: T.warmGray,
                    marginBottom: 16,
                  }}
                >
                  {t(`becomingCatholic.cards.${key}.desc`)}
                </p>
                <span
                  style={{
                    display: "inline-block",
                    fontSize: 12,
                    fontWeight: 600,
                    letterSpacing: 0.5,
                    fontVariantCaps: "all-small-caps",
                    color: T.burgundy,
                    background: `${T.burgundy}10`,
                    padding: "6px 14px",
                    borderRadius: 4,
                  }}
                >
                  {t(`becomingCatholic.cards.${key}.step`)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Parallax visual break */}
      <ParallaxSection image={PHOTOS.sanctuaryAltar} height="30vh" overlay={0.45} />

      {/* ════ Contact CTA ════ */}
      <Section>
        <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
          <h2
            style={{
              fontSize: "clamp(26px, 4vw, 36px)",
              fontFamily: "var(--font-display)",
              marginBottom: 12,
              color: T.softBlack,
            }}
          >
            {t("becomingCatholic.contact.heading")}
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.8, color: T.warmGray, marginBottom: 24 }}>
            {t("becomingCatholic.contact.desc")}
          </p>
          <div style={{ display: "flex", gap: 24, justifyContent: "center", flexWrap: "wrap" }}>
            <a
              href={CONFIG.phoneLink}
              className="contact-link"
              style={{
                fontSize: 18,
                fontWeight: 600,
                color: T.burgundy,
              }}
            >
              {CONFIG.phone}
            </a>
            <a
              href={`mailto:${CONFIG.email}`}
              className="contact-link"
              style={{
                fontSize: 18,
                fontWeight: 600,
                color: T.burgundy,
              }}
            >
              {CONFIG.email}
            </a>
          </div>
        </div>
      </Section>
    </div>
  );
}
