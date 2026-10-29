"use client";

import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useStore } from "@/lib/store-context";
import { FooterPageData } from "@/types";
import {
  Sparkles,
  Save,
  RotateCcw,
  Check,
  ExternalLink,
  MapPin,
  MessageCircle,
  Instagram,
  ShieldCheck,
  Layers,
} from "lucide-react";

export default function AdminFooterPage() {
  const {
    getFooterContent,
    updateFooterContent,
    resetFooterContent,
    settings,
    updateSettings,
    isSyncing,
  } = useStore();

  const [formData, setFormData] = useState<FooterPageData>(getFooterContent());
  const [studioAddress, setStudioAddress] = useState(settings.studioAddress);
  const [whatsappNumber, setWhatsappNumber] = useState(settings.whatsappNumber);
  const [instagramHandle, setInstagramHandle] = useState(settings.instagramHandle);

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setFormData(getFooterContent());
    setStudioAddress(settings.studioAddress);
    setWhatsappNumber(settings.whatsappNumber);
    setInstagramHandle(settings.instagramHandle);
  }, [getFooterContent, settings.studioAddress, settings.whatsappNumber, settings.instagramHandle]);

  const handleFieldChange = (field: keyof FooterPageData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    try {
      await updateFooterContent(formData);
      await updateSettings({
        studioAddress,
        whatsappNumber,
        instagramHandle,
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3500);
    } catch (err) {
      console.error("Save footer CMS error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    if (confirm("Reset Global Footer and Enclave patron copy to default luxury values?")) {
      await resetFooterContent();
      setFormData(getFooterContent());
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3500);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-10 max-w-5xl pb-24 font-mono text-xs">
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-luga-border dark:border-luga-darkBorder pb-6 gap-4">
          <div>
            <div className="flex items-center gap-2 text-[10px] sm:text-xs tracking-mega uppercase text-luga-crimson dark:text-luga-gold">
              <Layers className="w-3.5 h-3.5" />
              <span>GLOBAL FOOTER & PATRON CMS // ALL PAGES</span>
            </div>
            <h1 className="font-editorial text-3xl sm:text-5xl uppercase tracking-tight text-luga-ink dark:text-luga-darkInk mt-1">
              FOOTER & ENCLAVE CMS
            </h1>
            <p className="text-luga-muted dark:text-luga-darkMuted mt-1 max-w-2xl leading-relaxed">
              Control the universal Luga Enclave newsletter invitation, brand heritage narrative, Patan craft coordinates, and copyright statements displayed across every storefront page.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2.5 border border-luga-border dark:border-luga-darkBorder text-luga-muted hover:border-luga-crimson hover:text-luga-crimson uppercase tracking-wider flex items-center gap-2 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>RESET DEFAULTS</span>
            </button>
            <button
              type="button"
              onClick={() => handleSave()}
              disabled={isSaving}
              className="px-6 py-2.5 bg-luga-ink text-white dark:bg-luga-darkInk dark:text-black uppercase tracking-ultra flex items-center gap-2 hover:bg-luga-crimson dark:hover:bg-luga-gold transition-colors shadow-sm disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white dark:border-black border-t-transparent rounded-full animate-spin" />
                  <span>PUBLISHING...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>PUBLISH FOOTER CMS</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Success Alert */}
        {savedSuccess && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="font-bold tracking-wider uppercase">
                GLOBAL FOOTER CONTENT PUBLISHED TO SUPABASE SUCCESSFULLY
              </span>
            </div>
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="underline flex items-center gap-1 hover:opacity-80"
            >
              <span>VIEW STOREFRONT</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-10">
          {/* SECTION 1: OBSIDIAN ENCLAVE / PATRON NEWSLETTER BANNER */}
          <div className="p-6 sm:p-8 bg-luga-bg dark:bg-[#0F0F0F] border border-luga-border dark:border-luga-darkBorder space-y-6">
            <div className="flex items-center gap-2 border-b border-luga-border/50 pb-3">
              <span className="px-2 py-0.5 bg-luga-crimson/10 text-luga-crimson dark:bg-luga-gold/10 dark:text-luga-gold font-bold text-[10px]">
                01
              </span>
              <h2 className="text-sm uppercase tracking-mega font-bold text-luga-ink dark:text-luga-darkInk">
                OBSIDIAN ENCLAVE // PRIVATE PATRON ARCHIVE ACCESS BANNER
              </h2>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] text-luga-muted uppercase tracking-wider">
                  ENCLAVE EYEBROW METADATA TAG
                </label>
                <input
                  type="text"
                  value={formData.enclaveTag}
                  onChange={(e) => handleFieldChange("enclaveTag", e.target.value)}
                  className="w-full bg-transparent border border-luga-border dark:border-luga-darkBorder p-2.5 text-luga-ink dark:text-luga-darkInk focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-luga-muted uppercase tracking-wider">
                  ENCLAVE INVITATION HEADLINE
                </label>
                <input
                  type="text"
                  value={formData.enclaveHeading}
                  onChange={(e) => handleFieldChange("enclaveHeading", e.target.value)}
                  className="w-full bg-transparent border border-luga-border dark:border-luga-darkBorder p-2.5 font-editorial text-lg text-luga-ink dark:text-luga-darkInk focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-luga-muted uppercase tracking-wider">
                  ENCLAVE EXPLANATORY SUBTITLE / PERKS
                </label>
                <textarea
                  rows={2}
                  value={formData.enclaveDescription}
                  onChange={(e) => handleFieldChange("enclaveDescription", e.target.value)}
                  className="w-full bg-transparent border border-luga-border dark:border-luga-darkBorder p-2.5 text-luga-ink dark:text-luga-darkInk focus:outline-none leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: FOOTER BRAND STORY & LOCATION */}
          <div className="p-6 sm:p-8 bg-luga-bg dark:bg-[#0F0F0F] border border-luga-border dark:border-luga-darkBorder space-y-6">
            <div className="flex items-center gap-2 border-b border-luga-border/50 pb-3">
              <span className="px-2 py-0.5 bg-luga-crimson/10 text-luga-crimson dark:bg-luga-gold/10 dark:text-luga-gold font-bold text-[10px]">
                02
              </span>
              <h2 className="text-sm uppercase tracking-mega font-bold text-luga-ink dark:text-luga-darkInk">
                BRAND ARCHIVE SUMMARY & PHYSICAL CRAFT QUARTER STAMP
              </h2>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] text-luga-muted uppercase tracking-wider">
                  FOOTER BRAND PHILOSOPHY SUMMARY
                </label>
                <textarea
                  rows={3}
                  value={formData.brandDescription}
                  onChange={(e) => handleFieldChange("brandDescription", e.target.value)}
                  className="w-full bg-transparent border border-luga-border dark:border-luga-darkBorder p-2.5 text-luga-ink dark:text-luga-darkInk focus:outline-none leading-relaxed"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-luga-muted uppercase tracking-wider">
                  CRAFT QUARTER LOCATION STAMP
                </label>
                <input
                  type="text"
                  value={formData.craftQuarterLocation}
                  onChange={(e) => handleFieldChange("craftQuarterLocation", e.target.value)}
                  className="w-full bg-transparent border border-luga-border dark:border-luga-darkBorder p-2.5 text-luga-ink dark:text-luga-darkInk focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-luga-muted uppercase tracking-wider">
                  COPYRIGHT LEGAL STATEMENT
                </label>
                <input
                  type="text"
                  value={formData.copyrightText}
                  onChange={(e) => handleFieldChange("copyrightText", e.target.value)}
                  className="w-full bg-transparent border border-luga-border dark:border-luga-darkBorder p-2.5 text-luga-ink dark:text-luga-darkInk focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: ATELIER ADDRESS & CONCIERGE CHANNELS */}
          <div className="p-6 sm:p-8 bg-luga-bg dark:bg-[#0F0F0F] border border-luga-border dark:border-luga-darkBorder space-y-6">
            <div className="flex items-center gap-2 border-b border-luga-border/50 pb-3">
              <span className="px-2 py-0.5 bg-luga-crimson/10 text-luga-crimson dark:bg-luga-gold/10 dark:text-luga-gold font-bold text-[10px]">
                03
              </span>
              <h2 className="text-sm uppercase tracking-mega font-bold text-luga-ink dark:text-luga-darkInk">
                PHYSICAL ATELIER & DIRECT CONCIERGE CHANNELS
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1 sm:col-span-2">
                <label className="text-[10px] text-luga-muted uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-luga-crimson dark:text-luga-gold" />
                  <span>ATELIER PHYSICAL ADDRESS</span>
                </label>
                <input
                  type="text"
                  value={studioAddress}
                  onChange={(e) => setStudioAddress(e.target.value)}
                  className="w-full bg-transparent border border-luga-border dark:border-luga-darkBorder p-2.5 text-luga-ink dark:text-luga-darkInk focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-luga-muted uppercase tracking-wider flex items-center gap-1.5">
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />
                  <span>WHATSAPP VIP CONCIERGE NUMBER</span>
                </label>
                <input
                  type="text"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  className="w-full bg-transparent border border-luga-border dark:border-luga-darkBorder p-2.5 text-luga-ink dark:text-luga-darkInk focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-luga-muted uppercase tracking-wider flex items-center gap-1.5">
                  <Instagram className="w-3.5 h-3.5 text-purple-400" />
                  <span>OFFICIAL INSTAGRAM HANDLE</span>
                </label>
                <input
                  type="text"
                  value={instagramHandle}
                  onChange={(e) => setInstagramHandle(e.target.value)}
                  className="w-full bg-transparent border border-luga-border dark:border-luga-darkBorder p-2.5 text-luga-ink dark:text-luga-darkInk focus:outline-none"
                />
              </div>
            </div>
          </div>

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
                <span>SAVE & PUBLISH FOOTER</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
