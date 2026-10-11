import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { T } from "../constants/theme";
import Icon from "./Icon";

const SCRIPT_SRC = "https://www.vaticannews.va/widget.js";

/**
 * Embeds the Vatican News web-component widget.
 * Loads the external script once, swaps language reactively.
 */
export default function VaticanNews() {
  const containerRef = useRef(null);
  const { i18n, t } = useTranslation();
  const [enabled, setEnabled] = useState(false);
  const [failed, setFailed] = useState(false);
  const lang = i18n.language?.startsWith("es") ? "es" : "en";

  useEffect(() => {
    if (!enabled) return;
    const container = containerRef.current;
    if (!container) return;

    // Build the custom element via DOM API so attributes pass through cleanly
    container.innerHTML = "";
    const widget = document.createElement("vaticannews-widget");
    widget.setAttribute("lang", lang);
    widget.setAttribute("fontSize", "14");
    widget.setAttribute("carouselVideoAuto", "medium");
    container.appendChild(widget);

    // Load the script if not already present
    if (!document.querySelector(`script[src="${SCRIPT_SRC}"]`)) {
      const script = document.createElement("script");
      script.src = SCRIPT_SRC;
      script.async = true;
      script.onerror = () => setFailed(true);
      document.body.appendChild(script);
    }

    // If the custom element never upgrades (blocked script, outage), fall
    // back to a plain link rather than an empty region.
    const timeout = setTimeout(() => {
      if (!customElements.get("vaticannews-widget")) setFailed(true);
    }, 8000);
    return () => clearTimeout(timeout);
  }, [enabled, lang]);

  if (failed) {
    return (
      <p style={{ textAlign: "left", fontSize: 15, color: T.warmGray }}>
        {t("home.vatican.privacy")}{" "}
        <a
          href={`https://www.vaticannews.va/${lang}.html`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: T.burgundy, fontWeight: 600 }}
        >
          vaticannews.va →
        </a>
      </p>
    );
  }

  if (!enabled) {
    return (
      <div
        style={{
          maxWidth: 860,
          minHeight: 210,
          margin: "0 auto",
          padding: 32,
          border: `1px solid ${T.stone}`,
          borderRadius: "var(--radius-card)",
          background: "#fff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          textAlign: "center",
        }}
      >
        <Icon name="Globe" size={34} color={T.burgundy} />
        <p style={{ fontSize: 15, color: T.warmGray, lineHeight: 1.7, maxWidth: 440 }}>
          {t("home.vatican.privacy")}
        </p>
        <button
          type="button"
          onClick={() => setEnabled(true)}
          className="btn-hover"
          style={{
            background: T.burgundy,
            color: T.cream,
            border: "none",
            borderRadius: 4,
            padding: "12px 22px",
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: 0.5,
            textTransform: "uppercase",
            fontFamily: "var(--font-body)",
            cursor: "pointer",
          }}
        >
          {t("home.vatican.load")}
        </button>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      aria-live="polite"
      aria-label={t("home.vatican.loading")}
    />
  );
}
