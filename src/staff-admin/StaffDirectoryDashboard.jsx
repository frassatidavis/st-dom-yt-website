import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { T } from "../constants/theme";
import { getAll, saveAll, clearAll } from "./store";
import { friars as fallbackFriars, staff as fallbackStaff } from "../data/staff";
import { Plus, Trash2, Save, RotateCcw, Users, Info } from "lucide-react";

const INPUT = {
  width: "100%",
  padding: "8px 12px",
  fontSize: 14,
  fontFamily: "var(--font-body)",
  border: `1.5px solid ${T.stone}`,
  borderRadius: 6,
  outline: "none",
  background: "#fff",
  color: T.charcoal,
  boxSizing: "border-box",
};

const LABEL = {
  display: "block",
  fontSize: 11,
  letterSpacing: 1,
  textTransform: "uppercase",
  color: T.warmGray,
  fontWeight: 600,
  marginBottom: 4,
  fontFamily: "var(--font-body)",
};

// Role keys understood by the public Staff page.
// Friars: "pastor" and "associate" show in the Leadership section; any other
// value routes the friar to In Residence (including the "inResidence" key).
const FRIAR_ROLES = [
  { value: "pastor", label: "Pastor (Leadership)" },
  { value: "associate", label: "Parochial Vicar / Associate (Leadership)" },
  { value: "inResidence", label: "In Residence" },
];

const STAFF_ROLES = [
  { value: "parishSecretary", label: "Church Secretary" },
  { value: "musicDirector", label: "Music Director" },
  { value: "religiousEdCoordinator", label: "Coordinator of Religious Education" },
  { value: "parochialAssistant", label: "Parochial Assistant" },
  { value: "other", label: "Other (use Display title)" },
];

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

// Normalize rows coming out of storage: old records may have free-text values
// in `role`. Move anything that isn't a known enum key into `title` so the
// filter on the public Staff page still places the person correctly.
function migrateRows(rows, knownRoles) {
  if (!Array.isArray(rows)) return rows;
  const known = new Set(knownRoles.map((r) => r.value));
  return rows.map((row) => {
    const role = row.role || "";
    if (known.has(role)) return row;
    // Unknown role string → treat as a custom display title.
    return {
      ...row,
      role: "", // admin must pick from the dropdown
      title: row.title || role,
    };
  });
}

function GroupEditor({ label, rows, onChange, roles, hint }) {
  const update = (idx, field, val) => {
    const next = rows.map((r, i) => (i === idx ? { ...r, [field]: val } : r));
    onChange(next);
  };

  const addRow = () =>
    onChange([...rows, { id: generateId(), name: "", role: "", title: "", photo: "" }]);
  const removeRow = (idx) => onChange(rows.filter((_, i) => i !== idx));

  return (
    <div style={{ background: "#fff", border: `1px solid ${T.stone}`, borderRadius: 10, padding: 20, marginBottom: 16 }}>
      <h3 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 600, color: T.softBlack, margin: "0 0 8px", display: "flex", alignItems: "center", gap: 8 }}>
        <Users size={18} color={T.burgundy} /> {label}
      </h3>

      {hint && (
        <div style={{ display: "flex", gap: 8, alignItems: "flex-start", background: "#FDF7E3", border: `1px solid ${T.gold}`, borderRadius: 6, padding: "10px 12px", marginBottom: 14, fontSize: 13, color: T.softBlack, lineHeight: 1.5 }}>
          <Info size={14} color={T.burgundyDark} style={{ marginTop: 2, flexShrink: 0 }} />
          <span>{hint}</span>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {rows.map((row, idx) => {
          const needsTitle = row.role === "other" || row.role === "inResidence" || !row.role;
          return (
            <div key={row.id || idx} style={{ border: `1px solid ${T.stone}`, borderRadius: 8, padding: 14, background: "#FAFAF7" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 10, alignItems: "flex-end" }}>
                <div>
                  <label style={LABEL}>Name</label>
                  <input value={row.name} onChange={(e) => update(idx, "name", e.target.value)} placeholder="e.g. Fr. Charles Marie Rooney, O.P." style={INPUT} />
                </div>
                <div>
                  <label style={LABEL}>Role <span style={{ color: T.burgundy }}>*</span></label>
                  <select
                    value={row.role || ""}
                    onChange={(e) => update(idx, "role", e.target.value)}
                    style={{ ...INPUT, appearance: "auto" }}
                  >
                    <option value="">— Select a role —</option>
                    {roles.map((r) => (
                      <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                  </select>
                </div>
                <button onClick={() => removeRow(idx)} style={{ background: "none", border: "none", color: T.warmGray, cursor: "pointer", padding: 8, height: 38 }} aria-label="Remove">
                  <Trash2 size={16} />
                </button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 10 }}>
                <div>
                  <label style={LABEL}>
                    Display title {needsTitle ? <span style={{ color: T.burgundy }}>(recommended)</span> : <span style={{ color: T.warmGray, textTransform: "none" }}>(optional override)</span>}
                  </label>
                  <input
                    value={row.title || ""}
                    onChange={(e) => update(idx, "title", e.target.value)}
                    placeholder={needsTitle ? "e.g. Chaplain, Studium Professor" : "Leave blank to use the role above"}
                    style={INPUT}
                  />
                </div>
                <div>
                  <label style={LABEL}>Photo URL (optional)</label>
                  <input value={row.photo || ""} onChange={(e) => update(idx, "photo", e.target.value)} placeholder="https://…" style={INPUT} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={addRow}
        style={{ marginTop: 12, display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px", background: "transparent", color: T.burgundy, border: `1.5px dashed ${T.stone}`, borderRadius: 6, fontSize: 13, fontWeight: 500, fontFamily: "var(--font-body)", cursor: "pointer" }}
      >
        <Plus size={14} /> Add Person
      </button>
    </div>
  );
}

export default function StaffDirectoryDashboard({ onToast }) {
  const { t: _t } = useTranslation(); // eslint-disable-line no-unused-vars
  const stored = getAll();

  // Migrate any legacy rows whose `role` was a free-text string.
  const initialFriars = useMemo(
    () => migrateRows(stored?.friars || fallbackFriars, FRIAR_ROLES),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const initialStaff = useMemo(
    () => migrateRows(stored?.staff || fallbackStaff, STAFF_ROLES),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const [friars, setFriars] = useState(initialFriars);
  const [staff, setStaff] = useState(initialStaff);
  const [dirty, setDirty] = useState(false);

  // Flag rows missing a role so the admin notices before saving.
  const friarsMissingRole = friars.filter((f) => !f.role).length;
  const staffMissingRole = staff.filter((s) => !s.role).length;

  const handleFriarsChange = (next) => { setFriars(next); setDirty(true); };
  const handleStaffChange = (next) => { setStaff(next); setDirty(true); };

  const handleSave = () => {
    saveAll({ friars, staff });
    setDirty(false);
    onToast?.({ message: "Staff directory updated!", type: "success" });
  };

  const handleReset = () => {
    if (window.confirm("Reset staff directory to defaults? All edits will be lost.")) {
      clearAll();
      setFriars(fallbackFriars);
      setStaff(fallbackStaff);
      setDirty(false);
      onToast?.({ message: "Directory reset to defaults.", type: "success" });
    }
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 16 }}>
        <div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 600, color: T.softBlack, margin: 0 }}>Staff Directory</h2>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 14, color: T.warmGray, margin: "4px 0 0" }}>
            Who appears on the Priests &amp; Staff page, and in what section.
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={handleReset}
            style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px", background: "transparent", color: T.warmGray, border: `1.5px solid ${T.stone}`, borderRadius: 8, fontSize: 13, fontWeight: 500, fontFamily: "var(--font-body)", cursor: "pointer" }}
          >
            <RotateCcw size={14} /> Reset
          </button>
          <button
            onClick={handleSave}
            disabled={!dirty}
            style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 20px", background: dirty ? T.burgundy : T.stone, color: dirty ? "#fff" : T.warmGray, border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, fontFamily: "var(--font-body)", cursor: dirty ? "pointer" : "default" }}
          >
            <Save size={16} /> Save Changes
          </button>
        </div>
      </div>

      <div style={{ background: "#F5F0E6", border: `1px solid ${T.stone}`, borderRadius: 10, padding: "14px 16px", marginBottom: 20, fontSize: 13.5, color: T.softBlack, lineHeight: 1.6 }}>
        <strong>How this works:</strong> Each person has a <em>Role</em> (which controls which section they appear in) and an optional <em>Display title</em> (the label shown under their name).
        Leave <em>Display title</em> blank to show the role name. Set it to customize — e.g. Role <em>Parochial Vicar</em> + Title <em>Associate Pastor &amp; Chaplain</em>.
        Changing a person's role is what moves them between the <em>Leadership</em>, <em>In Residence</em>, and <em>Parish Staff</em> sections on the public page.
      </div>

      {(friarsMissingRole > 0 || staffMissingRole > 0) && (
        <div style={{ background: "#FDECEC", border: `1px solid #E8A5A5`, borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 13.5, color: "#8A2A2A" }}>
          <strong>Heads up:</strong> {friarsMissingRole + staffMissingRole} row{friarsMissingRole + staffMissingRole === 1 ? "" : "s"} without a role. Pick a role for each so they show on the public page.
        </div>
      )}

      <GroupEditor
        label="Friars"
        rows={friars}
        onChange={handleFriarsChange}
        roles={FRIAR_ROLES}
        hint="Pick Pastor or Parochial Vicar for the two cards on top of the page. Pick In Residence for the others. Use Display title to show a custom line (e.g. “Chaplain, Studium Professor”)."
      />
      <GroupEditor
        label="Parish Staff"
        rows={staff}
        onChange={handleStaffChange}
        roles={STAFF_ROLES}
        hint="Lay staff shown in the Parish Staff section. If the role isn't in the list, pick “Other” and type the title in Display title."
      />
    </div>
  );
}
