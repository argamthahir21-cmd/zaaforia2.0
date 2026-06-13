"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { stats } from "@/lib/mockData";
import { Package, Users, Sparkles, Globe } from "lucide-react";

const icons = [Package, Users, Sparkles, Globe];

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    const step = Math.ceil(value / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= value) { start = value; clearInterval(timer); }
      setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [inView, value]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

export function StatsBanner() {
  return (
    <section className="py-20 bg-espresso relative overflow-hidden">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgba(198,167,105,0.3) 1px, transparent 0)", backgroundSize: "40px 40px" }} />
      <div className="max-w-[1400px] mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, i) => {
            const Icon = icons[i];
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="text-center">
                <div className="w-14 h-14 mx-auto mb-4 rounded-full border border-gold/30 flex items-center justify-center">
                  <Icon size={22} className="text-gold" />
                </div>
                <p className="font-playfair text-4xl md:text-5xl text-white font-bold mb-2">
                  <Counter value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="font-poppins text-sm text-white tracking-[0.2em] uppercase">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
