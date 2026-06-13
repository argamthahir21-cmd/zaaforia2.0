"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingBag, Heart, Home, Command } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUIStore, useCartStore, useWishlistStore } from "@/lib/store";

export function FloatingNav() {
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();
  
  const { setSearchOpen, setCartDrawerOpen } = useUIStore();
  const cartItemCount = useCartStore((state) => state.getItemCount());
  const wishlistItemCount = useWishlistStore((state) => state.items.length);

  useEffect(() => {
    const handleScroll = () => {
      // Show when scrolled down 300px
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K for Search
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
      // Cmd/Ctrl + B for Bag/Cart
      if ((e.metaKey || e.ctrlKey) && e.key === "b") {
        e.preventDefault();
        setCartDrawerOpen(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [setSearchOpen, setCartDrawerOpen]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0, x: "-50%" }}
          animate={{ y: 0, opacity: 1, x: "-50%" }}
          exit={{ y: 100, opacity: 0, x: "-50%" }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="fixed bottom-6 left-1/2 z-50 flex items-center gap-2 p-2 bg-white/80 backdrop-blur-md border border-champagne rounded-full shadow-luxury-lg"
        >
          <Link href="/" className={`p-3 rounded-full transition-colors ${pathname === "/" ? "bg-espresso text-white" : "text-espresso hover:bg-champagne hover:text-espresso"}`}>
            <Home size={18} />
          </Link>
          
          <button onClick={() => setSearchOpen(true)} className="p-3 rounded-full text-espresso hover:bg-champagne hover:text-espresso transition-colors group relative">
            <Search size={18} />
            <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-espresso text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap flex items-center gap-1">
              Search <Command size={10}/>K
            </span>
          </button>
          
          <Link href="/wishlist" className={`p-3 rounded-full transition-colors relative group ${pathname === "/wishlist" ? "bg-espresso text-white" : "text-espresso hover:bg-champagne hover:text-espresso"}`}>
            <Heart size={18} />
            {wishlistItemCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-rose text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {wishlistItemCount}
              </span>
            )}
          </Link>
          
          <button onClick={() => setCartDrawerOpen(true)} className="p-3 rounded-full text-espresso hover:bg-champagne hover:text-espresso transition-colors relative group">
            <ShoppingBag size={18} />
            {cartItemCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-gold text-espresso text-[9px] font-bold rounded-full flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
            <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-espresso text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap flex items-center gap-1">
              Bag <Command size={10}/>B
            </span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
