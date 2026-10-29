"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/lib/store-context";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import {
  Menu,
  X,
  Search,
  ShoppingBag,
  ShieldCheck,
  ChevronDown,
  ArrowRight,
  Compass,
} from "lucide-react";

export const Header: React.FC = () => {
  const pathname = usePathname();
  const { cartCount, setIsCartOpen, setIsSearchOpen, getMediaSlot, settings, collections } = useStore();
  const [menuDrawerOpen, setMenuDrawerOpen] = useState(false);
  const [collectionsDropdown, setCollectionsDropdown] = useState(false);

  const logoLightSlot = getMediaSlot("BRAND_LOGO_LIGHT");
  const logoDarkSlot = getMediaSlot("BRAND_LOGO_DARK");

  // Close drawer on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && menuDrawerOpen) {
        setMenuDrawerOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [menuDrawerOpen]);

  // Close drawer on route change
  useEffect(() => {
    setMenuDrawerOpen(false);
  }, [pathname]);

  const primaryDesktopLinks = [
    { label: "Shop All", href: "/shop" },
    { label: "Lookbook", href: "/lookbook" },
    { label: "About", href: "/about" },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-luga-bg/95 dark:bg-luga-darkBg/95 backdrop-blur-md border-b border-luga-border/80 dark:border-luga-darkBorder/80 transition-colors">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
          {/* LEFT: Menu Drawer Trigger + Primary Desktop Navigation */}
          <div className="flex-1 flex items-center gap-4 sm:gap-6 min-w-0">
            <button
              onClick={() => setMenuDrawerOpen(true)}
              className="flex items-center gap-2 p-1.5 -ml-1 text-luga-ink dark:text-luga-darkInk hover:text-luga-crimson dark:hover:text-luga-gold transition-colors font-mono text-xs uppercase tracking-ultra"
              aria-label="Open menu drawer"
            >
              <Menu className="w-5 h-5 flex-shrink-0" />
              <span className="hidden sm:inline">MENU</span>
            </button>

            {/* Desktop Primary Nav Links */}
            <nav className="hidden lg:flex items-center gap-5 xl:gap-6 text-[11px] font-mono tracking-ultra uppercase text-luga-muted dark:text-luga-darkMuted whitespace-nowrap">
              {/* Volumes Dropdown */}
              <div
                className="relative py-2 group cursor-pointer"
                onMouseEnter={() => setCollectionsDropdown(true)}
                onMouseLeave={() => setCollectionsDropdown(false)}
              >
                <button className="flex items-center gap-1 hover:text-luga-ink dark:hover:text-luga-darkInk transition-colors">
                  <span>CAPSULES</span>
                  <ChevronDown className="w-3 h-3 transition-transform group-hover:rotate-180" />
                </button>

                {collectionsDropdown && (
                  <div className="absolute top-full left-0 w-64 bg-luga-bg dark:bg-luga-darkBg border border-luga-border dark:border-luga-darkBorder shadow-2xl py-3 z-50 animate-in fade-in slide-in-from-top-1 duration-200">
                    <div className="px-4 py-1 text-[9px] font-mono text-luga-muted/60 dark:text-luga-darkMuted/60 border-b border-luga-border/50 dark:border-luga-darkBorder/50 mb-2">
                      CURATED CAPSULES
                    </div>
                    {collections.map((col) => (
                      <Link
                        key={col.id}
                        href={`/collections/${col.slug}`}
                        onClick={() => setCollectionsDropdown(false)}
                        className="block px-4 py-2 hover:bg-luga-surface dark:hover:bg-luga-darkSurface text-luga-ink dark:text-luga-darkInk text-[10px] tracking-wider uppercase"
                      >
                        {col.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {primaryDesktopLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`hover:text-luga-ink dark:hover:text-luga-darkInk transition-colors ${
                      isActive
                        ? "text-luga-ink dark:text-luga-darkInk font-semibold border-b border-luga-ink dark:border-luga-darkInk pb-0.5"
                        : ""
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* CENTER: Obsidian Apparel Wordmark / Logo (Guaranteed Centered, Protected From Overlap) */}
          <div className="flex-shrink-0 text-center px-1 sm:px-4">
            <Link href="/" className="inline-flex flex-col items-center group">
              {logoDarkSlot?.imageUrl || logoLightSlot?.imageUrl ? (
                <div className="h-7 sm:h-9 flex items-center justify-center">
                  <img
                    src={logoDarkSlot?.imageUrl || logoLightSlot?.imageUrl || ""}
                    alt="Obsidian Apparel"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              ) : (
                <span className="font-editorial text-sm sm:text-2xl lg:text-3xl tracking-[0.18em] sm:tracking-[0.26em] uppercase text-luga-ink dark:text-luga-darkInk font-bold transition-all duration-300 group-hover:tracking-[0.32em] whitespace-nowrap">
                  OBSIDIAN APPAREL
                </span>
              )}
              <span className="font-mono text-[7px] sm:text-[8.5px] tracking-[0.22em] sm:tracking-[0.28em] uppercase text-luga-muted dark:text-luga-darkMuted -mt-0.5 opacity-80 font-light">
                KATHMANDU 2026
              </span>
            </Link>
          </div>

          {/* RIGHT: Currency, Theme Toggle, Search, Admin CMS Link, Cart */}
          <div className="flex-1 flex items-center justify-end gap-2.5 sm:gap-4 min-w-0">
            {/* Currency Indicator */}
            <div className="hidden sm:flex items-center gap-1 font-mono text-[10px] tracking-wider uppercase px-2 py-1 border border-luga-border/80 dark:border-luga-darkBorder/80 text-luga-muted dark:text-luga-darkMuted">
              <span>NPR</span>
              <span className="text-luga-ink dark:text-luga-darkInk font-semibold">रू</span>
            </div>

            {/* Theme Mode Toggle */}
            <ThemeToggle />

            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-luga-ink dark:text-luga-darkInk hover:text-luga-crimson dark:hover:text-luga-gold transition-colors"
              title="Search Archive"
              aria-label="Search garments"
            >
              <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </button>

            {/* Admin CMS Access */}
            <Link
              href="/admin"
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-mono tracking-ultra uppercase border border-luga-border hover:border-luga-ink dark:border-luga-darkBorder dark:hover:border-luga-darkInk text-luga-ink dark:text-luga-darkInk transition-colors"
              title="Open Admin CMS"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-luga-crimson dark:text-luga-gold" />
              <span>CMS</span>
            </Link>

            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-luga-ink dark:text-luga-darkInk hover:text-luga-crimson dark:hover:text-luga-gold transition-colors flex items-center"
              aria-label="Shopping bag"
            >
              <ShoppingBag className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-luga-crimson dark:bg-luga-gold text-white dark:text-black font-mono text-[9px] font-bold flex items-center justify-center rounded-none animate-in zoom-in-75">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* LUXURY EDITORIAL SLIDE-OUT MENU DRAWER */}
      {menuDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMenuDrawerOpen(false)}
          />

          <div className="fixed inset-y-0 left-0 max-w-full flex pr-4 sm:pr-10">
            <div className="w-screen max-w-sm sm:max-w-md bg-luga-bg dark:bg-luga-darkBg border-r border-luga-border dark:border-luga-darkBorder flex flex-col justify-between shadow-2xl transition-transform duration-300">
              {/* Drawer Header */}
              <div className="p-4 sm:p-6 border-b border-luga-border dark:border-luga-darkBorder flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-luga-crimson dark:text-luga-gold animate-spin" style={{ animationDuration: "14s" }} />
                  <span className="font-mono text-xs uppercase tracking-mega text-luga-ink dark:text-luga-darkInk">
                    OBSIDIAN APPAREL DIRECTORY
                  </span>
                </div>
                <button
                  onClick={() => setMenuDrawerOpen(false)}
                  className="p-1 text-luga-muted hover:text-luga-ink dark:text-luga-darkMuted dark:hover:text-luga-darkInk transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 font-mono text-xs">
                {/* Numbered Volumes */}
                <div className="space-y-3">
                  <div className="text-[10px] text-luga-crimson dark:text-luga-gold uppercase tracking-mega pb-1 border-b border-luga-border/50 dark:border-luga-darkBorder/50 font-bold">
                    CAPSULE DROPS
                  </div>
                  <div className="space-y-2">
                    {collections.map((col) => (
                      <Link
                        key={col.id}
                        href={`/collections/${col.slug}`}
                        onClick={() => setMenuDrawerOpen(false)}
                        className="block group py-1"
                      >
                        <div className="text-sm font-editorial text-luga-ink dark:text-luga-darkInk group-hover:text-luga-crimson dark:group-hover:text-luga-gold transition-colors">
                          {col.title}
                        </div>
                        <div className="text-[10px] text-luga-muted line-clamp-1">{col.description}</div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Garment Categories */}
                <div className="space-y-3">
                  <div className="text-[10px] text-luga-crimson dark:text-luga-gold uppercase tracking-mega pb-1 border-b border-luga-border/50 dark:border-luga-darkBorder/50 font-bold">
                    STREETWEAR CATEGORIES
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] tracking-wider uppercase">
                    <Link
                      href="/shop"
                      onClick={() => setMenuDrawerOpen(false)}
                      className="p-2 border border-luga-border dark:border-luga-darkBorder hover:border-luga-ink dark:hover:border-luga-darkInk text-luga-ink dark:text-luga-darkInk transition-colors"
                    >
                      Shop All
                    </Link>
                    <Link
                      href="/shop?category=outerwear"
                      onClick={() => setMenuDrawerOpen(false)}
                      className="p-2 border border-luga-border dark:border-luga-darkBorder hover:border-luga-ink dark:hover:border-luga-darkInk text-luga-ink dark:text-luga-darkInk transition-colors"
                    >
                      Outerwear
                    </Link>
                    <Link
                      href="/shop?category=knitwear"
                      onClick={() => setMenuDrawerOpen(false)}
                      className="p-2 border border-luga-border dark:border-luga-darkBorder hover:border-luga-ink dark:hover:border-luga-darkInk text-luga-ink dark:text-luga-darkInk transition-colors"
                    >
                      Hoodies & Knits
                    </Link>
                    <Link
                      href="/shop?category=shirts"
                      onClick={() => setMenuDrawerOpen(false)}
                      className="p-2 border border-luga-border dark:border-luga-darkBorder hover:border-luga-ink dark:hover:border-luga-darkInk text-luga-ink dark:text-luga-darkInk transition-colors"
                    >
                      Tees & Shirts
                    </Link>
                    <Link
                      href="/shop?category=trousers"
                      onClick={() => setMenuDrawerOpen(false)}
                      className="p-2 border border-luga-border dark:border-luga-darkBorder hover:border-luga-ink dark:hover:border-luga-darkInk text-luga-ink dark:text-luga-darkInk transition-colors"
                    >
                      Cargos & Bottoms
                    </Link>
                    <Link
                      href="/lookbook"
                      onClick={() => setMenuDrawerOpen(false)}
                      className="p-2 border border-luga-border dark:border-luga-darkBorder hover:border-luga-ink dark:hover:border-luga-darkInk text-luga-ink dark:text-luga-darkInk transition-colors"
                    >
                      35mm Lookbook
                    </Link>
                  </div>
                </div>

                {/* Editorial & Atelier */}
                <div className="space-y-3">
                  <div className="text-[10px] text-luga-crimson dark:text-luga-gold uppercase tracking-mega pb-1 border-b border-luga-border/50 dark:border-luga-darkBorder/50 font-bold">
                    BRAND & EDITORIAL
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <Link
                      href="/about"
                      onClick={() => setMenuDrawerOpen(false)}
                      className="block py-1 text-luga-ink dark:text-luga-darkInk hover:underline flex items-center justify-between"
                    >
                      <span>Brand Story & Ethos</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      href="/lookbook"
                      onClick={() => setMenuDrawerOpen(false)}
                      className="block py-1 text-luga-ink dark:text-luga-darkInk hover:underline flex items-center justify-between"
                    >
                      <span>35mm Street Lookbook</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      href="/admin"
                      onClick={() => setMenuDrawerOpen(false)}
                      className="block py-1 text-luga-crimson dark:text-luga-gold hover:underline flex items-center justify-between font-bold"
                    >
                      <span>Admin CMS Portal</span>
                      <ShieldCheck className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="p-6 border-t border-luga-border dark:border-luga-darkBorder bg-luga-surface/50 dark:bg-luga-darkSurface/50 space-y-2 font-mono text-[10px] text-luga-muted">
                <div>KATHMANDU STUDIO // 27.7° N</div>
                <div>CURRENCY: NPR (रू) • CASH ON DELIVERY READY</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
