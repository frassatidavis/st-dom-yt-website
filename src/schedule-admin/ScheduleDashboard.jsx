import { useState } from "react";
import { T } from "../constants/theme";
import { CATEGORIES, DAY_KEYS, DAY_LABELS, getAll, saveCategory, clearAll } from "./store";
import {
  sundayMass as fallbackSunday,
  dailyMass as fallbackDaily,
  confession as fallbackConfession,
  adoration as fallbackAdoration,
} from "../data/schedule";
import { Plus, Trash2, Save, RotateCcw, Clock } from "lucide-react";

const INPUT = {
  padding: "8px 12px",
  fontSize: 14,
  fontFamily: "var(--font-body)",
  border: `1.5px solid ${T.stone}`,
  borderRadius: 6,
  outline: "none",
  background: "#fff",
  color: T.charcoal,
};

const FALLBACKS = {
  sundayMass: fallbackSunday,
  dailyMass: fallbackDaily,
  confession: fallbackConfession,
  adoration: fallbackAdoration,
};

function CategoryEditor({ catKey, label, initialRows, onSave }) {
  const [rows, setRows] = useState(initialRows.map((r) => [...r]));
  const [dirty, setDirty] = useState(false);
  const [saved, setSaved] = useState(false);

  const update = (idx, col, val) => {
    const next = rows.map((r, i) => (i === idx ? (col === 0 ? [val, r[1]] : [r[0], val]) : r));
    setRows(next);
    setDirty(true);
    setSaved(false);
  };

  const addRow = () => {
    setRows([...rows, [DAY_KEYS[0], ""]]);
    setDirty(true);
    setSaved(false);
  };

  const removeRow = (idx) => {
    setRows(rows.filter((_, i) => i !== idx));
    setDirty(true);
    setSaved(false);
  };

  const handleSave = () => {
    onSave(catKey, rows);
    setDirty(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ background: "#fff", border: `1px solid ${T.stone}`, borderRadius: 10, padding: 20, marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 600, color: T.softBlack, margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
          <Clock size={18} color={T.burgundy} /> {label}
        </h3>
        {saved && <span style={{ fontSize: 12, color: "#1a7d42", fontWeight: 600 }}>✓ Saved</span>}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {rows.map((row, idx) => (
          <div key={idx} style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <select value={row[0]} onChange={(e) => update(idx, 0, e.target.value)} style={{ ...INPUT, flex: "0 0 200px" }}>
              {DAY_KEYS.map((k) => <option key={k} value={k}>{DAY_LABELS[k]}</option>)}
            </select>
            <input
              value={row[1]}
              onChange={(e) => update(idx, 1, e.target.value)}
              placeholder="e.g., 8:00 AM"
              style={{ ...INPUT, flex: 1 }}
            />
            <button onClick={() => removeRow(idx)} style={{ background: "none", border: "none", color: T.warmGray, cursor: "pointer", padding: 6 }} aria-label="Remove">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button
          onClick={addRow}
          style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px", background: "transparent", color: T.burgundy, border: `1.5px dashed ${T.stone}`, borderRadius: 6, fontSize: 13, fontWeight: 500, fontFamily: "var(--font-body)", cursor: "pointer" }}
        >
          <Plus size={14} /> Add Time
        </button>
        <button
          onClick={handleSave}
          disabled={!dirty}
          style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px", background: dirty ? T.burgundy : T.stone, color: dirty ? "#fff" : T.warmGray, border: "none", borderRadius: 6, fontSize: 13, fontWeight: 600, fontFamily: "var(--font-body)", cursor: dirty ? "pointer" : "default" }}
        >
          <Save size={14} /> Save
        </button>
      </div>
    </div>
  );
}

export default function ScheduleDashboard({ onToast }) {
  const [nonce, setNonce] = useState(0); // force remount after reset
  const stored = getAll() || {};

  const getRows = (key) => stored[key] || FALLBACKS[key];

  const handleSave = (key, rows) => {
    saveCategory(key, rows);
    onToast?.({ message: "Schedule updated!", type: "success" });
  };

  const handleReset = () => {
    if (window.confirm("Reset all schedules to defaults? Your changes will be lost.")) {
      clearAll();
      setNonce((n) => n + 1);
      onToast?.({ message: "Schedule reset to defaults.", type: "success" });
    }
  };

  return (
    <div key={nonce}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 24 }}>
        <div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 600, color: T.softBlack, margin: 0 }}>Mass Schedule</h2>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 14, color: T.warmGray, margin: "4px 0 0" }}>
            Weekly Mass, confession, and adoration times that appear on the public Mass Times page.
          </p>
        </div>
        <button
          onClick={handleReset}
          style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px", background: "transparent", color: T.warmGray, border: `1.5px solid ${T.stone}`, borderRadius: 8, fontSize: 13, fontWeight: 500, fontFamily: "var(--font-body)", cursor: "pointer" }}
        >
          <RotateCcw size={14} /> Reset to Defaults
        </button>
      </div>

      <div style={{ background: "#F5F0E6", border: `1px solid ${T.stone}`, borderRadius: 10, padding: "12px 16px", marginBottom: 20, fontSize: 13.5, color: T.softBlack, lineHeight: 1.6 }}>
        <strong>Tip:</strong> Each section below (Sunday Mass, Daily Mass, Confession, Adoration) is saved independently when you click its <em>Save</em> button. <em>Reset to Defaults</em> wipes every section back to the bundled schedule — use sparingly.
      </div>

      {CATEGORIES.map((cat) => (
        <CategoryEditor
          key={cat.key}
          catKey={cat.key}
          label={cat.label}
          initialRows={getRows(cat.key)}
          onSave={handleSave}
        />
      ))}
    </div>
  );
}
