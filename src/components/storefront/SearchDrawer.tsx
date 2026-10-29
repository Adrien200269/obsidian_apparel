"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store-context";
import { ManagedImage } from "@/components/common/ManagedImage";
import { formatNpr } from "@/lib/utils";
import { Search, X } from "lucide-react";

export const SearchDrawer: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, products } = useStore();
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const filteredProducts = query.trim()
    ? products.filter(
        (p) =>
          p.title.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase()) ||
          p.fabricGsm?.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-luga-bg/95 dark:bg-luga-darkBg/95 backdrop-blur-md transition-all duration-300">
      {/* Top Header */}
      <div className="w-full border-b border-luga-border dark:border-luga-darkBorder px-6 py-5 flex items-center justify-between">
        <div className="font-mono text-xs tracking-mega uppercase text-luga-muted dark:text-luga-darkMuted">
          OBSIDIAN APPAREL ARCHIVE SEARCH // KATHMANDU
        </div>
        <button
          onClick={() => setIsSearchOpen(false)}
          className="p-2 text-luga-ink dark:text-luga-darkInk hover:text-luga-crimson dark:hover:text-luga-gold transition-colors"
          aria-label="Close search"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Input Field */}
      <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 pt-6 sm:pt-10 pb-4 sm:pb-6">
        <div className="relative flex items-center border-b-2 border-luga-ink dark:border-luga-darkInk pb-3">
          <Search className="w-5 h-5 sm:w-6 sm:h-6 text-luga-muted dark:text-luga-darkMuted mr-3 sm:mr-4 flex-shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="SEARCH GARMENTS, GSM, OR WEAVE..."
            className="w-full bg-transparent font-editorial text-lg sm:text-2xl md:text-3xl text-luga-ink dark:text-luga-darkInk placeholder:text-luga-muted/50 dark:placeholder:text-luga-darkMuted/40 focus:outline-none"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="font-mono text-xs text-luga-muted hover:text-luga-ink dark:text-luga-darkMuted dark:hover:text-luga-darkInk"
            >
              CLEAR
            </button>
          )}
        </div>

        {/* Quick Search Chips */}
        <div className="mt-4 flex flex-wrap gap-2 text-[10px] font-mono tracking-wider uppercase text-luga-muted dark:text-luga-darkMuted">
          <span className="py-1">POPULAR:</span>
          {["Hoodie", "Boxy Tee", "French Terry", "460 GSM", "Cargo Pants", "Overshirt"].map(
            (tag) => (
              <button
                key={tag}
                onClick={() => setQuery(tag)}
                className="px-2.5 py-1 border border-luga-border dark:border-luga-darkBorder hover:border-luga-ink dark:hover:border-luga-darkInk text-luga-ink dark:text-luga-darkInk transition-colors"
              >
                {tag}
              </button>
            )
          )}
        </div>
      </div>

      {/* Search Results */}
      <div className="flex-1 overflow-y-auto px-6 py-6 max-w-5xl w-full mx-auto">
        {query.trim() && (
          <div className="mb-6 font-mono text-xs tracking-wider text-luga-muted dark:text-luga-darkMuted">
            FOUND {filteredProducts.length} GARMENT{filteredProducts.length === 1 ? "" : "S"} FOR &quot;{query}&quot;
          </div>
        )}

        {query.trim() && filteredProducts.length === 0 && (
          <div className="text-center py-16 text-luga-muted dark:text-luga-darkMuted font-editorial text-xl">
            No streetwear garments match your query. Try searching for &quot;Hoodie&quot;, &quot;Boxy Tee&quot;, or &quot;Cargo&quot;.
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.slug}`}
              onClick={() => setIsSearchOpen(false)}
              className="group block"
            >
              <div className="relative mb-3 aspect-[4/5] overflow-hidden bg-luga-surface dark:bg-luga-darkSurface">
                <ManagedImage
                  src={product.primaryImageUrl}
                  slotName={`SEARCH_${product.sku}`}
                  aspectRatio="4:5"
                  resolution="800×1000px"
                  alt={product.title}
                />
              </div>
              <div className="font-mono text-[9px] uppercase tracking-wider text-luga-muted dark:text-luga-darkMuted mb-1">
                {product.category} • {product.sku}
              </div>
              <h4 className="font-editorial text-base sm:text-lg text-luga-ink dark:text-luga-darkInk group-hover:text-luga-crimson dark:group-hover:text-luga-gold transition-colors leading-snug">
                {product.title}
              </h4>
              <div className="mt-1 font-mono text-xs text-luga-ink dark:text-luga-darkInk font-medium">
                {formatNpr(product.priceNpr)}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
