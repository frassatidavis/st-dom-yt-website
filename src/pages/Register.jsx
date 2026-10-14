import { useState } from "react";
import { useTranslation } from "react-i18next";
import { T } from "../constants/theme";
import { FloatingInput, FloatingTextarea, StyledSelect } from "../components/forms/Fields";
import { CONFIG } from "../constants/config";
import { Section } from "../components/Section";
import PageHeader from "../components/PageHeader";
import Seo from "../components/Seo";
import { PHOTOS } from "../constants/photos";
import PremiumPageActions from "../components/PremiumPageActions";
import {
  CheckCircle,
  AlertCircle,
  UserPlus,
  ChevronDown,
  ChevronUp,
  Loader2,
  Heart,
  Users,
  Home as HomeIcon,
  Church,
} from "lucide-react";

import { validateEmail, validatePhone } from "../utils/formValidation";

/* ── Collapsible section with icon ── */
function FormSection({ icon: IconComp, title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "var(--radius-card)",
        border: `1px solid ${open ? "rgba(107,29,42,0.12)" : T.stone}`,
        overflow: "hidden",
        transition: "border-color 0.3s, box-shadow 0.3s",
        boxShadow: open ? "0 2px 12px rgba(107,29,42,0.06)" : "none",
      }}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "18px 24px",
          background: open ? "rgba(107,29,42,0.03)" : "transparent",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          transition: "background 0.3s",
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "var(--radius-card)",
            background: open ? T.burgundy : T.chipBurgundyBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.3s",
          }}
        >
          <IconComp size={18} color={open ? "#fff" : T.burgundy} />
        </div>
        <span
          style={{
            flex: 1,
            fontSize: 18,
            fontWeight: 600,
            color: T.burgundy,
            fontFamily: "var(--font-display)",
          }}
        >
          {title}
        </span>
        {open ? (
          <ChevronUp size={18} color={T.warmGray} />
        ) : (
          <ChevronDown size={18} color={T.warmGray} />
        )}
      </button>
      <div
        style={{
          maxHeight: open ? 600 : 0,
          overflow: "hidden",
          transition: "max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <div style={{ padding: "4px 24px 24px", display: "grid", gap: 16 }}>{children}</div>
      </div>
    </div>
  );
}

/* ── Pill-style sacrament checkbox ── */
function SacramentPill({ label, checked, onChange }) {
  return (
    <label
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "10px 18px",
        borderRadius: "var(--radius-control)",
        cursor: "pointer",
        border: `1.5px solid ${checked ? T.burgundy : T.stone}`,
        background: checked ? T.chipBurgundyBg : "#fff",
        transition: "all 0.25s ease",
        fontSize: 14,
        fontWeight: checked ? 600 : 400,
        color: checked ? T.burgundy : T.charcoal,
        fontFamily: "var(--font-body)",
      }}
    >
      <div
        style={{
          width: 20,
          height: 20,
          borderRadius: "var(--radius-control)",
          border: `2px solid ${checked ? T.burgundy : T.stone}`,
          background: checked ? T.burgundy : "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.2s",
        }}
      >
        {checked && (
          <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
            <path
              d="M1 5L4.5 8.5L11 1.5"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
      <input type="checkbox" checked={checked} onChange={onChange} style={{ display: "none" }} />
      {label}
    </label>
  );
}

/* ── Step indicator ── */
function StepIndicator({ currentStep, labels }) {
  const steps = [
    { num: 1, label: labels.personal },
    { num: 2, label: labels.contact },
    { num: 3, label: labels.church },
  ];
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 0,
        marginBottom: 36,
      }}
    >
      {steps.map((s, i) => (
        <div key={s.num} style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: currentStep >= s.num ? T.burgundy : T.stone,
              color: currentStep >= s.num ? "#fff" : T.warmGray,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 13,
              fontWeight: 700,
              fontFamily: "var(--font-body)",
              transition: "all 0.3s",
            }}
          >
            {currentStep > s.num ? <CheckCircle size={16} /> : s.num}
          </div>
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: 0.5,
              color: currentStep >= s.num ? T.burgundy : T.warmGray,
              marginLeft: 6,
              fontFamily: "var(--font-body)",
              transition: "color 0.3s",
            }}
          >
            {s.label}
          </span>
          {i < steps.length - 1 && (
            <div
              style={{
                width: 48,
                height: 2,
                margin: "0 12px",
                background: currentStep > s.num ? T.burgundy : T.stone,
                borderRadius: 1,
                transition: "background 0.3s",
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

const INITIAL = {
  firstName: "",
  lastName: "",
  spouseFirst: "",
  spouseLast: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  zip: "",
  previousParish: "",
  children: "",
  sacraments: [],
  heardAbout: "",
  notes: "",
};

const REQUIRED_FIELDS = [
  "firstName",
  "lastName",
  "email",
  "phone",
  "address",
  "city",
  "state",
  "zip",
];

export default function Register() {
  const { t } = useTranslation();
  const [form, setForm] = useState(INITIAL);
  const [showSpouse, setShowSpouse] = useState(false);
  const [status, setStatus] = useState("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [errors, setErrors] = useState({});

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const validateField = (field) => {
    let err = "";
    const requiredError = t("contact.requiredError");
    if (REQUIRED_FIELDS.includes(field) && !String(form[field] || "").trim()) {
      err = requiredError;
    } else if (field === "email") {
      err = validateEmail(form.email, t("contact.emailError"));
    } else if (field === "phone") {
      err = validatePhone(form.phone, t("contact.phoneError"));
    }
    setErrors((prev) => {
      const next = { ...prev };
      if (err) next[field] = err;
      else delete next[field];
      return next;
    });
    return err;
  };

  const validateAll = () => {
    const requiredError = t("contact.requiredError");
    const next = {};
    REQUIRED_FIELDS.forEach((field) => {
      if (!String(form[field] || "").trim()) next[field] = requiredError;
    });
    const emailErr = next.email ? "" : validateEmail(form.email, t("contact.emailError"));
    const phoneErr = next.phone ? "" : validatePhone(form.phone, t("contact.phoneError"));
    if (emailErr) next.email = emailErr;
    if (phoneErr) next.phone = phoneErr;
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const toggleSacrament = (sac) => {
    setForm((f) => ({
      ...f,
      sacraments: f.sacraments.includes(sac)
        ? f.sacraments.filter((s) => s !== sac)
        : [...f.sacraments, sac],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateAll()) return;

    const payload = {
      ...form,
      formType: "registration",
      sacraments: form.sacraments.join(", "),
      spouse: showSpouse ? `${form.spouseFirst} ${form.spouseLast}`.trim() : "",
      timestamp: new Date().toISOString(),
    };

    if (!CONFIG.registrationFormUrl) {
      const body = [
        `Name: ${form.firstName} ${form.lastName}`,
        showSpouse ? `Spouse: ${form.spouseFirst} ${form.spouseLast}` : "",
        `Email: ${form.email}`,
        `Phone: ${form.phone}`,
        `Address: ${form.address}, ${form.city}, ${form.state} ${form.zip}`,
        form.previousParish ? `Previous Parish: ${form.previousParish}` : "",
        form.children ? `Children: ${form.children}` : "",
        form.sacraments.length ? `Sacraments: ${form.sacraments.join(", ")}` : "",
        form.heardAbout ? `Heard About Us: ${form.heardAbout}` : "",
        form.notes ? `Notes: ${form.notes}` : "",
      ]
        .filter(Boolean)
        .join("\n");
      window.location.href = `mailto:${CONFIG.email}?subject=${encodeURIComponent("New Church Registration")}&body=${encodeURIComponent(body)}`;
      return;
    }

    setStatus("sending");
    setStatusMessage("");
    const useProxy = Boolean(CONFIG.formProxyUrl);
    const url = useProxy ? CONFIG.formProxyUrl : CONFIG.registrationFormUrl;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);
      const res = await fetch(url, {
        method: "POST",
        // CORS mode when a proxy is configured — lets us read the real
        // server response. Otherwise no-cors fire-and-forget against the
        // raw Apps Script (which can't return CORS headers).
        ...(useProxy ? {} : { mode: "no-cors" }),
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (useProxy) {
        let result = {};
        try {
          result = await res.json();
        } catch {
          /* non-JSON body */
        }
        if (!res.ok || result.error) {
          throw new Error(result.error || `HTTP ${res.status}`);
        }
      }
      // no-cors path: the response is opaque; reaching this line means the
      // request left the browser. Phone fallback on the success card
      // covers silent server failures.
      setStatus("success");
      setStatusMessage(t("register.successTitle"));
      setForm(INITIAL);
      setShowSpouse(false);
      setErrors({});
    } catch (err) {
      setStatus("error");
      if (err.name === "AbortError") {
        setStatusMessage(t("register.timeoutError"));
      } else if (useProxy && err.message) {
        setStatusMessage(t("register.sendErrorWithReason", { reason: err.message }));
      } else {
        setStatusMessage(t("register.error"));
      }
    }
  };

  /* rough step tracker based on which fields are filled */
  const step = form.address ? 3 : form.firstName ? 2 : 1;
  const hasErrors = Object.keys(errors).length > 0;

  const SACRAMENT_OPTIONS = ["baptism", "firstCommunion", "confirmation", "marriage"];

  return (
    <div style={{ paddingTop: 76 }}>
      <Seo
        title="Church Registration"
        description="Register as a member at St. Dominic Catholic Church in Youngstown, Ohio."
        image={PHOTOS.homeHero}
      />
      <PageHeader title={t("register.title")} variant="text" />

      <Section bg={T.cream} id="registration-form">
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <p
            style={{
              fontSize: 16,
              lineHeight: 1.8,
              color: T.warmGray,
              textAlign: "center",
              marginBottom: 12,
            }}
          >
            {t("register.desc")}
          </p>

          {status === "success" ? (
            <div
              aria-live="polite"
              role="status"
              style={{
                background: "#eef6ec",
                border: "1px solid #c8e6c9",
                borderRadius: "var(--radius-card)",
                padding: "56px 40px",
                textAlign: "center",
                animation: "fadeInScale 0.4s ease",
              }}
            >
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background: "rgba(46,125,50,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 24px",
                }}
              >
                <CheckCircle size={40} color="#2e7d32" />
              </div>
              <h2
                style={{
                  fontSize: 28,
                  color: "#2e7d32",
                  fontWeight: 600,
                  fontFamily: "var(--font-display)",
                  marginBottom: 12,
                }}
              >
                {statusMessage || t("register.successTitle")}
              </h2>
              <p
                style={{
                  fontSize: 16,
                  color: "#388e3c",
                  lineHeight: 1.7,
                  maxWidth: 400,
                  margin: "0 auto",
                }}
              >
                {t("register.successDesc")}
              </p>
              <p
                style={{
                  fontSize: 14,
                  color: T.warmGray,
                  lineHeight: 1.6,
                  maxWidth: 420,
                  margin: "16px auto 0",
                }}
              >
                {t("register.successFallback") || (
                  <>
                    If you don't hear back within 2 business days, please call{" "}
                    <a href={CONFIG.phoneLink} style={{ color: T.burgundy, fontWeight: 600 }}>
                      {CONFIG.phone}
                    </a>
                    .
                  </>
                )}
              </p>
              <button
                onClick={() => {
                  setStatus("idle");
                  setStatusMessage("");
                }}
                style={{
                  marginTop: 28,
                  background: "none",
                  border: `1.5px solid #66bb6a`,
                  borderRadius: "var(--radius-card)",
                  padding: "12px 28px",
                  fontSize: 14,
                  color: "#2e7d32",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontFamily: "var(--font-body)",
                }}
              >
                {t("register.registerAnother") || "Register Another Family"}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <StepIndicator
                currentStep={step}
                labels={{
                  personal: t("register.steps.personal"),
                  contact: t("register.steps.contact"),
                  church: t("register.steps.church"),
                }}
              />

              <div style={{ display: "grid", gap: 20 }}>
                {hasErrors && (
                  <div
                    role="alert"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "12px 14px",
                      border: "1px solid #fecaca",
                      borderRadius: "var(--radius-card)",
                      background: "#fef2f2",
                      color: "#b91c1c",
                      fontSize: 14,
                      fontWeight: 600,
                    }}
                  >
                    <AlertCircle size={18} />
                    {t("register.errorSummary")}
                  </div>
                )}
                {/* ── Head of Household ── */}
                <FormSection icon={Users} title={t("register.headOfHousehold")} defaultOpen={true}>
                  <div
                    style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
                    className="reg-two-col"
                  >
                    <FloatingInput
                      label={t("register.firstName")}
                      required
                      value={form.firstName}
                      onChange={set("firstName")}
                      onBlurValidate={() => validateField("firstName")}
                      error={errors.firstName}
                      ariaLabel={t("register.firstName")}
                      ariaDescribedBy={errors.firstName ? "register-first-name-error" : undefined}
                    />
                    <FloatingInput
                      label={t("register.lastName")}
                      required
                      value={form.lastName}
                      onChange={set("lastName")}
                      onBlurValidate={() => validateField("lastName")}
                      error={errors.lastName}
                      ariaLabel={t("register.lastName")}
                      ariaDescribedBy={errors.lastName ? "register-last-name-error" : undefined}
                    />
                  </div>

                  {/* Spouse toggle */}
                  <button
                    type="button"
                    onClick={() => setShowSpouse(!showSpouse)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      background: showSpouse ? "rgba(107,29,42,0.04)" : "transparent",
                      border: `1.5px dashed ${showSpouse ? T.burgundy : T.stone}`,
                      borderRadius: "var(--radius-card)",
                      padding: "12px 20px",
                      fontSize: 14,
                      color: T.burgundy,
                      cursor: "pointer",
                      fontFamily: "var(--font-body)",
                      fontWeight: 600,
                      transition: "all 0.25s",
                    }}
                  >
                    <Heart size={16} fill={showSpouse ? T.burgundy : "none"} />
                    {showSpouse ? t("register.removeSpouse") : t("register.addSpouse")}
                  </button>

                  {showSpouse && (
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 16,
                        padding: "16px 20px",
                        background: "rgba(197,165,90,0.04)",
                        borderRadius: "var(--radius-card)",
                        border: `1px solid rgba(197,165,90,0.15)`,
                        animation: "fadeInScale 0.3s ease",
                      }}
                      className="reg-two-col"
                    >
                      <FloatingInput
                        label={`${t("register.spouse")} ${t("register.firstName")}`}
                        value={form.spouseFirst}
                        onChange={set("spouseFirst")}
                        ariaLabel={`${t("register.spouse")} ${t("register.firstName")}`}
                      />
                      <FloatingInput
                        label={`${t("register.spouse")} ${t("register.lastName")}`}
                        value={form.spouseLast}
                        onChange={set("spouseLast")}
                        ariaLabel={`${t("register.spouse")} ${t("register.lastName")}`}
                      />
                    </div>
                  )}
                </FormSection>

                {/* ── Contact Information ── */}
                <FormSection icon={HomeIcon} title={t("register.contactInfo")} defaultOpen={true}>
                  <div
                    style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
                    className="reg-two-col"
                  >
                    <FloatingInput
                      label={t("register.email")}
                      required
                      type="email"
                      value={form.email}
                      onChange={set("email")}
                      onBlurValidate={() => validateField("email")}
                      error={errors.email}
                      ariaLabel={t("register.email")}
                      ariaDescribedBy={errors.email ? "register-email-error" : undefined}
                    />
                    <FloatingInput
                      label={t("register.phone")}
                      required
                      type="tel"
                      value={form.phone}
                      onChange={set("phone")}
                      onBlurValidate={() => validateField("phone")}
                      error={errors.phone}
                      ariaLabel={t("register.phone")}
                      ariaDescribedBy={errors.phone ? "register-phone-error" : undefined}
                    />
                  </div>
                  <FloatingInput
                    label={t("register.address")}
                    required
                    value={form.address}
                    onChange={set("address")}
                    onBlurValidate={() => validateField("address")}
                    error={errors.address}
                    ariaLabel={t("register.address")}
                    ariaDescribedBy={errors.address ? "register-address-error" : undefined}
                  />
                  <div
                    style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 16 }}
                    className="reg-three-col"
                  >
                    <FloatingInput
                      label={t("register.city")}
                      required
                      value={form.city}
                      onChange={set("city")}
                      onBlurValidate={() => validateField("city")}
                      error={errors.city}
                      ariaLabel={t("register.city")}
                      ariaDescribedBy={errors.city ? "register-city-error" : undefined}
                    />
                    <FloatingInput
                      label={t("register.state")}
                      required
                      value={form.state}
                      onChange={set("state")}
                      maxLength={2}
                      onBlurValidate={() => validateField("state")}
                      error={errors.state}
                      ariaLabel={t("register.state")}
                      ariaDescribedBy={errors.state ? "register-state-error" : undefined}
                    />
                    <FloatingInput
                      label={t("register.zip")}
                      required
                      value={form.zip}
                      onChange={set("zip")}
                      maxLength={10}
                      onBlurValidate={() => validateField("zip")}
                      error={errors.zip}
                      ariaLabel={t("register.zip")}
                      ariaDescribedBy={errors.zip ? "register-zip-error" : undefined}
                    />
                  </div>
                </FormSection>

                {/* ── Parish Details ── */}
                <FormSection icon={Church} title={t("register.parishDetails")} defaultOpen={false}>
                  <FloatingInput
                    label={t("register.previousParish")}
                    value={form.previousParish}
                    onChange={set("previousParish")}
                    ariaLabel={t("register.previousParish")}
                  />
                  <FloatingInput
                    label={t("register.children")}
                    type="number"
                    value={form.children}
                    onChange={set("children")}
                    ariaLabel={t("register.children")}
                  />

                  {/* Sacraments */}
                  <div>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        letterSpacing: 0.5,
                        fontVariantCaps: "all-small-caps",
                        color: T.warmGray,
                        marginBottom: 12,
                        fontFamily: "var(--font-body)",
                      }}
                    >
                      {t("register.sacramentsReceived")}
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                      {SACRAMENT_OPTIONS.map((sac) => (
                        <SacramentPill
                          key={sac}
                          label={t(`register.sac_${sac}`)}
                          checked={form.sacraments.includes(sac)}
                          onChange={() => toggleSacrament(sac)}
                        />
                      ))}
                    </div>
                  </div>

                  <StyledSelect
                    label={t("register.heardAbout")}
                    value={form.heardAbout}
                    onChange={set("heardAbout")}
                    ariaLabel={t("register.heardAbout")}
                  >
                    <option value="">{t("register.selectOne")}</option>
                    <option value="word-of-mouth">{t("register.heard_word")}</option>
                    <option value="website">{t("register.heard_website")}</option>
                    <option value="social-media">{t("register.heard_social")}</option>
                    <option value="drove-by">{t("register.heard_drove")}</option>
                    <option value="other">{t("register.heard_other")}</option>
                  </StyledSelect>

                  <FloatingTextarea
                    label={t("register.notes")}
                    value={form.notes}
                    onChange={set("notes")}
                    placeholder={t("register.notesHint")}
                    ariaLabel={t("register.notes")}
                  />
                </FormSection>

                {/* ── Submit ── */}
                <p style={{ fontSize: 12.5, color: T.warmGray, lineHeight: 1.6 }}>
                  {t("register.privacy")}
                </p>
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="btn-hover"
                  style={{
                    background: status === "sending" ? T.warmGray : T.burgundy,
                    color: T.cream,
                    border: "none",
                    padding: "18px 40px",
                    fontSize: 15,
                    fontWeight: 600,
                    letterSpacing: 0.5,
                    textTransform: "uppercase",
                    borderRadius: "var(--radius-card)",
                    cursor: status === "sending" ? "wait" : "pointer",
                    fontFamily: "var(--font-body)",
                    minHeight: 56,
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                    transition: "all 0.3s ease",
                    boxShadow: status === "sending" ? "none" : "0 4px 20px rgba(107,29,42,0.25)",
                  }}
                >
                  {status === "sending" ? (
                    <>
                      <Loader2 size={20} style={{ animation: "spin 1s linear infinite" }} />
                      {t("register.sending")}
                    </>
                  ) : (
                    <>
                      <UserPlus size={18} />
                      {t("register.submit")}
                    </>
                  )}
                </button>
                {status === "error" && (
                  <div
                    aria-live="polite"
                    role="status"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      background: "#fef2f2",
                      border: "1px solid #fecaca",
                      borderRadius: "var(--radius-card)",
                      padding: "12px 16px",
                    }}
                  >
                    <AlertCircle size={18} color="#dc2626" />
                    <p style={{ color: "#dc2626", fontSize: 14, fontWeight: 500, margin: 0 }}>
                      {statusMessage || t("register.error")}
                    </p>
                  </div>
                )}
              </div>
            </form>
          )}
        </div>
      </Section>

      <style>{`
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @media (max-width: 560px) {
          .reg-two-col { grid-template-columns: 1fr !important; }
          .reg-three-col { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </div>
  );
}
