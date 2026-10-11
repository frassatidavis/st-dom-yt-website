import { useTranslation } from "react-i18next";
import { T } from "../constants/theme";

export default function LanguageToggle() {
  const { i18n } = useTranslation();
  const isEs = i18n.language === "es";

  const switchTo = (lang) => {
    if (i18n.language === lang) return;
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
  };

  const pillBase = {
    border: "none",
    cursor: "pointer",
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: 0.8,
    fontFamily: "var(--font-body)",
    padding: "5px 10px",
    lineHeight: 1,
    transition: "background 0.2s, color 0.2s",
  };

  return (
    <div
      role="group"
      aria-label="Language selector"
      style={{
        display: "inline-flex",
        border: `1px solid ${T.stone}`,
        borderRadius: "var(--radius-control)",
        overflow: "hidden",
        height: 32,
      }}
    >
      <button
        onClick={() => switchTo("en")}
        aria-label="Switch to English"
        aria-pressed={!isEs}
        style={{
          ...pillBase,
          background: !isEs ? T.burgundy : "transparent",
          color: !isEs ? "#fff" : T.warmGray,
        }}
      >
        EN
      </button>
      <div
        aria-hidden="true"
        style={{ width: 1, background: T.stone, flexShrink: 0 }}
      />
      <button
        onClick={() => switchTo("es")}
        aria-label="Cambiar a Español"
        aria-pressed={isEs}
        style={{
          ...pillBase,
          background: isEs ? T.burgundy : "transparent",
          color: isEs ? "#fff" : T.warmGray,
        }}
      >
        ES
      </button>
    </div>
  );
}
