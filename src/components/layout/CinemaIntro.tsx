"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCinemaStore } from "@/lib/store/useCinemaStore";
import { useContent } from "@/context/ContentContext";

export function CinemaIntro() {
  const { isIntroFinished, finishIntro } = useCinemaStore();
  const [mounted, setMounted] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const { getContent } = useContent();

  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = "hidden";

    const timer = setTimeout(() => setIsExiting(true), 3500);

    return () => {
      document.body.style.overflow = "";
      clearTimeout(timer);
    };
  }, []);

  if (!mounted || isIntroFinished) return null;

  const handleExitComplete = () => {
    finishIntro();
    document.body.style.overflow = "";
  };

  const welcomeText = getContent("home.intro.welcome", "Welcome to");
  const brandName = getContent("home.intro.brand", "ZAAFORIA");

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {!isExiting && (
        <motion.div
          key="intro-container"
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            transition: { duration: 1.2, ease: "easeInOut" } 
          }}
          className="fixed inset-0 z-[9999] bg-[#FAFAF7] flex flex-col justify-center items-center pointer-events-auto"
        >
          <button
            onClick={() => setIsExiting(true)}
            className="absolute top-6 right-8 font-jost text-[10px] tracking-[0.2em] uppercase transition-colors z-50 cursor-pointer border-none bg-transparent text-espresso hover:text-[#1A1A1A]"
          >
            Skip Intro
          </button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
            className="flex flex-col items-center text-center px-4"
          >
            <span className="font-jost text-[11px] md:text-sm tracking-[0.3em] uppercase text-[#B8945F] mb-6 font-medium">
              {welcomeText}
            </span>
            <h1 className="font-cormorant text-5xl md:text-6xl lg:text-7xl tracking-[0.2em] text-[#1A1A1A] font-light uppercase">
              {brandName}
            </h1>
            <div className="w-12 h-[1px] bg-[#1A1A1A]/30 mt-8 mb-6"></div>
            <p className="font-jost text-sm tracking-[0.2em] uppercase text-espresso font-light">
              Haute Couture & Fine Jewelry
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}




