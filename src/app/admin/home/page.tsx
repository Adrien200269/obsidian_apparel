"use client";

import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ManagedImage } from "@/components/common/ManagedImage";
import { useStore } from "@/lib/store-context";
import { HomePageData } from "@/types";
import {
  Compass,
  Sparkles,
  Upload,
  Check,
  ExternalLink,
  RotateCcw,
  Video as VideoIcon,
  Image as ImageIcon,
  Save,
  Layers,
  ArrowRight,
  Film,
  Grid,
  BookOpen,
} from "lucide-react";
import { uploadToUploadcare } from "@/lib/uploadcare";
import { getVideoInfo } from "@/lib/video-utils";

export default function AdminHomePage() {
  const {
    getHomePageContent,
    updateHomePageContent,
    resetHomePageContent,
    getMediaSlot,
    updateMediaSlot,
    isSyncing,
  } = useStore();

  const [formData, setFormData] = useState<HomePageData>(getHomePageContent());
  const [savedBanner, setSavedBanner] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [uploadingSlot, setUploadingSlot] = useState<string | null>(null);

  const heroMainSlot = getMediaSlot("HERO_MAIN_BANNER");
  const heroMobileSlot = getMediaSlot("HERO_MOBILE_BANNER");
  const splitLeftSlot = getMediaSlot("SPLIT_BANNER_LEFT");
  const splitRightSlot = getMediaSlot("SPLIT_BANNER_RIGHT");
  const lookbookHighlightSlot = getMediaSlot("LOOKBOOK_HIGHLIGHT_BANNER");
  const heritageSlot = getMediaSlot("HERITAGE_STORY_BANNER");

  useEffect(() => {
    setFormData(getHomePageContent());
  }, [getHomePageContent]);

  const handleFieldChange = (field: keyof HomePageData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    try {
      await updateHomePageContent(formData);
      setSavedBanner(true);
      setTimeout(() => setSavedBanner(false), 3500);
    } catch (err) {
      console.error("Save home page error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    if (confirm("Reset Homepage editorial narrative and copy to factory default values?")) {
      await resetHomePageContent();
      setFormData(getHomePageContent());
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

  const heroVideo = getVideoInfo(heroMainSlot?.imageUrl);
  const splitLeftVideo = getVideoInfo(splitLeftSlot?.imageUrl);
  const splitRightVideo = getVideoInfo(splitRightSlot?.imageUrl);
  const highlightVideo = getVideoInfo(lookbookHighlightSlot?.imageUrl);
  const heritageVideo = getVideoInfo(heritageSlot?.imageUrl);

  return (
    <AdminLayout>
      <div className="space-y-10 max-w-6xl pb-24">
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-luga-border dark:border-luga-darkBorder pb-6 gap-4">
          <div>
            <div className="flex items-center gap-2 font-mono text-[10px] sm:text-xs tracking-mega uppercase text-luga-crimson dark:text-luga-gold">
              <Compass className="w-3.5 h-3.5" />
              <span>STOREFRONT CMS // FRONT PAGE CONTROL</span>
            </div>
            <h1 className="font-editorial text-3xl sm:text-5xl uppercase tracking-tight text-luga-ink dark:text-luga-darkInk mt-1">
              HOMEPAGE CONTENT CMS
            </h1>
            <p className="font-mono text-xs text-luga-muted dark:text-luga-darkMuted mt-1 max-w-2xl leading-relaxed">
              Edit all storefront homepage manifesto copy, hero banners, split editorial frames, volume intros, and lookbook film highlights.
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
                  <span>PUBLISHING...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>PUBLISH HOMEPAGE</span>
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
                HOMEPAGE CONTENT PUBLISHED SUCCESSFULLY TO SUPABASE
              </span>
            </div>
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="underline flex items-center gap-1 hover:opacity-80"
            >
              <span>VIEW LIVE HOMEPAGE</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-12 font-mono text-xs">
          {/* SECTION 1: HERO MANIFESTO & FILM */}
          <section className="p-6 sm:p-8 bg-luga-bg dark:bg-[#0F0F0F] border border-luga-border dark:border-luga-darkBorder space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-luga-border/50 pb-3 gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-luga-crimson/10 text-luga-crimson dark:bg-luga-gold/10 dark:text-luga-gold font-bold text-[10px]">
                  SECTION 01
                </span>
                <h2 className="text-sm uppercase tracking-mega font-bold text-luga-ink dark:text-luga-darkInk">
                  HERO MANIFESTO & MAIN CAMPAIGN FILM
                </h2>
              </div>
              <span className="text-[10px] text-luga-muted">SLOT: HERO_MAIN_BANNER</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Media Preview & URL Controls */}
              <div className="lg:col-span-5 space-y-4">
                <div className="relative aspect-[16/9] bg-black border border-luga-border dark:border-luga-darkBorder overflow-hidden group">
                  <ManagedImage
                    slotKey="HERO_MAIN_BANNER"
                    aspectRatio="16:9"
                    resolution="2560×1440px"
                    alt="Hero Main Banner"
                    className="w-full h-full border-none"
                    imageClassName="w-full h-full object-cover"
                  />
                  {heroVideo.isVideo && (
                    <div className="absolute top-3 left-3 z-10 px-2 py-1 bg-black/80 border border-white/20 text-white text-[9px] uppercase tracking-wider flex items-center gap-1 font-mono">
                      <VideoIcon className="w-3 h-3 text-luga-gold" />
                      <span>{heroVideo.providerLabel.toUpperCase()} VIDEO</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] text-luga-muted uppercase tracking-wider flex items-center justify-between">
                    <span>MEDIA URL (IMAGE, MP4, WEBM, YOUTUBE, VIMEO)</span>
                    {uploadingSlot === "HERO_MAIN_BANNER" && (
                      <span className="text-luga-crimson dark:text-luga-gold animate-pulse">
                        UPLOADING...
                      </span>
                    )}
                  </label>
                  <input
                    type="text"
                    value={heroMainSlot?.imageUrl || ""}
                    onChange={(e) => updateMediaSlot("HERO_MAIN_BANNER", { imageUrl: e.target.value })}
                    placeholder="https://... or /media/... or YouTube/Vimeo link"
                    className="w-full bg-transparent border border-luga-border dark:border-luga-darkBorder p-2.5 text-luga-ink dark:text-luga-darkInk focus:outline-none focus:border-luga-crimson dark:focus:border-luga-gold text-xs"
                  />
                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer px-3 py-1.5 border border-dashed border-luga-border hover:border-luga-ink text-luga-muted hover:text-luga-ink dark:hover:text-luga-darkInk text-[10px] uppercase flex items-center gap-1.5 transition-colors">
                      <Upload className="w-3 h-3" />
                      <span>UPLOAD NEW ASSET</span>
                      <input
                        type="file"
                        accept="image/*,video/mp4,video/webm"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleMediaUpload("HERO_MAIN_BANNER", file);
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Text Fields */}
              <div className="lg:col-span-7 space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-luga-muted uppercase tracking-wider">
                    EYEBROW METADATA TAG
                  </label>
                  <input
                    type="text"
                    value={formData.heroTag}
                    onChange={(e) => handleFieldChange("heroTag", e.target.value)}
                    className="w-full bg-transparent border border-luga-border dark:border-luga-darkBorder p-2.5 text-luga-ink dark:text-luga-darkInk focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-luga-muted uppercase tracking-wider">
                    HERO MAIN HEADLINE
                  </label>
                  <input
                    type="text"
                    value={formData.heroHeading}
                    onChange={(e) => handleFieldChange("heroHeading", e.target.value)}
                    className="w-full bg-transparent border border-luga-border dark:border-luga-darkBorder p-2.5 text-luga-ink dark:text-luga-darkInk focus:outline-none font-editorial text-lg"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-luga-muted uppercase tracking-wider">
                    HERO INTRODUCTORY MANIFESTO / SUBTITLE
                  </label>
                  <textarea
                    rows={3}
                    value={formData.heroDescription}
                    onChange={(e) => handleFieldChange("heroDescription", e.target.value)}
                    className="w-full bg-transparent border border-luga-border dark:border-luga-darkBorder p-2.5 text-luga-ink dark:text-luga-darkInk focus:outline-none leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1">
                    <label className="text-[10px] text-luga-muted uppercase tracking-wider">
                      PRIMARY CTA BUTTON LABEL
                    </label>
                    <input
                      type="text"
                      value={formData.heroPrimaryCtaText}
                      onChange={(e) => handleFieldChange("heroPrimaryCtaText", e.target.value)}
                      className="w-full bg-transparent border border-luga-border dark:border-luga-darkBorder p-2 text-luga-ink dark:text-luga-darkInk focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-luga-muted uppercase tracking-wider">
                      PRIMARY CTA LINK TARGET
                    </label>
                    <input
                      type="text"
                      value={formData.heroPrimaryCtaLink}
                      onChange={(e) => handleFieldChange("heroPrimaryCtaLink", e.target.value)}
                      className="w-full bg-transparent border border-luga-border dark:border-luga-darkBorder p-2 text-luga-ink dark:text-luga-darkInk focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-luga-muted uppercase tracking-wider">
                      SECONDARY CTA BUTTON LABEL
                    </label>
                    <input
                      type="text"
                      value={formData.heroSecondaryCtaText}
                      onChange={(e) => handleFieldChange("heroSecondaryCtaText", e.target.value)}
                      className="w-full bg-transparent border border-luga-border dark:border-luga-darkBorder p-2 text-luga-ink dark:text-luga-darkInk focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-luga-muted uppercase tracking-wider">
                      SECONDARY CTA LINK TARGET
                    </label>
                    <input
                      type="text"
                      value={formData.heroSecondaryCtaLink}
                      onChange={(e) => handleFieldChange("heroSecondaryCtaLink", e.target.value)}
                      className="w-full bg-transparent border border-luga-border dark:border-luga-darkBorder p-2 text-luga-ink dark:text-luga-darkInk focus:outline-none"
                    />
                  </div>
                </div>

                {/* Right Rail Info Stamps */}
                <div className="space-y-2 pt-2 border-t border-luga-border/50">
                  <label className="text-[10px] text-luga-gold font-bold uppercase tracking-wider">
                    RIGHT-RAIL ARCHITECTURAL INFO STAMPS (DESKTOP)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={formData.heroStamp1}
                      onChange={(e) => handleFieldChange("heroStamp1", e.target.value)}
                      placeholder="STAMP 1"
                      className="bg-transparent border border-luga-border dark:border-luga-darkBorder p-2 text-[10px] text-luga-ink dark:text-luga-darkInk focus:outline-none"
                    />
                    <input
                      type="text"
                      value={formData.heroStamp2}
                      onChange={(e) => handleFieldChange("heroStamp2", e.target.value)}
                      placeholder="STAMP 2"
                      className="bg-transparent border border-luga-border dark:border-luga-darkBorder p-2 text-[10px] text-luga-ink dark:text-luga-darkInk focus:outline-none"
                    />
                    <input
                      type="text"
                      value={formData.heroStamp3}
                      onChange={(e) => handleFieldChange("heroStamp3", e.target.value)}
                      placeholder="STAMP 3"
                      className="bg-transparent border border-luga-border dark:border-luga-darkBorder p-2 text-[10px] text-luga-ink dark:text-luga-darkInk focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 2: CURATED SELECTIONS */}
          <section className="p-6 sm:p-8 bg-luga-bg dark:bg-[#0F0F0F] border border-luga-border dark:border-luga-darkBorder space-y-6">
            <div className="flex items-center gap-2 border-b border-luga-border/50 pb-3">
              <span className="px-2 py-0.5 bg-luga-crimson/10 text-luga-crimson dark:bg-luga-gold/10 dark:text-luga-gold font-bold text-[10px]">
                SECTION 02
              </span>
              <h2 className="text-sm uppercase tracking-mega font-bold text-luga-ink dark:text-luga-darkInk">
                CURATED SELECTIONS & FEATURED DROPS
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="space-y-1">
                <label className="text-[10px] text-luga-muted uppercase tracking-wider">
                  SECTION EYEBROW TAG
                </label>
                <input
                  type="text"
                  value={formData.featuredTag}
                  onChange={(e) => handleFieldChange("featuredTag", e.target.value)}
                  className="w-full bg-transparent border border-luga-border dark:border-luga-darkBorder p-2.5 text-luga-ink dark:text-luga-darkInk focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-luga-muted uppercase tracking-wider">
                  SECTION HEADLINE
                </label>
                <input
                  type="text"
                  value={formData.featuredHeading}
                  onChange={(e) => handleFieldChange("featuredHeading", e.target.value)}
                  className="w-full bg-transparent border border-luga-border dark:border-luga-darkBorder p-2.5 text-luga-ink dark:text-luga-darkInk focus:outline-none font-editorial"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-luga-muted uppercase tracking-wider">
                  &quot;VIEW ALL&quot; BUTTON LABEL
                </label>
                <input
                  type="text"
                  value={formData.featuredViewAllText}
                  onChange={(e) => handleFieldChange("featuredViewAllText", e.target.value)}
                  className="w-full bg-transparent border border-luga-border dark:border-luga-darkBorder p-2.5 text-luga-ink dark:text-luga-darkInk focus:outline-none"
                />
              </div>
            </div>
          </section>

          {/* SECTION 3: DUAL EDITORIAL SPLIT BANNERS */}
          <section className="p-6 sm:p-8 bg-luga-bg dark:bg-[#0F0F0F] border border-luga-border dark:border-luga-darkBorder space-y-6">
            <div className="flex items-center gap-2 border-b border-luga-border/50 pb-3">
              <span className="px-2 py-0.5 bg-luga-crimson/10 text-luga-crimson dark:bg-luga-gold/10 dark:text-luga-gold font-bold text-[10px]">
                SECTION 03
              </span>
              <h2 className="text-sm uppercase tracking-mega font-bold text-luga-ink dark:text-luga-darkInk">
                DUAL EDITORIAL SPLIT BANNERS (HEAVYWEIGHT FLEECE & STREETWEAR CUTS)
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Frame: Heavyweight Fleece */}
              <div className="p-5 border border-luga-border/70 dark:border-luga-darkBorder/70 space-y-4">
                <div className="flex items-center justify-between border-b border-luga-border/40 pb-2">
                  <span className="font-bold text-[11px] uppercase text-luga-crimson dark:text-luga-gold">
                    FRAME A // HEAVYWEIGHT HOODIES
                  </span>
                  <span className="text-[9px] text-luga-muted">SLOT: SPLIT_BANNER_LEFT</span>
                </div>

                <div className="relative aspect-[3/4] max-h-56 bg-black border border-luga-border overflow-hidden">
                  <ManagedImage
                    slotKey="SPLIT_BANNER_LEFT"
                    aspectRatio="3:4"
                    resolution="1200×1600px"
                    alt="Split Left Banner"
                    className="w-full h-full border-none"
                  />
                  {splitLeftVideo.isVideo && (
                    <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/80 text-white text-[9px] flex items-center gap-1 font-mono">
                      <VideoIcon className="w-2.5 h-2.5 text-luga-gold" />
                      <span>{splitLeftVideo.providerLabel.toUpperCase()}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-luga-muted uppercase">FRAME A MEDIA URL</label>
                  <input
                    type="text"
                    value={splitLeftSlot?.imageUrl || ""}
                    onChange={(e) => updateMediaSlot("SPLIT_BANNER_LEFT", { imageUrl: e.target.value })}
                    className="w-full bg-transparent border border-luga-border dark:border-luga-darkBorder p-2 text-xs text-luga-ink dark:text-luga-darkInk focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-luga-muted uppercase">FRAME A TAG</label>
                  <input
                    type="text"
                    value={formData.splitLeftTag}
                    onChange={(e) => handleFieldChange("splitLeftTag", e.target.value)}
                    className="w-full bg-transparent border border-luga-border dark:border-luga-darkBorder p-2 text-xs text-luga-ink dark:text-luga-darkInk focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-luga-muted uppercase">FRAME A HEADING</label>
                  <input
                    type="text"
                    value={formData.splitLeftHeading}
                    onChange={(e) => handleFieldChange("splitLeftHeading", e.target.value)}
                    className="w-full bg-transparent border border-luga-border dark:border-luga-darkBorder p-2 text-xs font-editorial text-luga-ink dark:text-luga-darkInk focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-luga-muted uppercase">FRAME A DESCRIPTION</label>
                  <textarea
                    rows={2}
                    value={formData.splitLeftDescription}
                    onChange={(e) => handleFieldChange("splitLeftDescription", e.target.value)}
                    className="w-full bg-transparent border border-luga-border dark:border-luga-darkBorder p-2 text-xs text-luga-ink dark:text-luga-darkInk focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] text-luga-muted uppercase">CTA TEXT</label>
                    <input
                      type="text"
                      value={formData.splitLeftCtaText}
                      onChange={(e) => handleFieldChange("splitLeftCtaText", e.target.value)}
                      className="w-full bg-transparent border border-luga-border dark:border-luga-darkBorder p-2 text-[10px] text-luga-ink dark:text-luga-darkInk focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-luga-muted uppercase">CTA LINK</label>
                    <input
                      type="text"
                      value={formData.splitLeftCtaLink}
                      onChange={(e) => handleFieldChange("splitLeftCtaLink", e.target.value)}
                      className="w-full bg-transparent border border-luga-border dark:border-luga-darkBorder p-2 text-[10px] text-luga-ink dark:text-luga-darkInk focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Right Frame: Heavyweight Cuts */}
              <div className="p-5 border border-luga-border/70 dark:border-luga-darkBorder/70 space-y-4">
                <div className="flex items-center justify-between border-b border-luga-border/40 pb-2">
                  <span className="font-bold text-[11px] uppercase text-luga-crimson dark:text-luga-gold">
                    FRAME B // HEAVYWEIGHT SILHOUETTES
                  </span>
                  <span className="text-[9px] text-luga-muted">SLOT: SPLIT_BANNER_RIGHT</span>
                </div>

                <div className="relative aspect-[3/4] max-h-56 bg-black border border-luga-border overflow-hidden">
                  <ManagedImage
                    slotKey="SPLIT_BANNER_RIGHT"
                    aspectRatio="3:4"
                    resolution="1200×1600px"
                    alt="Split Right Banner"
                    className="w-full h-full border-none"
                  />
                  {splitRightVideo.isVideo && (
                    <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/80 text-white text-[9px] flex items-center gap-1 font-mono">
                      <VideoIcon className="w-2.5 h-2.5 text-luga-gold" />
                      <span>{splitRightVideo.providerLabel.toUpperCase()}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-luga-muted uppercase">FRAME B MEDIA URL</label>
                  <input
                    type="text"
                    value={splitRightSlot?.imageUrl || ""}
                    onChange={(e) => updateMediaSlot("SPLIT_BANNER_RIGHT", { imageUrl: e.target.value })}
                    className="w-full bg-transparent border border-luga-border dark:border-luga-darkBorder p-2 text-xs text-luga-ink dark:text-luga-darkInk focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-luga-muted uppercase">FRAME B TAG</label>
                  <input
                    type="text"
                    value={formData.splitRightTag}
                    onChange={(e) => handleFieldChange("splitRightTag", e.target.value)}
                    className="w-full bg-transparent border border-luga-border dark:border-luga-darkBorder p-2 text-xs text-luga-ink dark:text-luga-darkInk focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-luga-muted uppercase">FRAME B HEADING</label>
                  <input
                    type="text"
                    value={formData.splitRightHeading}
                    onChange={(e) => handleFieldChange("splitRightHeading", e.target.value)}
                    className="w-full bg-transparent border border-luga-border dark:border-luga-darkBorder p-2 text-xs font-editorial text-luga-ink dark:text-luga-darkInk focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-luga-muted uppercase">FRAME B DESCRIPTION</label>
                  <textarea
                    rows={2}
                    value={formData.splitRightDescription}
                    onChange={(e) => handleFieldChange("splitRightDescription", e.target.value)}
                    className="w-full bg-transparent border border-luga-border dark:border-luga-darkBorder p-2 text-xs text-luga-ink dark:text-luga-darkInk focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] text-luga-muted uppercase">CTA TEXT</label>
                    <input
                      type="text"
                      value={formData.splitRightCtaText}
                      onChange={(e) => handleFieldChange("splitRightCtaText", e.target.value)}
                      className="w-full bg-transparent border border-luga-border dark:border-luga-darkBorder p-2 text-[10px] text-luga-ink dark:text-luga-darkInk focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-luga-muted uppercase">CTA LINK</label>
                    <input
                      type="text"
                      value={formData.splitRightCtaLink}
                      onChange={(e) => handleFieldChange("splitRightCtaLink", e.target.value)}
                      className="w-full bg-transparent border border-luga-border dark:border-luga-darkBorder p-2 text-[10px] text-luga-ink dark:text-luga-darkInk focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 4: NUMBERED ARCHIVES / VOLUME CAPSULES */}
          <section className="p-6 sm:p-8 bg-luga-bg dark:bg-[#0F0F0F] border border-luga-border dark:border-luga-darkBorder space-y-6">
            <div className="flex items-center gap-2 border-b border-luga-border/50 pb-3">
              <span className="px-2 py-0.5 bg-luga-crimson/10 text-luga-crimson dark:bg-luga-gold/10 dark:text-luga-gold font-bold text-[10px]">
                SECTION 04
              </span>
              <h2 className="text-sm uppercase tracking-mega font-bold text-luga-ink dark:text-luga-darkInk">
                NUMBERED ARCHIVES & VOLUME CAPSULES INTRO
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="space-y-1">
                <label className="text-[10px] text-luga-muted uppercase tracking-wider">
                  SECTION EYEBROW TAG
                </label>
                <input
                  type="text"
                  value={formData.volumesTag}
                  onChange={(e) => handleFieldChange("volumesTag", e.target.value)}
                  className="w-full bg-transparent border border-luga-border dark:border-luga-darkBorder p-2.5 text-luga-ink dark:text-luga-darkInk focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-luga-muted uppercase tracking-wider">
                  SECTION TITLE
                </label>
                <input
                  type="text"
                  value={formData.volumesHeading}
                  onChange={(e) => handleFieldChange("volumesHeading", e.target.value)}
                  className="w-full bg-transparent border border-luga-border dark:border-luga-darkBorder p-2.5 text-luga-ink dark:text-luga-darkInk focus:outline-none font-editorial"
                />
              </div>

              <div className="space-y-1 sm:col-span-3">
                <label className="text-[10px] text-luga-muted uppercase tracking-wider">
                  VOLUME SECTION EXPLANATORY PARAGRAPH
                </label>
                <textarea
                  rows={2}
                  value={formData.volumesDescription}
                  onChange={(e) => handleFieldChange("volumesDescription", e.target.value)}
                  className="w-full bg-transparent border border-luga-border dark:border-luga-darkBorder p-2.5 text-luga-ink dark:text-luga-darkInk focus:outline-none leading-relaxed"
                />
              </div>
            </div>
          </section>

          {/* SECTION 5: CINEMATIC LOOKBOOK TEASER */}
          <section className="p-6 sm:p-8 bg-luga-bg dark:bg-[#0F0F0F] border border-luga-border dark:border-luga-darkBorder space-y-6">
            <div className="flex items-center gap-2 border-b border-luga-border/50 pb-3">
              <span className="px-2 py-0.5 bg-luga-crimson/10 text-luga-crimson dark:bg-luga-gold/10 dark:text-luga-gold font-bold text-[10px]">
                SECTION 05
              </span>
              <h2 className="text-sm uppercase tracking-mega font-bold text-luga-ink dark:text-luga-darkInk">
                CINEMATIC LOOKBOOK FILM TEASER & REEL
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Highlight Reel Media Preview */}
              <div className="lg:col-span-5 space-y-4">
                <div className="relative aspect-[21/9] bg-black border border-luga-border overflow-hidden">
                  <ManagedImage
                    slotKey="LOOKBOOK_HIGHLIGHT_BANNER"
                    aspectRatio="21:9"
                    resolution="2560×1100px"
                    alt="Lookbook Highlight Reel"
                    className="w-full h-full border-none"
                  />
                  {highlightVideo.isVideo && (
                    <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/80 text-white text-[9px] flex items-center gap-1 font-mono">
                      <VideoIcon className="w-2.5 h-2.5 text-luga-gold" />
                      <span>{highlightVideo.providerLabel.toUpperCase()}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-luga-muted uppercase">
                    FEATURED 35MM FILM REEL URL (MP4, YOUTUBE, VIMEO)
                  </label>
                  <input
                    type="text"
                    value={lookbookHighlightSlot?.imageUrl || ""}
                    onChange={(e) => updateMediaSlot("LOOKBOOK_HIGHLIGHT_BANNER", { imageUrl: e.target.value })}
                    className="w-full bg-transparent border border-luga-border dark:border-luga-darkBorder p-2 text-xs text-luga-ink dark:text-luga-darkInk focus:outline-none"
                  />
                </div>
              </div>

              {/* Text Fields */}
              <div className="lg:col-span-7 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-luga-muted uppercase">SECTION EYEBROW</label>
                    <input
                      type="text"
                      value={formData.lookbookTag}
                      onChange={(e) => handleFieldChange("lookbookTag", e.target.value)}
                      className="w-full bg-transparent border border-luga-border dark:border-luga-darkBorder p-2 text-xs text-luga-ink dark:text-luga-darkInk focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-luga-muted uppercase">SECTION TITLE</label>
                    <input
                      type="text"
                      value={formData.lookbookHeading}
                      onChange={(e) => handleFieldChange("lookbookHeading", e.target.value)}
                      className="w-full bg-transparent border border-luga-border dark:border-luga-darkBorder p-2 text-xs font-editorial text-luga-ink dark:text-luga-darkInk focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-luga-muted uppercase">FILM REEL TITLE</label>
                  <input
                    type="text"
                    value={formData.lookbookHighlightTitle}
                    onChange={(e) => handleFieldChange("lookbookHighlightTitle", e.target.value)}
                    className="w-full bg-transparent border border-luga-border dark:border-luga-darkBorder p-2 text-xs text-luga-ink dark:text-luga-darkInk focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-luga-muted uppercase">FILM REEL SUBTITLE / CREDITS</label>
                  <input
                    type="text"
                    value={formData.lookbookHighlightSubtitle}
                    onChange={(e) => handleFieldChange("lookbookHighlightSubtitle", e.target.value)}
                    className="w-full bg-transparent border border-luga-border dark:border-luga-darkBorder p-2 text-xs text-luga-ink dark:text-luga-darkInk focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-luga-muted uppercase">BROWSE FULL LOOKBOOK CTA LABEL</label>
                  <input
                    type="text"
                    value={formData.lookbookBrowseCtaText}
                    onChange={(e) => handleFieldChange("lookbookBrowseCtaText", e.target.value)}
                    className="w-full bg-transparent border border-luga-border dark:border-luga-darkBorder p-2 text-xs text-luga-ink dark:text-luga-darkInk focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 6: ATELIER MANIFESTO & STORY */}
          <section className="p-6 sm:p-8 bg-luga-bg dark:bg-[#0F0F0F] border border-luga-border dark:border-luga-darkBorder space-y-6">
            <div className="flex items-center gap-2 border-b border-luga-border/50 pb-3">
              <span className="px-2 py-0.5 bg-luga-crimson/10 text-luga-crimson dark:bg-luga-gold/10 dark:text-luga-gold font-bold text-[10px]">
                SECTION 06
              </span>
              <h2 className="text-sm uppercase tracking-mega font-bold text-luga-ink dark:text-luga-darkInk">
                ATELIER MANIFESTO & PATRON STORY NARRATIVE
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Media preview */}
              <div className="lg:col-span-5 space-y-4">
                <div className="relative aspect-[4/3] bg-black border border-luga-border overflow-hidden">
                  <ManagedImage
                    slotKey="HERITAGE_STORY_BANNER"
                    aspectRatio="4:3"
                    resolution="2000×1500px"
                    alt="Heritage Story Banner"
                    className="w-full h-full border-none"
                  />
                  {heritageVideo.isVideo && (
                    <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/80 text-white text-[9px] flex items-center gap-1 font-mono">
                      <VideoIcon className="w-2.5 h-2.5 text-luga-gold" />
                      <span>{heritageVideo.providerLabel.toUpperCase()}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-luga-muted uppercase">HERITAGE PHOTO / FILM URL</label>
                  <input
                    type="text"
                    value={heritageSlot?.imageUrl || ""}
                    onChange={(e) => updateMediaSlot("HERITAGE_STORY_BANNER", { imageUrl: e.target.value })}
                    className="w-full bg-transparent border border-luga-border dark:border-luga-darkBorder p-2 text-xs text-luga-ink dark:text-luga-darkInk focus:outline-none"
                  />
                </div>
              </div>

              {/* Text Fields */}
              <div className="lg:col-span-7 space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-luga-muted uppercase">EYEBROW TAG</label>
                  <input
                    type="text"
                    value={formData.storyTag}
                    onChange={(e) => handleFieldChange("storyTag", e.target.value)}
                    className="w-full bg-transparent border border-luga-border dark:border-luga-darkBorder p-2.5 text-luga-ink dark:text-luga-darkInk focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-luga-muted uppercase">MANIFESTO HEADLINE</label>
                  <input
                    type="text"
                    value={formData.storyHeading}
                    onChange={(e) => handleFieldChange("storyHeading", e.target.value)}
                    className="w-full bg-transparent border border-luga-border dark:border-luga-darkBorder p-2.5 text-luga-ink dark:text-luga-darkInk focus:outline-none font-editorial text-base"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-luga-muted uppercase">STORY PARAGRAPH 1</label>
                  <textarea
                    rows={3}
                    value={formData.storyParagraph1}
                    onChange={(e) => handleFieldChange("storyParagraph1", e.target.value)}
                    className="w-full bg-transparent border border-luga-border dark:border-luga-darkBorder p-2.5 text-luga-ink dark:text-luga-darkInk focus:outline-none leading-relaxed"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-luga-muted uppercase">STORY PARAGRAPH 2</label>
                  <textarea
                    rows={3}
                    value={formData.storyParagraph2}
                    onChange={(e) => handleFieldChange("storyParagraph2", e.target.value)}
                    className="w-full bg-transparent border border-luga-border dark:border-luga-darkBorder p-2.5 text-luga-ink dark:text-luga-darkInk focus:outline-none leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1">
                    <label className="text-[10px] text-luga-muted uppercase">CTA BUTTON LABEL</label>
                    <input
                      type="text"
                      value={formData.storyCtaText}
                      onChange={(e) => handleFieldChange("storyCtaText", e.target.value)}
                      className="w-full bg-transparent border border-luga-border dark:border-luga-darkBorder p-2 text-luga-ink dark:text-luga-darkInk focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-luga-muted uppercase">CTA LINK TARGET</label>
                    <input
                      type="text"
                      value={formData.storyCtaLink}
                      onChange={(e) => handleFieldChange("storyCtaLink", e.target.value)}
                      className="w-full bg-transparent border border-luga-border dark:border-luga-darkBorder p-2 text-luga-ink dark:text-luga-darkInk focus:outline-none"
                    />
                  </div>
                </div>
              </div>
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
                <span>SAVE & PUBLISH HOMEPAGE</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
