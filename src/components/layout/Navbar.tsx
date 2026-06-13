"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Heart, ShoppingBag, User, Menu, X,
  ChevronDown, ArrowRight, Sparkles,
} from "lucide-react";
import { useAuthStore, useCartStore, useWishlistStore } from "@/lib/store";
import { useCinemaStore } from "@/lib/store/useCinemaStore";
import { useSearchProducts, useCategories } from "@/lib/hooks";
import { useDebounce } from "@/lib/useDebounce";
import { useContent } from "@/context/ContentContext";

const categories = [
  { label: "Dresses",      href: "/shop?category=Dresses",      img: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=280&q=75" },
  { label: "Ethnic Wear",  href: "/shop?category=Ethnic+Wear",  img: "https://images.unsplash.com/photo-1583396082781-f0e97c25b3c8?w=280&q=75" },
  { label: "Western Wear", href: "/shop?category=Western+Wear", img: "https://images.unsplash.com/photo-1551803091-e20673f15770?w=280&q=75" },
  { label: "Tops",         href: "/shop?category=Tops",         img: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=280&q=75" },
  { label: "Skirts",       href: "/shop?category=Skirts",       img: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=280&q=75" },
  { label: "Accessories",  href: "/shop?category=Accessories",  img: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=280&q=75" },
];

const navLinks = [
  { label: "New", href: "/new-arrivals" },
  { label: "Categories", href: "/shop", hasMega: true, highlightCategory: true },
  { label: "Dresses", href: "/shop?category=Dresses" },
  { label: "Ethnic", href: "/shop?category=Ethnic+Wear" },
  { label: "Accessories", href: "/shop?category=Accessories" },
  { label: "Trending", href: "/trending" },
  { label: "Lookbook", href: "/lookbook" },
  { label: "Sale", href: "/offers", highlight: true },
];

const trendingSearches = ["Silk Dress", "Lehenga", "Co-ord Set", "Blazer", "Accessories"];

export function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen]     = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [bannerVisible, setBannerVisible] = useState(true);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const isTransparent = false;

  const { isAuthenticated, user, logout } = useAuthStore();
  const { isIntroFinished }       = useCinemaStore();
  const cartCount     = useCartStore((s) => s.items.reduce((a, i) => a + i.quantity, 0));
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const { getContent } = useContent();

  const searchRef  = useRef<HTMLDivElement>(null);
  const debouncedQ = useDebounce(searchQuery, 300);
  const { data: searchResults } = useSearchProducts(debouncedQ);
  const { data: dbCategories } = useCategories();
  const searchHits = (searchResults as any)?.content?.slice(0, 5) || [];

  const displayCategories = dbCategories?.length 
    ? dbCategories.slice(0, 6).map(c => ({
        label: c.name,
        href: `/shop?category=${encodeURIComponent(c.name)}`,
        img: c.image || "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=280&q=75"
      }))
    : categories;

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
      setBannerVisible(window.scrollY < 60);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
  }, [mobileOpen]);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  if (!isIntroFinished) return null;

  const promo1 = getContent("navbar.promo1", "USE CODE ZAAFORIA20");
  const promo2 = getContent("navbar.promo2", "EASY 30-DAY RETURNS");
  const promo3 = getContent("navbar.promo3", "NEW ARRIVALS EVERY WEEK");
  const promo4 = getContent("navbar.promo4", "FREE SHIPPING ON ORDERS ABOVE ₹2,999");

  return (
    <>
      {/* ─── Promo Banner (Marquee) ─────────────────────────────────── */}
      <AnimatePresence>
        {bannerVisible && (
          <motion.div
            initial={{ height: 36, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden bg-[#1A1A1A]"
          >
            <div className="flex items-center justify-center h-9 px-4 gap-8 overflow-hidden">
              <div className="animate-marquee whitespace-nowrap flex gap-16 text-[10px] font-jost tracking-[0.2em] uppercase text-white">
                <span>{promo4}</span>
                <span className="text-[#D4B88A]">{promo1}</span>
                <span>{promo2}</span>
                <span className="text-[#D4B88A]">{promo3}</span>
                <span>{promo4}</span>
                <span className="text-[#D4B88A]">{promo1}</span>
                <span>{promo2}</span>
                <span className="text-[#D4B88A]">{promo3}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Main Navbar ───────────────────────────────────────────────── */}
      <header
        className="w-full z-50 sticky top-0 bg-[#FAFAF7] border-b border-[#E5E2DE] text-[#1A1A1A] transition-all duration-300 shadow-[0_1px_8px_rgba(0,0,0,0.03)]"
      >
        <div className="luxury-container h-16 flex items-center justify-between gap-4">
          
          {/* Mobile menu toggle */}
          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 -ml-2 text-[#1A1A1A] hover:text-espresso transition-colors"
            aria-label="Open menu"
          >
            <Menu size={20} strokeWidth={1.5} />
          </button>

          {/* Left Side: Navigation Links (Desktop) */}
          <div className="hidden lg:flex items-center flex-1 gap-6">
            {navLinks.slice(0, 4).map((link) => (
              <div
                key={link.label}
                onMouseEnter={() => link.hasMega && setMegaOpen(true)}
                onMouseLeave={() => link.hasMega && setMegaOpen(false)}
              >
                <Link
                  href={link.href}
                  className={`flex items-center text-[13px] font-jost uppercase tracking-widest transition-all ${
                    (link as any).highlightCategory 
                      ? "text-[#B8945F] font-bold border-b-2 border-[#B8945F] pb-1" 
                      : link.highlight 
                      ? "text-[#C4607A] font-semibold hover:text-[#B8945F]" 
                      : "text-[#1A1A1A] font-medium hover:text-[#B8945F]"
                  }`}
                >
                  {link.label}
                  {link.hasMega && <ChevronDown size={14} className="ml-1" />}
                </Link>
              </div>
            ))}
          </div>

          {/* Logo — Centered */}
          <Link href="/" id="navbar-logo" className="flex-shrink-0 flex justify-center flex-1 lg:flex-none">
            <span className="font-cormorant text-[22px] md:text-[28px] font-semibold tracking-widest text-[#1A1A1A]">
              ZAAFORIA
            </span>
          </Link>

          {/* Right Side: Search & Icons */}
          <div className="flex items-center gap-4 flex-1 justify-end">
            
            {/* Search Input (Desktop) */}
            <div ref={searchRef} className="hidden lg:flex relative">
              <div className="flex items-center gap-2 border-b border-[#E5E2DE] pb-1 w-[180px]">
                <Search size={14} className="text-[#1A1A1A]" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchOpen(true)}
                  placeholder="Search"
                  className="flex-1 bg-transparent text-[10px] font-jost uppercase tracking-wider outline-none text-[#1A1A1A] placeholder-[#9A9A9A]"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")}>
                    <X size={12} className="text-espresso hover:text-[#1A1A1A]" />
                  </button>
                )}
              </div>

              {/* Search Dropdown */}
              <AnimatePresence>
                {searchOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-4 w-[320px] bg-[#FAFAF7] shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-[#E5E2DE] z-30"
                  >
                    {searchHits.length > 0 ? (
                      <div className="py-2">
                        {searchHits.map((p: any) => (
                          <Link
                            key={p.id}
                            href={`/product/${p.id}`}
                            onClick={() => setSearchOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-white transition-colors group"
                          >
                            <div className="w-10 h-10 bg-[#F5F0EB] flex-shrink-0 overflow-hidden">
                              {p.images?.[0] && (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[11px] font-jost font-medium text-[#1A1A1A] truncate">{p.name}</p>
                              <p className="text-[10px] text-espresso">₹{p.price?.toLocaleString()}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4">
                        <p className="text-[9px] font-jost text-espresso uppercase tracking-wider mb-3">Trending</p>
                        <div className="flex flex-wrap gap-2">
                          {trendingSearches.map((t) => (
                            <button
                              key={t}
                              onClick={() => setSearchQuery(t)}
                              className="px-3 py-1.5 text-[9px] font-jost text-[#1A1A1A] border border-[#E5E2DE] hover:border-[#1A1A1A] transition-colors uppercase tracking-wider"
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile search */}
            <button
              className="lg:hidden p-1 text-[#1A1A1A]"
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Search"
            >
              <Search size={18} strokeWidth={1.5} />
            </button>

            {/* Icons */}
            <Link href="/wishlist" className="hidden md:block p-1 hover:text-[#B8945F] transition-colors text-[#1A1A1A]">
              <Heart size={18} strokeWidth={1.2} />
            </Link>

            <div 
              className="hidden lg:block relative"
              onMouseEnter={() => isAuthenticated && setProfileDropdownOpen(true)}
              onMouseLeave={() => isAuthenticated && setProfileDropdownOpen(false)}
            >
              <Link href={isAuthenticated ? "/profile" : "/auth/login"} className="flex items-center gap-2 p-1 hover:text-[#B8945F] transition-colors text-[#1A1A1A]">
                <User size={18} strokeWidth={1.2} />
                {isAuthenticated && <span className="text-[11px] font-jost uppercase tracking-widest">{user?.name?.split(" ")[0]}</span>}
              </Link>

              <AnimatePresence>
                {isAuthenticated && profileDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-2 w-64 bg-white border border-[#E5E2DE] shadow-[0_8px_30px_rgba(0,0,0,0.08)] z-50 rounded-lg overflow-hidden"
                  >
                    <div className="p-4 border-b border-[#E5E2DE] bg-[#FAFAF7]">
                      <p className="font-cormorant text-lg font-semibold text-[#1A1A1A]">Hi, {user?.name}</p>
                      <p className="text-[11px] font-jost text-[#6B6B6B] truncate">{user?.email}</p>
                    </div>
                    <div className="py-2">
                      <Link href="/profile" onClick={() => setProfileDropdownOpen(false)} className="block px-4 py-2.5 text-sm font-jost text-[#1A1A1A] hover:bg-[#FAFAF7] hover:text-[#B8945F] transition-colors">
                        My Dashboard
                      </Link>
                      <Link href="/profile" onClick={() => setProfileDropdownOpen(false)} className="block px-4 py-2.5 text-sm font-jost text-[#1A1A1A] hover:bg-[#FAFAF7] hover:text-[#B8945F] transition-colors">
                        Recent Orders
                      </Link>
                      <Link href="/wishlist" onClick={() => setProfileDropdownOpen(false)} className="block px-4 py-2.5 text-sm font-jost text-[#1A1A1A] hover:bg-[#FAFAF7] hover:text-[#B8945F] transition-colors">
                        My Wishlist
                      </Link>
                      <Link href="/profile" onClick={() => setProfileDropdownOpen(false)} className="block px-4 py-2.5 text-sm font-jost text-[#1A1A1A] hover:bg-[#FAFAF7] hover:text-[#B8945F] transition-colors">
                        Change Password
                      </Link>
                    </div>
                    <div className="border-t border-[#E5E2DE] py-2">
                      <button 
                        onClick={() => { logout(); setProfileDropdownOpen(false); }}
                        className="w-full text-left px-4 py-2.5 text-sm font-jost text-[#C4607A] hover:bg-[#FAFAF7] transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link href="/cart" className="flex items-center gap-1.5 p-1 hover:text-[#B8945F] transition-colors text-[#1A1A1A]">
              <ShoppingBag size={18} strokeWidth={1.2} />
              <span className="text-[10px] font-jost tracking-widest">{cartCount > 0 ? cartCount : ''}</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ─── Mega Menu ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {megaOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className={`fixed left-0 right-0 z-40 bg-white border-b border-[#E5E2DE] shadow-[0_8px_40px_rgba(0,0,0,0.08)] ${bannerVisible ? "top-[130px]" : "top-[94px]"}`}
            onMouseEnter={() => setMegaOpen(true)}
            onMouseLeave={() => setMegaOpen(false)}
          >
            <div className="luxury-container py-8">
              <div className="grid grid-cols-7 gap-6">
                {/* Left editorial */}
                <div className="col-span-2 pr-6 border-r border-[#E5E2DE]">
                  <p className="section-label mb-4">Featured</p>
                  <Link
                    href="/new-arrivals"
                    onClick={() => setMegaOpen(false)}
                    className="group block"
                  >
                    <div className="relative overflow-hidden aspect-[4/5] mb-3 bg-[#F5F0EB]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&q=80"
                        alt="New Season"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 gradient-dark-overlay" />
                      <div className="absolute bottom-4 left-4">
                        <p className="text-white font-cormorant text-xl font-normal italic">New Season</p>
                        <p className="text-white text-[10px] font-jost flex items-center gap-1 mt-1 uppercase tracking-wider">
                          Shop Now <ArrowRight size={9} />
                        </p>
                      </div>
                    </div>
                  </Link>
                  <div className="space-y-2 mt-4">
                    {[
                      { label: "New Arrivals", href: "/new-arrivals" },
                      { label: "Trending Now", href: "/trending" },
                      { label: "Sale", href: "/offers" },
                    ].map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={() => setMegaOpen(false)}
                        className="flex items-center gap-2 text-sm font-jost text-espresso hover:text-[#1A1A1A] transition-colors py-1"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Category grid */}
                <div className="col-span-5">
                  <p className="section-label mb-5">Shop By Category</p>
                  <div className="grid grid-cols-6 gap-3">
                    {displayCategories.map((cat, i) => (
                      <motion.div
                        key={cat.label}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03 }}
                      >
                        <Link
                          href={cat.href}
                          onClick={() => setMegaOpen(false)}
                          className="group block text-center"
                        >
                          <div className="relative overflow-hidden aspect-[3/4] mb-2 bg-[#F5F0EB]">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={cat.img}
                              alt={cat.label}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                          </div>
                          <p className="text-[10px] font-jost font-medium text-[#1A1A1A] group-hover:text-espresso transition-colors tracking-widest uppercase">
                            {cat.label}
                          </p>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Mobile Menu ───────────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="drawer-overlay"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 340, damping: 40 }}
              className="drawer drawer-left w-[85%] max-w-[380px]"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <span className="font-cormorant text-2xl font-semibold tracking-[0.08em] text-[#1A1A1A]">
                    Z<span style={{ color: "#B8945F" }}>AA</span>FORIA
                  </span>
                  <button onClick={() => setMobileOpen(false)} className="p-2 -mr-2">
                    <X size={20} className="text-[#1A1A1A]" strokeWidth={1.5} />
                  </button>
                </div>

                {/* Search */}
                <div className="flex items-center gap-2 bg-[#FAFAF7] border border-[#E5E2DE] px-3 py-2.5 mb-6">
                  <Search size={14} className="text-espresso" />
                  <input
                    placeholder="Search..."
                    className="flex-1 text-sm font-jost text-[#1A1A1A] placeholder:text-[#C8BFB6] bg-transparent outline-none"
                  />
                </div>

                {/* Nav links */}
                <nav className="space-y-0">
                  {navLinks.map((link, i) => (
                    <motion.div
                      key={link.label}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center justify-between py-3.5 text-base font-jost font-normal text-[#1A1A1A] border-b border-[#E5E2DE] hover:text-espresso transition-colors uppercase tracking-widest ${link.highlight ? "text-[#C4607A]!" : ""}`}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}
                </nav>

                {/* Bottom */}
                <div className="mt-8 pt-6 border-t border-[#E5E2DE] space-y-4">
                  <Link
                    href={isAuthenticated ? "/profile" : "/auth/login"}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 text-sm font-jost text-[#1A1A1A] hover:text-espresso transition-colors uppercase tracking-wider"
                  >
                    <User size={16} strokeWidth={1.5} />
                    {isAuthenticated ? `Hi, ${user?.name?.split(" ")[0]}` : "Sign In / Register"}
                  </Link>
                  <Link
                    href="/wishlist"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 text-sm font-jost text-[#1A1A1A] hover:text-espresso transition-colors uppercase tracking-wider"
                  >
                    <Heart size={16} strokeWidth={1.5} />
                    Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
                  </Link>
                </div>

                {/* Promo */}
                <div className="mt-8 p-4 bg-[#1A1A1A]">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles size={12} style={{ color: "#D4B88A" }} />
                    <p className="text-[10px] font-jost text-white uppercase tracking-widest">First Order</p>
                  </div>
                  <p className="font-cormorant text-2xl text-white font-light">
                    Get <span style={{ color: "#D4B88A" }} className="font-semibold">20% Off</span>
                  </p>
                  <p className="text-[10px] font-jost text-white mt-1">Code: ZAAFORIA20</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
