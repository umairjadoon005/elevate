"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link"; // Import Link for navigation

const ROOM_DATA: Record<string, { room: string; time: string }> = {
  ground: { room: "Ground (Room 1)", time: "Starts Now" },
  align: { room: "Align (Room 2)", time: "Starts Now" },
  heat: { room: "Heat (Room 3)", time: "Starts Now" },
};

export default function ConfirmClient() {
  const searchParams = useSearchParams();
  const choice = searchParams.get("choice") || "align";
  const data = ROOM_DATA[choice];

  useEffect(() => {
    if (choice) {
      localStorage.setItem("selected_choice", choice);
    }
  }, [choice]);

  return (
    <main className="min-h-screen  flex flex-col items-center justify-center p-8 text-center font-serif">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-sm"
      >
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl space-y-6 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-2 /20 rounded-b-full" />
          
          <div className="space-y-2">
            <span className="text-5xl">🧘</span>
            <h1 className="text-3xl text-[#5C2E0E]">You're Confirmed.</h1>
          </div>

          <hr className="border-[#D2D6C6]/30" />

          <div className="/10 p-6 rounded-2xl">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#5C2E0E]/50 mb-2">Location</p>
            <p className="text-2xl text-[#5C2E0E] font-bold">{data.room}</p>
          </div>

          <p className="text-sm text-[#5C2E0E]/40 font-sans">
            Please present this screen to your instructor upon arrival.
          </p>

          {/* --- Event Completed Button --- */}
          <div className="pt-4">
            <Link href="/reward" passHref>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-[#5C2E0E] text-[#D2D6C6] py-4 rounded-2xl font-sans font-bold tracking-widest uppercase text-xs transition-colors hover:bg-[#4a250b] shadow-lg"
              >
                Event Completed
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.div>
    </main>
  );
}