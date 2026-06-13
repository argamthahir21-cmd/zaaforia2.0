"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/lib/store";
import { usePathname } from "next/navigation";

export function LoginPrompt() {
  const { isAuthenticated } = useAuthStore();
  const [show, setShow] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Don't show if already authenticated or on auth pages
    if (isAuthenticated || pathname.includes("/auth")) {
      return;
    }

    // Check if we've already dismissed it this session
    const hasDismissed = sessionStorage.getItem("zaaforia_login_prompt_dismissed");
    if (hasDismissed) {
      return;
    }

    // Show after 10 seconds of browsing
    const timer = setTimeout(() => {
      setShow(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, [isAuthenticated, pathname]);

  const handleDismiss = () => {
    setShow(false);
    sessionStorage.setItem("zaaforia_login_prompt_dismissed", "true");
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-6 right-6 z-50 w-[320px] bg-white border border-champagne rounded-2xl shadow-luxury-lg overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold to-champagne" />
          
          <button 
            onClick={handleDismiss}
            className="absolute top-3 right-3 text-espresso hover:text-rose transition-colors p-1"
          >
            <X size={16} />
          </button>
          
          <div className="p-6">
            <div className="w-10 h-10 bg-champagne-light rounded-full flex items-center justify-center mb-4">
              <Lock size={18} className="text-gold" />
            </div>
            
            <h3 className="font-playfair text-xl text-espresso mb-2">
              Elevate Your Experience
            </h3>
            
            <p className="font-poppins text-sm text-espresso mb-5 leading-relaxed">
              Sign in to save your wishlist, access exclusive luxury drops, and track your orders seamlessly.
            </p>
            
            <div className="flex gap-3">
              <Link 
                href="/auth/login"
                onClick={handleDismiss}
                className="flex-1 py-2.5 bg-espresso text-white text-[11px] font-poppins font-semibold tracking-wider uppercase rounded-lg flex items-center justify-center gap-2 hover:bg-gold hover:text-espresso transition-colors"
              >
                Sign In <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
