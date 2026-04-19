"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Html5Qrcode } from "html5-qrcode";

const floatingIcons = [
  { id: 1, content: "🧘", top: "10%", left: "15%", size: "text-4xl" },
  { id: 2, content: "🔥", top: "25%", left: "70%", size: "text-3xl" },
  { id: 3, content: "🛋️", top: "45%", left: "80%", size: "text-2xl" },
  { id: 4, content: "🔴", top: "65%", left: "10%", size: "text-3xl" },
  { id: 5, content: "🩰", top: "80%", left: "20%", size: "text-4xl" },
  { id: 6, content: "🏋️", top: "70%", left: "75%", size: "text-3xl" },
];

export default function ElevateStudio() {
  const [opening, setOpening] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [fallbackMode, setFallbackMode] = useState(false);
  const [error, setError] = useState("");
  const scannerRef = useRef<Html5Qrcode | null>(null);

  const canUseCamera = typeof window !== "undefined" && window.isSecureContext && navigator.mediaDevices;

  const handleScanResult = (decodedText: string) => {
    try {
      const url = new URL(decodedText);
      const currentHost = window.location.hostname;

      if (url.hostname === currentHost || url.hostname.endsWith(`.${currentHost}`)) {
        window.location.href = decodedText;
      } else {
        setError("Invalid URL: Link does not belong to Elevate Studio.");
        stopScanner();
      }
    } catch (e) {
      setError("Invalid format: Not a valid URL.");
      stopScanner();
    }
  };

  const startScanner = async () => {
    setError("");
    if (!canUseCamera) {
      setFallbackMode(true);
      return;
    }
    setOpening(true);

    setTimeout(() => {
      setScanning(true);
      setTimeout(async () => {
        try {
          const scanner = new Html5Qrcode("reader");
          scannerRef.current = scanner;

          await scanner.start(
            { facingMode: "environment" },
            { 
              fps: 20, 
              // Setting qrbox to a larger percentage or removing fixed constraints helps full frame
              qrbox: (viewfinderWidth, viewfinderHeight) => {
                return { width: viewfinderWidth * 0.7, height: viewfinderWidth * 0.7 };
              },
              aspectRatio: 1.0 // Force square aspect for the logic
            },
            (decodedText) => handleScanResult(decodedText),
            () => {}
          );
        } catch (err) {
          setFallbackMode(true);
          setScanning(false);
          setOpening(false);
        }
      }, 300);
    }, 1100);
  };

  const stopScanner = async () => {
    if (scannerRef.current) {
      try { await scannerRef.current.stop(); } catch (e) {}
      scannerRef.current = null;
    }
    setScanning(false);
    setOpening(false);
  };

  return (
    <main className="relative min-h-screen w-full flex flex-col items-center justify-center bg-[#D2D6C6] overflow-hidden font-serif">
      
      {/* CSS Hack for Full Frame Video */}
      <style jsx global>{`
        #reader video {
          object-fit: cover !important;
          width: 100% !important;
          height: 100% !important;
          border-radius: 32px;
        }
      `}</style>

      {/* Floating Background */}
      <div className="absolute inset-0 pointer-events-none">
        {floatingIcons.map((icon) => (
          <motion.div
            key={icon.id}
            animate={{ y: [0, -20, 0], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4 + Math.random() * 2, repeat: Infinity }}
            className={`absolute ${icon.size} opacity-80`}
            style={{ top: icon.top, left: icon.left }}
          >
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm border border-white/30 shadow-sm">
              {icon.content}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="z-10 text-center flex flex-col items-center gap-8 px-6 w-full max-w-md">
        <Image src="/images/elevate-studio-logo.png" alt="Elevate Studio" width={400} height={200} />

        <AnimatePresence mode="wait">
          {!opening && !scanning && !fallbackMode && (
            <motion.div key="start-container" className="flex flex-col items-center gap-4">
              <motion.button
                onClick={startScanner}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-12 py-3 bg-white text-[#8B4513] rounded-full text-xl border shadow-lg"
              >
                START
              </motion.button>
              {error && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[#8B4513] font-bold mt-2">
                  {error}
                </motion.p>
              )}
            </motion.div>
          )}

          {/* Door Animation */}
          {opening && !scanning && (
            <div className="fixed inset-0 z-50 flex">
              <motion.div animate={{ x: "-100%" }} transition={{ duration: 1.1, ease: "easeInOut" }} className="w-1/2 h-full bg-[#8B4513]" />
              <motion.div animate={{ x: "100%" }} transition={{ duration: 1.1, ease: "easeInOut" }} className="w-1/2 h-full bg-[#8B4513]" />
            </div>
          )}

          {/* Full Frame Elegant Scanner */}
          {scanning && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full flex flex-col items-center">
              <div className="relative w-[300px] h-[300px] bg-black rounded-[40px] shadow-2xl overflow-hidden border-4 border-white">
                
                {/* The actual scanner element */}
                <div id="reader" className="w-full h-full" />
                
                {/* Visual "Laser" Overlay */}
                <div className="absolute inset-0 pointer-events-none z-20">
                  <motion.div 
                    animate={{ top: ["10%", "90%", "10%"] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute left-0 right-0 h-[2px] bg-red-500 shadow-[0_0_15px_red]"
                  />
                  {/* Viewfinder corners */}
                  <div className="absolute top-10 left-10 w-10 h-10 border-t-2 border-l-2 border-white/70" />
                  <div className="absolute top-10 right-10 w-10 h-10 border-t-2 border-r-2 border-white/70" />
                  <div className="absolute bottom-10 left-10 w-10 h-10 border-b-2 border-l-2 border-white/70" />
                  <div className="absolute bottom-10 right-10 w-10 h-10 border-b-2 border-r-2 border-white/70" />
                </div>
              </div>

              <button onClick={stopScanner} className="mt-8 text-[#8B4513] underline text-lg">
                Cancel
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}