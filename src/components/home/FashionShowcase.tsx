"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import { Sparkles, ShoppingBag, ArrowUpRight } from "lucide-react";
import { useState } from "react";

interface FashionItem {
  id: number;
  title: string;
  category: string;
  price: string;
  color: string;
}

const items: FashionItem[] = [
  { id: 1, title: "Liquid Gold Gown", category: "Evening Wear", price: "$2,400", color: "#D4AF37" },
  { id: 2, title: "Rose Silk Saree", category: "Ethnic Couture", price: "$1,850", color: "#E39FB0" },
  { id: 3, title: "Espresso Velvet Suit", category: "Western Luxe", price: "$3,200", color: "#2B1B24" },
];

function ShowcaseCard({ item }: { item: FashionItem }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative group cursor-pointer"
    >
      <div className="w-full aspect-[3/4] bg-white rounded-[48px] p-2 border border-white/40 shadow-luxury overflow-hidden relative">
        {/* Artistic Background */}
        <div 
          className="absolute inset-0 opacity-10 transition-opacity group-hover:opacity-20"
          style={{ background: `radial-gradient(circle at center, ${item.color}, transparent)` }}
        />
        
        {/* Placeholder for Product Image */}
        <div className="w-full h-full bg-champagne/30 rounded-[40px] flex items-center justify-center relative overflow-hidden">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Sparkles className="w-32 h-32 text-gold" />
          </motion.div>
          
          {/* Status Badge */}
          <div className="absolute top-6 right-6 glass px-4 py-1.5 rounded-full border border-white/40">
            <span className="text-[10px] font-poppins font-bold text-espresso uppercase tracking-widest">New Entry</span>
          </div>
        </div>

        {/* Info Overlay */}
        <div className="absolute bottom-8 left-8 right-8">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[10px] font-poppins text-espresso uppercase tracking-widest mb-1">{item.category}</p>
              <h3 className="font-playfair text-4xl font-bold text-espresso">{item.title}</h3>
            </div>
            <motion.div 
              whileHover={{ rotate: 45, scale: 1.1 }}
              className="w-12 h-12 bg-espresso text-white rounded-2xl flex items-center justify-center shadow-lg"
            >
              <ArrowUpRight className="w-6 h-6" />
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Price Tag (Floating) */}
      <motion.div 
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-4 -right-4 glass px-6 py-3 rounded-2xl border border-white/60 shadow-xl z-20"
      >
        <span className="font-playfair font-bold text-xl text-espresso">{item.price}</span>
      </motion.div>
    </motion.div>
  );
}

export function FashionShowcase() {
  return (
    <div className="luxury-container section-padding">
      <div className="text-center mb-20">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 0.4, y: 0 }}
          className="text-sm font-poppins tracking-[0.4em] uppercase text-espresso mb-4"
        >
          Curated Exclusivity
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="font-playfair text-5xl md:text-7xl font-bold text-espresso"
        >
          Digital <span className="text-rose italic">Couture</span>
        </motion.h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {items.map((item, i) => (
          <ShowcaseCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
