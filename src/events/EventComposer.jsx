import { useState } from "react";
import { T } from "../constants/theme";
import { CATEGORIES } from "./store";
import { ArrowLeft, Trash2, Save } from "lucide-react";

const INPUT = {
  width: "100%",
  padding: "10px 14px",
  fontSize: 14,
  fontFamily: "var(--font-body)",
  border: `1.5px solid ${T.stone}`,
  borderRadius: 8,
  outline: "none",
  boxSizing: "border-box",
  background: "#fff",
  color: T.charcoal,
};

const LABEL = {
  display: "block",
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: 1.5,
  textTransform: "uppercase",
  color: T.warmGray,
  marginBottom: 6,
  fontFamily: "var(--font-body)",
};

function Field({ label, children, span = 1 }) {
  return (
    <div style={{ gridColumn: `span ${span}` }}>
      <label style={LABEL}>{label}</label>
      {children}
    </div>
  );
}

export default function EventComposer({ event, onSave, onDelete, onCancel }) {
  const isEditing = !!event;
  const [date, setDate] = useState(event?.date || "");
  const [title, setTitle] = useState(event?.title || "");
  const [description, setDescription] = useState(event?.description || "");
  const [category, setCategory] = useState(event?.category || "other");
  const [time, setTime] = useState(event?.time || "");
  const [location, setLocation] = useState(event?.location || "");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!title.trim()) e.title = "Title required";
    if (!date) e.date = "Date required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave({
      ...(event || {}),
      date,
      title: title.trim(),
      description: description.trim(),
      category,
      time: time.trim(),
      location: location.trim(),
    });
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
        <button onClick={onCancel} style={{ background: "none", border: "none", color: T.warmGray, cursor: "pointer", display: "flex", padding: 4 }} aria-label="Back">
          <ArrowLeft size={20} />
        </button>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 600, color: T.softBlack, margin: 0 }}>
          {isEditing ? "Edit Event" : "New Event"}
        </h2>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20, marginBottom: 24 }}>
        <Field label="Title" span={2}>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Event title"
            style={{ ...INPUT, borderColor: errors.title ? T.error : T.stone }}
          />
          {errors.title && <p style={{ color: T.error, fontSize: 12, margin: "4px 0 0" }}>{errors.title}</p>}
        </Field>
        <Field label="Date">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{ ...INPUT, borderColor: errors.date ? T.error : T.stone }}
          />
          {errors.date && <p style={{ color: T.error, fontSize: 12, margin: "4px 0 0" }}>{errors.date}</p>}
        </Field>
        <Field label="Time">
          <input value={time} onChange={(e) => setTime(e.target.value)} placeholder="Optional — e.g., 7:00 PM" style={INPUT} />
        </Field>
        <Field label="Category">
          <select value={category} onChange={(e) => setCategory(e.target.value)} style={INPUT}>
            {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </Field>
        <Field label="Location">
          <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g., Church" style={INPUT} />
        </Field>
        <Field label="Description" span={2}>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="Brief description…"
            style={{ ...INPUT, resize: "vertical" }}
          />
        </Field>
      </div>

      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", paddingTop: 16, borderTop: `1px solid ${T.stoneLight}` }}>
        <button
          onClick={handleSave}
          style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "11px 28px", background: T.burgundy, color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, fontFamily: "var(--font-body)", cursor: "pointer" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = T.burgundyDark)}
          onMouseLeave={(e) => (e.currentTarget.style.background = T.burgundy)}
        >
          <Save size={16} />
          {isEditing ? "Save Changes" : "Create Event"}
        </button>
        <button onClick={onCancel} style={{ padding: "11px 24px", background: "none", color: T.warmGray, border: `1.5px solid ${T.stone}`, borderRadius: 8, fontSize: 14, fontWeight: 500, fontFamily: "var(--font-body)", cursor: "pointer" }}>
          Cancel
        </button>
        {isEditing && (
          <button
            onClick={() => { if (window.confirm("Delete this event permanently?")) onDelete(event.id); }}
            style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 6, padding: "11px 20px", background: "none", color: T.error, border: "1.5px solid transparent", borderRadius: 8, fontSize: 14, fontWeight: 500, fontFamily: "var(--font-body)", cursor: "pointer" }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = T.error)}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "transparent")}
          >
            <Trash2 size={15} /> Delete
          </button>
        )}
      </div>
    </div>
  );
}
