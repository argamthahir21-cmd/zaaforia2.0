import Link from "next/link";
import { motion } from "framer-motion";
import { useContent } from "@/context/ContentContext";

const promoButtons = [
  { label: "Shop Dresses", href: "/shop?category=Dresses" },
  { label: "Shop Ethnic", href: "/shop?category=Ethnic+Wear" },
  { label: "Shop Western", href: "/shop?category=Western+Wear" },
  { label: "Shop Tops", href: "/shop?category=Tops" },
  { label: "Shop Accessories", href: "/shop?category=Accessories" },
];

export function PromoBanner() {
  const { getContent } = useContent();

  const discount = getContent("home.promo.discount", "20% Off");
  const offer = getContent("home.promo.offer", "Your First Order");
  const badge = getContent("home.promo.badge", "Limited Time Only");
  const code = getContent("home.promo.code", "ZAAFORIA20");
  const shipping = getContent("home.promo.shipping", "Free shipping above ₹2,999");

  return (
    <section id="promo-banner" className="bg-[#FAFAF7] py-20 md:py-32">
      <div className="luxury-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center"
        >
          {/* Bold typographic promo — UO-inspired */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-6 mb-6">
            <h2 className="font-cormorant text-[2.5rem] md:text-[3.5rem] lg:text-[4rem] text-[#1A1A1A] font-light leading-none tracking-tight">
              {discount}
            </h2>
            <div className="flex items-center gap-3">
              <span className="font-jost text-base md:text-lg font-medium text-[#1A1A1A] uppercase tracking-[0.2em] bg-[#1A1A1A] text-white px-4 py-1.5">
                {offer}
              </span>
              <span className="font-jost text-sm text-espresso uppercase tracking-[0.2em] hidden md:inline">
                {badge}
              </span>
            </div>
          </div>

          <p className="font-jost text-sm text-espresso tracking-[0.2em] uppercase mb-12">
            Use code <span className="font-semibold text-[#1A1A1A]">{code}</span> at checkout · {shipping}
          </p>

          {/* Pill CTAs */}
          <div className="flex items-center justify-center gap-4 md:gap-6 flex-wrap">
            {promoButtons.map((btn, i) => (
              <motion.div
                key={btn.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
              >
                <Link href={btn.href}>
                  <button className="px-5 py-2.5 border border-[#1A1A1A] bg-transparent text-[#1A1A1A] font-jost text-[10px] md:text-[11px] font-medium tracking-[0.2em] uppercase hover:bg-[#1A1A1A] hover:text-white transition-all duration-300">
                    {btn.label}
                  </button>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
