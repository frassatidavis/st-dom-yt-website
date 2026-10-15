/**
 * Classic Mode — an optional look for the whole site inspired by the
 * parish's two key years, 1923 (founding) and 1954 (the church's
 * cornerstone): a period sans-serif, paper and ink colours, black-and-white
 * photos, and no motion. It is remembered per visitor (localStorage "mode")
 * and marked on <html> as .classic, which the stylesheet styles.
 *
 * While it is on, the site behaves as if the visitor asked for reduced
 * motion: every component that checks `reducedMotionQuery()` keeps still.
 * Switching reloads the page so everything starts afresh in the new look.
 */
const KEY = "mode";
// Antic: the closest free match to the parish's old sans-serif lettering
// (the owner's "The Meaney Building 1906" sample, early-1900s American gothic)
// Limelight: a 1930s Hollywood Art Deco serif (thick stems, hairline
// crossbars), like the old Columbia picture titles, for the page titles;
// Gilda Display, a lighter Deco serif, for the section titles
const FONTS = "https://fonts.googleapis.com/css2?family=Antic&family=Gilda+Display&family=Limelight&display=swap";

function read() {
  try {
    return localStorage.getItem(KEY) === "classic";
  } catch {
    return false;
  }
}

const classic = typeof window !== "undefined" && read();

export function isClassic() {
  return classic;
}

/** Puts the look in place (class on <html>, period fonts); call once at startup */
export function applyClassic() {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("classic", classic);
  if (classic && !document.getElementById("classic-fonts")) {
    const link = document.createElement("link");
    link.id = "classic-fonts";
    link.rel = "stylesheet";
    link.href = FONTS;
    document.head.appendChild(link);
  }
}

export function setClassic(on) {
  try {
    localStorage.setItem(KEY, on ? "classic" : "modern");
  } catch {
    /* storage unavailable: the switch lasts for this page only */
  }
  window.location.reload();
}

/**
 * Like matchMedia("(prefers-reduced-motion: reduce)"), but also "matches"
 * in Classic Mode.
 */
export function reducedMotionQuery() {
  const mq =
    typeof window !== "undefined" && window.matchMedia
      ? window.matchMedia("(prefers-reduced-motion: reduce)")
      : null;
  return {
    get matches() {
      return classic || !!mq?.matches;
    },
    addEventListener: (...a) => mq?.addEventListener?.(...a),
    removeEventListener: (...a) => mq?.removeEventListener?.(...a),
  };
}
