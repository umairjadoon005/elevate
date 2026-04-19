"use client";
import React, { useState, useRef } from "react";
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
  const [result, setResult] = useState("");
  const scannerRef = useRef<any>(null);

  const startScanner = async () => {
    setOpening(true);

    // Door animation duration
    setTimeout(() => {
      setScanning(true);

      // Start camera slightly after scanner mounts
      setTimeout(async () => {
        try {
          const scanner = new Html5Qrcode("reader");
          scannerRef.current = scanner;

          await scanner.start(
            { facingMode: "environment" },
            { fps: 10, qrbox: { width: 250, height: 250 } },
            (decodedText) => {
              setResult(decodedText);
              stopScanner();
            },
            () => {}
          );
        } catch (err) {
          console.error(err);
          setScanning(false);
          setOpening(false);
          alert("Camera access failed. Use HTTPS.");
        }
      }, 300);
    }, 1100);
  };

  const stopScanner = async () => {
    if (scannerRef.current) {
      await scannerRef.current.stop();
      scannerRef.current = null;
    }
    setScanning(false);
    setOpening(false);
  };

  return (
    <main className="relative min-h-screen w-full flex flex-col items-center justify-center bg-[#D2D6C6] overflow-hidden font-serif">
      
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

      {/* Main Content */}
      <div className="z-10 text-center flex flex-col items-center gap-8 px-6 w-full max-w-md">
        <Image
          src="/images/elevate-studio-logo.png"
          alt="Elevate Studio"
          width={400}
          height={200}
          className="mx-auto drop-shadow-sm"
        />

        <AnimatePresence mode="wait">

          {/* START BUTTON */}
          {!opening && !scanning && (
            <motion.button
              key="start"
              onClick={startScanner}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-12 py-3 bg-white text-[#8B4513] rounded-full text-xl font-medium tracking-widest border-2 border-[#8B4513]/20 shadow-lg"
            >
              START
            </motion.button>
          )}

          {/* 🚪 DOOR ANIMATION */}
          {opening && !scanning && (
            <motion.div
              key="door"
              className="fixed inset-0 z-50 flex"
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* LEFT DOOR */}
              <motion.div
                initial={{ x: 0 }}
                animate={{ x: "-100%" }}
                transition={{ duration: 1.1, ease: "easeInOut" }}
                className="w-1/2 h-full bg-[#8B4513] flex items-center justify-end pr-4 shadow-inner"
              >
                <div className="w-2 h-24 bg-white/30 rounded-full" />
              </motion.div>

              {/* RIGHT DOOR */}
              <motion.div
                initial={{ x: 0 }}
                animate={{ x: "100%" }}
                transition={{ duration: 1.1, ease: "easeInOut" }}
                className="w-1/2 h-full bg-[#8B4513] flex items-center justify-start pl-4 shadow-inner"
              >
                <div className="w-2 h-24 bg-white/30 rounded-full" />
              </motion.div>
            </motion.div>
          )}

          {/* 📷 SCANNER */}
          {scanning && (
            <motion.div
              key="scanner"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="relative w-full"
            >
              <div className="relative mx-auto w-full aspect-square max-w-[300px] rounded-[2.5rem] overflow-hidden border-8 border-white shadow-2xl bg-black">
                <div id="reader" className="w-full h-full" />

                {/* Lens overlay */}
                <div className="absolute inset-0 pointer-events-none border-[30px] border-black/30" />

                {/* Scan line */}
                <motion.div 
                  animate={{ top: ["10%", "90%", "10%"] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute left-0 right-0 h-[2px] bg-[#8B4513] shadow-[0_0_15px_#8B4513]"
                />

                {/* Corners */}
                <div className="absolute top-6 left-6 w-4 h-4 border-t-2 border-l-2 border-white/80" />
                <div className="absolute top-6 right-6 w-4 h-4 border-t-2 border-r-2 border-white/80" />
                <div className="absolute bottom-6 left-6 w-4 h-4 border-b-2 border-l-2 border-white/80" />
                <div className="absolute bottom-6 right-6 w-4 h-4 border-b-2 border-r-2 border-white/80" />
              </div>

              <button 
                onClick={stopScanner}
                className="mt-6 text-[#8B4513] font-medium underline underline-offset-4 opacity-70"
              >
                Cancel Scan
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* RESULT */}
        <AnimatePresence>
          {result && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/90 backdrop-blur-md px-6 py-3 rounded-2xl border border-[#8B4513]/20"
            >
              <p className="text-[#8B4513] font-semibold">
                Successfully Scanned:{" "}
                <span className="text-black font-mono">{result}</span>
              </p>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent pointer-events-none" />
    </main>
  );
}