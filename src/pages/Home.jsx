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
import { PHOTOS } from "../constants/photos";

export default function Home() {
  const { t, i18n } = useTranslation();
  const isSpanish = i18n.language === "es";
  const navigate = useNavigate();

  return (
    <div>
      <Seo
        description="St. Dominic Catholic Church in Youngstown, Ohio. Served by the Dominican Friars since 1923. Mass times, sacraments, and community life."
        image={PHOTOS.homeHero}
      />

      <LiturgicalBanner />

      <StickyHero
        image={PHOTOS.homeHeroProcession}
        overlay={0.18}
        scrim="corner"
        align="bottom-left"
        height="calc(100vh - 88px)"
        viewportHeight="calc(100vh - 88px)"
        showScrollHint={false}
      >
        <div className="premium-hero">
          <h1 className="home-hero-title premium-hero__title">{t("home.hero.title")}</h1>

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

      {/* Domini canis — the dog with the torch from St. Dominic's mother's dream */}
      <div className="home-dog-divider">
        <a href="https://dominicanajournal.org/essay/im-a-dog/" target="_blank" rel="noopener noreferrer">
          <img src={PHOTOS.dominicanDog} alt={t("home.dog.label")} width={180} height={109} decoding="async" />
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
        <HeroImage src={PHOTOS.dominicanCharism} overlay={0.7} position="center top" />
        <div className="premium-charism__inner">
          <h2>{t("home.formation.title")}</h2>
          <p>{t("home.formation.desc")}</p>

          {/* Dominican Friars Media, live. Loads when scrolled near; sandboxed so
              it can open links in new tabs but never navigate this page. */}
          <div className="home-media-frame" data-lenis-prevent>
            <iframe
              src={CONFIG.dominicanMediaUrl}
              title={t("home.formation.mediaTitle")}
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms"
            />
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
