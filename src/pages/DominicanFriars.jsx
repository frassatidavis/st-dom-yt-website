import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { T } from "../constants/theme";
import { CONFIG } from "../constants/config";
import { PHOTOS } from "../constants/photos";
import { Section, SectionTitle } from "../components/Section";
import MuralReveal from "../components/MuralReveal";
import Seo from "../components/Seo";
import LinkBtn from "../components/LinkBtn";
import { Link } from "react-router-dom";
import { Mail, Phone } from "lucide-react";
import { useStaff } from "../cms/hooks";
import { isClassic } from "../classic";

// The figures in the mural: the centre of each face, in % of the picture
const SAINTS = [
  { id: "aquinas", x: 21.5, y: 37.5 },
  { id: "rose", x: 30, y: 34 },
  { id: "albert", x: 39.5, y: 33 },
  { id: "dominic", x: 30.5, y: 44 },
  { id: "mary", x: 48.5, y: 23.5 },
  { id: "hyacinth", x: 63.5, y: 32 },
  { id: "antoninus", x: 71.5, y: 32.5 },
  { id: "peter", x: 79, y: 33.5 },
  { id: "catherine", x: 66.5, y: 45.5 },
];

// Photos come in -480 variants (scripts/generate-webp.mjs); fall back to the original
const small = (photo) => (typeof photo === "string" ? photo.replace(/\.(webp|jpe?g)$/i, "-480.$1") : photo);

const buttonRow = { display: "flex", flexWrap: "wrap", gap: 12, marginTop: 32 };

/**
 * The Dominican Friars — a short introduction to the friars who serve the
 * parish (linked from the Home welcome): the Order, their history here, and
 * where to meet them or learn more.
 */
export default function DominicanFriars() {
  const { t } = useTranslation();
  const { data: staffData } = useStaff();
  // The parish's own priests: the pastor first, then the parochial vicar(s)
  const priests = staffData.friars
    .filter((f) => f.role === "pastor" || f.role === "associate")
    .sort((a, b) => (a.role === "pastor" ? -1 : b.role === "pastor" ? 1 : 0));
  const saints = useMemo(
    () => SAINTS.map((s) => ({
      ...s,
      name: t(`friars.saints.${s.id}.name`),
      bio: t(`friars.saints.${s.id}.bio`),
      glow: PHOTOS.muralGlow[s.id],
    })),
    [t]
  );

  return (
    <div style={{ paddingTop: 76 }}>
      <Seo
        title="The Dominican Friars"
        description="The Dominican Friars of the Province of St. Joseph have served St. Dominic Church on Youngstown's South Side since 1923."
        image={PHOTOS.saintsMural}
      />
      {/* The header opens into the whole mural as the page scrolls; the
          header crop keeps the saints' faces and halos in view */}
      <MuralReveal
        title={t("friars.title")}
        src={PHOTOS.saintsMural}
        alt={t("friars.mural.alt")}
        caption={t("friars.mural.caption")}
        position="50% 34%"
        spots={saints}
      />

      {/* Our own Dominicans: the parish priests and how to reach them */}
      <Section bg={T.cream}>
        <SectionTitle>{t("friars.priests.title")}</SectionTitle>
        <div className="premium-welcome" style={{ marginBottom: 32 }}>
          <p>{t("friars.priests.desc")}</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 }}>
          {priests.map((p) => (
            <div
              key={p.id}
              style={{
                background: T.warmWhite, border: `1px solid ${T.stone}`, borderTop: `4px solid ${T.burgundy}`,
                borderRadius: 4, padding: "32px 24px", textAlign: "center",
              }}
            >
              {p.photo && (
                <img
                  src={small(p.photo)}
                  onError={(e) => { if (e.currentTarget.src !== p.photo) e.currentTarget.src = p.photo; }}
                  alt={p.name}
                  loading="lazy"
                  style={{
                    width: 140, height: 140, borderRadius: "50%", objectFit: "cover", objectPosition: "top center",
                    border: `3px solid ${T.gold}`, display: "block", margin: "0 auto 18px",
                  }}
                />
              )}
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: 22, color: T.softBlack, marginBottom: 4 }}>{p.name}</h3>
              <div style={{ color: T.goldText, fontSize: 13, fontWeight: 700, letterSpacing: 0.6, textTransform: "uppercase" }}>
                {p.title?.trim() || t(`staff.roles.${p.role}`)}
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "12px 28px", marginTop: 28, fontSize: 15 }}>
          <a href={CONFIG.phoneLink} className="contact-link" style={{ color: T.burgundy, display: "inline-flex", alignItems: "center", gap: 8 }}>
            <Phone size={16} aria-hidden="true" /> {CONFIG.phone}
          </a>
          <a href={`mailto:${CONFIG.email}`} className="contact-link" style={{ color: T.burgundy, display: "inline-flex", alignItems: "center", gap: 8 }}>
            <Mail size={16} aria-hidden="true" /> {CONFIG.email}
          </a>
        </div>
        {/* Classic Mode: no Priests & Staff page to link to */}
        <p style={{ textAlign: "center", marginTop: 20, display: isClassic() ? "none" : undefined }}>
          <Link
            to="/staff"
            style={{ color: T.goldText, fontSize: 13, fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase", textDecoration: "none" }}
          >
            {t("friars.priests.all")} →
          </Link>
        </p>
      </Section>

      <Section bg={T.warmWhite} width="narrow">
        <SectionTitle>{t("friars.more.title")}</SectionTitle>
        <div className="premium-welcome">
          <p>{t("friars.more.desc")}</p>
        </div>
        <div style={buttonRow}>
          <LinkBtn href={CONFIG.provinceUrl}>{t("friars.more.province")}</LinkBtn>
          <LinkBtn href={CONFIG.dominicanMediaUrl} variant="gold">
            {t("home.formation.mediaOpen")}
          </LinkBtn>
        </div>
      </Section>
    </div>
  );
}
