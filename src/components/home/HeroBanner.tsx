"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { useBanners } from "@/lib/hooks";
import type { Banner } from "@/types";

const fallbackBanners: Banner[] = [
  {
    id: "1",
    title: "The Luxury Edit",
    subtitle: "Curated pieces for the modern woman who defines elegance",
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1920&q=85",
    cta: "Explore Collection",
    link: "/shop",
  },
  {
    id: "2",
    title: "Modern Muse",
    subtitle: "Where contemporary meets timeless sophistication",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&q=85",
    cta: "Shop Now",
    link: "/shop",
  },
  {
    id: "3",
    title: "Soft Glam",
    subtitle: "Effortless beauty in every thread",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&q=85",
    cta: "Discover More",
    link: "/offers",
  },
];

export function HeroBanner() {
  const { data: apiBanners } = useBanners();
  const banners = (apiBanners && apiBanners.length > 0) ? apiBanners : fallbackBanners;

  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const go = useCallback((idx: number) => {
    setDirection(idx > current ? 1 : -1);
    setCurrent(idx);
  }, [current]);

  const next = useCallback(() => go((current + 1) % banners.length), [current, banners.length, go]);
  const prev = useCallback(() => go((current - 1 + banners.length) % banners.length), [current, banners.length, go]);

  useEffect(() => {
    const t = setInterval(next, 5500);
    return () => clearInterval(t);
  }, [next]);

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? "8%" : "-8%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? "-8%" : "8%", opacity: 0 }),
  };

  return (
    <section
      id="hero-banner"
      className="relative w-full overflow-hidden bg-[#1A1A1A]"
      style={{ height: "min(90vh, 780px)" }}
    >
      <AnimatePresence custom={direction} initial={false}>
        <motion.div
          key={current}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          {/* Background Image */}
          <Image
            src={banners[current].image}
            alt={banners[current].title}
            fill
            priority
            className="object-cover object-top"
            sizes="100vw"
          />
          {/* Overlay */}
          <div className="absolute inset-0" style={{
            background: "linear-gradient(105deg, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.25) 55%, rgba(0,0,0,0.05) 100%)"
          }} />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="luxury-container">
          <AnimatePresence mode="wait">
            <motion.div
              key={`content-${current}`}
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-[600px]"
            >
              <p className="section-label mb-4" style={{ color: "#C4973A" }}>
                ✦ Zaaforia Collection
              </p>
              <h1 className="text-display font-playfair text-white mb-5 leading-tight">
                {banners[current].title}
              </h1>
              <p className="text-xl font-poppins text-white mb-8 max-w-[440px] leading-relaxed">
                {banners[current].subtitle}
              </p>
              <div className="flex items-center gap-4">
                <Link href={banners[current].link} id={`hero-cta-${current}`}>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="btn btn-ghost-white flex items-center gap-3"
                  >
                    {banners[current].cta}
                    <ArrowRight size={14} />
                  </motion.button>
                </Link>
                <Link
                  href="/shop"
                  className="text-white hover:text-white text-base font-poppins font-medium tracking-wider uppercase transition-colors flex items-center gap-1"
                >
                  View All
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 z-20 flex gap-0">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            id={`hero-dot-${i}`}
            className="flex-1 h-[3px] bg-white/20 overflow-hidden"
          >
            {i === current && (
              <motion.div
                className="h-full bg-[#C4973A]"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 5.5, ease: "linear" }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Nav Arrows */}
      <button
        id="hero-prev"
        onClick={prev}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/25 transition-colors"
      >
        <ChevronLeft size={18} />
      </button>
      <button
        id="hero-next"
        onClick={next}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/25 transition-colors"
      >
        <ChevronRight size={18} />
      </button>

      {/* Slide counter */}
      <div className="absolute bottom-6 right-6 md:right-10 z-20 font-poppins text-sm text-white tracking-widest">
        {String(current + 1).padStart(2, "0")} / {String(banners.length).padStart(2, "0")}
      </div>
    </section>
  );
}
