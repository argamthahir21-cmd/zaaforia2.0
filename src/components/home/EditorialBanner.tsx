import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useContent } from "@/context/ContentContext";

export function EditorialBanner() {
  const { getContent } = useContent();

  const leftLabel = getContent("home.editorial.left_label", "Festive Edit");
  const leftTitle = getContent("home.editorial.left_title", "Ethnic Royale");
  const leftDesc = getContent("home.editorial.left_desc", "Exquisite embroideries, rich fabrics and timeless silhouettes for your most special moments.");
  const leftImage = getContent("home.editorial.left_image", "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=900&q=80");
  const leftLink = getContent("home.editorial.left_link", "/shop?category=Ethnic+Wear");

  const rightLabel = getContent("home.editorial.right_label", "New Season");
  const rightTitle = getContent("home.editorial.right_title", "Western Edit");
  const rightDesc = getContent("home.editorial.right_desc", "Sharp tailoring meets effortless silhouettes — power dressing for the modern woman.");
  const rightImage = getContent("home.editorial.right_image", "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=900&q=80");
  const rightLink = getContent("home.editorial.right_link", "/shop?category=Western+Wear");

  return (
    <section id="editorial-banner" className="bg-white py-24 md:py-32">
      <div className="luxury-container">
        {/* Large dual editorial split (FWRD-inspired) */}
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-[500px] md:min-h-[600px] gap-10 md:gap-16">
          {/* Left — Large editorial image */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative overflow-hidden group"
          >
            <Image
              src={leftImage}
              alt={leftTitle}
              fill
              className="object-cover transition-transform duration-[1s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
              sizes="50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-10 md:p-16">
              <p className="font-jost text-[10px] text-white uppercase tracking-[0.2em] mb-4">{leftLabel}</p>
              <h2 className="font-cormorant text-4xl md:text-5xl lg:text-5xl text-white mb-6 font-light italic leading-tight">
                {leftTitle}
              </h2>
              <p className="font-jost text-base text-white mb-8 max-w-sm leading-[2]">
                {leftDesc}
              </p>
              <Link href={leftLink} id="editorial-ethnic">
                <span className="inline-block font-jost text-[11px] text-white uppercase tracking-[0.2em] border-b border-white/50 pb-0.5 hover:border-white transition-colors">
                  Shop Now
                </span>
              </Link>
            </div>
          </motion.div>

          {/* Right — Second editorial image */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="relative overflow-hidden group"
          >
            <Image
              src={rightImage}
              alt={rightTitle}
              fill
              className="object-cover object-top transition-transform duration-[1s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
              sizes="50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-10 md:p-16">
              <p className="font-jost text-[10px] text-white uppercase tracking-[0.2em] mb-4">{rightLabel}</p>
              <h2 className="font-cormorant text-4xl md:text-5xl lg:text-5xl text-white mb-6 font-light italic leading-tight">
                {rightTitle}
              </h2>
              <p className="font-jost text-base text-white mb-8 max-w-sm leading-[2]">
                {rightDesc}
              </p>
              <Link href={rightLink} id="editorial-western">
                <span className="inline-block font-jost text-[11px] text-white uppercase tracking-[0.2em] border-b border-white/50 pb-0.5 hover:border-white transition-colors">
                  Shop Now
                </span>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
