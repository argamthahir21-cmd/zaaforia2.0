"use client";

import { useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  SlidersHorizontal, X, ChevronDown, Heart, Eye,
  ShoppingBag, Star, Loader2, ArrowRight,
} from "lucide-react";
import { useProducts, useCategories } from "@/lib/hooks";
import { useWishlistStore, useCartStore } from "@/lib/store";
import type { Product } from "@/types";
import { QuickViewDrawer } from "@/components/shop/QuickViewDrawer";

const sortOptions = [
  { label: "Newest First",     value: "newest" },
  { label: "Price: Low → High", value: "price_asc" },
  { label: "Price: High → Low", value: "price_desc" },
  { label: "Top Rated",        value: "rating" },
];

const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

// ─── Product Card ──────────────────────────────────────────────────────────
function ShopProductCard({
  product, index, onQuickView,
}: { product: Product; index: number; onQuickView: (p: Product) => void }) {
  const { toggleItem, isWishlisted } = useWishlistStore();
  const { addItem } = useCartStore();
  const wishlisted = isWishlisted(product.id);
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="group product-card"
    >
      <Link href={`/product/${product.id}`} id={`shop-product-${product.id}`}>
        {/* Image */}
        <div className="product-card__image-wrap">
          {product.images?.[0] && (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover product-card__image-primary"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          )}
          {product.images?.[1] && (
            <Image src={product.images[1]} alt={product.name} fill className="object-cover product-card__image-secondary" sizes="25vw" />
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
            {product.isNew && <span className="badge badge-new">New</span>}
            {discount > 0 && <span className="badge badge-sale">-{discount}%</span>}
            {product.isTrending && <span className="badge badge-trending">Trending</span>}
          </div>

          {/* Hover actions */}
          <div className="product-card__actions">
            <button
              onClick={(e) => { e.preventDefault(); toggleItem(product); }}
              className="product-card__action-btn"
              aria-label="Wishlist"
            >
              <Heart size={14} fill={wishlisted ? "#C4607A" : "none"} color={wishlisted ? "#C4607A" : "#1A1A1A"} />
            </button>
            <button
              onClick={(e) => { e.preventDefault(); onQuickView(product); }}
              className="product-card__action-btn"
              aria-label="Quick view"
            >
              <Eye size={14} />
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
            <ShoppingBag size={11} className="inline mr-1.5 -mt-0.5" />
            Add to Bag
          </button>
        </div>

        {/* Info */}
        <div className="p-3.5">
          <p className="text-[9px] font-poppins text-[#B0B0B0] uppercase tracking-widest mb-1">{product.category}</p>
          <h3 className="text-base font-poppins font-500 text-[#1A1A1A] mb-1.5 group-hover:text-[#C4973A] transition-colors line-clamp-1">
            {product.name}
          </h3>
          <div className="flex items-center gap-1 mb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={9} className={i < Math.floor(product.rating) ? "star-filled" : "star-empty"} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} />
            ))}
            <span className="text-[9px] font-poppins text-[#B0B0B0] ml-0.5">({product.reviewCount})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base font-poppins font-600 text-[#1A1A1A]">₹{product.price.toLocaleString()}</span>
            {product.originalPrice && (
              <span className="text-sm font-poppins text-[#B0B0B0] line-through">₹{product.originalPrice.toLocaleString()}</span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Main Shop Page ────────────────────────────────────────────────────────
export default function ShopPage() {
  const [filterOpen,       setFilterOpen]       = useState(false);
  const [sortOpen,         setSortOpen]         = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSort,     setSelectedSort]     = useState("newest");
  const [selectedSizes,    setSelectedSizes]    = useState<string[]>([]);
  const [priceMax,         setPriceMax]         = useState(30000);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [page,             setPage]             = useState(0);

  const { data: rawProducts, isLoading } = useProducts({
    page,
    size: 12,
    sort: selectedSort,
    category: selectedCategory || undefined,
  });
  const { data: categories } = useCategories();

  const products: Product[] = (rawProducts as any)?.content || [];
  const totalPages: number  = (rawProducts as any)?.totalPages || 1;

  const filtered = products.filter((p) => {
    if (selectedSizes.length > 0 && !p.sizes.some((s) => selectedSizes.includes(s))) return false;
    if (p.price > priceMax) return false;
    return true;
  });

  const toggleSize = (s: string) =>
    setSelectedSizes((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);

  const activeFilters = (selectedCategory ? 1 : 0) + selectedSizes.length + (priceMax < 30000 ? 1 : 0);

  const clearAll = () => {
    setSelectedCategory(null);
    setSelectedSizes([]);
    setPriceMax(30000);
    setPage(0);
  };

  return (
    <>
      {/* Quick View Drawer */}
      <AnimatePresence>
        {quickViewProduct && (
          <QuickViewDrawer
            product={quickViewProduct}
            onClose={() => setQuickViewProduct(null)}
          />
        )}
      </AnimatePresence>

      {/* Page Banner */}
      <section className="py-10 md:py-14 bg-[#FAFAF8] border-b border-[#E8E8E8]">
        <div className="luxury-container text-center">
          <p className="section-label mb-2">Our Store</p>
          <h1 className="text-hero font-playfair text-[#1A1A1A] mb-2">All Collections</h1>
          <p className="text-base font-poppins text-espresso">
            {filtered.length} curated luxury pieces
          </p>
        </div>
      </section>

      <div className="luxury-container py-8">
        {/* Toolbar */}
        <div className="flex items-center justify-between pb-5 mb-6 border-b border-[#E8E8E8]">
          {/* Filter btn */}
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setFilterOpen(!filterOpen)}
              id="shop-filter-toggle"
              className="flex items-center gap-2 px-4 py-2.5 border border-[#E8E8E8] text-sm font-poppins font-600 text-[#1A1A1A] uppercase tracking-wider hover:border-[#1A1A1A] transition-colors"
            >
              <SlidersHorizontal size={14} />
              Filters
              {activeFilters > 0 && (
                <span className="w-5 h-5 bg-[#C4973A] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {activeFilters}
                </span>
              )}
            </motion.button>
            {activeFilters > 0 && (
              <button onClick={clearAll} className="text-sm font-poppins text-espresso hover:text-[#C4607A] transition-colors underline underline-offset-2">
                Clear All
              </button>
            )}
          </div>

          {/* Sort */}
          <div className="relative">
            <button
              id="shop-sort-toggle"
              onClick={() => setSortOpen(!sortOpen)}
              className="flex items-center gap-2 px-4 py-2.5 border border-[#E8E8E8] text-sm font-poppins font-500 text-[#1A1A1A] uppercase tracking-wider hover:border-[#1A1A1A] transition-colors"
            >
              {sortOptions.find(o => o.value === selectedSort)?.label}
              <ChevronDown size={12} className={`transition-transform ${sortOpen ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {sortOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-full mt-1.5 w-52 bg-white border border-[#E8E8E8] shadow-lg z-30"
                >
                  {sortOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => { setSelectedSort(opt.value); setSortOpen(false); setPage(0); }}
                      className={`block w-full text-left px-4 py-3 text-sm font-poppins transition-colors
                        ${selectedSort === opt.value
                          ? "bg-[#FAFAF8] text-[#C4973A] font-600"
                          : "text-[#3D3D3D] hover:bg-[#FAFAF8]"
                        }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex gap-8">
          {/* ─── Sidebar Filters ─── */}
          <AnimatePresence>
            {filterOpen && (
              <motion.aside
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 256 }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                className="flex-shrink-0 overflow-hidden"
              >
                <div className="w-64 pr-6 border-r border-[#E8E8E8]">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-poppins text-base font-700 text-[#1A1A1A] uppercase tracking-wider">Filters</h3>
                    <button onClick={() => setFilterOpen(false)}><X size={16} className="text-[#B0B0B0] hover:text-[#1A1A1A]" /></button>
                  </div>

                  {/* Category */}
                  <div className="mb-7">
                    <h4 className="text-[10px] font-poppins font-700 text-[#B0B0B0] uppercase tracking-[0.18em] mb-3">Category</h4>
                    <div className="space-y-1.5">
                      <button
                        onClick={() => { setSelectedCategory(null); setPage(0); }}
                        className={`block w-full text-left py-1.5 text-base font-poppins transition-colors ${!selectedCategory ? "text-[#C4973A] font-600" : "text-[#3D3D3D] hover:text-[#1A1A1A]"}`}
                      >
                        All Categories
                      </button>
                      {categories?.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => { setSelectedCategory(cat.name); setPage(0); }}
                          className={`block w-full text-left py-1.5 text-base font-poppins transition-colors ${selectedCategory === cat.name ? "text-[#C4973A] font-600" : "text-[#3D3D3D] hover:text-[#1A1A1A]"}`}
                        >
                          {cat.name}
                          <span className="text-[#B0B0B0] text-sm ml-2">({cat.productCount})</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Size */}
                  <div className="mb-7">
                    <h4 className="text-[10px] font-poppins font-700 text-[#B0B0B0] uppercase tracking-[0.18em] mb-3">Size</h4>
                    <div className="flex flex-wrap gap-2">
                      {sizes.map((s) => (
                        <button
                          key={s}
                          onClick={() => toggleSize(s)}
                          className={`size-chip ${selectedSizes.includes(s) ? "selected" : ""}`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-7">
                    <h4 className="text-[10px] font-poppins font-700 text-[#B0B0B0] uppercase tracking-[0.18em] mb-3">Price Range</h4>
                    <input
                      type="range" min={0} max={30000} step={500} value={priceMax}
                      onChange={(e) => setPriceMax(Number(e.target.value))}
                      className="w-full accent-[#C4973A]"
                    />
                    <div className="flex justify-between text-sm font-poppins text-[#B0B0B0] mt-2">
                      <span>₹0</span>
                      <span className="text-[#1A1A1A] font-600">₹{priceMax.toLocaleString()}</span>
                    </div>
                  </div>

                  <button onClick={clearAll} className="w-full py-2.5 border border-[#E8E8E8] text-sm font-poppins font-600 text-espresso hover:border-[#1A1A1A] hover:text-[#1A1A1A] uppercase tracking-wider transition-colors">
                    Clear Filters
                  </button>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* ─── Product Grid ─── */}
          <div className="flex-1 min-w-0">
            {/* Active filter pills */}
            {activeFilters > 0 && (
              <div className="flex flex-wrap gap-2 mb-5">
                {selectedCategory && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F5EBE0] text-sm font-poppins text-[#1A1A1A]">
                    {selectedCategory}
                    <button onClick={() => setSelectedCategory(null)}><X size={11} /></button>
                  </span>
                )}
                {selectedSizes.map((s) => (
                  <span key={s} className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F5EBE0] text-sm font-poppins text-[#1A1A1A]">
                    Size: {s} <button onClick={() => toggleSize(s)}><X size={11} /></button>
                  </span>
                ))}
                {priceMax < 30000 && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F5EBE0] text-sm font-poppins text-[#1A1A1A]">
                    Up to ₹{priceMax.toLocaleString()} <button onClick={() => setPriceMax(30000)}><X size={11} /></button>
                  </span>
                )}
              </div>
            )}

            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i}>
                    <div className="skeleton aspect-[3/4] mb-3" />
                    <div className="skeleton h-3 w-3/4 mb-2" />
                    <div className="skeleton h-3 w-1/2" />
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-24">
                <p className="font-playfair text-3xl text-[#1A1A1A] mb-2">No products found</p>
                <p className="text-base font-poppins text-[#B0B0B0] mb-6">Try adjusting your filters</p>
                <button onClick={clearAll} className="btn btn-primary">Clear Filters</button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
                  {filtered.map((product, i) => (
                    <ShopProductCard
                      key={product.id}
                      product={product}
                      index={i}
                      onQuickView={setQuickViewProduct}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-3 mt-12">
                    <button
                      onClick={() => setPage((p) => Math.max(0, p - 1))}
                      disabled={page === 0}
                      className="btn btn-secondary disabled: px-6 py-2.5 text-sm"
                    >
                      Previous
                    </button>
                    <span className="text-base font-poppins text-espresso">
                      Page {page + 1} of {totalPages}
                    </span>
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                      disabled={page >= totalPages - 1}
                      className="btn btn-primary disabled: px-6 py-2.5 text-sm flex items-center gap-2"
                    >
                      Next <ArrowRight size={12} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
