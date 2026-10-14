import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { T } from "../constants/theme";
import { CONFIG } from "../constants/config";
import { PHOTOS } from "../constants/photos";
import { Section, SectionTitle } from "../components/Section";
import MuralReveal from "../components/MuralReveal";
import Seo from "../components/Seo";
import LinkBtn from "../components/LinkBtn";

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

const buttonRow = { display: "flex", flexWrap: "wrap", gap: 12, marginTop: 32 };

/**
 * The Dominican Friars — a short introduction to the friars who serve the
 * parish (linked from the Home welcome): the Order, their history here, and
 * where to meet them or learn more.
 */
export default function DominicanFriars() {
  const { t } = useTranslation();
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
