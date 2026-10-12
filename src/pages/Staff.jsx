import { useState, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { T } from "../constants/theme";
import { CONFIG } from "../constants/config";
import PullQuote from "../components/PullQuote";
import { Section, SectionTitle } from "../components/Section";
import PageHeader from "../components/PageHeader";
import PremiumPageActions from "../components/PremiumPageActions";
import { initials } from "../data/staff";
import { useStaff } from "../cms/hooks";
import Seo from "../components/Seo";
import Icon from "../components/Icon";
import { PHOTOS } from "../constants/photos";
import { X, Mail, Phone } from "lucide-react";

// Avatars display at <=130px. Swap the full-size base image for the 480px
// variant from scripts/generate-webp.mjs; on error (e.g. a CMS photo with no
// generated variant) fall back to the original once.
const avatarVariant = (photo) =>
  typeof photo === "string" && /\.(webp|jpe?g)$/i.test(photo)
    ? photo.replace(/\.(webp|jpe?g)$/i, "-480.$1")
    : photo;

const avatarFallback = (photo) => (e) => {
  const img = e.currentTarget;
  if (img.dataset.fellBack) return;
  img.dataset.fellBack = "1";
  img.src = photo;
};

export default function Staff() {
  const { t } = useTranslation();
  const { data: staffData } = useStaff();
  const { friars, staff } = staffData;
  const [modal, setModal] = useState(null); // full modal person

  // Leadership = pastor + associate(s). Everyone else goes to In Residence so
  // a friar is never hidden just because an admin saved an unexpected role.
  const leadership = friars.filter((f) => f.role === "pastor" || f.role === "associate");
  const inResidence = friars.filter((f) => f.role !== "pastor" && f.role !== "associate");

  // Display label: admin-provided `title` wins; otherwise fall back to the
  // translated role key; otherwise show the raw role string as a last resort.
  const displayRole = (person) =>
    person.title?.trim() || t(`staff.roles.${person.role}`, { defaultValue: person.role || "" });

  const closeModal = useCallback(() => setModal(null), []);

  useEffect(() => {
    if (!modal) return;
    const onKey = (e) => {
      if (e.key === "Escape") closeModal();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [modal, closeModal]);

  const Avatar = ({ name, photo, size, dark }) =>
    photo ? (
      <img
        src={avatarVariant(photo)}
        onError={avatarFallback(photo)}
        alt={name}
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          objectFit: "cover",
          objectPosition: "top center",
          border: `3px solid ${T.gold}`,
          boxShadow: "0 4px 20px rgba(107,29,42,0.3)",
          display: "block",
          margin: "0 auto",
        }}
      />
    ) : (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          background: dark
            ? "rgba(255,255,255,0.07)"
            : `linear-gradient(135deg, ${T.burgundyDark}, ${T.burgundy})`,
          color: dark ? "rgba(255,255,255,0.7)" : T.goldLight,
          border: `2px solid ${dark ? "rgba(255,255,255,0.15)" : T.gold}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: Math.round(size * 0.32),
          margin: "0 auto",
        }}
      >
        {initials(name)}
      </div>
    );

  // Optional pull-quote rendered in the profile modal. Returns null for
  // anyone without a staff.quotes.<id> entry.
  const ModalQuote = ({ id }) => {
    const text = t(`staff.quotes.${id}.text`, { defaultValue: "" });
    if (!text) return null;
    const source = t(`staff.quotes.${id}.source`, { defaultValue: "" });
    return <PullQuote text={`“${text}”`} src={source} align="left" />;
  };

  const LeaderCard = ({ person }) => (
    <div
      className="flip-card"
      style={{ height: 380, cursor: "pointer" }}
      onClick={() => setModal({ ...person, group: "leadership" })}
      role="button"
      tabIndex={0}
      aria-label={person.name}
      onKeyDown={(e) => e.key === "Enter" && setModal({ ...person, group: "leadership" })}
    >
      <div
        style={{
          height: "100%",
          background: "#fff",
          border: `1px solid ${T.stone}`,
          borderRadius: "var(--radius-card)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "32px 24px",
          textAlign: "center",
          boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
          fontFamily: "var(--font-body)",
        }}
      >
        <Avatar name={person.name} photo={person.photo} size={130} />
        <h3
          style={{
            fontSize: 21,
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            marginTop: 18,
            marginBottom: 8,
            color: T.softBlack,
            lineHeight: 1.2,
          }}
        >
          {person.name}
        </h3>
        <div className="chip chip--solid">{displayRole(person)}</div>
        <div
          style={{
            marginTop: 18,
            fontSize: 12,
            letterSpacing: 1,
            color: T.warmGray,
            display: "flex",
            alignItems: "center",
            gap: 5,
            opacity: 0.7,
          }}
        >
          <Icon name="ChevronRight" size={11} color={T.warmGray} />
          {t("staff.clickHint")}
        </div>
      </div>
    </div>
  );

  const ResidenceCard = ({ person }) => (
    <div
      className="flip-card"
      style={{ perspective: "1000px", height: 270, cursor: "pointer" }}
      onClick={() => setModal({ ...person, group: "residence" })}
      role="button"
      tabIndex={0}
      aria-label={`${person.name}`}
      onKeyDown={(e) => e.key === "Enter" && setModal({ ...person, group: "residence" })}
    >
      <div
        className="res-card"
        style={{
          height: "100%",
          background: "rgba(255,255,255,0.04)",
          border: `1px solid rgba(255,255,255,0.08)`,
          borderRadius: "var(--radius-card)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "28px 20px",
          textAlign: "center",
          transition: "all 0.3s ease",
        }}
      >
        <Avatar name={person.name} size={96} dark />
        <h3
          style={{
            fontSize: 17,
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            marginTop: 14,
            marginBottom: 6,
            color: "#fff",
            lineHeight: 1.2,
          }}
        >
          {person.name}
        </h3>
        <div
          style={{
            fontSize: 11,
            letterSpacing: 0.5,
            fontVariantCaps: "all-small-caps",
            color: "rgba(255,255,255,0.45)",
            fontWeight: 600,
          }}
        >
          {displayRole(person)}
        </div>
        <div
          style={{
            marginTop: 12,
            fontSize: 11,
            letterSpacing: 1,
            color: "rgba(255,255,255,0.3)",
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <Icon name="ChevronRight" size={11} color="rgba(255,255,255,0.3)" />
          {t("staff.clickHint")}
        </div>
      </div>
    </div>
  );

  const StaffCard = ({ person }) => (
    <div
      className="flip-card"
      style={{ perspective: "1000px", height: 270, cursor: "pointer" }}
      onClick={() => setModal({ ...person, group: "staff" })}
      role="button"
      tabIndex={0}
      aria-label={person.name}
      onKeyDown={(e) => e.key === "Enter" && setModal({ ...person, group: "staff" })}
    >
      <div
        style={{
          height: "100%",
          background: "#fff",
          border: `1px solid ${T.stone}`,
          borderRadius: "var(--radius-card)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "28px 20px",
          textAlign: "center",
          transition: "all 0.3s ease",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        }}
        className="staff-plain-card"
      >
        <div
          style={{
            width: 96,
            height: 96,
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${T.gold}, ${T.goldLight})`,
            color: T.softBlack,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: 28,
            border: `2px solid ${T.stone}`,
            margin: "0 auto",
          }}
        >
          {initials(person.name)}
        </div>
        <h3
          style={{
            fontSize: 18,
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            marginTop: 14,
            marginBottom: 6,
            color: T.softBlack,
          }}
        >
          {person.name}
        </h3>
        <div
          style={{
            fontSize: 11,
            letterSpacing: 0.5,
            fontVariantCaps: "all-small-caps",
            color: T.warmGray,
            fontWeight: 600,
          }}
        >
          {displayRole(person)}
        </div>
        <div
          style={{
            marginTop: 12,
            fontSize: 11,
            letterSpacing: 1,
            color: T.warmGray,
                        display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <Icon name="ChevronRight" size={11} color={T.warmGray} />
          {t("staff.clickHint")}
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ paddingTop: 76 }}>
      <Seo
        title="Priests & Staff"
        description="Meet the Dominican Friars and church staff serving the community at St. Dominic Catholic Church in Youngstown, Ohio."
        image={PHOTOS.aboutHero}
      />
      <PageHeader title={t("staff.title")} />
      <PremiumPageActions
        overlap
        eyebrow={t("staff.friars.sub")}
        title={t("staff.title")}
        items={[
          {
            title: t("staff.leadership.title"),
            description: t("staff.friars.title"),
            href: "#staff-leadership",
            icon: "Users",
            primary: true,
          },
          {
            title: t("staff.modal.contact"),
            description: CONFIG.phone,
            to: "/contact",
            icon: "Phone",
          },
          {
            title: t("home.priests.province"),
            description: "Dominican Friars Province of St. Joseph",
            href: CONFIG.provinceUrl,
            icon: "ExternalLink",
            external: true,
          },
        ]}
      />

      <style>{`
        .flip-card:focus-visible { outline: 2px solid ${T.burgundy}; outline-offset: 4px; border-radius: 12px; }
        .res-card:hover { border-color: ${T.gold} !important; background: rgba(255,255,255,0.08) !important; }
        .staff-plain-card:hover { border-color: ${T.gold} !important; box-shadow: 0 8px 28px rgba(0,0,0,0.1) !important; transform: translateY(-4px); }
        .staff-modal-backdrop {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          z-index: 1000; display: flex; align-items: center; justify-content: center;
          padding: 24px; animation: staffFadeIn 0.2s ease;
        }
        .staff-modal {
          background: #fff; border-radius: var(--radius-modal); max-width: 480px; width: 100%;
          max-height: 90vh; overflow-y: auto; position: relative;
          animation: staffSlideUp 0.3s cubic-bezier(0.22,1,0.36,1);
          box-shadow: 0 12px 32px rgba(0,0,0,0.26);
        }
        @keyframes staffFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes staffSlideUp { from { opacity: 0; transform: translateY(24px) scale(0.96); } to { opacity: 1; transform: none; } }
      `}</style>

      {/* Leadership */}
      <Section id="staff-leadership">
        <SectionTitle sub={t("staff.leadership.sub")}>{t("staff.leadership.title")}</SectionTitle>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 32,
            maxWidth: 680,
            margin: "0 auto",
          }}
        >
          {leadership.map((s) => (
            <LeaderCard key={s.id} person={s} />
          ))}
        </div>
      </Section>

      {/* In Residence */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          background: T.softBlack,
          padding: "clamp(48px,10vw,80px) 24px",
        }}
      >
        <svg
          aria-hidden="true"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.03 }}
        >
          <defs>
            <pattern id="staffCross" width="60" height="60" patternUnits="userSpaceOnUse">
              <g transform="translate(30,30)" fill="#fff">
                <path
                  d="M-2.5 -9 L2.5 -9 L2.5 -2.5 L9 -2.5 L9 2.5 L2.5 2.5 L2.5 9 L-2.5 9 L-2.5 2.5 L-9 2.5 L-9 -2.5 L-2.5 -2.5 Z"
                  opacity="0.8"
                />
                <path
                  d="M0 -9 C-2.5 -12, -4 -13.5, -3 -15 C-2 -16.5, 0 -14, 0 -12.5 C0 -14, 2 -16.5, 3 -15 C4 -13.5, 2.5 -12, 0 -9Z"
                  opacity="0.6"
                />
                <path
                  d="M0 9 C-2.5 12, -4 13.5, -3 15 C-2 16.5, 0 14, 0 12.5 C0 14, 2 16.5, 3 15 C4 13.5, 2.5 12, 0 9Z"
                  opacity="0.6"
                />
                <path
                  d="M-9 0 C-12 -2.5, -13.5 -4, -15 -3 C-16.5 -2, -14 0, -12.5 0 C-14 0, -16.5 2, -15 3 C-13.5 4, -12 2.5, -9 0Z"
                  opacity="0.6"
                />
                <path
                  d="M9 0 C12 -2.5, 13.5 -4, 15 -3 C16.5 -2, 14 0, 12.5 0 C14 0, 16.5 2, 15 3 C13.5 4, 12 2.5, 9 0Z"
                  opacity="0.6"
                />
              </g>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#staffCross)" />
        </svg>
        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <SectionTitle sub={t("staff.residence.sub")} light>
            {t("staff.residence.title")}
          </SectionTitle>
          <div className="residence-grid">
            {inResidence.map((s) => (
              <ResidenceCard key={s.id} person={s} />
            ))}
          </div>
        </div>
      </section>

      {/* Parish Staff */}
      <Section bg={T.cream}>
        <SectionTitle sub={t("staff.staff.sub")}>{t("staff.staff.title")}</SectionTitle>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 28,
            maxWidth: 680,
            margin: "0 auto",
          }}
        >
          {staff.map((s) => (
            <StaffCard key={s.id} person={s} />
          ))}
        </div>
      </Section>

      {/* Modal */}
      {modal && (
        <div
          className="staff-modal-backdrop"
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div className="staff-modal" role="dialog" aria-modal="true">
            <button
              onClick={closeModal}
              aria-label="Close"
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                width: 36,
                height: 36,
                borderRadius: "50%",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1,
                background: modal.group === "staff" ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.2)",
              }}
            >
              <X size={18} color={modal.group === "staff" ? T.softBlack : "#fff"} />
            </button>

            <div
              style={{
                background:
                  modal.group === "leadership"
                    ? `linear-gradient(135deg, ${T.burgundyDark}, ${T.burgundy})`
                    : modal.group === "residence"
                      ? T.softBlack
                      : `linear-gradient(135deg, ${T.gold}, ${T.goldLight})`,
                padding: "48px 32px 32px",
                textAlign: "center",
                borderRadius: "var(--radius-modal) var(--radius-modal) 0 0",
              }}
            >
              {modal.photo ? (
                <img
                  src={avatarVariant(modal.photo)}
                  onError={avatarFallback(modal.photo)}
                  alt={modal.name}
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: "50%",
                    objectFit: "cover",
                    objectPosition: "top center",
                    border: `3px solid ${T.gold}`,
                    margin: "0 auto",
                    display: "block",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: "50%",
                    background:
                      modal.group === "staff"
                        ? `linear-gradient(135deg, ${T.gold}, ${T.goldLight})`
                        : "rgba(255,255,255,0.1)",
                    color: modal.group === "staff" ? T.softBlack : T.goldText,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: 40,
                    margin: "0 auto",
                  }}
                >
                  {initials(modal.name)}
                </div>
              )}
              <h2
                style={{
                  fontSize: 26,
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  color: modal.group === "staff" ? T.softBlack : "#fff",
                  marginTop: 20,
                  marginBottom: 8,
                  lineHeight: 1.2,
                }}
              >
                {modal.name}
              </h2>
              <div
                className={`chip ${modal.group === "staff" ? "chip--soft-burgundy" : "chip--on-dark"}`}
              >
                {displayRole(modal)}
              </div>
            </div>

            <div style={{ padding: 32 }}>
              <p style={{ fontSize: 15, lineHeight: 1.8, color: T.warmGray, marginBottom: 24 }}>
                {t(`staff.bios.${modal.id}`)}
              </p>
              <ModalQuote id={modal.id} />
              <div style={{ borderTop: `1px solid ${T.stone}`, paddingTop: 20 }}>
                <div
                  style={{
                    fontSize: 11,
                    letterSpacing: 0.5,
                    fontVariantCaps: "all-small-caps",
                    color: T.warmGray,
                    marginBottom: 12,
                    fontWeight: 600,
                  }}
                >
                  {t("staff.modal.contact")}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <a
                    href={CONFIG.phoneLink}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      color: T.softBlack,
                      textDecoration: "none",
                      fontSize: 15,
                    }}
                  >
                    <Phone size={16} color={T.burgundy} />
                    {CONFIG.phone}
                  </a>
                  <a
                    href={`mailto:${CONFIG.email}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      color: T.softBlack,
                      textDecoration: "none",
                      fontSize: 15,
                    }}
                  >
                    <Mail size={16} color={T.burgundy} />
                    {CONFIG.email}
                  </a>
                </div>
                <p style={{ fontSize: 12, color: T.warmGray, fontStyle: "italic", marginTop: 12 }}>
                  {t("staff.modal.reachVia")}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
