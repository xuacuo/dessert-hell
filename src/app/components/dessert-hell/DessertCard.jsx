"use client";

import { motion } from "framer-motion";
import AllergenIcons from "./AllergenIcons";
import { labelMood } from "./helpers";

export default function DessertCard({ m, onOpen, onHover, onToggleFav, isFav, narrative }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, scale: 1.01 }}
      viewport={{ once: true, amount: 0.2 }}
      className="rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950/60 shadow-[0_0_0_1px_rgba(0,0,0,.4)] group"
    >
      <button
        onClick={() => onOpen(m.idMeal)}
        onMouseEnter={onHover}
        className="block w-full text-left"
        aria-label={`Open ${m.strMeal}`}
      >
        <div className="aspect-[4/3] bg-black overflow-hidden relative">
          <img
            src={m.strMealThumb}
            alt={m.strMeal}
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition"
            loading="lazy"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2 text-xs text-amber-200 flex items-center justify-between">
            <span className="truncate pr-2">{m.strMeal}</span>
            <span className="text-red-400 font-mono">−{m.loss}% life</span>
          </div>
        </div>
      </button>

      <div className="flex items-center justify-between px-3 py-2 border-t border-zinc-800">
        <span className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-zinc-500">
          <AllergenIcons name={m.strMeal} /> {labelMood(m.mood)}
        </span>
        <button
          onClick={() => onToggleFav(m)}
          className="text-xs px-3 py-1 rounded-xl border border-zinc-800 hover:bg-zinc-900"
          aria-pressed={isFav}
        >
          {isFav ? "★ Victim" : "☆ Mark"}
        </button>
      </div>

      {/* Narrative strip */}
      <div
        className="relative px-3 pb-3 -mt-1 text-[11px] text-zinc-400 italic select-none overflow-hidden"
        title={narrative}
      >
        <div className="relative z-10">{narrative}</div>
        <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-zinc-900 via-zinc-900/80 to-transparent pointer-events-none" />
      </div>
    </motion.article>
  );
}
