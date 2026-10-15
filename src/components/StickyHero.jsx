import { useEffect, useRef, useState, useCallback } from "react";
import { T } from "../constants/theme";
import ResponsivePicture from "./ResponsivePicture";
import HeroIntroVideo from "./HeroIntroVideo";
import useScrollVar from "../hooks/useScrollVar";
import { reducedMotionQuery } from "../classic";

/**
 * StickyHero — Apple-style hero that stays pinned while content scrolls.
 *
 * The hero text fades out and the background subtly zooms as the user scrolls
 * past the section. The next section then scrolls over the hero naturally.
 *
 * Props:
 *   image     — background image URL
 *   introVideo — optional { src, poster, skipLabel, replayLabel }: plays
 *               once over the image, then dissolves into it
 *   overlay   — dark overlay opacity (default 0.5)
 *   tint      — optional CSS color tint
 *   scrim     — "flat" (default) | "corner": directional gradient that holds
 *               the bottom-left corner (where the text sits) and lets the
 *               rest of the photograph read
 *   align     — "center" (default) | "bottom-left"
 *   fillHeight — content spans the hero's full height (a flex column), so
 *               children can place items anywhere over the picture
 *   popOnScroll — for a hero without scroll runway (height equal to its
 *               viewport height): as it scrolls away, the picture drifts
 *               slower than the page and zooms toward the viewer
 *   height    — total scroll runway (default "180vh")
 *   imagePosition — which part of the photo to keep in view ("x% y%")
 *   showScrollHint — whether to show the small scroll cue
 *   children  — hero content (title, subtitle, etc.)
 */
export default function StickyHero({
  image,
  imagePosition = "50% 50%",
  introVideo,
  overlay = 0.5,
  tint,
  scrim = "flat",
  align = "center",
  fillHeight = false,
  popOnScroll = false,
  height = "130vh",
  viewportHeight = "100vh",
  showScrollHint = true,
  children,
}) {
  const wrapperRef = useRef(null);
  const stickyRef = useRef(null); // receives the intro's --intro-progress
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [introActive, setIntroActive] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  // --hero-exit drives the picture's drift and zoom in CSS (.hero-pop)
  useScrollVar(wrapperRef, { name: "--hero-exit", mode: "exit", enabled: popOnScroll });

  useEffect(() => {
    const mq = reducedMotionQuery();
    setReducedMotion(mq.matches);
    const handler = (e) => setReducedMotion(e.matches);
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, []);

  const handleScroll = useCallback(() => {
    if (reducedMotion) return;
    const el = wrapperRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const h = el.offsetHeight;
    const scrollRange = h - window.innerHeight;
    if (scrollRange <= 0) {
      setProgress(0);
      return;
    }
    const p = Math.min(1, Math.max(0, -rect.top / scrollRange));
    setProgress(p);
  }, [reducedMotion]);

  useEffect(() => {
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Derived values (static when reduced motion is on)
  const textOpacity = reducedMotion ? 1 : Math.max(0, 1 - progress * 2.5);
  const textY = reducedMotion ? 0 : progress * -40;
  const bgScale = reducedMotion ? 1 : 1 + progress * 0.1;
  const bgVisible = loaded || introActive;

  return (
    <div ref={wrapperRef} style={{ height, position: "relative" }}>
      <div
        style={{
          position: "sticky",
          top: 0,
          height: viewportHeight,
          overflow: "hidden",
          display: "flex",
          alignItems: align === "bottom-left" ? "flex-end" : "center",
          justifyContent: "center",
        }}
        ref={stickyRef}
        className={popOnScroll ? "hero-pop" : undefined}
      >
        {/* Background with zoom */}
        {image && (
          <div
            aria-hidden="true"
            className={popOnScroll ? "hero-pop-layer" : undefined}
            style={{
              position: "absolute",
              inset: 0,
              overflow: "hidden",
              transform: popOnScroll ? undefined : reducedMotion ? "none" : `scale(${bgScale})`,
              opacity: loaded ? 1 : 0,
              transition: loaded ? "none" : "opacity 0.8s ease",
              willChange: "transform",
            }}
          >
            <ResponsivePicture
              src={image}
              widths={[480, 1024, 1920]}
              sizes="100vw"
              alt=""
              loading="eager"
              fetchPriority="high"
              onLoad={() => setLoaded(true)}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: imagePosition,
                display: "block",
              }}
            />
          </div>
        )}

        {/* Intro video over the photo; dissolves into it when it ends */}
        {introVideo && (
          <HeroIntroVideo
            src={introVideo.src}
            poster={introVideo.poster}
            skipLabel={introVideo.skipLabel}
            replayLabel={introVideo.replayLabel}
            transform={popOnScroll ? undefined : reducedMotion ? "none" : `scale(${bgScale})`}
            onActiveChange={setIntroActive}
            progressTarget={stickyRef}
          />
        )}

        {/* Overlay */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background:
              scrim === "corner"
                ? `linear-gradient(to top right, rgba(20, 12, 13, 0.82) 0%, rgba(20, 12, 13, 0.46) 32%, rgba(20, 12, 13, 0.16) 58%, rgba(20, 12, 13, 0) 80%), rgba(0, 0, 0, ${overlay})`
                : tint
                  ? `linear-gradient(160deg, ${tint}, rgba(0,0,0,${overlay}))`
                  : `rgba(0,0,0,${overlay})`,
            opacity: bgVisible ? 1 : 0,
            transition: bgVisible ? "none" : "opacity 0.8s ease",
          }}
        />

        {/* Content with fade-out + lift */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            textAlign: align === "bottom-left" ? "left" : "center",
            width: align === "bottom-left" ? "min(1140px, 100%)" : undefined,
            padding:
              align === "bottom-left"
                ? "0 24px clamp(40px, 7vh, 76px)"
                : "0 24px",
            ...(fillHeight && { alignSelf: "stretch", display: "flex", flexDirection: "column" }),
            opacity: textOpacity,
            transform: `translateY(${textY}px)`,
            willChange: "transform, opacity",
          }}
        >
          {children}
        </div>

        {/* Scroll indicator */}
        {showScrollHint && progress < 0.2 && (
          <div
            aria-hidden="true"
            className="scroll-hint"
            style={{
              position: "absolute",
              bottom: 32,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 1,
              opacity: 1 - progress * 5,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 6,
            }}
          >
            <div
              style={{
                fontSize: 11,
                letterSpacing: 0.5,
                fontVariantCaps: "all-small-caps",
                color: "rgba(255,255,255,0.5)",
                fontWeight: 500,
              }}
            >
              Scroll
            </div>
            <div
              style={{
                width: 1,
                height: 28,
                background: "linear-gradient(rgba(255,255,255,0.5), transparent)",
                animation: "scrollPulse 2s ease infinite",
              }}
            />
            <style>{`@keyframes scrollPulse { 0%,100% { opacity: 0.4; } 50% { opacity: 1; } }`}</style>
          </div>
        )}

        {/* Bottom gradient for seamless transition */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 120,
            background: `linear-gradient(transparent, ${T.warmWhite})`,
            opacity: progress > 0.3 ? Math.min(1, (progress - 0.3) * 3) : 0,
          }}
        />
      </div>
    </div>
  );
}
