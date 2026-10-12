import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ExternalLink, FileText } from "lucide-react";
import { CONFIG } from "../constants/config";

const BULLETINS = "https://bulletins.discovermass.com";
// Public token from Diocesan's own widget script (bulletins.discovermass.com/bulletins.js).
const FEED_TOKEN = "W8K5ZGHBIRDJZF1BF2S9Q8D";

/** Today's date in Youngstown as YYYY-MM-DD plus the weekday (0 = Sunday). */
function parishToday(now = new Date()) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone: "America/New_York",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      weekday: "short",
    })
      .formatToParts(now)
      .map((p) => [p.type, p.value])
  );
  const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(parts.weekday);
  return { date: new Date(Date.UTC(+parts.year, +parts.month - 1, +parts.day)), weekday };
}

const iso = (d) => d.toISOString().slice(0, 10);
const addDays = (d, n) => new Date(d.getTime() + n * 86400000);

/**
 * Sundays whose bulletin might be "this week's", newest first. Diocesan often
 * posts the coming Sunday's issue midweek, so try that before last Sunday.
 */
export function bulletinDatesToTry(now) {
  const { date, weekday } = parishToday(now);
  const lastSunday = addDays(date, -weekday);
  const dates = weekday === 0 ? [date] : [addDays(lastSunday, 7), lastSunday];
  dates.push(addDays(dates[dates.length - 1], -7));
  return dates.map(iso);
}

/**
 * This week's bulletin from DiscoverMass: the cover (always), plus the PDF and
 * the last four issues once the parish's widget key is configured. Renders
 * `fallback` if DiscoverMass has nothing to show.
 */
export default function DiscoverMassBulletin({ fallback }) {
  const { t, i18n } = useTranslation();
  const [feed, setFeed] = useState(null);
  const [attempt, setAttempt] = useState(0);
  const dates = useMemo(() => bulletinDatesToTry(), []);

  useEffect(() => {
    if (!CONFIG.discoverMassKey) return undefined;
    const controller = new AbortController();
    fetch(
      `${BULLETINS}/api.php?auth=${FEED_TOKEN}&action=getBulletins&id=${encodeURIComponent(CONFIG.discoverMassKey)}`,
      { signal: controller.signal }
    )
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.thumbnailUrl && data?.b0) setFeed(data);
      })
      .catch(() => {});
    return () => controller.abort();
  }, []);

  const formatDate = (isoDate) =>
    new Intl.DateTimeFormat(i18n.language === "es" ? "es-US" : "en-US", {
      dateStyle: "long",
      timeZone: "UTC",
    }).format(new Date(`${isoDate}T12:00:00Z`));

  let cover;
  if (feed) {
    cover = { src: feed.thumbnailUrl, date: feed.d0, href: feed.b0 };
  } else if (CONFIG.discoverMassBulletinNumber && attempt < dates.length) {
    const date = dates[attempt];
    cover = {
      src: `${BULLETINS}/image.php?bulletinNumber=${CONFIG.discoverMassBulletinNumber}&date=${date}`,
      date: formatDate(date),
      href: CONFIG.diocesanBulletinUrl,
    };
  }
  if (!cover) return fallback;

  // Missing issues come back as an error page, which fails to decode as an image.
  const onCoverError = () => (feed ? setFeed(null) : setAttempt((n) => n + 1));
  const archive = feed
    ? [1, 2, 3, 4].map((n) => ({ date: feed[`d${n}`], href: feed[`b${n}`] })).filter((b) => b.date && b.href)
    : [];

  return (
    <div className="dm-bulletin">
      <a href={cover.href} target="_blank" rel="noopener noreferrer" className="dm-bulletin__cover">
        <img
          key={cover.src}
          src={cover.src}
          onError={onCoverError}
          alt={t("bulletin.current.coverAlt", { date: cover.date })}
          width={447}
          height={578}
          loading="lazy"
          decoding="async"
        />
      </a>

      <div className="dm-bulletin__body">
        <p className="dm-bulletin__date">{t("bulletin.current.label", { date: cover.date })}</p>
        <p className="dm-bulletin__desc">{t("bulletin.current.desc")}</p>
        <a href={cover.href} target="_blank" rel="noopener noreferrer" className="btn-hover dm-bulletin__cta">
          {feed ? <FileText size={16} aria-hidden="true" /> : <ExternalLink size={16} aria-hidden="true" />}
          {feed ? t("bulletin.current.read") : t("bulletin.current.view")}
        </a>

        {archive.length > 0 && (
          <div className="dm-bulletin__archive">
            <h3>{t("bulletin.current.previous")}</h3>
            <ul>
              {archive.map((b) => (
                <li key={b.href}>
                  <a href={b.href} target="_blank" rel="noopener noreferrer">
                    {b.date}
                  </a>
                </li>
              ))}
            </ul>
            <a href={CONFIG.diocesanBulletinUrl} target="_blank" rel="noopener noreferrer" className="dm-bulletin__more">
              {t("bulletin.current.more")} <ExternalLink size={13} aria-hidden="true" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

