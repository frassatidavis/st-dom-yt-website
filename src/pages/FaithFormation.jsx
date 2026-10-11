import { useTranslation } from "react-i18next";
import { T } from "../constants/theme";
import { PHOTOS } from "../constants/photos";
import { Section, SectionTitle } from "../components/Section";
import PageHeader from "../components/PageHeader";
import PremiumPageActions from "../components/PremiumPageActions";
import ParallaxSection from "../components/ParallaxSection";
import DominicanDivider from "../components/DominicanDivider";
import Seo from "../components/Seo";
import { BookOpen, Headphones, GraduationCap, Church, ExternalLink } from "lucide-react";

const RESOURCES = [
  {
    key: "thomistic",
    icon: GraduationCap,
    url: "https://thomisticinstitute.org",
    color: T.burgundy,
  },
  {
    key: "godsplaining",
    icon: Headphones,
    url: "https://godsplaining.org",
    color: "#2D6A4F",
  },
  {
    key: "rosary",
    icon: Headphones,
    url: "https://ascensionpress.com/rosaryinayear",
    color: "#3A5BA0",
  },
  {
    key: "dominicana",
    icon: BookOpen,
    url: "https://www.dominicanajournal.org",
    color: "#5C3D2E",
  },
  {
    key: "saintsAlive",
    icon: Headphones,
    url: "https://www.saintsalivepodcast.com",
    color: "#8B6914",
  },
  {
    key: "catechism",
    icon: Church,
    url: "https://www.usccb.org/beliefs-and-teachings/what-we-believe/catechism/catechism-of-the-catholic-church",
    color: "#1B4332",
  },
];

const cardStyle = {
  background: "#fff",
  border: `1px solid ${T.stone}`,
  borderRadius: "var(--radius-card)",
  overflow: "hidden",
  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  display: "flex",
  flexDirection: "column",
};

export default function FaithFormation() {
  const { t } = useTranslation();

  return (
    <div style={{ paddingTop: 76 }}>
      <Seo
        title="Faith Formation"
        description="Deepen your faith with Dominican resources — podcasts, theology, catechesis, and more at St. Dominic Catholic Church."
        image={PHOTOS.faithFormationHero}
      />
      <PageHeader title={t("faithFormation.title")} variant="text" />
      <PremiumPageActions
        eyebrow={t("faithFormation.intro.sub")}
        title={t("faithFormation.intro.title")}
        items={[
          {
            title: t("faithFormation.resources.title"),
            description: t("faithFormation.resources.desc"),
            href: "#faith-resources",
            icon: "BookOpenText",
            primary: true,
          },
          {
            title: t("nav.becomingCatholic"),
            description: t("becomingCatholic.intro.desc"),
            to: "/becoming-catholic",
            icon: "Church",
          },
        ]}
      />

      {/* ════ Intro ════ */}
      <Section bg={T.warmWhite}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <SectionTitle sub={t("faithFormation.intro.sub")}>
            {t("faithFormation.intro.title")}
          </SectionTitle>
          <p
            className="u-lede"
            style={{
              fontSize: 17,
              lineHeight: 1.8,
              color: T.warmGray,
              margin: 0,
            }}
          >
            {t("faithFormation.intro.desc")}
          </p>
        </div>
      </Section>

      {/* ════ Why Learn More ════ */}
      <Section bg={T.cream}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <SectionTitle>{t("faithFormation.why.title")}</SectionTitle>
          <p
            style={{
              fontSize: 16,
              lineHeight: 1.9,
              color: T.warmGray,
              marginBottom: 20,
            }}
          >
            {t("faithFormation.why.p1")}
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.9, color: T.warmGray }}>
            {t("faithFormation.why.p2")}
          </p>
        </div>
      </Section>

      {/* Parallax visual break */}
      <ParallaxSection
        image={PHOTOS.stockBibleGolden}
        height="30vh"
        overlay={0.45}
        position="center 80%"
      >
        <DominicanDivider color="#fff" width={160} />
      </ParallaxSection>

      {/* ════ Dominican Resources ════ */}
      <Section id="faith-resources" bg={T.warmWhite}>
        <SectionTitle sub={t("faithFormation.resources.sub")}>
          {t("faithFormation.resources.title")}
        </SectionTitle>
        <p
          className="u-lede"
          style={{
            fontSize: 16,
            lineHeight: 1.8,
            color: T.warmGray,
            margin: "0 0 40px",
          }}
        >
          {t("faithFormation.resources.desc")}
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 28,
            maxWidth: 1000,
            margin: "0 auto",
          }}
        >
          {RESOURCES.map(({ key, icon: Icon, url, color }) => (
            <a
              key={key}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                ...cardStyle,
                textDecoration: "none",
                color: "inherit",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
                e.currentTarget.style.borderColor = color;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)";
                e.currentTarget.style.borderColor = T.stone;
              }}
            >
              <div style={{ padding: "28px 28px 24px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 12,
                  }}
                >
                  <Icon size={22} color={color} strokeWidth={1.8} style={{ flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <h3
                      style={{
                        fontSize: 19,
                        fontFamily: "var(--font-display)",
                        fontWeight: 700,
                        color: T.softBlack,
                        margin: 0,
                      }}
                    >
                      {t(`faithFormation.resources.${key}.title`)}
                    </h3>
                    <span
                      style={{
                        fontSize: 11,
                        letterSpacing: 0.5,
                        fontVariantCaps: "all-small-caps",
                        color,
                        fontWeight: 600,
                      }}
                    >
                      {t(`faithFormation.resources.${key}.tag`)}
                    </span>
                  </div>
                  <ExternalLink size={15} color={T.stone} style={{ flexShrink: 0 }} />
                </div>
                <p
                  style={{
                    fontSize: 14,
                    lineHeight: 1.7,
                    color: T.warmGray,
                    margin: 0,
                  }}
                >
                  {t(`faithFormation.resources.${key}.desc`)}
                </p>
              </div>
            </a>
          ))}
        </div>
      </Section>

      {/* ════ Embedded Podcasts ════ */}
      <Section bg={T.cream}>
        <SectionTitle>{t("faithFormation.listen.title")}</SectionTitle>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 28,
            maxWidth: 1000,
            margin: "0 auto",
          }}
        >
          {/* Godsplaining */}
          <div style={cardStyle}>
            <div style={{ padding: 24 }}>
              <h3
                style={{
                  fontSize: 18,
                  fontFamily: "var(--font-display)",
                  color: T.softBlack,
                  marginBottom: 12,
                }}
              >
                Godsplaining
              </h3>
              <iframe
                src="https://open.spotify.com/embed/show/0aIOz3chYeQZxsdjyJzlOb?utm_source=generator&theme=0"
                width="100%"
                height="152"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                style={{ borderRadius: "var(--radius-card)" }}
                title="Godsplaining Podcast"
              />
            </div>
          </div>

          {/* Rosary in a Year */}
          <div style={cardStyle}>
            <div style={{ padding: 24 }}>
              <h3
                style={{
                  fontSize: 18,
                  fontFamily: "var(--font-display)",
                  color: T.softBlack,
                  marginBottom: 12,
                }}
              >
                Rosary in a Year
              </h3>
              <iframe
                src="https://open.spotify.com/embed/show/3Rx1puBjE0xZBiuy4BT4i7?utm_source=generator&theme=0"
                width="100%"
                height="152"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                style={{ borderRadius: "var(--radius-card)" }}
                title="Rosary in a Year Podcast"
              />
            </div>
          </div>
        </div>
      </Section>

      {/* ════ Getting Started CTA ════ */}
      <Section bg={T.warmWhite}>
        <DominicanDivider style={{ marginBottom: 16 }} />
        <div
          style={{
            textAlign: "center",
            maxWidth: 600,
            margin: "0 auto",
          }}
        >
          <h3
            style={{
              fontSize: "clamp(24px, 4vw, 32px)",
              fontFamily: "var(--font-display)",
              color: T.softBlack,
              marginBottom: 14,
            }}
          >
            {t("faithFormation.cta.title")}
          </h3>
          <p
            style={{
              fontSize: 16,
              lineHeight: 1.8,
              color: T.warmGray,
              marginBottom: 8,
            }}
          >
            {t("faithFormation.cta.desc")}
          </p>
        </div>
      </Section>
    </div>
  );
}
