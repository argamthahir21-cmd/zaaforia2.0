"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useCategories } from "@/lib/hooks";
import { Loader2 } from "lucide-react";

export function CategoriesShowcase() {
  const { data: categories, isLoading } = useCategories();

  return (
    <section className="section-padding bg-champagne/20">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="text-center mb-16">
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="font-cormorant italic text-gold text-xl mb-3">Explore</motion.p>
          <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="font-playfair text-5xl md:text-5xl text-espresso mb-4">Shop by Category</motion.h2>
          <div className="luxury-divider" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {isLoading || !categories ? (
            <div className="col-span-full flex justify-center py-20">
              <Loader2 className="w-8 h-8 text-gold animate-spin" />
            </div>
          ) : (
            categories.map((cat, i) => (
              <motion.div key={cat.id} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.6 }}>
                <Link href={`/shop?category=${cat.slug}`} className="group block text-center">
                  <div className="relative aspect-square rounded-full overflow-hidden mx-auto w-[85%] mb-5 border-2 border-transparent group-hover:border-gold transition-all duration-500">
                    <Image src={cat.image} alt={cat.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" sizes="200px" />
                    <div className="absolute inset-0 bg-espresso/0 group-hover:bg-espresso/20 transition-colors duration-500" />
                  </div>
                  <h3 className="font-playfair text-xl text-espresso group-hover:text-gold transition-colors mb-1">{cat.name}</h3>
                  <p className="font-poppins text-sm text-espresso">{cat.productCount} Products</p>
                </Link>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
