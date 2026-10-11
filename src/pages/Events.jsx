import { useState } from "react";
import { useTranslation } from "react-i18next";
import { T } from "../constants/theme";
import { Section, SectionTitle } from "../components/Section";
import PageHeader from "../components/PageHeader";
import PremiumPageActions from "../components/PremiumPageActions";
import Seo from "../components/Seo";
import Icon from "../components/Icon";
import { CONFIG } from "../constants/config";
import { PHOTOS } from "../constants/photos";
import { useEvents } from "../cms/hooks";

const CATEGORY_META = {
  mass: { icon: "Church", color: T.burgundy, label: "Mass" },
  sacrament: { icon: "Star", color: T.gold, label: "Sacrament" },
  education: { icon: "BookOpenText", color: "#4A7C59", label: "Education" },
  social: { icon: "Handshake", color: "#5B7FA6", label: "Community" },
  prayer: { icon: "Cross", color: "#7B5EA7", label: "Prayer" },
  other: { icon: "CalendarDays", color: T.warmGray, label: "Event" },
};

const FILTERS = ["all", "mass", "sacrament", "education", "social", "prayer", "other"];

function formatDate(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  return {
    weekday: d.toLocaleDateString("en-US", { weekday: "long" }),
    month: d.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
    day: d.getDate(),
    year: d.getFullYear(),
    full: d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
  };
}

function isUpcoming(dateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(dateStr + "T00:00:00") >= today;
}

export default function Events() {
  const { t } = useTranslation();
  const { data: events } = useEvents();
  const [filter, setFilter] = useState("all");

  const upcoming = events.filter((e) => isUpcoming(e.date));
  const past = events.filter((e) => !isUpcoming(e.date));

  const filtered = (list) => (filter === "all" ? list : list.filter((e) => e.category === filter));

  return (
    <div style={{ paddingTop: 76 }}>
      <Seo
        title="Church Events"
        description="Upcoming events at St. Dominic Catholic Church — Masses, sacraments, education, and community gatherings in Youngstown, Ohio."
        image={PHOTOS.homeHero}
      />
      <PageHeader title={t("events.title")} />
      <PremiumPageActions
        overlap
        eyebrow={t("events.sub")}
        title={t("events.upcomingTitle")}
        items={[
          {
            title: t("events.upcomingTitle"),
            description: t("events.noneFound"),
            href: "#events-list",
            icon: "CalendarDays",
            primary: true,
          },
          {
            title: t("nav.bulletin"),
            description: t("bulletin.hero.desc"),
            to: "/bulletin",
            icon: "Newspaper",
          },
          {
            title: t("home.essentials.contact"),
            description: CONFIG.phone,
            href: CONFIG.phoneLink,
            icon: "Phone",
          },
        ]}
      />

      <style>{`
        .event-card {
          background: #fff;
          border: 1px solid ${T.stone};
          border-radius: 10px;
          display: flex;
          gap: 0;
          overflow: hidden;
          transition: box-shadow 0.3s ease, transform 0.3s ease;
        }
        .event-card:hover {
          box-shadow: 0 8px 32px rgba(0,0,0,0.09);
          transform: translateY(-3px);
        }
        .filter-btn {
          padding: 7px 16px;
          border-radius: 6px;
          border: 1px solid ${T.stone};
          background: #fff;
          font-size: 12px;
          letter-spacing: 0.2px;
          font-family: var(--font-body);
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          color: ${T.warmGray};
        }
        .filter-btn:hover { border-color: ${T.burgundy}; color: ${T.burgundy}; }
        .filter-btn.active { background: ${T.burgundy}; border-color: ${T.burgundy}; color: #fff; }
      `}</style>

      {/* Filter bar */}
      <Section id="events-list">
        <SectionTitle sub={t("events.sub")}>{t("events.upcomingTitle")}</SectionTitle>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            justifyContent: "center",
            marginBottom: 40,
          }}
        >
          {FILTERS.map((f) => (
            <button
              key={f}
              className={`filter-btn${filter === f ? " active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f === "all" ? t("events.filterAll") : (CATEGORY_META[f]?.label ?? f)}
            </button>
          ))}
        </div>

        {/* Upcoming events */}
        {filtered(upcoming).length === 0 ? (
          <div style={{ textAlign: "center", padding: "48px 24px", color: T.warmGray }}>
            <Icon name="CalendarDays" size={48} color={T.stone} />
            <p style={{ marginTop: 16, fontSize: 16 }}>{t("events.noneFound")}</p>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
              maxWidth: 860,
              margin: "0 auto",
            }}
          >
            {filtered(upcoming).map((evt) => {
              const d = formatDate(evt.date);
              const meta = CATEGORY_META[evt.category] ?? CATEGORY_META.other;
              return (
                <div key={evt.id || evt.date + evt.title} className="event-card">
                  {/* Date block */}
                  <div
                    style={{
                      minWidth: 80,
                      background: `linear-gradient(160deg, ${T.burgundyDark}, ${T.burgundy})`,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "16px 12px",
                      color: "#fff",
                      textAlign: "center",
                      flexShrink: 0,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 11,
                        letterSpacing: 0.5,
                        fontWeight: 700,
                        color: T.goldText,
                        fontVariantCaps: "all-small-caps",
                      }}
                    >
                      {d.month}
                    </div>
                    <div
                      style={{
                        fontSize: 36,
                        fontFamily: "var(--font-display)",
                        fontWeight: 700,
                        lineHeight: 1,
                        color: "#fff",
                      }}
                    >
                      {d.day}
                    </div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", marginTop: 2 }}>
                      {d.year}
                    </div>
                  </div>

                  {/* Content */}
                  <div style={{ padding: "20px 24px", flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                      <span className="chip chip--dynamic" style={{ "--chip-color": meta.color }}>
                        <Icon name={meta.icon} size={12} color={meta.color} />
                        {meta.label}
                      </span>
                      {evt.weekday && (
                        <span style={{ fontSize: 12, color: T.warmGray }}>{d.weekday}</span>
                      )}
                    </div>
                    <h3
                      style={{
                        fontSize: 19,
                        fontFamily: "var(--font-display)",
                        fontWeight: 600,
                        color: T.softBlack,
                        marginBottom: 6,
                      }}
                    >
                      {evt.title}
                    </h3>
                    {evt.description && (
                      <p
                        style={{
                          fontSize: 14,
                          color: T.warmGray,
                          lineHeight: 1.7,
                          marginBottom: 8,
                        }}
                      >
                        {evt.description}
                      </p>
                    )}
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 16,
                        fontSize: 13,
                        color: T.warmGray,
                      }}
                    >
                      {evt.time && (
                        <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                          <Icon name="Clock" size={13} color={T.warmGray} />
                          {evt.time}
                        </span>
                      )}
                      {evt.location && (
                        <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                          <Icon name="MapPin" size={13} color={T.warmGray} />
                          {evt.location}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Section>

      {/* Past events */}
      {filtered(past).length > 0 && (
        <Section bg={T.cream}>
          <SectionTitle sub={t("events.pastSub")}>{t("events.pastTitle")}</SectionTitle>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
              maxWidth: 860,
              margin: "0 auto",
            }}
          >
            {filtered(past).map((evt) => {
              const d = formatDate(evt.date);
              const meta = CATEGORY_META[evt.category] ?? CATEGORY_META.other;
              return (
                <div
                  key={evt.id || evt.date + evt.title}
                  style={{
                    background: "#fff",
                    border: `1px solid ${T.stone}`,
                    borderRadius: "var(--radius-card)",
                    padding: "16px 20px",
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    opacity: 0.7,
                  }}
                >
                  <div style={{ fontSize: 13, color: T.warmGray, minWidth: 100 }}>{d.full}</div>
                  <div style={{ flex: 1 }}>
                    <span
                      style={{
                        fontSize: 15,
                        fontFamily: "var(--font-display)",
                        fontWeight: 600,
                        color: T.softBlack,
                      }}
                    >
                      {evt.title}
                    </span>
                    {evt.time && (
                      <span style={{ fontSize: 13, color: T.warmGray, marginLeft: 12 }}>
                        {evt.time}
                      </span>
                    )}
                  </div>
                  <span
                    style={{
                      fontSize: 11,
                      letterSpacing: 0.5,
                      fontVariantCaps: "all-small-caps",
                      fontWeight: 600,
                      color: meta.color,
                    }}
                  >
                    {meta.label}
                  </span>
                </div>
              );
            })}
          </div>
        </Section>
      )}
    </div>
  );
}
