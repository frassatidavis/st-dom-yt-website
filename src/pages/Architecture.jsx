import { useTranslation } from "react-i18next";
import { T } from "../constants/theme";
import { Section } from "../components/Section";
import HeroImage from "../components/HeroImage";
import StickyHero from "../components/StickyHero";
import StickyScrub from "../components/StickyScrub";
import ParallaxSection from "../components/ParallaxSection";
import ScaleReveal from "../components/ScaleReveal";
import TextReveal from "../components/TextReveal";
import Seo from "../components/Seo";
import Icon from "../components/Icon";
import PremiumPageActions from "../components/PremiumPageActions";
import { isClassic } from "../classic";
import { PHOTOS, classicPhoto } from "../constants/photos";

/* ── Reusable helpers (same patterns as History) ── */

function ArchPhoto({ src, alt, caption, maxWidth = 760 }) {
  return (
    <figure style={{ margin: "36px 0", textAlign: "center" }}>
      <img
        src={classicPhoto(src)}
        alt={alt}
        loading="lazy"
        style={{
          width: "100%",
          maxWidth,
          borderRadius: 4,
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        }}
      />
      {caption && (
        <figcaption
          style={{
            fontSize: 13,
            color: T.warmGray,
            fontStyle: "italic",
            marginTop: 10,
          }}
        >
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

function TwoPhotos({ left, right }) {
  return (
    <>
      <style>{`
        .arch-two-photos {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin: 36px 0;
        }
        @media (max-width: 600px) {
          .arch-two-photos { grid-template-columns: 1fr !important; }
        }
      `}</style>
      <div className="arch-two-photos">
        {[left, right].map((item, i) => (
          <figure key={i} style={{ margin: 0, textAlign: "center" }}>
            <img
              src={item.src}
              alt={item.alt}
              loading="lazy"
              style={{
                width: "100%",
                borderRadius: 4,
                boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
              }}
            />
            {item.caption && (
              <figcaption
                style={{ fontSize: 12, color: T.warmGray, fontStyle: "italic", marginTop: 8 }}
              >
                {item.caption}
              </figcaption>
            )}
          </figure>
        ))}
      </div>
    </>
  );
}

function StopMarker({ number }) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        marginBottom: 20,
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: T.burgundy,
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 15,
          fontWeight: 700,
          fontFamily: "var(--font-display)",
          flexShrink: 0,
        }}
      >
        {number}
      </div>
      <div
        style={{
          height: 2,
          width: 40,
          background: `linear-gradient(90deg, ${T.burgundy}, transparent)`,
        }}
      />
    </div>
  );
}

const P = (props) => (
  <p style={{ fontSize: 16, lineHeight: 1.8, color: T.warmGray, marginBottom: 20 }} {...props} />
);

const Detail = ({ icon, label, value }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
    <Icon name={icon} size={18} color={T.burgundy} />
    <span style={{ fontSize: 14, color: T.warmGray }}>
      <strong style={{ color: T.softBlack }}>{label}:</strong> {value}
    </span>
  </div>
);

export default function Architecture() {
  const { t } = useTranslation();

  return (
    <div>
      <Seo
        title="Architecture & Art"
        description="Explore the Romanesque architecture, stained glass, murals, and sacred art of St. Dominic Church in Youngstown, Ohio — a walking tour."
        image={PHOTOS.archHero}
      />

      <style>{`
        .arch-section { max-width: 800px; margin: 0 auto; }
        .arch-detail-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin: 24px 0 32px;
          padding: 24px;
          background: ${T.cream};
          border-radius: 8px;
          border: 1px solid ${T.stone};
        }
      `}</style>

      {/* ════ Hero — Apple-style Sticky ════ */}
      <StickyHero image={PHOTOS.archHero} overlay={0.5} tint="rgba(30,20,15,0.55)" height="130vh">
        <div
          style={{
            fontSize: 14,
            letterSpacing: 0.5,
            fontVariantCaps: "all-small-caps",
            color: T.goldText,
            marginBottom: 16,
            fontWeight: 600,
          }}
        >
          {t("arch.hero.sub")}
        </div>
        <h1
          style={{
            fontSize: "clamp(40px, 8vw, 68px)",
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            lineHeight: 1.1,
            color: "#fff",
            textShadow: "0 2px 30px rgba(0,0,0,0.6)",
          }}
        >
          {t("arch.title")}
        </h1>
        <div style={{ width: 56, height: 3, background: T.gold, margin: "20px auto 0" }} />
        {/* Classic Mode: just the title over the photo */}
        {!isClassic() && (
          <p
            style={{
              fontSize: 18,
              maxWidth: 560,
              margin: "24px auto 0",
              lineHeight: 1.6,
              color: "rgba(255,255,255,0.9)",
              textShadow: "0 1px 12px rgba(0,0,0,0.5)",
            }}
          >
            {t("arch.hero.desc")}
          </p>
        )}
      </StickyHero>

      {/* Classic Mode: no box of links under the photo */}
      {!isClassic() && (
        <PremiumPageActions
          overlap
          eyebrow={t("arch.hero.sub")}
          title={t("arch.title")}
          items={[
            {
              title: t("nav.gallery"),
              description: t("gallery.title"),
              to: "/gallery",
              icon: "Maximize",
              primary: true,
            },
            {
              title: t("nav.about"),
              description: t("about.history.p2"),
              to: "/about",
              icon: "BookOpenText",
            },
            {
              title: t("nav.visit"),
              description: t("visit.hero.desc"),
              to: "/visit",
              icon: "MapPin",
            },
          ]}
        />
      )}

      {/* Classic Mode: the nave as a 1950s newspaper photo, in its place */}
      {isClassic() && (
        <figure style={{ maxWidth: 760, margin: "56px auto 0", padding: "0 24px" }}>
          <img
            src={`${import.meta.env.BASE_URL}photos/classic/nave-newspaper-photo-opt.webp`}
            alt="The nave of St. Dominic Church, a man kneeling in the center aisle before the altar, from a 1950s newspaper photograph"
            width={1088}
            height={1125}
            loading="lazy"
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        </figure>
      )}

      {/* Classic Mode: no Threshold / Nave / Sanctuary scroll */}
      {!isClassic() && (
        <StickyScrub
          image={PHOTOS.archSanctuary || PHOTOS.interiorNave || PHOTOS.archHero}
          overlay={0.5}
          panels={[
            {
              id: "a-threshold",
              title: "The Threshold",
              body: "Pass under the Romanesque arches into a century of prayer rendered in wood, stone, and stained glass.",
            },
            {
              id: "a-nave",
              title: "The Nave",
              body: "Every line of the church draws the eye — and the soul — toward the altar.",
            },
            {
              id: "a-sanctuary",
              title: "The Sanctuary",
              body: "Where heaven meets earth in the daily celebration of the Sacred Mysteries.",
            },
          ]}
          height="300vh"
        />
      )}

      {/* ════ Stop 1 — Exterior & Facade ════ */}
      <Section>
        <div className="arch-section">
          <StopMarker number={1} />
          <h2
            style={{
              fontSize: "clamp(24px, 4vw, 34px)",
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              marginBottom: 20,
              color: T.softBlack,
            }}
          >
            <TextReveal>{t("arch.exterior.title")}</TextReveal>
          </h2>
          <P>{t("arch.exterior.p1")}</P>

          <ScaleReveal
            src={PHOTOS.archFacade}
            alt={t("arch.exterior.facadeAlt")}
            caption={t("arch.exterior.facadeCap")}
          />

          <P>{t("arch.exterior.p2")}</P>

          <TwoPhotos
            left={{
              src: PHOTOS.archDoors,
              alt: t("arch.exterior.doorsAlt"),
              caption: t("arch.exterior.doorsCap"),
            }}
            right={{
              src: PHOTOS.archSign,
              alt: t("arch.exterior.signAlt"),
              caption: t("arch.exterior.signCap"),
            }}
          />

          <P>{t("arch.exterior.p3")}</P>

          <div className="arch-detail-grid">
            <Detail
              icon="Ruler"
              label={t("arch.exterior.styleLabel")}
              value={t("arch.exterior.styleValue")}
            />
            <Detail
              icon="Building"
              label={t("arch.exterior.materialLabel")}
              value={t("arch.exterior.materialValue")}
            />
            <Detail
              icon="Calendar"
              label={t("arch.exterior.builtLabel")}
              value={t("arch.exterior.builtValue")}
            />
          </div>
        </div>
      </Section>

      {/* ════ Stop 2 — Main Entrance ════ */}
      <Section bg={T.cream}>
        <div className="arch-section">
          <StopMarker number={2} />
          <h2
            style={{
              fontSize: "clamp(24px, 4vw, 34px)",
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              marginBottom: 20,
              color: T.softBlack,
            }}
          >
            {t("arch.entrance.title")}
          </h2>
          <P>{t("arch.entrance.p1")}</P>

          <ArchPhoto
            src={PHOTOS.archEntrance}
            alt={t("arch.entrance.photoAlt")}
            caption={t("arch.entrance.photoCap")}
          />

          <P>{t("arch.entrance.p2")}</P>

          <ArchPhoto
            src={PHOTOS.archCornerstone}
            alt={t("arch.entrance.cornerstoneAlt")}
            caption={t("arch.entrance.cornerstoneCap")}
            maxWidth={480}
          />
        </div>
      </Section>

      {/* ════ Parallax Break — Rose Window ════ */}
      <ParallaxSection image={PHOTOS.archRoseExt} height="auto" speed={0.3} overlay={0.55}>
        <div
          style={{
            maxWidth: 700,
            margin: "0 auto",
            textAlign: "center",
            padding: "clamp(56px, 10vw, 96px) 0",
          }}
        >
          <blockquote
            style={{
              fontSize: "clamp(22px, 4vw, 34px)",
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              lineHeight: 1.5,
              color: "#fff",
              marginBottom: 16,
            }}
          >
            {t("arch.roseQuote")}
          </blockquote>
          <cite
            style={{
              display: "block",
              fontSize: 13,
              letterSpacing: 0.5,
              fontVariantCaps: "all-small-caps",
              color: T.goldText,
              fontStyle: "normal",
            }}
          >
            {t("arch.roseQuoteSrc")}
          </cite>
        </div>
      </ParallaxSection>

      {/* ════ Stop 3 — The Nave ════ */}
      <Section>
        <div className="arch-section">
          <StopMarker number={3} />
          <h2
            style={{
              fontSize: "clamp(24px, 4vw, 34px)",
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              marginBottom: 20,
              color: T.softBlack,
            }}
          >
            <TextReveal>{t("arch.nave.title")}</TextReveal>
          </h2>
          <P>{t("arch.nave.p1")}</P>

          <div className="arch-detail-grid">
            <Detail
              icon="Maximize"
              label={t("arch.nave.dimLabel")}
              value={t("arch.nave.dimValue")}
            />
            <Detail
              icon="ArrowUp"
              label={t("arch.nave.heightLabel")}
              value={t("arch.nave.heightValue")}
            />
            <Detail
              icon="Users"
              label={t("arch.nave.seatingLabel")}
              value={t("arch.nave.seatingValue")}
            />
          </div>

          <P>{t("arch.nave.p2")}</P>

          <ArchPhoto
            src={PHOTOS.archSideAisle}
            alt={t("arch.nave.aisleAlt")}
            caption={t("arch.nave.aisleCap")}
          />

          <P>{t("arch.nave.p3")}</P>
        </div>
      </Section>

      {/* ════ Stop 4 — The Sanctuary ════ */}
      <Section bg={T.cream}>
        <div className="arch-section">
          <StopMarker number={4} />
          <h2
            style={{
              fontSize: "clamp(24px, 4vw, 34px)",
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              marginBottom: 20,
              color: T.softBlack,
            }}
          >
            {t("arch.sanctuary.title")}
          </h2>
          <P>{t("arch.sanctuary.p1")}</P>

          <ScaleReveal
            src={PHOTOS.archSanctuary}
            alt={t("arch.sanctuary.photoAlt")}
            caption={t("arch.sanctuary.photoCap")}
          />

          <P>{t("arch.sanctuary.p2")}</P>
          <P>{t("arch.sanctuary.p3")}</P>
        </div>
      </Section>

      {/* ════ Parallax Break — Sanctuary Detail ════ */}
      <ParallaxSection image={PHOTOS.archSanctuary} height="auto" speed={0.2} overlay={0.6}>
        <div
          style={{
            maxWidth: 700,
            margin: "0 auto",
            textAlign: "center",
            padding: "clamp(48px, 8vw, 80px) 0",
          }}
        >
          <blockquote
            style={{
              fontSize: "clamp(22px, 4vw, 34px)",
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              lineHeight: 1.5,
              color: "#fff",
              marginBottom: 16,
            }}
          >
            {t("arch.sanctuaryQuote")}
          </blockquote>
          <cite
            style={{
              display: "block",
              fontSize: 13,
              letterSpacing: 0.5,
              fontVariantCaps: "all-small-caps",
              color: T.goldText,
              fontStyle: "normal",
            }}
          >
            {t("arch.sanctuaryQuoteSrc")}
          </cite>
        </div>
      </ParallaxSection>

      {/* ════ Stop 5 — Choir Loft & Rose Window ════ */}
      <Section>
        <div className="arch-section">
          <StopMarker number={5} />
          <h2
            style={{
              fontSize: "clamp(24px, 4vw, 34px)",
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              marginBottom: 20,
              color: T.softBlack,
            }}
          >
            <TextReveal>{t("arch.choirLoft.title")}</TextReveal>
          </h2>
          <P>{t("arch.choirLoft.p1")}</P>

          <ArchPhoto
            src={PHOTOS.archChoirLoft}
            alt={t("arch.choirLoft.loftAlt")}
            caption={t("arch.choirLoft.loftCap")}
          />

          <P>{t("arch.choirLoft.p2")}</P>

          <ScaleReveal
            src={PHOTOS.archRoseInt}
            alt={t("arch.choirLoft.roseAlt")}
            caption={t("arch.choirLoft.roseCap")}
          />

          <P>{t("arch.choirLoft.p3")}</P>
        </div>
      </Section>

      {/* ════ Full-width Drone Banner ════ */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          background: T.softBlack,
          padding: "clamp(48px, 10vw, 96px) 24px",
        }}
      >
        <HeroImage src={PHOTOS.archDrone} overlay={0.45} position="center top" />
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
            {t("arch.campus.sub")}
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
            {t("arch.campus.title")}
          </h3>
          <p
            style={{
              fontSize: 16,
              lineHeight: 1.8,
              color: "rgba(255,255,255,0.7)",
              maxWidth: 640,
              margin: "0 auto",
            }}
          >
            {t("arch.campus.desc")}
          </p>
        </div>
      </section>
    </div>
  );
}
