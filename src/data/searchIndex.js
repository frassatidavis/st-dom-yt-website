/**
 * Site search index + matching helpers.
 * Every entry maps a route to localized titles, a description, and keyword
 * synonyms for fuzzy matching. Paths must exist in the App.jsx route table
 * (enforced by src/data/searchIndex.test.js).
 */
/* ── Search index: all site pages with keywords for fuzzy matching ── */
export const SEARCH_INDEX = [
  {
    path: "/",
    titleKey: "nav.home",
    title: "Home",
    description: "Welcome to St. Dominic Catholic Church",
    keywords: ["home", "welcome", "church", "main", "front page"],
  },
  {
    path: "/mass-times",
    titleKey: "nav.massTimes",
    title: "Mass & Confession Times",
    description: "Sunday, daily, and holy day Mass schedule, confession times, and adoration",
    keywords: ["mass", "schedule", "confession", "sunday", "daily", "saturday", "adoration", "eucharist", "liturgy", "worship", "holy day", "reconciliation", "penance", "time", "hours", "today", "tomorrow", "church time"],
    priority: 3,
  },
  {
    path: "/about",
    titleKey: "nav.about",
    title: "About Our Church",
    description: "Learn about St. Dominic Catholic Church, our mission, and community",
    keywords: ["about", "church", "mission", "history", "community", "dominican", "who we are", "information"],
  },
  {
    path: "/staff",
    titleKey: "nav.staff",
    title: "Priests & Staff",
    description: "Meet our pastor, priests, deacons, and church staff",
    keywords: ["staff", "priests", "pastor", "deacon", "father", "clergy", "team", "directory", "office", "personnel"],
  },
  {
    path: "/bulletin",
    titleKey: "nav.bulletin",
    title: "Weekly Bulletin",
    description: "Read the latest church bulletin and announcements",
    keywords: ["bulletin", "weekly", "announcements", "newsletter", "news", "updates", "publication"],
  },
  {
    path: "/becoming-catholic",
    titleKey: "nav.becomingCatholic",
    title: "Becoming Catholic / OCIA",
    description: "Information about OCIA (formerly RCIA), the Order of Christian Initiation of Adults",
    keywords: ["ocia", "rcia", "becoming catholic", "convert", "initiation", "catechumen", "inquiry", "faith journey", "join the church", "adult baptism"],
  },
  {
    path: "/get-involved",
    titleKey: "nav.getInvolved",
    title: "Get Involved / Ministries",
    description: "Explore church ministries and volunteer opportunities",
    keywords: ["ministries", "volunteer", "get involved", "serve", "groups", "organizations", "lector", "eucharistic minister", "usher", "choir", "music", "outreach"],
  },
  {
    path: "/contact",
    titleKey: "nav.contact",
    title: "Contact Us",
    description: "Contact St. Dominic Church — phone, email, address, and office hours",
    keywords: ["contact", "phone", "email", "address", "office", "hours", "directions", "location", "map", "call", "help", "emergency"],
    priority: 1,
  },
  {
    path: "/give",
    titleKey: "nav.give",
    title: "Online Giving",
    description: "Support St. Dominic Church through online donations and stewardship",
    keywords: ["give", "donate", "offering", "tithe", "stewardship", "online giving", "contribution", "support", "collection", "flocknote", "recurring gift", "one time gift"],
    priority: 1,
  },
  {
    path: "/sacraments",
    titleKey: "nav.sacraments",
    title: "The Sacraments",
    description: "Overview of the seven sacraments celebrated at St. Dominic",
    keywords: ["sacraments", "seven sacraments", "grace", "catholic sacraments", "liturgical", "spiritual"],
  },
  {
    path: "/sacraments/baptism",
    titleKey: "nav.baptism",
    title: "Baptism",
    description: "Information about the Sacrament of Baptism for infants, children, and adults",
    keywords: ["baptism", "christening", "water", "infant", "baby", "godparent", "font", "baptismal", "initiation", "newborn"],
  },
  {
    path: "/sacraments/first-communion",
    titleKey: "nav.firstCommunion",
    title: "First Holy Communion",
    description: "Preparation for the Sacrament of First Holy Communion",
    keywords: ["first communion", "eucharist", "holy communion", "preparation", "catechesis", "body of christ", "bread", "wine", "children"],
  },
  {
    path: "/sacraments/confirmation",
    titleKey: "nav.confirmation",
    title: "Confirmation",
    description: "The Sacrament of Confirmation and preparation program",
    keywords: ["confirmation", "holy spirit", "chrism", "sponsor", "bishop", "gifts", "sealed", "teenager", "youth", "young adult"],
  },
  {
    path: "/sacraments/marriage",
    titleKey: "nav.marriage",
    title: "Marriage",
    description: "Planning a Catholic wedding at St. Dominic Church",
    keywords: ["marriage", "wedding", "matrimony", "engaged", "pre-cana", "nuptial", "vows", "bride", "groom", "ceremony"],
  },
  {
    path: "/sacraments/anointing",
    titleKey: "nav.anointing",
    title: "Anointing of the Sick",
    description: "The Sacrament of Anointing of the Sick for healing and comfort",
    keywords: ["anointing", "sick", "healing", "hospital", "elderly", "dying", "last rites", "comfort", "prayer", "oil", "homebound", "emergency", "priest", "near death", "surgery"],
    priority: 4,
  },
  {
    path: "/sacraments/funerals",
    titleKey: "nav.funerals",
    title: "Catholic Funerals",
    description: "Funeral planning, funeral Mass, and bereavement ministry",
    keywords: ["funeral", "death", "burial", "mass of christian burial", "bereavement", "grief", "memorial", "vigil", "wake", "cemetery", "deceased", "died", "passed away", "funeral home"],
    priority: 4,
  },
  {
    path: "/visit",
    titleKey: "nav.visit",
    title: "Plan Your Visit",
    description: "Plan your first visit to St. Dominic Church — directions, parking, and what to expect",
    keywords: ["visit", "plan", "first time", "new", "directions", "parking", "welcome", "newcomer", "what to expect", "guest"],
  },
  {
    path: "/history",
    titleKey: "nav.history",
    title: "Church History",
    description: "The rich history of St. Dominic Catholic Church",
    keywords: ["history", "heritage", "founded", "tradition", "legacy", "timeline", "origin", "past", "historical"],
  },
  {
    path: "/dominican-friars",
    titleKey: "nav.dominicanFriars",
    title: "The Dominican Friars",
    description: "The Dominican Friars of the Province of St. Joseph, who have served St. Dominic Church since 1923",
    keywords: ["dominican", "dominicans", "friars", "friar", "order of preachers", "province of st. joseph", "priests", "priory", "o.p.", "saint dominic", "frailes", "dominicos"],
  },
  {
    path: "/register",
    titleKey: "nav.register",
    title: "Church Registration",
    description: "Register as a member of St. Dominic",
    keywords: ["register", "registration", "join", "member", "sign up", "new member", "enroll", "membership"],
  },
  {
    path: "/events",
    titleKey: "nav.events",
    title: "Upcoming Events",
    description: "Calendar of upcoming church events, fundraisers, and gatherings",
    keywords: ["events", "calendar", "upcoming", "schedule", "activities", "fundraiser", "gathering", "social", "festival", "concert"],
  },
  {
    path: "/architecture",
    titleKey: "nav.architecture",
    title: "Architecture & Art",
    description: "Explore the architecture, stained glass, and sacred art of St. Dominic",
    keywords: ["architecture", "art", "stained glass", "building", "church", "design", "windows", "tour", "artwork", "sacred art", "gothic", "beauty"],
  },
  {
    path: "/faith-formation",
    titleKey: "nav.faithFormation",
    title: "Faith Formation",
    description: "Deepen your faith with Dominican resources — podcasts, theology, catechesis, and the Catechism",
    keywords: ["faith formation", "education", "study", "theology", "catechism", "podcast", "godsplaining", "thomistic", "rosary", "dominicana", "saints", "learn", "resources", "dominican", "aquinas"],
  },
  {
    path: "/gallery",
    titleKey: "nav.gallery",
    title: "Photo Gallery",
    description: "Browse photos of St. Dominic Church — aerial views, interior, sacred art, and liturgical celebrations",
    keywords: ["gallery", "photos", "pictures", "images", "aerial", "interior", "exterior", "church photos", "photography"],
  },
];

/* ── Fuzzy search helper ── */
export function fuzzyMatch(query, text) {
  const q = query.toLowerCase();
  const t = text.toLowerCase();
  // Exact substring match gets highest score
  if (t.includes(q)) return 3;
  // Check if all query words appear somewhere
  const words = q.split(/\s+/).filter(Boolean);
  const allWordsMatch = words.every((w) => t.includes(w));
  if (allWordsMatch) return 2;
  // Partial word matching: at least half the query words appear
  const matchCount = words.filter((w) => t.includes(w)).length;
  if (matchCount > 0 && matchCount >= words.length / 2) return 1;
  return 0;
}

export function searchPages(query) {
  if (!query || query.trim().length < 2) return [];
  const q = query.trim();
  const scored = SEARCH_INDEX.map((page) => {
    const titleScore = fuzzyMatch(q, page.title) * 4;
    const descScore = fuzzyMatch(q, page.description) * 2;
    const kwScore = Math.max(0, ...page.keywords.map((kw) => fuzzyMatch(q, kw))) * 3;
    const total = titleScore + descScore + kwScore + (page.priority || 0);
    return { ...page, score: total };
  })
    .filter((p) => p.score > 0)
    .sort((a, b) => b.score - a.score);
  return scored;
}
