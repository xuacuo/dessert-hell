"use client";

import { motion } from "framer-motion";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

export default function SugarChart({ sugar, bossActive }) {
  return (
    <div className="max-w-6xl mx-auto px-5 mt-2 pb-10" aria-label="Chart section">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4"
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold" id="chart-title">Sugar Intake Rate</h3>
          <p className="text-xs text-zinc-500">loss per dessert — higher means deadlier bite</p>
        </div>
        <div className="h-56" role="img" aria-labelledby="chart-title" aria-description="Line chart showing the loss rate per consumed dessert over time.">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sugar.length ? sugar : [{ t: 0, rate: 0 }]} margin={{ left: 6, right: 10, top: 10, bottom: 6 }}>
              <CartesianGrid strokeDasharray="1 3" stroke="rgba(255,80,0,0.25)" />
              <XAxis dataKey="t" tick={{ fontSize: 12, fill: "#a36b2d" }} />
              <YAxis domain={[0, 25]} tick={{ fontSize: 12, fill: "#a36b2d" }} />
              <Tooltip contentStyle={{ backgroundColor: "#1a0f0f", border: "1px solid #ff4d00", color: "#ffb76b" }} labelStyle={{ color: "#ffb76b" }} />
              <Line type="monotone" dataKey="rate" strokeWidth={6} stroke="#ff4d00" strokeOpacity={0.18} dot={false} isAnimationActive={false} />
              {bossActive && (
                <Line type="monotone" dataKey="rate" strokeWidth={3} stroke="#ff4d00" dot={false} className="pulse-glow" isAnimationActive={false} />
              )}
              <Line type="monotone" dataKey="rate" strokeWidth={2.5} stroke="#ff4d00" dot={{ r: 3, stroke: "#ffa500", strokeWidth: 1, fill: "#ff6600" }} activeDot={{ r: 5, stroke: "#ffb76b", fill: "#ff6600" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}
