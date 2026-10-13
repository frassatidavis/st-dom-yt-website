import { useTranslation } from "react-i18next";
import { T } from "../../constants/theme";
import { CONFIG } from "../../constants/config";
import { PHOTOS } from "../../constants/photos";
import { Section, SectionTitle } from "../../components/Section";
import LinkBtn from "../../components/LinkBtn";
import PageHeader from "../../components/PageHeader";
import Seo from "../../components/Seo";
import DominicanDivider from "../../components/DominicanDivider";
import SacramentPageActions from "../../components/SacramentPageActions";

export default function Confirmation() {
  const { t } = useTranslation();

  return (
    <div style={{ paddingTop: 76 }}>
      <Seo
        title="Confirmation"
        description="Confirmation preparation at St. Dominic Church. Program details for teens and adults seeking the Sacrament of Confirmation."
        image={PHOTOS.stockConfirmation}
      />
      <PageHeader
        title={t("sacraments.confirmation.title")}
        heroSrc={PHOTOS.stockConfirmation}
        tall
      />
      <SacramentPageActions sacramentKey="confirmation" icon="Flame" />

      <Section bg={T.warmWhite}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <SectionTitle sub={t("sacraments.confirmation.sub")}>
            {t("sacraments.confirmation.heading")}
          </SectionTitle>
          <div style={{ fontSize: 16, color: T.warmGray, lineHeight: 2 }}>
            <p style={{ marginBottom: 20 }}>{t("sacraments.confirmation.p1")}</p>
            <p style={{ marginBottom: 20 }}>{t("sacraments.confirmation.p2")}</p>
          </div>
        </div>
      </Section>

      <Section bg={T.cream}>
        <SectionTitle sub={t("sacraments.confirmation.prepSub")}>
          {t("sacraments.confirmation.prepTitle")}
        </SectionTitle>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 24,
          }}
        >
          {["prep1", "prep2", "prep3"].map((key) => (
            <div
              key={key}
              style={{
                background: T.warmWhite,
                padding: 28,
                borderRadius: 4,
                border: `1px solid ${T.stone}`,
              }}
            >
              <h3 style={{ fontSize: 18, color: T.burgundy, marginBottom: 8 }}>
                {t(`sacraments.confirmation.${key}.title`)}
              </h3>
              <p style={{ fontSize: 14, color: T.warmGray, lineHeight: 1.7 }}>
                {t(`sacraments.confirmation.${key}.desc`)}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section bg={T.warmWhite}>
        <DominicanDivider style={{ marginBottom: 16 }} />
        <div style={{ textAlign: "center", maxWidth: 500, margin: "0 auto" }}>
          <h3
            style={{
              fontSize: 26,
              color: T.softBlack,
              marginBottom: 16,
              fontFamily: "var(--font-display)",
            }}
          >
            {t("sacraments.confirmation.cta")}
          </h3>
          <p style={{ fontSize: 15, color: T.warmGray, marginBottom: 24, lineHeight: 1.7 }}>
            {t("sacraments.confirmation.ctaDesc")}
          </p>
          {/* Enrollment is through the CCD form; questions go to the coordinator */}
          <LinkBtn href={CONFIG.ccdRegistrationUrl}>{t("sacraments.ccdRegistration")}</LinkBtn>
          <p style={{ fontSize: 14, color: T.warmGray, marginTop: 16 }}>
            {t("sacraments.ccdCoordinator")},{" "}
            <a href={`mailto:${CONFIG.religiousEdEmail}`} className="contact-link" style={{ color: T.burgundy }}>
              {CONFIG.religiousEdEmail}
            </a>
          </p>
        </div>
      </Section>
    </div>
  );
}
