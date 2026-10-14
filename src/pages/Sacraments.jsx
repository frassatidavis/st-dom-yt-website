import { useTranslation } from "react-i18next";
import PullQuote from "../components/PullQuote";
import { Link, useNavigate } from "react-router-dom";
import { T } from "../constants/theme";
import { PHOTOS } from "../constants/photos";
import { Section, SectionTitle } from "../components/Section";
import PageHeader from "../components/PageHeader";
import ParallaxSection from "../components/ParallaxSection";
import DominicanDivider from "../components/DominicanDivider";
import Seo from "../components/Seo";
import Icon from "../components/Icon";

const SACRAMENT_LINKS = [
  { to: "/sacraments/baptism", key: "baptism", icon: "Droplets", photo: PHOTOS.baptismCard },
  { to: "/sacraments/first-communion", key: "firstCommunion", icon: "Wheat", photo: PHOTOS.firstCommunionCard },
  { to: "/sacraments/confirmation", key: "confirmation", icon: "Flame", photo: PHOTOS.confirmationCard },
  { to: "/sacraments/marriage", key: "marriage", icon: "Gem", photo: PHOTOS.marriageCard },
  { to: "/sacraments/anointing", key: "anointing", icon: "HandHeart", photo: PHOTOS.anointingCard },
  { to: "/sacraments/funerals", key: "funerals", icon: "Cross", photo: PHOTOS.funeralCard },
];

export default function Sacraments() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="sacraments-page" style={{ paddingTop: 76 }}>
      <Seo
        title="The Sacraments"
        description="Learn about the seven sacraments celebrated at St. Dominic Church — Baptism, Eucharist, Confirmation, Marriage, and more."
        image={PHOTOS.sacramentsHero}
      />
      <PageHeader title={t("sacraments.title")} heroSrc={PHOTOS.sacramentsHero} position="50% 52%" tall />

      <Section bg={T.warmWhite}>
        <SectionTitle>{t("sacraments.heading")}</SectionTitle>
        <PullQuote variant="margin" text={t("sacraments.quote")} src={t("sacraments.quoteSrc")} />
        <p
          style={{
            fontSize: 16,
            color: T.warmGray,
            lineHeight: 1.9,
            textAlign: "center",
            maxWidth: 700,
            margin: "0 auto 48px",
          }}
        >
          {t("sacraments.desc")}
        </p>
      </Section>

      {/* Parallax visual break */}
      {/* Domini canis — the dog with the torch, as on Home */}
      <div className="home-dog-divider" style={{ background: T.warmWhite }}>
        <a href="https://dominicanajournal.org/essay/im-a-dog/" target="_blank" rel="noopener noreferrer">
          <img src={PHOTOS.dominicanDog} alt={t("home.dog.label")} width={180} height={109} loading="lazy" decoding="async" />
        </a>
      </div>

      <Section bg={T.cream} id="sacrament-cards">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 24,
          }}
        >
          {SACRAMENT_LINKS.map((s) => {
            // A card with a photo: the photo under a dark wash, with light text
            const ink = s.photo
              ? { title: "#fff", quote: "rgba(255,255,255,0.92)", cite: "rgba(255,255,255,0.75)", cta: T.goldLight, icon: T.goldLight }
              : { title: T.burgundy, quote: T.charcoal, cite: T.warmGray, cta: T.goldText, icon: T.burgundy };
            return (
            <Link
              key={s.to}
              to={s.to}
              onClick={(e) => {
                if (document.startViewTransition) {
                  e.preventDefault();
                  document.startViewTransition(() => navigate(s.to));
                }
              }}
              className="sacrament-card"
              style={{
                textDecoration: "none",
                background: s.photo
                  ? `linear-gradient(180deg, rgba(26,23,20,0.55), rgba(26,23,20,0.82)), url("${s.photo}") center 40% / cover`
                  : T.warmWhite,
                padding: 36,
                borderRadius: 4,
                border: `1px solid ${T.stone}`,
                borderTop: `4px solid ${T.burgundy}`,
                display: "block",
                viewTransitionName: `sacrament-${s.key}`,
              }}
            >
              <div style={{ marginBottom: 12 }} aria-hidden="true">
                <Icon name={s.icon} size={36} color={ink.icon} />
              </div>
              <h3
                style={{
                  fontSize: 22,
                  color: ink.title,
                  marginBottom: 8,
                  fontFamily: "var(--font-display)",
                }}
              >
                {t(`sacraments.${s.key}.title`)}
              </h3>
              {/* St. Thomas Aquinas on the sacrament (Summa Theologiae) */}
              <blockquote style={{ margin: 0 }}>
                <p
                  style={{
                    fontSize: 16,
                    fontFamily: "var(--font-display)",
                    fontStyle: "italic",
                    color: ink.quote,
                    lineHeight: 1.55,
                    margin: 0,
                  }}
                >
                  {t(`sacraments.${s.key}.cardQuote`)}
                </p>
                <cite style={{ display: "block", marginTop: 8, fontSize: 13, fontStyle: "normal", color: ink.cite }}>
                  ({t(`sacraments.${s.key}.cardQuoteSrc`)})
                </cite>
              </blockquote>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: ink.cta,
                  letterSpacing: 0.5,
                  textTransform: "uppercase",
                  marginTop: 16,
                }}
              >
                {t(`sacraments.${s.key}.cardCta`)} →
              </div>
            </Link>
            );
          })}
        </div>
      </Section>
    </div>
  );
}
