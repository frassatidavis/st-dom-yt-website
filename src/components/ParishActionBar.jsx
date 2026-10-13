import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { T } from "../constants/theme";
import { CONFIG } from "../constants/config";
import { useSchedule } from "../cms/hooks";
import { getTodayScheduleSummary, keepTimesTogether } from "../utils/schedule";
import Icon from "./Icon";

export default function ParishActionBar() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: schedule } = useSchedule();
  const { masses, confessions } = getTodayScheduleSummary(schedule);
  const toTimes = () => navigate("/mass-times");

  const lines = [
    { label: t("actionBar.mass"), value: masses || t("actionBar.noneToday") },
    { label: t("actionBar.confession"), value: confessions || t("actionBar.byAppointment") },
  ];

  return (
    <aside className="parish-action-bar" aria-label={t("actionBar.label")}>
      {/* Today's times (opens the schedule) with the office phone + email on the right */}
      <div className="parish-action-bar__today">
        <button type="button" onClick={toTimes} className="parish-action-bar__item parish-action-bar__times">
          <Icon name="Church" size={18} color={T.goldLight} />
          <span className="parish-action-bar__text">
            <span className="parish-action-bar__label">{t("actionBar.today")}</span>
            {lines.map((line) => (
              <span key={line.label} className="parish-action-bar__value">
                <span className="parish-action-bar__kind">{line.label}</span> {keepTimesTogether(line.value)}
              </span>
            ))}
          </span>
        </button>
        <div className="parish-action-bar__contact">
          <a href={CONFIG.phoneLink} aria-label={`${t("actionBar.call")} ${CONFIG.phone}`}>
            <Icon name="Phone" size={13} color={T.goldLight} />
            <span className="parish-action-bar__contact-text">{CONFIG.phone.replace(" ", "\u00a0")}</span>
          </a>
          <a href={`mailto:${CONFIG.email}`} aria-label={`${t("actionBar.email")} ${CONFIG.email}`}>
            <Icon name="Mail" size={13} color={T.goldLight} />
            <span className="parish-action-bar__contact-text">{CONFIG.email}</span>
          </a>
        </div>
      </div>

      <button type="button" onClick={toTimes} className="parish-action-bar__item">
        <Icon name="CalendarDays" size={18} color={T.goldLight} />
        <span className="parish-action-bar__text">
          <span className="parish-action-bar__full">{t("actionBar.fullTimes")}</span>
        </span>
      </button>
    </aside>
  );
}
