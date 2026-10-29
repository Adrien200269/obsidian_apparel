"use client";

import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ManagedImage } from "@/components/common/ManagedImage";
import { useStore } from "@/lib/store-context";
import { ShopPageData } from "@/types";
import {
  ShoppingBag,
  Upload,
  Check,
  ExternalLink,
  RotateCcw,
  Video as VideoIcon,
  Image as ImageIcon,
  Save,
  Layers,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { uploadToUploadcare } from "@/lib/uploadcare";
import { getVideoInfo } from "@/lib/video-utils";

export default function AdminShopPage() {
  const {
    getShopContent,
    updateShopContent,
    resetShopContent,
    getMediaSlot,
    updateMediaSlot,
    isSyncing,
  } = useStore();

  const [formData, setFormData] = useState<ShopPageData>(getShopContent());
  const [savedBanner, setSavedBanner] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [uploadingSlot, setUploadingSlot] = useState<string | null>(null);

  const outerwearSlot = getMediaSlot("CATEGORY_BANNER_OUTERWEAR");
  const knitwearSlot = getMediaSlot("CATEGORY_BANNER_KNITWEAR");
  const shirtsSlot = getMediaSlot("CATEGORY_BANNER_SHIRTS");
  const trousersSlot = getMediaSlot("CATEGORY_BANNER_TROUSERS");

  useEffect(() => {
    setFormData(getShopContent());
  }, [getShopContent]);

  const handleFieldChange = (field: keyof ShopPageData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    try {
      await updateShopContent(formData);
      setSavedBanner(true);
      setTimeout(() => setSavedBanner(false), 3500);
    } catch (err) {
      console.error("Save shop page error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    if (confirm("Reset Shop page & Category descriptions to factory defaults?")) {
      await resetShopContent();
      setFormData(getShopContent());
      setSavedBanner(true);
      setTimeout(() => setSavedBanner(false), 3500);
    }
  };

  const handleMediaUpload = async (slotKey: string, file: File) => {
    if (!file) return;
    setUploadingSlot(slotKey);
    try {
      const res = await uploadToUploadcare(file);
      await updateMediaSlot(slotKey, { imageUrl: res.cdnUrl });
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to upload media. Please try again or paste a video/photo URL directly.");
    } finally {
      setUploadingSlot(null);
    }
  };

  const categories = [
    {
      key: "outerwear",
      label: "Outerwear & Coats",
      slotKey: "CATEGORY_BANNER_OUTERWEAR",
      slot: outerwearSlot,
      headingField: "outerwearHeading" as keyof ShopPageData,
      descField: "outerwearDescription" as keyof ShopPageData,
      video: getVideoInfo(outerwearSlot?.imageUrl),
    },
    {
      key: "knitwear",
      label: "Hoodies & French Terry",
      slotKey: "CATEGORY_BANNER_KNITWEAR",
      slot: knitwearSlot,
      headingField: "knitwearHeading" as keyof ShopPageData,
      descField: "knitwearDescription" as keyof ShopPageData,
      video: getVideoInfo(knitwearSlot?.imageUrl),
    },
    {
      key: "shirts",
      label: "Tees & Overshirts",
      slotKey: "CATEGORY_BANNER_SHIRTS",
      slot: shirtsSlot,
      headingField: "shirtsHeading" as keyof ShopPageData,
      descField: "shirtsDescription" as keyof ShopPageData,
      video: getVideoInfo(shirtsSlot?.imageUrl),
    },
    {
      key: "trousers",
      label: "Cargos & Street Bottoms",
      slotKey: "CATEGORY_BANNER_TROUSERS",
      slot: trousersSlot,
      headingField: "trousersHeading" as keyof ShopPageData,
      descField: "trousersDescription" as keyof ShopPageData,
      video: getVideoInfo(trousersSlot?.imageUrl),
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-10 max-w-6xl pb-24">
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-luga-border dark:border-luga-darkBorder pb-6 gap-4">
          <div>
            <div className="flex items-center gap-2 font-mono text-[10px] sm:text-xs tracking-mega uppercase text-luga-crimson dark:text-luga-gold">
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>SHOP & CATALOG CMS // EDITORIAL CONTROL</span>
            </div>
            <h1 className="font-editorial text-3xl sm:text-5xl uppercase tracking-tight text-luga-ink dark:text-luga-darkInk mt-1">
              SHOP ARCHIVE & CATEGORY CMS
            </h1>
            <p className="font-mono text-xs text-luga-muted dark:text-luga-darkMuted mt-1 max-w-2xl leading-relaxed">
              Customize the overarching ready-to-wear catalog header, eyebrow tags, and individual category narrative descriptions & banners.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2.5 border border-luga-border dark:border-luga-darkBorder text-luga-muted dark:text-luga-darkMuted hover:border-luga-crimson hover:text-luga-crimson font-mono text-xs uppercase tracking-wider flex items-center gap-2 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>RESET DEFAULTS</span>
            </button>
            <button
              type="button"
              onClick={() => handleSave()}
              disabled={isSaving}
              className="px-6 py-2.5 bg-luga-ink text-white dark:bg-luga-darkInk dark:text-black font-mono text-xs uppercase tracking-ultra flex items-center gap-2 hover:bg-luga-crimson dark:hover:bg-luga-gold transition-colors shadow-sm disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white dark:border-black border-t-transparent rounded-full animate-spin" />
                  <span>SAVING...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>PUBLISH SHOP CMS</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Success Alert Banner */}
        {savedBanner && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 font-mono text-xs flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="font-bold tracking-wider uppercase">
                SHOP PAGE CONTENT PUBLISHED SUCCESSFULLY TO SUPABASE
              </span>
            </div>
            <a
              href="/shop"
              target="_blank"
              rel="noreferrer"
              className="underline flex items-center gap-1 hover:opacity-80"
            >
              <span>VIEW LIVE SHOP</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-12 font-mono text-xs">
          {/* SECTION 1: GLOBAL SHOP HEADER */}
          <section className="p-6 sm:p-8 bg-luga-bg dark:bg-[#0F0F0F] border border-luga-border dark:border-luga-darkBorder space-y-6">
            <div className="flex items-center gap-2 border-b border-luga-border/50 pb-3">
              <span className="px-2 py-0.5 bg-luga-crimson/10 text-luga-crimson dark:bg-luga-gold/10 dark:text-luga-gold font-bold text-[10px]">
                PART 01
              </span>
              <h2 className="text-sm uppercase tracking-mega font-bold text-luga-ink dark:text-luga-darkInk">
                GLOBAL READY-TO-WEAR ARCHIVE HEADER
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[10px] text-luga-muted uppercase tracking-wider">
                  ARCHIVE EYEBROW METADATA TAG
                </label>
                <input
                  type="text"
                  value={formData.shopTag}
                  onChange={(e) => handleFieldChange("shopTag", e.target.value)}
                  className="w-full bg-transparent border border-luga-border dark:border-luga-darkBorder p-2.5 text-luga-ink dark:text-luga-darkInk focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-luga-muted uppercase tracking-wider">
                  ALL-PRODUCTS MAIN HEADLINE
                </label>
                <input
                  type="text"
                  value={formData.shopHeading}
                  onChange={(e) => handleFieldChange("shopHeading", e.target.value)}
                  className="w-full bg-transparent border border-luga-border dark:border-luga-darkBorder p-2.5 text-luga-ink dark:text-luga-darkInk focus:outline-none font-editorial text-base"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-[10px] text-luga-muted uppercase tracking-wider">
                  GLOBAL ARCHIVE INTRODUCTORY COPY
                </label>
                <textarea
                  rows={2}
                  value={formData.shopDescription}
                  onChange={(e) => handleFieldChange("shopDescription", e.target.value)}
                  className="w-full bg-transparent border border-luga-border dark:border-luga-darkBorder p-2.5 text-luga-ink dark:text-luga-darkInk focus:outline-none leading-relaxed"
                />
              </div>
            </div>
          </section>

          {/* SECTION 2: CATEGORY SPECIFIC HERO BANNERS & DESCRIPTIONS */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 border-b border-luga-border pb-2">
              <span className="px-2 py-0.5 bg-luga-crimson/10 text-luga-crimson dark:bg-luga-gold/10 dark:text-luga-gold font-bold text-[10px]">
                PART 02
              </span>
              <h2 className="text-sm uppercase tracking-mega font-bold text-luga-ink dark:text-luga-darkInk">
                CATEGORY BANNERS & INDIVIDUAL EDITORIAL INTROS
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {categories.map((cat, idx) => (
                <div
                  key={cat.key}
                  className="p-6 bg-luga-bg dark:bg-[#0F0F0F] border border-luga-border dark:border-luga-darkBorder space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-luga-border/50 pb-2">
                    <span className="font-bold text-[11px] uppercase text-luga-crimson dark:text-luga-gold">
                      0{idx + 1} // {cat.label}
                    </span>
                    <span className="text-[9px] text-luga-muted">SLOT: {cat.slotKey}</span>
                  </div>

                  {/* Banner Preview */}
                  <div className="relative aspect-[21/9] bg-black border border-luga-border overflow-hidden">
                    <ManagedImage
                      slotKey={cat.slotKey}
                      aspectRatio="21:9"
                      resolution="2560×1080px"
                      alt={cat.label}
                      className="w-full h-full border-none"
                    />
                    {cat.video.isVideo && (
                      <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/80 text-white text-[9px] flex items-center gap-1 font-mono">
                        <VideoIcon className="w-2.5 h-2.5 text-luga-gold" />
                        <span>{cat.video.providerLabel.toUpperCase()}</span>
                      </div>
                    )}
                  </div>

                  {/* URL & Upload */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-luga-muted uppercase flex items-center justify-between">
                      <span>BANNER MEDIA URL</span>
                      {uploadingSlot === cat.slotKey && (
                        <span className="text-luga-crimson dark:text-luga-gold animate-pulse">
                          UPLOADING...
                        </span>
                      )}
                    </label>
                    <input
                      type="text"
                      value={cat.slot?.imageUrl || ""}
                      onChange={(e) => updateMediaSlot(cat.slotKey, { imageUrl: e.target.value })}
                      placeholder="https://... or /media/... or YouTube/Vimeo"
                      className="w-full bg-transparent border border-luga-border dark:border-luga-darkBorder p-2 text-xs text-luga-ink dark:text-luga-darkInk focus:outline-none"
                    />
                    <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1 border border-dashed border-luga-border hover:border-luga-ink text-luga-muted hover:text-luga-ink text-[10px] uppercase transition-colors">
                      <Upload className="w-3 h-3" />
                      <span>UPLOAD CATEGORY BANNER</span>
                      <input
                        type="file"
                        accept="image/*,video/mp4,video/webm"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleMediaUpload(cat.slotKey, file);
                        }}
                      />
                    </label>
                  </div>

                  {/* Title & Desc */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-luga-muted uppercase">CATEGORY HEADLINE</label>
                    <input
                      type="text"
                      value={formData[cat.headingField] as string}
                      onChange={(e) => handleFieldChange(cat.headingField, e.target.value)}
                      className="w-full bg-transparent border border-luga-border dark:border-luga-darkBorder p-2 text-xs font-editorial text-luga-ink dark:text-luga-darkInk focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-luga-muted uppercase">CATEGORY DESCRIPTION</label>
                    <textarea
                      rows={2}
                      value={formData[cat.descField] as string}
                      onChange={(e) => handleFieldChange(cat.descField, e.target.value)}
                      className="w-full bg-transparent border border-luga-border dark:border-luga-darkBorder p-2 text-xs text-luga-ink dark:text-luga-darkInk focus:outline-none leading-relaxed"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Sticky Bottom Save Actions */}
          <div className="sticky bottom-6 z-30 p-4 bg-luga-surface/95 dark:bg-[#161616]/95 backdrop-blur-md border border-luga-border dark:border-luga-darkBorder flex items-center justify-between shadow-2xl">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] text-luga-muted dark:text-luga-darkMuted">
                {isSyncing ? "Syncing changes to Supabase..." : "Live updates ready for publishing"}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 border border-luga-border hover:border-luga-crimson hover:text-luga-crimson text-xs transition-colors"
              >
                RESET
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2 bg-luga-ink text-white dark:bg-luga-darkInk dark:text-black hover:bg-luga-crimson dark:hover:bg-luga-gold transition-colors font-bold uppercase tracking-wider flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>SAVE & PUBLISH SHOP CMS</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
