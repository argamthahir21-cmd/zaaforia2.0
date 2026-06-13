"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { collections } from "@/lib/mockData";

export function FeaturedCollections() {
  return (
    <section className="section-padding bg-ivory">
      <div className="luxury-container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-cormorant italic text-gold text-xl mb-3"
          >
            Curated for You
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-playfair text-5xl md:text-5xl text-espresso mb-4"
          >
            Featured Collections
          </motion.h2>
          <div className="luxury-divider" />
        </div>

        {/* Collection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {collections.map((col, i) => (
            <motion.div
              key={col.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link href={`/shop?collection=${col.slug}`} className="group block">
                <div className="relative aspect-[3/4] rounded-lg overflow-hidden">
                  <Image
                    src={col.image}
                    alt={col.name}
                    fill
                    className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-espresso/70 via-espresso/10 to-transparent transition-opacity duration-500 group-hover:from-espresso/80" />

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                    <p className="font-cormorant italic text-gold-light text-base mb-2 tracking-wider">
                      {col.productCount} Pieces
                    </p>
                    <h3 className="font-playfair text-3xl md:text-4xl text-white mb-2">
                      {col.name}
                    </h3>
                    <p className="font-poppins text-white text-base mb-4">
                      {col.tagline}
                    </p>
                    <motion.span
                      className="inline-flex items-center gap-2 text-sm font-poppins text-gold tracking-[0.2em] uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    >
                      Explore
                      <ArrowUpRight
                        size={14}
                        className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                      />
                    </motion.span>
                  </div>

                  {/* Decorative border on hover */}
                  <div className="absolute inset-3 border border-white/0 group-hover:border-white/20 rounded-lg transition-all duration-700" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
