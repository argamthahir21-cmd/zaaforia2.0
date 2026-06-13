"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function SignatureSection() {
  return (
    <section className="section-padding bg-transparent overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="relative aspect-[4/5] rounded-lg overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80"
                alt="Zaaforia Signature"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            {/* Floating card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="absolute -bottom-6 -right-6 md:right-[-30px] bg-white p-6 shadow-luxury-lg rounded-lg max-w-[200px]"
            >
              <p className="font-cormorant italic text-gold text-base">Since 2024</p>
              <p className="font-playfair text-3xl text-espresso font-bold">Zaaforia</p>
              <p className="text-sm font-poppins text-espresso mt-1">Defining Luxury</p>
            </motion.div>
          </motion.div>

          {/* Text Side */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="font-cormorant italic text-espresso text-xl mb-4">Our Story</p>
            <h2 className="font-playfair text-5xl md:text-5xl text-gold mb-6 leading-tight">
              Zaaforia <br />
              Signature
            </h2>
            <div className="luxury-divider !mx-0 !ml-0" />
            <p className="font-poppins text-espresso text-base leading-relaxed mt-6 mb-4">
              Born from a passion for exquisite craftsmanship, Zaaforia represents the 
              perfect fusion of traditional artistry and contemporary design. Each piece 
              in our collection is a testament to our commitment to quality, elegance, 
              and the art of dressing beautifully.
            </p>
            <p className="font-poppins text-espresso text-base leading-relaxed mb-8">
              We believe every woman deserves to feel extraordinary. Our curated 
              collections blend premium fabrics, intricate details, and modern 
              silhouettes to create fashion that transcends trends.
            </p>
            <motion.a
              href="/about"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="btn-luxury btn-luxury-primary inline-flex items-center gap-3"
            >
              Discover Our Story
              <ArrowRight size={16} />
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
