import { useTranslation } from "react-i18next";
import PremiumPageActions from "./PremiumPageActions";

export default function SacramentPageActions({ sacramentKey, icon }) {
  const { t } = useTranslation();

  // No `title` prop — it would duplicate the page h1 directly above.
  return (
    <PremiumPageActions
      overlap
      fullText
      eyebrow={t("sacraments.sub")}
      items={[
        {
          title: t(`sacraments.${sacramentKey}.cta`),
          description: t(`sacraments.${sacramentKey}.ctaDesc`),
          to: "/contact",
          icon,
          primary: true,
        },
        {
          title: t("nav.massTimes"),
          description: t("massTimes.reviewed"),
          to: "/mass-times",
          icon: "Church",
        },
        {
          title: t("nav.register"),
          description: t("register.cardDesc"),
          to: "/register",
          icon: "ClipboardList",
        },
      ]}
    />
  );
}
