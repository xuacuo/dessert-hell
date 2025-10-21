"use client";

import { motion } from "framer-motion";

export default function IntroSplash({ onStart, beep }) {
  return (
    <motion.div
      className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-black"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2 }}
    >
      {/* Liquid keyframes + styles */}
      <style>{`
        @keyframes liquidFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
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
        .monster-underline{ position:absolute;left:0;right:0;bottom:-6px;height:6px; background:linear-gradient(180deg,#b40606 0%,#7a0404 80%); box-shadow:0 6px 12px rgba(255,0,0,.35); }
      `}</style>

      {/* Liquid filter */}
      <svg className="absolute inset-0 w-0 h-0" aria-hidden>
        <filter id="liquid">
          <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" seed="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="20" />
        </filter>
      </svg>

      <motion.h1
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative text-center font-extrabold uppercase leading-none text-transparent bg-clip-text text-[64px] sm:text-[90px] md:text-[120px] lg:text-[150px] drop-shadow-[0_6px_14px_rgba(255,0,0,0.4)] select-none"
        style={{
          WebkitTextStroke: "1px #3a0000",
          backgroundImage: "linear-gradient(180deg, #000000 0%, #4a0000 35%, #8b0000 50%, #1a0000 100%)",
          backgroundSize: "300% 300%",
          animation: "liquidFlow 6s ease-in-out infinite",
          filter: "url(#liquid)",
        }}
      >
        welcome to<br />dessert hell
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ delay: 0.6, duration: 1 }}
        className="mt-6 text-zinc-400 text-xs sm:text-sm md:text-base text-center px-6"
      >
        Here, dessert is not your salvation, but your death sentence.<br />
        With every bite, a little light goes out. Sugar keeps the score; your life ticks downward, step by step, into the dark.<br />
        And still—will you choose another slice?
      </motion.p>

      <motion.button
        onClick={() => {
          onStart();
          beep({ freq: 180, dur: 0.25, type: "sine", gain: 0.08 });
          setTimeout(() => beep({ freq: 90, dur: 0.3, type: "square", gain: 0.06 }), 180);
        }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="mt-10 px-8 py-3 rounded-2xl border border-red-500/60 bg-gradient-to-b from-red-800/30 to-red-900/10 hover:from-red-700/40 hover:to-red-900/20 text-red-200 uppercase tracking-widest text-sm"
      >
        game start
      </motion.button>
    </motion.div>
  );
}
