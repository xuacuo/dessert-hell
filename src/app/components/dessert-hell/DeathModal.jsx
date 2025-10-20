"use client";

import { useEffect, useMemo, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ig, extractIngredients, splitSteps } from "./helpers";

export default function DeathModal({ open, onClose, meal, onConsume }) {
  const ingredients = useMemo(() => (meal ? extractIngredients(meal) : []), [meal]);
  const steps = useMemo(() => (meal ? splitSteps(meal.strInstructions) : []), [meal]);

  const dialogRef = useRef(null);
  const lastFocusedRef = useRef(null);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            last.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === last) {
            first.focus();
            e.preventDefault();
          }
        }
      }
    }
    if (open) {
      lastFocusedRef.current = document.activeElement;
      window.addEventListener("keydown", onKey);
      setTimeout(() => {
        const el = dialogRef.current?.querySelector("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])");
        el && el.focus();
      }, 0);
    }
    return () => {
      window.removeEventListener("keydown", onKey);
      if (lastFocusedRef.current && lastFocusedRef.current.focus) {
        setTimeout(() => lastFocusedRef.current.focus(), 0);
      }
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-40 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          aria-modal
          role="dialog"
          aria-labelledby="recipe-title"
        >
          <div className="absolute inset-0 bg-black/70" onClick={onClose} />
          <motion.div
            ref={dialogRef}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 30, opacity: 0 }}
            className="relative z-10 max-w-4xl w-full bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden"
          >
            {meal ? (
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="aspect-[4/3] bg-black">
                  <img src={meal.strMealThumb} alt={meal.strMeal} className="w-full h-full object-cover" />
                </div>
                <div className="p-4 md:p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 id="recipe-title" className="text-lg md:text-xl font-semibold">{meal.strMeal}</h2>
                      <p className="text-xs text-zinc-500 mt-1">
                        {meal.strCategory}
                        {meal.strArea ? ` • ${meal.strArea}` : ""}
                        {meal.strTags ? ` • ${meal.strTags}` : ""}
                      </p>
                    </div>
                    <button
                      onClick={onConsume}
                      className="text-xs px-3 py-1 rounded-xl border border-red-500/40 text-red-300 hover:bg-red-900/20"
                    >
                      Consume
                    </button>
                  </div>

                  <p className="mt-3 text-sm text-zinc-300 italic">
                    “Sweetness is only a slower kind of ending.”
                  </p>

                  <h3 className="mt-4 font-semibold">Ingredients</h3>
                  <ul className="mt-1 grid grid-cols-1 sm:grid-cols-2 gap-x-4 text-sm">
                    {ingredients.map((ing, idx) => (
                      <li key={idx} className="flex justify-between border-b border-zinc-800 py-1">
                        <span>{ig(ing.name)}</span>
                        <span className="text-zinc-400">{ig(ing.measure)}</span>
                      </li>
                    ))}
                  </ul>

                  <h3 className="mt-4 font-semibold">Ritual</h3>
                  <ol className="mt-1 list-decimal pl-5 space-y-1 text-sm max-h-40 overflow-auto pr-2">
                    {steps.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ol>
                </div>
              </div>
            ) : (
              <div className="p-6 text-zinc-400">The page is torn out.</div>
            )}

            <div className="p-4 md:p-6 border-t border-zinc-800 bg-black/30 text-xs text-zinc-500">
              Eating will reduce your life. Some pages are written in frosting and blood.
            </div>
            <div className="p-4 md:p-6 flex justify-end gap-2">
              <button
                onClick={onClose}
                className="text-xs px-3 py-2 rounded-xl border border-zinc-800 hover:bg-zinc-900"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
