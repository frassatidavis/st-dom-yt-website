/**
 * Church Photo Configuration
 *
 * All paths are relative to public/ — the Vite base URL is prepended
 * automatically so they work on GitHub Pages.
 */

import { isClassic } from "../classic";

const B = import.meta.env.BASE_URL;

export const PHOTOS = {
  // ── Hero backgrounds (1920px optimized) ──
  homeHero: `${B}photos/aerial-interior-opt.webp`,       // Dramatic drone interior — nave from above
  homeHeroProcession: `${B}photos/home-procession-opt.webp`, // Home page hero — procession down a full nave
  aboutHero: `${B}photos/interior-nave-opt.webp`,         // Professional interior — nave & altar
  visitHero: `${B}photos/rose-window-opt.webp`,           // Church exterior with sign & rose window
  bulletinHero: `${B}photos/vigil-candles-opt.webp`,      // Moody nave interior — Easter Vigil
  getInvolvedHero: `${B}photos/vigil-servers-opt.webp`,   // Congregation with candles — community
  baptismHero: `${B}photos/baptism-opt.webp`,              // Easter Vigil baptism — water pouring
  marriageHero: `${B}photos/marriage-opt.webp`,            // Order of Celebrating Matrimony ritual book

  sacredHeart: `${B}photos/sacred-heart-opt.webp`,         // Sacred Heart shrine — statue, red votive candles and roses (Start Here closing section)

  // ── Section backgrounds ──
  aboutArchitecture: `${B}photos/exterior-facade-opt.webp`,  // Church façade with rose window
  dominicanCharism: `${B}photos/IMG_4583-opt.webp`,          // Friar preaching from ambo
  faithFormationHero: `${B}photos/faith-formation-opt.jpg`, // Bible with rosary — faith formation (Unsplash)
  pageHeader: `${B}photos/arched-interior-opt.webp`,         // Arched corridor interior

  // ── History page ──
  historyHero: `${B}photos/aerial-overview-opt.webp`,                   // Aerial campus overview
  historyStorefront: `${B}photos/history/storefront.webp`,              // 1923 storefront — first Mass
  historyConstruction: `${B}photos/history/inscription.webp`,           // Church arches under construction 1950s
  historyConstructionExt: `${B}photos/history/construction-exterior.webp`, // Exterior with steel frame
  historyFoundation: `${B}photos/history/construction-foundation.webp`, // Foundation work with workers
  historyExteriorOld: `${B}photos/history/exterior-old.webp`,           // Old entrance B&W
  historyExteriorBw: `${B}photos/history/exterior-bw.webp`,             // Church front vintage color
  historyAltarboys: `${B}photos/history/altarboys.webp`,                // 1963 altar boys with mural
  historyMass1979: `${B}photos/history/mass-1979.webp`,                 // 1979 concelebrated Mass
  historyInteriorVintage: `${B}photos/history/interior-vintage.webp`,   // Interior showing Loreto symbols
  historyCommunity: `${B}photos/history/community.webp`,                // Old parish community gathering
  historyPastorConstruction: `${B}photos/history/pastor-construction.webp`, // Church under construction, 1950s
  historyPastorEntrance: `${B}photos/history/pastor-entrance.webp`,     // Main entrance taking shape
  historyPastorAerial: `${B}photos/history/pastor-aerial.webp`,         // Aerial of the church & campus today

  // ── Architecture walking tour ──
  archHero: `${B}photos/architecture/DJI_0666-opt.webp`,         // Aerial campus overview
  archFacade: `${B}photos/architecture/DSC_0399-opt.webp`,       // Full exterior facade with sign
  archEntrance: `${B}photos/architecture/DSC_0401-opt.webp`,     // Close-up entrance: rose window, statue, coats of arms
  archDoors: `${B}photos/architecture/DSC_0410-opt.webp`,        // Main entrance doors with coats of arms
  archRoseExt: `${B}photos/architecture/DSC_0407-opt.webp`,      // Rose window exterior close-up
  archCornerstone: `${B}photos/architecture/DSC_0414-opt.webp`,  // Cornerstone "St. Dominic's Church 1954"
  archSign: `${B}photos/architecture/DSC_0418-opt.webp`,         // Front sign with relief sculpture
  archSanctuary: `${B}photos/architecture/DSC_0397-opt.webp`,    // Sanctuary from choir loft — mural, altar
  archSideAisle: `${B}photos/architecture/DSC_0422-opt.webp`,    // Side aisle arches with shrines & votive candles
  archChoirLoft: `${B}photos/architecture/DSC_0426-opt.webp`,    // Choir loft, rose window interior, ceiling
  archRoseInt: `${B}photos/architecture/DSC_0429-opt.webp`,      // Rose window interior — Evangelists stained glass
  archDrone: `${B}photos/architecture/DJI_0672-opt.webp`,        // Drone close-up of main entrance
  archSide: `${B}photos/architecture/DSC_0420-opt.webp`,         // Side entrance angle
  archFullExterior: `${B}photos/architecture/DSC_0404-opt.webp`, // Full exterior portrait

  // ── Sacrament & topic imagery (mostly parish-owned; legacy "stock" prefix kept to avoid call-site churn) ──
  stockBaptism: `${B}photos/vigil-fire-opt.webp`,                // Easter Vigil fire — baptismal symbolism
  stockEucharist: `${B}photos/gallery/F69A5507.webp`,            // Monstrance — Eucharist
  stockConfirmation: `${B}photos/vigil-candles-opt.webp`,        // Vigil candles — Holy Spirit / flames
  stockMarriage: `${B}photos/marriage-opt.webp`,                 // Order of Celebrating Matrimony ritual book
  stockAnointing: `${B}photos/vigil-candles-opt.webp`,           // Vigil candles (temporary — commission anointing photo)
  stockFunerals: `${B}photos/rose-window-opt.webp`,              // Rose window (temporary — solemn / contemplative)
  stockRcia: `${B}photos/vigil-fire-opt.webp`,                   // Easter Vigil fire — RCIA/OCIA reception
  stockStainedGlass: `${B}photos/stock/stained-glass.webp`,      // Stained glass window (Unsplash)
  stockChaliceCruets: `${B}photos/chalice and cruets.jpg`,       // Chalice and cruets — sacramental vessels
  stockBibleGolden: `${B}photos/faith-formation-opt.jpg`,        // Bible with rosary — faith formation
  stockSacraments: `${B}photos/interior-nave-opt.webp`,          // Nave & altar — sacramental life
  stockCandles: `${B}photos/stock/candles.webp`,                 // Votive candles (Unsplash)
  sanctuaryAltar: `${B}photos/F69A5428-opt-1024.webp`,           // St. Dominic sanctuary: altar, tabernacle and monstrance (band size)
  dominicanMural: `${B}photos/F69A5475-opt-1024.webp`,           // St. Dominic mural: Our Lady with Dominican saints (band size)
  baptismCard: `${B}photos/baptism-card-1024.webp`,               // A baby baptized at our font (IMG_3103), for the Baptism card on /sacraments
  firstCommunionCard: `${B}photos/first-communion-card-1024.webp`, // First Communion class with the friars before the altar (IMG_5768)
  confirmationCard: `${B}photos/confirmation-card-1024.webp`,     // The bishop confirming a young man, in red vestments with crozier
  marriageCard: `${B}photos/marriage-card-1024.webp`,             // A newly married couple, joined by the lazo, walking down the aisle
  anointingCard: `${B}photos/anointing-card-1024.webp`,           // A priest anointing a sick parishioner at home
  funeralCard: `${B}photos/funeral-card-1024.webp`,               // The Dominican Fathers & Brothers burial ground (IMG_3849)
  baptismFont: `${B}photos/baptism-font-opt.webp`,                // A baby baptized at our font by a friar, family gathered round (header of /sacraments/baptism)
  firstCommunionRail: `${B}photos/first-communion-rail-opt.webp`, // A girl receiving her First Communion at the altar rail (header of /sacraments/first-communion)
  confirmationFire: `${B}photos/confirmation-fire-opt.webp`,     // The new fire blazing outside the church, a friar kneeling beside it with the servers (header of /sacraments/confirmation)
  marriageWide: `${B}photos/marriage-wide-opt.webp`,             // A bride and groom walking down the aisle, family filming (IMG_4413; header of /sacraments/marriage)
  funeralCommittal: `${B}photos/funeral-committal-opt.webp`,     // A friar reads the Order of Christian Funerals at the graveside, mourners gathered (header of /sacraments/funerals)
  dominicanBurial: `${B}photos/dominican-burial-opt.webp`,       // The Dominican Fathers & Brothers burial ground among the trees (IMG_3849; foot of /sacraments/funerals)
  dominicanBurialStone: `${B}photos/dominican-burial-stone.webp`,   // Just the memorial stone from that photo (1920x1440, transparent elsewhere)
  dominicanBurialOutline: `${B}photos/dominican-burial-outline.webp`, // Gold outline of the stone, same size
  cornerstone: `${B}photos/cornerstone-opt.webp`,                 // The cornerstone carved "St·Dominic's anno domini 1954" (top of /register)
  stDominicsOutlineWhite: `${B}photos/branding/st-dominics-outline-white.webp`, // The same outline in white (over dark photos)
  stDominicsOutline: `${B}photos/branding/st-dominics-outline.webp`, // Gold outline of the St·Dominic's lettering (1792x384)
  marianShrine: `${B}photos/marian-shrine-opt.webp`,             // Evening prayer at the Marian shrine: a friar in gold cope before the statue of Our Lady, parishioners gathered (top of /visit)
  stDominicStatue: `${B}photos/st-dominic-statue-opt.webp`,       // The statue of St. Dominic (lilies, book, dog with torch) before the sanctuary mural (behind Before You Come on /visit)
  stDominicStrip: `${B}photos/st-dominic-statue-strip.webp`,      // Just the statue of St. Dominic, a tall strip of that photo (600x1700)
  altarServers: `${B}photos/altar-servers-procession-opt.webp`,  // Altar servers in red cassocks and surplices walking in procession (behind Join Us This Weekend on /visit)
  // Pictures behind the place cards on the Start Here map (RouteMap), by route id
  churchFacadeMarker: `${B}photos/map/church-facade.webp`, // The church front (gable, cross, rose window), 160px square, for the map marker
  mapPlaces: {
    youngstown: `${B}photos/map/youngstown.webp`, // Two Youngstown police cruisers downtown
    boardman: `${B}photos/map/boardman.webp`, // Southern Park Mall: Dillard's and the Buffalo Wild Wings wing
    canfield: `${B}photos/map/canfield.webp`, // Tippecanoe Country Club: the clubhouse across the pond
    poland: `${B}photos/map/poland.webp`, // The clock tower on Main Street, Poland
    struthers: `${B}photos/map/struthers.webp`, // The Elmton: the bar
    campbell: `${B}photos/map/campbell.webp`, // The Four Seasons flea market from the air, the water tower beside it
    austintown: `${B}photos/map/austintown.webp`, // Rulli Bros. storefront (photo: Phil Martin Photography; permission needed before launch)
  },
  sacramentsHero: `${B}photos/history/altar-mass-old.webp`,       // Historic b&w: Mass at the high altar under the mural, servers kneeling
  saintsMural: `${B}photos/saints-mural-opt.webp`,               // The sanctuary mural (Our Lady with eight named Dominican saints), square crop of DSC_0468
  // Glowing gold outline of each figure in that mural, picture-sized and transparent (MuralReveal)
  muralGlow: Object.fromEntries(
    ["aquinas", "rose", "albert", "dominic", "mary", "hyacinth", "antoninus", "peter", "catherine"].map((id) => [
      id,
      `${B}photos/mural-glow/${id}.webp`,
    ])
  ),
  stockGiving: `${B}photos/stock/giving.webp`,                   // Charity / generosity (Unsplash)

  // ── Provincial branding (Dominican Province of St. Joseph) ──
  stDomLogo: `${B}photos/branding/st-dom-logo.webp`,           // Parish crest — Dominican shield with VERITAS (full size)
  stDomLogoSmall: `${B}photos/branding/st-dom-logo-480.webp`,  // Same crest, 480px — for small badges (nav)
  // Home hero title lettering (white on transparent), in two lines so each can have its own see-through level
  heroThisIs: `${B}photos/branding/this-is-1600.webp`, // "THIS IS"
  heroThisIsSmall: `${B}photos/branding/this-is-800.webp`,
  heroStDoms: `${B}photos/branding/st-doms-1600.webp`, // "St·Dom's"
  heroStDomsSmall: `${B}photos/branding/st-doms-800.webp`,
  heroStDomsBurgundy: `${B}photos/branding/st-doms-burgundy-v2.webp`, // solid burgundy "St·Dom's": the header on Home, where the hero's lettering lands
  stDominicsBurgundy: `${B}photos/branding/st-dominics-burgundy.webp`, // solid burgundy "St·Dominic's" (896x192): the header on every other page
  // "St·Dominic's" in three layers, each the full name's size: "St·Dom", "inic", "'s" (BrandFlight opens the name)
  dominicsParts: [
    `${B}photos/branding/dominics-part1.webp`,
    `${B}photos/branding/dominics-part2.webp`,
    `${B}photos/branding/dominics-part3.webp`,
  ],
  stDomCrestDark: `${B}photos/branding/st-dom-crest-black-168.webp`, // Same crest in near-black, for the light header
  stDomCrestLight: `${B}photos/branding/st-dom-crest-light.webp`, // Same crest as light-gold ink on transparent, for dark grounds (footer)
  psjShield: `${B}photos/branding/psj-shield.png`,             // Official PSJ shield with VERITAS
  psjShieldBw: `${B}photos/branding/psj-shield-bw.png`,        // B&W shield (watermark use)
  horseBuggy: `${B}photos/branding/horse-buggy.svg`, // Horse and buggy silhouette from US road sign W11-14 (public domain): the church's marker on the Classic Mode map
  opCrestVeritas: `${B}photos/branding/op-crest-veritas-white.png`, // The Order's old engraved crest (VERITAS scroll, crown, rosary), white on clear (Classic Mode footer)
  psjLogoBlue: `${B}photos/branding/psj-logo-blue.png`,        // Full logo — shield + "Dominican Friars"
  psjWordmarkWhite: `${B}photos/branding/psj-wordmark-white.png`, // White wordmark for dark backgrounds
  doyLogoWhite: `${B}photos/branding/doy-logo-white.png`,         // Diocese of Youngstown crest + wordmark (inverted, doy.org)
  doyCoatOfArms: `${B}photos/branding/doy-coat-of-arms.svg`,      // The Diocese's coat of arms (Classic Mode footer). Wikimedia Commons "Roman Catholic Diocese of Youngstown.svg", CC BY 1.0
  dominicanDog: `${B}photos/branding/dominican-dog.webp`,         // Domini canis: dog with torch (St. Dominic's mother's dream), ink on transparent

  // ── Mass Times page ──
  monstrance: `${B}photos/gallery/F69A5507.webp`,               // Monstrance with Blessed Sacrament exposed

  // ── Gallery (About page) ──
  gallery: [
    { src: `${B}photos/gallery/aerial-overview.webp`, alt: "gallery.aerial" },
    { src: `${B}photos/gallery/aerial-campus.webp`, alt: "gallery.campus" },
    { src: `${B}photos/gallery/IMG_4588.webp`, alt: "gallery.nave" },
    { src: `${B}photos/gallery/F69A5771.webp`, alt: "gallery.stRose" },
    { src: `${B}photos/gallery/F69A5788.webp`, alt: "gallery.friarStatue" },
    { src: `${B}photos/gallery/exterior-statue.webp`, alt: "gallery.exterior" },
    { src: `${B}photos/gallery/aerial-rooftop.webp`, alt: "gallery.rooftop" },
    { src: `${B}photos/gallery/vigil-fire.webp`, alt: "gallery.easterFire" },
    { src: `${B}photos/gallery/exterior-entrance.webp`, alt: "gallery.entrance" },
    { src: `${B}photos/gallery/exterior-signage.webp`, alt: "gallery.signage" },
    { src: `${B}photos/gallery/F69A5475.webp`, alt: "gallery.mural" },
    { src: `${B}photos/gallery/F69A5507.webp`, alt: "gallery.monstrance" },
    { src: `${B}photos/gallery/IMG_4583.webp`, alt: "gallery.preaching" },
    { src: `${B}photos/gallery/F69A5752.webp`, alt: "gallery.madonna" },
    { src: `${B}photos/gallery/F69A5784.webp`, alt: "gallery.alcove" },
    { src: `${B}photos/gallery/crucifix.webp`, alt: "gallery.crucifix" },
  ],
};

// ── Videos (public/videos/) ──
export const VIDEOS = {
  // Home hero intros (parish life montages, ~26 s, silent). One plays per day,
  // taking turns (see Home.jsx); add each new intro here with its first frame.
  homeIntros: [
    { src: `${B}videos/home-intro-1.mp4`, poster: `${B}videos/home-intro-1-poster.webp` },
    { src: `${B}videos/home-intro-2.mp4`, poster: `${B}videos/home-intro-2-poster.webp` },
    { src: `${B}videos/home-intro-3.mp4`, poster: `${B}videos/home-intro-3-poster.webp` },
  ],
};

// Classic Mode's own photos, in place of everyday ones: { everyday: classic }
// (each needs the same -480/-1024/-1920 files; ResponsivePicture swaps them)
// Archive photos: Dominican Province of St. Joseph Archives (psjarchives.org),
// web copies of the item named in each comment. Historical photographs
// © 2026 Dominican Province of St. Joseph Archives. Used with permission
// (credited in the Classic Mode footer: classic.photoCredit)
const A = `${B}photos/classic/`;
export const CLASSIC_PHOTOS = {
  [PHOTOS.sacredHeart]: `${B}photos/sacred-heart-close-opt.webp`, // the same shrine, close and upright: Jesus with the two kneeling saints, roses and red votives
  [PHOTOS.aboutHero]: `${A}youngstown-interior-1936-opt.webp`, // PSJ-H02A-000-001: St. Dominic, Youngstown, the church interior, 1936
  [PHOTOS.archRoseExt]: `${A}youngstown-church-drawing-opt.webp`, // PSJ-H02A-000-002: the architect's drawing of St. Dominic, Youngstown
  [PHOTOS.dominicanCharism]: `${A}home-full-church-mass-opt.webp`, // the parish at Mass: a full church down the nave to the mural (photo from the parish)
  [PHOTOS.archSideAisle]: `${A}home-nave-and-mural-opt.webp`, // St. Dominic's nave and mural (photo from the parish)
  [PHOTOS.stockEucharist]: `${A}home-altar-boys-under-the-mural-opt.webp`, // St. Dominic's altar boys kneeling before the sanctuary mural (photo from the parish)
  [PHOTOS.marianShrine]: `${A}home-may-crowning-opt.webp`, // the May crowning of Our Lady at St. Dominic's (photo from the parish)
  [PHOTOS.stDominicStrip]: `${A}lady-niche-statue-opt.webp`, // PSJ-H09A-000-034: statue of Our Lady in a stone niche, St. Vincent Ferrer
  [PHOTOS.altarServers]: `${A}home-ladies-on-the-steps-opt.webp`, // parishioners coming down St. Dominic's front steps after Mass (photo from the parish)
  [PHOTOS.pageHeader]: `${A}home-friar-leading-prayer-opt.webp`, // a friar leading prayer down the aisle of a full St. Dominic's (photo from the parish)
  [PHOTOS.firstCommunionRail]: `${A}home-boys-first-communion-procession-opt.webp`, // St. Dominic's First Communion boys processing up the aisle (photo from the parish)
  [PHOTOS.marriageWide]: `${A}wedding-at-the-altar-opt.webp`, // a bride kneeling at the altar with the groom as the priest reads the rite, St. Dominic's (photo from the parish)
  [PHOTOS.confirmationFire]: `${A}bishop-and-friars-opt.webp`, // PSJ-H03A-000-011: the bishop with the friars, St. Mary, New Haven
  [PHOTOS.stockAnointing]: `${A}home-lady-at-the-shrine-opt.webp`, // a parishioner praying at the shrine candles, St. Dominic's (photo from the parish)
  [PHOTOS.funeralCommittal]: `${A}dominican-cemetery-opt.webp`, // PSJ-H17-000-048: the Dominican cemetery, St. Rose, Kentucky
  [PHOTOS.dominicanBurial]: `${A}cemetery-statue-opt.webp`, // PSJ-H17-000-050: statue among the crosses, Dominican cemetery, St. Rose
  [PHOTOS.sanctuaryAltar]: `${A}home-sanctuary-postcard-opt.webp`, // postcard: St. Dominic's sanctuary with the servers and choir (photo from the parish)
  [PHOTOS.dominicanMural]: `${A}parish-classroom-1939-opt.webp`, // PSJ-H16-000-005.5: a parish school classroom, St. Monica, Raleigh, 1939
};
export const classicPhoto = (src) => (isClassic() && CLASSIC_PHOTOS[src]) || src;

// Classic Mode's home page: a different parish photo on each visit
// (photos from the parish; position = which part of each to keep in view)
export const CLASSIC_HOME_PHOTOS = [
  { src: `${A}congregation-at-prayer-opt.webp`, position: "50% 50%" }, // the congregation kneeling at prayer under the nave's arches
  { src: `${A}home-ladies-on-the-steps-opt.webp`, position: "50% 55%" }, // parish ladies in their hats coming down the front steps
  { src: `${A}home-altar-boys-under-the-mural-opt.webp`, position: "50% 70%" }, // the altar boys kneeling before the sanctuary mural
  { src: `${A}home-may-crowning-opt.webp`, position: "40% 50%" }, // the May crowning of Our Lady's statue
  { src: `${A}home-church-under-construction-opt.webp`, position: "45% 50%" }, // the church going up: the steel frame and stacked stone
  { src: `${A}home-full-church-mass-opt.webp`, position: "50% 55%" }, // a full church at Mass, down the nave to the mural
  { src: `${A}home-first-communion-class-opt.webp`, position: "40% 60%" }, // a First Communion class in white in the pews
  { src: `${A}home-nave-and-mural-opt.webp`, position: "50% 50%" }, // the empty nave and the mural
  { src: `${A}home-choir-before-the-mural-opt.webp`, position: "50% 60%" }, // the children's choir before the mural
  { src: `${A}home-lady-at-the-shrine-opt.webp`, position: "40% 50%" }, // a parishioner at the Infant of Prague shrine
  { src: `${A}home-sanctuary-postcard-opt.webp`, position: "50% 50%" }, // postcard: the sanctuary with the servers and choir
  { src: `${A}home-boys-first-communion-procession-opt.webp`, position: "50% 45%" }, // boys in white jackets processing up the aisle
  { src: `${A}home-friar-leading-prayer-opt.webp`, position: "48% 60%" }, // a friar leading prayer down the aisle of a full church
];
