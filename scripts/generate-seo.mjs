import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { loadEnv } from "vite";
import { LEGACY_REDIRECTS, LEGACY_CHILD_PATHS, legacyTargetFor } from "../src/data/legacyRedirects.js";

const outDir = process.argv[2] || "dist";
// Same lookup as vite.config.js (process env, then .env files) so the pages
// written here always match the base path the bundle was built for.
const env = loadEnv("production", process.cwd(), "");
const siteUrl = (env.VITE_SITE_URL || "https://saintdominic.org").replace(/\/$/, "");
// Path prefix the site is served under: "" on saintdominic.org,
// "/st-dom-yt-website" on the GitHub Pages project URL.
const basePath = new URL(siteUrl).pathname.replace(/\/$/, "");

const pages = [
  ["/", "1.0", "weekly"],
  ["/visit", "0.9", "monthly"],
  ["/mass-times", "0.9", "weekly"],
  ["/sacraments", "0.8", "monthly"],
  ["/about", "0.7", "monthly"],
  ["/staff", "0.7", "monthly"],
  ["/becoming-catholic", "0.8", "monthly"],
  ["/get-involved", "0.7", "monthly"],
  ["/contact", "0.8", "yearly"],
  ["/give", "0.8", "yearly"],
  ["/bulletin", "0.6", "weekly"],
  ["/sacraments/baptism", "0.7", "monthly"],
  ["/sacraments/first-communion", "0.7", "monthly"],
  ["/sacraments/confirmation", "0.7", "monthly"],
  ["/sacraments/marriage", "0.7", "monthly"],
  ["/sacraments/anointing", "0.6", "monthly"],
  ["/sacraments/funerals", "0.6", "monthly"],
  ["/faith-formation", "0.7", "monthly"],
  ["/connect", "0.6", "monthly"],
  ["/events", "0.6", "weekly"],
  ["/gallery", "0.5", "monthly"],
  ["/register", "0.6", "yearly"],
  ["/history", "0.5", "yearly"],
  ["/architecture", "0.5", "yearly"],
];

function loc(path) {
  return path === "/" ? `${siteUrl}/` : `${siteUrl}${path}`;
}

// GitHub Pages serves /foo from foo.html with a 200 (that rule wins over the
// folder rule, which would 301 /foo → /foo/). foo/index.html also covers
// links written with a trailing slash.
function writePage(path, html) {
  const segments = path.split("/").filter(Boolean);
  const dir = join(outDir, ...segments);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "index.html"), html);
  writeFileSync(`${dir}.html`, html);
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(([path, priority, changefreq]) => `  <url><loc>${loc(path)}</loc><priority>${priority}</priority><changefreq>${changefreq}</changefreq></url>`)
  .join("\n")}
</urlset>
`;

const robots = `User-agent: *
Allow: /
Sitemap: ${siteUrl}/sitemap.xml
`;

mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "sitemap.xml"), sitemap);
writeFileSync(join(outDir, "robots.txt"), robots);

const indexPath = join(outDir, "index.html");
if (existsSync(indexPath)) {
  const html = readFileSync(indexPath, "utf8")
    .replaceAll("https://jmmarquez2025.github.io/st-dom-yt-website", siteUrl)
    .replaceAll("https://saintdominic.org", siteUrl);
  writeFileSync(indexPath, html);

  // GitHub Pages only knows about files on disk. Without a real file at each
  // route it serves 404.html with an HTTP 404 status, which keeps every inner
  // page out of search results. Give each route its own copy of the app shell,
  // with that route's canonical so it isn't read as a duplicate of home.
  const homeCanonical = `<link rel="canonical" href="${siteUrl}/" />`;
  if (!html.includes(homeCanonical)) throw new Error("index.html canonical tag not found");
  for (const [path] of pages) {
    if (path === "/") continue;
    writePage(path, html.replace(homeCanonical, `<link rel="canonical" href="${loc(path)}" />`));
  }
}

// Old eCatholic URLs: a static redirect page at each one, so links from
// search results, Facebook and bookmarks land on the right page with a 200.
const legacyPaths = [...Object.keys(LEGACY_REDIRECTS), ...LEGACY_CHILD_PATHS];
for (const from of legacyPaths) {
  const to = legacyTargetFor(from);
  if (!to) throw new Error(`No redirect target for legacy path ${from}`);
  if (pages.some(([path]) => path === from)) {
    throw new Error(`Legacy redirect ${from} would overwrite a real page`);
  }
  const href = `${basePath}${to}`;
  writePage(
    from,
    `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>St. Dominic Catholic Church</title>
<link rel="canonical" href="${loc(to)}" />
<meta http-equiv="refresh" content="0; url=${href}" />
<script>location.replace(${JSON.stringify(href)} + location.search + location.hash);</script>
</head>
<body>
<p>This page has moved: <a href="${href}">${loc(to)}</a></p>
</body>
</html>
`,
  );
}

console.log(`SEO: ${pages.length} pages, ${legacyPaths.length} legacy redirects → ${siteUrl}`);
