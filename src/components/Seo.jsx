import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { CONFIG } from "../constants/config";

const SITE_NAME = "St. Dominic Catholic Church";
const DEFAULT_DESC =
  "St. Dominic Catholic Church — Youngstown, Ohio. Served by the Dominican Friars of the Province of St. Joseph since 1923.";
const SITE_URL = CONFIG.siteUrl;
const DEFAULT_IMAGE = `${SITE_URL}/photos/rose-window-opt.jpg`;

function toAbsoluteSiteUrl(path) {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;

  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  let cleanPath = path.startsWith("/") ? path : `/${path}`;
  if (base && base !== "/" && cleanPath.startsWith(`${base}/`)) {
    cleanPath = cleanPath.slice(base.length);
  }

  return `${SITE_URL}${cleanPath}`;
}

/**
 * Lightweight SEO head manager. Sets document title, meta description,
 * Open Graph, Twitter Card, and per-page image tags.
 *
 * Usage:
 *   <Seo title="About" description="Learn about our church history." image="/photos/interior-nave-opt.jpg" />
 */
export default function Seo({ title, description, image, schema }) {
  const { pathname } = useLocation();
  const fullTitle = title ? `${title} — ${SITE_NAME}` : SITE_NAME;
  const desc = description || DEFAULT_DESC;
  // /mass-times/ is served too (mass-times/index.html); canonical is always /mass-times
  const url = `${SITE_URL}${pathname === "/" ? "/" : pathname.replace(/\/+$/, "")}`;
  const ogImage = image ? toAbsoluteSiteUrl(image) : DEFAULT_IMAGE;

  useEffect(() => {
    document.title = fullTitle;

    const setMeta = (attr, key, content) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setMeta("name", "description", desc);
    setMeta("property", "og:title", fullTitle);
    setMeta("property", "og:description", desc);
    setMeta("property", "og:url", url);
    setMeta("property", "og:type", "website");
    setMeta("property", "og:site_name", SITE_NAME);
    setMeta("property", "og:image", ogImage);
    setMeta("property", "og:image:width", "1920");
    setMeta("property", "og:image:alt", fullTitle);
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", fullTitle);
    setMeta("name", "twitter:description", desc);
    setMeta("name", "twitter:image", ogImage);

    // Canonical URL
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.setAttribute("href", url);

    // hreflang tags (en, es, x-default — all point to same URL since language is toggled client-side)
    const hreflangValues = ["en", "es", "x-default"];
    hreflangValues.forEach((lang) => {
      const selector = `link[rel="alternate"][hreflang="${lang}"]`;
      let hrefEl = document.querySelector(selector);
      if (!hrefEl) {
        hrefEl = document.createElement("link");
        hrefEl.setAttribute("rel", "alternate");
        hrefEl.setAttribute("hreflang", lang);
        document.head.appendChild(hrefEl);
      }
      hrefEl.setAttribute("href", url);
    });

    // JSON-LD structured data (for Article schema, etc.)
    const jsonLdId = "seo-json-ld";
    let scriptEl = document.getElementById(jsonLdId);
    if (schema) {
      if (!scriptEl) {
        scriptEl = document.createElement("script");
        scriptEl.id = jsonLdId;
        scriptEl.setAttribute("type", "application/ld+json");
        document.head.appendChild(scriptEl);
      }
      scriptEl.textContent = JSON.stringify(schema);
    } else if (scriptEl) {
      scriptEl.remove();
    }
  }, [fullTitle, desc, url, ogImage, schema]);

  return null;
}
