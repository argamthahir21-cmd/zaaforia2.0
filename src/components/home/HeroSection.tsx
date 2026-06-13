"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";
import { useCinemaStore } from "@/lib/store/useCinemaStore";
import { useContent } from "@/context/ContentContext";

if (typeof window !== "undefined") {
  gsap.registerPlugin();
}

export function HeroSection() {
  const { isIntroFinished } = useCinemaStore();
  const heroRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const { getContent } = useContent();

  useEffect(() => {
    if (!isIntroFinished) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.fromTo(
        imageRef.current,
        { opacity: 0, scale: 1.05 },
        { opacity: 1, scale: 1, duration: 1.5, ease: "power3.out" }
      ).fromTo(
        textRef.current,
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 1.2, ease: "power3.out" },
        "-=1.0"
      );
    }, heroRef);

    return () => ctx.revert();
  }, [isIntroFinished]);

  if (!isIntroFinished) return null;

  const label = getContent("home.hero.label", "Maison Zaaforia");
  const heading = getContent("home.hero.heading", "The Art of\nCouture");
  const description = getContent("home.hero.description", "An invitation to timeless elegance, exquisite craftsmanship, and contemporary silhouettes designed for the modern woman.");
  const cta1Text = getContent("home.hero.cta1_text", "Discover Collection");
  const cta1Link = getContent("home.hero.cta1_link", "/shop");
  const cta2Text = getContent("home.hero.cta2_text", "Explore Jewelry");
  const cta2Link = getContent("home.hero.cta2_link", "/shop?category=Accessories");
  const imageUrl = getContent("home.hero.image", "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1600&q=80");

  return (
    <section ref={heroRef} className="bg-[#FAFAF7] relative border-b border-[#E5E2DE] overflow-hidden">
      <div className="luxury-container flex flex-col lg:flex-row min-h-[85vh]">
        {/* Left Text Panel */}
        <div 
          ref={textRef} 
          className="w-full lg:w-1/2 flex flex-col justify-center py-20 lg:py-0 pr-8 lg:pr-24 z-10 opacity-0"
        >
          <span className="text-[#B8945F] font-jost text-[11px] md:text-xs tracking-[0.3em] uppercase mb-8 font-medium">
            {label}
          </span>
          <h1 className="font-cormorant font-light text-[#1A1A1A] leading-[1.15] mb-10 tracking-wide text-5xl md:text-6xl lg:text-7xl uppercase whitespace-pre-line">
            {heading}
          </h1>
          <p className="font-jost text-espresso text-base md:text-lg mb-16 leading-[2] font-light max-w-md">
            {description}
          </p>

          <div className="flex flex-col sm:flex-row items-start gap-6">
            <Link href={cta1Link} className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-12 py-5 bg-[#1A1A1A] text-white hover:bg-[#3D3D3D] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 font-jost text-[11px] md:text-xs tracking-[0.2em] uppercase font-medium">
                {cta1Text}
              </button>
            </Link>
            <Link href={cta2Link} className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-12 py-5 bg-transparent border border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A]/5 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 font-jost text-[11px] md:text-xs tracking-[0.2em] uppercase font-medium">
                {cta2Text}
              </button>
            </Link>
          </div>
        </div>

        {/* Right Image Panel */}
        <div 
          ref={imageRef}
          className="w-full lg:w-1/2 relative min-h-[50vh] lg:min-h-full opacity-0 flex items-center justify-center py-8 lg:py-16"
        >
          <div className="relative w-full h-full min-h-[400px] lg:min-h-[600px] aspect-[4/5] lg:aspect-auto overflow-hidden bg-[#E5E2DE]">
            <Image
              src={imageUrl}
              alt="Zaaforia Couture Campaign"
              fill
              priority
              className="object-cover object-center transition-transform duration-[2s] hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
