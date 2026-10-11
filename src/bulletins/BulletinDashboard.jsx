import { useState, useEffect, useCallback } from "react";
import { T } from "../constants/theme";
import {
  getCurrentUrl, setCurrentUrl,
  getArchive, saveEntry, removeEntry,
} from "./store";
import {
  Link2, Save, Plus, Trash2, Pencil, X, Check,
  FileText, ExternalLink, Newspaper,
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

function formatDate(str) {
  if (!str) return "—";
  const d = new Date(str + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

/* ── Inline entry form (add OR edit) ── */
function EntryForm({ initial = {}, onSave, onCancel, isNew }) {
  const [date, setDate] = useState(initial.date || "");
  const [label, setLabel] = useState(initial.label || "");
  const [url, setUrl] = useState(initial.url || "");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!date) e.date = "Required";
    if (!label.trim()) e.label = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave({ ...initial, date, label: label.trim(), url: url.trim() });
  };

  return (
    <div
      style={{
        padding: "18px 20px",
        background: `${T.burgundy}06`,
        border: `1.5px solid ${T.burgundy}30`,
        borderRadius: 10,
        display: "grid",
        gridTemplateColumns: "160px 1fr 1fr",
        gap: 12,
        alignItems: "end",
      }}
    >
      {/* Date */}
      <div>
        <label style={LABEL_STYLE}>Date *</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{ ...INPUT_STYLE, borderColor: errors.date ? T.error : T.stone }}
          onFocus={(e) => (e.target.style.borderColor = T.gold)}
          onBlur={(e) => (e.target.style.borderColor = errors.date ? T.error : T.stone)}
        />
        {errors.date && <p style={{ color: T.error, fontSize: 11, margin: "3px 0 0" }}>{errors.date}</p>}
      </div>

      {/* Label */}
      <div>
        <label style={LABEL_STYLE}>Label *</label>
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="e.g., Palm Sunday"
          style={{ ...INPUT_STYLE, borderColor: errors.label ? T.error : T.stone }}
          onFocus={(e) => (e.target.style.borderColor = T.gold)}
          onBlur={(e) => (e.target.style.borderColor = errors.label ? T.error : T.stone)}
        />
        {errors.label && <p style={{ color: T.error, fontSize: 11, margin: "3px 0 0" }}>{errors.label}</p>}
      </div>

      {/* URL */}
      <div>
        <label style={LABEL_STYLE}>Bulletin URL <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0, color: T.warmGray }}>(PDF or flipbook embed)</span></label>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://…"
          style={INPUT_STYLE}
          onFocus={(e) => (e.target.style.borderColor = T.gold)}
          onBlur={(e) => (e.target.style.borderColor = T.stone)}
        />
      </div>

      {/* Buttons */}
      <div
        style={{
          gridColumn: "1 / -1",
          display: "flex",
          gap: 8,
          justifyContent: "flex-end",
          marginTop: 4,
        }}
      >
        <button
          onClick={onCancel}
          style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "8px 16px", background: "none",
            border: `1.5px solid ${T.stone}`, borderRadius: 8,
            fontSize: 13, color: T.warmGray, cursor: "pointer",
            fontFamily: "var(--font-body)",
          }}
        >
          <X size={13} /> Cancel
        </button>
        <button
          onClick={handleSave}
          style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "8px 18px", background: T.burgundy,
            border: "none", borderRadius: 8,
            fontSize: 13, fontWeight: 600, color: "#fff", cursor: "pointer",
            fontFamily: "var(--font-body)",
          }}
        >
          <Check size={13} /> {isNew ? "Add" : "Save"}
        </button>
      </div>
    </div>
  );
}

/* ── Main Dashboard ── */
export default function BulletinDashboard({ onToast }) {
  // Current bulletin URL
  const [currentUrl, setCurrentUrlState] = useState(() => getCurrentUrl() || "");
  const [urlSaved, setUrlSaved] = useState(false);

  const handleSaveUrl = () => {
    setCurrentUrl(currentUrl);
    setUrlSaved(true);
    onToast?.({ message: "Current bulletin URL updated!", type: "success" });
    setTimeout(() => setUrlSaved(false), 2000);
  };

  // Archive
  const [archive, setArchive] = useState(() => getArchive());
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const refresh = useCallback(() => setArchive(getArchive()), []);

  const handleSaveEntry = (entry) => {
    saveEntry(entry);
    refresh();
    setShowAddForm(false);
    setEditingId(null);
    onToast?.({ message: entry.id ? "Bulletin updated!" : "Bulletin added!", type: "success" });
  };

  const handleDelete = (id, label) => {
    if (window.confirm(`Delete "${label}"?`)) {
      removeEntry(id);
      refresh();
      onToast?.({ message: "Bulletin deleted.", type: "success" });
    }
  };

  return (
    <div>
      {/* ── Header ── */}
      <div style={{ marginBottom: 32 }}>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 28,
            fontWeight: 600,
            color: T.softBlack,
            margin: 0,
          }}
        >
          Bulletin Manager
        </h2>
        <p style={{ fontFamily: "var(--font-body)", fontSize: 14, color: T.warmGray, margin: "4px 0 0" }}>
          Manage the current bulletin embed and the archive list shown on the Bulletin page.
        </p>
      </div>

      {/* ── Current Bulletin URL ── */}
      <div
        style={{
          background: "#fff",
          border: `1px solid ${T.stone}`,
          borderRadius: 12,
          padding: "24px 28px",
          marginBottom: 32,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <Link2 size={18} color={T.burgundy} />
          <h3
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 15,
              fontWeight: 700,
              letterSpacing: 0.5,
              color: T.softBlack,
              margin: 0,
              textTransform: "uppercase",
            }}
          >
            Current Bulletin URL
          </h3>
        </div>
        <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: T.warmGray, margin: "0 0 16px" }}>
          Paste the embed URL for this week's bulletin — usually from FlipHTML5, Issuu, or another flipbook/PDF host. It displays on the public Bulletin page.
        </p>

        <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
          <div style={{ flex: 1 }}>
            <input
              type="url"
              value={currentUrl}
              onChange={(e) => { setCurrentUrlState(e.target.value); setUrlSaved(false); }}
              placeholder="https://online.fliphtml5.com/…"
              style={INPUT_STYLE}
              onFocus={(e) => (e.target.style.borderColor = T.gold)}
              onBlur={(e) => (e.target.style.borderColor = T.stone)}
            />
          </div>
          <button
            onClick={handleSaveUrl}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              padding: "10px 20px",
              background: urlSaved ? "#2E7D32" : T.burgundy,
              color: "#fff",
              border: "none",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              fontFamily: "var(--font-body)",
              cursor: "pointer",
              transition: "background 0.2s",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            {urlSaved ? <Check size={15} /> : <Save size={15} />}
            {urlSaved ? "Saved!" : "Save URL"}
          </button>
        </div>

        {currentUrl && (
          <a
            href={currentUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              marginTop: 8,
              fontSize: 12,
              color: T.warmGray,
              textDecoration: "none",
            }}
          >
            <ExternalLink size={11} />
            Preview in new tab
          </a>
        )}
      </div>

      {/* ── Archive ── */}
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <FileText size={18} color={T.burgundy} />
            <h3
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 15,
                fontWeight: 700,
                letterSpacing: 0.5,
                color: T.softBlack,
                margin: 0,
                textTransform: "uppercase",
              }}
            >
              Archive
            </h3>
            <span
              style={{
                padding: "2px 8px",
                background: T.stoneLight,
                borderRadius: 12,
                fontSize: 12,
                color: T.warmGray,
                fontFamily: "var(--font-body)",
              }}
            >
              {archive.length}
            </span>
          </div>

          {!showAddForm && (
            <button
              onClick={() => { setShowAddForm(true); setEditingId(null); }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                padding: "8px 16px",
                background: T.burgundy,
                color: "#fff",
                border: "none",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                fontFamily: "var(--font-body)",
                cursor: "pointer",
              }}
            >
              <Plus size={14} /> Add Bulletin
            </button>
          )}
        </div>

        {/* Add form */}
        {showAddForm && (
          <div style={{ marginBottom: 12 }}>
            <EntryForm
              isNew
              onSave={handleSaveEntry}
              onCancel={() => setShowAddForm(false)}
            />
          </div>
        )}

        {/* List */}
        {archive.length === 0 && !showAddForm ? (
          <div
            style={{
              textAlign: "center",
              padding: "48px 24px",
              border: `1px dashed ${T.stone}`,
              borderRadius: 10,
              color: T.warmGray,
              fontFamily: "var(--font-body)",
            }}
          >
            <Newspaper size={36} style={{ opacity: 0.25, marginBottom: 12 }} />
            <p style={{ fontSize: 15, margin: "0 0 4px" }}>No archive entries yet</p>
            <p style={{ fontSize: 13 }}>
              Add past bulletins using the button above.
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {archive.map((b) =>
              editingId === b.id ? (
                <EntryForm
                  key={b.id}
                  initial={b}
                  onSave={handleSaveEntry}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <div
                  key={b.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    padding: "14px 18px",
                    background: "#fff",
                    border: `1px solid ${T.stone}`,
                    borderRadius: 10,
                  }}
                >
                  {/* Date badge */}
                  <div
                    style={{
                      minWidth: 52,
                      textAlign: "center",
                      padding: "6px 0",
                      background: `${T.burgundy}0d`,
                      borderRadius: 8,
                      flexShrink: 0,
                    }}
                  >
                    <div style={{ fontSize: 18, fontWeight: 700, fontFamily: "var(--font-display)", color: T.burgundy, lineHeight: 1 }}>
                      {b.date ? new Date(b.date + "T00:00:00").getDate() : "—"}
                    </div>
                    <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1, color: T.warmGray, marginTop: 2 }}>
                      {b.date ? new Date(b.date + "T00:00:00").toLocaleDateString("en-US", { month: "short" }) : ""}
                    </div>
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: 15, fontWeight: 600, color: T.softBlack }}>
                      {b.label || "Untitled"}
                    </div>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: T.warmGray, marginTop: 2 }}>
                      {formatDate(b.date)}
                    </div>
                  </div>

                  {/* URL status */}
                  <div style={{ flexShrink: 0 }}>
                    {b.url ? (
                      <a
                        href={b.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          display: "inline-flex", alignItems: "center", gap: 4,
                          fontSize: 12, fontWeight: 600, color: T.burgundy,
                          textDecoration: "none",
                        }}
                      >
                        <ExternalLink size={12} /> View
                      </a>
                    ) : (
                      <span style={{ fontSize: 12, color: T.warmGray, fontStyle: "italic" }}>No link</span>
                    )}
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                    <button
                      onClick={() => { setEditingId(b.id); setShowAddForm(false); }}
                      title="Edit"
                      style={{
                        background: "none", border: "none", cursor: "pointer",
                        color: T.warmGray, padding: 6, display: "flex",
                        borderRadius: 6, transition: "background 0.15s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = T.stoneLight)}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(b.id, b.label)}
                      title="Delete"
                      style={{
                        background: "none", border: "none", cursor: "pointer",
                        color: T.warmGray, padding: 6, display: "flex",
                        borderRadius: 6, transition: "all 0.15s",
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "#fde8e8"; e.currentTarget.style.color = T.error; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = T.warmGray; }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        )}

        {archive.length > 0 && (
          <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: T.warmGray, marginTop: 12, textAlign: "center" }}>
            Entries are automatically sorted newest first.
          </p>
        )}
      </div>
    </div>
  );
}
