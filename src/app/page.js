"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import IntroSplash from "./components/dessert-hell/IntroSplash";
import HeaderBar   from "./components/dessert-hell/HeaderBar";
import Controls    from "./components/dessert-hell/Controls";
import DessertGrid from "./components/dessert-hell/DessertGrid";
import SugarChart  from "./components/dessert-hell/SugarChart";
import DeathModal  from "./components/dessert-hell/DeathModal";
import GameOverOverlay from "./components/dessert-hell/GameOverOverlay";
import Footer      from "./components/dessert-hell/Footer";

export default function DessertHellPage() {
  // ---------------- State ----------------
  const [showIntro, setShowIntro] = useState(true);
  const [query, setQuery] = useState("");
  const [mood, setMood] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [grid, setGrid] = useState([]);
  const [detail, setDetail] = useState(null);
  const [open, setOpen] = useState(false);

  const [favs, setFavs] = useState(() => {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(localStorage.getItem("dessert_hell_favs") || "[]");
    } catch {
      return [];
    }
  });
  useEffect(() => {
    localStorage.setItem("dessert_hell_favs", JSON.stringify(favs));
  }, [favs]);

  const [life, setLife] = useState(100);
  const [history, setHistory] = useState(() => [{ t: 0, life: 100 }]);
  const [sugar, setSugar] = useState([]); // { t, rate }
  const stepRef = useRef(1);

  // SFX settings
  const [showSettings, setShowSettings] = useState(false);
  const [sfxEnabled, setSfxEnabled] = useState(true);
  const [volume, setVolume] = useState(0.02);
  const [baseFreq, setBaseFreq] = useState(420);

  // WebAudio SFX
  const audioCtxRef = useRef(null);
  function getAudio() {
    if (typeof window === "undefined" || !sfxEnabled) return null;
    if (!audioCtxRef.current) {
      const AC = window.AudioContext || window.webkitAudioContext;
      audioCtxRef.current = AC ? new AC() : null;
    }
    return audioCtxRef.current;
  }
  function beep({ freq = baseFreq, dur = 0.07, type = "square", gain = volume } = {}) {
    const ctx = getAudio();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    g.gain.value = gain;
    osc.connect(g);
    g.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + dur);
  }
  const sfxHover = () =>
    beep({ freq: baseFreq + 100, dur: 0.03, type: "triangle", gain: volume * 0.6 });
  const sfxConsume = () => {
    beep({ freq: baseFreq * 0.45, dur: 0.08, type: "sawtooth", gain: volume * 1.1 });
    setTimeout(() => beep({ freq: baseFreq * 0.3, dur: 0.12, type: "square", gain: 0.06 }), 90);
  };

  const bossActive = life <= 30;

  function consume(loss) {
    const bonus = bossActive ? 2 : 0;
    const finalLoss = Math.max(1, Math.round(loss + bonus));
    sfxConsume();
    setLife((p) => {
      const n = Math.max(0, Math.round(p - finalLoss));
      setHistory((h) => [...h, { t: stepRef.current, life: n }]);
      return n;
    });
    setSugar((s) => [...s, { t: stepRef.current++, rate: finalLoss }]);
    if (detail) {
      setFavs((f) =>
        f.some((x) => x.idMeal === detail.idMeal)
          ? f
          : [{ idMeal: detail.idMeal, strMeal: detail.strMeal, strMealThumb: detail.strMealThumb }, ...f]
      );
    }
  }

  function resetGame() {
    setLife(100);
    setHistory([{ t: 0, life: 100 }]);
    setSugar([]);
    stepRef.current = 1;
  }

  function handleTryAgain() {
  resetGame();        
  setOpen(false);     
  setDetail(null);    
  setShowIntro(true); 
}

  // ---------------- Data ----------------
  async function fetchList() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("https://www.themealdb.com/api/json/v1/1/filter.php?c=Dessert");
      if (!res.ok) throw new Error();
      const json = await res.json();
      setGrid(json.meals || []);
    } catch (e) {
      setError("The kitchen is haunted. Desserts refuse to appear.");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchList();
  }, []);

  async function doSearch() {
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(query)}`
      );
      if (!res.ok) throw new Error();
      const json = await res.json();
      const items = (json.meals || []).filter((m) => m.strCategory === "Dessert");
      setGrid(items);
      if (items.length === 0) setError("No sweets, only silence.");
    } catch (e) {
      setError("Whispered query lost in the void.");
    } finally {
      setLoading(false);
    }
  }

  async function openDetail(id) {
  setError("");
  try {
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
    if (!res.ok) throw new Error();
    const json = await res.json();
    setDetail(json.meals?.[0] || null);
    setOpen(true);
  } catch (e) {
    setError("The recipe page is missing, like a body with no name.");
  } finally {
  }
}


  function toggleFav(m) {
    const exists = favs.some((x) => x.idMeal === m.idMeal);
    setFavs((f) =>
      exists
        ? f.filter((x) => x.idMeal !== m.idMeal)
        : [{ idMeal: m.idMeal, strMeal: m.strMeal, strMealThumb: m.strMealThumb }, ...f]
    );
  }

  // per-session mood/loss
  const metaMap = useRef(new Map());
  function ensureMeta(id) {
    if (!metaMap.current.has(id)) {
      const moods = ["bittersweet", "sugar-crash", "meltdown"];
      const mood = moods[Math.floor(Math.random() * moods.length)];
      const loss = 6 + Math.floor(Math.random() * 15);
      metaMap.current.set(id, { mood, loss });
    }
    return metaMap.current.get(id);
  }
  const decorated = useMemo(() => grid.map((m) => ({ ...m, ...ensureMeta(m.idMeal) })), [grid]);
  const filtered = useMemo(
    () => (!mood ? decorated : decorated.filter((m) => m.mood === mood)),
    [decorated, mood]
  );

  // Skeletons (unchanged)
  const skeletons = Array.from({ length: 8 }).map((_, i) => (
    <div
      key={`sk-${i}`}
      className="rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900/40 animate-pulse"
      aria-hidden
    >
      <div className="aspect-[4/3] bg-zinc-800/50" />
      <div className="h-10 border-t border-zinc-800" />
      <div className="h-6" />
    </div>
  ));

  return (
    <motion.main
      className="min-h-[100dvh] bg-gradient-to-b from-zinc-950 via-black to-zinc-900 text-amber-50 selection:bg-amber-500/30"
      animate={bossActive ? { x: [0, -4, 4, -2, 2, 0] } : { x: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* keyframes & global styles */}
      <style>{`
        @keyframes liquidFlow { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        @keyframes pulseGlow { 0%{opacity:.45} 50%{opacity:1} 100%{opacity:.45} }
        .pulse-glow path { animation: pulseGlow 1.2s infinite; filter: drop-shadow(0 0 8px #ff4d00); }
        .paper-tear { filter: drop-shadow(0 3px 8px rgba(0,0,0,.65)); }
        .noise::after {
          content:""; position:absolute; inset:0;
          background: repeating-linear-gradient(90deg, rgba(255,255,255,.02) 0 2px, transparent 2px 3px),
                      repeating-linear-gradient(0deg, rgba(255,255,255,.02) 0 2px, transparent 2px 3px);
          opacity:.25; mix-blend-mode: overlay; pointer-events:none;
        }
        .monster{
          letter-spacing:.08em; color:transparent;
          background-image:linear-gradient(#f6efe3 0%,#efe4d1 60%,#e8d9c0 100%);
          -webkit-background-clip:text;background-clip:text;
          text-shadow: 0 1px 0 #2a0000, 0 2px 0 #3a0000, 0 3px 0 #520000, 0 4px 0 #6e0000, 0 6px 4px rgba(255,0,0,.30), 0 12px 18px rgba(255,0,0,.22);
        }
        .monster-underline{
          position:absolute;left:0;right:0;bottom:-6px;height:6px;
          background:linear-gradient(180deg,#b40606 0%,#7a0404 80%);
          box-shadow:0 6px 12px rgba(255,0,0,.35);
        }
      `}</style>

      {/* Intro */}
      <AnimatePresence>
        {showIntro && (
          <IntroSplash
            onStart={() => {
              setShowIntro(false);
            }}
            beep={beep}
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <HeaderBar life={life} bossActive={bossActive} resetGame={resetGame} />

      {/* Boss vignette */}
      {bossActive && (
        <div className="fixed inset-0 z-20 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(127,0,0,0.28),transparent_60%)]" />
          <svg className="absolute inset-0 w-full h-full opacity-20" aria-hidden>
            <defs>
              <filter id="fracture">
                <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" />
                <feDisplacementMap in="SourceGraphic" scale="2" />
              </filter>
            </defs>
            <rect width="100%" height="100%" fill="none" stroke="red" strokeWidth="0" filter="url(#fracture)" />
          </svg>
        </div>
      )}

      {/* Controls */}
      <Controls
        query={query}
        setQuery={setQuery}
        mood={mood}
        setMood={setMood}
        doSearch={doSearch}
        onReset={async () => {
        setQuery("");
        setMood("");
        await fetchList();
        }}
        showSettings={showSettings}
        setShowSettings={setShowSettings}
        sfxEnabled={sfxEnabled}
        setSfxEnabled={setSfxEnabled}
        volume={volume}
        setVolume={setVolume}
        baseFreq={baseFreq}
        setBaseFreq={setBaseFreq}
       />

      {/* Error */}
      {error && (
        <div className="max-w-6xl mx-auto px-5 mt-3 rounded-xl border border-red-900 bg-red-950/40 p-3 text-red-300">
          {error}
        </div>
      )}

      {/* Grid */}
      <div className="max-w-6xl mx-auto px-5 mt-6 pb-16">
        {loading && (
          <div aria-label="Loading results" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {skeletons}
          </div>
        )}
        {!loading && filtered.length === 0 && !error && (
          <div className="text-sm text-zinc-400" role="status" aria-live="polite">
            No offerings. The altar is empty.
          </div>
        )}
        {!loading && filtered.length > 0 && (
          <DessertGrid
            items={filtered}
            favs={favs}
            onOpen={openDetail}
            onToggleFav={toggleFav}
            onHover={sfxHover}
          />
        )}
      </div>

      {/* Chart */}
      <SugarChart sugar={sugar} bossActive={bossActive} />

      {/* Modal */}
      <DeathModal
       open={open}
       onClose={() => setOpen(false)}
       meal={detail}
       onConsume={() => {
         if (!detail) return;
         const { loss } = ensureMeta(detail.idMeal);
         consume(loss);
       }}
      />
      {/* Game Over */}
     <GameOverOverlay visible={life <= 0} onRestart={handleTryAgain} />

      {/* Footer */}
      <Footer />
    </motion.main>
  );
}
