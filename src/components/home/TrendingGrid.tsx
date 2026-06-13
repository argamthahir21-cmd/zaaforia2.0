"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, ShoppingBag } from "lucide-react";
import { useTrendingProducts } from "@/lib/hooks";
import { useWishlistStore, useCartStore } from "@/lib/store";
import type { Product } from "@/types";

function ProductCard({ product, index }: { product: Product; index: number }) {
  const { toggleItem, isWishlisted } = useWishlistStore();
  const { addItem } = useCartStore();
  const wishlisted = isWishlisted(product.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="group"
    >
      <Link href={`/product/${product.id}`} id={`trending-product-${product.id}`}>
        {/* Image — FWRD-style clean white bg, no borders */}
        <div className="relative overflow-hidden aspect-[3/4] bg-[#F7F4F0] mb-6">
          {product.images?.[0] && (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-[0.7s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          )}
          {product.images?.[1] && (
            <Image
              src={product.images[1]}
              alt={product.name}
              fill
              className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              sizes="25vw"
            />
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
            {product.isTrending && <span className="badge badge-trending">Trending</span>}
          </div>

          {/* Wishlist btn */}
          <div className="product-card__actions">
            <button
              onClick={(e) => { e.preventDefault(); toggleItem(product); }}
              className="product-card__action-btn"
              aria-label="Toggle wishlist"
            >
              <Heart size={13} fill={wishlisted ? "#C4607A" : "none"} color={wishlisted ? "#C4607A" : "#1A1A1A"} />
            </button>
          </div>

          {/* Add to bag */}
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

        {/* Info — FWRD-style: brand in CAPS, product name, price */}
        <div className="text-center">
          <p className="text-[10px] font-jost text-espresso uppercase tracking-[0.2em] mb-0.5">{product.category}</p>
          <h3 className="text-[13px] font-jost font-normal text-[#1A1A1A] mb-1 group-hover:text-espresso transition-colors line-clamp-1">
            {product.name}
          </h3>
          <div className="flex items-center justify-center gap-2">
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

export function TrendingGrid() {
  const { data, isLoading } = useTrendingProducts();
  const products: Product[] = (data as any) || [];

  return (
    <section id="trending-grid" className="section-padding bg-white">
      <div className="luxury-container">
        {/* Header */}
        <div className="flex items-end justify-between mb-16 md:mb-24">
          <div>
            <p className="section-label">Trending</p>
            <h2 className="font-cormorant text-3xl md:text-4xl text-[#1A1A1A] font-light">
              Most Wanted
            </h2>
          </div>
          <Link
            href="/trending"
            id="trending-see-all"
            className="btn-text-link text-[11px] tracking-widest uppercase"
          >
            See All
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-10">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i}>
                <div className="skeleton aspect-[3/4] mb-5" />
                <div className="skeleton h-3 w-3/4 mb-2 mx-auto" />
                <div className="skeleton h-3 w-1/2 mx-auto" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-10">
            {products.length > 0
              ? products.slice(0, 8).map((p, i) => <ProductCard key={p.id} product={p} index={i} />)
              : <p className="col-span-full text-center text-base font-jost text-[#C8BFB6] py-10">Start the backend to see trending products</p>
            }
          </div>
        )}
      </div>
    </section>
  );
}
