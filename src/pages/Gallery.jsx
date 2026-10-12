import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { T } from "../constants/theme";
import { PHOTOS } from "../constants/photos";
import { Section, SectionTitle } from "../components/Section";
import Seo from "../components/Seo";
import HeroImage from "../components/HeroImage";
import PremiumPageActions from "../components/PremiumPageActions";
import { X } from "lucide-react";

export default function Gallery() {
  const { t } = useTranslation();
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const photos = PHOTOS.gallery;

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  // Close lightbox on Escape
  useEffect(() => {
    if (lightboxIndex === null) return;
    const handler = (e) => {
      if (e.key === "Escape") closeLightbox();
    };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [lightboxIndex, closeLightbox]);

  return (
    <div style={{ paddingTop: 76 }}>
      <Seo
        title="Photo Gallery"
        description="Browse photos of St. Dominic Catholic Church in Youngstown, Ohio — aerial views, interior architecture, sacred art, and liturgical celebrations."
        image={photos[0]?.src}
      />

      {/* ════ Hero Banner ════ */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          background: T.softBlack,
          color: "#fff",
          padding: "clamp(64px, 12vw, 120px) 24px clamp(48px, 8vw, 80px)",
          textAlign: "center",
        }}
      >
        <HeroImage src={PHOTOS.aboutArchitecture} overlay={0.55} tint="rgba(26,23,20,0.5)" />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div
            style={{
              fontSize: 12,
              letterSpacing: 0.5,
              fontVariantCaps: "all-small-caps",
              color: T.gold,
              marginBottom: 16,
              fontWeight: 600,
            }}
          >
            {t("gallery.sub")}
          </div>
          <h1
            style={{
              fontSize: "clamp(36px, 7vw, 60px)",
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              lineHeight: 1.1,
              color: "#fff",
            }}
          >
            {t("gallery.title")}
          </h1>
        </div>
      </section>

      <PremiumPageActions
        overlap
        eyebrow={t("gallery.sub")}
        title={t("gallery.title")}
        items={[
          {
            title: t("gallery.title"),
            description: t("gallery.nave"),
            href: "#photo-grid",
            icon: "Maximize",
            primary: true,
          },
          {
            title: t("nav.architecture"),
            description: t("arch.hero.desc"),
            to: "/architecture",
            icon: "Building",
          },
          {
            title: t("nav.visit"),
            description: t("visit.hero.desc"),
            to: "/visit",
            icon: "MapPin",
          },
        ]}
      />

      {/* ════ Photo Grid ════ */}
      <Section id="photo-grid" bg={T.warmWhite}>
        <SectionTitle sub={t("gallery.sub")}>{t("gallery.title")}</SectionTitle>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 20,
          }}
        >
          {photos.map((photo, i) => (
            <div
              key={photo.src}
              onClick={() => setLightboxIndex(i)}
              role="button"
              tabIndex={0}
              aria-label={t(photo.alt)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setLightboxIndex(i);
                }
              }}
              style={{
                borderRadius: "var(--radius-card)",
                overflow: "hidden",
                boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
                cursor: "pointer",
                position: "relative",
              }}
            >
              <img
                src={photo.src}
                alt={t(photo.alt)}
                loading="lazy"
                style={{
                  width: "100%",
                  height: 280,
                  objectFit: "cover",
                  display: "block",
                  transition: "transform 0.4s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              />
            </div>
          ))}
        </div>
      </Section>

      {/* ════ Lightbox Modal ════ */}
      {lightboxIndex !== null && (
        <div
          onClick={closeLightbox}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(0,0,0,0.9)",
            backdropFilter: "blur(8px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            animation: "galleryLightboxIn 0.25s ease",
          }}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            aria-label="Close lightbox"
            style={{
              position: "absolute",
              top: 20,
              right: 20,
              background: "rgba(255,255,255,0.1)",
              border: "none",
              borderRadius: "50%",
              width: 44,
              height: 44,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#fff",
              transition: "background 0.2s",
              zIndex: 1,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.2)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
          >
            <X size={24} />
          </button>

          {/* Image */}
          <img
            src={photos[lightboxIndex].src}
            alt={t(photos[lightboxIndex].alt)}
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "90vw",
              maxHeight: "85vh",
              objectFit: "contain",
              borderRadius: 4,
            }}
          />

          {/* Caption */}
          <p
            onClick={(e) => e.stopPropagation()}
            style={{
              color: "rgba(255,255,255,0.85)",
              fontSize: 15,
              fontFamily: "var(--font-body)",
              marginTop: 16,
              textAlign: "center",
              maxWidth: "80vw",
            }}
          >
            {t(photos[lightboxIndex].alt)}
          </p>
        </div>
      )}

      <style>{`
        @keyframes galleryLightboxIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
