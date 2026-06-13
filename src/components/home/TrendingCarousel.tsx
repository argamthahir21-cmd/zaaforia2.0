"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Star } from "lucide-react";
import { useTrendingProducts } from "@/lib/hooks";
import { useRef } from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { TiltCard } from "@/components/ui/TiltCard";

export function TrendingCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { data: trending, isLoading } = useTrendingProducts();

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = dir === "left" ? -340 : 340;
    scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <section className="section-padding bg-ivory overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex items-end justify-between mb-12">
          <div>
            <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="font-cormorant italic text-gold text-xl mb-3">What&apos;s Hot</motion.p>
            <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="font-playfair text-5xl md:text-5xl text-espresso">Trending Now</motion.h2>
          </div>
          <div className="hidden md:flex gap-2">
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => scroll("left")} className="w-11 h-11 border border-espresso/20 rounded-full flex items-center justify-center hover:bg-espresso hover:text-white transition-all"><ChevronLeft size={18} /></motion.button>
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => scroll("right")} className="w-11 h-11 border border-espresso/20 rounded-full flex items-center justify-center hover:bg-espresso hover:text-white transition-all"><ChevronRight size={18} /></motion.button>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex gap-5 overflow-x-auto scrollbar-hide pl-6 md:pl-[max(1.5rem,calc((100vw-1400px)/2+1.5rem))] pr-6 pb-4 snap-x snap-mandatory" style={{ scrollbarWidth: "none" }}>
        {isLoading || !trending ? (
          <div className="w-full flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-gold animate-spin" />
          </div>
        ) : (
          trending.map((product, index) => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="w-[280px] md:w-[320px] flex-shrink-0 group"
            >
              <TiltCard>
                <div className="relative aspect-[3/4] mb-4 overflow-hidden rounded-lg">
                  <Link href={`/product/${product.id}`}>
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 280px, 320px"
                    />
                  </Link>
                  {product.isNew && (
                    <span className="absolute top-4 left-4 bg-white/90 px-3 py-1 text-[10px] font-poppins font-semibold tracking-widest uppercase">
                      New
                    </span>
                  )}
                  <button className="absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-luxury hover:bg-rose/10 transition-colors z-10">
                    <Heart size={16} className="text-espresso" />
                  </button>
                  <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[0.22,1,0.36,1]">
                    <button className="w-full py-3 bg-white/95 backdrop-blur-sm text-espresso font-poppins text-sm font-semibold tracking-[0.2em] uppercase hover:bg-espresso hover:text-white transition-colors duration-300">
                      Quick Add
                    </button>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm font-poppins text-espresso tracking-[0.2em] uppercase mb-2">
                    {product.category}
                  </p>
                  <h3 className="font-playfair text-xl text-espresso mb-2">
                    <Link href={`/product/${product.id}`} className="hover:text-gold transition-colors">
                      {product.name}
                    </Link>
                  </h3>
                  <p className="font-poppins font-medium text-espresso">
                    ₹{product.price.toLocaleString()}
                  </p>
                </div>
              </TiltCard>
            </motion.div>
          ))
        )}
      </div>
    </section>
  );
}
