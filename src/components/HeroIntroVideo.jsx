import { useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";

/**
 * HeroIntroVideo — plays a short, silent intro over a hero's photo, then
 * dissolves into the photo underneath and removes itself. One small button
 * reads "Skip" until the intro is gone and "Replay" afterwards.
 *
 * Plays on its own once per page load: coming back to the page from elsewhere
 * on the site shows the photo straight away. It doesn't start on its own for
 * visitors who ask for reduced motion or data saving, on very slow
 * connections, or when the browser won't autoplay (for example iPhone Low
 * Power Mode); it gives way to the photo if it can't start within 8 s of the
 * page being visible or keeps stalling. Replay still plays it on request.
 *
 * Props:
 *   src         — MP4 (H.264) URL
 *   poster      — first frame, shown while the video loads
 *   skipLabel   — button text while the intro is on screen
 *   replayLabel — button text once it has gone
 *   transform   — CSS transform shared with the photo layer (scroll zoom)
 *   onActiveChange(active) — true while the video covers the photo
 */

const FADE_MS = 1500; // dissolve into the photo over the last 1.5 s
const SKIP_FADE_MS = 600;
const START_TIMEOUT_MS = 8000; // visible time allowed before playback starts
const STALL_LIMIT_MS = 3000; // total buffering allowed once it has started

let playedThisPageLoad = false;

function shouldAutoplay() {
  if (playedThisPageLoad || typeof window === "undefined") return false;
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return false;
  const connection = navigator.connection;
  if (connection?.saveData || /(^|-)2g$/.test(connection?.effectiveType || "")) return false;
  return true;
}

export default function HeroIntroVideo({ src, poster, skipLabel, replayLabel, transform, onActiveChange }) {
  const videoRef = useRef(null);
  // "playing" → "fading" → "done" (video removed); Replay goes back to "playing"
  const [phase, setPhase] = useState(() => (shouldAutoplay() ? "playing" : "done"));
  const [fadeMs, setFadeMs] = useState(FADE_MS);
  const phaseRef = useRef(phase); // changes only through fadeOut and replay
  const mounted = phase !== "done";

  const fadeOut = useCallback((ms) => {
    if (phaseRef.current !== "playing") return;
    phaseRef.current = "fading";
    setFadeMs(ms);
    setPhase("fading");
  }, []);

  const replay = () => {
    phaseRef.current = "playing";
    // Commit now so play() runs inside the tap: iPhones in Low Power Mode
    // only play video in direct response to one
    flushSync(() => {
      setFadeMs(FADE_MS);
      setPhase("playing");
    });
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.play()?.catch?.(() => {}); // the playback effect handles refusals
  };

  useEffect(() => {
    onActiveChange?.(mounted);
  }, [mounted, onActiveChange]);

  // Start playback and watch for the end, errors and stalls, for as long as
  // the video is mounted
  useEffect(() => {
    const v = videoRef.current;
    if (!mounted || !v) return undefined;

    // iOS only autoplays inline, muted video; set these on the element itself
    v.muted = true;
    v.defaultMuted = true;
    v.setAttribute("muted", "");
    v.setAttribute("playsinline", "");
    v.setAttribute("disablepictureinpicture", "");
    v.setAttribute("disableremoteplayback", "");

    let started = false;
    let giveUp = 0;
    let stallTimer = 0;
    let stalledSince = 0;
    let stalledTotal = 0;

    // Browsers hold back media in a tab that hasn't been shown yet, so the
    // start clock only runs while the page is visible
    const armGiveUp = () => {
      if (giveUp || started || document.visibilityState !== "visible") return;
      giveUp = window.setTimeout(() => {
        if (!started) fadeOut(SKIP_FADE_MS);
      }, START_TIMEOUT_MS);
    };
    const disarmGiveUp = () => {
      window.clearTimeout(giveUp);
      giveUp = 0;
    };

    const onPlaying = () => {
      started = true;
      disarmGiveUp();
      if (stalledSince) {
        stalledTotal += performance.now() - stalledSince;
        stalledSince = 0;
        window.clearTimeout(stallTimer);
      }
    };
    // Slow connections: show the photo rather than a video that keeps freezing
    const onWaiting = () => {
      if (!started || stalledSince) return;
      stalledSince = performance.now();
      stallTimer = window.setTimeout(() => fadeOut(SKIP_FADE_MS), Math.max(0, STALL_LIMIT_MS - stalledTotal));
    };
    const onTimeUpdate = () => {
      if (v.duration && v.duration - v.currentTime <= FADE_MS / 1000) fadeOut(FADE_MS);
    };
    const onEnded = () => fadeOut(SKIP_FADE_MS);
    const onError = () => fadeOut(SKIP_FADE_MS);
    const onVisibility = () => {
      if (phaseRef.current !== "playing") return;
      if (document.visibilityState !== "visible") {
        disarmGiveUp();
        return;
      }
      armGiveUp();
      // Phones can pause video while the tab is in the background; pick it back up
      if (started && v.paused && !v.ended) v.play()?.catch?.(() => fadeOut(SKIP_FADE_MS));
    };

    v.addEventListener("playing", onPlaying);
    v.addEventListener("waiting", onWaiting);
    v.addEventListener("timeupdate", onTimeUpdate);
    v.addEventListener("ended", onEnded);
    v.addEventListener("error", onError);
    document.addEventListener("visibilitychange", onVisibility);
    armGiveUp();

    // One automatic attempt per page load, whether or not it succeeds
    playedThisPageLoad = true;
    // Autoplay can be refused (Low Power Mode, browser settings): show the photo
    v.play()?.catch?.((err) => {
      if (err?.name !== "AbortError") fadeOut(SKIP_FADE_MS);
    });

    return () => {
      disarmGiveUp();
      window.clearTimeout(stallTimer);
      v.removeEventListener("playing", onPlaying);
      v.removeEventListener("waiting", onWaiting);
      v.removeEventListener("timeupdate", onTimeUpdate);
      v.removeEventListener("ended", onEnded);
      v.removeEventListener("error", onError);
      document.removeEventListener("visibilitychange", onVisibility);
      // Once the element has left the page, stop its download too
      if (!v.isConnected) {
        v.removeAttribute("src");
        v.load();
      }
    };
  }, [mounted, fadeOut]);

  // Once the dissolve finishes, remove the video
  useEffect(() => {
    if (phase !== "fading") return undefined;
    const t = window.setTimeout(() => setPhase("done"), fadeMs);
    return () => window.clearTimeout(t);
  }, [phase, fadeMs]);

  return (
    <>
      {mounted && (
        <div
          aria-hidden="true"
          className="hero-intro-video"
          style={{
            transform,
            opacity: phase === "playing" ? 1 : 0,
            transition: `opacity ${fadeMs}ms ease`,
          }}
        >
          <video ref={videoRef} src={src} poster={poster} muted playsInline preload="auto" tabIndex={-1} />
        </div>
      )}
      {/* One button that changes role, so keyboard focus stays put. It turns
          into Replay only once the video is gone, so a double tap on Skip
          can't restart the intro. */}
      <button type="button" className="hero-intro-control" onClick={mounted ? () => fadeOut(SKIP_FADE_MS) : replay}>
        {mounted ? skipLabel : replayLabel}
      </button>
    </>
  );
}
