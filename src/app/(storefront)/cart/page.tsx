"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Plus, Minus, Tag, ArrowRight, ShoppingBag, Heart } from "lucide-react";
import { useCartStore, useWishlistStore } from "@/lib/store";

const coupons: Record<string, { type: "pct" | "flat"; value: number; min: number; label: string }> = {
  ZAAFORIA20: { type: "pct",  value: 20,  min: 2999,  label: "20% off (max ₹3000)" },
  SEASON40:   { type: "pct",  value: 40,  min: 5999,  label: "40% off (max ₹5000)" },
  FLAT500:    { type: "flat", value: 500, min: 3999,  label: "Flat ₹500 off" },
};

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, getTotal } = useCartStore();
  const { addItem: addToWishlist } = useWishlistStore();

  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState("");

  const subtotal = getTotal();
  const shipping = subtotal >= 2999 ? 0 : 149;

  const couponData = appliedCoupon ? coupons[appliedCoupon] : null;
  let discount = 0;
  if (couponData) {
    discount = couponData.type === "pct"
      ? Math.min(subtotal * couponData.value / 100, couponData.type === "pct" ? 5000 : 999999)
      : couponData.value;
  }

  const total = subtotal + shipping - discount;

  const applyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    const c = coupons[code];
    if (!c) { setCouponError("Invalid coupon code"); return; }
    if (subtotal < c.min) { setCouponError(`Minimum order ₹${c.min.toLocaleString()} required`); return; }
    setAppliedCoupon(code);
    setCouponError("");
    setCouponInput("");
  };

  if (items.length === 0) {
    return (
      <div className="luxury-container py-24 text-center">
        <ShoppingBag size={48} className="mx-auto text-[#E8E8E8] mb-6" />
        <h1 className="font-playfair text-4xl text-[#1A1A1A] mb-3">Your bag is empty</h1>
        <p className="text-base font-poppins text-espresso mb-8">Looks like you haven&apos;t added anything yet</p>
        <Link href="/shop">
          <button className="btn btn-primary flex items-center gap-2 mx-auto">
            Start Shopping <ArrowRight size={14} />
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="luxury-container py-8 md:py-12">
      <div className="mb-8">
        <p className="section-label mb-2">My Bag</p>
        <h1 className="text-title font-playfair text-[#1A1A1A]">
          Shopping Bag <span className="text-[#B0B0B0] font-300 text-xl">({items.length} items)</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* ─── Cart Items ─── */}
        <div className="lg:col-span-2 space-y-0">
          <AnimatePresence initial={false}>
            {items.map((item) => (
              <motion.div
                key={`${item.product.id}-${item.size}-${item.color}`}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -40, height: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="flex gap-4 py-5 border-b border-[#E8E8E8]"
              >
                {/* Image */}
                <Link href={`/product/${item.product.id}`} className="flex-shrink-0">
                  <div className="relative w-24 md:w-28 aspect-[3/4] bg-[#F5EBE0] overflow-hidden">
                    {item.product.images?.[0] && (
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="112px"
                      />
                    )}
                  </div>
                </Link>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-poppins text-[#B0B0B0] uppercase tracking-widest mb-1">{item.product.category}</p>
                  <h3 className="font-poppins font-500 text-base text-[#1A1A1A] mb-1 line-clamp-2">{item.product.name}</h3>
                  <div className="flex gap-3 mb-3">
                    <span className="text-sm font-poppins text-espresso">Size: <strong>{item.size}</strong></span>
                    <span className="text-sm font-poppins text-espresso">Colour: <strong>{item.color}</strong></span>
                  </div>

                  <div className="flex items-center justify-between">
                    {/* Qty */}
                    <div className="flex items-center border border-[#E8E8E8]">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-[#F5EBE0] transition-colors"
                      >
                        <Minus size={11} />
                      </button>
                      <span className="w-8 text-center text-sm font-poppins font-600">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-[#F5EBE0] transition-colors"
                      >
                        <Plus size={11} />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <p className="font-playfair font-700 text-[#1A1A1A]">
                        ₹{(item.product.price * item.quantity).toLocaleString()}
                      </p>
                      {item.quantity > 1 && (
                        <p className="text-sm font-poppins text-[#B0B0B0]">₹{item.product.price.toLocaleString()} each</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <button
                    onClick={() => { addToWishlist(item.product); removeItem(item.product.id, item.size, item.color); }}
                    className="w-8 h-8 flex items-center justify-center hover:text-[#C4973A] transition-colors text-[#B0B0B0]"
                    title="Move to Wishlist"
                  >
                    <Heart size={14} />
                  </button>
                  <button
                    onClick={() => removeItem(item.product.id, item.size, item.color)}
                    className="w-8 h-8 flex items-center justify-center hover:text-[#C4607A] transition-colors text-[#B0B0B0]"
                    title="Remove"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* ─── Order Summary ─── */}
        <div className="lg:col-span-1">
          <div className="border border-[#E8E8E8] p-6 sticky top-24">
            <h2 className="font-poppins font-700 text-base text-[#1A1A1A] uppercase tracking-wider mb-5">Order Summary</h2>

            <div className="space-y-3 mb-5 pb-5 border-b border-[#E8E8E8]">
              <div className="flex justify-between text-base font-poppins text-[#3D3D3D]">
                <span>Subtotal ({items.length} items)</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-base font-poppins text-[#3D3D3D]">
                <span>Shipping</span>
                <span className={shipping === 0 ? "text-[#C4973A] font-600" : ""}>
                  {shipping === 0 ? "FREE" : `₹${shipping}`}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-base font-poppins text-[#C4607A]">
                  <span>Discount ({appliedCoupon})</span>
                  <span>-₹{discount.toLocaleString()}</span>
                </div>
              )}
            </div>

            <div className="flex justify-between mb-6">
              <span className="font-poppins font-700 text-base text-[#1A1A1A] uppercase tracking-wider">Total</span>
              <span className="font-playfair font-700 text-2xl text-[#1A1A1A]">₹{Math.max(0, total).toLocaleString()}</span>
            </div>

            {/* Coupon */}
            {!appliedCoupon ? (
              <div className="mb-5">
                <div className="flex gap-2">
                  <input
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    onKeyDown={(e) => e.key === "Enter" && applyCoupon()}
                    placeholder="Coupon code"
                    className="input-luxury flex-1 text-base py-2.5 px-3"
                  />
                  <button onClick={applyCoupon} className="btn btn-secondary px-4 py-2.5 text-sm">
                    <Tag size={12} />
                  </button>
                </div>
                {couponError && <p className="text-sm font-poppins text-[#C4607A] mt-1.5">{couponError}</p>}
                <div className="mt-2 space-y-1">
                  {Object.entries(coupons).map(([code, c]) => (
                    <button
                      key={code}
                      onClick={() => setCouponInput(code)}
                      className="block text-[10px] font-poppins text-[#C4973A] hover:underline"
                    >
                      {code} — {c.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between mb-5 px-3 py-2 bg-[#F5EBE0]">
                <span className="text-sm font-poppins font-600 text-[#C4973A]">{appliedCoupon} applied!</span>
                <button onClick={() => setAppliedCoupon(null)} className="text-sm font-poppins text-espresso hover:text-[#C4607A]">Remove</button>
              </div>
            )}

            <Link href="/checkout" id="cart-checkout-btn">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn btn-primary w-full flex items-center justify-center gap-2 py-4"
              >
                Proceed to Checkout <ArrowRight size={14} />
              </motion.button>
            </Link>

            <Link href="/shop">
              <button className="w-full mt-3 text-sm font-poppins text-espresso hover:text-[#1A1A1A] uppercase tracking-wider transition-colors py-2">
                ← Continue Shopping
              </button>
            </Link>

            {/* Free shipping nudge */}
            {subtotal < 2999 && (
              <div className="mt-4 p-3 bg-[#FAFAF8] border border-[#E8E8E8]">
                <p className="text-sm font-poppins text-espresso">
                  Add <strong className="text-[#C4973A]">₹{(2999 - subtotal).toLocaleString()}</strong> more for free shipping!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
