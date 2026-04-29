"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

// Define the shape of your Reward data
interface Reward {
  title: string;
  code: string;
}

interface PaletteColor {
  start: string;
  end: string;
}

export default function RewardPage() {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [sliceColors, setSliceColors] = useState<PaletteColor[]>([]);
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const savedReward = localStorage.getItem("userReward");
    if (savedReward) {
      setSelectedReward(JSON.parse(savedReward));
    }
    
    fetchRewards();
    setIsInitialized(true);
  }, []);

  const brownPalette: PaletteColor[] = [
    { start: "#8B4513", end: "#2C1810" },
    { start: "#A0522D", end: "#5C2E0E" },
    { start: "#C19A6B", end: "#7B4B2A" },
    { start: "#D2B48C", end: "#8B4513" },
    { start: "#6F4E37", end: "#3E2723" },
  ];

  const fetchRewards = async () => {
    try {
      const res = await axios.get("https://elevate.synetalsolutions.co/public/api/rewards");
      const data: Reward[] = res.data;
      setRewards(data);

      const colors = data.map((_, i) => brownPalette[i % brownPalette.length]);
      setSliceColors(colors);
    } catch (error) {
      console.error("Failed to fetch rewards", error);
    }
  };

  const spinWheel = () => {
    if (!rewards.length || spinning) return;

    const randomIndex = Math.floor(Math.random() * rewards.length);
    const segmentAngle = 360 / rewards.length;
    const finalRotation = 360 * 6 + (360 - randomIndex * segmentAngle - segmentAngle / 2);

    setSpinning(true);
    setRotation(finalRotation);

    setTimeout(() => {
      const win = rewards[randomIndex];
      setSelectedReward(win);
      setSpinning(false);
      localStorage.setItem("userReward", JSON.stringify(win));
    }, 4500);
  };

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

  if (!isInitialized) return <div className="min-h-screen " />;

  return (
    <main className="min-h-screen  flex items-center justify-center p-8">
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
                        x="150" y="150" fill="#fff" fontSize="12" fontWeight="600" textAnchor="middle" dominantBaseline="middle"
                        transform={`rotate(${startAngle + angle / 2} 150 150) translate(0 -105)`}
                      >
                        {/* FIXED: Added types for word and index here */}
                        {reward.title.split(" ").map((word: string, index: number) => (
                          <tspan
                            key={index}
                            x="150"
                            dy={index === 0 ? "0" : "1.2em"}
                          >
                            {word}
                          </tspan>
                        ))}
                      </text>
                    </g>
                  );
                })}
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
            <div className="/20 border-2 border-dashed border-[#5C2E0E]/20 p-5 rounded-2xl">
              <span className="block text-[10px] tracking-widest opacity-50 mb-1">Collect voucher from our staff.</span>
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