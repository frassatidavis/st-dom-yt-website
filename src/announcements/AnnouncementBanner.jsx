import { useState } from "react";
import { T } from "../constants/theme";
import { useVisibleAnnouncement } from "./useAnnouncements";
import { X, Megaphone } from "lucide-react";

/**
 * Thin announcement banner strip — renders below the Nav.
 * Shows the highest-priority active banner, or nothing.
 */
export default function AnnouncementBanner() {
  const banner = useVisibleAnnouncement("banner");
  const [dismissed, setDismissed] = useState(false);

  if (!banner || dismissed) return null;

  const hasLink = !!banner.linkUrl;

  const Wrapper = hasLink ? "a" : "div";
  const wrapperProps = hasLink
    ? { href: banner.linkUrl, target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <Wrapper
      {...wrapperProps}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        background: T.burgundy,
        color: "#fff",
        padding: "8px 48px 8px 16px",
        fontSize: 13,
        fontFamily: "var(--font-body)",
        fontWeight: 500,
        textAlign: "center",
        textDecoration: "none",
        position: "relative",
        lineHeight: 1.4,
      }}
      role="alert"
    >
      <Megaphone size={14} style={{ flexShrink: 0, opacity: 0.8 }} />

      <span>
        <strong style={{ marginRight: 6 }}>{banner.title}</strong>
        {banner.body && (
          <span style={{ opacity: 0.9 }}>
            {banner.body}
            {hasLink && (
              <span
                style={{
                  marginLeft: 8,
                  textDecoration: "underline",
                  fontWeight: 600,
                  color: T.goldLight,
                }}
              >
                {banner.linkText || "Learn More"}
              </span>
            )}
          </span>
        )}
      </span>

      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDismissed(true);
        }}
        aria-label="Dismiss announcement"
        style={{
          position: "absolute",
          right: 12,
          top: "50%",
          transform: "translateY(-50%)",
          background: "none",
          border: "none",
          color: "rgba(255,255,255,0.6)",
          cursor: "pointer",
          padding: 4,
          display: "flex",
          alignItems: "center",
        }}
      >
        <X size={14} />
      </button>
    </Wrapper>
  );
}
