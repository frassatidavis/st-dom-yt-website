import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { T } from "../../constants/theme";
import { CONFIG } from "../../constants/config";
import { PHOTOS } from "../../constants/photos";
import { Section, SectionTitle } from "../../components/Section";
import Btn from "../../components/Btn";
import PhotoBackdrop from "../../components/PhotoBackdrop";
import Seo from "../../components/Seo";
import PullQuote from "../../components/PullQuote";
import { NextSteps, PastoralActionPanel } from "../../components/PastoralActionPanel";
import BackToSacraments from "../../components/BackToSacraments";

export default function Anointing() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div style={{ paddingTop: 76 }}>
      <Seo
        title="Anointing of the Sick"
        description="The Sacrament of Anointing of the Sick at St. Dominic Church. For those who are seriously ill or facing surgery."
        image={PHOTOS.stockAnointing}
      />
      {/* The nave opens out of the header; then darkness closes in and falls,
          the altar drawing nearer, behind the opening text */}
      <PhotoBackdrop
        title={t("sacraments.anointing.title")}
        src={PHOTOS.stockAnointing}
        alt=""
        subject={[0.5, 0.66]}
        subjectAt={0.5}
        zoom={[1, 1.6]}
        tone="dark"
      >
        <Section bg="transparent" style={{ padding: "clamp(32px, 6vw, 52px) 24px" }}>
          <PastoralActionPanel
            urgent
            emphasis="eyebrow"
            eyebrow={t("sacraments.anointing.emergencyTitle")}
            title={CONFIG.emergencyPhone}
            description={t("sacraments.anointing.emergencyDesc")}
            primaryLabel={t("sacraments.anointing.callNow")}
            primaryHref={CONFIG.emergencyPhoneLink}
            secondaryLabel={t("sacraments.anointing.office")}
            secondaryTo="/contact"
          />
        </Section>

        <Section bg="transparent">
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <SectionTitle sub={t("sacraments.anointing.sub")}>
              {t("sacraments.anointing.heading")}
            </SectionTitle>
            <PullQuote
              variant="margin"
              text={t("sacraments.anointing.quote")}
              src={t("sacraments.anointing.quoteSrc")}
            />
            <div style={{ fontSize: 16, color: T.warmGray, lineHeight: 2 }}>
              <p style={{ marginBottom: 20 }}>{t("sacraments.anointing.p1")}</p>
              <p style={{ marginBottom: 20 }}>{t("sacraments.anointing.p2")}</p>
            </div>
          </div>
        </Section>
      </PhotoBackdrop>

      <Section bg={T.cream}>
        <div
          style={{
            background: T.warmWhite,
            borderRadius: 4,
            padding: 36,
            border: `1px solid ${T.stone}`,
            maxWidth: 600,
            margin: "0 auto",
          }}
        >
          <h3
            style={{
              fontSize: 22,
              color: T.burgundy,
              marginBottom: 16,
              fontFamily: "var(--font-display)",
              textAlign: "center",
            }}
          >
            {t("sacraments.anointing.whenTitle")}
          </h3>
          <ul style={{ fontSize: 15, color: T.warmGray, lineHeight: 2, paddingLeft: 24 }}>
            <li>{t("sacraments.anointing.when1")}</li>
            <li>{t("sacraments.anointing.when2")}</li>
            <li>{t("sacraments.anointing.when3")}</li>
            <li>{t("sacraments.anointing.when4")}</li>
          </ul>
        </div>
      </Section>

      <Section bg={T.warmWhite}>
        <PastoralActionPanel
          eyebrow={t("sacraments.anointing.sub")}
          title={t("sacraments.anointing.routineTitle")}
          description={t("sacraments.anointing.routineDesc")}
          primaryLabel={t("sacraments.anointing.office")}
          primaryTo="/contact"
          secondaryLabel={CONFIG.phone}
          secondaryHref={CONFIG.phoneLink}
        />
      </Section>

      <Section bg={T.cream}>
        <div style={{ textAlign: "center", maxWidth: 500, margin: "0 auto" }}>
          <p style={{ fontSize: 15, color: T.warmGray, marginBottom: 24, lineHeight: 1.7 }}>
            {t("sacraments.anointing.ctaDesc")}
          </p>
          <Btn onClick={() => navigate("/contact")}>{t("sacraments.contactUs")}</Btn>
          <BackToSacraments />
        </div>
      </Section>

      <NextSteps
        eyebrow={t("sacraments.anointing.nextSub")}
        title={t("sacraments.anointing.nextTitle")}
        items={[
          {
            icon: "Church",
            title: t("sacraments.anointing.next.mass.title"),
            description: t("sacraments.anointing.next.mass.desc"),
            to: "/mass-times",
          },
          {
            icon: "Heart",
            title: t("sacraments.anointing.next.funerals.title"),
            description: t("sacraments.anointing.next.funerals.desc"),
            to: "/sacraments/funerals",
          },
          {
            icon: "Phone",
            title: t("sacraments.anointing.next.contact.title"),
            description: t("sacraments.anointing.next.contact.desc"),
            to: "/contact",
          },
        ]}
      />
    </div>
  );
}
