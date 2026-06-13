"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles, Heart, Award, Globe } from "lucide-react";

const values = [
  { icon: Sparkles, title: "Exquisite Quality", desc: "Every piece is crafted with premium materials and meticulous attention to detail." },
  { icon: Heart, title: "Empowering Women", desc: "We design for the modern woman who expresses confidence through fashion." },
  { icon: Award, title: "Artisan Craftsmanship", desc: "Traditional techniques meet contemporary design in every Zaaforia creation." },
  { icon: Globe, title: "Sustainable Luxury", desc: "Committed to ethical fashion that respects both people and the planet." },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-ivory">
      {/* Hero */}
      <section className="relative h-[400px] md:h-[500px] overflow-hidden bg-ivory">
        <Image src="https://images.unsplash.com/photo-1558171813-4c088753af8f?w=1920&q=80" alt="About Zaaforia" fill className="object-cover opacity-85" sizes="100vw" />
        <div className="absolute inset-0 bg-white/10" />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <p className="font-cormorant italic text-gold text-xl mb-3 font-medium">Our Story</p>
            <h1 className="font-playfair text-5xl md:text-7xl text-espresso font-bold">About Zaaforia</h1>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="section-padding">
        <div className="max-w-[900px] mx-auto px-6 text-center">
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="font-cormorant italic text-gold text-2xl mb-6">Est. 2024</motion.p>
          <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="font-playfair text-4xl md:text-5xl text-espresso mb-8">Redefining Luxury Fashion for the Modern Woman</motion.h2>
          <div className="luxury-divider" />
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="font-poppins text-espresso text-base leading-relaxed mt-8">
            Zaaforia was born from a belief that luxury should be accessible, personal, and empowering. We curate and create fashion that bridges the gap between traditional artistry and modern sophistication — pieces that make every woman feel extraordinary. From premium ethnic wear that celebrates heritage to contemporary western designs that push boundaries, every Zaaforia piece tells a story of elegance, quality, and timeless beauty.
          </motion.p>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-champagne/20">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl md:text-5xl text-espresso mb-4">Our Values</h2>
            <div className="luxury-divider" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((val, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center p-6 bg-white rounded-xl shadow-card">
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-champagne/30 flex items-center justify-center"><val.icon size={24} className="text-gold" /></div>
                <h3 className="font-playfair text-xl text-espresso mb-2">{val.title}</h3>
                <p className="font-poppins text-sm text-espresso leading-relaxed">{val.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Split Section */}
      <section className="section-padding">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative aspect-[4/5] rounded-xl overflow-hidden">
              <Image src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80" alt="Our Vision" fill className="object-cover" sizes="50vw" />
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <p className="font-cormorant italic text-gold text-xl mb-3">Our Vision</p>
              <h2 className="font-playfair text-4xl md:text-5xl text-espresso mb-6">Fashion That Empowers</h2>
              <p className="font-poppins text-base text-espresso leading-relaxed mb-4">We envision a world where every woman can access exceptional fashion that makes her feel confident, beautiful, and true to herself.</p>
              <p className="font-poppins text-base text-espresso leading-relaxed">Our commitment extends beyond fashion — we work with artisan communities, support sustainable practices, and ensure that every piece we create carries a positive impact.</p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
