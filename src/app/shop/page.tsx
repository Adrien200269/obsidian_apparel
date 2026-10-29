"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { StorefrontLayout } from "@/components/storefront/StorefrontLayout";
import { ProductCard } from "@/components/storefront/ProductCard";
import { ManagedImage } from "@/components/common/ManagedImage";
import { ScrollReveal } from "@/components/common/ScrollReveal";
import { useStore } from "@/lib/store-context";
import { ProductCategory, GarmentSize } from "@/types";
import { formatNpr } from "@/lib/utils";
import { SlidersHorizontal, LayoutGrid, Columns, X } from "lucide-react";

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCat = searchParams.get("category") as ProductCategory | null;

  const { products, collections, getMediaSlot, getShopContent } = useStore();
  const shopContent = getShopContent();

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCat || "all");
  const [selectedCollection, setSelectedCollection] = useState<string>("all");
  const [selectedSize, setSelectedSize] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("featured");
  const [maxPrice, setMaxPrice] = useState<number>(30000);
  const [viewMode, setViewMode] = useState<"grid" | "editorial">("grid");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Category Banner Slot lookup
  const bannerSlotKey =
    selectedCategory === "outerwear"
      ? "CATEGORY_BANNER_OUTERWEAR"
      : selectedCategory === "knitwear"
      ? "CATEGORY_BANNER_KNITWEAR"
      : selectedCategory === "shirts"
      ? "CATEGORY_BANNER_SHIRTS"
      : selectedCategory === "trousers"
      ? "CATEGORY_BANNER_TROUSERS"
      : "HERO_MAIN_BANNER";

  const bannerSlot = getMediaSlot(bannerSlotKey);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (p.isArchived) return false;
      if (selectedCategory !== "all" && p.category !== selectedCategory) return false;
      if (selectedCollection !== "all" && p.collectionId !== selectedCollection) return false;
      if (selectedSize !== "all") {
        const hasSize = p.variants?.some(
          (v) => v.size === selectedSize && v.stockQuantity > 0
        );
        if (!hasSize) return false;
      }
      if (p.priceNpr > maxPrice) return false;
      return true;
    }).sort((a, b) => {
      if (sortBy === "price-asc") return a.priceNpr - b.priceNpr;
      if (sortBy === "price-desc") return b.priceNpr - a.priceNpr;
      if (sortBy === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [products, selectedCategory, selectedCollection, selectedSize, maxPrice, sortBy]);

  const resetFilters = () => {
    setSelectedCategory("all");
    setSelectedCollection("all");
    setSelectedSize("all");
    setMaxPrice(30000);
    setSortBy("featured");
  };

  const hasActiveFilters =
    selectedCategory !== "all" ||
    selectedCollection !== "all" ||
    selectedSize !== "all" ||
    maxPrice < 30000;

  return (
    <StorefrontLayout>
      {/* Category / Archive Header Banner */}
      <section className="relative w-full h-[280px] sm:h-[360px] flex items-center justify-center bg-luga-surface dark:bg-luga-darkSurface border-b border-luga-border dark:border-luga-darkBorder overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <ManagedImage
            slotKey={bannerSlotKey}
            aspectRatio="21:9"
            resolution="2560×1080px"
            alt={bannerSlot?.heading || "Obsidian Apparel Shop Archive"}
            className="w-full h-full border-none"
          />
          <div className="absolute inset-0 bg-black/50 dark:bg-black/60 pointer-events-none" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-3xl text-white space-y-2">
          <span className="font-mono text-[10px] sm:text-xs tracking-mega uppercase text-luga-gold">
            {bannerSlot?.subHeading || shopContent.shopTag}
          </span>
          <h1 className="font-editorial text-4xl sm:text-6xl uppercase tracking-tight font-light">
            {selectedCategory === "outerwear"
              ? shopContent.outerwearHeading
              : selectedCategory === "knitwear"
              ? shopContent.knitwearHeading
              : selectedCategory === "shirts"
              ? shopContent.shirtsHeading
              : selectedCategory === "trousers"
              ? shopContent.trousersHeading
              : (bannerSlot?.heading || shopContent.shopHeading)}
          </h1>
          <p className="font-mono text-xs sm:text-sm text-[#DDD] tracking-wider max-w-xl mx-auto">
            {selectedCategory === "outerwear"
              ? shopContent.outerwearDescription
              : selectedCategory === "knitwear"
              ? shopContent.knitwearDescription
              : selectedCategory === "shirts"
              ? shopContent.shirtsDescription
              : selectedCategory === "trousers"
              ? shopContent.trousersDescription
              : shopContent.shopDescription}
          </p>
        </div>
      </section>

      {/* Main Filter & Products Section */}
      <div className="max-w-[1920px] mx-auto px-4 sm:px-8 py-8 sm:py-12">
        {/* Controls Toolbar */}
        {/* Filter & Sort Action Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-luga-border dark:border-luga-darkBorder font-mono text-xs">
          <div className="flex items-center justify-between gap-3 w-full sm:w-auto">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-3.5 py-2 border border-luga-border dark:border-luga-darkBorder uppercase hover:bg-luga-surface dark:hover:bg-luga-darkSurface transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>FILTERS {hasActiveFilters && "• ACTIVE"}</span>
            </button>

            {/* Result Count */}
            <div className="text-[11px] sm:text-xs text-luga-muted dark:text-luga-darkMuted uppercase tracking-wider">
              SHOWING <strong className="text-luga-ink dark:text-luga-darkInk">{filteredProducts.length}</strong> OF {products.length}
            </div>
          </div>

          {/* Right Toolbar: View Mode + Sort */}
          <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
            {/* View Mode (2-col editorial vs 4-col grid) */}
            <div className="hidden sm:flex items-center border border-luga-border dark:border-luga-darkBorder">
              <button
                onClick={() => setViewMode("editorial")}
                className={`p-1.5 transition-colors ${
                  viewMode === "editorial"
                    ? "bg-luga-ink text-white dark:bg-luga-darkInk dark:text-black"
                    : "text-luga-muted hover:text-luga-ink dark:text-luga-darkMuted dark:hover:text-luga-darkInk"
                }`}
                title="2-Column Editorial View"
              >
                <Columns className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 transition-colors ${
                  viewMode === "grid"
                    ? "bg-luga-ink text-white dark:bg-luga-darkInk dark:text-black"
                    : "text-luga-muted hover:text-luga-ink dark:text-luga-darkMuted dark:hover:text-luga-darkInk"
                }`}
                title="4-Column Archive Grid"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <span className="hidden sm:inline text-luga-muted dark:text-luga-darkMuted uppercase">SORT:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full sm:w-auto bg-transparent border border-luga-border dark:border-luga-darkBorder px-2.5 py-1.5 text-xs font-mono uppercase text-luga-ink dark:text-luga-darkInk focus:outline-none"
              >
                <option value="featured" className="bg-luga-bg dark:bg-luga-darkBg">Featured / Curated</option>
                <option value="newest" className="bg-luga-bg dark:bg-luga-darkBg">Newest Drops</option>
                <option value="price-asc" className="bg-luga-bg dark:bg-luga-darkBg">Price: Low to High</option>
                <option value="price-desc" className="bg-luga-bg dark:bg-luga-darkBg">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Mobile Filter Backdrop */}
        {mobileFilterOpen && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setMobileFilterOpen(false)}
          />
        )}

        {/* Content Layout: Left Sidebar Filters + Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pt-8">
          {/* Filters Rail (Off-canvas Drawer on Mobile, Sticky Column on Desktop) */}
          <aside
            className={`fixed inset-y-0 left-0 z-50 w-full max-w-xs bg-luga-bg dark:bg-luga-darkBg border-r border-luga-border dark:border-luga-darkBorder p-6 overflow-y-auto space-y-8 font-mono text-xs shadow-2xl transition-transform duration-300 lg:static lg:w-auto lg:p-0 lg:shadow-none lg:z-auto lg:translate-x-0 lg:border-none lg:col-span-3 ${
              mobileFilterOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
            }`}
          >
            {/* Mobile Close Header */}
            <div className="flex items-center justify-between lg:hidden border-b border-luga-border dark:border-luga-darkBorder pb-4">
              <span className="font-bold text-xs uppercase tracking-mega text-luga-ink dark:text-luga-darkInk">
                ARCHIVE FILTERS
              </span>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 text-luga-muted hover:text-luga-ink dark:hover:text-luga-darkInk"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="w-full py-2 border border-dashed border-luga-crimson text-luga-crimson dark:border-luga-gold dark:text-luga-gold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-luga-crimson/5 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                <span>RESET ALL FILTERS</span>
              </button>
            )}

            {/* Category Filter */}
            <div className="space-y-3 border-b border-luga-border dark:border-luga-darkBorder pb-6">
              <h4 className="text-[10px] tracking-mega uppercase font-bold text-luga-ink dark:text-luga-darkInk">
                CATEGORIES
              </h4>
              <div className="space-y-1.5">
                {[
                  { id: "all", label: "All Garments" },
                  { id: "outerwear", label: "Outerwear & Coats" },
                  { id: "knitwear", label: "Knitwear & Hoodies" },
                  { id: "shirts", label: "Shirts & Heavy Tees" },
                  { id: "trousers", label: "Trousers & Cargos" },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`block w-full text-left py-1 tracking-wider uppercase transition-colors ${
                      selectedCategory === cat.id
                        ? "text-luga-crimson dark:text-luga-gold font-bold"
                        : "text-luga-muted hover:text-luga-ink dark:text-luga-darkMuted dark:hover:text-luga-darkInk"
                    }`}
                  >
                    • {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Collection / Volume Filter */}
            <div className="space-y-3 border-b border-luga-border dark:border-luga-darkBorder pb-6">
              <h4 className="text-[10px] tracking-mega uppercase font-bold text-luga-ink dark:text-luga-darkInk">
                COLLECTIONS & VOLUMES
              </h4>
              <div className="space-y-1.5">
                <button
                  onClick={() => setSelectedCollection("all")}
                  className={`block w-full text-left py-1 tracking-wider uppercase transition-colors ${
                    selectedCollection === "all"
                      ? "text-luga-crimson dark:text-luga-gold font-bold"
                      : "text-luga-muted hover:text-luga-ink dark:text-luga-darkMuted dark:hover:text-luga-darkInk"
                  }`}
                >
                  • All Volumes
                </button>
                {collections.map((col) => (
                  <button
                    key={col.id}
                    onClick={() => setSelectedCollection(col.id)}
                    className={`block w-full text-left py-1 tracking-wider uppercase transition-colors ${
                      selectedCollection === col.id
                        ? "text-luga-crimson dark:text-luga-gold font-bold"
                        : "text-luga-muted hover:text-luga-ink dark:text-luga-darkMuted dark:hover:text-luga-darkInk"
                    }`}
                  >
                    • {col.volumeNumber}: {col.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Filter */}
            <div className="space-y-3 border-b border-luga-border dark:border-luga-darkBorder pb-6">
              <h4 className="text-[10px] tracking-mega uppercase font-bold text-luga-ink dark:text-luga-darkInk">
                SELECT SIZE
              </h4>
              <div className="grid grid-cols-3 gap-1.5">
                {["all", "XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-2 text-[10px] uppercase border transition-colors ${
                      selectedSize === size
                        ? "bg-luga-ink text-white border-luga-ink dark:bg-luga-darkInk dark:text-black dark:border-luga-darkInk font-bold"
                        : "border-luga-border dark:border-luga-darkBorder hover:border-luga-ink dark:hover:border-luga-darkInk text-luga-ink dark:text-luga-darkInk"
                    }`}
                  >
                    {size === "all" ? "ANY" : size}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter (NPR) */}
            <div className="space-y-3 pb-6">
              <div className="flex justify-between items-center text-[10px] tracking-mega uppercase font-bold text-luga-ink dark:text-luga-darkInk">
                <span>MAX PRICE</span>
                <span className="text-luga-crimson dark:text-luga-gold font-mono">
                  {formatNpr(maxPrice)}
                </span>
              </div>
              <input
                type="range"
                min="4000"
                max="30000"
                step="1000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-luga-crimson dark:accent-luga-gold"
              />
              <div className="flex justify-between text-[9px] text-luga-muted dark:text-luga-darkMuted">
                <span>NPR 4,000</span>
                <span>NPR 30,000</span>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <main className="lg:col-span-9">
            {filteredProducts.length === 0 ? (
              <div className="py-24 text-center space-y-4 border border-dashed border-luga-border dark:border-luga-darkBorder">
                <p className="font-editorial text-2xl sm:text-3xl text-luga-muted dark:text-luga-darkMuted">
                  No garments match the selected filters.
                </p>
                <p className="font-mono text-xs uppercase tracking-widest text-luga-muted">
                  Try widening your price range or clearing category filters.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-2.5 bg-luga-ink text-white dark:bg-luga-darkInk dark:text-black font-mono text-xs uppercase tracking-ultra"
                >
                  RESET FILTERS
                </button>
              </div>
            ) : (
              <div
                className={`grid gap-x-4 sm:gap-x-8 gap-y-10 sm:gap-y-14 ${
                  viewMode === "editorial"
                    ? "grid-cols-1 sm:grid-cols-2"
                    : "grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                }`}
              >
                {filteredProducts.map((product, idx) => (
                  <ScrollReveal
                    key={product.id}
                    direction="up"
                    delay={(idx % (viewMode === "editorial" ? 2 : 4)) * 60}
                    duration={650}
                  >
                    <ProductCard
                      product={product}
                      viewMode={viewMode}
                    />
                  </ScrollReveal>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </StorefrontLayout>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-luga-bg dark:bg-luga-darkBg" />}>
      <ShopContent />
    </Suspense>
  );
}
