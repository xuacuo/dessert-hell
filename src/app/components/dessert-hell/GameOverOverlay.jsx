"use client";

import { AnimatePresence, motion } from "framer-motion";

export default function GameOverOverlay({ visible, onRestart }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/80" />
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="relative z-10 max-w-md w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-6 text-center"
          >
            <h2 className="text-2xl font-bold text-red-400">You sugar-died.</h2>
            <p className="text-sm text-zinc-400 mt-2">
              Your diary closes, sticky with frosting.
            </p>
            <button
              onClick={onRestart}
              className="mt-4 px-4 py-2 rounded-xl border border-amber-400/50 hover:bg-amber-900/20"
            >
              Try Again
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
