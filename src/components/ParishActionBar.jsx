import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { T } from "../constants/theme";
import { useSchedule } from "../cms/hooks";
import { getTodayScheduleSummary } from "../utils/schedule";
import Icon from "./Icon";

// Let a value wrap only between whole times: "8:00 AM, 10:00 AM" may break
// after the comma, "11:15 AM – 12:00 PM" after the dash, never inside a time.
function keepTimesTogether(value) {
  return String(value)
    .replace(/ (AM|PM)\b/g, "\u00a0$1")
    .replace(/ – /g, "\u00a0– ")
    .replace(/\) /g, ")\u00a0");
}

export default function ParishActionBar() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: schedule } = useSchedule();
  const { masses, confessions } = getTodayScheduleSummary(schedule);

  const actions = [
    {
      icon: "Church",
      label: t("actionBar.mass"),
      value: masses || t("actionBar.schedule"),
      onClick: () => navigate("/mass-times"),
    },
    {
      icon: "Cross",
      label: t("actionBar.confession"),
      value: confessions || t("actionBar.schedule"),
      onClick: () => navigate("/mass-times"),
    },
    {
      icon: "CalendarDays",
      label: t("actionBar.fullTimes"),
      onClick: () => navigate("/mass-times"),
      full: true,
    },
  ];

  return (
    <aside className="parish-action-bar" aria-label={t("actionBar.label")}>
      {actions.map((action) => {
        const content = (
          <>
            <Icon name={action.icon} size={18} color={T.goldLight} />
            <span className="parish-action-bar__text">
              {action.full ? (
                <span className="parish-action-bar__full">{action.label}</span>
              ) : (
                <>
                  <span className="parish-action-bar__label">{action.label}</span>
                  <span className="parish-action-bar__value">{keepTimesTogether(action.value)}</span>
                </>
              )}
            </span>
          </>
        );

        if (action.href) {
          return (
            <a key={action.label} href={action.href} className="parish-action-bar__item">
              {content}
            </a>
          );
        }

        return (
          <button key={action.label} type="button" onClick={action.onClick} className="parish-action-bar__item">
            {content}
          </button>
        );
      })}
    </aside>
  );
}
