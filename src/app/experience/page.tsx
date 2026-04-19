"use client";
import { useEffect, Suspense } from "react"; 
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

const EXPERIENCES = [
  { id: "ground", title: "Ground", desc: "Head to room 1", icon: "🌱" },
  { id: "align", title: "Align", desc: "Head to room 2", icon: "✨" },
  { id: "heat", title: "Heat", desc: "Head to room 3", icon: "🔥" },
];

// 1. Move the logic into a separate component
function ExperienceList() {
  const searchParams = useSearchParams();
  const eventSlug = searchParams.get("event");

  useEffect(() => {
    if (eventSlug) {
      localStorage.setItem("selected_event", eventSlug);
      console.log("Event saved:", eventSlug);
    }
  }, [eventSlug]);

  return (
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
  );
}

// 2. The main Export wrapped in Suspense
export default function ExperiencePage() {
  return (
    <main className="min-h-screen bg-[#D2D6C6] p-6 font-serif flex flex-col">
      <header className="mt-12 mb-10 text-center">
        <h1 className="text-white text-4xl mb-2">Choose Your Path</h1>
      </header>

      {/* 3. Wrap only the part that uses useSearchParams in Suspense */}
      <Suspense fallback={
        <div className="flex-1 flex items-center justify-center">
          <p className="text-[#5C2E0E]/50 animate-pulse tracking-widest">LOADING PATHS...</p>
        </div>
      }>
        <ExperienceList />
      </Suspense>
    </main>
  );
}