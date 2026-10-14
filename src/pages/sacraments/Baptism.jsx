import { useTranslation } from "react-i18next";
import PullQuote from "../../components/PullQuote";
import { Link, useNavigate } from "react-router-dom";
import { T } from "../../constants/theme";
import { CONFIG } from "../../constants/config";
import { PHOTOS } from "../../constants/photos";
import { Section, SectionTitle } from "../../components/Section";
import Btn from "../../components/Btn";
import PhotoBackdrop from "../../components/PhotoBackdrop";
import Seo from "../../components/Seo";
import DominicanDivider from "../../components/DominicanDivider";

export default function Baptism() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div style={{ paddingTop: 76 }}>
      <Seo
        title="Baptism"
        description="Information about the Sacrament of Baptism at St. Dominic Church. Requirements, preparation, and how to schedule."
        image={PHOTOS.baptismFont}
      />
      {/* The photo opens out of the header and settles behind the opening
          text, slowly zooming in on the baby */}
      <PhotoBackdrop
        title={t("sacraments.baptism.title")}
        src={PHOTOS.baptismFont}
        alt={t("sacraments.baptism.photoAlt")}
        position="50% 40%"
        subject={[0.58, 0.64]}
      >
        <Section bg="transparent">
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <SectionTitle sub={t("sacraments.baptism.sub")}>
              {t("sacraments.baptism.heading")}
            </SectionTitle>
            <PullQuote variant="margin" text={t("sacraments.baptism.quote")} src={t("sacraments.baptism.quoteSrc")} />
            <div style={{ fontSize: 16, color: T.warmGray, lineHeight: 2 }}>
              <p style={{ marginBottom: 20 }}>{t("sacraments.baptism.p1")}</p>
              <p style={{ marginBottom: 20 }}>{t("sacraments.baptism.p2")}</p>
            </div>
          </div>
        </Section>
      </PhotoBackdrop>

      <Section bg={T.cream}>
        <SectionTitle sub={t("sacraments.baptism.reqSub")}>
          {t("sacraments.baptism.reqTitle")}
        </SectionTitle>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 24,
          }}
        >
          {["req1", "req2", "req3"].map((key) => (
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
                {t(`sacraments.baptism.${key}.title`)}
              </h3>
              <p style={{ fontSize: 14, color: T.warmGray, lineHeight: 1.7 }}>
                {t(`sacraments.baptism.${key}.desc`)}
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
            {t("sacraments.baptism.cta")}
          </h3>
          <p style={{ fontSize: 15, color: T.warmGray, marginBottom: 24, lineHeight: 1.7 }}>
            {t("sacraments.baptism.ctaDesc")}
          </p>
          <Btn onClick={() => navigate("/contact")}>{t("sacraments.contactUs")}</Btn>
          <p style={{ fontSize: 14, color: T.warmGray, marginTop: 16 }}>
            <a href={CONFIG.phoneLink} className="contact-link" style={{ color: T.burgundy }}>
              {CONFIG.phone}
            </a>
          </p>
          {/* Back to all the sacraments */}
          <p style={{ marginTop: 28 }}>
            <Link
              to="/sacraments"
              style={{
                color: T.goldText, fontSize: 13, fontWeight: 600, letterSpacing: 0.5,
                textTransform: "uppercase", textDecoration: "none",
              }}
            >
              ← {t("sacraments.allSacraments")}
            </Link>
          </p>
        </div>
      </Section>
    </div>
  );
}
