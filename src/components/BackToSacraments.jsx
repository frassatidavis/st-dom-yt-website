import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { T } from "../constants/theme";

/** "← All the Sacraments": the closing link on each sacrament page. */
export default function BackToSacraments() {
  const { t } = useTranslation();
  return (
    <p style={{ marginTop: 28, textAlign: "center" }}>
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
  );
}
