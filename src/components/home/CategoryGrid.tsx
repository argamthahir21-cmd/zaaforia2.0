"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useCategories } from "@/lib/hooks";
import type { Category } from "@/types";

const fallbackCategories = [
  { id:"1", name:"Dresses",      slug:"dresses",      image:"https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=480&q=80", productCount:156 },
  { id:"2", name:"Ethnic Wear",  slug:"ethnic-wear",  image:"https://images.unsplash.com/photo-1583396082781-f0e97c25b3c8?w=480&q=80", productCount:89 },
  { id:"3", name:"Western Wear", slug:"western-wear", image:"https://images.unsplash.com/photo-1551803091-e20673f15770?w=480&q=80", productCount:234 },
  { id:"4", name:"Tops",         slug:"tops",         image:"https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=480&q=80", productCount:312 },
  { id:"5", name:"Accessories",  slug:"accessories",  image:"https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=480&q=80", productCount:178 },
  { id:"6", name:"Footwear",     slug:"footwear",     image:"https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=480&q=80", productCount:92 },
];

export function CategoryGrid() {
  const { data: apiCats } = useCategories();
  const cats: Category[] = (apiCats && apiCats.length > 0) ? apiCats.slice(0, 6) : fallbackCategories;

  return (
    <section id="category-grid" className="section-padding bg-white">
      <div className="luxury-container">
        {/* Heading */}
        <div className="text-center mb-24 md:mb-32">
          <p className="section-label mb-4 tracking-[0.3em]">Explore</p>
          <h2 className="text-title font-cormorant text-[#1A1A1A] font-light tracking-wide">Shop By Category</h2>
        </div>

        {/* Grid — Clean sharp edges */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-10 md:gap-16">
          {cats.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                href={`/shop?category=${encodeURIComponent(cat.name)}`}
                id={`category-${cat.slug}`}
                className="group block"
              >
                {/* Image — sharp edges, no rounded corners */}
                <div className="relative overflow-hidden aspect-[3/4] mb-6 bg-[#F5F0EB]">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover transition-transform duration-[0.7s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 17vw"
                  />
                  {/* Subtle overlay on hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
                </div>
                {/* Label — ALL CAPS, spaced */}
                <p className="text-center text-sm font-jost font-medium text-[#1A1A1A] tracking-[0.2em] uppercase group-hover:text-gold transition-colors duration-300">
                  {cat.name}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View all */}
        <div className="text-center mt-24 md:mt-32">
          <Link href="/shop" id="category-view-all">
            <button className="btn btn-secondary px-12 py-5 tracking-[0.2em]">
              View All Categories
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
