"use client";

import React, { useState } from "react";
import Link from "next/link";
import { StorefrontLayout } from "@/components/storefront/StorefrontLayout";
import { ManagedImage } from "@/components/common/ManagedImage";
import { ScrollReveal } from "@/components/common/ScrollReveal";
import { useStore } from "@/lib/store-context";
import { formatNpr } from "@/lib/utils";
import { ShoppingBag, ArrowRight } from "lucide-react";

export default function LookbookPage() {
  const { lookbookItems, products, addToCart, getMediaSlot, getLookbookContent } = useStore();
  const [selectedVolume, setSelectedVolume] = useState<string>("ALL");
  const highlightSlot = getMediaSlot("LOOKBOOK_HIGHLIGHT_BANNER");
  const lookbookContent = getLookbookContent();

  const volumes = ["ALL", "CAPSULE 01: STREET ESSENTIALS"];

  const filteredItems =
    selectedVolume === "ALL"
      ? lookbookItems
      : lookbookItems.filter((item) => item.volume === selectedVolume);

  return (
    <StorefrontLayout>
      {/* Editorial Header */}
      <section className="border-b border-luga-border dark:border-luga-darkBorder py-12 sm:py-24 px-4 sm:px-6 text-center bg-luga-surface/40 dark:bg-luga-darkSurface/40">
        <div className="max-w-4xl mx-auto space-y-3">
          <span className="font-mono text-[10px] sm:text-xs tracking-mega uppercase text-luga-crimson dark:text-luga-gold">
            {lookbookContent.lookbookTag}
          </span>
          <h1 className="font-editorial text-3xl sm:text-6xl uppercase tracking-tight text-luga-ink dark:text-luga-darkInk font-light break-words">
            {lookbookContent.lookbookHeading}
          </h1>
          <p className="font-mono text-xs sm:text-sm text-luga-muted dark:text-luga-darkMuted max-w-xl mx-auto leading-relaxed">
            {lookbookContent.lookbookDescription}
          </p>

          {/* Volume Filter Tabs */}
          <div className="pt-6 flex justify-center gap-3 font-mono text-[10px] tracking-ultra uppercase">
            {volumes.map((vol) => (
              <button
                key={vol}
                onClick={() => setSelectedVolume(vol)}
                className={`px-4 py-2 border transition-colors ${
                  selectedVolume === vol
                    ? "bg-luga-ink text-white border-luga-ink dark:bg-luga-darkInk dark:text-black dark:border-luga-darkInk font-bold"
                    : "border-luga-border dark:border-luga-darkBorder hover:border-luga-ink dark:hover:border-luga-darkInk text-luga-ink dark:text-luga-darkInk"
                }`}
              >
                {vol}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Cinematic Lookbook Film Banner */}
      {highlightSlot?.imageUrl && (
        <section className="border-b border-luga-border dark:border-luga-darkBorder bg-black overflow-hidden relative">
          <div className="max-w-[1920px] mx-auto relative aspect-video sm:aspect-[21/9] w-full">
            <ManagedImage
              slotKey="LOOKBOOK_HIGHLIGHT_BANNER"
              aspectRatio="21:9"
              resolution="2560×1100px Cinematic"
              alt={highlightSlot.altText || "Lookbook Film"}
              className="w-full h-full border-none"
              imageClassName="w-full h-full object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />
            <div className="absolute bottom-6 left-6 sm:bottom-12 sm:left-12 z-10 max-w-xl space-y-2 pointer-events-none text-white">
              <span className="font-mono text-[9px] sm:text-[10px] tracking-mega text-luga-gold uppercase">
                {lookbookContent.highlightTag}
              </span>
              <h2 className="font-editorial text-2xl sm:text-4xl uppercase tracking-tight">
                {highlightSlot?.heading || lookbookContent.highlightHeading}
              </h2>
              {(highlightSlot?.subHeading || lookbookContent.highlightDescription) && (
                <p className="font-mono text-xs text-[#A3A09A]">
                  {highlightSlot?.subHeading || lookbookContent.highlightDescription}
                </p>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Lookbook Frames Grid */}
      <section className="max-w-[1920px] mx-auto px-4 sm:px-8 py-16 sm:py-24 space-y-24">
        {filteredItems.map((item, index) => {
          const featuredGarments = products.filter((p) =>
            item.featuredProductIds?.includes(p.id)
          );

          return (
            <div
              key={item.id}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center pb-16 border-b border-luga-border/50 dark:border-luga-darkBorder/50 last:border-none"
            >
              {/* Big Frame Image Slot */}
              <ScrollReveal direction="up" duration={800} className="lg:col-span-8">
                <div className="relative aspect-[16/10] bg-luga-surface dark:bg-luga-darkSurface border border-luga-border dark:border-luga-darkBorder overflow-hidden">
                  <ManagedImage
                    src={item.imageUrl}
                    slotName={`LOOKBOOK_VOL_1_FRAME_${index + 1}`}
                    aspectRatio="16:10"
                    resolution="2000×1250px Editorial"
                    alt={item.title}
                    className="w-full h-full border-none"
                  />
                  <div className="absolute top-4 left-4 font-mono text-[9px] tracking-mega uppercase px-3 py-1 bg-black/80 text-white backdrop-blur-sm border border-white/20">
                    FRAME 0{index + 1} // 35MM
                  </div>
                </div>
              </ScrollReveal>

              {/* Shop the Look Details */}
              <ScrollReveal direction="up" delay={150} duration={800} className="lg:col-span-4 space-y-6">
                <div className="space-y-2">
                  <span className="font-mono text-[10px] tracking-mega uppercase text-luga-crimson dark:text-luga-gold">
                    {item.volume}
                  </span>
                  <h2 className="font-editorial text-2xl sm:text-4xl text-luga-ink dark:text-luga-darkInk uppercase leading-tight break-words">
                    {item.title}
                  </h2>
                  <p className="font-mono text-xs text-luga-muted dark:text-luga-darkMuted leading-relaxed">
                    {item.caption}
                  </p>
                </div>

                {/* Garments inside this frame */}
                <div className="space-y-4 pt-2">
                  <div className="font-mono text-[10px] uppercase tracking-mega text-luga-muted dark:text-luga-darkMuted border-b border-luga-border dark:border-luga-darkBorder pb-2">
                    FEATURED SILHOUETTES ({featuredGarments.length})
                  </div>

                  {featuredGarments.map((garment) => (
                    <div
                      key={garment.id}
                      className="p-4 bg-luga-surface/50 dark:bg-luga-darkSurface/50 border border-luga-border dark:border-luga-darkBorder flex gap-4 items-center justify-between group hover:border-luga-ink dark:hover:border-luga-darkInk transition-colors"
                    >
                      <div className="w-14 h-16 bg-luga-surface dark:bg-luga-darkSurface flex-shrink-0 overflow-hidden">
                        <ManagedImage
                          src={garment.primaryImageUrl}
                          slotName={garment.sku}
                          aspectRatio="4:5"
                          resolution="200×250px"
                          alt={garment.title}
                          showInfo={false}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-editorial text-base text-luga-ink dark:text-luga-darkInk truncate group-hover:underline">
                          <Link href={`/product/${garment.slug}`}>{garment.title}</Link>
                        </h4>
                        <p className="font-mono text-[10px] text-luga-muted dark:text-luga-darkMuted truncate">
                          {garment.fabricGsm}
                        </p>
                        <div className="font-mono text-xs text-luga-crimson dark:text-luga-gold font-semibold mt-1">
                          {formatNpr(garment.priceNpr)}
                        </div>
                      </div>

                      <button
                        onClick={() =>
                          addToCart({
                            productId: garment.id,
                            title: garment.title,
                            slug: garment.slug,
                            size: "M",
                            priceNpr: garment.priceNpr,
                            quantity: 1,
                            primaryImageUrl: garment.primaryImageUrl,
                          })
                        }
                        className="px-3 py-2 bg-luga-ink text-white dark:bg-luga-darkInk dark:text-black font-mono text-[10px] uppercase tracking-wider hover:bg-luga-crimson dark:hover:bg-luga-gold transition-colors"
                        title="Add size M to bag"
                      >
                        + BAG
                      </button>
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-ultra text-luga-ink dark:text-luga-darkInk border-b border-luga-ink dark:border-luga-darkInk pb-1 hover:text-luga-crimson dark:hover:text-luga-gold transition-colors"
                  >
                    <span>EXPLORE ALL PIECES</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </ScrollReveal>
            </div>
          );
        })}
      </section>
    </StorefrontLayout>
  );
}
