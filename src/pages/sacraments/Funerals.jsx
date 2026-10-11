import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { T } from "../../constants/theme";
import { CONFIG } from "../../constants/config";
import { PHOTOS } from "../../constants/photos";
import { Section, SectionTitle } from "../../components/Section";
import Btn from "../../components/Btn";
import PageHeader from "../../components/PageHeader";
import Seo from "../../components/Seo";
import DominicanDivider from "../../components/DominicanDivider";
import { NextSteps, PastoralActionPanel } from "../../components/PastoralActionPanel";
import SacramentPageActions from "../../components/SacramentPageActions";
import Icon from "../../components/Icon";

export default function Funerals() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div style={{ paddingTop: 76 }}>
      <Seo
        title="Catholic Funerals"
        description="Catholic funeral services at St. Dominic Church. Vigil, Funeral Mass, and Rite of Committal information."
        image={PHOTOS.stockFunerals}
      />
      <PageHeader title={t("sacraments.funerals.title")} heroSrc={PHOTOS.stockFunerals} tall />
      <SacramentPageActions sacramentKey="funerals" icon="Heart" />

      <Section bg={T.cream} style={{ padding: "clamp(32px, 6vw, 52px) 24px" }}>
        <PastoralActionPanel
          urgent
          eyebrow={t("sacraments.funerals.urgentSub")}
          title={t("sacraments.funerals.urgentTitle")}
          description={t("sacraments.funerals.urgentDesc")}
          primaryLabel={t("sacraments.funerals.callOffice")}
          primaryHref={CONFIG.phoneLink}
          secondaryLabel={t("sacraments.funerals.contact")}
          secondaryTo="/contact"
        />
      </Section>

      <Section bg={T.warmWhite}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <SectionTitle sub={t("sacraments.funerals.sub")}>
            {t("sacraments.funerals.heading")}
          </SectionTitle>
          <div style={{ fontSize: 16, color: T.warmGray, lineHeight: 2 }}>
            <p style={{ marginBottom: 20 }}>{t("sacraments.funerals.p1")}</p>
            <p style={{ marginBottom: 20 }}>{t("sacraments.funerals.p2")}</p>
          </div>
        </div>
      </Section>

      <Section bg={T.cream}>
        <SectionTitle sub={t("sacraments.funerals.ritesSub")}>
          {t("sacraments.funerals.ritesTitle")}
        </SectionTitle>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 24,
          }}
        >
          {["rite1", "rite2", "rite3"].map((key) => (
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
                {t(`sacraments.funerals.${key}.title`)}
              </h3>
              <p style={{ fontSize: 14, color: T.warmGray, lineHeight: 1.7 }}>
                {t(`sacraments.funerals.${key}.desc`)}
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
            {t("sacraments.funerals.cta")}
          </h3>
          <p style={{ fontSize: 15, color: T.warmGray, marginBottom: 24, lineHeight: 1.7 }}>
            {t("sacraments.funerals.ctaDesc")}
          </p>
          <Btn onClick={() => navigate("/contact")}>{t("sacraments.contactUs")}</Btn>
          <p style={{ fontSize: 14, color: T.warmGray, marginTop: 16 }}>
            <a href={CONFIG.phoneLink} className="contact-link" style={{ color: T.burgundy }}>
              {CONFIG.phone}
            </a>
          </p>
          <p style={{ fontSize: 14, marginTop: 12 }}>
            <a
              href={`${import.meta.env.BASE_URL}docs/funeral-directives.pdf`}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-link"
              style={{
                color: T.burgundy,
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <Icon name="FileText" size={16} color={T.burgundy} />
              {t("sacraments.funerals.directives")}
            </a>
          </p>
        </div>
      </Section>

      <NextSteps
        eyebrow={t("sacraments.funerals.nextSub")}
        title={t("sacraments.funerals.nextTitle")}
        items={[
          {
            icon: "HeartPulse",
            title: t("sacraments.funerals.next.anointing.title"),
            description: t("sacraments.funerals.next.anointing.desc"),
            to: "/sacraments/anointing",
          },
          {
            icon: "Church",
            title: t("sacraments.funerals.next.mass.title"),
            description: t("sacraments.funerals.next.mass.desc"),
            to: "/mass-times",
          },
          {
            icon: "Phone",
            title: t("sacraments.funerals.next.contact.title"),
            description: t("sacraments.funerals.next.contact.desc"),
            to: "/contact",
          },
        ]}
      />
    </div>
  );
}
