"use client";
import { useEffect } from "react"; // 1. Import useEffect
import { useSearchParams } from "next/navigation"; // 2. Import hook
import Link from "next/link";
import { motion } from "framer-motion";

const EXPERIENCES = [
  { id: "ground", title: "Ground", desc: "Head to room 1", icon: "🌱" },
  { id: "align", title: "Align", desc: "Head to room 2", icon: "✨" },
  { id: "heat", title: "Heat", desc: "Head to room 3", icon: "🔥" },
];

export default function ExperiencePage() {
  const searchParams = useSearchParams();
  const eventSlug = searchParams.get("event"); // Get 'event-slug' from URL

  useEffect(() => {
    if (eventSlug) {
      // Save it to localStorage when the component mounts or slug changes
      localStorage.setItem("selected_event", eventSlug);
      console.log("Event saved:", eventSlug);
    }
  }, [eventSlug]);

  return (
    <main className="min-h-screen bg-[#D2D6C6] p-6 font-serif flex flex-col">
      <header className="mt-12 mb-10 text-center">
        <h1 className="text-white text-4xl mb-2">Choose Your Path</h1>
        {/* <p className="text-[#5C2E0E]/60 italic">
          Current Event: <span className="font-bold">{eventSlug || "None"}</span>
        </p> */}
      </header>

      <div className="flex-1 flex flex-col gap-4">
        {EXPERIENCES.map((exp, i) => (
          <motion.div
            key={exp.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Link 
              href={`/confirm?choice=${exp.id}`}
              className="block bg-white/40 backdrop-blur-md border border-white/50 p-6 rounded-[2rem] active:scale-[0.98] transition-all shadow-sm group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs uppercase tracking-widest text-[#5C2E0E]/50 font-sans font-bold">Studio Session</span>
                  <h2 className="text-2xl text-[#5C2E0E]">{exp.title}</h2>
                  <p className="text-sm text-[#5C2E0E]/70 font-sans mt-1">{exp.desc}</p>
                </div>
                <span className="text-3xl grayscale group-hover:grayscale-0 transition-all">{exp.icon}</span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </main>
  );
}