import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { T } from "../../constants/theme";
import { CONFIG } from "../../constants/config";
import { PHOTOS } from "../../constants/photos";
import { Section, SectionTitle } from "../../components/Section";
import Btn from "../../components/Btn";
import LinkBtn from "../../components/LinkBtn";
import PhotoBackdrop from "../../components/PhotoBackdrop";
import Seo from "../../components/Seo";
import DominicanDivider from "../../components/DominicanDivider";
import { NextSteps, PastoralActionPanel } from "../../components/PastoralActionPanel";
import Icon from "../../components/Icon";
import BackToSacraments from "../../components/BackToSacraments";

export default function Funerals() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div style={{ paddingTop: 76 }}>
      <Seo
        title="Catholic Funerals"
        description="Catholic funeral services at St. Dominic Church. Vigil, Funeral Mass, and Rite of Committal information."
        image={PHOTOS.funeralCommittal}
      />
      {/* The graveside opens out of the header; then darkness falls behind
          the opening text, drawing in on the book of the rite */}
      <PhotoBackdrop
        title={t("sacraments.funerals.title")}
        src={PHOTOS.funeralCommittal}
        alt={t("sacraments.funerals.photoAlt")}
        subject={[0.66, 0.24]}
        subjectAt={0.45}
        zoom={[1, 1.6]}
        tone="dark"
      >
        <Section bg="transparent" style={{ padding: "clamp(32px, 6vw, 52px) 24px" }}>
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

        <Section bg="transparent">
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
      </PhotoBackdrop>

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
          {/* The funeral directives lead: a big black button, bold white letters */}
          <LinkBtn href={`${import.meta.env.BASE_URL}docs/funeral-directives.pdf`} variant="dark" size="lg">
            <Icon name="FileText" size={22} color="#fff" />
            {t("sacraments.funerals.directives")}
          </LinkBtn>
          <div style={{ marginTop: 20 }}>
            <Btn onClick={() => navigate("/contact")}>{t("sacraments.contactUs")}</Btn>
          </div>
          <p style={{ fontSize: 14, color: T.warmGray, marginTop: 16 }}>
            <a href={CONFIG.phoneLink} className="contact-link" style={{ color: T.burgundy }}>
              {CONFIG.phone}
            </a>
          </p>
          <BackToSacraments />
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
