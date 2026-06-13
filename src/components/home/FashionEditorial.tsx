"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const editorials = [
  {
    title: "Elegance in Motion",
    subtitle: "Spring/Summer '26 Editorial",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80",
    span: "lg:col-span-2 lg:row-span-2",
    aspect: "aspect-[4/5] lg:aspect-auto lg:h-full",
  },
  {
    title: "The Art of Draping",
    subtitle: "Ethnic Luxury Redefined",
    image: "https://images.unsplash.com/photo-1583396082781-f0e97c25b3c8?w=600&q=80",
    span: "",
    aspect: "aspect-square",
  },
  {
    title: "Urban Sophistication",
    subtitle: "City Collection",
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&q=80",
    span: "",
    aspect: "aspect-square",
  },
];

export function FashionEditorial() {
  return (
    <section className="section-padding bg-white">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="text-center mb-16">
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="font-cormorant italic text-gold text-xl mb-3">Fashion Journal</motion.p>
          <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="font-playfair text-5xl md:text-5xl text-espresso mb-4">The Editorial</motion.h2>
          <div className="luxury-divider" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 lg:grid-rows-2 gap-5 lg:h-[700px]">
          {editorials.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.8 }}
              className={`relative rounded-lg overflow-hidden group cursor-pointer ${item.span} ${item.aspect}`}
            >
              <Image src={item.image} alt={item.title} fill className="object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110" sizes="(max-width: 1024px) 100vw, 50vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-espresso/60 via-espresso/10 to-transparent transition-all duration-500 group-hover:from-espresso/70" />
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <p className="font-cormorant italic text-gold-light text-base mb-2">{item.subtitle}</p>
                <h3 className="font-playfair text-3xl md:text-4xl text-white mb-3">{item.title}</h3>
                <span className="inline-flex items-center gap-2 text-sm font-poppins text-white tracking-[0.2em] uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  Read More <ArrowUpRight size={14} />
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
