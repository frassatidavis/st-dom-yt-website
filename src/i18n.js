import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { isClassic } from "./classic";
import { CLASSIC_TEXT } from "./locales/classic";

// The active locale ships in its own chunk (Vite splits the dynamic import
// per file). The inactive locale is fetched only if the user toggles
// language, keeping ~75 KB of unused JSON out of the initial bundle.
const SUPPORTED = ["en", "es"];
const initialLang = (() => {
  try {
    const saved = localStorage.getItem("lang");
    if (saved && SUPPORTED.includes(saved)) return saved;
  } catch {
    /* localStorage unavailable */
  }
  return "en";
})();

// In Classic Mode the 1954 wording (locales/classic.js) replaces the
// everyday lines
const deepMerge = (base, over) => {
  const out = { ...base };
  for (const [k, v] of Object.entries(over)) {
    out[k] = v && typeof v === "object" && !Array.isArray(v) ? deepMerge(base?.[k] ?? {}, v) : v;
  }
  return out;
};
const loadLocale = (lng) =>
  import(`./locales/${lng}.json`).then((m) =>
    isClassic() && CLASSIC_TEXT[lng] ? deepMerge(m.default, CLASSIC_TEXT[lng]) : m.default
  );

const initialBundle = await loadLocale(initialLang);

i18n.use(initReactI18next).init({
  resources: { [initialLang]: { translation: initialBundle } },
  lng: initialLang,
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

// Wrap changeLanguage so the requested bundle is fetched and registered
// before i18next swaps languages — otherwise the first paint after a toggle
// shows the fallback locale until the bundle resolves.
const _changeLanguage = i18n.changeLanguage.bind(i18n);
i18n.changeLanguage = async (lng, ...rest) => {
  if (lng && SUPPORTED.includes(lng) && !i18n.hasResourceBundle(lng, "translation")) {
    try {
      const bundle = await loadLocale(lng);
      i18n.addResourceBundle(lng, "translation", bundle, true, true);
    } catch {
      /* network failure — i18next falls back to the active language */
    }
  }
  return _changeLanguage(lng, ...rest);
};

export default i18n;
