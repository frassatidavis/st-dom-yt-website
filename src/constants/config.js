/**
 * Site-wide configuration. Update these values to connect services.
 *
 * ── Contact Form (Google Sheets) ──
 * 1. Create a Google Sheet.
 * 2. Go to Extensions → Apps Script.
 * 3. Paste the following script:
 *
 *    function doPost(e) {
 *      var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
 *      var data = JSON.parse(e.postData.contents);
 *      sheet.appendRow([
 *        data.timestamp, data.name, data.email,
 *        data.phone, data.category, data.message
 *      ]);
 *      return ContentService
 *        .createTextOutput(JSON.stringify({ result: "success" }))
 *        .setMimeType(ContentService.MimeType.JSON);
 *    }
 *
 * 4. Click Deploy → New deployment → Web app.
 *    Execute as: Me | Who has access: Anyone
 * 5. Copy the URL below.
 *
 * ── Flocknote Online Giving ──
 * Use the public Flocknote giving URL, not the admin/action-center URL.
 *
 * ── Google Sheets CMS ──
 * 1. Create a Google Sheet with tabs: Staff, Schedule, Ministries, Announcements
 *    (see src/cms/client.js for column definitions)
 * 2. File → Share → Publish to web → Entire Document → Publish
 * 3. Copy the Sheet ID from the URL:
 *    https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit
 * 4. Paste it below. The site will fetch live data from the sheet.
 *    If the sheet is unavailable, bundled static data is used as fallback.
 */

const DEFAULT_FLOCKNOTE_GIVING_URL = "https://stdominicchurch.flocknote.com/give";
const flocknoteGivingUrl =
  import.meta.env.VITE_FLOCKNOTE_GIVING_URL ||
  import.meta.env.VITE_WESHARE_URL ||
  DEFAULT_FLOCKNOTE_GIVING_URL;

export const CONFIG = {
  // Google Apps Script web-app URL (leave empty to fall back to mailto)
  contactFormUrl: import.meta.env.VITE_CONTACT_FORM_URL || "",

  // Registration form URL — same Apps Script as contact form, routes by formType.
  registrationFormUrl: import.meta.env.VITE_REGISTRATION_FORM_URL || "",

  // Optional CORS proxy in front of the form endpoints (e.g. a Cloudflare
  // Worker — see cms/contact-proxy.js). When set, the contact + registration
  // forms switch to CORS mode and surface real success/error responses from
  // the Apps Script. Leave empty to keep the no-cors fire-and-forget path.
  formProxyUrl: import.meta.env.VITE_FORM_PROXY_URL || "",

  // Public Flocknote online giving page. VITE_WESHARE_URL remains supported
  // as a legacy alias for old deployments.
  flocknoteGivingUrl,
  weShareUrl: flocknoteGivingUrl,

  // Google Sheets CMS — paste your published Sheet ID here
  cmsSheetId: import.meta.env.VITE_CMS_SHEET_ID || "",


  // Dominican Province of St. Joseph
  provinceUrl: "https://dominicanfriars.org/",

  // Catholic Diocese of Youngstown
  dioceseUrl: "https://doy.org/",

  // Dominican Friars Media (Province of St. Joseph) — shown live on the home page
  dominicanMediaUrl: "https://media.dominicanfriars.org/",

  // Flipbook bulletin embed URL
  // Paste the share/embed URL from your flipbook service (FlipHTML5, Heyzine, Issuu, etc.)
  // Example: "https://online.fliphtml5.com/abcde/fghij/"
  bulletinUrl: import.meta.env.VITE_BULLETIN_URL || "",

  // Bulletin archive hosted by the parish's publisher (Diocesan / DiscoverMass).
  // PDFs are posted there before print, so this is always current.
  diocesanBulletinUrl: "https://discovermass.com/church/st-dominic-youngstown-oh/#bulletins",

  // DiscoverMass (Diocesan) weekly bulletin, shown on /bulletin.
  // - discoverMassBulletinNumber: the parish's Diocesan bulletin number; the
  //   page shows that week's cover from bulletins.discovermass.com.
  // - discoverMassKey: the parish's bulletin-widget key from Diocesan
  //   (877-212-7335). When set, the page also links the PDF and the last
  //   four issues. Not a secret — Diocesan's widget puts it in page markup.
  discoverMassBulletinNumber: "2387",
  discoverMassKey: import.meta.env.VITE_DISCOVERMASS_KEY || "",

  // Site URL for SEO (canonical, OpenGraph, etc.). Also sets the path the
  // build is served under (see vite.config.js).
  siteUrl: (import.meta.env.VITE_SITE_URL || "https://saintdominic.org").replace(/\/$/, ""),

  // Admin CMS — Google Apps Script URL backing the Staff Dashboard.
  // Lets admin edits sync across browsers/devices instead of living only
  // in one machine's localStorage. See cms/admin-cms.gs for setup.
  // Leave empty to fall back to localStorage-only mode.
  adminCmsUrl: import.meta.env.VITE_ADMIN_CMS_URL || "",

  // Analytics — Cloudflare Web Analytics (privacy-friendly, no cookie banner needed)
  // Public site token copied from the Cloudflare Web Analytics beacon snippet.
  cloudflareWebAnalyticsToken: import.meta.env.VITE_CLOUDFLARE_WEB_ANALYTICS_TOKEN || "",

  // Church info
  phone: "(330) 783-1900",
  phoneLink: "tel:+13307831900",
  // Sacramental emergency line — priest on call for Anointing of the Sick
  emergencyPhone: "234-367-4312",
  emergencyPhoneLink: "tel:+12343674312",
  fax: "(330) 783-2396",
  email: "office@saintdominic.org",
  // Religious Education (CCD): enrollment form and coordinator
  ccdRegistrationUrl: "https://docs.google.com/forms/d/e/1FAIpQLSfE4imDyJe-j1-HHAd6blwgKr71CuQswMp2Zivj-I5vyrjLQQ/viewform",
  religiousEdEmail: "religion@saintdominic.org",
  address: "77 East Lucius Avenue",
  city: "Youngstown",
  state: "OH",
  zip: "44507",
  fullAddress: "77 East Lucius Avenue, Youngstown, OH 44507",
  officeHours: "Mon–Fri, 8:30 AM – 1:30 PM",
  mapsQuery: "77+East+Lucius+Ave,+Youngstown,+OH+44507",
};
