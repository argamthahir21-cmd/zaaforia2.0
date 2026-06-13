"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Eye, Star } from "lucide-react";
import { useNewArrivals } from "@/lib/hooks";
import type { Product } from "@/types";
import { Loader2 } from "lucide-react";

function ProductCard({ product, index }: { product: Product; index: number }) {
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="group"
    >
      <Link href={`/product/${product.id}`}>
        <div className="product-card">
          <div className="product-image-wrapper bg-champagne-light">
            <Image src={product.images[0]} alt={product.name} fill className="object-cover" sizes="(max-width: 640px) 50vw, 25vw" />
            {product.images[1] && (
              <Image src={product.images[1]} alt={`${product.name} alt`} fill className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-700" sizes="25vw" />
            )}
            <div className="product-overlay" />
            <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
              {product.isNew && <span className="px-2.5 py-1 bg-espresso text-white text-[10px] font-poppins font-semibold tracking-widest uppercase">New</span>}
              {discount > 0 && <span className="px-2.5 py-1 bg-rose text-white text-[10px] font-poppins font-semibold tracking-widest uppercase">-{discount}%</span>}
              {product.isTrending && <span className="px-2.5 py-1 bg-gold text-espresso text-[10px] font-poppins font-semibold tracking-widest uppercase">Trending</span>}
            </div>
            <div className="absolute top-3 right-3 flex flex-col gap-2 z-10 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-3 group-hover:translate-x-0">
              <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }} className="w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-luxury hover:bg-rose hover:text-white transition-colors" aria-label="Wishlist" onClick={(e) => e.preventDefault()}><Heart size={15} /></motion.button>
              <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }} className="w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-luxury hover:bg-espresso hover:text-white transition-colors" aria-label="Quick view" onClick={(e) => e.preventDefault()}><Eye size={15} /></motion.button>
            </div>
            <div className="absolute bottom-0 left-0 right-0 z-10 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-full group-hover:translate-y-0">
              <button className="w-full py-3 bg-espresso/90 backdrop-blur-sm text-white text-sm font-poppins font-semibold tracking-[0.2em] uppercase flex items-center justify-center gap-2 hover:bg-gold hover:text-espresso transition-colors" onClick={(e) => e.preventDefault()}><ShoppingBag size={14} />Add to Bag</button>
            </div>
          </div>
          <div className="p-4">
            <p className="text-[11px] font-poppins text-espresso tracking-widest uppercase mb-1.5">{product.category}</p>
            <h3 className="font-playfair text-lg text-espresso mb-2 group-hover:text-gold transition-colors line-clamp-1">{product.name}</h3>
            <div className="flex items-center gap-1 mb-2">
              {Array.from({ length: 5 }).map((_, i) => (<Star key={i} size={11} className={i < Math.floor(product.rating) ? "fill-gold text-gold" : "text-champagne-dark"} />))}
              <span className="text-[10px] font-poppins text-espresso ml-1">({product.reviewCount})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-poppins text-base font-semibold text-espresso">₹{product.price.toLocaleString()}</span>
              {product.originalPrice && <span className="font-poppins text-sm text-espresso line-through">₹{product.originalPrice.toLocaleString()}</span>}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function NewArrivals() {
  const { data: newProducts, isLoading } = useNewArrivals();
  return (
    <section className="section-padding bg-white">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="text-center mb-16">
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="font-cormorant italic text-gold text-xl mb-3">Just Arrived</motion.p>
          <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="font-playfair text-5xl md:text-5xl text-espresso mb-4">New Arrivals</motion.h2>
          <div className="luxury-divider" />
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="font-poppins text-espresso text-base mt-4 max-w-md mx-auto">Discover our latest additions — handpicked pieces that define modern luxury.</motion.p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {isLoading || !newProducts ? (
            <div className="col-span-full flex justify-center py-20">
              <Loader2 className="w-8 h-8 text-gold animate-spin" />
            </div>
          ) : (
            newProducts.map((product, i) => (<ProductCard key={product.id} product={product} index={i} />))
          )}
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mt-12">
          <Link href="/new-arrivals" className="btn-luxury btn-luxury-outline">View All New Arrivals</Link>
        </motion.div>
      </div>
    </section>
  );
}
