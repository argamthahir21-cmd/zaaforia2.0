"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { instagramImages } from "@/lib/mockData";

const lookbookImages = [
  { src: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80", span: "col-span-2 row-span-2" },
  { src: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80", span: "" },
  { src: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80", span: "" },
  { src: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80", span: "" },
  { src: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=80", span: "col-span-2" },
  { src: "https://images.unsplash.com/photo-1583396082781-f0e97c25b3c8?w=600&q=80", span: "" },
  { src: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=600&q=80", span: "" },
  { src: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=600&q=80", span: "" },
];

export default function LookbookPage() {
  return (
    <div className="min-h-screen bg-ivory">
      <div className="max-w-[1400px] mx-auto px-6 py-16">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <p className="font-cormorant italic text-gold text-xl mb-3">Spring/Summer 2026</p>
          <h1 className="font-playfair text-5xl md:text-6xl text-espresso mb-4">The Lookbook</h1>
          <div className="luxury-divider" />
          <p className="font-poppins text-base text-espresso mt-4 max-w-lg mx-auto">An editorial journey through our latest collection. Every look tells a story of modern luxury and timeless elegance.</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[250px] md:auto-rows-[300px]">
          {lookbookImages.map((img, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.5 }}
              className={`relative rounded-lg overflow-hidden cursor-pointer group ${img.span}`}>
              <Image src={img.src} alt={`Lookbook ${i + 1}`} fill className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110" sizes="(max-width: 768px) 50vw, 25vw" />
              <div className="absolute inset-0 bg-espresso/0 group-hover:bg-espresso/20 transition-colors duration-500" />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
