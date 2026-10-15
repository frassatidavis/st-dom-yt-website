import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { T } from "../../constants/theme";
import { CONFIG } from "../../constants/config";
import { PHOTOS } from "../../constants/photos";
import { Section, SectionTitle } from "../../components/Section";
import Btn from "../../components/Btn";
import LinkBtn from "../../components/LinkBtn";
import PhotoBackdrop from "../../components/PhotoBackdrop";
import { isClassic } from "../../classic";
import Seo from "../../components/Seo";
import DominicanDivider from "../../components/DominicanDivider";
import PullQuote from "../../components/PullQuote";
import Icon from "../../components/Icon";
import BackToSacraments from "../../components/BackToSacraments";

export default function Marriage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div style={{ paddingTop: 76 }}>
      <Seo
        title="Holy Matrimony"
        description="Planning a Catholic wedding at St. Dominic Church? Learn about marriage preparation, requirements, and scheduling."
        image={PHOTOS.marriageWide}
      />
      {/* The wide shot of the aisle opens out of the header and settles behind
          the opening text, slowly zooming in on the couple */}
      <PhotoBackdrop
        title={t("sacraments.marriage.title")}
        src={PHOTOS.marriageWide}
        alt={t("sacraments.marriage.photoAlt")}
        subject={[0.47, 0.34]}
        subjectAt={0.4}
        zoom={[1, 1.5]}
        position={isClassic() ? "50% 20%" : "50% 35%"}
        classicBig
      >
        <Section bg="transparent">
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <SectionTitle sub={t("sacraments.marriage.sub")}>
              {t("sacraments.marriage.heading")}
            </SectionTitle>
            <div style={{ fontSize: 16, color: T.warmGray, lineHeight: 2 }}>
              <p style={{ marginBottom: 20 }}>{t("sacraments.marriage.p1")}</p>
              <p style={{ marginBottom: 20 }}>{t("sacraments.marriage.p2")}</p>
            </div>
          </div>
        </Section>
      </PhotoBackdrop>

      <Section bg={T.cream}>
        <SectionTitle sub={t("sacraments.marriage.stepsSub")}>
          {t("sacraments.marriage.stepsTitle")}
        </SectionTitle>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 24,
          }}
        >
          {["step1", "step2", "step3"].map((key) => (
            <div
              key={key}
              style={{
                background: T.warmWhite,
                padding: 28,
                borderRadius: 4,
                border: `1px solid ${T.stone}`,
                borderTop: `4px solid ${T.gold}`,
              }}
            >
              <h3 style={{ fontSize: 18, color: T.burgundy, marginBottom: 8 }}>
                {t(`sacraments.marriage.${key}.title`)}
              </h3>
              <p style={{ fontSize: 14, color: T.warmGray, lineHeight: 1.7 }}>
                {t(`sacraments.marriage.${key}.desc`)}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section bg={T.warmWhite}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <SectionTitle sub={t("sacraments.marriage.convalidationSub")}>
            {t("sacraments.marriage.convalidationTitle")}
          </SectionTitle>
          <p style={{ fontSize: 16, color: T.warmGray, lineHeight: 2, marginBottom: 28 }}>
            {t("sacraments.marriage.convalidationDesc")}
          </p>
          <div style={{ textAlign: "center", marginBottom: 12 }}>
            <Btn onClick={() => navigate("/contact")}>
              {t("sacraments.marriage.convalidationCta")}
            </Btn>
          </div>
          <PullQuote text={t("sacraments.marriage.ccc")} src={t("sacraments.marriage.cccSrc")} />
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
            {t("sacraments.marriage.cta")}
          </h3>
          <p style={{ fontSize: 15, color: T.warmGray, marginBottom: 24, lineHeight: 1.7 }}>
            {t("sacraments.marriage.ctaDesc")}
          </p>
          {/* The wedding guidelines lead: a large gold button */}
          <LinkBtn href={`${import.meta.env.BASE_URL}docs/wedding-guidelines.pdf`} variant="gold" size="lg">
            <Icon name="FileText" size={22} color={T.softBlack} />
            {t("sacraments.marriage.guidelines")}
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
    </div>
  );
}
