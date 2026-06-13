"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Aarohi Sharma",
    location: "Mumbai",
    rating: 5,
    comment: "Absolutely stunning quality! The silk dress felt incredibly luxurious. Zaaforia has become my go-to for special occasions.",
    product: "Ivory Silk Drape Dress",
    initial: "A",
  },
  {
    name: "Priya Mehta",
    location: "Delhi",
    rating: 5,
    comment: "The attention to detail is remarkable. Every piece I've ordered has exceeded my expectations. True luxury fashion.",
    product: "Espresso Tailored Blazer",
    initial: "P",
  },
  {
    name: "Ananya Reddy",
    location: "Bangalore",
    rating: 5,
    comment: "From packaging to the outfit itself, everything screams premium. The gold embroidered lehenga was a showstopper at my wedding!",
    product: "Gold Embroidered Lehenga",
    initial: "A",
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="section-padding bg-[#FAFAF7]">
      <div className="luxury-container">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="section-label mb-3">Loved By Many</p>
          <h2 className="text-title font-playfair text-[#1A1A1A]">What Our Customers Say</h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white border border-[#E5E2DE] p-6 relative shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <Quote size={24} className="absolute top-5 right-5 text-[#B8945F]" />

              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} size={12} className="star-filled" fill="currentColor" />
                ))}
              </div>

              <p className="text-base font-poppins text-[#3D3D3D] leading-relaxed mb-5 italic">
                &ldquo;{t.comment}&rdquo;
              </p>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#B8945F] flex items-center justify-center font-playfair font-700 text-base text-white">
                  {t.initial}
                </div>
                <div>
                  <p className="text-base font-poppins font-600 text-[#1A1A1A]">{t.name}</p>
                  <p className="text-[10px] font-poppins text-espresso">{t.location} · {t.product}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
