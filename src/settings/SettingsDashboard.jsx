import { useState } from "react";
import { T } from "../constants/theme";
import { getAll, saveAll, PLATFORMS, newSocial } from "./store";
import { CONFIG } from "../constants/config";
import { Plus, Trash2, Save, Phone, Share2, ArrowUp, ArrowDown, ToggleLeft, ToggleRight } from "lucide-react";

const INPUT = {
  width: "100%",
  padding: "10px 14px",
  fontSize: 14,
  fontFamily: "var(--font-body)",
  border: `1.5px solid ${T.stone}`,
  borderRadius: 8,
  outline: "none",
  background: "#fff",
  color: T.charcoal,
  boxSizing: "border-box",
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

const CONTACT_FIELDS = [
  { key: "phone", label: "Phone", placeholder: "(330) 555-1234" },
  { key: "phoneLink", label: "Phone Link", placeholder: "tel:+13305551234" },
  { key: "fax", label: "Fax", placeholder: "(330) 555-5678" },
  { key: "email", label: "Email", placeholder: "office@example.org" },
  { key: "address", label: "Address", placeholder: "123 Main St" },
  { key: "city", label: "City" },
  { key: "state", label: "State" },
  { key: "zip", label: "Zip" },
  { key: "officeHours", label: "Office Hours", placeholder: "Mon–Fri, 9–5" },
];

export default function SettingsDashboard({ onToast }) {
  const stored = getAll() || {};
  const initialContact = { ...CONFIG, ...(stored.contact || {}) };
  const [contact, setContact] = useState(() => {
    const base = {};
    CONTACT_FIELDS.forEach((f) => { base[f.key] = initialContact[f.key] || ""; });
    return base;
  });
  const [social, setSocial] = useState(stored.social || []);
  const [dirty, setDirty] = useState(false);

  const updateContact = (k, v) => {
    setContact({ ...contact, [k]: v });
    setDirty(true);
  };

  const updateSocial = (idx, field, val) => {
    setSocial(social.map((s, i) => (i === idx ? { ...s, [field]: val } : s)));
    setDirty(true);
  };

  const addSocial = () => {
    setSocial([...social, { ...newSocial(), order: social.length }]);
    setDirty(true);
  };

  const removeSocial = (idx) => {
    setSocial(social.filter((_, i) => i !== idx));
    setDirty(true);
  };

  const moveSocial = (idx, dir) => {
    const target = idx + dir;
    if (target < 0 || target >= social.length) return;
    const next = [...social];
    [next[idx], next[target]] = [next[target], next[idx]];
    setSocial(next.map((s, i) => ({ ...s, order: i })));
    setDirty(true);
  };

  const toggleSocial = (idx) => {
    updateSocial(idx, "active", !social[idx].active);
  };

  const handleSave = () => {
    saveAll({ contact, social: social.map((s, i) => ({ ...s, order: i })) });
    setDirty(false);
    onToast?.({ message: "Settings saved!", type: "success" });
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 24 }}>
        <div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 600, color: T.softBlack, margin: 0 }}>Site Settings</h2>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 14, color: T.warmGray, margin: "4px 0 0" }}>
            Parish contact info (shown in the footer and Contact page) and social media links.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={!dirty}
          style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 20px", background: dirty ? T.burgundy : T.stone, color: dirty ? "#fff" : T.warmGray, border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, fontFamily: "var(--font-body)", cursor: dirty ? "pointer" : "default" }}
        >
          <Save size={16} /> Save Changes
        </button>
      </div>

      {/* Contact Info */}
      <div style={{ background: "#fff", border: `1px solid ${T.stone}`, borderRadius: 10, padding: 24, marginBottom: 20 }}>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 600, color: T.softBlack, margin: "0 0 16px", display: "flex", alignItems: "center", gap: 8 }}>
          <Phone size={18} color={T.burgundy} /> Contact Information
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
          {CONTACT_FIELDS.map((f) => (
            <div key={f.key}>
              <label style={LABEL}>{f.label}</label>
              <input
                value={contact[f.key] || ""}
                onChange={(e) => updateContact(f.key, e.target.value)}
                placeholder={f.placeholder || ""}
                style={INPUT}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Social Accounts */}
      <div style={{ background: "#fff", border: `1px solid ${T.stone}`, borderRadius: 10, padding: 24 }}>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 600, color: T.softBlack, margin: "0 0 16px", display: "flex", alignItems: "center", gap: 8 }}>
          <Share2 size={18} color={T.burgundy} /> Social Media Accounts
        </h3>
        <p style={{ fontSize: 13, color: T.warmGray, marginTop: 0, marginBottom: 16, fontFamily: "var(--font-body)" }}>
          These appear on the public <strong>Connect</strong> page (where visitors find ways to follow the parish online) and in the site footer. Toggle the switch to hide an account without deleting it.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {social.length === 0 && (
            <div style={{ textAlign: "center", padding: "24px", color: T.warmGray, fontSize: 13, fontFamily: "var(--font-body)" }}>
              No social accounts yet. Add one below.
            </div>
          )}
          {social.map((s, idx) => (
            <div key={s.id} style={{ display: "grid", gridTemplateColumns: "auto 140px 1fr 1.5fr 1.5fr auto auto", gap: 8, alignItems: "center" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <button onClick={() => moveSocial(idx, -1)} disabled={idx === 0} style={{ background: "none", border: "none", padding: 2, cursor: idx === 0 ? "default" : "pointer", color: idx === 0 ? T.stoneLight : T.warmGray }}>
                  <ArrowUp size={13} />
                </button>
                <button onClick={() => moveSocial(idx, 1)} disabled={idx === social.length - 1} style={{ background: "none", border: "none", padding: 2, cursor: idx === social.length - 1 ? "default" : "pointer", color: idx === social.length - 1 ? T.stoneLight : T.warmGray }}>
                  <ArrowDown size={13} />
                </button>
              </div>
              <select value={s.platform} onChange={(e) => updateSocial(idx, "platform", e.target.value)} style={INPUT}>
                {PLATFORMS.map((p) => <option key={p.value} value={p.value}>{p.value}</option>)}
              </select>
              <input value={s.handle} onChange={(e) => updateSocial(idx, "handle", e.target.value)} placeholder="@handle" style={INPUT} />
              <input value={s.url} onChange={(e) => updateSocial(idx, "url", e.target.value)} placeholder="https://…" style={INPUT} />
              <input value={s.description || ""} onChange={(e) => updateSocial(idx, "description", e.target.value)} placeholder="Short description" style={INPUT} />
              <button onClick={() => toggleSocial(idx)} title={s.active ? "Deactivate" : "Activate"} style={{ background: "none", border: "none", cursor: "pointer", color: s.active ? "#1a7d42" : T.warmGray, padding: 4 }}>
                {s.active ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
              </button>
              <button onClick={() => removeSocial(idx)} style={{ background: "none", border: "none", color: T.warmGray, cursor: "pointer", padding: 6 }} aria-label="Remove">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={addSocial}
          style={{ marginTop: 12, display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px", background: "transparent", color: T.burgundy, border: `1.5px dashed ${T.stone}`, borderRadius: 6, fontSize: 13, fontWeight: 500, fontFamily: "var(--font-body)", cursor: "pointer" }}
        >
          <Plus size={14} /> Add Social Account
        </button>
      </div>
    </div>
  );
}
