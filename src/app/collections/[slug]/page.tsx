"use client";

import React from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import { StorefrontLayout } from "@/components/storefront/StorefrontLayout";
import { ProductCard } from "@/components/storefront/ProductCard";
import { ManagedImage } from "@/components/common/ManagedImage";
import { ScrollReveal } from "@/components/common/ScrollReveal";
import { useStore } from "@/lib/store-context";
import { ArrowLeft, Compass, Play } from "lucide-react";
import { getVideoInfo } from "@/lib/video-utils";

export default function CollectionDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { collections, products, getMediaSlot } = useStore();

  const collection = collections.find((c) => c.slug === slug);

  if (!collection) {
    return (
      <StorefrontLayout>
        <div className="max-w-4xl mx-auto py-32 px-6 text-center space-y-4">
          <h1 className="font-editorial text-4xl text-luga-ink dark:text-luga-darkInk">
            Capsule Drop Not Found
          </h1>
          <p className="font-mono text-xs text-luga-muted dark:text-luga-darkMuted uppercase tracking-wider">
            The requested streetwear capsule has not been released or has been archived.
          </p>
          <Link
            href="/shop"
            className="inline-block px-6 py-3 bg-luga-ink text-white dark:bg-luga-darkInk dark:text-black font-mono text-xs uppercase tracking-ultra"
          >
            RETURN TO SHOP
          </Link>
        </div>
      </StorefrontLayout>
    );
  }

  const collectionProducts = products.filter(
    (p) => p.collectionId === collection.id && !p.isArchived
  );

  const resolvedMedia = collection.coverImageUrl || (collection.coverSlotKey ? getMediaSlot(collection.coverSlotKey)?.imageUrl : undefined);
  const videoInfo = getVideoInfo(resolvedMedia);

  return (
    <StorefrontLayout>
      {/* Editorial Volume Header */}
      <section className="relative w-full min-h-[50vh] sm:min-h-[60vh] flex flex-col justify-end bg-luga-surface dark:bg-luga-darkSurface border-b border-luga-border dark:border-luga-darkBorder overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <ManagedImage
            src={resolvedMedia}
            slotKey={collection.coverSlotKey || `COLLECTION_${collection.id}`}
            aspectRatio="16:9"
            resolution="2560×1440px"
            alt={collection.title}
            className="w-full h-full border-none"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none" />
        </div>

        <div className="relative z-10 max-w-[1920px] mx-auto px-4 sm:px-12 py-10 lg:py-16 text-white space-y-3 w-full">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 font-mono text-[10px] tracking-mega uppercase text-luga-gold hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>BACK TO ALL STREETWEAR</span>
          </Link>

          <div className="flex flex-wrap items-center gap-2 font-mono text-xs tracking-mega uppercase text-luga-gold">
            <span className="flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" />
              <span>{collection.volumeNumber} // LIMITED DROP</span>
            </span>
            {videoInfo.isVideo && (
              <span className="px-2 py-0.5 bg-black/75 border border-white/20 text-[9px] text-white flex items-center gap-1 shadow-sm">
                <Play className="w-2.5 h-2.5 text-luga-gold fill-luga-gold" />
                <span>CINEMATIC FILM ({videoInfo.providerLabel.toUpperCase()})</span>
              </span>
            )}
          </div>

          <h1 className="font-editorial text-3xl sm:text-6xl lg:text-7xl uppercase tracking-tight font-light break-words">
            {collection.title}
          </h1>

          <p className="font-mono text-xs sm:text-sm text-[#DDD] tracking-wider max-w-2xl leading-relaxed">
            {collection.description}
          </p>
        </div>
      </section>

      {/* Collection Products */}
      <section className="max-w-[1920px] mx-auto px-4 sm:px-8 py-10 sm:py-24">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-luga-border dark:border-luga-darkBorder pb-4 mb-8 sm:mb-10 font-mono text-xs gap-1">
          <span className="uppercase tracking-wider text-luga-muted dark:text-luga-darkMuted">
            {collectionProducts.length} GARMENTS IN THIS CAPSULE
          </span>
          <span className="text-luga-crimson dark:text-luga-gold uppercase tracking-mega">
            KATHMANDU STUDIO // 27.7° N
          </span>
        </div>

        {collectionProducts.length === 0 ? (
          <div className="py-20 text-center text-luga-muted dark:text-luga-darkMuted font-editorial text-2xl">
            Garments for this capsule are currently in production. Check back soon.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 sm:gap-x-8 gap-y-10 sm:gap-y-14">
            {collectionProducts.map((product, idx) => (
              <ScrollReveal key={product.id} direction="up" delay={(idx % 4) * 70} duration={650}>
                <ProductCard product={product} />
              </ScrollReveal>
            ))}
          </div>
        )}
      </section>
    </StorefrontLayout>
  );
}
