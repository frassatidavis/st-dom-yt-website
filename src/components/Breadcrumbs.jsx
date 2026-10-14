import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Home, ChevronRight } from "lucide-react";
import { T } from "../constants/theme";
import { CONFIG } from "../constants/config";

/**
 * Segment-to-i18n-key mapping.
 * Each URL slug maps to the nav.* translation key that holds
 * the human-readable label for that page.
 */
const SEGMENT_I18N_KEY = {
  sacraments: "nav.sacraments",
  baptism: "nav.baptism",
  "first-communion": "nav.firstCommunion",
  confirmation: "nav.confirmation",
  marriage: "nav.marriage",
  anointing: "nav.anointing",
  funerals: "nav.funerals",
  "mass-times": "nav.massTimes",
  "becoming-catholic": "nav.becomingCatholic",
  "get-involved": "nav.getInvolved",
  about: "nav.about",
  history: "nav.history",
  "dominican-friars": "nav.dominicanFriars",
  staff: "nav.staff",
  bulletin: "nav.bulletin",
  contact: "nav.contact",
  give: "nav.give",
  visit: "nav.visit",
  register: "nav.register",
  events: "nav.events",
  architecture: "nav.architecture",
  gallery: "nav.gallery",
  "faith-formation": "nav.faithFormation",
  "writers-guide": "Writer's Guide",
  "announcement-manager": "Announcement Manager",
};

/**
 * Fallback: convert a URL slug to title case.
 * e.g. "some-page" → "Some Page"
 */
function slugToLabel(slug) {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/**
 * Breadcrumbs — auto-generated breadcrumb trail from the current URL.
 *
 * Only renders when the path has 2+ segments (i.e. not on the home page).
 * Includes Schema.org BreadcrumbList structured data for SEO.
 */
export default function Breadcrumbs() {
  const { pathname } = useLocation();
  const { t } = useTranslation();

  // Split pathname into non-empty segments
  const segments = pathname.split("/").filter(Boolean);

  // Don't render on the home page (no segments) or single-segment pages
  // that are effectively top-level.  Per requirement: only show when 2+ segments.
  if (segments.length < 2) return null;

  // Build crumb objects: [{ label, path }, ...]
  const crumbs = segments.map((seg, i) => {
    const path = "/" + segments.slice(0, i + 1).join("/");
    const i18nKey = SEGMENT_I18N_KEY[seg];
    const label = i18nKey ? t(i18nKey) : slugToLabel(seg);
    return { label, path };
  });

  // Schema.org BreadcrumbList JSON-LD
  const siteUrl = CONFIG.siteUrl.replace(/\/$/, "");
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: t("nav.home"),
        item: siteUrl + "/",
      },
      ...crumbs.map((c, i) => ({
        "@type": "ListItem",
        position: i + 2,
        name: c.label,
        item: siteUrl + c.path,
      })),
    ],
  };

  return (
    <>
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Visible breadcrumb nav */}
      <nav
        aria-label="Breadcrumb"
        style={{
          fontFamily: "var(--font-body)",
          fontSize: 13,
          lineHeight: "20px",
          padding: "12px 24px",
          background: T.cream,
          borderBottom: `1px solid ${T.stone}`,
        }}
      >
        <ol
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 6,
            listStyle: "none",
            margin: 0,
            padding: 0,
            maxWidth: 1200,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          {/* Home crumb */}
          <li style={{ display: "flex", alignItems: "center" }}>
            <Link
              to="/"
              aria-label={t("nav.home")}
              style={{
                color: T.burgundy,
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Home size={14} strokeWidth={2} />
            </Link>
          </li>

          {/* Intermediate + final crumbs */}
          {crumbs.map((crumb, i) => {
            const isLast = i === crumbs.length - 1;
            return (
              <li
                key={crumb.path}
                style={{ display: "flex", alignItems: "center", gap: 6 }}
              >
                <ChevronRight
                  size={12}
                  strokeWidth={2.5}
                  style={{ color: T.gold, flexShrink: 0 }}
                  aria-hidden="true"
                />
                {isLast ? (
                  <span
                    aria-current="page"
                    style={{
                      color: T.warmGray,
                      fontWeight: 500,
                    }}
                  >
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    to={crumb.path}
                    style={{
                      color: T.burgundy,
                      textDecoration: "none",
                      fontWeight: 400,
                    }}
                  >
                    {crumb.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
