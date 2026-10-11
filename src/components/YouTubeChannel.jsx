import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ExternalLink } from "lucide-react";
import { T } from "../constants/theme";
import { CONFIG } from "../constants/config";
import Icon from "./Icon";

/**
 * YouTubeChannel — responsive YouTube embed with channel link.
 * Shows a loading skeleton while the iframe loads, then fades in.
 */
export default function YouTubeChannel() {
  const { t } = useTranslation();
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  if (!CONFIG.youtubeEmbedUrl) return null;

  if (!enabled) {
    return (
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <div
          style={{
            minHeight: 280,
            borderRadius: "var(--radius-card)",
            border: `1px solid ${T.stone}`,
            background: T.softBlack,
            color: "#fff",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 14,
            padding: 32,
            textAlign: "center",
          }}
        >
          <Icon name="BookOpenText" size={38} color={T.goldLight} />
          <div style={{ fontSize: 15, color: "rgba(255,255,255,0.75)", maxWidth: 420, lineHeight: 1.7 }}>
            {t("youtube.privacy")}
          </div>
          <button
            type="button"
            onClick={() => setEnabled(true)}
            className="btn-hover"
            style={{
              marginTop: 4,
              background: T.gold,
              color: T.softBlack,
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
            {t("youtube.loadVideo")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 960, margin: "0 auto" }}>
      {/* Responsive 16:9 embed */}
      <div
        style={{
          borderRadius: "var(--radius-card)",
          overflow: "hidden",
          boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
          border: `1px solid ${T.stone}`,
          background: T.softBlack,
        }}
      >
        <div
          style={{
            position: "relative",
            paddingTop: "56.25%", /* 16:9 */
            width: "100%",
            height: 0,
          }}
        >
          {/* Loading skeleton */}
          {loading && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 16,
                background: T.softBlack,
                zIndex: 2,
              }}
            >
              <style>{`
                @keyframes ytPulse {
                  0%, 100% { opacity: 0.4; }
                  50% { opacity: 1; }
                }
              `}</style>
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    width: 0,
                    height: 0,
                    borderLeft: "18px solid rgba(255,255,255,0.3)",
                    borderTop: "11px solid transparent",
                    borderBottom: "11px solid transparent",
                    marginLeft: 4,
                  }}
                />
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: "rgba(255,255,255,0.5)",
                  letterSpacing: 1,
                  animation: "ytPulse 1.5s ease infinite",
                }}
              >
                {t("youtube.loading")}
              </div>
            </div>
          )}

          <iframe
            src={CONFIG.youtubeEmbedUrl}
            onLoad={() => setLoading(false)}
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              left: 0,
              top: 0,
              border: "none",
            }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={t("youtube.title")}
          />
        </div>
      </div>

      {/* Channel link */}
      <div style={{ textAlign: "center", marginTop: 16 }}>
        <a
          href={CONFIG.youtubeChannelUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            fontSize: 14,
            color: T.burgundy,
            fontWeight: 600,
            letterSpacing: 0.5,
            textDecoration: "none",
            transition: "opacity 0.2s ease",
          }}
        >
          <ExternalLink size={14} />
          {t("youtube.visitChannel")}
        </a>
      </div>
    </div>
  );
}
