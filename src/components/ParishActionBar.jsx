import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { T } from "../constants/theme";
import { CONFIG } from "../constants/config";
import Icon from "./Icon";

export default function ParishActionBar() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const toTimes = () => navigate("/mass-times");

  // Today's times live in the header (NavToday); this bar keeps the office
  // phone + email and the way to the full schedule
  return (
    <aside className="parish-action-bar" aria-label={t("actionBar.label")}>
      <div className="parish-action-bar__contact-cell">
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
