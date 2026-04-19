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
  const [fallbackMode, setFallbackMode] = useState(false);
  const [result, setResult] = useState("");
  const scannerRef = useRef<any>(null);

  const canUseCamera =
    typeof window !== "undefined" &&
    window.isSecureContext &&
    navigator.mediaDevices;

  const startScanner = async () => {
    if (!canUseCamera) {
      setFallbackMode(true);
      return;
    }

    if (scannerRef.current) return;

    setOpening(true);

    setTimeout(() => {
      setScanning(true);

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
          setFallbackMode(true);
          setScanning(false);
          setOpening(false);
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

  // 📂 Fallback image scan
  const handleFileScan = async (file: File) => {
    try {
      const scanner = new Html5Qrcode("reader");
      const result = await scanner.scanFile(file, true);
      setResult(result);
    } catch (err) {
      alert("Could not scan this image.");
    }
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

      {/* Main */}
      <div className="z-10 text-center flex flex-col items-center gap-8 px-6 w-full max-w-md">
        <Image
          src="/images/elevate-studio-logo.png"
          alt="Elevate Studio"
          width={400}
          height={200}
        />

        <AnimatePresence mode="wait">

          {/* START */}
          {!opening && !scanning && !fallbackMode && (
            <motion.button
              key="start"
              onClick={startScanner}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-12 py-3 bg-white text-[#8B4513] rounded-full text-xl border shadow-lg"
            >
              START
            </motion.button>
          )}

          {/* 🚪 Door Animation */}
          {opening && !scanning && (
            <div className="fixed inset-0 z-50 flex">
              <motion.div
                animate={{ x: "-100%" }}
                transition={{ duration: 1.1 }}
                className="w-1/2 h-full bg-[#8B4513]"
              />
              <motion.div
                animate={{ x: "100%" }}
                transition={{ duration: 1.1 }}
                className="w-1/2 h-full bg-[#8B4513]"
              />
            </div>
          )}

          {/* 📷 Camera Scanner */}
          {scanning && (
            <motion.div className="w-full">
              <div className="relative mx-auto w-full max-w-[300px] aspect-square bg-black rounded-3xl overflow-hidden">
                <div id="reader" className="w-full h-full" />
              </div>

              <button onClick={stopScanner} className="mt-4 underline">
                Cancel
              </button>
            </motion.div>
          )}

          {/* 📂 Fallback Upload */}
          {fallbackMode && (
            <motion.div
              key="fallback"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-4"
            >
              <p className="text-[#8B4513]">
                Camera not available. Upload QR image:
              </p>

              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    handleFileScan(e.target.files[0]);
                  }
                }}
                className="block"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* RESULT */}
        {result && (
          <div className="bg-white p-3 rounded-xl">
            <p className="text-[#8B4513]">
              Result: <span className="text-black">{result}</span>
            </p>
          </div>
        )}

      </div>
    </main>
  );
}