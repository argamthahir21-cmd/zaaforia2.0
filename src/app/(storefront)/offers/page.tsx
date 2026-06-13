"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Timer, Sparkles, Gift, Percent } from "lucide-react";
import { collections } from "@/lib/mockData";

const offers = [
  { title: "First Order Special", desc: "Get 20% off your first purchase", code: "ZAAFORIA20", icon: Gift, bg: "bg-rose/10", accent: "text-rose" },
  { title: "Free Shipping", desc: "On all orders above ₹2,999", code: "No code needed", icon: Sparkles, bg: "bg-gold/10", accent: "text-gold" },
  { title: "Seasonal Sale", desc: "Up to 40% off on select styles", code: "SEASON40", icon: Percent, bg: "bg-champagne/30", accent: "text-espresso" },
];

export default function OffersPage() {
  return (
    <div className="min-h-screen bg-ivory">
      <div className="max-w-[1400px] mx-auto px-6 py-16">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <Sparkles size={28} className="mx-auto mb-3 text-gold" />
          <h1 className="font-playfair text-5xl md:text-5xl text-espresso mb-4">Offers & Collections</h1>
          <div className="luxury-divider" />
        </motion.div>

        {/* Offer Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {offers.map((offer, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className={`${offer.bg} rounded-xl p-8 text-center`}>
              <offer.icon size={32} className={`mx-auto mb-4 ${offer.accent}`} />
              <h3 className="font-playfair text-2xl text-espresso mb-2">{offer.title}</h3>
              <p className="font-poppins text-base text-espresso mb-4">{offer.desc}</p>
              <span className="inline-block px-4 py-2 bg-white rounded-lg text-sm font-poppins font-semibold text-espresso tracking-wider border border-dashed border-espresso/20">{offer.code}</span>
            </motion.div>
          ))}
        </div>

        {/* Collections */}
        <div className="text-center mb-12">
          <p className="font-cormorant italic text-gold text-xl mb-3">Explore</p>
          <h2 className="font-playfair text-4xl md:text-5xl text-espresso">Featured Collections</h2>
          <div className="luxury-divider" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {collections.map((col, i) => (
            <motion.div key={col.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}>
              <Link href={`/shop?collection=${col.slug}`} className="group block relative aspect-[3/4] rounded-xl overflow-hidden">
                <Image src={col.image} alt={col.name} fill className="object-cover transition-transform duration-[1.2s] group-hover:scale-110" sizes="33vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-espresso/70 via-espresso/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <p className="font-cormorant italic text-gold-light text-base mb-1">{col.productCount} Pieces</p>
                  <h3 className="font-playfair text-3xl text-white">{col.name}</h3>
                  <p className="font-poppins text-white text-sm mt-1">{col.tagline}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
