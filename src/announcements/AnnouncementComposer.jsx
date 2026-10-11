import { useState } from "react";
import { createPortal } from "react-dom";
import { T } from "../constants/theme";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Trash2,
  Save,
  Megaphone,
  Bell,
  X,
} from "lucide-react";

/* ── Shared styles ── */

const INPUT_STYLE = {
  width: "100%",
  padding: "10px 14px",
  fontSize: 14,
  fontFamily: "var(--font-body)",
  border: `1.5px solid ${T.stone}`,
  borderRadius: 8,
  outline: "none",
  transition: "border-color 0.2s",
  boxSizing: "border-box",
  background: "#fff",
  color: T.charcoal,
};

const LABEL_STYLE = {
  display: "block",
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: 1.5,
  textTransform: "uppercase",
  color: T.warmGray,
  marginBottom: 6,
  fontFamily: "var(--font-body)",
};

function Field({ label, children, span = 1, hint }) {
  return (
    <div style={{ gridColumn: `span ${span}` }}>
      <label style={LABEL_STYLE}>{label}</label>
      {children}
      {hint && (
        <p
          style={{
            fontSize: 11,
            color: T.warmGray,
            margin: "4px 0 0",
            fontFamily: "var(--font-body)",
          }}
        >
          {hint}
        </p>
      )}
    </div>
  );
}

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const RECURRENCE_OPTIONS = [
  { value: "none", label: "Every day in range" },
  { value: "weekly", label: "Specific weekdays…" },
  { value: "first-friday", label: "First Friday of each month" },
  { value: "first-saturday", label: "First Saturday of each month" },
];

/* ── Inline Preview ── */

function BannerPreview({ data }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        background: T.burgundy,
        color: "#fff",
        padding: "8px 48px 8px 16px",
        fontSize: 13,
        fontFamily: "var(--font-body)",
        fontWeight: 500,
        textAlign: "center",
        position: "relative",
        lineHeight: 1.4,
        borderRadius: 8,
      }}
    >
      <Megaphone size={14} style={{ flexShrink: 0, opacity: 0.8 }} />
      <span>
        <strong style={{ marginRight: 6 }}>{data.title || "Banner Title"}</strong>
        <span style={{ opacity: 0.9 }}>
          {data.body || "Banner body text…"}
          {data.linkUrl && (
            <span
              style={{
                marginLeft: 8,
                textDecoration: "underline",
                fontWeight: 600,
                color: T.goldLight,
              }}
            >
              {data.linkText || "Learn More"}
            </span>
          )}
        </span>
      </span>
      <span
        style={{
          position: "absolute",
          right: 12,
          top: "50%",
          transform: "translateY(-50%)",
          color: "rgba(255,255,255,0.5)",
        }}
      >
        <X size={14} />
      </span>
    </div>
  );
}

function PopupPreview({ data }) {
  return (
    <div
      style={{
        maxWidth: 400,
        margin: "0 auto",
        background: "#fff",
        borderRadius: 16,
        padding: "32px 28px 28px",
        border: `1px solid ${T.stone}`,
        boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
        position: "relative",
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 12,
          right: 12,
          color: T.warmGray,
        }}
      >
        <X size={18} />
      </span>
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          background: `${T.burgundy}12`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 14,
        }}
      >
        <Bell size={20} color={T.burgundy} />
      </div>
      <h3
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 22,
          fontWeight: 600,
          color: T.softBlack,
          margin: "0 0 6px",
        }}
      >
        {data.title || "Popup Title"}
      </h3>
      <div
        style={{
          width: 32,
          height: 2,
          background: T.gold,
          borderRadius: 1,
          marginBottom: 10,
        }}
      />
      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: 14,
          lineHeight: 1.6,
          color: T.charcoal,
          margin: "0 0 16px",
        }}
      >
        {data.body || "Popup body text goes here…"}
      </p>
      <div style={{ display: "flex", gap: 8 }}>
        {data.linkUrl && (
          <span
            style={{
              padding: "8px 18px",
              background: T.burgundy,
              color: "#fff",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              fontFamily: "var(--font-body)",
            }}
          >
            {data.linkText || "Learn More"}
          </span>
        )}
        <span
          style={{
            padding: "8px 18px",
            border: `1.5px solid ${T.stone}`,
            borderRadius: 8,
            fontSize: 13,
            color: T.warmGray,
            fontFamily: "var(--font-body)",
          }}
        >
          Dismiss
        </span>
      </div>
    </div>
  );
}

/* ── Delete Confirmation Modal ── */

function DeleteConfirmModal({ onConfirm, onCancel }) {
  return createPortal(
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10001,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(26,23,20,0.45)",
        backdropFilter: "blur(2px)",
        padding: 24,
      }}
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: "28px 24px 20px",
          maxWidth: 360,
          width: "100%",
          boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
          textAlign: "center",
        }}
      >
        <Trash2
          size={32}
          color={T.error}
          style={{ marginBottom: 12 }}
        />
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 20,
            fontWeight: 600,
            color: T.softBlack,
            margin: "0 0 8px",
          }}
        >
          Delete Announcement?
        </h3>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 14,
            color: T.warmGray,
            margin: "0 0 20px",
          }}
        >
          This action cannot be undone.
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <button
            onClick={onCancel}
            style={{
              padding: "9px 20px",
              border: `1.5px solid ${T.stone}`,
              borderRadius: 8,
              background: "none",
              fontSize: 14,
              fontWeight: 500,
              fontFamily: "var(--font-body)",
              color: T.warmGray,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: "9px 20px",
              border: "none",
              borderRadius: 8,
              background: T.error,
              fontSize: 14,
              fontWeight: 600,
              fontFamily: "var(--font-body)",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

/* ── Main Composer ── */

export default function AnnouncementComposer({ announcement, onSave, onDelete, onCancel }) {
  const isEditing = !!announcement;

  const [title, setTitle] = useState(announcement?.title || "");
  const [body, setBody] = useState(announcement?.body || "");
  const [type, setType] = useState(announcement?.type || "banner");
  const [linkUrl, setLinkUrl] = useState(announcement?.linkUrl || "");
  const [linkText, setLinkText] = useState(announcement?.linkText || "Learn More");
  const [startDate, setStartDate] = useState(
    announcement?.startDate || new Date().toISOString().slice(0, 10)
  );
  const [endDate, setEndDate] = useState(announcement?.endDate || "");
  const [recType, setRecType] = useState(announcement?.recurrence?.type || "none");
  const [recDays, setRecDays] = useState(announcement?.recurrence?.days || []);
  const [active, setActive] = useState(announcement?.active ?? true);
  const [showPreview, setShowPreview] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [errors, setErrors] = useState({});

  const toggleDay = (day) => {
    setRecDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort()
    );
  };

  const validate = () => {
    const e = {};
    if (!title.trim()) e.title = "Title is required";
    if (!body.trim()) e.body = "Body is required";
    if (!startDate) e.startDate = "Start date is required";
    if (!endDate) e.endDate = "End date is required";
    if (startDate && endDate && startDate > endDate) e.endDate = "End date must be after start";
    if (recType === "weekly" && recDays.length === 0) e.recDays = "Select at least one day";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave({
      ...(announcement || {}),
      title: title.trim(),
      body: body.trim(),
      type,
      linkUrl: linkUrl.trim(),
      linkText: linkText.trim() || "Learn More",
      startDate,
      endDate,
      recurrence: { type: recType, days: recType === "weekly" ? recDays : [] },
      active,
    });
  };

  const previewData = { title, body, type, linkUrl, linkText };

  return (
    <div>
      {/* Back / title bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 28,
        }}
      >
        <button
          onClick={onCancel}
          style={{
            background: "none",
            border: "none",
            color: T.warmGray,
            cursor: "pointer",
            display: "flex",
            padding: 4,
          }}
          aria-label="Back to dashboard"
        >
          <ArrowLeft size={20} />
        </button>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 26,
            fontWeight: 600,
            color: T.softBlack,
            margin: 0,
          }}
        >
          {isEditing ? "Edit Announcement" : "New Announcement"}
        </h2>
      </div>

      {/* Form grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 20,
          marginBottom: 24,
        }}
      >
        {/* Title */}
        <Field label="Title" span={2}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Holiday Mass Schedule"
            style={{
              ...INPUT_STYLE,
              borderColor: errors.title ? T.error : T.stone,
            }}
            onFocus={(e) => (e.target.style.borderColor = T.gold)}
            onBlur={(e) =>
              (e.target.style.borderColor = errors.title ? T.error : T.stone)
            }
          />
          {errors.title && (
            <p style={{ color: T.error, fontSize: 12, margin: "4px 0 0" }}>
              {errors.title}
            </p>
          )}
        </Field>

        {/* Body */}
        <Field label="Body" span={2} hint="Keep it short (1–2 sentences). Long text doesn't fit on mobile or in the popup card.">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Brief announcement text…"
            rows={3}
            style={{
              ...INPUT_STYLE,
              resize: "vertical",
              borderColor: errors.body ? T.error : T.stone,
            }}
            onFocus={(e) => (e.target.style.borderColor = T.gold)}
            onBlur={(e) =>
              (e.target.style.borderColor = errors.body ? T.error : T.stone)
            }
          />
          {errors.body && (
            <p style={{ color: T.error, fontSize: 12, margin: "4px 0 0" }}>
              {errors.body}
            </p>
          )}
        </Field>

        {/* Type */}
        <Field label="Display Type" hint="Banner: thin strip always visible at the top. Popup: modal card that grabs attention once per session.">
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            style={INPUT_STYLE}
          >
            <option value="banner">Banner (top strip)</option>
            <option value="popup">Popup (modal card)</option>
          </select>
        </Field>

        {/* Active */}
        <Field label="Status">
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 14px",
              border: `1.5px solid ${T.stone}`,
              borderRadius: 8,
              cursor: "pointer",
              fontFamily: "var(--font-body)",
              fontSize: 14,
              color: T.charcoal,
              background: "#fff",
            }}
          >
            <input
              type="checkbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              style={{ accentColor: T.burgundy, width: 16, height: 16 }}
            />
            Active
          </label>
        </Field>

        {/* Link URL */}
        <Field label="Link URL" hint="Optional — makes the announcement clickable.">
          <input
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="https://…"
            style={INPUT_STYLE}
            onFocus={(e) => (e.target.style.borderColor = T.gold)}
            onBlur={(e) => (e.target.style.borderColor = T.stone)}
          />
        </Field>

        {/* Link Text */}
        <Field label="Link Text">
          <input
            type="text"
            value={linkText}
            onChange={(e) => setLinkText(e.target.value)}
            placeholder="Learn More"
            style={INPUT_STYLE}
            onFocus={(e) => (e.target.style.borderColor = T.gold)}
            onBlur={(e) => (e.target.style.borderColor = T.stone)}
          />
        </Field>

        {/* Start date */}
        <Field label="Start Date">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={{
              ...INPUT_STYLE,
              borderColor: errors.startDate ? T.error : T.stone,
            }}
            onFocus={(e) => (e.target.style.borderColor = T.gold)}
            onBlur={(e) =>
              (e.target.style.borderColor = errors.startDate ? T.error : T.stone)
            }
          />
          {errors.startDate && (
            <p style={{ color: T.error, fontSize: 12, margin: "4px 0 0" }}>
              {errors.startDate}
            </p>
          )}
        </Field>

        {/* End date */}
        <Field label="End Date">
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={{
              ...INPUT_STYLE,
              borderColor: errors.endDate ? T.error : T.stone,
            }}
            onFocus={(e) => (e.target.style.borderColor = T.gold)}
            onBlur={(e) =>
              (e.target.style.borderColor = errors.endDate ? T.error : T.stone)
            }
          />
          {errors.endDate && (
            <p style={{ color: T.error, fontSize: 12, margin: "4px 0 0" }}>
              {errors.endDate}
            </p>
          )}
        </Field>

        {/* Recurrence */}
        <Field label="Recurrence" span={2} hint="Controls which days inside the start/end range the announcement actually shows. “Every day” = visible the whole range; “Specific weekdays” = only on the days you pick; “First Friday/Saturday of month” = only the first occurrence each month.">
          <select
            value={recType}
            onChange={(e) => setRecType(e.target.value)}
            style={INPUT_STYLE}
          >
            {RECURRENCE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </Field>

        {/* Weekly day picker */}
        {recType === "weekly" && (
          <Field label="Show on These Days" span={2}>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {DAY_NAMES.map((name, idx) => {
                const selected = recDays.includes(idx);
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => toggleDay(idx)}
                    style={{
                      padding: "8px 14px",
                      borderRadius: 8,
                      border: `1.5px solid ${selected ? T.burgundy : T.stone}`,
                      background: selected ? `${T.burgundy}12` : "#fff",
                      color: selected ? T.burgundy : T.warmGray,
                      fontWeight: selected ? 600 : 400,
                      fontSize: 13,
                      fontFamily: "var(--font-body)",
                      cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                  >
                    {name}
                  </button>
                );
              })}
            </div>
            {errors.recDays && (
              <p style={{ color: T.error, fontSize: 12, margin: "4px 0 0" }}>
                {errors.recDays}
              </p>
            )}
          </Field>
        )}
      </div>

      {/* Preview toggle */}
      <div style={{ marginBottom: 24 }}>
        <button
          onClick={() => setShowPreview((v) => !v)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 16px",
            border: `1.5px solid ${T.stone}`,
            borderRadius: 8,
            background: showPreview ? `${T.burgundy}08` : "transparent",
            color: T.warmGray,
            fontSize: 13,
            fontWeight: 500,
            fontFamily: "var(--font-body)",
            cursor: "pointer",
            transition: "all 0.15s",
          }}
        >
          {showPreview ? <EyeOff size={14} /> : <Eye size={14} />}
          {showPreview ? "Hide Preview" : "Show Preview"}
        </button>

        {showPreview && (
          <div
            style={{
              marginTop: 16,
              padding: 24,
              background: T.cream,
              borderRadius: 12,
              border: `1px solid ${T.stone}`,
            }}
          >
            <p
              style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                color: T.warmGray,
                marginBottom: 12,
                fontFamily: "var(--font-body)",
              }}
            >
              Preview — {type === "banner" ? "Banner Strip" : "Popup Card"}
            </p>
            {type === "banner" ? (
              <BannerPreview data={previewData} />
            ) : (
              <PopupPreview data={previewData} />
            )}
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          flexWrap: "wrap",
          paddingTop: 16,
          borderTop: `1px solid ${T.stoneLight}`,
        }}
      >
        <button
          onClick={handleSave}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "11px 28px",
            background: T.burgundy,
            color: "#fff",
            border: "none",
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 600,
            fontFamily: "var(--font-body)",
            cursor: "pointer",
            transition: "background 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = T.burgundyDark)}
          onMouseLeave={(e) => (e.currentTarget.style.background = T.burgundy)}
        >
          <Save size={16} />
          {isEditing ? "Save Changes" : "Create Announcement"}
        </button>

        <button
          onClick={onCancel}
          style={{
            padding: "11px 24px",
            background: "none",
            color: T.warmGray,
            border: `1.5px solid ${T.stone}`,
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 500,
            fontFamily: "var(--font-body)",
            cursor: "pointer",
          }}
        >
          Cancel
        </button>

        {isEditing && (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            style={{
              marginLeft: "auto",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "11px 20px",
              background: "none",
              color: T.error,
              border: "1.5px solid transparent",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 500,
              fontFamily: "var(--font-body)",
              cursor: "pointer",
              transition: "border-color 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = T.error)}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "transparent")}
          >
            <Trash2 size={15} />
            Delete
          </button>
        )}
      </div>

      {showDeleteConfirm && (
        <DeleteConfirmModal
          onConfirm={() => {
            setShowDeleteConfirm(false);
            onDelete(announcement.id);
          }}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
    </div>
  );
}
