export function narrativeFor(m) {
  const loss = m?.loss ?? 8;
  const mood = m?.mood || "bittersweet";
  const pool = {
    bittersweet: [
      "A gentle drain on a quiet night.",
      "Sweetness dulls the ache, for a price.",
      "You smile; the mirror doesn’t.",
    ],
    "sugar-crash": [
      "Hands shake. The room tilts a little.",
      "Warmth now, hollow later.",
      "Your pulse forgets its rhythm.",
    ],
    meltdown: [
      "Sugar crawls under your nails.",
      "You won’t sleep after this one.",
      "The lights dim, or is that you?",
    ],
  };
  const list = pool[mood] || pool.bittersweet;
  const line = list[Math.floor(Math.random() * list.length)];
  return `${line} −${loss}% life`;
}

export function ig(s) {
  return (s || "").toString().trim() || "—";
}

export function extractIngredients(meal) {
  const out = [];
  for (let i = 1; i <= 20; i++) {
    const name = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (name && String(name).trim())
      out.push({ name: String(name).trim(), measure: String(measure || "").trim() });
  }
  return out;
}

export function splitSteps(text) {
  if (!text) return [];
  const lines = text
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (lines.length > 1) return lines;
  return text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function labelMood(m) {
  if (m === "bittersweet") return "Bittersweet";
  if (m === "sugar-crash") return "Sugar-Crash";
  if (m === "meltdown") return "Total Meltdown";
  return "Unknown";
}
