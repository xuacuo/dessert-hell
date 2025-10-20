"use client";

import { motion } from "framer-motion";

export default function HeaderBar({ life, bossActive, resetGame }) {
  return (
    <div className="sticky top-0 z-30 backdrop-blur bg-black/60 border-bred-500/60 shadow-[0_2px_10px_rgba(0,0,0,.6)]">
      <div className="relative max-w-6xl mx-auto px-5 py-10 text-center">
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="monster relative text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold uppercase select-none inline-block"
        >
          Dessert Hell
          <span className="monster-underline" />
        </motion.h1>

        {/* Narrative tagline */}
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mx-auto mt-4 max-w-3xl text-xs sm:text-sm md:text-base leading-relaxed text-zinc-300"
        >
          Every bite you take brings you one step closer to death
        </motion.p>

        {/* Centered life meter */}
        <div className="mx-auto mt-6 w-full max-w-xl">
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
            <span>Life Remaining</span>
            <span>{life}%</span>
          </div>
          <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-red-600 via-orange-500 to-yellow-400"
              style={{ width: `${life}%` }}
              aria-hidden
            />
          </div>
          {bossActive && (
            <div className="mt-1 text-[10px] uppercase tracking-widest text-red-400">
              Boss Mode: desserts grow fangs (+2% loss)
            </div>
          )}
          <div className="mt-3">
            <button
              onClick={resetGame}
              className="text-xs px-3 py-2 rounded-xl border border-amber-400/50 hover:bg-amber-950/40"
            >
              Reset Life
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
