import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { T } from "../constants/theme";
import PullQuote from "../components/PullQuote";
import { Section, SectionTitle } from "../components/Section";
import Btn from "../components/Btn";

import Seo from "../components/Seo";
import HeroImage from "../components/HeroImage";
import PageHeader from "../components/PageHeader";
import PremiumPageActions from "../components/PremiumPageActions";
import PhotoGallery from "../components/PhotoGallery";
import ResponsivePicture from "../components/ResponsivePicture";
import TextReveal from "../components/TextReveal";
import { PHOTOS } from "../constants/photos";

export default function About() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div style={{ paddingTop: 76 }}>
      <Seo
        title="About Our Church"
        description="Learn about the history of St. Dominic Church, founded by the Dominican Friars in 1923 in Youngstown, Ohio."
        image={PHOTOS.aboutHero}
      />
      <PageHeader
        title={t("about.title")}
        heroSrc={PHOTOS.aboutHero}
        tint="rgba(26,23,20,0.5)"
      />

      <PremiumPageActions
        overlap
        items={[
          {
            title: t("about.actions.history.title"),
            to: "/history",
            icon: "BookOpenText",
            primary: true,
          },
          {
            title: t("about.actions.staff.title"),
            to: "/staff",
            icon: "Users",
          },
          {
            title: t("about.actions.visit.title"),
            to: "/visit",
            icon: "MapPin",
          },
        ]}
      />

      {/* ════ History — Editorial Asymmetric Layout ════ */}
      <Section>
        <style>{`
            .about-history-grid {
              display: grid;
              grid-template-columns: 1fr;
              gap: 40px;
              align-items: start;
            }
            @media (min-width: 768px) {
              .about-history-grid {
                grid-template-columns: 1fr 1.4fr;
                gap: 56px;
              }
            }
          `}</style>
        <div className="about-history-grid">
          {/* Left — Large founding date + summary */}
          <div>
            <div
              style={{
                fontSize: "clamp(80px, 12vw, 120px)",
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                color: T.warmGray,
                lineHeight: 1,
                marginBottom: 8,
                fontVariantNumeric: "oldstyle-nums",
              }}
            >
              1923
            </div>
            <div
              style={{
                fontSize: 14,
                letterSpacing: 0.5,
                fontVariantCaps: "all-small-caps",
                color: T.goldText,
                fontWeight: 600,
                marginBottom: 24,
              }}
            >
              {t("about.history.sub")}
            </div>
            <div
              className="glass-card--dark"
              style={{
                padding: 28,
                color: "#fff",
              }}
            >
              <PullQuote
                text={t("about.history.motto")}
                src={t("about.history.mottoSrc")}
                align="left"
                tone="dark"
              />
            </div>
          </div>

          {/* Right — History summary + link */}
          <div>
            <h2
              style={{
                fontSize: "clamp(26px, 4vw, 36px)",
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                marginBottom: 24,
                color: T.softBlack,
              }}
            >
              <TextReveal>{t("about.history.title")}</TextReveal>
            </h2>
            <p
              className="drop-cap"
              style={{
                fontSize: 16,
                lineHeight: 1.8,
                color: T.warmGray,
                marginBottom: 20,
              }}
            >
              {t("about.history.p1")}
            </p>
            <p
              style={{
                fontSize: 16,
                lineHeight: 1.8,
                color: T.warmGray,
                marginBottom: 28,
              }}
            >
              {t("about.history.p2")}
            </p>
            <Btn variant="outline" onClick={() => navigate("/history")}>
              {t("about.historyLink")}
            </Btn>
          </div>
        </div>

        {/* ── Then & now — photos from the parish archives ── */}
        <style>{`
            .about-history-photos {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
              gap: 18px;
              margin-top: 56px;
            }
            .about-history-photos figure { margin: 0; }
            .about-history-photos img {
              width: 100%;
              height: 240px;
              object-fit: cover;
              border-radius: 4px;
              border: 1px solid ${T.stone};
              display: block;
            }
            .about-history-photos figcaption {
              font-size: 13px;
              color: ${T.warmGray};
              line-height: 1.5;
              margin-top: 8px;
            }
          `}</style>
        <div className="about-history-photos">
          {[
            { src: PHOTOS.historyPastorConstruction, key: "construction" },
            { src: PHOTOS.historyPastorEntrance, key: "entrance" },
            { src: PHOTOS.historyPastorAerial, key: "aerial" },
          ].map(({ src, key }) => (
            <figure key={key}>
              <ResponsivePicture
                src={src}
                widths={[480, 1024]}
                sizes="(max-width: 768px) 100vw, 33vw"
                alt={t(`about.history.photos.${key}`)}
              />
              <figcaption>{t(`about.history.photos.${key}`)}</figcaption>
            </figure>
          ))}
        </div>
      </Section>

      {/* ════ Dominican Mission ════ */}
      <Section bg={T.cream}>
        <SectionTitle sub="Order of Preachers · Founded 1216">The Dominican Mission</SectionTitle>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: 40,
            maxWidth: 960,
            margin: "0 auto",
            alignItems: "center",
          }}
          className="dominican-mission-grid"
        >
          <style>{`
              @media (min-width: 768px) {
                .dominican-mission-grid { grid-template-columns: 240px 1fr !important; gap: 56px !important; }
              }
            `}</style>
          <div style={{ textAlign: "center" }}>
            <img
              src={PHOTOS.psjShield}
              alt="Shield of the Dominican Province of St. Joseph"
              style={{ maxWidth: 200, width: "100%", height: "auto", margin: "0 auto" }}
              loading="lazy"
            />
            <div
              style={{
                marginTop: 12,
                fontSize: 12,
                letterSpacing: 0.5,
                fontVariantCaps: "all-small-caps",
                color: T.goldText,
                fontWeight: 600,
              }}
            >
              Veritas · Truth
            </div>
          </div>
          <div>
            <p style={{ fontSize: 17, lineHeight: 1.8, color: T.warmGray, marginBottom: 20 }}>
              St. Dominic Catholic Church is entrusted to the friars of the{" "}
              <strong>Province of St. Joseph</strong>, an apostolic province of the Order of
              Preachers founded by St. Dominic de Guzmán in 1216 for the salvation of souls through
              preaching.
            </p>
            <p style={{ fontSize: 17, lineHeight: 1.8, color: T.warmGray, marginBottom: 20 }}>
              For eight centuries the Order has been shaped by four pillars:{" "}
              <em>prayer, study, community, and preaching</em>. You will find each woven into the
              life of this parish — in the daily Mass and Liturgy of the Hours, the study of
              Scripture and the Catechism, the bonds of fraternity among friars and faithful, and
              the proclamation of the Gospel from this pulpit since 1923.
            </p>
            <p style={{ fontSize: 17, lineHeight: 1.8, color: T.warmGray, marginBottom: 0 }}>
              Our motto, <em>Veritas</em>, points us always to Christ, the Truth made flesh.
            </p>
          </div>
        </div>
      </Section>

      {/* ════ Photo Gallery ════ */}
      {PHOTOS.gallery.length > 0 && (
        <Section>
          <SectionTitle>{t("gallery.title")}</SectionTitle>
          <PhotoGallery photos={PHOTOS.gallery} />
        </Section>
      )}

      {/* ════ Architecture — Full-width cinematic band ════ */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          background: T.softBlack,
          padding: "clamp(48px, 10vw, 96px) 24px",
        }}
      >
        <HeroImage src={PHOTOS.aboutArchitecture} overlay={0.6} position="center top" />
        <div
          style={{
            maxWidth: 800,
            margin: "0 auto",
            position: "relative",
            zIndex: 1,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 12,
              letterSpacing: 0.5,
              fontVariantCaps: "all-small-caps",
              color: T.goldText,
              fontWeight: 600,
              marginBottom: 16,
            }}
          >
            {t("about.architecture.style")}
          </div>
          <h3
            style={{
              fontSize: "clamp(26px, 5vw, 40px)",
              fontFamily: "var(--font-display)",
              marginBottom: 20,
              color: "#fff",
              fontWeight: 600,
              lineHeight: 1.2,
            }}
          >
            {t("about.architecture.title")}
          </h3>
          <p
            style={{
              fontSize: 16,
              lineHeight: 1.8,
              color: "rgba(255,255,255,0.7)",
              maxWidth: 640,
              margin: "0 auto 28px",
            }}
          >
            {t("about.architecture.desc")}
          </p>
          <Btn onClick={() => navigate("/architecture")}>{t("about.architecture.cta")}</Btn>
        </div>
      </section>
    </div>
  );
}
