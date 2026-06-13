"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Eye, Star } from "lucide-react";
import { useNewArrivals } from "@/lib/hooks";
import type { Product } from "@/types";
import { Loader2 } from "lucide-react";

function ProductCard({ product, index }: { product: Product; index: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08, duration: 0.6 }} className="group">
      <Link href={`/product/${product.id}`}>
        <div className="product-card">
          <div className="product-image-wrapper bg-champagne-light">
            <Image src={product.images[0]} alt={product.name} fill className="object-cover" sizes="(max-width: 640px) 50vw, 25vw" />
            {product.images[1] && <Image src={product.images[1]} alt="" fill className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-700" sizes="25vw" />}
            <div className="product-overlay" />
            <div className="absolute top-3 left-3 z-10"><span className="px-2.5 py-1 bg-espresso text-white text-[10px] font-poppins font-semibold tracking-widest uppercase">New</span></div>
            <div className="absolute top-3 right-3 flex flex-col gap-2 z-10 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-3 group-hover:translate-x-0">
              <motion.button whileHover={{ scale: 1.15 }} className="w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-luxury hover:bg-rose hover:text-white transition-colors" onClick={(e) => e.preventDefault()}><Heart size={15} /></motion.button>
              <motion.button whileHover={{ scale: 1.15 }} className="w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-luxury hover:bg-espresso hover:text-white transition-colors" onClick={(e) => e.preventDefault()}><Eye size={15} /></motion.button>
            </div>
            <div className="absolute bottom-0 left-0 right-0 z-10 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-full group-hover:translate-y-0">
              <button className="w-full py-3 bg-espresso/90 text-white text-sm font-poppins font-semibold tracking-[0.2em] uppercase flex items-center justify-center gap-2 hover:bg-gold hover:text-espresso transition-colors" onClick={(e) => e.preventDefault()}><ShoppingBag size={14} />Add to Bag</button>
            </div>
          </div>
          <div className="p-4">
            <p className="text-[11px] font-poppins text-espresso tracking-widest uppercase mb-1.5">{product.category}</p>
            <h3 className="font-playfair text-lg text-espresso mb-2 group-hover:text-gold transition-colors line-clamp-1">{product.name}</h3>
            <div className="flex items-center gap-1 mb-2">{Array.from({ length: 5 }).map((_, i) => (<Star key={i} size={11} className={i < Math.floor(product.rating) ? "fill-gold text-gold" : "text-champagne-dark"} />))}</div>
            <span className="font-poppins text-base font-semibold text-espresso">₹{product.price.toLocaleString()}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function NewArrivalsPage() {
  const { data: newProducts, isLoading } = useNewArrivals();

  return (
    <div className="min-h-screen bg-ivory">
      <section className="relative h-[280px] md:h-[350px] overflow-hidden bg-ivory">
        <Image src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&q=80" alt="New Arrivals" fill className="object-cover opacity-80" sizes="100vw" />
        <div className="absolute inset-0 bg-white/10" />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <p className="font-cormorant italic text-gold text-xl mb-2 font-medium">Just Arrived</p>
            <h1 className="font-playfair text-5xl md:text-6xl text-espresso font-bold">New Arrivals</h1>
          </motion.div>
        </div>
      </section>
      <div className="max-w-[1400px] mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {isLoading || !newProducts ? (
            <div className="col-span-full flex justify-center py-20">
              <Loader2 className="w-8 h-8 text-gold animate-spin" />
            </div>
          ) : (
            newProducts.map((p, i) => (<ProductCard key={p.id} product={p} index={i} />))
          )}
        </div>
      </div>
    </div>
  );
}
