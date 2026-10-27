import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

function cloudflareWebAnalytics() {
  return {
    name: "cloudflare-web-analytics",
    apply: "build",
    transformIndexHtml() {
      const token = process.env.VITE_CLOUDFLARE_WEB_ANALYTICS_TOKEN?.trim();

      if (!token) return [];

      return [
        {
          tag: "script",
          attrs: {
            defer: true,
            src: "https://static.cloudflareinsights.com/beacon.min.js",
            "data-cf-beacon": JSON.stringify({ token }),
          },
          injectTo: "body",
        },
      ];
    },
  };
}

// The site's public URL decides the path it is served under:
// https://saintdominic.org → "/", the GitHub Pages project URL
// (https://frassatidavis.github.io/st-dom-yt-website) → "/st-dom-yt-website/".
function basePathFor(siteUrl) {
  const path = new URL(siteUrl).pathname.replace(/\/$/, "");
  return `${path}/`;
}

export default defineConfig(({ mode }) => ({
  plugins: [react(), cloudflareWebAnalytics()],
  base: basePathFor(loadEnv(mode, process.cwd(), "").VITE_SITE_URL || "https://saintdominic.org"),
  // es2022 enables top-level await (used in src/i18n.js to lazy-load the
  // active locale chunk). Supported in Chrome 89+, Edge 89+, Firefox 89+,
  // Safari 15+ — fine for parish-website audience.
  build: { target: "es2022" },
  esbuild: { target: "es2022" },
}));
