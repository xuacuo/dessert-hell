"use client";

import { AnimatePresence, motion } from "framer-motion";

export default function Controls({
  query, setQuery,
  mood, setMood,
  doSearch,
  onReset,
  showSettings, setShowSettings,
  sfxEnabled, setSfxEnabled,
  volume, setVolume,
  baseFreq, setBaseFreq,
  error,
}) {
  return (
    <div className="max-w-6xl mx-auto px-5 mt-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:items-end">
        <div>
          <label htmlFor="q" className="block text-xs uppercase tracking-widest text-zinc-400 mb-1">
            Search
          </label>
          <input
            id="q"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && doSearch()}
            placeholder="name the dessert that will end you"
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 outline-none focus:ring-2 focus:ring-amber-500/50"
          />
        </div>

        <div>
          <label htmlFor="mood" className="block text-xs uppercase tracking-widest text-zinc-400 mb-1">
            Mood Filter
          </label>
          <select
            id="mood"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3"
          >
            <option value="">All moods</option>
            <option value="bittersweet">Bittersweet — sad a little</option>
            <option value="sugar-crash">Sugar-Crash — shaky and hollow</option>
            <option value="meltdown">Total Meltdown — collapse</option>
          </select>
        </div>

        <div className="flex gap-2">
          <button onClick={doSearch} className="flex-1 rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 hover:bg-zinc-900">
            Search
          </button>
          <button onClick={onReset} className="rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 hover:bg-zinc-900">
            Reset
          </button>
          <button
            onClick={() => setShowSettings((v) => !v)}
            className="rounded-xl border border-amber-400/50 px-4 py-3 hover:bg-amber-950/30"
            aria-expanded={showSettings}
            aria-controls="settings-panel"
          >
            Settings
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showSettings && (
          <motion.div
            id="settings-panel"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="mt-3 rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4 grid md:grid-cols-4 gap-3 text-sm"
          >
            <div className="flex items-center gap-2">
              <input
                id="sfx"
                type="checkbox"
                checked={sfxEnabled}
                onChange={(e) => setSfxEnabled(e.target.checked)}
              />
              <label htmlFor="sfx">Enable SFX</label>
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1">
                Volume ({volume.toFixed(3)})
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.005"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Base Frequency (Hz)</label>
              <input
                type="number"
                value={baseFreq}
                onChange={(e) =>
                  setBaseFreq(Math.max(60, Math.min(2000, Number(e.target.value) || 420)))
                }
                className="w-full rounded border border-zinc-800 bg-zinc-950 px-2 py-1"
              />
            </div>
            <div className="text-zinc-400">
              Tip: hover a card to hear a tick; click <em>Consume</em> for a double-thump.
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <div
          className="mt-3 rounded-xl border border-red-900 bg-red-950/40 p-3 text-red-300"
          role="alert"
          aria-live="assertive"
        >
          {error}
        </div>
      )}
    </div>
  );
}
