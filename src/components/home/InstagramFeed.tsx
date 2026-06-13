"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Instagram } from "lucide-react";
import { useContent } from "@/context/ContentContext";

export function InstagramFeed() {
  const { getContent } = useContent();
  
  const feed = [
    getContent("instagram.feed.1", "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&q=80"),
    getContent("instagram.feed.2", "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80"),
    getContent("instagram.feed.3", "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&q=80"),
    getContent("instagram.feed.4", "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=400&q=80"),
    getContent("instagram.feed.5", "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=400&q=80"),
    getContent("instagram.feed.6", "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400&q=80"),
  ];

  return (
    <section id="instagram-feed" className="section-padding bg-white">
      <div className="luxury-container">
        <div className="text-center mb-8">
          <p className="section-label mb-1">Stay Connected</p>
          <h2 className="font-cormorant text-3xl md:text-4xl text-[#1A1A1A] font-light italic mb-2">
            @zaaforia_official
          </h2>
          <p className="text-sm font-jost text-espresso tracking-wide">Follow us for daily style inspiration</p>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-4 md:gap-6">
          {feed.map((src, i) => (
            <motion.a
              key={i}
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              id={`instagram-${i}`}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="group relative aspect-square overflow-hidden bg-[#F5F0EB]"
            >
              <Image
                src={src}
                alt={`Instagram post ${i + 1}`}
                fill
                className="object-cover transition-transform duration-[0.6s] group-hover:scale-[1.05]"
                sizes="(max-width: 640px) 33vw, 17vw"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-400 flex items-center justify-center">
                <Instagram size={20} className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </motion.a>
          ))}
        </div>

        <div className="text-center mt-8">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-text-link text-[11px] tracking-widest uppercase inline-flex items-center gap-2"
          >
            <Instagram size={12} />
            Follow on Instagram
          </a>
        </div>
      </div>
    </section>
  );
}
