import { useState } from "react";
import { T } from "../constants/theme";
import { getAll, saveAll, clearAll, createEmpty } from "./store";
import { ministries as fallback } from "../data/ministries";
import { Plus, Trash2, Save, RotateCcw, HandHeart, ArrowUp, ArrowDown } from "lucide-react";

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

const COMMON_ICONS = [
  "Heart", "Flame", "Cross", "Users", "Shield", "HandHeart",
  "Music", "BookOpen", "BookMarked", "HeartHandshake", "Globe",
  "Sparkles", "Church", "Bell", "Star",
];

export default function MinistriesDashboard({ onToast }) {
  const [list, setList] = useState(() => getAll() || fallback.map((m) => ({ ...m, title: "", description: "" })));
  const [dirty, setDirty] = useState(false);

  const update = (idx, field, val) => {
    setList(list.map((m, i) => (i === idx ? { ...m, [field]: val } : m)));
    setDirty(true);
  };

  const addRow = () => {
    setList([...list, createEmpty()]);
    setDirty(true);
  };

  const removeRow = (idx) => {
    setList(list.filter((_, i) => i !== idx));
    setDirty(true);
  };

  const move = (idx, dir) => {
    const target = idx + dir;
    if (target < 0 || target >= list.length) return;
    const next = [...list];
    [next[idx], next[target]] = [next[target], next[idx]];
    setList(next);
    setDirty(true);
  };

  const handleSave = () => {
    saveAll(list);
    setDirty(false);
    onToast?.({ message: "Ministries updated!", type: "success" });
  };

  const handleReset = () => {
    if (window.confirm("Reset ministries to defaults?")) {
      clearAll();
      setList(fallback.map((m) => ({ ...m, title: "", description: "" })));
      setDirty(false);
      onToast?.({ message: "Ministries reset.", type: "success" });
    }
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 24 }}>
        <div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 600, color: T.softBlack, margin: 0 }}>Ministries</h2>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 14, color: T.warmGray, margin: "4px 0 0" }}>
            Ministry cards displayed on the public Get Involved page.
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={handleReset} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px", background: "transparent", color: T.warmGray, border: `1.5px solid ${T.stone}`, borderRadius: 8, fontSize: 13, fontWeight: 500, fontFamily: "var(--font-body)", cursor: "pointer" }}>
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

      <div style={{ background: "#F5F0E6", border: `1px solid ${T.stone}`, borderRadius: 10, padding: "12px 16px", marginBottom: 16, fontSize: 13.5, color: T.softBlack, lineHeight: 1.6 }}>
        <strong>How this works:</strong> Each row is one ministry card. Reorder with the up/down arrows, pick an icon, set a title and short description. Leave <em>Title</em> or <em>Description</em> blank to use the bundled default for that ministry. Click <em>Add Ministry</em> to create a brand-new card.
      </div>

      <div style={{ background: "#fff", border: `1px solid ${T.stone}`, borderRadius: 10, padding: 20 }}>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 600, color: T.softBlack, margin: "0 0 12px", display: "flex", alignItems: "center", gap: 8 }}>
          <HandHeart size={18} color={T.burgundy} /> Ministry List
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {list.map((m, idx) => (
            <div key={m.id} style={{ display: "grid", gridTemplateColumns: "auto 140px 1fr 1fr auto", gap: 8, alignItems: "center" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <button onClick={() => move(idx, -1)} disabled={idx === 0} style={{ background: "none", border: "none", padding: 2, cursor: idx === 0 ? "default" : "pointer", color: idx === 0 ? T.stoneLight : T.warmGray }}>
                  <ArrowUp size={13} />
                </button>
                <button onClick={() => move(idx, 1)} disabled={idx === list.length - 1} style={{ background: "none", border: "none", padding: 2, cursor: idx === list.length - 1 ? "default" : "pointer", color: idx === list.length - 1 ? T.stoneLight : T.warmGray }}>
                  <ArrowDown size={13} />
                </button>
              </div>
              <select value={m.icon} onChange={(e) => update(idx, "icon", e.target.value)} style={INPUT}>
                {COMMON_ICONS.map((ic) => <option key={ic} value={ic}>{ic}</option>)}
              </select>
              <input value={m.title || ""} onChange={(e) => update(idx, "title", e.target.value)} placeholder="Title (blank uses default)" style={INPUT} />
              <input value={m.description || ""} onChange={(e) => update(idx, "description", e.target.value)} placeholder="Short description" style={INPUT} />
              <button onClick={() => removeRow(idx)} style={{ background: "none", border: "none", color: T.warmGray, cursor: "pointer", padding: 6 }} aria-label="Remove">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={addRow}
          style={{ marginTop: 12, display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px", background: "transparent", color: T.burgundy, border: `1.5px dashed ${T.stone}`, borderRadius: 6, fontSize: 13, fontWeight: 500, fontFamily: "var(--font-body)", cursor: "pointer" }}
        >
          <Plus size={14} /> Add Ministry
        </button>
      </div>
    </div>
  );
}
