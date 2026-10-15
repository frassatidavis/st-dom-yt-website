import { useRef } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
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
import { isClassic, setClassic } from "../classic";

// The header lettering, cut from the 1960x420 "St·Dominic's" artwork: "St·Dom"
// ends at x=1179 and "'s" starts at x=1716, so the middle "inic" is 537 wide
const HEADER_NAME = {
  parts: PHOTOS.dominicsParts,
  closedAspect: (1960 - 537) / 420,
  midStart: 1179 / 1960,
  midFrac: 537 / 1960,
  midShift: 537 / 420,
};

// Today's intro video: the intros take turns, a different one each day (by
// the visitor's date), so the same one plays all day and returning visitors
// see the next one tomorrow. "?intro=2" in the address plays a chosen one
// (for previewing).
function introForToday(intros) {
  const pick = Number(new URLSearchParams(window.location.search).get("intro"));
  if (pick >= 1 && pick <= intros.length) return intros[pick - 1];
  const now = new Date();
  const day = Math.floor(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / 86400000);
  return intros[day % intros.length];
}

// Small-viewport units keep the hero's bottom edge (buttons, Skip / Replay)
// above phone browser toolbars, where 100vh reaches behind them
const HERO_HEIGHT =
  typeof CSS !== "undefined" && CSS.supports?.("height", "100svh") ? "calc(100svh - 88px)" : "calc(100vh - 88px)";

export default function Home() {
  const { t, i18n } = useTranslation();
  const isSpanish = i18n.language === "es";
  const intro = introForToday(VIDEOS.homeIntros);
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
          src: intro.src,
          poster: intro.poster,
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
            {/* Classic Mode only: the parish's two key years */}
            <p className="classic-years" aria-hidden={!isClassic()}>
              {t("classic.years")}
            </p>
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
              {/* Classic Mode: the 1923/1954 look, and back */}
              <Btn
                variant="light"
                onClick={() => setClassic(!isClassic())}
                style={{ minWidth: 168 }}
              >
                {isClassic() ? t("classic.toModern") : t("classic.toClassic")}
              </Btn>
            </div>
          </div>

        </div>
      </StickyHero>

      {/* St·Dom's rises into the header; as the dog passes it opens into St·Dominic's */}
      {!isClassic() && (
        <BrandFlight
          sourceRef={stDomsRef}
          lightSrc={PHOTOS.heroStDoms}
          lightOpacity={0.85}
          dark={HEADER_NAME}
          expandRef={dogRef}
        />
      )}

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
        <SectionTitle>{t("home.welcome.title")}</SectionTitle>
        <div className="premium-welcome">
          <p>
            {/* "The Dominican Friars" leads to their page */}
            <Trans
              i18nKey="home.welcome.p1"
              components={{ friars: <Link to="/dominican-friars" style={{ color: T.burgundy, textDecoration: "underline" }} /> }}
            />
          </p>
          <p>{t("home.welcome.p2")}</p>
        </div>
      </Section>

      <section className="premium-member-cta">
        <div className="section-inner">
          <SectionTitle light divider={false}>
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
          {/* Classic Mode: only the title (no online media) */}
          {!isClassic() && (
            <>
              <p>{t("home.formation.desc")}</p>
              <span className="home-media-cue" aria-hidden="true">
                {t("home.formation.mediaOpen")}
                <Icon name="ExternalLink" size={14} color={T.goldLight} />
              </span>
            </>
          )}
        </div>
        {/* The whole picture is one link to Dominican Friars Media (no buttons) */}
        {!isClassic() && (
          <a
            className="home-media-card-link"
            href={CONFIG.dominicanMediaUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${t("home.formation.title")}: ${t("home.formation.mediaOpen")}`}
          />
        )}
      </section>
    </div>
  );
}
