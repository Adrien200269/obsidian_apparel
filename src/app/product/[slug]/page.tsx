"use client";

import React, { useState } from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import { StorefrontLayout } from "@/components/storefront/StorefrontLayout";
import { ManagedImage } from "@/components/common/ManagedImage";
import { ProductCard } from "@/components/storefront/ProductCard";
import { ScrollReveal } from "@/components/common/ScrollReveal";
import { useStore } from "@/lib/store-context";
import { GarmentSize } from "@/types";
import { formatNpr } from "@/lib/utils";
import {
  ChevronDown,
  Ruler,
  Truck,
  Shield,
  MessageCircle,
  Share2,
  Check,
  Sparkles,
  ArrowRight,
  Compass,
  X,
} from "lucide-react";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { getProductBySlug, products, addToCart, settings } = useStore();

  const product = getProductBySlug(slug);

  const [selectedSize, setSelectedSize] = useState<GarmentSize>("M");
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [isAdded, setIsAdded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [sizeModalOpen, setSizeModalOpen] = useState(false);

  // Accordion states
  const [openAccordion, setOpenAccordion] = useState<string>("story");

  if (!product) {
    return (
      <StorefrontLayout>
        <div className="max-w-4xl mx-auto py-32 px-6 text-center space-y-4">
          <h1 className="font-editorial text-4xl text-luga-ink dark:text-luga-darkInk">
            Garment Archive Not Found
          </h1>
          <p className="font-mono text-xs text-luga-muted dark:text-luga-darkMuted uppercase tracking-wider">
            This garment may have been archived or is awaiting publication.
          </p>
          <Link
            href="/shop"
            className="inline-block px-6 py-3 bg-luga-ink text-white dark:bg-luga-darkInk dark:text-black font-mono text-xs uppercase tracking-ultra"
          >
            RETURN TO ARCHIVE
          </Link>
        </div>
      </StorefrontLayout>
    );
  }

  // Multi-slot gallery array (Front, Back, Detail/Macro, Fit Reference)
  const galleryImages = [
    { src: product.primaryImageUrl, label: "01 // FRONT SILHOUETTE", slotName: `${product.sku}_FRONT` },
    { src: product.hoverImageUrl, label: "02 // REVERSE DRAPE", slotName: `${product.sku}_BACK` },
    ...(product.galleryUrls && product.galleryUrls.length > 0
      ? product.galleryUrls.map((url, i) => ({
          src: url,
          label: `0${i + 3} // DETAIL MACRO`,
          slotName: `${product.sku}_DETAIL_0${i + 1}`,
        }))
      : [
          { src: null, label: "03 // DETAIL & WEAVE MACRO", slotName: `${product.sku}_FABRIC_DETAIL` },
          { src: null, label: "04 // FIT & MOVEMENT ARCHIVE", slotName: `${product.sku}_FIT_REFERENCE` },
        ]),
  ];

  const currentVariant = product.variants?.find((v) => v.size === selectedSize);
  const isOutOfStock = currentVariant ? currentVariant.stockQuantity <= 0 : false;

  const handleAddToCart = () => {
    if (isAdding) return;
    setIsAdding(true);
    setTimeout(() => {
      addToCart({
        productId: product.id,
        title: product.title,
        slug: product.slug,
        size: selectedSize,
        priceNpr: product.priceNpr,
        quantity: 1,
        primaryImageUrl: product.primaryImageUrl,
        fabricGsm: product.fabricGsm,
      });
      setIsAdding(false);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
    }, 350);
  };

  // WhatsApp Concierge message pre-fill
  const waText = encodeURIComponent(
    `Namaste Obsidian Apparel! I am interested in acquiring "${product.title}" (${product.sku}) in Size ${selectedSize} for ${formatNpr(product.priceNpr)}. Could you assist me with sizing and Kathmandu delivery?`
  );
  const waUrl = `https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, "")}?text=${waText}`;

  // Related products
  const relatedProducts = products
    .filter((p) => p.id !== product.id && (p.category === product.category || p.collectionId === product.collectionId))
    .slice(0, 4);

  return (
    <StorefrontLayout>
      {/* Breadcrumb Micro-bar */}
      <div className="max-w-[1920px] mx-auto px-4 sm:px-8 py-3 sm:py-4 border-b border-luga-border/60 dark:border-luga-darkBorder/60 font-mono text-[9px] sm:text-[10px] tracking-wider uppercase text-luga-muted dark:text-luga-darkMuted flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar whitespace-nowrap">
        <Link href="/" className="hover:text-luga-ink dark:hover:text-luga-darkInk shrink-0">OBSIDIAN APPAREL</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-luga-ink dark:hover:text-luga-darkInk shrink-0">ARCHIVE</Link>
        <span>/</span>
        <Link href={`/shop?category=${product.category}`} className="hover:text-luga-ink dark:hover:text-luga-darkInk shrink-0">{product.category}</Link>
        <span>/</span>
        <span className="text-luga-ink dark:text-luga-darkInk font-semibold truncate">{product.title}</span>
      </div>

      <div className="max-w-[1920px] mx-auto px-4 sm:px-8 py-8 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          {/* LEFT: Multi-slot Vertical Editorial Image Gallery */}
          <div className="lg:col-span-7 space-y-4">
            {/* Main Selected Image */}
            <div className="relative aspect-[4/5] bg-luga-surface dark:bg-luga-darkSurface border border-luga-border dark:border-luga-darkBorder overflow-hidden">
              <ManagedImage
                src={galleryImages[selectedImageIdx]?.src}
                slotName={galleryImages[selectedImageIdx]?.slotName}
                aspectRatio="4:5"
                resolution="1200×1500px"
                alt={`${product.title} - ${galleryImages[selectedImageIdx]?.label}`}
                className="w-full h-full border-none"
                priority
              />
              <div className="absolute top-4 left-4 font-mono text-[9px] tracking-mega uppercase px-2.5 py-1 bg-black/75 text-white backdrop-blur-sm border border-white/20">
                {galleryImages[selectedImageIdx]?.label}
              </div>
            </div>

            {/* Thumbnail Gallery Row */}
            <div className="grid grid-cols-4 gap-3">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIdx(idx)}
                  className={`relative aspect-[4/5] bg-luga-surface dark:bg-luga-darkSurface border transition-all ${
                    selectedImageIdx === idx
                      ? "border-luga-ink dark:border-luga-darkInk ring-2 ring-luga-crimson dark:ring-luga-gold"
                      : "border-luga-border dark:border-luga-darkBorder opacity-70 hover:opacity-100"
                  }`}
                >
                  <ManagedImage
                    src={img.src}
                    slotName={img.slotName}
                    aspectRatio="4:5"
                    resolution="300×400px"
                    alt={`${product.title} thumb ${idx}`}
                    showInfo={false}
                    className="w-full h-full border-none"
                  />
                  <div className="absolute bottom-1 inset-x-1 text-center font-mono text-[8px] tracking-wider text-black dark:text-white bg-white/80 dark:bg-black/80 truncate">
                    0{idx + 1}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: Sticky Product Details Rail */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div className="space-y-6 lg:sticky lg:top-28">
              {/* Collection & SKU info */}
              <div className="space-y-1">
                <div className="flex items-center justify-between font-mono text-[10px] tracking-mega uppercase text-luga-crimson dark:text-luga-gold">
                  <span>{product.collectionTitle || "VOLUME I: KATHMANDU ARCHIVE"}</span>
                  <span className="text-luga-muted dark:text-luga-darkMuted font-mono">
                    SKU: {product.sku}
                  </span>
                </div>
                <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl text-luga-ink dark:text-luga-darkInk leading-tight font-normal">
                  {product.title}
                </h1>
              </div>

              {/* Price in NPR */}
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 sm:gap-3 border-y border-luga-border/70 dark:border-luga-darkBorder/70 py-4">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-2xl font-semibold text-luga-ink dark:text-luga-darkInk">
                    {formatNpr(product.priceNpr)}
                  </span>
                  {product.compareAtPriceNpr && (
                    <span className="font-mono text-sm text-luga-muted line-through">
                      {formatNpr(product.compareAtPriceNpr)}
                    </span>
                  )}
                </div>
                <span className="font-mono text-[10px] tracking-wider uppercase text-emerald-600 dark:text-emerald-400">
                  TAX INCLUDED • COMPLIMENTARY LOCAL SHIPPING
                </span>
              </div>

              {/* Fabric & GSM Badge */}
              {product.fabricGsm && (
                <div className="p-3 bg-luga-surface dark:bg-luga-darkSurface border border-luga-border/80 dark:border-luga-darkBorder/80 flex items-center gap-2.5 font-mono text-xs text-luga-ink dark:text-luga-darkInk">
                  <Sparkles className="w-4 h-4 text-luga-crimson dark:text-luga-gold flex-shrink-0" />
                  <span className="tracking-wider">{product.fabricGsm}</span>
                </div>
              )}

              {/* Size Selector + Nepal Size Guide */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
                  <span className="uppercase tracking-wider text-luga-muted dark:text-luga-darkMuted">
                    SELECT SIZE: <strong className="text-luga-ink dark:text-luga-darkInk">{selectedSize}</strong>
                  </span>
                  <button
                    onClick={() => setSizeModalOpen(true)}
                    className="flex items-center gap-1 text-luga-crimson dark:text-luga-gold hover:underline uppercase text-[11px] tracking-wider shrink-0"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    <span>NEPAL SIZE GUIDE</span>
                  </button>
                </div>

                <div className="grid grid-cols-6 gap-2">
                  {(["XS", "S", "M", "L", "XL", "XXL"] as GarmentSize[]).map((size) => {
                    const variant = product.variants?.find((v) => v.size === size);
                    const stock = variant?.stockQuantity ?? 10;
                    const isSelected = selectedSize === size;

                    return (
                      <button
                        key={size}
                        disabled={stock <= 0}
                        onClick={() => setSelectedSize(size)}
                        className={`py-3 font-mono text-xs uppercase border transition-all ${
                          isSelected
                            ? "bg-luga-ink text-white border-luga-ink dark:bg-luga-darkInk dark:text-black dark:border-luga-darkInk font-bold shadow-sm"
                            : stock <= 0
                            ? "opacity-30 cursor-not-allowed border-dashed border-luga-border dark:border-luga-darkBorder line-through"
                            : "border-luga-border dark:border-luga-darkBorder hover:border-luga-ink dark:hover:border-luga-darkInk text-luga-ink dark:text-luga-darkInk"
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>

                <div className="font-mono text-[10px] text-luga-muted dark:text-luga-darkMuted flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span>
                    {isOutOfStock ? "CURRENTLY OUT OF STOCK" : "IN STOCK • DISPATCHES WITHIN 24 HOURS IN KTM"}
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400">
                    MADE IN PATAN ATELIER
                  </span>
                </div>
              </div>

              {/* Action Buttons: Add to Bag + WhatsApp Concierge */}
              <div className="space-y-3 pt-2">
                <button
                  disabled={isOutOfStock || isAdding}
                  onClick={handleAddToCart}
                  className={`w-full py-4 px-4 font-mono text-xs uppercase tracking-ultra flex items-center justify-center gap-3 transition-colors duration-300 relative overflow-hidden ${
                    isOutOfStock
                      ? "bg-luga-surface dark:bg-luga-darkSurface text-luga-muted cursor-not-allowed border border-luga-border dark:border-luga-darkBorder"
                      : isAdded
                      ? "bg-emerald-600 text-white"
                      : isAdding
                      ? "bg-luga-crimson text-white dark:bg-luga-gold dark:text-black cursor-wait"
                      : "bg-luga-ink text-white dark:bg-luga-darkInk dark:text-black hover:bg-luga-crimson dark:hover:bg-luga-gold"
                  }`}
                >
                  {isAdding ? (
                    <>
                      <Compass className="w-4 h-4 animate-spin-slow text-white dark:text-black stroke-[1.5]" />
                      <span>ACQUIRING ARCHIVAL FORM...</span>
                    </>
                  ) : isAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>ADDED TO BAG</span>
                    </>
                  ) : (
                    <>
                      <span>{isOutOfStock ? "SOLD OUT" : `ADD TO BAG • ${formatNpr(product.priceNpr)}`}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <a
                  href={waUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3.5 px-3 border border-luga-border hover:border-luga-ink dark:border-luga-darkBorder dark:hover:border-luga-darkInk font-mono text-[11px] sm:text-xs uppercase tracking-ultra flex items-center justify-center gap-2 text-luga-ink dark:text-luga-darkInk hover:bg-luga-surface dark:hover:bg-luga-darkSurface transition-colors text-center"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>ORDER VIA WHATSAPP CONCIERGE</span>
                </a>
              </div>

              {/* Accordion Tabs */}
              <div className="border-t border-luga-border dark:border-luga-darkBorder pt-4 space-y-2 font-mono text-xs">
                {/* 1. Craftsmanship */}
                <div className="border-b border-luga-border/60 dark:border-luga-darkBorder/60 pb-3">
                  <button
                    onClick={() => setOpenAccordion(openAccordion === "story" ? "" : "story")}
                    className="w-full flex items-center justify-between py-2 text-left uppercase tracking-wider font-semibold text-luga-ink dark:text-luga-darkInk"
                  >
                    <span>THE STORY & CRAFTSMANSHIP</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${openAccordion === "story" ? "rotate-180" : ""}`} />
                  </button>
                  {openAccordion === "story" && (
                    <div className="pt-2 text-luga-muted dark:text-luga-darkMuted leading-relaxed space-y-2 text-[11px]">
                      <p>{product.description}</p>
                      {product.craftStory && (
                        <p className="border-l-2 border-luga-crimson dark:border-luga-gold pl-3 italic">
                          {product.craftStory}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* 2. Fabric & GSM Specs */}
                <div className="border-b border-luga-border/60 dark:border-luga-darkBorder/60 pb-3">
                  <button
                    onClick={() => setOpenAccordion(openAccordion === "fabric" ? "" : "fabric")}
                    className="w-full flex items-center justify-between py-2 text-left uppercase tracking-wider font-semibold text-luga-ink dark:text-luga-darkInk"
                  >
                    <span>FABRIC & GSM SPECIFICATIONS</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${openAccordion === "fabric" ? "rotate-180" : ""}`} />
                  </button>
                  {openAccordion === "fabric" && (
                    <div className="pt-2 text-luga-muted dark:text-luga-darkMuted leading-relaxed space-y-2 text-[11px]">
                      <p><strong>Weight:</strong> {product.fabricGsm || "420 GSM French Terry"}</p>
                      <p><strong>Dye Process:</strong> Hand-dyed using organic vegetable pigments and mineral wash in Lalitpur.</p>
                      <p><strong>Hardware:</strong> Custom antiqued brass or matte gunmetal trims made by Patan metalsmiths.</p>
                      <p><strong>Origin:</strong> 100% Sourced, Spun & Assembled in Nepal.</p>
                    </div>
                  )}
                </div>

                {/* 3. Garment Care */}
                <div className="border-b border-luga-border/60 dark:border-luga-darkBorder/60 pb-3">
                  <button
                    onClick={() => setOpenAccordion(openAccordion === "care" ? "" : "care")}
                    className="w-full flex items-center justify-between py-2 text-left uppercase tracking-wider font-semibold text-luga-ink dark:text-luga-darkInk"
                  >
                    <span>GARMENT CARE & LONGEVITY</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${openAccordion === "care" ? "rotate-180" : ""}`} />
                  </button>
                  {openAccordion === "care" && (
                    <div className="pt-2 text-luga-muted dark:text-luga-darkMuted leading-relaxed space-y-1.5 text-[11px]">
                      <p>• Cold hand wash or delicate cycle inside out with neutral detergent.</p>
                      <p>• Do not tumble dry. Flat dry in shade to preserve fleece density and shape.</p>
                      <p>• Steam iron on reverse at low heat. Do not iron directly on graphic prints or trims.</p>
                    </div>
                  )}
                </div>

                {/* 4. Nepal & Domestic Delivery Info */}
                <div className="border-b border-luga-border/60 dark:border-luga-darkBorder/60 pb-3">
                  <button
                    onClick={() => setOpenAccordion(openAccordion === "delivery" ? "" : "delivery")}
                    className="w-full flex items-center justify-between py-2 text-left uppercase tracking-wider font-semibold text-luga-ink dark:text-luga-darkInk"
                  >
                    <span>NEPAL DELIVERY & PAYMENT TERMS</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${openAccordion === "delivery" ? "rotate-180" : ""}`} />
                  </button>
                  {openAccordion === "delivery" && (
                    <div className="pt-2 text-luga-muted dark:text-luga-darkMuted leading-relaxed space-y-1.5 text-[11px]">
                      <p>• <strong>Inside Ring Road:</strong> NPR 100 (Complimentary over NPR 10,000). Delivered within 24–48 hours.</p>
                      <p>• <strong>Outside Ring Road:</strong> NPR 150. Delivered within 48 hours.</p>
                      <p>• <strong>Outside Valley Courier:</strong> NPR 250 (Pokhara, Biratnagar, Chitwan, Dharan, Butwal, etc.). 2–4 business days.</p>
                      <p>• <strong>Payments Accepted:</strong> Cash on Delivery (COD), eSewa, Khalti, and Fonepay QR.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RELATED GARMENTS SECTION */}
        {relatedProducts.length > 0 && (
          <ScrollReveal direction="up" className="mt-24 sm:mt-32 pt-12 border-t border-luga-border dark:border-luga-darkBorder">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-editorial text-2xl sm:text-3xl uppercase tracking-tight text-luga-ink dark:text-luga-darkInk">
                YOU MAY ALSO APPRECIATE
              </h3>
              <Link
                href="/shop"
                className="font-mono text-xs uppercase tracking-ultra text-luga-muted hover:text-luga-ink dark:text-luga-darkMuted dark:hover:text-luga-darkInk"
              >
                VIEW ARCHIVE →
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 sm:gap-x-8 gap-y-10">
              {relatedProducts.map((p, idx) => (
                <ScrollReveal key={p.id} direction="up" delay={idx * 80} duration={650}>
                  <ProductCard product={p} />
                </ScrollReveal>
              ))}
            </div>
          </ScrollReveal>
        )}
      </div>

      {/* NEPAL SIZE GUIDE MODAL */}
      {sizeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-luga-bg dark:bg-luga-darkBg border border-luga-border dark:border-luga-darkBorder max-w-2xl w-full max-h-[90vh] overflow-y-auto p-5 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setSizeModalOpen(false)}
              className="absolute top-4 right-4 text-luga-muted hover:text-luga-ink dark:text-luga-darkMuted dark:hover:text-luga-darkInk"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="font-mono text-[10px] tracking-mega uppercase text-luga-crimson dark:text-luga-gold">
              OBSIDIAN APPAREL SPECIFICATIONS
            </span>
            <h3 className="font-editorial text-2xl sm:text-3xl uppercase tracking-tight text-luga-ink dark:text-luga-darkInk mt-1 mb-2">
              NEPAL & GLOBAL FIT GUIDE
            </h3>
            <p className="font-mono text-xs text-luga-muted dark:text-luga-darkMuted mb-6 leading-relaxed">
              All Obsidian Apparel streetwear pieces are designed in an intentional relaxed, dropped-shoulder unisex boxy fit. Order your true size for a clean modern street drape, or size up for an exaggerated oversized look.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs border border-luga-border dark:border-luga-darkBorder">
                <thead>
                  <tr className="bg-luga-surface dark:bg-luga-darkSurface border-b border-luga-border dark:border-luga-darkBorder">
                    <th className="p-3">SIZE</th>
                    <th className="p-3">CHEST (IN / CM)</th>
                    <th className="p-3">LENGTH (IN / CM)</th>
                    <th className="p-3">SHOULDER (IN / CM)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-luga-border/50 dark:divide-luga-darkBorder/50">
                  <tr>
                    <td className="p-3 font-bold">XS</td>
                    <td className="p-3">40 in / 102 cm</td>
                    <td className="p-3">27 in / 68 cm</td>
                    <td className="p-3">20 in / 51 cm</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold">S</td>
                    <td className="p-3">42 in / 107 cm</td>
                    <td className="p-3">28 in / 71 cm</td>
                    <td className="p-3">21 in / 53 cm</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold">M</td>
                    <td className="p-3">44 in / 112 cm</td>
                    <td className="p-3">29 in / 74 cm</td>
                    <td className="p-3">22 in / 56 cm</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold">L</td>
                    <td className="p-3">46 in / 117 cm</td>
                    <td className="p-3">30 in / 76 cm</td>
                    <td className="p-3">23 in / 58 cm</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold">XL</td>
                    <td className="p-3">48 in / 122 cm</td>
                    <td className="p-3">31 in / 79 cm</td>
                    <td className="p-3">24 in / 61 cm</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold">XXL</td>
                    <td className="p-3">50 in / 127 cm</td>
                    <td className="p-3">32 in / 81 cm</td>
                    <td className="p-3">25 in / 64 cm</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-6 pt-4 border-t border-luga-border dark:border-luga-darkBorder flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-mono text-[11px] text-luga-muted">
              <span>Need custom Patan tailoring?</span>
              <a
                href={waUrl}
                target="_blank"
                rel="noreferrer"
                className="text-luga-crimson dark:text-luga-gold hover:underline uppercase"
              >
                Inquire via WhatsApp Concierge →
              </a>
            </div>
          </div>
        </div>
      )}
    </StorefrontLayout>
  );
}
