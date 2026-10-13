import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { T } from "../constants/theme";
import { CONFIG } from "../constants/config";
import { Section, SectionTitle } from "../components/Section";
import Btn from "../components/Btn";

import Seo from "../components/Seo";
import LiturgicalBanner from "../components/LiturgicalBanner";
import Icon from "../components/Icon";
import HeroImage from "../components/HeroImage";
import StickyHero from "../components/StickyHero";
import { PHOTOS, VIDEOS } from "../constants/photos";
import useScrollVar from "../hooks/useScrollVar";
import BrandFlight from "../components/BrandFlight";

// Small-viewport units keep the hero's bottom edge (buttons, Skip / Replay)
// above phone browser toolbars, where 100vh reaches behind them
const HERO_HEIGHT =
  typeof CSS !== "undefined" && CSS.supports?.("height", "100svh") ? "calc(100svh - 88px)" : "calc(100vh - 88px)";

export default function Home() {
  const { t, i18n } = useTranslation();
  const isSpanish = i18n.language === "es";
  const navigate = useNavigate();
  // Photos that pop out as they scroll into view (styles: .pop-in, .pop-photo)
  const dogRef = useRef(null);
  const stDomsRef = useRef(null); // flies into the header on scroll (BrandFlight)
  const charismPhotoRef = useRef(null);
  useScrollVar(dogRef);
  useScrollVar(charismPhotoRef);

  return (
    <div>
      <Seo
        description="St. Dominic Catholic Church in Youngstown, Ohio. Served by the Dominican Friars since 1923. Mass times, sacraments, and community life."
        image={PHOTOS.homeHero}
      />

      <LiturgicalBanner />

      <StickyHero
        image={PHOTOS.homeHeroProcession}
        introVideo={{
          src: VIDEOS.homeIntro,
          poster: VIDEOS.homeIntroPoster,
          skipLabel: t("home.hero.skipIntro"),
          replayLabel: t("home.hero.replayIntro"),
        }}
        overlay={0.18}
        scrim="corner"
        align="bottom-left"
        fillHeight
        popOnScroll
        height={HERO_HEIGHT}
        viewportHeight={HERO_HEIGHT}
        showScrollHint={false}
      >
        <div className="premium-hero premium-hero--centered">
          {/* Centered over the picture, in the open space above the buttons */}
          <div className="premium-hero__center">
            {/* "THIS IS / St·Dom's" lettering: two images stacked edge to edge */}
            <h1 className="premium-hero__logo">
              <span className="sr-only">{t("home.hero.title")}</span>
              <img
                className="premium-hero__logo-this-is"
                src={PHOTOS.heroThisIs}
                srcSet={`${PHOTOS.heroThisIsSmall} 800w, ${PHOTOS.heroThisIs} 1600w`}
                sizes="(max-width: 700px) 86vw, 760px"
                width={1600}
                height={136}
                alt=""
              />
              <img
                ref={stDomsRef}
                className="premium-hero__logo-st-doms"
                src={PHOTOS.heroStDoms}
                srcSet={`${PHOTOS.heroStDomsSmall} 800w, ${PHOTOS.heroStDoms} 1600w`}
                sizes="(max-width: 700px) 86vw, 760px"
                width={1600}
                height={511}
                alt=""
              />
            </h1>
          </div>

          <div className="premium-hero__actions">
            <div className="premium-hero__buttons">
              {/* Language switch: "Español" for English visitors, "English" once in Spanish */}
              <Btn
                variant="primary"
                onClick={() => {
                  const next = isSpanish ? "en" : "es";
                  i18n.changeLanguage(next);
                  localStorage.setItem("lang", next);
                }}
                style={{ minWidth: 168, boxShadow: "inset 0 0 0 1px rgba(232, 213, 163, 0.55)" }}
              >
                <span lang={isSpanish ? "en" : "es"}>{isSpanish ? "English" : "Español"}</span>
              </Btn>
              <Btn variant="gold" onClick={() => navigate("/visit")} style={{ minWidth: 168 }}>
                {t("home.hero.ctaVisit")}
              </Btn>
              <Btn
                variant="primary"
                onClick={() => navigate("/bulletin")}
                style={{ minWidth: 168, boxShadow: "inset 0 0 0 1px rgba(232, 213, 163, 0.55)" }}
              >
                {t("home.hero.ctaBulletin")}
              </Btn>
            </div>
          </div>

        </div>
      </StickyHero>

      <BrandFlight
        sourceRef={stDomsRef}
        lightSrc={PHOTOS.heroStDoms}
        lightOpacity={0.85}
        darkSrc={PHOTOS.heroStDomsBurgundy}
        aspect={1600 / 511}
      />

      {/* Domini canis — the dog with the torch from St. Dominic's mother's dream */}
      <div className="home-dog-divider">
        <a href="https://dominicanajournal.org/essay/im-a-dog/" target="_blank" rel="noopener noreferrer">
          <img
            ref={dogRef}
            className="pop-in"
            src={PHOTOS.dominicanDog}
            alt={t("home.dog.label")}
            width={180}
            height={109}
            decoding="async"
          />
        </a>
      </div>

      <Section bg={T.cream}>
        <SectionTitle sub={t("home.welcome.sub")}>{t("home.welcome.title")}</SectionTitle>
        <div className="premium-welcome">
          <p>{t("home.welcome.p1")}</p>
          <p>{t("home.welcome.p2")}</p>
        </div>
      </Section>

      <section className="premium-member-cta">
        <div className="section-inner">
          <SectionTitle sub={t("home.involved.sub")} light divider={false}>
            {t("home.involved.title")}
          </SectionTitle>
          <p>{t("home.involved.desc")}</p>
          <div className="premium-centered-actions">
            <Btn variant="gold" onClick={() => navigate("/register")}>
              {t("home.involved.ctaRegister")}
            </Btn>
            <Btn variant="light" onClick={() => navigate("/bulletin")}>
              {t("home.involved.ctaBulletin")}
            </Btn>
          </div>
        </div>
      </section>

      {/* Faith formation: introduced over the preaching photo, widgets below */}
      <section className="premium-charism">
        <div ref={charismPhotoRef} className="pop-photo">
          <HeroImage src={PHOTOS.dominicanCharism} overlay={0.7} position="center top" />
        </div>
        <div className="premium-charism__inner">
          <h2>{t("home.formation.title")}</h2>
          <p>{t("home.formation.desc")}</p>

          {/* Dominican Friars Media: one button per section of their site */}
          <div className="home-media-buttons">
            {[
              { key: "videos", icon: "Video", anchor: "videos" },
              { key: "podcasts", icon: "Mic", anchor: "podcasts" },
              { key: "music", icon: "Music", anchor: "music" },
              { key: "rosary", icon: "Cross", anchor: "rosary" },
              { key: "books", icon: "BookOpen", anchor: "books" },
              { key: "academic", icon: "GraduationCap", anchor: "academic1" },
            ].map((s) => (
              <a
                key={s.key}
                href={`${CONFIG.dominicanMediaUrl}#${s.anchor}`}
                target="_blank"
                rel="noopener noreferrer"
                className="home-media-button"
              >
                <Icon name={s.icon} size={20} color={T.goldLight} />
                {t(`home.formation.media.${s.key}`)}
              </a>
            ))}
          </div>
          <a className="home-media-link" href={CONFIG.dominicanMediaUrl} target="_blank" rel="noopener noreferrer">
            {t("home.formation.mediaOpen")}
            <Icon name="ExternalLink" size={14} color={T.goldLight} />
          </a>
        </div>
      </section>
    </div>
  );
}
