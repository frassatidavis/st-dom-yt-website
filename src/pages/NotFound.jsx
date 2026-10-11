import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { T } from "../constants/theme";
import Seo from "../components/Seo";
import Btn from "../components/Btn";

export default function NotFound() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "70vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: T.cream,
        padding: 24,
      }}
    >
      <Seo title="Page Not Found" description="The page you're looking for doesn't exist." />
      <div style={{ textAlign: "center", maxWidth: 520 }}>
        <div
          style={{
            fontSize: "clamp(80px, 15vw, 140px)",
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            color: T.stone,
            lineHeight: 1,
            marginBottom: 8,
          }}
        >
          404
        </div>
        <h1
          style={{
            fontSize: "clamp(24px, 4vw, 32px)",
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            color: T.softBlack,
            marginBottom: 12,
          }}
        >
          {t("notFound.title")}
        </h1>
        <p
          style={{
            fontSize: 16,
            color: T.warmGray,
            lineHeight: 1.7,
            marginBottom: 32,
          }}
        >
          {t("notFound.desc")}
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Btn onClick={() => navigate("/")}>{t("notFound.home")}</Btn>
          <Btn onClick={() => navigate("/mass-times")} variant="outline">
            {t("notFound.massTimes")}
          </Btn>
        </div>
      </div>
    </div>
  );
}
