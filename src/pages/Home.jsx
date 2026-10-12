import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { T } from "../constants/theme";
import { CONFIG } from "../constants/config";
import { Section, SectionTitle } from "../components/Section";
import Btn from "../components/Btn";

import { useAnnouncements, useEvents, useSchedule } from "../cms/hooks";
import Seo from "../components/Seo";
import LiturgicalBanner from "../components/LiturgicalBanner";
import VaticanNews from "../components/VaticanNews";
import YouTubeChannel from "../components/YouTubeChannel";
import Icon from "../components/Icon";
import HeroImage from "../components/HeroImage";
import ResponsivePicture from "../components/ResponsivePicture";
import StickyHero from "../components/StickyHero";
import { PHOTOS } from "../constants/photos";
import { getTodayScheduleSummary } from "../utils/schedule";

const CATEGORY_COLORS = {
  mass: T.burgundy,
  sacrament: T.gold,
  education: "#4A7C59",
  social: "#5B7FA6",
  prayer: "#7B5EA7",
  other: T.warmGray,
};

/** One row of the Today / Find us list: icon, label + detail, arrow. */
function EssentialRow({ icon, label, value, onClick, href }) {
  const content = (
    <>
      <Icon name={icon} size={22} color={T.burgundy} />
      <span className="essential-row__text">
        <span className="essential-row__label">{label}</span>
        <span className="essential-row__value">{value}</span>
      </span>
      <Icon name="ChevronRight" size={18} color={T.goldText} className="essential-row__arrow" />
    </>
  );

  if (href) {
    const external = href.startsWith("http");
    return (
      <li>
        <a
          href={href}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
          className="essential-row"
        >
          {content}
        </a>
      </li>
    );
  }

  return (
    <li>
      <button type="button" onClick={onClick} className="essential-row">
        {content}
      </button>
    </li>
  );
}

function SundayMassCard({ t }) {
  return (
    <div className="premium-mass-card">
      <div className="premium-mass-card__label">{t("home.massCta.sundayMass")}</div>
      {[
        [t("home.massCta.satVigil"), "5:00 PM"],
        [t("home.massCta.sun"), "8:00 AM"],
        [t("home.massCta.sun"), "10:00 AM"],
        [t("home.massCta.sunEspanol"), "12:30 PM"],
      ].map(([label, time]) => (
        <div key={`${label}-${time}`} className="premium-mass-row">
          <span>{label}</span>
          <strong>{time}</strong>
        </div>
      ))}
    </div>
  );
}

function GatewayCard({ icon, title, body, cta, onClick }) {
  return (
    <button type="button" className="premium-gateway-card" onClick={onClick}>
      <Icon name={icon} size={34} color={T.gold} />
      <span>
        <strong>{title}</strong>
        <span>{body}</span>
      </span>
      <Icon name="ArrowRight" size={18} color={T.burgundy} />
      <span className="sr-only">{cta}</span>
    </button>
  );
}

export default function Home() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { data: announcements } = useAnnouncements();
  const { data: events } = useEvents();
  const { data: schedule } = useSchedule();
  const { masses: todayMasses, confessions: todayConfessions } = getTodayScheduleSummary(schedule);
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${CONFIG.mapsQuery}`;

  const upcoming = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return events.filter((event) => new Date(`${event.date}T00:00:00`) >= today).slice(0, 3);
  }, [events]);

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
          <p className="home-hero-subtitle premium-hero__eyebrow">{t("home.hero.subtitle")}</p>
          <h1 className="home-hero-title premium-hero__title">{t("home.hero.title")}</h1>
          <p className="home-hero-location premium-hero__location">{t("home.hero.location")}</p>

          <div className="premium-hero__actions">
            <div className="premium-hero__buttons">
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
            <button
              type="button"
              className="premium-light-link"
              onClick={() => navigate("/mass-times")}
            >
              {t("home.hero.ctaMass")}
              <Icon name="ArrowRight" size={15} color={T.goldLight} />
            </button>
          </div>

          {i18n.language !== "es" && (
            <button
              type="button"
              className="premium-hero__lang"
              onClick={() => {
                i18n.changeLanguage("es");
                localStorage.setItem("lang", "es");
              }}
            >
              También disponible en Español
            </button>
          )}
        </div>
      </StickyHero>

      {/* Domini canis — the dog with the torch from St. Dominic's mother's dream */}
      <div className="home-dog-divider">
        <a href="https://dominicanajournal.org/essay/im-a-dog/" target="_blank" rel="noopener noreferrer">
          <img src={PHOTOS.dominicanDog} alt={t("home.dog.label")} width={180} height={109} decoding="async" />
        </a>
      </div>

      <section className="premium-essentials">
        <div className="section-inner--wide">
          <div className="premium-essentials__lists">
          <div className="premium-essentials__group">
            <div className="kicker">{t("home.essentials.todayGroup")}</div>
            <ul className="essential-list">
              <EssentialRow
                icon="Church"
                label={t("home.essentials.today")}
                value={todayMasses || t("home.essentials.noMassToday")}
                onClick={() => navigate("/mass-times")}
              />
              <EssentialRow
                icon="Cross"
                label={t("home.essentials.confession")}
                value={todayConfessions || t("home.essentials.noConfessionToday")}
                onClick={() => navigate("/mass-times")}
              />
            </ul>
            <p className="premium-essentials__note">{t("home.essentials.reviewed")}</p>
          </div>
          <div className="premium-essentials__group">
            <div className="kicker">{t("home.essentials.findUs")}</div>
            <ul className="essential-list">
              <EssentialRow
                icon="MapPin"
                label={t("home.essentials.directions")}
                value={t("home.essentials.directionsDesc")}
                href={mapsHref}
              />
              <EssentialRow
                icon="Newspaper"
                label={t("home.essentials.bulletin")}
                value={t("home.essentials.bulletinDesc")}
                href={CONFIG.diocesanBulletinUrl}
              />
              <EssentialRow
                icon="Phone"
                label={t("home.essentials.contact")}
                value={CONFIG.phone}
                href={CONFIG.phoneLink}
              />
            </ul>
          </div>
          </div>
          <div className="premium-essentials__photo">
            <ResponsivePicture
              src={PHOTOS.homeEssentialsPhoto}
              widths={[480, 1024, 1920]}
              sizes="(max-width: 899px) 100vw, 460px"
              alt=""
            />
          </div>
        </div>
      </section>

      <Section>
        <div className="premium-two-column">
          <div>
            <SectionTitle sub={t("home.massCta.sub")} center={false} divider={false}>
              {t("home.massCta.title")}
            </SectionTitle>
            <div className="premium-inline-actions">
              <Btn variant="primary" onClick={() => navigate("/mass-times")}>
                {t("home.massCta.cta")}
              </Btn>
              <button
                type="button"
                className="premium-text-link"
                onClick={() => navigate("/visit")}
              >
                {t("home.hero.ctaVisit")}
                <Icon name="ArrowRight" size={15} color={T.burgundy} />
              </button>
            </div>
            {/* Veritas — the Order's motto — breaks the actions from the Mass card */}
            <a className="home-veritas" href="https://www.op.org/" target="_blank" rel="noopener noreferrer">
              <img
                src={PHOTOS.veritasBanner}
                alt={t("home.veritas.label")}
                width={280}
                height={88}
                loading="lazy"
                decoding="async"
              />
            </a>
          </div>
          <SundayMassCard t={t} />
        </div>
      </Section>

      <Section bg={T.cream}>
        <SectionTitle sub={t("home.welcome.sub")}>{t("home.welcome.title")}</SectionTitle>
        <div className="premium-welcome">
          <p>{t("home.welcome.p1")}</p>
          <p>{t("home.welcome.p2")}</p>
        </div>
        <div className="premium-gateway-grid">
          <GatewayCard
            icon="BookOpenText"
            title={t("home.pillars.word.title")}
            body={t("home.pillars.word.desc")}
            cta={t("home.welcome.cta")}
            onClick={() => navigate("/about")}
          />
          <GatewayCard
            icon="Church"
            title={t("home.pillars.sacrament.title")}
            body={t("home.pillars.sacrament.desc")}
            cta={t("nav.sacraments")}
            onClick={() => navigate("/sacraments")}
          />
          <GatewayCard
            icon="Handshake"
            title={t("home.pillars.service.title")}
            body={t("home.pillars.service.desc")}
            cta={t("home.involved.ctaRegister")}
            onClick={() => navigate("/get-involved")}
          />
        </div>
      </Section>

      <section className="premium-charism">
        <HeroImage src={PHOTOS.dominicanCharism} overlay={0.7} position="center top" />
        <div className="premium-charism__inner">
          <div className="premium-charism__grid">
            <div>
              <div className="kicker kicker--light">
                {t("home.priests.sub")}
              </div>
              <blockquote>{t("home.priests.quote")}</blockquote>
              <cite>{t("home.priests.quoteSrc")}</cite>
            </div>
            <div>
              <h2>{t("home.priests.title")}</h2>
              <p>{t("home.priests.desc")}</p>
              <div className="premium-inline-actions">
                <Btn variant="gold" onClick={() => navigate("/staff")}>
                  {t("home.priests.cta")}
                </Btn>
                <a
                  href={CONFIG.provinceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="premium-light-link"
                >
                  {t("home.priests.province")}
                  <Icon name="ExternalLink" size={14} color={T.goldLight} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

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

      {(announcements.length > 0 || upcoming.length > 0) && (
        <Section>
          <SectionTitle>{t("home.announcements.title")}</SectionTitle>
          <div className="premium-news-grid">
            {announcements.slice(0, 2).map((announcement, index) => (
              <article key={announcement.title || index} className="premium-news-card">
                {announcement.date && (
                  <div className="premium-news-card__date">
                    {t("home.announcements.upcoming")} ·{" "}
                    {new Date(`${announcement.date}T00:00:00`).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                )}
                <h3>{announcement.title}</h3>
                <p>{announcement.body}</p>
              </article>
            ))}

            {upcoming.slice(0, 2).map((event) => {
              const d = new Date(`${event.date}T00:00:00`);
              const color = CATEGORY_COLORS[event.category] ?? T.warmGray;
              return (
                <article
                  key={`${event.title}-${event.date}`}
                  className="premium-news-card premium-news-card--event"
                  style={{ "--event-color": color }}
                >
                  <div className="premium-event-date">
                    <span>{d.toLocaleDateString("en-US", { month: "short" })}</span>
                    <strong>{d.getDate()}</strong>
                  </div>
                  <h3>{event.title}</h3>
                  <p>
                    {event.time}
                    {event.location ? ` · ${event.location}` : ""}
                  </p>
                </article>
              );
            })}
          </div>
          <div className="premium-centered-actions">
            <Btn variant="primary" onClick={() => navigate("/events")}>
              {t("home.events.cta")}
            </Btn>
            <button
              type="button"
              className="premium-text-link"
              onClick={() => navigate("/bulletin")}
            >
              {t("home.announcements.ctaBulletin")}
              <Icon name="ArrowRight" size={15} color={T.burgundy} />
            </button>
          </div>
        </Section>
      )}

      <Section bg={T.cream}>
        <SectionTitle sub={t("home.formation.sub")}>{t("home.formation.title")}</SectionTitle>
        <p className="premium-formation-copy">{t("home.formation.desc")}</p>
        <div className="premium-formation-grid">
          <div>
            <SectionTitle divider={false}>{t("home.vatican.title")}</SectionTitle>
            <VaticanNews />
          </div>
          <div>
            <SectionTitle divider={false}>{t("youtube.title")}</SectionTitle>
            <p className="premium-widget-copy">{t("youtube.desc")}</p>
            <YouTubeChannel />
          </div>
        </div>
      </Section>

      <Section>
        <div className="premium-contact-strip">
          {[
            {
              key: "visit",
              iconName: "MapPin",
              content: `${CONFIG.address}, ${CONFIG.city}, ${CONFIG.state} ${CONFIG.zip}`,
            },
            { key: "call", iconName: "Phone", content: CONFIG.phone, href: CONFIG.phoneLink },
            {
              key: "hours",
              iconName: "Clock",
              content: `${t("home.cards.hoursDays")} · ${t("home.cards.hoursTime")}`,
            },
            {
              key: "email",
              iconName: "Mail",
              content: CONFIG.email,
              href: `mailto:${CONFIG.email}`,
            },
          ].map((card) => (
            <a
              key={card.key}
              href={card.href || mapsHref}
              target={!card.href ? "_blank" : undefined}
              rel={!card.href ? "noopener noreferrer" : undefined}
              className="premium-contact-item"
            >
              <Icon name={card.iconName} size={23} color={T.burgundy} />
              <span>
                <strong>{t(`home.cards.${card.key}Title`)}</strong>
                <span>{card.content}</span>
              </span>
            </a>
          ))}
        </div>
      </Section>
    </div>
  );
}
