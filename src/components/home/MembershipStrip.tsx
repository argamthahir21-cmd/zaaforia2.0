"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { User, ShieldCheck, Heart, ShoppingBag, ArrowRight } from "lucide-react";
import { useAuthStore } from "@/lib/store";

export function MembershipStrip() {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated) {
    return (
      <section className="py-16 bg-[#1A1A1A] border-y border-[#333333]">
        <div className="luxury-container text-center text-white">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-[#333333] mb-6">
            <ShieldCheck size={24} className="text-[#D4B88A]" />
          </div>
          <h2 className="font-playfair text-4xl md:text-5xl mb-4 tracking-wide" style={{ color: '#FFFFFF' }}>
            Welcome back, {user?.name?.split(" ")[0] || "VIP"}
          </h2>
          <p className="font-jost text-base max-w-lg mx-auto mb-8 uppercase tracking-widest leading-relaxed" style={{ color: '#FFFFFF' }}>
            Manage your orders, view your wishlist, and track your luxurious deliveries.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/profile" className="px-8 py-3 bg-[#D4B88A] text-[#1A1A1A] text-sm font-jost font-semibold uppercase tracking-widest hover:bg-white transition-colors">
              Go to Profile
            </Link>
            <Link href="/shop" className="px-8 py-3 border border-white/20 text-white text-sm font-jost font-semibold uppercase tracking-widest hover:border-white transition-colors">
              Continue Shopping
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-[#1A1A1A] border-y border-[#333333] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#D4B88A]/5 to-transparent pointer-events-none" />
      
      <div className="luxury-container relative z-10">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-16">
          
          <div className="flex-1 text-center md:text-left pr-0 md:pr-8">
            <h2 className="font-playfair text-4xl md:text-5xl mb-6 tracking-wide leading-tight" style={{ color: '#FFFFFF' }}>
              Unlock the Zaforia Experience
            </h2>
            <p className="font-jost text-sm mb-10 uppercase tracking-[0.2em] leading-[2.2]" style={{ color: '#FFFFFF', opacity: 0.9 }}>
              Create an account to securely save your orders, manage your wishlist, and gain exclusive early access to our luxury collections.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 mt-6">
              <Link href="/auth/login" className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#D4B88A] text-[#1A1A1A] text-xs font-jost font-semibold uppercase tracking-[0.2em] hover:bg-white transition-colors">
                <User size={16} /> Sign In / Register
              </Link>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-5 flex-shrink-0">
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-[#262626] p-7 text-center border border-[#333333] flex flex-col items-center justify-center"
            >
              <Heart size={24} className="text-[#D4B88A] mb-4" />
              <p className="font-jost text-[10px] uppercase tracking-[0.2em] leading-relaxed" style={{ color: '#FFFFFF' }}>Save Wishlist</p>
            </motion.div>
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-[#262626] p-7 text-center border border-[#333333] flex flex-col items-center justify-center"
            >
              <ShoppingBag size={24} className="text-[#D4B88A] mb-4" />
              <p className="font-jost text-[10px] uppercase tracking-[0.2em] leading-relaxed" style={{ color: '#FFFFFF' }}>Track Orders</p>
            </motion.div>
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-[#262626] p-7 text-center border border-[#333333] col-span-2 flex flex-col items-center justify-center"
            >
              <ShieldCheck size={24} className="text-[#D4B88A] mb-4" />
              <p className="font-jost text-[10px] uppercase tracking-[0.2em] leading-relaxed" style={{ color: '#FFFFFF' }}>Secure Checkout</p>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
