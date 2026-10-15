import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { T } from "../constants/theme";
import { CONFIG } from "../constants/config";
import { PHOTOS } from "../constants/photos";
import { isClassic } from "../classic";
import { Section, SectionTitle } from "../components/Section";
import Btn from "../components/Btn";
import ParallaxSection from "../components/ParallaxSection";
import ScaleReveal from "../components/ScaleReveal";
import { useSchedule } from "../cms/hooks";
import { getTodayScheduleSummary } from "../utils/schedule";
import Seo from "../components/Seo";
import PageHeader from "../components/PageHeader";
import { buildMassTimesSchema } from "../utils/seoSchema";
import { ChevronDown } from "lucide-react";
import PullQuote from "../components/PullQuote";

/* ── Schedule Card ── */
function ScheduleCard({ title, rows, accent = T.burgundy, t }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "var(--radius-card)",
        overflow: "hidden",
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
      }}
    >
      <div style={{ height: 4, background: accent }} />
      <div style={{ padding: 28 }}>
        <h3
          style={{
            fontSize: 20,
            fontFamily: "var(--font-display)",
            marginBottom: 16,
            color: T.softBlack,
          }}
        >
          {title}
        </h3>
        {rows.map(([dayKey, time], i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "10px 0",
              borderBottom: i < rows.length - 1 ? `1px solid ${T.stone}` : "none",
              fontSize: 15,
            }}
          >
            <span style={{ color: T.charcoal }}>{t(`schedule.${dayKey}`)}</span>
            <span className="u-onum" style={{ fontWeight: 600, color: T.softBlack }}>
              {time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Blockquote ── */
function Quote({ text, src }) {
  return <PullQuote variant="margin" text={text} src={src} />;
}

/* ── Accordion Item ── */
function AccordionItem({ title, items, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "var(--radius-card)",
        overflow: "hidden",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        marginBottom: 12,
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          padding: "18px 24px",
          fontSize: 18,
          fontWeight: 600,
          fontFamily: "var(--font-display)",
          color: T.burgundy,
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          borderBottom: open ? `1px solid ${T.stone}` : "none",
        }}
      >
        {title}
        <ChevronDown
          size={20}
          style={{
            transition: "transform 0.3s ease",
            transform: open ? "rotate(180deg)" : "rotate(0)",
            color: T.goldText,
            flexShrink: 0,
          }}
        />
      </button>
      <div
        style={{
          maxHeight: open ? 600 : 0,
          overflow: "hidden",
          transition: "max-height 0.4s ease",
        }}
      >
        <ul
          style={{
            padding: "16px 24px 20px 44px",
            margin: 0,
            listStyleType: "disc",
          }}
        >
          {items.map((item, i) => (
            <li
              key={i}
              style={{
                fontSize: 15,
                lineHeight: 1.8,
                color: T.charcoal,
                fontFamily: "var(--font-body)",
                paddingBottom: 4,
              }}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ── Confession Step ── */
function ConfessionStep({ number, text }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 16,
        alignItems: "flex-start",
        marginBottom: 16,
      }}
    >
      <div
        style={{
          minWidth: 32,
          height: 32,
          borderRadius: "50%",
          background: T.gold,
          color: T.softBlack,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 700,
          fontSize: 14,
          fontFamily: "var(--font-body)",
          flexShrink: 0,
        }}
      >
        {number}
      </div>
      <p
        style={{
          fontSize: 15,
          lineHeight: 1.7,
          color: T.charcoal,
          margin: 0,
          fontFamily: "var(--font-body)",
        }}
      >
        {text}
      </p>
    </div>
  );
}

export default function MassTimes() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: schedule } = useSchedule();
  const { sundayMass, dailyMass, confession, adoration } = schedule;

  const examineItems = useCallback(
    (key) => {
      const items = t(`massTimes.examine.${key}.items`, { returnObjects: true });
      return Array.isArray(items) ? items : [];
    },
    [t]
  );

  const holyDays = t("massTimes.holyDays.days", { returnObjects: true });
  const todaySummary = getTodayScheduleSummary(schedule);

  return (
    <div>
      <Seo
        title={t("massTimes.title")}
        description="Sunday and daily Mass schedule, Confession times, Examination of Conscience, and Eucharistic Adoration at St. Dominic Church, Youngstown OH."
        image={PHOTOS.homeHero}
        schema={buildMassTimesSchema(schedule, CONFIG.siteUrl)}
      />

      {/* ════ Section 1: Schedule-forward opener — today's Masses in the header ════ */}
      <div style={{ paddingTop: 76 }}>
        <PageHeader
          variant="text"
          title={t("massTimes.title")}
          aside={
            todaySummary.masses ? (
              <>
                <strong>{t("home.essentials.today")}</strong>
                <br />
                <span className="u-onum">{todaySummary.masses}</span>
              </>
            ) : undefined
          }
        />
      </div>

      {/* ════ Section 2: Mass Schedule ════ */}
      <Section>
        <SectionTitle>
          {t("massTimes.mass.title")}
        </SectionTitle>
        <Quote text={t("massTimes.mass.quote")} src={t("massTimes.mass.quoteSrc")} />
        {/* Classic Mode: no introduction under the quote */}
        {!isClassic() && (
          <p
            style={{
              fontSize: 16,
              lineHeight: 1.8,
              color: T.warmGray,
              textAlign: "center",
              maxWidth: 700,
              margin: "0 auto 40px",
              fontFamily: "var(--font-body)",
            }}
          >
            {t("massTimes.mass.desc")}
          </p>
        )}
        <p
          style={{
            fontSize: 13,
            color: T.warmGray,
            textAlign: "center",
            maxWidth: 680,
            margin: isClassic() ? "0 auto 36px" : "-24px auto 36px",
            fontFamily: "var(--font-body)",
          }}
        >
          {t("massTimes.reviewed")}
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 28,
          }}
        >
          <ScheduleCard
            title={t("massTimes.mass.sundayTitle")}
            rows={sundayMass}
            accent={T.burgundy}
            t={t}
          />
          <ScheduleCard
            title={t("massTimes.mass.dailyTitle")}
            rows={dailyMass}
            accent={T.burgundy}
            t={t}
          />
        </div>
      </Section>

      {/* ════ Section 3: Parallax — St. Thomas Aquinas ════ */}
      <ParallaxSection image={PHOTOS.dominicanCharism} overlay={0.55}>
        <div style={{ textAlign: "center", maxWidth: 700, margin: "0 auto" }}>
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(22px, 3.5vw, 32px)",
              fontStyle: "italic",
              color: "#fff",
              lineHeight: 1.5,
              marginBottom: 16,
            }}
          >
            {t("massTimes.parallax1.quote")}
          </p>
          <span
            style={{
              fontSize: 14,
              letterSpacing: 0.5,
              fontVariantCaps: "all-small-caps",
              color: T.goldLight,
            }}
          >
            {t("massTimes.parallax1.src")}
          </span>
        </div>
      </ParallaxSection>

      {/* ════ Section 4: Confession ════ */}
      <Section id="confession" bg={T.cream}>
        <SectionTitle>
          {t("massTimes.confession.title")}
        </SectionTitle>
        <p
          style={{
            fontSize: 16,
            lineHeight: 1.8,
            color: T.warmGray,
            textAlign: "center",
            maxWidth: 700,
            margin: "0 auto 40px",
            fontFamily: "var(--font-body)",
          }}
        >
          {t("massTimes.confession.desc")}
        </p>

        {/* Confession schedule card */}
        <div style={{ maxWidth: 480, margin: "0 auto 48px" }}>
          <ScheduleCard
            title={t("massTimes.confession.title")}
            rows={confession}
            accent={T.gold}
            t={t}
          />
        </div>

        {/* How to Go to Confession */}
        <div
          style={{
            maxWidth: 640,
            margin: "0 auto",
            background: "#fff",
            borderRadius: "var(--radius-card)",
            padding: "36px 32px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          }}
        >
          <h3
            style={{
              fontSize: 22,
              fontFamily: "var(--font-display)",
              color: T.softBlack,
              marginBottom: 8,
              textAlign: "center",
            }}
          >
            {t("massTimes.confession.howToTitle")}
          </h3>
          <p
            style={{
              fontSize: 14,
              color: T.warmGray,
              textAlign: "center",
              marginBottom: 28,
              fontFamily: "var(--font-body)",
            }}
          >
            {t("massTimes.confession.howToDesc")}
          </p>
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <ConfessionStep key={n} number={n} text={t(`massTimes.confession.step${n}`)} />
          ))}

          <div
            style={{
              marginTop: 24,
              paddingTop: 24,
              borderTop: `1px solid ${T.stone}`,
            }}
          >
            <h4
              style={{
                fontSize: 13,
                fontFamily: "var(--font-body)",
                fontWeight: 700,
                letterSpacing: 0.5,
                fontVariantCaps: "all-small-caps",
                color: T.goldText,
                marginBottom: 10,
                textAlign: "center",
              }}
            >
              {t("massTimes.confession.actTitle")}
            </h4>
            <p
              style={{
                fontSize: 17,
                lineHeight: 1.8,
                color: T.charcoal,
                fontStyle: "italic",
                fontFamily: "var(--font-display)",
                textAlign: "center",
                margin: 0,
              }}
            >
              {t("massTimes.confession.actText")}
            </p>
          </div>
        </div>
      </Section>

      {/* ════ Section 5: Examination of Conscience ════ */}
      <Section>
        <SectionTitle>
          {t("massTimes.examine.title")}
        </SectionTitle>
        <p
          style={{
            fontSize: 16,
            lineHeight: 1.8,
            color: T.warmGray,
            textAlign: "center",
            maxWidth: 700,
            margin: "0 auto 36px",
            fontFamily: "var(--font-body)",
          }}
        >
          {t("massTimes.examine.desc")}
        </p>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          {[
            "c1",
            "c2",
            "c3",
            "c4",
            "c5",
            "c6",
            "c7",
            "c8",
            "c9",
            "c10",
            "loveNeighbor",
            "precepts",
          ].map((key, i) => (
            <AccordionItem
              key={key}
              title={t(`massTimes.examine.${key}.title`)}
              items={examineItems(key)}
              defaultOpen={i === 0}
            />
          ))}
          <p
            style={{
              fontSize: 12,
              color: T.warmGray,
              textAlign: "center",
              marginTop: 20,
              fontStyle: "italic",
              fontFamily: "var(--font-body)",
            }}
          >
            {t("massTimes.examine.source")}
          </p>
        </div>
      </Section>

      {/* ════ Section 6: Parallax — Pope Francis ════ */}
      <ParallaxSection image={PHOTOS.archSideAisle} overlay={0.55}>
        <div style={{ textAlign: "center", maxWidth: 700, margin: "0 auto" }}>
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(22px, 3.5vw, 32px)",
              fontStyle: "italic",
              color: "#fff",
              lineHeight: 1.5,
              marginBottom: 16,
            }}
          >
            {t("massTimes.parallax2.quote")}
          </p>
          <span
            style={{
              fontSize: 14,
              letterSpacing: 0.5,
              fontVariantCaps: "all-small-caps",
              color: T.goldLight,
            }}
          >
            {t("massTimes.parallax2.src")}
          </span>
        </div>
      </ParallaxSection>

      {/* ════ Section 7: Adoration & Devotions ════ */}
      <Section bg={T.cream}>
        <SectionTitle>
          {t("massTimes.adoration.title")}
        </SectionTitle>
        {/* Classic Mode: no introduction under the title */}
        {!isClassic() && (
          <p
            style={{
              fontSize: 16,
              lineHeight: 1.8,
              color: T.warmGray,
              textAlign: "center",
              maxWidth: 700,
              margin: "0 auto 40px",
              fontFamily: "var(--font-body)",
            }}
          >
            {t("massTimes.adoration.desc")}
          </p>
        )}

        {/* Monstrance ScaleReveal */}
        <ScaleReveal
          src={PHOTOS.monstrance}
          alt="Gold monstrance with the Blessed Sacrament exposed for Eucharistic Adoration"
          maxWidth={900}
        />

        {/* Adoration schedule + devotions */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 28,
            marginTop: 40,
          }}
        >
          <ScheduleCard
            title={t("massTimes.adoration.title")}
            rows={adoration}
            accent={T.gold}
            t={t}
          />
          <div
            style={{
              background: "#fff",
              borderRadius: "var(--radius-card)",
              overflow: "hidden",
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            }}
          >
            <div style={{ height: 4, background: T.burgundy }} />
            <div style={{ padding: 28 }}>
              <h3
                style={{
                  fontSize: 20,
                  fontFamily: "var(--font-display)",
                  marginBottom: 16,
                  color: T.softBlack,
                }}
              >
                {t("massTimes.adoration.devotions")}
              </h3>
              {["rosary", "divineMercy"].map((key, i) => (
                <div
                  key={key}
                  style={{
                    padding: "10px 0",
                    borderBottom: i < 1 ? `1px solid ${T.stone}` : "none",
                    fontSize: 15,
                    color: T.charcoal,
                  }}
                >
                  {t(`massTimes.adoration.${key}`)}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ════ Section 8: Holy Days of Obligation ════ */}
      <Section>
        <SectionTitle>
          {t("massTimes.holyDays.title")}
        </SectionTitle>
        <p
          style={{
            fontSize: 16,
            lineHeight: 1.8,
            color: T.warmGray,
            textAlign: "center",
            maxWidth: 700,
            margin: "0 auto 12px",
            fontFamily: "var(--font-body)",
          }}
        >
          {t("massTimes.holyDays.desc")}
        </p>
        <p
          style={{
            fontSize: 15,
            fontWeight: 600,
            color: T.burgundy,
            textAlign: "center",
            marginBottom: 32,
            fontFamily: "var(--font-body)",
          }}
        >
          {t("massTimes.holyDays.schedule")}
        </p>
        <div
          style={{
            maxWidth: 560,
            margin: "0 auto",
            background: "#fff",
            borderRadius: "var(--radius-card)",
            overflow: "hidden",
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          }}
        >
          <div style={{ height: 4, background: T.gold }} />
          <div style={{ padding: "24px 32px" }}>
            {Array.isArray(holyDays) &&
              holyDays.map((day, i) => (
                <div
                  key={i}
                  style={{
                    padding: "12px 0",
                    borderBottom: i < holyDays.length - 1 ? `1px solid ${T.stone}` : "none",
                    fontSize: 15,
                    color: T.charcoal,
                    fontFamily: "var(--font-body)",
                  }}
                >
                  {day}
                </div>
              ))}
          </div>
        </div>
      </Section>

      {/* ════ Section 9: Closing CTA ════ */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          background: `linear-gradient(135deg, ${T.burgundyDark}, ${T.burgundy})`,
          padding: "clamp(48px, 10vw, 80px) 24px",
          textAlign: "center",
        }}
      >
        <div style={{ position: "relative", zIndex: 1, maxWidth: 700, margin: "0 auto" }}>
          <SectionTitle light divider={false}>
            {t("massTimes.cta.title")}
          </SectionTitle>
          <p
            style={{
              fontSize: 17,
              lineHeight: 1.8,
              color: "rgba(255,255,255,0.8)",
              marginBottom: 32,
            }}
          >
            {t("massTimes.cta.desc")}
          </p>
          <div
            style={{
              display: "flex",
              gap: 16,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Btn variant="gold" onClick={() => navigate("/visit")}>
              {t("massTimes.cta.visit")}
            </Btn>
            <Btn variant="light" onClick={() => navigate("/contact")}>
              {t("massTimes.cta.contact")}
            </Btn>
          </div>
        </div>
      </section>
    </div>
  );
}
