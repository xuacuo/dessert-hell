"use client";

import DessertCard from "./DessertCard";
import { narrativeFor } from "./helpers";

export default function DessertGrid({ items, favs, onOpen, onToggleFav, onHover }) {
  if (!items?.length) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {items.map((m) => (
        <DessertCard
          key={m.idMeal}
          m={m}
          onOpen={onOpen}
          onHover={onHover}
          onToggleFav={onToggleFav}
          isFav={favs.some((x) => x.idMeal === m.idMeal)}
          narrative={narrativeFor(m)}
        />
      ))}
    </div>
  );
}
