"use client";

import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ManagedImage } from "@/components/common/ManagedImage";
import { useStore } from "@/lib/store-context";
import { AboutPageData } from "@/types";
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
  MapPin,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import { uploadToUploadcare } from "@/lib/uploadcare";
import { getVideoInfo } from "@/lib/video-utils";

export default function AdminAboutPage() {
  const {
    getAboutContent,
    updateAboutContent,
    resetAboutContent,
    getMediaSlot,
    updateMediaSlot,
    settings,
    updateSettings,
    isSyncing,
  } = useStore();

  const [formData, setFormData] = useState<AboutPageData>(getAboutContent());
  const [studioAddressInput, setStudioAddressInput] = useState<string>(settings.studioAddress);
  const [savedBanner, setSavedBanner] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [uploadingSlot, setUploadingSlot] = useState<string | null>(null);

  const heritageSlot = getMediaSlot("HERITAGE_STORY_BANNER");
  const studioSlot = getMediaSlot("ABOUT_STUDIO_PORTRAIT");
  const craftSlot = getMediaSlot("ABOUT_CRAFT_WEAVE");

  // Sync state with store on load
  useEffect(() => {
    setFormData(getAboutContent());
    setStudioAddressInput(settings.studioAddress);
  }, [getAboutContent, settings.studioAddress]);

  const handleFieldChange = (field: keyof AboutPageData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    try {
      await updateAboutContent(formData);
      if (studioAddressInput !== settings.studioAddress) {
        await updateSettings({ studioAddress: studioAddressInput });
      }
      setSavedBanner(true);
      setTimeout(() => setSavedBanner(false), 3500);
    } catch (err) {
      console.error("Save about page error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    if (confirm("Reset About page narrative, manifesto, and pillars to default luxury copy?")) {
      await resetAboutContent();
      setFormData(getAboutContent());
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

  const heritageVideo = getVideoInfo(heritageSlot?.imageUrl);
  const studioVideo = getVideoInfo(studioSlot?.imageUrl);
  const craftVideo = getVideoInfo(craftSlot?.imageUrl);

  return (
    <AdminLayout>
      <div className="space-y-8 max-w-5xl">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-luga-border dark:border-luga-darkBorder pb-6 gap-4">
          <div>
            <span className="font-mono text-[10px] sm:text-xs tracking-mega uppercase text-luga-crimson dark:text-luga-gold flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" />
              ATELIER BRAND STORY & EDITORIAL MANIFESTO
            </span>
            <h1 className="font-editorial text-3xl sm:text-5xl uppercase tracking-tight text-luga-ink dark:text-luga-darkInk mt-1">
              ABOUT PAGE CMS
            </h1>
            <p className="font-mono text-xs text-luga-muted dark:text-luga-darkMuted mt-1 max-w-2xl">
              Fully customize the brand manifesto, video background reels, narrative philosophy, 35mm visual diptychs, craftsmanship pillars, and salon visit information.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/about"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 border border-luga-border dark:border-luga-darkBorder hover:border-luga-ink text-luga-ink dark:text-luga-darkInk font-mono text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors"
            >
              <span>View Live About</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={() => handleSave()}
              disabled={isSaving}
              className="px-6 py-2.5 bg-luga-ink text-white dark:bg-luga-darkInk dark:text-black font-mono text-xs uppercase tracking-ultra flex items-center gap-2 hover:bg-luga-crimson dark:hover:bg-luga-gold transition-colors disabled:opacity-75"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? "SAVING..." : "SAVE CHANGES"}</span>
            </button>
          </div>
        </div>

        {/* Saved Notification Banner */}
        {savedBanner && (
          <div className="p-3.5 bg-emerald-600 text-white font-mono text-xs uppercase tracking-wider flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>About page content successfully saved and synchronized across the storefront!</span>
            </div>
            <a href="/about" target="_blank" className="underline text-[11px]">
              Open Page →
            </a>
          </div>
        )}

        {/* 1. HERO MANIFESTO BANNER & VIDEO REEL */}
        <section className="p-6 bg-luga-bg dark:bg-[#0F0F0F] border border-luga-border dark:border-luga-darkBorder space-y-6">
          <div className="flex items-center justify-between border-b border-luga-border/60 pb-3">
            <div>
              <span className="font-mono text-[9px] tracking-mega uppercase text-luga-crimson dark:text-luga-gold">
                SECTION 01
              </span>
              <h2 className="font-editorial text-2xl text-luga-ink dark:text-luga-darkInk uppercase">
                HERO MANIFESTO & BACKGROUND MEDIA
              </h2>
            </div>
            <div className="font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 border border-luga-border text-luga-muted">
              SLOT: HERITAGE_STORY_BANNER
            </div>
          </div>

          {/* Media Preview & URL/Upload Input */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-5 space-y-2">
              <div className="relative aspect-video bg-black border border-luga-border overflow-hidden">
                <ManagedImage
                  slotKey="HERITAGE_STORY_BANNER"
                  aspectRatio="16:9"
                  alt="Manifesto Banner"
                  className="w-full h-full border-none"
                />
                <div className="absolute top-2 right-2 px-2 py-0.5 bg-black/85 backdrop-blur-sm border border-white/20 text-white font-mono text-[9px] uppercase tracking-wider flex items-center gap-1 shadow-sm">
                  {heritageVideo.isVideo ? (
                    <>
                      <VideoIcon className="w-3 h-3 text-amber-400" />
                      <span>VIDEO ({heritageVideo.providerLabel.toUpperCase()})</span>
                    </>
                  ) : (
                    <>
                      <ImageIcon className="w-3 h-3 text-emerald-400" />
                      <span>IMAGE ACTIVE</span>
                    </>
                  )}
                </div>
              </div>

              {/* Upload or Paste URL */}
              <div className="space-y-1.5 font-mono text-xs">
                <label className="text-[10px] text-luga-muted uppercase">
                  BACKGROUND VIDEO / PHOTO
                </label>
                <div className="flex gap-2">
                  <label className="cursor-pointer py-2 px-3 border border-luga-border hover:border-luga-ink text-[10px] uppercase flex items-center gap-1.5 shrink-0 transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingSlot === "HERITAGE_STORY_BANNER" ? "Uploading..." : "Upload File"}</span>
                    <input
                      type="file"
                      accept="image/*,video/mp4,video/webm,video/quicktime"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) handleMediaUpload("HERITAGE_STORY_BANNER", f);
                      }}
                    />
                  </label>
                  <input
                    type="url"
                    placeholder="https://... (Direct MP4, YouTube, Vimeo, or CDN URL)"
                    value={heritageSlot?.imageUrl || ""}
                    onChange={(e) =>
                      updateMediaSlot("HERITAGE_STORY_BANNER", { imageUrl: e.target.value })
                    }
                    className="flex-1 bg-transparent border border-luga-border p-2 text-xs focus:outline-none"
                  />
                  {heritageSlot?.imageUrl && (
                    <button
                      type="button"
                      onClick={() => updateMediaSlot("HERITAGE_STORY_BANNER", { imageUrl: null })}
                      className="px-2.5 py-1 border border-luga-border text-luga-muted hover:text-luga-ink text-[10px] uppercase"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <span className="text-[9px] text-luga-muted block">
                  Supports YouTube, Vimeo, direct MP4/WebM videos, and photos.
                </span>
              </div>
            </div>

            {/* Manifesto Copy Inputs */}
            <div className="lg:col-span-7 space-y-4 font-mono text-xs">
              <div className="space-y-1">
                <label className="text-[10px] text-luga-muted uppercase font-bold">
                  MANIFESTO TAGLINE / BADGE
                </label>
                <input
                  type="text"
                  value={formData.manifestoTag}
                  onChange={(e) => handleFieldChange("manifestoTag", e.target.value)}
                  placeholder="e.g. KATHMANDU // 27.7° N"
                  className="w-full bg-transparent border border-luga-border p-2.5 text-luga-ink dark:text-luga-darkInk focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-luga-muted uppercase font-bold">
                  MAIN MANIFESTO HEADLINE
                </label>
                <input
                  type="text"
                  value={formData.manifestoHeading}
                  onChange={(e) => handleFieldChange("manifestoHeading", e.target.value)}
                  placeholder="e.g. BUILT FOR THE PAVEMENT. CUT FOR EVERY DAY."
                  className="w-full bg-transparent border border-luga-border p-2.5 text-luga-ink dark:text-luga-darkInk focus:outline-none font-editorial text-lg"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-luga-muted uppercase font-bold">
                  MANIFESTO SUBHEADING / MISSION STATEMENT
                </label>
                <textarea
                  rows={3}
                  value={formData.manifestoSubHeading}
                  onChange={(e) => handleFieldChange("manifestoSubHeading", e.target.value)}
                  placeholder="Editorial subtitle..."
                  className="w-full bg-transparent border border-luga-border p-2.5 text-luga-ink dark:text-luga-darkInk focus:outline-none"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 2. ORIGINS & ETHOS NARRATIVE */}
        <section className="p-6 bg-luga-bg dark:bg-[#0F0F0F] border border-luga-border dark:border-luga-darkBorder space-y-6">
          <div className="border-b border-luga-border/60 pb-3">
            <span className="font-mono text-[9px] tracking-mega uppercase text-luga-crimson dark:text-luga-gold">
              SECTION 02
            </span>
            <h2 className="font-editorial text-2xl text-luga-ink dark:text-luga-darkInk uppercase">
              ORIGINS & ETHOS (BRAND PHILOSOPHY NARRATIVE)
            </h2>
          </div>

          <div className="space-y-4 font-mono text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] text-luga-muted uppercase font-bold">
                  SECTION BADGE / TAG
                </label>
                <input
                  type="text"
                  value={formData.narrativeTag}
                  onChange={(e) => handleFieldChange("narrativeTag", e.target.value)}
                  placeholder="e.g. ORIGINS & ETHOS"
                  className="w-full bg-transparent border border-luga-border p-2.5 text-luga-ink dark:text-luga-darkInk focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-luga-muted uppercase font-bold">
                  SECTION TITLE
                </label>
                <input
                  type="text"
                  value={formData.narrativeHeading}
                  onChange={(e) => handleFieldChange("narrativeHeading", e.target.value)}
                  placeholder="e.g. Why We Build in Nepal"
                  className="w-full bg-transparent border border-luga-border p-2.5 text-luga-ink dark:text-luga-darkInk focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1 pt-2">
              <label className="text-[10px] text-luga-muted uppercase font-bold">
                PARAGRAPH 01 (THE BRAND ORIGIN)
              </label>
              <textarea
                rows={3}
                value={formData.narrativeParagraph1}
                onChange={(e) => handleFieldChange("narrativeParagraph1", e.target.value)}
                className="w-full bg-transparent border border-luga-border p-2.5 text-luga-ink dark:text-luga-darkInk focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-luga-muted uppercase font-bold">
                PARAGRAPH 02 (CUT & QUALITY)
              </label>
              <textarea
                rows={4}
                value={formData.narrativeParagraph2}
                onChange={(e) => handleFieldChange("narrativeParagraph2", e.target.value)}
                className="w-full bg-transparent border border-luga-border p-2.5 text-luga-ink dark:text-luga-darkInk focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-luga-muted uppercase font-bold">
                PARAGRAPH 03 (THE DROP PHILOSOPHY)
              </label>
              <textarea
                rows={3}
                value={formData.narrativeParagraph3}
                onChange={(e) => handleFieldChange("narrativeParagraph3", e.target.value)}
                className="w-full bg-transparent border border-luga-border p-2.5 text-luga-ink dark:text-luga-darkInk focus:outline-none"
              />
            </div>
          </div>
        </section>

        {/* 3. VISUAL DIPTYCH: STUDIO & FABRIC DENSITY */}
        <section className="p-6 bg-luga-bg dark:bg-[#0F0F0F] border border-luga-border dark:border-luga-darkBorder space-y-6">
          <div className="border-b border-luga-border/60 pb-3">
            <span className="font-mono text-[9px] tracking-mega uppercase text-luga-crimson dark:text-luga-gold">
              SECTION 03
            </span>
            <h2 className="font-editorial text-2xl text-luga-ink dark:text-luga-darkInk uppercase">
              VISUAL DIPTYCH (STUDIO PORTRAIT & FABRIC DETAIL)
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-mono text-xs">
            {/* Left Diptych: Studio Atelier */}
            <div className="space-y-4 p-4 border border-luga-border">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-luga-crimson dark:text-luga-gold">
                  FRAME A // STUDIO PORTRAIT
                </span>
                <span className="text-[9px] text-luga-muted">SLOT: ABOUT_STUDIO_PORTRAIT</span>
              </div>

              <div className="relative aspect-[4/5] bg-black border border-luga-border overflow-hidden">
                <ManagedImage
                  slotKey="ABOUT_STUDIO_PORTRAIT"
                  aspectRatio="4:5"
                  alt="Studio Portrait"
                  className="w-full h-full border-none"
                />
                <div className="absolute top-2 right-2 px-2 py-0.5 bg-black/85 backdrop-blur-sm border border-white/20 text-white font-mono text-[9px] uppercase tracking-wider flex items-center gap-1 shadow-sm">
                  {studioVideo.isVideo ? (
                    <>
                      <VideoIcon className="w-3 h-3 text-amber-400" />
                      <span>VIDEO ({studioVideo.providerLabel.toUpperCase()})</span>
                    </>
                  ) : (
                    <>
                      <ImageIcon className="w-3 h-3 text-emerald-400" />
                      <span>IMAGE ACTIVE</span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <label className="cursor-pointer py-2 px-3 border border-luga-border hover:border-luga-ink text-[10px] uppercase flex items-center gap-1.5 shrink-0 transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload</span>
                  <input
                    type="file"
                    accept="image/*,video/mp4,video/webm,video/quicktime"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleMediaUpload("ABOUT_STUDIO_PORTRAIT", f);
                    }}
                  />
                </label>
                <input
                  type="url"
                  placeholder="Or paste video / photo URL..."
                  value={studioSlot?.imageUrl || ""}
                  onChange={(e) =>
                    updateMediaSlot("ABOUT_STUDIO_PORTRAIT", { imageUrl: e.target.value })
                  }
                  className="flex-1 bg-transparent border border-luga-border p-2 text-xs focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-luga-muted uppercase">FRAME TITLE</label>
                <input
                  type="text"
                  value={studioSlot?.heading || "THE STUDIO // KATHMANDU"}
                  onChange={(e) =>
                    updateMediaSlot("ABOUT_STUDIO_PORTRAIT", { heading: e.target.value })
                  }
                  className="w-full bg-transparent border border-luga-border p-2 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-luga-muted uppercase">FRAME CAPTION</label>
                <input
                  type="text"
                  value={studioSlot?.subHeading || "Where heavyweight knits and modern streetwear silhouettes are prototyped."}
                  onChange={(e) =>
                    updateMediaSlot("ABOUT_STUDIO_PORTRAIT", { subHeading: e.target.value })
                  }
                  className="w-full bg-transparent border border-luga-border p-2 text-xs"
                />
              </div>
            </div>

            {/* Right Diptych: Craft Macro */}
            <div className="space-y-4 p-4 border border-luga-border">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-luga-crimson dark:text-luga-gold">
                  FRAME B // FABRIC & DENSITY
                </span>
                <span className="text-[9px] text-luga-muted">SLOT: ABOUT_CRAFT_WEAVE</span>
              </div>

              <div className="relative aspect-[4/5] bg-black border border-luga-border overflow-hidden">
                <ManagedImage
                  slotKey="ABOUT_CRAFT_WEAVE"
                  aspectRatio="4:5"
                  alt="Craft Weave"
                  className="w-full h-full border-none"
                />
                <div className="absolute top-2 right-2 px-2 py-0.5 bg-black/85 backdrop-blur-sm border border-white/20 text-white font-mono text-[9px] uppercase tracking-wider flex items-center gap-1 shadow-sm">
                  {craftVideo.isVideo ? (
                    <>
                      <VideoIcon className="w-3 h-3 text-amber-400" />
                      <span>VIDEO ({craftVideo.providerLabel.toUpperCase()})</span>
                    </>
                  ) : (
                    <>
                      <ImageIcon className="w-3 h-3 text-emerald-400" />
                      <span>IMAGE ACTIVE</span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <label className="cursor-pointer py-2 px-3 border border-luga-border hover:border-luga-ink text-[10px] uppercase flex items-center gap-1.5 shrink-0 transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload</span>
                  <input
                    type="file"
                    accept="image/*,video/mp4,video/webm,video/quicktime"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleMediaUpload("ABOUT_CRAFT_WEAVE", f);
                    }}
                  />
                </label>
                <input
                  type="url"
                  placeholder="Or paste video / photo URL..."
                  value={craftSlot?.imageUrl || ""}
                  onChange={(e) =>
                    updateMediaSlot("ABOUT_CRAFT_WEAVE", { imageUrl: e.target.value })
                  }
                  className="flex-1 bg-transparent border border-luga-border p-2 text-xs focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-luga-muted uppercase">FRAME TITLE</label>
                <input
                  type="text"
                  value={craftSlot?.heading || "CUSTOM HEAVYWEIGHT KNITS"}
                  onChange={(e) =>
                    updateMediaSlot("ABOUT_CRAFT_WEAVE", { heading: e.target.value })
                  }
                  className="w-full bg-transparent border border-luga-border p-2 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-luga-muted uppercase">FRAME CAPTION</label>
                <input
                  type="text"
                  value={craftSlot?.subHeading || "400+ GSM loopback French terry and dense combed cotton engineered to hold shape."}
                  onChange={(e) =>
                    updateMediaSlot("ABOUT_CRAFT_WEAVE", { subHeading: e.target.value })
                  }
                  className="w-full bg-transparent border border-luga-border p-2 text-xs"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 4. THE THREE PILLARS OF CRAFTSMANSHIP */}
        <section className="p-6 bg-luga-bg dark:bg-[#0F0F0F] border border-luga-border dark:border-luga-darkBorder space-y-6">
          <div className="border-b border-luga-border/60 pb-3">
            <span className="font-mono text-[9px] tracking-mega uppercase text-luga-crimson dark:text-luga-gold">
              SECTION 04
            </span>
            <h2 className="font-editorial text-2xl text-luga-ink dark:text-luga-darkInk uppercase">
              THE THREE CRAFTSMANSHIP PILLARS
            </h2>
          </div>

          <div className="space-y-4 font-mono text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] text-luga-muted uppercase font-bold">
                  SECTION BADGE
                </label>
                <input
                  type="text"
                  value={formData.pillarsTag}
                  onChange={(e) => handleFieldChange("pillarsTag", e.target.value)}
                  placeholder="e.g. TECHNICAL DISCIPLINE"
                  className="w-full bg-transparent border border-luga-border p-2 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-luga-muted uppercase font-bold">
                  SECTION TITLE
                </label>
                <input
                  type="text"
                  value={formData.pillarsHeading}
                  onChange={(e) => handleFieldChange("pillarsHeading", e.target.value)}
                  placeholder="e.g. THE THREE PILLARS"
                  className="w-full bg-transparent border border-luga-border p-2 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              {/* Pillar 1 */}
              <div className="p-4 border border-luga-border space-y-3">
                <div className="space-y-1">
                  <label className="text-[9px] text-luga-muted uppercase">PILLAR 01 TAG</label>
                  <input
                    type="text"
                    value={formData.pillar1Badge}
                    onChange={(e) => handleFieldChange("pillar1Badge", e.target.value)}
                    className="w-full bg-transparent border border-luga-border p-1.5 text-xs font-bold text-luga-crimson dark:text-luga-gold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] text-luga-muted uppercase">PILLAR 01 TITLE</label>
                  <input
                    type="text"
                    value={formData.pillar1Title}
                    onChange={(e) => handleFieldChange("pillar1Title", e.target.value)}
                    className="w-full bg-transparent border border-luga-border p-1.5 text-xs font-semibold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] text-luga-muted uppercase">PILLAR 01 DESCRIPTION</label>
                  <textarea
                    rows={4}
                    value={formData.pillar1Description}
                    onChange={(e) => handleFieldChange("pillar1Description", e.target.value)}
                    className="w-full bg-transparent border border-luga-border p-1.5 text-xs leading-relaxed"
                  />
                </div>
              </div>

              {/* Pillar 2 */}
              <div className="p-4 border border-luga-border space-y-3">
                <div className="space-y-1">
                  <label className="text-[9px] text-luga-muted uppercase">PILLAR 02 TAG</label>
                  <input
                    type="text"
                    value={formData.pillar2Badge}
                    onChange={(e) => handleFieldChange("pillar2Badge", e.target.value)}
                    className="w-full bg-transparent border border-luga-border p-1.5 text-xs font-bold text-luga-crimson dark:text-luga-gold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] text-luga-muted uppercase">PILLAR 02 TITLE</label>
                  <input
                    type="text"
                    value={formData.pillar2Title}
                    onChange={(e) => handleFieldChange("pillar2Title", e.target.value)}
                    className="w-full bg-transparent border border-luga-border p-1.5 text-xs font-semibold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] text-luga-muted uppercase">PILLAR 02 DESCRIPTION</label>
                  <textarea
                    rows={4}
                    value={formData.pillar2Description}
                    onChange={(e) => handleFieldChange("pillar2Description", e.target.value)}
                    className="w-full bg-transparent border border-luga-border p-1.5 text-xs leading-relaxed"
                  />
                </div>
              </div>

              {/* Pillar 3 */}
              <div className="p-4 border border-luga-border space-y-3">
                <div className="space-y-1">
                  <label className="text-[9px] text-luga-muted uppercase">PILLAR 03 TAG</label>
                  <input
                    type="text"
                    value={formData.pillar3Badge}
                    onChange={(e) => handleFieldChange("pillar3Badge", e.target.value)}
                    className="w-full bg-transparent border border-luga-border p-1.5 text-xs font-bold text-luga-crimson dark:text-luga-gold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] text-luga-muted uppercase">PILLAR 03 TITLE</label>
                  <input
                    type="text"
                    value={formData.pillar3Title}
                    onChange={(e) => handleFieldChange("pillar3Title", e.target.value)}
                    className="w-full bg-transparent border border-luga-border p-1.5 text-xs font-semibold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] text-luga-muted uppercase">PILLAR 03 DESCRIPTION</label>
                  <textarea
                    rows={4}
                    value={formData.pillar3Description}
                    onChange={(e) => handleFieldChange("pillar3Description", e.target.value)}
                    className="w-full bg-transparent border border-luga-border p-1.5 text-xs leading-relaxed"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. KTM STUDIO VISIT CTA */}
        <section className="p-6 bg-luga-bg dark:bg-[#0F0F0F] border border-luga-border dark:border-luga-darkBorder space-y-6">
          <div className="border-b border-luga-border/60 pb-3 flex items-center justify-between">
            <div>
              <span className="font-mono text-[9px] tracking-mega uppercase text-luga-crimson dark:text-luga-gold">
                SECTION 05
              </span>
              <h2 className="font-editorial text-2xl text-luga-ink dark:text-luga-darkInk uppercase">
                KTM STUDIO VISIT & LOCATION CTA
              </h2>
            </div>
            <MapPin className="w-5 h-5 text-luga-gold" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
            <div className="space-y-1 sm:col-span-2">
              <label className="text-[10px] text-luga-muted uppercase font-bold">
                VISIT SECTION HEADLINE
              </label>
              <input
                type="text"
                value={formData.salonHeading}
                onChange={(e) => handleFieldChange("salonHeading", e.target.value)}
                placeholder="e.g. VISIT THE KTM STUDIO"
                className="w-full bg-transparent border border-luga-border p-2.5 text-luga-ink dark:text-luga-darkInk focus:outline-none"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-[10px] text-luga-muted uppercase font-bold">
                SALON DESCRIPTION / INVITATION COPY
              </label>
              <textarea
                rows={2}
                value={formData.salonDescription}
                onChange={(e) => handleFieldChange("salonDescription", e.target.value)}
                className="w-full bg-transparent border border-luga-border p-2.5 text-luga-ink dark:text-luga-darkInk focus:outline-none"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-[10px] text-luga-muted uppercase font-bold">
                STUDIO PHYSICAL ADDRESS (SYNCED GLOBALLY ACROSS SITE)
              </label>
              <input
                type="text"
                value={studioAddressInput}
                onChange={(e) => setStudioAddressInput(e.target.value)}
                placeholder="Studio address in Kathmandu/Patan..."
                className="w-full bg-transparent border border-luga-border p-2.5 text-luga-ink dark:text-luga-darkInk focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-luga-muted uppercase font-bold">
                CTA BUTTON LABEL
              </label>
              <input
                type="text"
                value={formData.salonCtaText}
                onChange={(e) => handleFieldChange("salonCtaText", e.target.value)}
                placeholder="e.g. EXPLORE READY-TO-WEAR ARCHIVE"
                className="w-full bg-transparent border border-luga-border p-2.5 text-luga-ink dark:text-luga-darkInk focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-luga-muted uppercase font-bold">
                CTA BUTTON TARGET LINK
              </label>
              <input
                type="text"
                value={formData.salonCtaLink}
                onChange={(e) => handleFieldChange("salonCtaLink", e.target.value)}
                placeholder="e.g. /shop"
                className="w-full bg-transparent border border-luga-border p-2.5 text-luga-ink dark:text-luga-darkInk focus:outline-none"
              />
            </div>
          </div>
        </section>

        {/* Bottom Save & Revert Actions Bar */}
        <div className="p-5 bg-luga-surface dark:bg-luga-darkSurface border border-luga-border dark:border-luga-darkBorder flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs sticky bottom-4 z-20 shadow-xl">
          <button
            onClick={handleReset}
            className="px-4 py-2.5 border border-luga-border hover:border-red-500 hover:text-red-500 text-luga-muted uppercase tracking-wider flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>RESET TO ATELIER DEFAULTS</span>
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <a
              href="/about"
              target="_blank"
              rel="noreferrer"
              className="w-1/2 sm:w-auto px-4 py-2.5 border border-luga-border hover:border-luga-ink text-center uppercase tracking-wider"
            >
              PREVIEW LIVE
            </a>

            <button
              onClick={() => handleSave()}
              disabled={isSaving}
              className="w-1/2 sm:w-auto px-8 py-2.5 bg-luga-ink text-white dark:bg-luga-darkInk dark:text-black uppercase tracking-ultra font-bold flex items-center justify-center gap-2 hover:bg-luga-crimson dark:hover:bg-luga-gold transition-colors disabled:opacity-75 shadow-sm"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? "SAVING..." : "SAVE ABOUT PAGE"}</span>
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
