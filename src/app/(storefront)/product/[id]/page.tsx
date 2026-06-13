"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart, ShoppingBag, Star, ChevronDown, ChevronUp,
  Truck, RotateCcw, Shield, Check, ArrowLeft, ArrowRight,
} from "lucide-react";
import { useProduct } from "@/lib/hooks";
import { useCartStore, useWishlistStore, useAuthStore } from "@/lib/store";
import { TrendingGrid } from "@/components/home/TrendingGrid";

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: product, isLoading } = useProduct(id);

  const { addItem }                  = useCartStore();
  const { toggleItem, isWishlisted } = useWishlistStore();

  const [selectedSize,  setSelectedSize]  = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [qty,           setQty]           = useState(1);
  const [activeImg,     setActiveImg]     = useState(0);
  const [added,         setAdded]         = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>("details");
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (product && isAuthenticated) {
      fetch("/api/user/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id })
      }).catch(console.error);
    }
  }, [product, isAuthenticated]);

  if (isLoading) return <ProductSkeleton />;
  if (!product)  return <NotFound />;

  const wishlisted = isWishlisted(product.id);
  const discount   = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  const handleAdd = () => {
    const size  = selectedSize  || product.sizes?.[0]  || "Free Size";
    const color = selectedColor || product.colors?.[0] || "Default";
    addItem(product, size, color, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  const handleBuyNow = () => {
    const size  = selectedSize  || product.sizes?.[0]  || "Free Size";
    const color = selectedColor || product.colors?.[0] || "Default";
    addItem(product, size, color, qty);
    router.push('/checkout');
  };

  const accordions = [
    {
      id: "details",
      label: "Product Details",
      content: product.description,
    },
    {
      id: "fabric",
      label: "Fabric & Care",
      content: "Premium quality fabric. Gentle hand wash recommended. Do not tumble dry. Iron on medium heat. Store in cool dry place.",
    },
    {
      id: "shipping",
      label: "Shipping & Returns",
      content: "Free shipping on orders above ₹2,999. Standard delivery in 5-7 business days. Easy 30-day returns. Return pickup available.",
    },
  ];

  return (
    <>
      <div className="luxury-container py-6 md:py-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm font-poppins text-[#B0B0B0] mb-6">
          <Link href="/" className="hover:text-[#C4973A] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-[#C4973A] transition-colors">Shop</Link>
          <span>/</span>
          <Link href={`/shop?category=${product.category}`} className="hover:text-[#C4973A] transition-colors">{product.category}</Link>
          <span>/</span>
          <span className="text-[#1A1A1A] line-clamp-1">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* ─── Left: Image Gallery ─── */}
          <div className="flex gap-3">
            {/* Thumbnails */}
            {product.images?.length > 1 && (
              <div className="hidden md:flex flex-col gap-2 w-16 flex-shrink-0">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`aspect-[3/4] overflow-hidden border-2 transition-all ${activeImg === i ? "border-[#1A1A1A]" : "border-transparent  hover:opacity-100"}`}
                  >
                    <Image src={img} alt={`View ${i + 1}`} width={64} height={85} className="object-cover w-full h-full" />
                  </button>
                ))}
              </div>
            )}

            {/* Main image */}
            <div className="flex-1">
              <div className="relative aspect-[3/4] max-h-[70vh] lg:max-h-[80vh] lg:mx-auto bg-[#FAFAF8] overflow-hidden group">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeImg}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35 }}
                    className="absolute inset-0"
                  >
                    {product.images?.[activeImg] && (
                      <Image
                        src={product.images[activeImg]}
                        alt={product.name}
                        fill
                        priority
                        className="object-contain lg:object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Nav arrows */}
                {product.images?.length > 1 && (
                  <>
                    <button onClick={() => setActiveImg((i) => Math.max(0, i - 1))} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowLeft size={14} />
                    </button>
                    <button onClick={() => setActiveImg((i) => Math.min(product.images.length - 1, i + 1))} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight size={14} />
                    </button>
                  </>
                )}

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                  {product.isNew && <span className="badge badge-new">New</span>}
                  {discount > 0 && <span className="badge badge-sale">-{discount}%</span>}
                </div>
              </div>

              {/* Mobile thumbnails */}
              {product.images?.length > 1 && (
                <div className="flex gap-2 mt-3 md:hidden overflow-x-auto pb-1">
                  {product.images.map((img, i) => (
                    <button key={i} onClick={() => setActiveImg(i)}
                      className={`flex-shrink-0 w-14 aspect-[3/4] overflow-hidden border-2 transition-all ${activeImg === i ? "border-[#1A1A1A]" : "border-transparent "}`}
                    >
                      <Image src={img} alt="" width={56} height={74} className="object-cover w-full h-full" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ─── Right: Product Info ─── */}
          <div className="lg:pt-2 flex flex-col justify-center">
            <p className="text-[11px] font-poppins text-[#999999] uppercase tracking-[0.3em] mb-4">{product.category}</p>
            <h1 className="font-playfair text-4xl md:text-5xl text-[#1A1A1A] mb-5 leading-tight">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-8">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} className={i < Math.floor(product.rating) ? "star-filled" : "star-empty"} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} />
                ))}
              </div>
              <span className="text-sm font-poppins text-[#666666] tracking-wide">{product.rating} ({product.reviewCount} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4 mb-8 pb-8 border-b border-[#E8E8E8]">
              <span className="text-4xl md:text-5xl font-playfair font-700 text-[#1A1A1A]">₹{product.price.toLocaleString()}</span>
              {product.originalPrice && (
                <span className="text-2xl font-poppins text-[#B0B0B0] line-through">₹{product.originalPrice.toLocaleString()}</span>
              )}
              {discount > 0 && (
                <span className="px-3 py-1 bg-[#C4607A] text-white text-sm font-poppins font-700 uppercase tracking-widest">{discount}% OFF</span>
              )}
            </div>

            {/* Color */}
            {product.colors?.length > 0 && (
              <div className="mb-8">
                <p className="text-[11px] font-poppins font-600 text-[#999999] uppercase tracking-[0.2em] mb-4">
                  Colour: <span className="text-[#1A1A1A] font-600 ml-1">{selectedColor || product.colors[0]}</span>
                </p>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedColor(c)}
                      className={`px-5 py-2.5 text-sm font-poppins border-2 transition-all
                        ${(selectedColor || product.colors[0]) === c
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

            {/* Size */}
            {product.sizes?.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-[11px] font-poppins font-600 text-[#999999] uppercase tracking-[0.2em]">
                    Size: <span className="text-[#1A1A1A] font-600 ml-1">{selectedSize || "Select Size"}</span>
                  </p>
                  <button className="text-[11px] font-poppins text-[#C4973A] uppercase tracking-widest hover:underline font-medium">
                    Size Guide
                  </button>
                </div>
                <div className="flex flex-wrap gap-3">
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

            {/* Qty & Add to Bag */}
            <div className="flex flex-col gap-4 mb-6">
              <div className="flex gap-4">
                {/* Qty stepper */}
                <div className="flex items-center border border-[#E8E8E8]">
                  <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-14 h-[56px] flex items-center justify-center hover:bg-[#F5EBE0] transition-colors">
                    <ChevronDown size={16} />
                  </button>
                  <span className="w-12 text-center text-lg font-poppins font-600 text-[#1A1A1A]">{qty}</span>
                  <button onClick={() => setQty((q) => Math.min(product.stock || 99, q + 1))} className="w-14 h-[56px] flex items-center justify-center hover:bg-[#F5EBE0] transition-colors">
                    <ChevronUp size={16} />
                  </button>
                </div>

                {/* Add to bag */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAdd}
                  id="product-add-to-bag"
                  className="flex-1 btn flex items-center justify-center gap-2 border border-[#1A1A1A] bg-transparent text-[#1A1A1A] hover:bg-[#F5EBE0]"
                >
                  {added ? (
                    <><Check size={15} /> Added!</>
                  ) : (
                    <><ShoppingBag size={15} /> Add to Bag</>
                  )}
                </motion.button>

                {/* Wishlist */}
                <button
                  onClick={() => toggleItem(product)}
                  id="product-wishlist"
                  className="btn-icon flex-shrink-0 border border-[#E8E8E8]"
                  aria-label="Wishlist"
                >
                  <Heart size={17} fill={wishlisted ? "#C4607A" : "none"} color={wishlisted ? "#C4607A" : "#1A1A1A"} />
                </button>
              </div>

              {/* Buy It Now */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={handleBuyNow}
                id="product-buy-now"
                className="w-full btn btn-primary flex items-center justify-center py-4 text-sm tracking-widest"
              >
                Buy It Now
              </motion.button>
            </div>

            {/* Stock warning */}
            {product.stock <= 5 && product.stock > 0 && (
              <p className="text-sm font-poppins text-[#C4607A] mb-4 font-600">
                ⚡ Only {product.stock} items left!
              </p>
            )}

            {/* Trust badges */}
            <div className="flex flex-wrap gap-6 py-6 border-t border-b border-[#E8E8E8] mb-8">
              {[
                { icon: Truck,      text: "Free shipping above ₹2,999" },
                { icon: RotateCcw,  text: "30-day easy returns" },
                { icon: Shield,     text: "Authentic & verified" },
              ].map((b) => (
                <div key={b.text} className="flex items-center gap-3">
                  <b.icon size={16} style={{ color: "#C4973A" }} />
                  <span className="text-sm font-poppins text-[#666666] tracking-wide">{b.text}</span>
                </div>
              ))}
            </div>

            {/* Accordions */}
            <div className="space-y-0">
              {accordions.map((acc) => (
                <div key={acc.id} className="border-b border-[#E8E8E8]">
                  <button
                    onClick={() => setOpenAccordion(openAccordion === acc.id ? null : acc.id)}
                    className="w-full flex items-center justify-between py-5 text-sm font-poppins font-600 text-[#1A1A1A] uppercase tracking-[0.15em] hover:text-[#C4973A] transition-colors"
                  >
                    {acc.label}
                    {openAccordion === acc.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                  <AnimatePresence>
                    {openAccordion === acc.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="text-base font-poppins text-[#666666] leading-[2] pb-6 px-1">{acc.content}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* Tags */}
            {product.tags?.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 text-[10px] font-poppins font-600 text-espresso border border-[#E8E8E8] uppercase tracking-wider">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-8">
        <TrendingGrid />
      </div>

      {/* Mobile Sticky Bar */}
      <div className="sticky-atb-bar lg:hidden flex gap-3">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleAdd}
          className="flex-1 btn btn-primary flex items-center justify-center gap-2 py-3"
        >
          <ShoppingBag size={15} />
          {added ? "Added!" : "Add to Bag"}
        </motion.button>
        <button
          onClick={() => toggleItem(product)}
          className="btn-icon"
          aria-label="Wishlist"
        >
          <Heart size={17} fill={wishlisted ? "#C4607A" : "none"} color={wishlisted ? "#C4607A" : "#1A1A1A"} />
        </button>
      </div>
    </>
  );
}

function ProductSkeleton() {
  return (
    <div className="luxury-container py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="skeleton aspect-[3/4]" />
        <div className="space-y-4 pt-4">
          <div className="skeleton h-4 w-24" />
          <div className="skeleton h-8 w-3/4" />
          <div className="skeleton h-4 w-32" />
          <div className="skeleton h-10 w-48" />
          <div className="skeleton h-12 w-full mt-8" />
        </div>
      </div>
    </div>
  );
}

function NotFound() {
  return (
    <div className="luxury-container py-24 text-center">
      <h1 className="font-playfair text-4xl text-[#1A1A1A] mb-3">Product not found</h1>
      <p className="text-base font-poppins text-espresso mb-6">This product may be out of stock or no longer available.</p>
      <Link href="/shop"><button className="btn btn-primary">Continue Shopping</button></Link>
    </div>
  );
}
