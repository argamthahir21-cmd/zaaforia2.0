"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import { useWishlistStore, useCartStore } from "@/lib/store";
import type { Product } from "@/types";

export function ProductCard({ product, index }: { product: Product; index: number }) {
  const { toggleItem, isWishlisted } = useWishlistStore();
  const { addItem } = useCartStore();
  const cardRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const wishlisted = isWishlisted(product.id);
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate percentage offset from center (-5% to +5% translation)
    const xPercent = ((x / rect.width) - 0.5) * 10;
    const yPercent = ((y / rect.height) - 0.5) * 10;
    
    setCoords({ x: xPercent, y: yPercent });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setCoords({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="group relative bg-[#FFFFFF] overflow-hidden transition-all duration-500 border border-[#8D7866]/15 rounded-[32px] hover:shadow-luxury hover:border-transparent select-none flex flex-col h-full"
    >
      <Link href={`/product/${product.id}`} className="flex flex-col h-full">
        {/* Image wrapper */}
        <div className="relative aspect-[3/4] overflow-hidden bg-[#E0E2E2] rounded-t-[30px]">
          {product.images?.[0] && (
            <motion.div
              animate={{
                x: isHovered ? coords.x : 0,
                y: isHovered ? coords.y : 0,
                scale: isHovered ? 1.08 : 1,
              }}
              transition={{ type: "tween", ease: "easeOut", duration: 0.3 }}
              className="absolute inset-0 w-full h-full"
            >
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            </motion.div>
          )}

          {/* Secondary image crossfade */}
          {product.images?.[1] && (
            <motion.div
              animate={{
                opacity: isHovered ? 1 : 0,
                x: isHovered ? coords.x : 0,
                y: isHovered ? coords.y : 0,
                scale: isHovered ? 1.08 : 1,
              }}
              transition={{ type: "tween", ease: "easeOut", duration: 0.3 }}
              className="absolute inset-0 w-full h-full pointer-events-none"
            >
              <Image
                src={product.images[1]}
                alt={product.name}
                fill
                className="object-cover"
                sizes="25vw"
              />
            </motion.div>
          )}

          {/* Badges */}
          <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
            {product.isNew && (
              <span className="text-[8px] font-josefin tracking-[0.2em] font-semibold bg-[#0D0A09] text-white uppercase px-2.5 py-1 rounded">
                New
              </span>
            )}
            {discount > 0 && (
              <span className="text-[8px] font-josefin tracking-[0.2em] font-semibold bg-[#61463D] text-white uppercase px-2.5 py-1 rounded">
                -{discount}%
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={(e) => {
                e.preventDefault();
                toggleItem(product);
              }}
              className="w-9 h-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-lg border border-[#8D7866]/10 hover:bg-[#0D0A09] hover:text-white transition-colors"
            >
              <Heart size={13} fill={wishlisted ? "#71594A" : "none"} color={wishlisted ? "#71594A" : "#0D0A09"} />
            </button>
          </div>

          {/* Quick Add slide up */}
          <button
            onClick={(e) => {
              e.preventDefault();
              addItem(product, product.sizes?.[0] || "Free Size", product.colors?.[0] || "Default");
            }}
            className="absolute bottom-0 left-0 right-0 py-3.5 bg-[#0D0A09] text-white text-[9px] font-josefin tracking-[0.25em] uppercase text-center transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-center gap-1.5 hover:bg-[#B9AC99] hover:text-[#0D0A09]"
          >
            <ShoppingBag size={11} />
            Quick Add
          </button>
        </div>

        {/* Text Details */}
        <div className="p-5 flex flex-col flex-1 justify-between bg-white text-left">
          <div>
            <span className="text-[9px] uppercase tracking-[0.2em] text-[#8D7866] font-josefin block mb-1">
              {product.category}
            </span>
            <h3 className="font-jost text-base font-light text-[#0D0A09] line-clamp-1 group-hover:text-[#B9AC99] transition-colors duration-300">
              {product.name}
            </h3>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-[#8D7866]/10 pt-3">
            <span className="text-sm font-semibold text-[#0D0A09] font-variant-numeric: tabular-nums">
              ₹{product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-[10px] text-[#8D7866] line-through font-variant-numeric: tabular-nums">
                ₹{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
