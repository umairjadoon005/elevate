"use client";
import React, { Suspense, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

const floatingIcons = [
  { id: 1, src: "/images/image1.png", top: "10%", left: "15%", size: 150 },
  { id: 2, src: "/images/image2.png", top: "10%", left: "70%", size: 155 },
  { id: 3, src: "/images/image3.png", top: "45%", left: "80%", size: 145 },
  { id: 4, src: "/images/image4.png", top: "45%", left: "10%", size: 150 },
  { id: 5, src: "/images/image5.png", top: "70%", left: "20%", size: 150 },
  { id: 6, src: "/images/image6.png", top: "70%", left: "75%", size: 150 },
];

function ElevateContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const eventSlug = searchParams.get("event");
  const hasValidEvent = Boolean(eventSlug);

  useEffect(() => {
    if (eventSlug) {
      localStorage.removeItem("userReward");
      localStorage.setItem("selected_event", eventSlug);
      console.log("Event saved to storage:", eventSlug);
    }
  }, [eventSlug]);

  const handleStart = () => {
    router.push("/experience");
  };

  return (
    <div className="z-10 text-center flex flex-col items-center gap-8 px-6 w-full max-w-md">
      <Image
        src="/images/elevate-studio-logo.png"
        alt="Elevate Studio"
        width={300}
        height={150}
        priority
      />

      {!hasValidEvent ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 bg-white/40 backdrop-blur-md rounded-3xl border border-white/50 shadow-2xl text-[#5C5C5C]"
        >
          <h2 className="text-2xl font-semibold mb-2">Welcome</h2>
          <p className="text-sm italic opacity-80">
            Please use a valid event link to begin your journey.
          </p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <motion.button
            onClick={handleStart}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-12 py-3 bg-white text-[#8B4513] rounded-full text-xl border shadow-lg"
          >
            START
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}

export default function ElevateStudio() {
  return (
    <main className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden font-serif">
      
      {/* Floating PNG Icons */}
      <div className="absolute inset-0 pointer-events-none">
        {floatingIcons.map((icon) => (
          <motion.div
            key={icon.id}
            animate={{ y: [0, -20, 0], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4 + Math.random() * 2, repeat: Infinity }}
            className="absolute opacity-80"
            style={{ top: icon.top, left: icon.left }}
          >
            <div className="p-0 bg-transparent">
              <Image
                src={icon.src}
                alt={`icon-${icon.id}`}
                width={icon.size}
                height={icon.size}
                className="object-contain drop-shadow-xl"
              />
            </div>
          </motion.div>
        ))}
      </div>

      <Suspense
        fallback={
          <div className="z-10 animate-pulse text-white/50 italic">
            Preparing your experience...
          </div>
        }
      >
        <ElevateContent />
      </Suspense>
    </main>
  );
}