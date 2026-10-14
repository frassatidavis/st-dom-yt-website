import { useLayoutEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSchedule } from "../cms/hooks";
import { getTodayScheduleSummary, keepTimesTogether } from "../utils/schedule";

/**
 * NavToday — today's Masses and confessions beside the church name in the
 * header, linking to the full schedule.
 *
 * The header stays one row, so this shows only when it fits there without
 * squeezing the name onto more lines or crowding the menu; otherwise it
 * hides (the bottom bar's "Full Mass & Confession Times" still leads to the
 * schedule).
 *
 * Props:
 *   brandRef — ref to the church-name element, to notice if it would wrap
 *              or shrink
 *   brandKey — changes when the header swaps that element for a different
 *              name (Home's "St·Dom's", "St·Dominic's" elsewhere), so the fit
 *              is checked again
 */
export default function NavToday({ brandRef, brandKey }) {
  const { t, i18n } = useTranslation();
  const { data: schedule } = useSchedule();
  const { masses, confessions } = getTodayScheduleSummary(schedule);
  const ref = useRef(null);

  const lines = [
    { label: t("actionBar.mass"), value: masses || t("actionBar.noneToday") },
    { label: t("actionBar.confession"), value: confessions || t("actionBar.byAppointment") },
  ];

  // Show it, measure, and hide it again if it doesn't fit, all before paint
  useLayoutEffect(() => {
    const el = ref.current;
    const brand = brandRef.current;
    const row = el?.parentElement;
    if (!el || !brand || !row) return undefined;

    const check = () => {
      el.style.display = "none";
      const brandHeight = brand.offsetHeight;
      el.style.display = "";
      const siblings = [...row.children];
      const next = siblings
        .slice(siblings.indexOf(el) + 1)
        .find((c) => getComputedStyle(c).display !== "none");
      const box = el.getBoundingClientRect();
      const fits =
        brand.offsetHeight === brandHeight &&
        box.height <= row.clientHeight &&
        row.scrollWidth <= row.clientWidth &&
        (!next || box.right + 16 <= next.getBoundingClientRect().left);
      if (!fits) el.style.display = "none";
    };

    check();
    // The row resizes with the window and when the header shrinks on scroll;
    // the name changes width as it loads and shrinks (on scroll, and to fit)
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(check) : null;
    ro?.observe(row);
    ro?.observe(brand);
    return () => ro?.disconnect();
  }, [brandRef, brandKey, i18n.language, masses, confessions]);

  return (
    <NavLink ref={ref} to="/mass-times" className="nav-today">
      {/* Today's date, so it's plain the times are for the day being viewed */}
      <span className="nav-today__label">
        {new Intl.DateTimeFormat(i18n.language === "es" ? "es-US" : "en-US", { weekday: "long", month: "long", day: "numeric" }).format(new Date())}
      </span>
      {lines.map((line) => (
        <span key={line.label} className="nav-today__value">
          <span className="nav-today__kind">{line.label}</span> {keepTimesTogether(line.value)}
        </span>
      ))}
    </NavLink>
  );
}
