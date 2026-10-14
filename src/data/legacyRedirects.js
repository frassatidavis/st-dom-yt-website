/**
 * Old eCatholic (saintdominic.org) URLs → their closest page on this site.
 *
 * Search results, Facebook posts, printed bulletins and bookmarks still point
 * at these paths. Used in two places:
 *  - scripts/generate-seo.mjs writes a tiny redirect page at each path so
 *    GitHub Pages answers 200 + meta-refresh instead of a 404.
 *  - src/App.jsx registers a client-side <Navigate> for each one as a backstop.
 *
 * Paths that already exist on the new site (/staff, /faith-formation,
 * /events) are intentionally absent.
 */
export const LEGACY_REDIRECTS = {
  // About
  "/about-us": "/about",
  "/contact-us": "/contact",
  "/architectural-description-of-the-church": "/architecture",
  "/dominican-order": "/dominican-friars",
  "/domincan-saints": "/dominican-friars",
  "/join": "/register",

  // Giving
  "/donate-1": "/give",
  "/httpsstdominicchurchflocknotecomgive": "/give",
  "/light-a-candle": "/give",

  // Liturgy & sacraments
  "/liturgy-sacraments": "/sacraments",
  "/baptism": "/sacraments/baptism",
  "/baptism-registration-form": "/sacraments/baptism",
  "/first-communion": "/sacraments/first-communion",
  "/reconciliation": "/mass-times",
  "/confirmation": "/sacraments/confirmation",
  "/eucharist": "/sacraments",
  "/marriage": "/sacraments/marriage",
  "/sacrament-of-the-sick": "/sacraments/anointing",
  "/holy-orders": "/sacraments",
  "/divine-office": "/mass-times",
  "/funeral-planning": "/sacraments/funerals",

  // Faith formation
  "/ccd": "/faith-formation",
  "/child-registration": "/faith-formation",
  "/ocia": "/becoming-catholic",
  "/rica": "/becoming-catholic",
  "/a-guide-to-helping-someone-encounter-jesus": "/becoming-catholic",
  "/resources-1": "/faith-formation",
  "/resources-for-lent-1": "/faith-formation",
  "/family": "/faith-formation",
  "/vocation": "/faith-formation",
  "/catholic-doctrine-and-teaching": "/faith-formation",
  "/spiritual-life": "/faith-formation",
  "/prayer": "/faith-formation",
  "/pro-life": "/faith-formation",
  "/sacred-scripture": "/faith-formation",
  "/philosophy-theology": "/faith-formation",
  "/diocese-of-youngstown": "/faith-formation",
  "/word-on-fire": "/faith-formation",

  // Ministries
  "/ministries": "/get-involved",
  "/cmf": "/get-involved",
  "/parish-library": "/get-involved",
  "/volunteer": "/get-involved",
  "/altar-servers": "/get-involved",
  "/frassati": "/get-involved",
  "/lay-dominican": "/get-involved",
  "/parish-and-family-life": "/get-involved",
  "/serra-international": "/get-involved",
  "/31-club": "/get-involved",
  "/queen-of-peace-prayer-cenacle": "/get-involved",

  // Devotions & shrines
  "/devotions": "/mass-times",
  "/st-jude": "/architecture",
  "/blessed-mother-shrine": "/architecture",
  "/st-anthony-of-padua": "/architecture",
  "/the-divine-infant-of-prague": "/architecture",
  "/st-anne": "/architecture",
  "/the-sacred-heart-of-jesus": "/architecture",
  "/john-paul-ii": "/architecture",
  "/st-joseph": "/architecture",
  "/the-holy-family": "/architecture",
  "/st-martin-de-porres": "/architecture",
  "/bl-imelda-lambertini": "/architecture",
  "/st-dominic-shrine": "/architecture",
  "/st-margaret-of-castello": "/architecture",

  // News, bulletins, calendar, photos
  "/blog": "/",
  "/bulletins": "/bulletin",
  "/calendar": "/events",
  "/news": "/",
  "/photoalbums": "/gallery",
};

/**
 * Whole sections of the old site whose individual pages (dated events, news
 * posts, photo albums) have no one-to-one match. Every child path goes to
 * the section's new home.
 */
export const LEGACY_PREFIX_REDIRECTS = {
  "/events": "/events",
  "/news": "/",
  "/blog": "/",
  "/photoalbums": "/gallery",
};

/**
 * Individual child pages from the old sitemap. Listed so the build can write
 * a static redirect page for each (GitHub Pages can't do wildcard redirects).
 */
export const LEGACY_CHILD_PATHS = [
  "/events/catholic-mens-fellowship-12",
  "/events/sacrament-of-confession",
  "/events/confession",
  "/events/confession-1",
  "/events/sunday-mass-8-00am-10-30am-1-00pm-spanish",
  "/events/rosary",
  "/events/rosary-1",
  "/events/rosary-4",
  "/events/rosary-5",
  "/events/rosary-6",
  "/events/adoration",
  "/events/evening-prayer-compline",
  "/events/vigil-mass",
  "/events/mass-1",
  "/events/mass-2",
  "/events/mass-3",
  "/events/mass-4",
  "/events/mass-5",
  "/events/mass-6",
  "/events/mass-7",
  "/events/mass-8",
  "/events/mass-9",
  "/events/mass-10",
  "/events/mass-11",
  "/events/mass-12",
  "/events/mass-15",
  "/events/mass-6-2",
  "/events/mass-6-3",
  "/events/mass-7-2",
  "/events/mass-7-3",
  "/events/mass-spanish-2",
  "/events/mens-group",
  "/events/mens-group-1",
  "/events/mens-group-2",
  "/events/library-open",
  "/events/library-open-1",
  "/events/knights-of-columbus",
  "/events/dominican-lay-fraternity",
  "/events/christmas-eve-vigil-1",
  "/events/mass-of-the-lords-supper-1",
  "/events/reposition-of-blessed-sacrament",
  "/events/office-of-readings-morning-prayer",
  "/events/office-of-readings-morning-prayer-2",
  "/events/confessions-confesiones",
  "/events/stations-of-the-cross",
  "/events/solemn-celebration-of-the-lords-passion",
  "/events/viacrucis-en-vivo",
  "/events/liturgia-de-la-passion-del-senor",
  "/events/blessing-of-easter-food-baskets-1",
  "/events/easter-vigil-vigilia-pascual",
  "/news/altar-servers-training-and-pizza-party",
  "/news/soup-group-featured-in-the-vindicator",
  "/news/new-bible-study-at-st-dominic-church",
  "/news/lenten-parish-mission",
  "/news/rcia-at-st-dominic",
  "/news/st-dominic-statue",
  "/blog/altar-servers-training-and-pizza-party",
  "/blog/soup-group-featured-in-the-vindicator",
  "/blog/new-bible-study-at-st-dominic-church",
  "/blog/lenten-parish-mission",
  "/blog/rcia-at-st-dominic",
  "/blog/st-dominic-statue",
  "/photoalbums/st-dominic-church",
  "/photoalbums/confirmation-2022",
  "/photoalbums/st-dominic-church-ccd",
  "/photoalbums/altar-servers-party",
  "/photoalbums/shrines",
  "/photoalbums/first-communion",
];

/** Resolve an old child path (e.g. /events/rosary-4) to its section's new home. */
export function legacyTargetFor(path) {
  if (LEGACY_REDIRECTS[path]) return LEGACY_REDIRECTS[path];
  const prefix = Object.keys(LEGACY_PREFIX_REDIRECTS).find((p) => path.startsWith(p + "/"));
  return prefix ? LEGACY_PREFIX_REDIRECTS[prefix] : null;
}
