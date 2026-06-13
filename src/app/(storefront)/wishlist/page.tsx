"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Trash2, X } from "lucide-react";
import { useWishlistStore, useCartStore } from "@/lib/store";

export default function WishlistPage() {
  const { items: wishlistItems, removeItem } = useWishlistStore();
  const addItemToCart = useCartStore((state) => state.addItem);

  return (
    <div className="min-h-screen bg-ivory">
      <div className="max-w-[1400px] mx-auto px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <Heart size={28} className="mx-auto mb-3 text-rose" />
          <h1 className="font-playfair text-5xl md:text-5xl text-espresso mb-2">My Wishlist</h1>
          <p className="font-poppins text-base text-espresso">{wishlistItems.length} items saved</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {wishlistItems.map((product, i) => (
            <motion.div key={product.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="group">
              <div className="product-card border border-[#E5E2DE] rounded-xl overflow-hidden bg-white shadow-sm flex flex-col h-full">
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F5F0EB]">
                  <Link href={`/product/${product.id}`}>
                    <Image src={product.images[0]} alt={product.name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="25vw" />
                  </Link>
                  <button onClick={() => removeItem(product.id)} className="absolute top-3 right-3 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-[#C4607A] hover:text-white transition-colors z-10">
                    <X size={16} />
                  </button>
                </div>
                <div className="p-5 flex flex-col flex-1 justify-between bg-white text-center">
                  <div>
                    <span className="text-[10px] font-jost text-[#6B6B6B] uppercase tracking-widest mb-1 block">{product.category}</span>
                    <h3 className="font-playfair text-lg text-espresso mb-2 line-clamp-1">{product.name}</h3>
                  </div>
                  <div>
                    <p className="font-jost text-base font-semibold text-espresso mb-4">₹{product.price.toLocaleString()}</p>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={() => addItemToCart(product, product.sizes?.[0] || 'One Size', product.colors?.[0] || 'Default', 1)}
                      className="w-full py-3 bg-[#1A1A1A] text-white text-[11px] font-jost font-semibold tracking-[0.15em] uppercase rounded-lg flex items-center justify-center gap-2 hover:bg-[#2C2C2C] transition-colors">
                      <ShoppingBag size={14} /> Move to Bag
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {wishlistItems.length === 0 && (
          <div className="text-center py-20">
            <Heart size={48} className="mx-auto mb-4 text-champagne" />
            <h2 className="font-playfair text-3xl text-espresso mb-2">Your wishlist is empty</h2>
            <p className="font-poppins text-base text-espresso mb-6">Save your favorite pieces to revisit later</p>
            <Link href="/shop" className="btn-luxury btn-luxury-primary">Explore Collection</Link>
          </div>
        )}
      </div>
    </div>
  );
}
