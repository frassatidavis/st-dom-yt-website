import { useNavigate } from "react-router-dom";
import { T } from "../constants/theme";
import Icon from "./Icon";
import { isClassic } from "../classic";

// fullText: show each card's whole description instead of two lines
export default function PremiumPageActions({ eyebrow, title, items = [], overlap = false, fullText = false }) {
  const navigate = useNavigate();
  // Classic Mode: no boxes of link cards anywhere
  if (isClassic()) return null;

  const renderItem = (item) => {
    const content = (
      <>
        <span className="premium-page-actions__icon">
          <Icon name={item.icon || "ArrowRight"} size={22} color={item.primary ? T.softBlack : T.burgundy} />
        </span>
        <span className="premium-page-actions__copy">
          <strong>{item.title}</strong>
          {item.description && <span>{item.description}</span>}
        </span>
        <Icon name={item.external ? "ExternalLink" : "ArrowRight"} size={16} color={item.primary ? T.softBlack : T.burgundy} />
      </>
    );

    const className = `premium-page-actions__item${item.primary ? " premium-page-actions__item--primary" : ""}${item.description ? "" : " premium-page-actions__item--title-only"}`;

    if (item.href) {
      return (
        <a
          key={`${item.title}-${item.href}`}
          href={item.href}
          target={item.external ? "_blank" : undefined}
          rel={item.external ? "noopener noreferrer" : undefined}
          className={className}
        >
          {content}
        </a>
      );
    }

    return (
      <button
        key={`${item.title}-${item.to}`}
        type="button"
        onClick={() => navigate(item.to)}
        className={className}
      >
        {content}
      </button>
    );
  };

  return (
    <section className={`premium-page-actions${overlap ? " premium-page-actions--overlap" : ""}${fullText ? " premium-page-actions--full" : ""}`}>
      <div className="premium-page-actions__inner">
        {(eyebrow || title) && (
          <div className="premium-page-actions__heading">
            {eyebrow && <div>{eyebrow}</div>}
            {title && <h2>{title}</h2>}
          </div>
        )}
        <div className="premium-page-actions__grid">
          {items.filter(Boolean).map(renderItem)}
        </div>
      </div>
    </section>
  );
}
