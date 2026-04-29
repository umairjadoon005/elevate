"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";

type Experience = {
  key: string;
  title: string;
  desc: string;
  capacity: number;
  current_count: number;
};

function ExperienceList() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const eventSlugFromURL = searchParams.get("event");

  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingKey, setProcessingKey] = useState<string | null>(null);

  // Save event slug
  useEffect(() => {
    if (eventSlugFromURL) {
      localStorage.setItem("selected_event", eventSlugFromURL);
    }
  }, [eventSlugFromURL]);

  // Fetch experiences
  useEffect(() => {
    const eventSlug = localStorage.getItem("selected_event");

    if (!eventSlug) {
      setError("No event selected");
      setLoading(false);
      return;
    }

    fetch(`https://elevate.synetalsolutions.co/public/api/experiences?event=${eventSlug}`)
      .then(res => res.json())
      .then(data => setExperiences(data.experiences))
      .catch(() => setError("Failed to fetch"))
      .finally(() => setLoading(false));
  }, []);

  // Handle selection
  const handleSelect = async (exp: Experience) => {
    const eventSlug = localStorage.getItem("selected_event");
    if (!eventSlug) return;

    setProcessingKey(exp.key);

    try {
      const res = await fetch("https://elevate.synetalsolutions.co/public/api/attend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          event_slug: eventSlug,
          experience_key: exp.key,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Full");
      }

      router.push(`/confirm?choice=${exp.key}`);
    } catch (err: any) {
      alert(err.message || "This session is full");
    } finally {
      setProcessingKey(null);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-[#5C2E0E]/50 animate-pulse">
          LOADING PATHS...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col gap-4">
      {experiences.map((exp, i) => {
        const isFull = exp.current_count >= exp.capacity;
        const isProcessing = processingKey === exp.key;

        return (
          <motion.div
            key={exp.key}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div
              onClick={() =>
                !isFull && !isProcessing && handleSelect(exp)
              }
              className={`p-6 rounded-[2rem] transition-all shadow-sm border backdrop-blur-md cursor-pointer
                ${
                  isFull
                    ? "bg-gray-200/40 border-gray-300 cursor-not-allowed"
                    : "bg-white/40 border-white/50 active:scale-[0.98]"
                }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl text-[#5C2E0E]">
                    {exp.title}
                  </h2>

                  <p className="text-xs text-[#5C2E0E]/70 mt-1">
                    {exp.desc}
                  </p>

                  <p
                    className={`text-xs mt-2 font-semibold ${
                      isFull ? "text-red-500" : "text-green-600"
                    }`}
                  >
                    {isFull
                      ? "Full"
                      : `${exp.current_count} / ${exp.capacity}`}
                  </p>

                  {isProcessing && (
                    <p className="text-xs text-blue-500 mt-1">
                      Booking...
                    </p>
                  )}
                </div>

                <span className="text-3xl">
                  {exp.key === "ground"
                    ? "🌱"
                    : exp.key === "align"
                    ? "✨"
                    : "🔥"}
                </span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

// ✅ THIS WAS MISSING OR BROKEN
export default function ExperiencePage() {
  return (
    <main className="min-h-screen p-6 font-serif flex flex-col">
      <header className="mt-12 mb-10 text-center">
        <h1 className="text-white text-4xl mb-2">
          Choose Your Path
        </h1>
      </header>

      <Suspense
        fallback={
          <div className="flex-1 flex items-center justify-center">
            <p className="text-[#5C2E0E]/50 animate-pulse">
              LOADING PATHS...
            </p>
          </div>
        }
      >
        <ExperienceList />
      </Suspense>
    </main>
  );
}