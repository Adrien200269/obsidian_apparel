"use client";

import React, { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useStore } from "@/lib/store-context";
import { Check, RotateCcw, Save, ShieldAlert, Compass } from "lucide-react";

export default function AdminSettingsPage() {
  const { settings, updateSettings, resetAllToDefault } = useStore();

  const [announcementText, setAnnouncementText] = useState(settings.announcementText);
  const [announcementActive, setAnnouncementActive] = useState(settings.announcementActive);
  const [shippingInsideRingRoadNpr, setShippingInsideRingRoadNpr] = useState(settings.shippingInsideRingRoadNpr);
  const [shippingOutsideRingRoadNpr, setShippingOutsideRingRoadNpr] = useState(settings.shippingOutsideRingRoadNpr);
  const [shippingOutsideValleyNpr, setShippingOutsideValleyNpr] = useState(settings.shippingOutsideValleyNpr);
  const [freeShippingThresholdNpr, setFreeShippingThresholdNpr] = useState(settings.freeShippingThresholdNpr);
  const [whatsappNumber, setWhatsappNumber] = useState(settings.whatsappNumber);
  const [instagramHandle, setInstagramHandle] = useState(settings.instagramHandle);
  const [studioAddress, setStudioAddress] = useState(settings.studioAddress);

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateSettings({
        announcementText,
        announcementActive,
        shippingInsideRingRoadNpr,
        shippingOutsideRingRoadNpr,
        shippingOutsideValleyNpr,
        freeShippingThresholdNpr,
        whatsappNumber,
        instagramHandle,
        studioAddress,
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch (err) {
      console.error("Save settings error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8 max-w-4xl">
        <div className="border-b border-luga-border dark:border-luga-darkBorder pb-6">
          <span className="font-mono text-[10px] sm:text-xs tracking-mega uppercase text-luga-crimson dark:text-luga-gold">
            SITE CONFIGURATION & LOGISTICS
          </span>
          <h1 className="font-editorial text-3xl sm:text-5xl uppercase tracking-tight text-luga-ink dark:text-luga-darkInk mt-1">
            STORE SETTINGS & ANNOUNCEMENT CMS
          </h1>
          <p className="font-mono text-xs text-luga-muted dark:text-luga-darkMuted mt-1">
            Control the top marquee announcement, Nepal shipping tiers, WhatsApp customer concierge, and studio parameters.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-8 font-mono text-xs">
          {/* 1. Marquee Announcement Bar */}
          <div className="p-6 bg-luga-bg dark:bg-[#0F0F0F] border border-luga-border dark:border-luga-darkBorder space-y-4">
            <div className="flex items-center justify-between border-b border-luga-border/50 pb-2">
              <h3 className="text-xs uppercase tracking-mega font-bold text-luga-ink dark:text-luga-darkInk">
                01 // TOP MARQUEE ANNOUNCEMENT BAR
              </h3>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={announcementActive}
                  onChange={(e) => setAnnouncementActive(e.target.checked)}
                  className="accent-luga-crimson dark:accent-luga-gold"
                />
                <span className="text-[10px] uppercase font-bold text-luga-ink dark:text-luga-darkInk">
                  Active On Storefront
                </span>
              </label>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-luga-muted uppercase">
                MARQUEE ANNOUNCEMENT TEXT
              </label>
              <textarea
                rows={2}
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                placeholder="VOLUME I: KATHMANDU ARCHIVE LIVE NOW..."
                className="w-full bg-transparent border border-luga-border dark:border-luga-darkBorder p-3 text-luga-ink dark:text-luga-darkInk focus:outline-none"
              />
              <p className="text-[9px] text-luga-muted">
                This message scrolls continuously across the very top of all customer storefront pages.
              </p>
            </div>
          </div>

          {/* 2. Nepal Domestic Shipping Rates */}
          <div className="p-6 bg-luga-bg dark:bg-[#0F0F0F] border border-luga-border dark:border-luga-darkBorder space-y-4">
            <h3 className="text-xs uppercase tracking-mega font-bold text-luga-ink dark:text-luga-darkInk border-b border-luga-border/50 pb-2">
              02 // NEPAL LOGISTICS & DELIVERY FEES (NPR रू)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] text-luga-muted uppercase">
                  INSIDE RING ROAD (KTM / LALITPUR)
                </label>
                <div className="flex items-center border border-luga-border dark:border-luga-darkBorder">
                  <span className="px-3 text-luga-muted">NPR</span>
                  <input
                    type="number"
                    min={0}
                    value={shippingInsideRingRoadNpr}
                    onChange={(e) => setShippingInsideRingRoadNpr(Number(e.target.value))}
                    className="w-full bg-transparent p-2.5 text-luga-ink dark:text-luga-darkInk focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-luga-muted uppercase">
                  OUTSIDE RING ROAD (VALLEY OUTSKIRTS)
                </label>
                <div className="flex items-center border border-luga-border dark:border-luga-darkBorder">
                  <span className="px-3 text-luga-muted">NPR</span>
                  <input
                    type="number"
                    min={0}
                    value={shippingOutsideRingRoadNpr}
                    onChange={(e) => setShippingOutsideRingRoadNpr(Number(e.target.value))}
                    className="w-full bg-transparent p-2.5 text-luga-ink dark:text-luga-darkInk focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-luga-muted uppercase">
                  OUTSIDE VALLEY (DOMESTIC COURIER)
                </label>
                <div className="flex items-center border border-luga-border dark:border-luga-darkBorder">
                  <span className="px-3 text-luga-muted">NPR</span>
                  <input
                    type="number"
                    min={0}
                    value={shippingOutsideValleyNpr}
                    onChange={(e) => setShippingOutsideValleyNpr(Number(e.target.value))}
                    className="w-full bg-transparent p-2.5 text-luga-ink dark:text-luga-darkInk focus:outline-none"
                  />
                </div>
              </div>

              <div className="sm:col-span-3 space-y-1.5 pt-2">
                <label className="text-[10px] text-luga-muted uppercase">
                  FREE DELIVERY SPEND THRESHOLD (NPR)
                </label>
                <div className="flex items-center border border-luga-border dark:border-luga-darkBorder max-w-xs">
                  <span className="px-3 text-luga-muted">NPR</span>
                  <input
                    type="number"
                    min={0}
                    step={1000}
                    value={freeShippingThresholdNpr}
                    onChange={(e) => setFreeShippingThresholdNpr(Number(e.target.value))}
                    className="w-full bg-transparent p-2.5 text-luga-ink dark:text-luga-darkInk focus:outline-none font-bold"
                  />
                </div>
                <p className="text-[9px] text-luga-muted">
                  Orders exceeding this amount receive complimentary Inside Ring Road delivery.
                </p>
              </div>
            </div>
          </div>

          {/* 3. Concierge & Studio Contacts */}
          <div className="p-6 bg-luga-bg dark:bg-[#0F0F0F] border border-luga-border dark:border-luga-darkBorder space-y-4">
            <h3 className="text-xs uppercase tracking-mega font-bold text-luga-ink dark:text-luga-darkInk border-b border-luga-border/50 pb-2">
              03 // CONCIERGE & ATELIER INFO
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] text-luga-muted uppercase">
                  WHATSAPP CONCIERGE PHONE
                </label>
                <input
                  type="text"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  className="w-full bg-transparent border border-luga-border dark:border-luga-darkBorder p-2.5 text-luga-ink dark:text-luga-darkInk focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-luga-muted uppercase">
                  INSTAGRAM HANDLE
                </label>
                <input
                  type="text"
                  value={instagramHandle}
                  onChange={(e) => setInstagramHandle(e.target.value)}
                  className="w-full bg-transparent border border-luga-border dark:border-luga-darkBorder p-2.5 text-luga-ink dark:text-luga-darkInk focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-[10px] text-luga-muted uppercase">
                  ATELIER PHYSICAL ADDRESS
                </label>
                <input
                  type="text"
                  value={studioAddress}
                  onChange={(e) => setStudioAddress(e.target.value)}
                  className="w-full bg-transparent border border-luga-border dark:border-luga-darkBorder p-2.5 text-luga-ink dark:text-luga-darkInk focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Submit Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 pt-4">
            <button
              type="submit"
              disabled={isSaving}
              className="w-full sm:w-auto px-8 py-3.5 bg-luga-ink text-white dark:bg-luga-darkInk dark:text-black uppercase tracking-ultra flex items-center justify-center gap-2 hover:bg-luga-crimson dark:hover:bg-luga-gold transition-colors font-bold text-center disabled:opacity-75 disabled:cursor-wait"
            >
              {isSaving ? (
                <>
                  <Compass className="w-4 h-4 animate-spin-slow text-luga-crimson dark:text-luga-gold" />
                  <span>SYNCING TO SUPABASE...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{savedSuccess ? "SETTINGS SAVED TO SUPABASE ✓" : "SAVE SETTINGS"}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                if (confirm("Reset all store products, orders, media slots, and settings to factory defaults?")) {
                  resetAllToDefault();
                  alert("Obsidian Apparel store restored to default archival state.");
                  window.location.reload();
                }
              }}
              className="w-full sm:w-auto px-4 py-2.5 border border-dashed border-red-500/50 text-red-500 hover:bg-red-500/10 uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors text-center"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>RESTORE INITIAL DEFAULTS</span>
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
