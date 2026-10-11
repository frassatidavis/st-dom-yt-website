import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { T } from "../constants/theme";
import { useVisibleAnnouncement } from "./useAnnouncements";
import { dismissPopup } from "./store";
import { X, Bell } from "lucide-react";

/**
 * Modal popup overlay for high-priority announcements.
 * Shows on page load; dismissing stores the ID in sessionStorage
 * so it won't reappear until the next browser session.
 */
export default function AnnouncementPopup() {
  const popup = useVisibleAnnouncement("popup");
  const [visible, setVisible] = useState(false);

  // Fade-in after a short delay so it doesn't flash before the page paints
  useEffect(() => {
    if (popup) {
      const t = setTimeout(() => setVisible(true), 600);
      return () => clearTimeout(t);
    }
  }, [popup]);

  if (!popup || !visible) return null;

  const handleDismiss = () => {
    setVisible(false);
    dismissPopup(popup.id);
  };

  const hasLink = !!popup.linkUrl;

  return createPortal(
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(26, 23, 20, 0.55)",
        backdropFilter: "blur(4px)",
        animation: "annPopFadeIn 0.3s ease",
        padding: 24,
      }}
      onClick={handleDismiss}
      role="dialog"
      aria-modal="true"
      aria-label={popup.title}
    >
      <style>{`
        @keyframes annPopFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes annPopSlideUp {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          maxWidth: 460,
          width: "100%",
          background: "#fff",
          borderRadius: 16,
          padding: "40px 32px 32px",
          boxShadow: "0 24px 64px rgba(0,0,0,0.18)",
          animation: "annPopSlideUp 0.35s ease",
        }}
      >
        {/* Close button */}
        <button
          onClick={handleDismiss}
          aria-label="Close announcement"
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            background: "none",
            border: "none",
            color: T.warmGray,
            cursor: "pointer",
            padding: 4,
            display: "flex",
            borderRadius: "50%",
            transition: "background 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = T.stoneLight)}
          onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
        >
          <X size={20} />
        </button>

        {/* Icon */}
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            background: `${T.burgundy}12`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 16,
          }}
        >
          <Bell size={22} color={T.burgundy} />
        </div>

        {/* Title */}
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 26,
            fontWeight: 600,
            color: T.softBlack,
            margin: "0 0 8px",
            lineHeight: 1.25,
          }}
        >
          {popup.title}
        </h2>

        {/* Divider */}
        <div
          style={{
            width: 40,
            height: 2,
            background: T.gold,
            borderRadius: 1,
            marginBottom: 14,
          }}
        />

        {/* Body */}
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 15,
            lineHeight: 1.6,
            color: T.charcoal,
            margin: "0 0 20px",
          }}
        >
          {popup.body}
        </p>

        {/* Action buttons */}
        <div style={{ display: "flex", gap: 10 }}>
          {hasLink && (
            <a
              href={popup.linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "10px 24px",
                background: T.burgundy,
                color: "#fff",
                border: "none",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                fontFamily: "var(--font-body)",
                textDecoration: "none",
                cursor: "pointer",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = T.burgundyDark)}
              onMouseLeave={(e) => (e.currentTarget.style.background = T.burgundy)}
            >
              {popup.linkText || "Learn More"}
            </a>
          )}
          <button
            onClick={handleDismiss}
            style={{
              padding: "10px 24px",
              background: "none",
              color: T.warmGray,
              border: `1.5px solid ${T.stone}`,
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 500,
              fontFamily: "var(--font-body)",
              cursor: "pointer",
              transition: "border-color 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = T.warmGray)}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = T.stone)}
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
