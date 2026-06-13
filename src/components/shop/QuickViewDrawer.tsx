"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { X, Heart, ShoppingBag, Star, ArrowRight, Check } from "lucide-react";
import { useCartStore, useWishlistStore } from "@/lib/store";
import type { Product } from "@/types";

export function QuickViewDrawer({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  const [selectedSize,  setSelectedSize]  = useState(product.sizes[0] || "");
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || "");
  const [activeImg,     setActiveImg]     = useState(0);
  const [added,         setAdded]         = useState(false);

  const { addItem }           = useCartStore();
  const { toggleItem, isWishlisted } = useWishlistStore();
  const wishlisted = isWishlisted(product.id);

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  const handleAdd = () => {
    if (!selectedSize) return;
    addItem(product, selectedSize, selectedColor);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="drawer-overlay"
        onClick={onClose}
      />

      {/* Drawer */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 340, damping: 40 }}
        className="drawer w-full max-w-[520px]"
      >
        {/* Close */}
        <button
          onClick={onClose}
          id="quick-view-close"
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-[#F5EBE0] flex items-center justify-center hover:bg-[#E8E8E8] transition-colors"
        >
          <X size={16} />
        </button>

        <div className="flex flex-col h-full">
          {/* Image Gallery */}
          <div className="relative bg-[#FAFAF8]" style={{ height: "55%" }}>
            {product.images?.[activeImg] && (
              <Image
                src={product.images[activeImg]}
                alt={product.name}
                fill
                className="object-cover"
                sizes="520px"
              />
            )}

            {/* Thumbnail strip */}
            {product.images?.length > 1 && (
              <div className="absolute bottom-3 left-3 flex gap-2">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`w-12 h-16 border-2 overflow-hidden transition-all ${activeImg === i ? "border-[#1A1A1A]" : "border-transparent "}`}
                  >
                    <Image src={img} alt={`View ${i + 1}`} width={48} height={64} className="object-cover w-full h-full" />
                  </button>
                ))}
              </div>
            )}

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1">
              {product.isNew && <span className="badge badge-new">New</span>}
              {discount > 0 && <span className="badge badge-sale">-{discount}%</span>}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex-1 overflow-y-auto p-6">
            <p className="text-[10px] font-poppins text-[#B0B0B0] uppercase tracking-widest mb-2">{product.category}</p>
            <h2 className="font-playfair text-2xl font-600 text-[#1A1A1A] mb-2">{product.name}</h2>

            {/* Stars */}
            <div className="flex items-center gap-1.5 mb-4">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={11} className={i < Math.floor(product.rating) ? "star-filled" : "star-empty"} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} />
                ))}
              </div>
              <span className="text-sm font-poppins text-espresso">{product.rating} ({product.reviewCount} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 mb-5">
              <span className="text-3xl font-playfair font-700 text-[#1A1A1A]">₹{product.price.toLocaleString()}</span>
              {product.originalPrice && (
                <span className="text-lg font-poppins text-[#B0B0B0] line-through">₹{product.originalPrice.toLocaleString()}</span>
              )}
              {discount > 0 && (
                <span className="text-base font-poppins font-600 text-[#C4607A]">{discount}% OFF</span>
              )}
            </div>

            {/* Colors */}
            {product.colors?.length > 0 && (
              <div className="mb-5">
                <p className="text-[10px] font-poppins font-700 text-[#B0B0B0] uppercase tracking-[0.2em] mb-2.5">
                  Colour: <span className="text-[#1A1A1A]">{selectedColor}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedColor(c)}
                      className={`px-3 py-1.5 text-sm font-poppins border transition-all
                        ${selectedColor === c
                          ? "border-[#1A1A1A] bg-[#1A1A1A] text-white"
                          : "border-[#E8E8E8] text-[#3D3D3D] hover:border-[#1A1A1A]"
                        }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes?.length > 0 && (
              <div className="mb-6">
                <p className="text-[10px] font-poppins font-700 text-[#B0B0B0] uppercase tracking-[0.2em] mb-2.5">
                  Size: <span className="text-[#1A1A1A]">{selectedSize}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`size-chip ${selectedSize === s ? "selected" : ""}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <p className="text-base font-poppins text-espresso leading-relaxed mb-6 line-clamp-3">
              {product.description}
            </p>

            {/* Stock */}
            {product.stock <= 5 && product.stock > 0 && (
              <p className="text-sm font-poppins text-[#C4607A] mb-4 font-600">
                ⚡ Only {product.stock} left in stock!
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="p-5 border-t border-[#E8E8E8] flex gap-3">
            <button
              onClick={handleAdd}
              id="quick-view-add-to-bag"
              disabled={!selectedSize}
              className="flex-1 btn btn-primary flex items-center justify-center gap-2 disabled:"
            >
              {added ? (
                <><Check size={14} /> Added!</>
              ) : (
                <><ShoppingBag size={14} /> Add to Bag</>
              )}
            </button>

            <button
              onClick={() => toggleItem(product)}
              id="quick-view-wishlist"
              className="btn-icon"
              aria-label="Wishlist"
            >
              <Heart size={16} fill={wishlisted ? "#C4607A" : "none"} color={wishlisted ? "#C4607A" : "#1A1A1A"} />
            </button>

            <Link href={`/product/${product.id}`} id="quick-view-full-details">
              <button className="btn-icon" title="View full details">
                <ArrowRight size={16} />
              </button>
            </Link>
          </div>
        </div>
      </motion.div>
    </>
  );
}
