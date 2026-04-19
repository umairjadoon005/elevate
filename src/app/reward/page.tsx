"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

export default function RewardPage() {
  const [rewards, setRewards] = useState<any[]>([]);
  const [sliceColors, setSliceColors] = useState<any[]>([]);
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [selectedReward, setSelectedReward] = useState<any>(null);
  // Track if we've checked storage to prevent flicker
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // 1. Check LocalStorage on mount
    const savedReward = localStorage.getItem("userReward");
    if (savedReward) {
      setSelectedReward(JSON.parse(savedReward));
    }
    
    fetchRewards();
    setIsInitialized(true);
  }, []);

  // 🎨 Premium Brown Gradient Palette
  const brownPalette = [
    { start: "#8B4513", end: "#2C1810" },
    { start: "#A0522D", end: "#5C2E0E" },
    { start: "#C19A6B", end: "#7B4B2A" },
    { start: "#D2B48C", end: "#8B4513" },
    { start: "#6F4E37", end: "#3E2723" },
  ];

  const fetchRewards = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/rewards");
      setRewards(res.data);

      const colors = res.data.map((_: any, i: number) => {
        return brownPalette[i % brownPalette.length];
      });
      setSliceColors(colors);
    } catch (error) {
      console.error("Failed to fetch rewards", error);
    }
  };

  const spinWheel = () => {
    if (!rewards.length || spinning) return;

    const randomIndex = Math.floor(Math.random() * rewards.length);
    const segmentAngle = 360 / rewards.length;

    const finalRotation =
      360 * 6 + (360 - randomIndex * segmentAngle - segmentAngle / 2);

    setSpinning(true);
    setRotation(finalRotation);

    setTimeout(() => {
      const win = rewards[randomIndex];
      setSelectedReward(win);
      setSpinning(false);
      
      // 2. Save to LocalStorage after spin finishes
      localStorage.setItem("userReward", JSON.stringify(win));
    }, 4500);
  };

  // Helper functions for SVG generation (kept as is)
  const polarToCartesian = (cx: number, cy: number, r: number, angle: number) => {
    const rad = ((angle - 90) * Math.PI) / 180.0;
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad),
    };
  };

  const createSlice = (startAngle: number, endAngle: number) => {
    const radius = 140;
    const center = 150;
    const start = polarToCartesian(center, center, radius, endAngle);
    const end = polarToCartesian(center, center, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    return `M ${center} ${center} L ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y} Z`;
  };

  // Prevent hydration mismatch by returning null until initialized
  if (!isInitialized) return <div className="min-h-screen bg-[#D2D6C6]" />;

  return (
    <main className="min-h-screen bg-[#D2D6C6] flex items-center justify-center p-8">
      <div className="bg-white rounded-[3rem] p-10 text-center shadow-2xl max-w-sm w-full border-t-8 border-[#8B4513]">
        {!selectedReward ? (
          <>
            <h1 className="text-[#5C2E0E] text-2xl mb-6 font-serif">Spin & Win 🎁</h1>
            <div className="relative w-[320px] h-[320px] mx-auto">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                <div className="w-0 h-0 border-l-[10px] border-r-[10px] border-b-[18px] border-l-transparent border-r-transparent border-b-[#5C2E0E]" />
              </div>

              <motion.svg
                viewBox="0 0 300 300"
                animate={{ rotate: rotation }}
                transition={{ duration: 4.5, ease: "easeOut" }}
                className="w-full h-full drop-shadow-2xl"
              >
                <defs>
                  {sliceColors.map((g, i) => (
                    <linearGradient key={i} id={`grad-${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor={g.start} />
                      <stop offset="100%" stopColor={g.end} />
                    </linearGradient>
                  ))}
                  <radialGradient id="shine">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {rewards.map((reward, i) => {
                  const angle = 360 / rewards.length;
                  const startAngle = i * angle;
                  const endAngle = startAngle + angle;
                  return (
                    <g key={i}>
                      <path
                        d={createSlice(startAngle, endAngle)}
                        fill={`url(#grad-${i})`}
                        stroke="#ffffff20"
                        strokeWidth="2"
                      />
                      <text
                        x="150" y="150" fill="#fff" fontSize="11" fontWeight="600" textAnchor="middle" dominantBaseline="middle"
                        transform={`rotate(${startAngle + angle / 2} 150 150) translate(0 -105)`}
                      >
                        {reward.title}
                      </text>
                    </g>
                  );
                })}
                <circle cx="150" cy="150" r="140" fill="url(#shine)" />
                <circle cx="150" cy="150" r="40" fill="white" fillOpacity="0.15" stroke="white" strokeOpacity="0.2" />
              </motion.svg>

              <button
                onClick={spinWheel}
                disabled={spinning}
                className="absolute inset-0 m-auto w-20 h-20 rounded-full bg-white/80 backdrop-blur-md shadow-xl text-[#5C2E0E] font-bold hover:scale-105 transition z-30 disabled:opacity-50"
              >
                {spinning ? "..." : "SPIN"}
              </button>
            </div>
          </>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <span className="text-6xl mb-6 block">🎉</span>
            <h1 className="text-[#5C2E0E] text-3xl mb-4 font-serif">You Won!</h1>
            <p className="text-[#5C2E0E]/70 mb-6">{selectedReward.title}</p>
            <div className="bg-[#D2D6C6]/20 border-2 border-dashed border-[#5C2E0E]/20 p-5 rounded-2xl">
              <span className="block text-[10px] uppercase tracking-widest opacity-50 mb-1">Redeem Code</span>
              <span className="text-xl font-bold text-[#5C2E0E]">{selectedReward.code}</span>
            </div>
          </motion.div>
        )}

        <p className="mt-8 text-[10px] uppercase tracking-[0.2em] opacity-30">
          Elevate Studio • Wellness Club
        </p>
      </div>
    </main>
  );
}