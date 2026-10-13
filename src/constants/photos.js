/**
 * Church Photo Configuration
 *
 * All paths are relative to public/ — the Vite base URL is prepended
 * automatically so they work on GitHub Pages.
 */

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
  stockGiving: `${B}photos/stock/giving.webp`,                   // Charity / generosity (Unsplash)

  // ── Provincial branding (Dominican Province of St. Joseph) ──
  stDomLogo: `${B}photos/branding/st-dom-logo.webp`,           // Parish crest — Dominican shield with VERITAS (full size)
  stDomLogoSmall: `${B}photos/branding/st-dom-logo-480.webp`,  // Same crest, 480px — for small badges (nav)
  // Home hero title lettering (white on transparent), in two lines so each can have its own see-through level
  heroThisIs: `${B}photos/branding/this-is-1600.webp`, // "THIS IS"
  heroThisIsSmall: `${B}photos/branding/this-is-800.webp`,
  heroStDoms: `${B}photos/branding/st-doms-1600.webp`, // "St·Dom's"
  heroStDomsSmall: `${B}photos/branding/st-doms-800.webp`,
  heroStDomsBurgundy: `${B}photos/branding/st-doms-burgundy-v2.webp`, // solid burgundy "St·Dom's" for the header
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
  psjLogoBlue: `${B}photos/branding/psj-logo-blue.png`,        // Full logo — shield + "Dominican Friars"
  psjWordmarkWhite: `${B}photos/branding/psj-wordmark-white.png`, // White wordmark for dark backgrounds
  doyLogoWhite: `${B}photos/branding/doy-logo-white.png`,         // Diocese of Youngstown crest + wordmark (inverted, doy.org)
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
    { src: `${B}videos/home-intro.mp4`, poster: `${B}videos/home-intro-poster.webp` },
  ],
};
