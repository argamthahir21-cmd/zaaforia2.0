import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useContent } from "@/context/ContentContext";

export function StyleEdit() {
  const { getContent } = useContent();

  const sectionLabel = getContent("home.style.section_label", "The Edit");
  const sectionTitle = getContent("home.style.section_title", "Style Stories");

  const editorials = [
    {
      title: getContent("home.style.card1_title", "Textural Minimalism"),
      subtitle: getContent("home.style.card1_desc", "Poetics and artistic details that elevate everyday dressing."),
      image: getContent("home.style.card1_image", "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=600&q=80"),
      href: "/shop?category=Western+Wear",
    },
    {
      title: getContent("home.style.card2_title", "Off-Duty Luxe"),
      subtitle: getContent("home.style.card2_desc", "For days when comfort comes first, but looking good never takes a day off."),
      image: getContent("home.style.card2_image", "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&q=80"),
      href: "/shop?category=Dresses",
    },
    {
      title: getContent("home.style.card3_title", "Ethnic Elegance"),
      subtitle: getContent("home.style.card3_desc", "Heritage craftsmanship meets the modern silhouette — timeless and bold."),
      image: getContent("home.style.card3_image", "https://images.unsplash.com/photo-1583396082781-f0e97c25b3c8?w=600&q=80"),
      href: "/shop?category=Ethnic+Wear",
    },
  ];

  return (
    <section id="style-edit" className="section-padding bg-white">
      <div className="luxury-container">
        {/* Header */}
        <div className="text-center mb-16 md:mb-24">
          <p className="section-label">{sectionLabel}</p>
          <h2 className="text-title font-cormorant text-[#1A1A1A] font-light italic">
            {sectionTitle}
          </h2>
        </div>

        {/* 3-column editorial cards (FWRD-inspired) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {editorials.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link href={item.href} className="group block" id={`style-edit-${i}`}>
                {/* Tall portrait image */}
                <div className="relative overflow-hidden aspect-[3/4] mb-8 bg-[#F5F0EB]">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-[0.8s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                {/* Text below */}
                <h3 className="font-cormorant text-2xl md:text-3xl text-[#1A1A1A] mb-2 font-normal italic group-hover:text-espresso transition-colors">
                  {item.title}
                </h3>
                <p className="font-jost text-sm text-espresso leading-relaxed tracking-wide">
                  {item.subtitle}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
