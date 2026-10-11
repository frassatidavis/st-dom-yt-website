import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { T } from "../constants/theme";
import { CROSS_FLORY } from "../constants/crossPaths";
import { FEAST_DAYS, DOMINICAN_SAINTS } from "../data/saints";

/**
 * Return today's saint entry (bilingual fields intact). For dates without a
 * named feast we rotate through the Dominican fallback list.
 */
function getSaint(now) {
  const key = `${now.getMonth() + 1}/${now.getDate()}`;
  if (FEAST_DAYS[key]) return { ...FEAST_DAYS[key], isFeast: true };

  // Rotate through Dominican saints for uncovered days
  const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000);
  const fallback = DOMINICAN_SAINTS[dayOfYear % DOMINICAN_SAINTS.length];
  return { ...fallback, isFeast: false };
}

function pad2(n) {
  return n < 10 ? `0${n}` : `${n}`;
}

export default function SaintOfTheDay() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language?.startsWith("es") ? "es" : "en";
  const pick = (field) => field?.[lang] ?? field?.en ?? "";

  const { saint, dateStr, isoDate } = useMemo(() => {
    const now = new Date();
    const iso = `${now.getFullYear()}-${pad2(now.getMonth() + 1)}-${pad2(now.getDate())}`;
    const locale = lang === "es" ? "es-ES" : "en-US";
    return {
      saint: getSaint(now),
      dateStr: now.toLocaleDateString(locale, {
        weekday: "long",
        month: "long",
        day: "numeric",
      }),
      isoDate: iso,
    };
  }, [lang]);

  // Print treatment: warm-white panel, gold hairline frame, left-set type —
  // replaces the former dark radial-gradient glass card.
  return (
    <div
      style={{
        background: T.warmWhite,
        border: `1px solid ${T.gold}`,
        outline: `1px solid ${T.stoneLight}`,
        outlineOffset: 5,
        borderRadius: 2,
        padding: "clamp(30px, 5vw, 44px)",
        color: T.charcoal,
        position: "relative",
        overflow: "hidden",
        maxWidth: 680,
      }}
    >
      {/* Ornamental Dominican Cross Flory — quiet press ornament */}
      <svg
        aria-hidden="true"
        style={{ position: "absolute", right: -14, top: -14, opacity: 0.07, width: 200, height: 200 }}
        viewBox={CROSS_FLORY.viewBox}
        fill={T.burgundy}
      >
        <path d={CROSS_FLORY.d} />
      </svg>

      {/* Run-in label + date line */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          gap: 16,
          flexWrap: "wrap",
          marginBottom: 16,
        }}
      >
        <span className="kicker">{t("saintOfDay.label")}</span>
        <time dateTime={isoDate} className="u-smallcaps u-onum" style={{ color: T.warmGray, fontSize: 14 }}>
          {dateStr}
        </time>
      </div>

      {/* Saint name */}
      <h2
        style={{
          fontSize: "clamp(26px, 4vw, 36px)",
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          lineHeight: 1.15,
          color: T.softBlack,
          letterSpacing: "var(--tracking-display)",
          marginBottom: 6,
        }}
      >
        {pick(saint.name)}
      </h2>

      {/* Feast line — italic serif, not a badge */}
      <p
        style={{
          fontFamily: "var(--font-display)",
          fontStyle: "italic",
          fontSize: 18,
          color: T.goldText,
          marginBottom: 16,
        }}
      >
        {pick(saint.feast)}
      </p>

      {/* Description */}
      <p
        style={{
          fontSize: 16,
          lineHeight: 1.8,
          color: T.warmGray,
          maxWidth: "62ch",
        }}
      >
        {pick(saint.desc)}
      </p>
    </div>
  );
}
