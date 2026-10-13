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
 */
export default function NavToday({ brandRef }) {
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
    // The row resizes with the window and when the header shrinks on scroll
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(check) : null;
    ro?.observe(row);
    return () => ro?.disconnect();
  }, [brandRef, i18n.language, masses, confessions]);

  return (
    <NavLink ref={ref} to="/mass-times" className="nav-today">
      <span className="nav-today__label">{t("actionBar.today")}</span>
      {lines.map((line) => (
        <span key={line.label} className="nav-today__value">
          <span className="nav-today__kind">{line.label}</span> {keepTimesTogether(line.value)}
        </span>
      ))}
    </NavLink>
  );
}
