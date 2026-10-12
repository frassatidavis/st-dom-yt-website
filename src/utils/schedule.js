const DAY_BY_KEY = {
  sunday: 0,
  sundayEspanol: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
  saturdayVigil: 6,
};

const MASS_TIME_RE = /\b\d{1,2}(?::\d{2})?\s*(?:AM|PM)\b/gi;
const WEEKDAY_KEYS = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

export function parseMassTime(str) {
  const match = String(str || "").match(/\b(\d{1,2})(?::(\d{2}))?\s*(AM|PM)\b/i);
  if (!match) return null;

  let hours = Number(match[1]);
  const minutes = Number(match[2] || 0);
  const period = match[3].toUpperCase();

  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;

  return { hours, minutes };
}

export function extractMassTimes(text) {
  return String(text || "").match(MASS_TIME_RE) || [];
}

export function expandMassSchedule(schedule) {
  const rows = [
    ...(schedule?.sundayMass || []),
    ...(schedule?.dailyMass || []),
  ];
  const seen = new Set();
  const masses = [];

  rows.forEach(([dayKey, timeText]) => {
    const day = DAY_BY_KEY[dayKey];
    if (day === undefined) return;

    extractMassTimes(timeText).forEach((timeStr) => {
      const parsed = parseMassTime(timeStr);
      if (!parsed) return;

      const key = `${dayKey}:${timeStr}`;
      if (seen.has(key)) return;
      seen.add(key);

      masses.push({ day, dayKey, timeStr, ...parsed });
    });
  });

  return masses.sort((a, b) => a.day - b.day || (a.hours * 60 + a.minutes) - (b.hours * 60 + b.minutes));
}

export function getNextMassFromSchedule(schedule, now = new Date()) {
  const masses = expandMassSchedule(schedule);
  if (masses.length === 0) return null;

  const currentDay = now.getDay();
  for (let offset = 0; offset < 8; offset += 1) {
    const targetDay = (currentDay + offset) % 7;
    const dayMasses = masses.filter((mass) => mass.day === targetDay);

    for (const mass of dayMasses) {
      const massDate = new Date(now);
      massDate.setDate(massDate.getDate() + offset);
      massDate.setHours(mass.hours, mass.minutes, 0, 0);

      if (massDate > now) {
        return { date: massDate, label: mass.dayKey, timeStr: mass.timeStr };
      }
    }
  }

  return null;
}

export function getTodayKey(now = new Date()) {
  return WEEKDAY_KEYS[now.getDay()];
}

export function rowsForDay(rows = [], dayKey = getTodayKey()) {
  return rows.filter(([key]) => {
    if (key === dayKey) return true;
    if (dayKey === "sunday" && key === "sundayEspanol") return true;
    if (dayKey === "saturday" && key === "saturdayVigil") return true;
    return false;
  });
}

export function joinScheduleTimes(rows = []) {
  return rows.map(([, time]) => time).filter(Boolean).join(" · ");
}

export function getTodayScheduleSummary(schedule, now = new Date()) {
  const todayKey = getTodayKey(now);
  return {
    todayKey,
    masses: joinScheduleTimes([
      ...rowsForDay(schedule?.dailyMass, todayKey),
      ...rowsForDay(schedule?.sundayMass, todayKey),
    ]),
    confessions: joinScheduleTimes(rowsForDay(schedule?.confession, todayKey)),
  };
}

const NOTE_BY_KEY = { sundayEspanol: "spanish", saturdayVigil: "vigil" };
const TIME_PART_RE = /^(\d{1,2}(?::\d{2})?)\s*(AM|PM)$/i;

const minutesOf = (time) => {
  const parsed = parseMassTime(time);
  return parsed ? parsed.hours * 60 + parsed.minutes : Number.MAX_SAFE_INTEGER;
};

/** "8:00 AM, 10:00 AM, 12:30 PM" → "8:00, 10:00 AM, 12:30 PM" (period written once per run). */
function compactTimes(times) {
  const parts = times.map((time) => {
    const match = String(time).trim().match(TIME_PART_RE);
    return match ? { clock: match[1], period: match[2].toUpperCase() } : { clock: String(time).trim(), period: "" };
  });
  return parts
    .map((part, i) => {
      const next = parts[i + 1];
      return part.period && next && next.period === part.period ? part.clock : `${part.clock}${part.period ? ` ${part.period}` : ""}`;
    })
    .join(", ");
}

/** "4:00 PM – 5:00 PM" → "4:00–5:00 PM"; "11:15 AM – 12:00 PM" → "11:15 AM–12:00 PM". */
function compactRange(range) {
  const match = String(range).match(/(\d{1,2}:\d{2})\s*(AM|PM)\s*[–-]\s*(\d{1,2}:\d{2})\s*(AM|PM)/i);
  if (!match) return String(range).trim();
  const [, from, fromPeriod, to, toPeriod] = match;
  return fromPeriod.toUpperCase() === toPeriod.toUpperCase()
    ? `${from}–${to} ${toPeriod.toUpperCase()}`
    : `${from} ${fromPeriod.toUpperCase()}–${to} ${toPeriod.toUpperCase()}`;
}

function joinDays(days, labels) {
  if (days.length === 1) return labels.days[days[0]];
  const names = days.map((d) => labels.days[d]);
  return `${names.slice(0, -1).join(", ")} ${labels.and} ${names[names.length - 1]}`;
}

/**
 * The whole week, Sunday through Saturday, as compact display segments:
 *   mass:       [{ days: "Sun", times: "8:00, 10:00 AM, 12:30 PM (Español)" }, { days: "Mon–Fri", … }, …]
 *   confession: [{ days: "Sun", times: "11:30–11:55 AM (Español)" }, { days: "Wed, Fri & Sat", … }, …]
 * labels: { days: [7 short names, Sunday first], and, notes: { spanish, vigil } }
 */
export function formatWeeklySchedule(schedule, labels) {
  const note = (key) => (NOTE_BY_KEY[key] ? ` (${labels.notes[NOTE_BY_KEY[key]]})` : "");

  // Mass: every time per weekday, then consecutive days with identical times merge (Mon–Fri)
  const byDay = Array.from({ length: 7 }, () => []);
  for (const [key, value] of [...(schedule?.sundayMass || []), ...(schedule?.dailyMass || [])]) {
    const day = DAY_BY_KEY[key];
    if (day === undefined || !value) continue;
    for (const time of String(value).split(",").map((t) => t.trim()).filter(Boolean)) {
      if (!byDay[day].some((entry) => entry.time === time)) byDay[day].push({ time, note: note(key) });
    }
  }
  const dayText = byDay.map((entries) => {
    const sorted = [...entries].sort((a, b) => minutesOf(a.time) - minutesOf(b.time));
    // Times sharing no note are compacted together; a noted time keeps its own label
    const out = [];
    let run = [];
    const flush = () => { if (run.length) out.push(compactTimes(run)); run = []; };
    for (const entry of sorted) {
      if (entry.note) { flush(); out.push(`${compactTimes([entry.time])}${entry.note}`); }
      else run.push(entry.time);
    }
    flush();
    return out.join(", ");
  });
  const mass = [];
  for (let day = 0; day < 7; day++) {
    if (!dayText[day]) continue;
    let end = day;
    while (end + 1 < 7 && dayText[end + 1] === dayText[day]) end++;
    mass.push({ days: end > day ? `${labels.days[day]}–${labels.days[end]}` : labels.days[day], times: dayText[day] });
    day = end;
  }

  // Confession: identical time slots across days merge (Wed, Fri & Sat)
  const slots = new Map();
  for (const [key, value] of schedule?.confession || []) {
    const day = DAY_BY_KEY[key];
    if (day === undefined || !value) continue;
    const times = `${compactRange(value)}${note(key)}`;
    if (!slots.has(times)) slots.set(times, { times, days: [], start: minutesOf(value) });
    const slot = slots.get(times);
    if (!slot.days.includes(day)) slot.days.push(day);
  }
  const confession = [...slots.values()]
    .map((slot) => ({ ...slot, days: slot.days.sort((a, b) => a - b) }))
    .sort((a, b) => a.days[0] - b.days[0] || a.start - b.start)
    .map((slot) => ({ days: joinDays(slot.days, labels), times: slot.times }));

  return { mass, confession };
}
