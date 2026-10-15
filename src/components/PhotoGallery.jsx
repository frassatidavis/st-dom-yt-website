import { useState, useCallback, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { createPortal } from "react-dom";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { isClassic } from "../classic";
import { T } from "../constants/theme";

/**
 * PhotoGallery — masonry-style grid with lightbox modal.
 *
 * Props:
 *   photos: Array of { src, alt }  — alt is a translation key
 *
 * If photos is empty, renders a placeholder inviting photos to be added.
 */
export default function PhotoGallery({ photos = [] }) {
  const { t } = useTranslation();
  const [lightbox, setLightbox] = useState(null); // index or null

  const close = useCallback(() => setLightbox(null), []);
  const prev = useCallback(
    () => setLightbox((i) => (i > 0 ? i - 1 : photos.length - 1)),
    [photos.length]
  );
  const next = useCallback(
    () => setLightbox((i) => (i < photos.length - 1 ? i + 1 : 0)),
    [photos.length]
  );

  const lightboxRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    if (lightbox === null) return;

    // Focus the lightbox dialog for keyboard access
    lightboxRef.current?.focus();

    const onKey = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();

      // Trap focus within lightbox
      if (e.key === "Tab") {
        const focusable = lightboxRef.current?.querySelectorAll(
          'button, [href], [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable || focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      // Restore focus to the trigger element
      triggerRef.current?.focus();
    };
  }, [lightbox, close, prev, next]);

  if (photos.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "clamp(40px, 8vw, 64px) 24px",
          background: T.stoneLight,
          borderRadius: "var(--radius-card)",
          border: `2px dashed ${T.stone}`,
        }}
      >
        <div
          style={{
            fontSize: 48,
            color: T.stone,
            marginBottom: 16,
            fontFamily: "var(--font-display)",
          }}
        >
          ✦
        </div>
        <h3
          style={{
            fontSize: 22,
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            color: T.warmGray,
            marginBottom: 8,
          }}
        >
          {t("gallery.placeholder.title")}
        </h3>
        <p style={{ fontSize: 14, color: T.warmGray, lineHeight: 1.7, maxWidth: 400, margin: "0 auto" }}>
          {t("gallery.placeholder.desc")}
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Grid */}
      <style>{`
        .parish-gallery {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 16px;
        }
        .parish-gallery-item {
          position: relative;
          border-radius: 8px;
          overflow: hidden;
          cursor: pointer;
          aspect-ratio: 4 / 3;
          background: ${T.stone};
        }
        .parish-gallery-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }
        .parish-gallery-item:hover img {
          transform: scale(1.05);
        }
        .parish-gallery-item::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 50%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .parish-gallery-item:hover::after {
          opacity: 1;
        }
      `}</style>

      <div className="parish-gallery">
        {photos.map((photo, i) => (
          <div
            key={i}
            className="parish-gallery-item"
            onClick={(e) => { triggerRef.current = e.currentTarget; setLightbox(i); }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === "Enter") { triggerRef.current = e.currentTarget; setLightbox(i); } }}
            aria-label={t(photo.alt)}
          >
            <img src={photo.src} alt={t(photo.alt)} loading="lazy" />
          </div>
        ))}
      </div>

      {/* Lightbox Modal — on <body>, so no page section can box it in */}
      {lightbox !== null && createPortal(
        <div
          ref={lightboxRef}
          role="dialog"
          aria-modal="true"
          aria-label={t(photos[lightbox].alt)}
          tabIndex={-1}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 10000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,0.92)",
            animation: "galleryFadeIn 0.25s ease",
          }}
          onClick={close}
        >
          <style>{`
            @keyframes galleryFadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
          `}</style>

          {/* Close button */}
          <button
            onClick={close}
            aria-label="Close"
            style={{
              position: "absolute",
              top: 20,
              right: 20,
              background: "rgba(255,255,255,0.15)",
              border: "none",
              borderRadius: "50%",
              width: 44,
              height: 44,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              zIndex: 2,
            }}
          >
            {isClassic() ? <span className="classic-word-button" style={{ color: "#fff", fontSize: 11 }}>{t("classic.close")}</span> : <X size={22} color="#fff" />}
          </button>

          {/* Previous */}
          {photos.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              aria-label="Previous"
              style={{
                position: "absolute",
                left: 16,
                top: "50%",
                transform: "translateY(-50%)",
                background: "rgba(255,255,255,0.12)",
                border: "none",
                borderRadius: "50%",
                width: 48,
                height: 48,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                zIndex: 2,
              }}
            >
              {isClassic() ? <span style={{ color: "#fff", fontSize: 28, lineHeight: 1 }}>‹</span> : <ChevronLeft size={28} color="#fff" />}
            </button>
          )}

          {/* Next */}
          {photos.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              aria-label="Next"
              style={{
                position: "absolute",
                right: 16,
                top: "50%",
                transform: "translateY(-50%)",
                background: "rgba(255,255,255,0.12)",
                border: "none",
                borderRadius: "50%",
                width: 48,
                height: 48,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                zIndex: 2,
              }}
            >
              {isClassic() ? <span style={{ color: "#fff", fontSize: 28, lineHeight: 1 }}>›</span> : <ChevronRight size={28} color="#fff" />}
            </button>
          )}

          {/* Image + caption — stacked in a flex column so caption never overlaps */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              maxWidth: "90vw",
              maxHeight: "92vh",
              gap: 12,
            }}
          >
            <img
              src={photos[lightbox].src}
              alt={t(photos[lightbox].alt)}
              style={{
                maxWidth: "100%",
                maxHeight: "78vh",
                objectFit: "contain",
                borderRadius: "var(--radius-card)",
                boxShadow: "0 6px 30px rgba(0,0,0,0.4)",
                flexShrink: 1,
              }}
            />
            <div
              style={{
                textAlign: "center",
                color: "rgba(255,255,255,0.7)",
                fontSize: 13,
                letterSpacing: 1,
                width: "100%",
              }}
            >
              <div style={{ marginBottom: 4, color: "#fff", fontSize: 15, lineHeight: 1.5 }}>
                {t(photos[lightbox].alt)}
              </div>
              {photos.length > 1 && (
                <span>
                  {lightbox + 1} / {photos.length}
                </span>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
