"use client";

export default function AllergenIcons({ name }) {
  const n = (name || "").toLowerCase();
  const icons = [];
  if (/egg|eggs|meringue|custard/.test(n)) icons.push("🥚");
  if (/milk|cream|cheese|butter|yogurt/.test(n)) icons.push("🥛");
  if (/almond|hazelnut|walnut|peanut|cashew|pistachio|nut/.test(n)) icons.push("🥜");
  if (/wheat|flour|gluten|biscuit|cookie|cake/.test(n)) icons.push("🌾");
  return (
    <span aria-label="possible allergens" title="possible allergens">
      {icons.join(" ")}
    </span>
  );
}
