"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, ShoppingBag } from "lucide-react";
import { useNewArrivals } from "@/lib/hooks";
import { useWishlistStore, useCartStore } from "@/lib/store";
import type { Product } from "@/types";

function ProductCardSlim({ product, index }: { product: Product; index: number }) {
  const { toggleItem, isWishlisted } = useWishlistStore();
  const { addItem } = useCartStore();
  const wishlisted = isWishlisted(product.id);

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="group flex-shrink-0 w-[180px] md:w-[220px]"
    >
      <Link href={`/product/${product.id}`} id={`new-arrival-${product.id}`}>
        {/* Image — clean, no borders, no rounded corners */}
        <div className="relative aspect-[3/4] mb-6 bg-[#F7F4F0] overflow-hidden">
          {product.images?.[0] && (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-[0.7s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
              sizes="220px"
            />
          )}
          {product.images?.[1] && (
            <Image
              src={product.images[1]}
              alt={product.name}
              fill
              className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              sizes="220px"
            />
          )}
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.isNew && <span className="badge badge-new">New</span>}
          </div>
          {/* Wishlist */}
          <button
            onClick={(e) => { e.preventDefault(); toggleItem(product); }}
            className="product-card__action-btn absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            aria-label="Wishlist"
          >
            <Heart size={13} fill={wishlisted ? "#C4607A" : "none"} color={wishlisted ? "#C4607A" : "#1A1A1A"} />
          </button>
          {/* ATB */}
          <button
            onClick={(e) => {
              e.preventDefault();
              addItem(product, product.sizes[0] || "Free Size", product.colors[0] || "Default");
            }}
            className="product-card__atb"
          >
            <ShoppingBag size={10} className="inline mr-1.5 -mt-0.5" />
            Add to Bag
          </button>
        </div>

        {/* Info — Clean, FWRD-style */}
        <div className="px-0.5">
          <p className="text-[10px] font-jost text-espresso uppercase tracking-[0.2em] mb-0.5">{product.category}</p>
          <h3 className="text-[13px] font-jost font-normal text-[#1A1A1A] mb-1 group-hover:text-espresso transition-colors line-clamp-1">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-jost font-medium text-[#1A1A1A]">₹{product.price.toLocaleString()}</span>
            {product.originalPrice && (
              <span className="text-[11px] font-jost text-[#C8BFB6] line-through">₹{product.originalPrice.toLocaleString()}</span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function NewArrivalsStrip() {
  const { data, isLoading } = useNewArrivals();
  const products: Product[] = (data as any) || [];
  const scrollRef = useRef<HTMLDivElement>(null);

  if (isLoading) return (
    <section className="section-padding bg-[#FAFAF7]">
      <div className="luxury-container">
        <div className="flex gap-8 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 w-[200px]">
              <div className="skeleton aspect-[3/4] mb-6" />
              <div className="skeleton h-3 w-3/4 mb-2" />
              <div className="skeleton h-3 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  return (
    <section id="new-arrivals-strip" className="section-padding bg-[#FAFAF7]">
      <div className="luxury-container">
        {/* Header — FWRD "Just Arrived" style */}
        <div className="flex items-end justify-between mb-16 md:mb-24">
          <div>
            <p className="font-jost text-sm text-espresso tracking-[0.2em] uppercase mb-1">Just arrived</p>
            <h2 className="font-cormorant text-3xl md:text-4xl text-[#1A1A1A] font-light">
              New Items
            </h2>
            <p className="font-jost text-sm text-[#C8BFB6] mt-1 tracking-wide">
              Shop the latest, dropping daily
            </p>
          </div>
          <Link
            href="/new-arrivals"
            id="new-arrivals-see-all"
            className="btn-text-link text-[11px] tracking-widest uppercase"
          >
            Shop New Arrivals
          </Link>
        </div>

        {/* Horizontal scroll */}
        <div ref={scrollRef} className="flex gap-8 overflow-x-auto pb-6 scrollbar-hide" style={{ scrollSnapType: "x mandatory" }}>
          {products.length > 0
            ? products.map((p, i) => <ProductCardSlim key={p.id} product={p} index={i} />)
            : <p className="text-base font-jost text-[#C8BFB6] py-10">Products loading from store...</p>
          }
        </div>
      </div>
    </section>
  );
}
