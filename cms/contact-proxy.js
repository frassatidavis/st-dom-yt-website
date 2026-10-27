/**
 * Cloudflare Worker — CORS proxy for the Apps Script contact / registration
 * endpoints.
 *
 * Why this exists: Google Apps Script web apps can't return CORS headers, so
 * the browser receives an opaque response and the website can't tell whether
 * a submission actually succeeded server-side. This Worker forwards the POST
 * body to the Apps Script unchanged and re-emits the response with the
 * Access-Control-Allow-Origin header the browser needs.
 *
 * ── Deploy (one-time) ──
 * 1. Sign into Cloudflare (free plan is fine).
 * 2. Workers & Pages → Create → "Hello World" template.
 * 3. Replace the generated code with this file.
 * 4. Set the APPS_SCRIPT_URL constant to your existing contact-form / register
 *    Apps Script /exec URL (the same one in VITE_CONTACT_FORM_URL today).
 * 5. Edit ALLOWED_ORIGINS to list the domains the website is served from.
 * 6. Save and Deploy. Copy the *.workers.dev URL.
 *
 * ── Wire it up ──
 * 7. Set VITE_FORM_PROXY_URL=https://<your-worker>.workers.dev in the deploy
 *    env. The contact + registration forms will switch to CORS mode and start
 *    reading real success/error responses.
 *
 * If you ever need to fall back, unset VITE_FORM_PROXY_URL and the forms
 * resume the no-cors path against VITE_CONTACT_FORM_URL.
 */

// ───────────────────────── EDIT THESE TWO ─────────────────────────
const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/REPLACE_WITH_YOUR_DEPLOYMENT_ID/exec";

const ALLOWED_ORIGINS = [
  "https://saintdominic.org",
  "https://www.saintdominic.org",
  "https://frassatidavis.github.io",
  "https://jmmarquez2025.github.io",
];
// ──────────────────────────────────────────────────────────────────

function corsHeaders(origin) {
  const allow = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

export default {
  async fetch(request) {
    const origin = request.headers.get("Origin") || "";
    const headers = corsHeaders(origin);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers });
    }
    if (request.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...headers, "Content-Type": "application/json" },
      });
    }

    try {
      const body = await request.text();
      const upstream = await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body,
      });
      const text = await upstream.text();
      return new Response(text, {
        status: upstream.status,
        headers: {
          ...headers,
          "Content-Type":
            upstream.headers.get("Content-Type") || "application/json",
        },
      });
    } catch (err) {
      return new Response(
        JSON.stringify({ error: `Proxy error: ${err.message || err}` }),
        {
          status: 502,
          headers: { ...headers, "Content-Type": "application/json" },
        }
      );
    }
  },
};
