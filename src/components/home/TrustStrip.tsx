import { Package, RotateCcw, Shield, Truck } from "lucide-react";
import { motion } from "framer-motion";
import { useContent } from "@/context/ContentContext";

export function TrustStrip() {
  const { getContent } = useContent();

  const strips = [
    { icon: Truck,      label: getContent("home.trust.item1", "Free Shipping Above ₹2,999") },
    { icon: RotateCcw,  label: getContent("home.trust.item2", "Easy 30-Day Returns") },
    { icon: Shield,     label: getContent("home.trust.item3", "100% Authentic Products") },
    { icon: Package,    label: getContent("home.trust.item4", "Secure Checkout") },
  ];

  return (
    <section id="trust-strip" className="bg-[#FAFAF7] py-12 md:py-16 border-y border-[#E5E2DE]">
      <div className="luxury-container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 md:divide-x md:divide-[#D0CBC4]/40">
          {strips.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="flex items-center gap-3 px-4 md:px-6 justify-center md:justify-start"
            >
              <item.icon size={18} className="flex-shrink-0 text-[#1A1A1A]" strokeWidth={1.5} />
              <div>
                <p className="text-[11px] font-jost font-medium text-[#1A1A1A] tracking-wider uppercase leading-snug">{item.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
