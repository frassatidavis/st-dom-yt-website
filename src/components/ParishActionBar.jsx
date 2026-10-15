import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { T } from "../constants/theme";
import { CONFIG } from "../constants/config";
import Icon from "./Icon";
import { isClassic, setClassic } from "../classic";

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
          {/* Office hours above the phone (shown in Classic Mode) */}
          <span className="parish-action-bar__hours">
            <span className="parish-action-bar__hours-label">{t("footer.cards.hoursTitle")}</span>{" "}
            <span className="parish-action-bar__hours-time">{t("footer.cards.hoursDays")}</span>{" "}
            <span className="parish-action-bar__hours-time">{t("footer.cards.hoursTime")}</span>
          </span>
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

      {isClassic() ? (
        // Classic Mode: a switch back to the modern site
        <button
          type="button"
          role="switch"
          aria-checked="true"
          onClick={() => setClassic(false)}
          className="parish-action-bar__item parish-action-bar__mode"
        >
          <span className="mode-switch" aria-hidden="true">
            <span className="mode-switch__knob" />
          </span>
          <span className="parish-action-bar__text">
            <span className="parish-action-bar__full">{t("classic.backToToday")}</span>
          </span>
        </button>
      ) : (
        <button type="button" onClick={toTimes} className="parish-action-bar__item">
          <Icon name="CalendarDays" size={18} color={T.goldLight} />
          <span className="parish-action-bar__text">
            <span className="parish-action-bar__full">{t("actionBar.fullTimes")}</span>
          </span>
        </button>
      )}
    </aside>
  );
}
