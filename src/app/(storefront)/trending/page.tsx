"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Star, Flame } from "lucide-react";
import { useTrendingProducts } from "@/lib/hooks";
import { Loader2 } from "lucide-react";

export default function TrendingPage() {
  const { data: trending, isLoading } = useTrendingProducts();

  return (
    <div className="min-h-screen bg-ivory">
      <section className="relative h-[280px] md:h-[350px] overflow-hidden bg-ivory">
        <Image src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1920&q=80" alt="Trending" fill className="object-cover opacity-85" sizes="100vw" />
        <div className="absolute inset-0 bg-white/10" />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <Flame size={28} className="mx-auto mb-3 text-gold" />
            <h1 className="font-playfair text-5xl md:text-6xl text-espresso font-bold">Trending Now</h1>
          </motion.div>
        </div>
      </section>
      <div className="max-w-[1400px] mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {isLoading || !trending ? (
            <div className="col-span-full flex justify-center py-20">
              <Loader2 className="w-8 h-8 text-gold animate-spin" />
            </div>
          ) : (
            trending.map((product, i) => (
              <motion.div key={product.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="group">
                <Link href={`/product/${product.id}`}>
                  <div className="product-card">
                    <div className="product-image-wrapper bg-champagne-light">
                      <Image src={product.images[0]} alt={product.name} fill className="object-cover" sizes="25vw" />
                      <div className="product-overlay" />
                      <div className="absolute top-3 left-3 z-10"><span className="px-2.5 py-1 bg-gold text-espresso text-[10px] font-poppins font-semibold tracking-widest uppercase flex items-center gap-1"><Flame size={10} />Trending</span></div>
                      <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <motion.button whileHover={{ scale: 1.15 }} className="w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-luxury hover:bg-rose hover:text-white transition-colors" onClick={(e) => e.preventDefault()}><Heart size={15} /></motion.button>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 z-10 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-full group-hover:translate-y-0">
                        <button className="w-full py-3 bg-espresso/90 text-white text-sm font-poppins font-semibold tracking-[0.2em] uppercase flex items-center justify-center gap-2" onClick={(e) => e.preventDefault()}><ShoppingBag size={14} />Add to Bag</button>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-playfair text-lg text-espresso mb-2 group-hover:text-gold transition-colors line-clamp-1">{product.name}</h3>
                      <div className="flex items-center gap-1 mb-2">{Array.from({ length: 5 }).map((_, j) => (<Star key={j} size={11} className={j < Math.floor(product.rating) ? "fill-gold text-gold" : "text-champagne-dark"} />))}</div>
                      <span className="font-poppins text-base font-semibold text-espresso">₹{product.price.toLocaleString()}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
