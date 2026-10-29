"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store-context";
import { ArrowRight, Check } from "lucide-react";

export const Footer: React.FC = () => {
  const { settings, getFooterContent } = useStore();
  const footerContent = getFooterContent();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="w-full bg-[#111111] dark:bg-[#0D0D0D] text-[#E5E3DF] border-t border-black/40 dark:border-white/10 transition-colors">
      {/* OBSIDIAN ENCLAVE / COMMUNITY BANNER */}
      <div className="border-b border-white/10 py-12 sm:py-16 px-4 sm:px-12">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <span className="font-mono text-[10px] tracking-mega uppercase text-luga-gold">
            {footerContent.enclaveTag}
          </span>
          <h2 className="font-editorial text-2xl sm:text-4xl lg:text-5xl text-white font-light break-words">
            {footerContent.enclaveHeading}
          </h2>
          <p className="text-xs sm:text-sm font-mono tracking-wider text-[#A3A09A] max-w-xl mx-auto leading-relaxed">
            {footerContent.enclaveDescription}
          </p>

          <form onSubmit={handleSubscribe} className="mt-6 sm:mt-8 max-w-md mx-auto flex flex-col sm:flex-row items-stretch gap-2 sm:gap-0">
            {subscribed ? (
              <div className="w-full py-3 px-4 bg-white/10 border border-luga-gold text-luga-gold font-mono text-xs flex items-center justify-center gap-2">
                <Check className="w-4 h-4" />
                <span>WELCOME TO THE OBSIDIAN ENCLAVE ARCHIVE</span>
              </div>
            ) : (
              <>
                <input
                  type="email"
                  required
                  placeholder="ENTER YOUR EMAIL FOR ARCHIVE ACCESS"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-white/5 border border-white/20 px-4 py-3 text-xs font-mono text-white placeholder:text-white/40 focus:outline-none focus:border-luga-gold transition-colors"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-white text-black font-mono text-xs uppercase tracking-ultra hover:bg-luga-gold hover:text-black transition-colors flex items-center justify-center gap-2"
                >
                  <span>JOIN</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </form>
        </div>
      </div>

      {/* Main Footer Directory */}
      <div className="max-w-[1920px] mx-auto px-4 sm:px-12 py-12 sm:py-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 font-mono text-xs">
        {/* Brand Column */}
        <div className="space-y-4">
          <div>
            <div className="font-editorial text-2xl sm:text-3xl uppercase tracking-widest text-white">
              OBSIDIAN APPAREL
            </div>
            <div className="font-mono text-[9px] sm:text-[10px] tracking-[0.25em] uppercase text-luga-gold/90 font-light mt-1">
              KATHMANDU 2026
            </div>
          </div>
          <p className="text-[#A3A09A] leading-relaxed text-[11px] tracking-wider">
            {footerContent.brandDescription}
          </p>
          <div className="text-[10px] text-luga-gold tracking-widest uppercase">
            {footerContent.craftQuarterLocation}
          </div>
        </div>

        {/* Directory Columns */}
        <div className="space-y-3">
          <div className="text-[10px] uppercase tracking-mega text-white font-bold pb-1 border-b border-white/10">
            COLLECTIONS & ARCHIVES
          </div>
          <ul className="space-y-2 text-[#A3A09A] text-[11px] tracking-wider">
            <li>
              <Link href="/collections/volume-1" className="hover:text-white transition-colors">
                Volume I: Kathmandu Archive
              </Link>
            </li>
            <li>
              <Link href="/collections/core-archive" className="hover:text-white transition-colors">
                Core Streetwear Capsule (420 GSM)
              </Link>
            </li>
            <li>
              <Link href="/collections/himalayan-winter" className="hover:text-white transition-colors">
                Himalayan Monolith // Winter
              </Link>
            </li>
            <li>
              <Link href="/lookbook" className="hover:text-white transition-colors">
                Lookbook Film Archive
              </Link>
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <div className="text-[10px] uppercase tracking-mega text-white font-bold pb-1 border-b border-white/10">
            CLIENT SERVICES // NEPAL
          </div>
          <ul className="space-y-2 text-[#A3A09A] text-[11px] tracking-wider">
            <li>
              <Link href="/about" className="hover:text-white transition-colors">
                The Valley Manifesto & Craft
              </Link>
            </li>
            <li>
              <a
                href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="hover:text-luga-gold transition-colors flex items-center gap-1.5"
              >
                <span>WhatsApp Concierge: {settings.whatsappNumber}</span>
              </a>
            </li>
            <li>
              <span className="text-[#888]">
                Inside Ring Road: NPR {settings.shippingInsideRingRoadNpr}
              </span>
            </li>
            <li>
              <span className="text-[#888]">
                Outside Ring Road: NPR {settings.shippingOutsideRingRoadNpr}
              </span>
            </li>
            <li>
              <span className="text-[#888]">
                Outside Valley Courier: NPR {settings.shippingOutsideValleyNpr}
              </span>
            </li>
          </ul>
        </div>

        {/* Studio & Legal */}
        <div className="space-y-3">
          <div className="text-[10px] uppercase tracking-mega text-white font-bold pb-1 border-b border-white/10">
            ATELIER & ADMIN
          </div>
          <p className="text-[11px] text-[#A3A09A] leading-relaxed">
            {settings.studioAddress}
          </p>
          <div className="pt-2">
            <Link
              href="/admin"
              className="inline-block px-3 py-1.5 border border-white/20 hover:border-luga-gold text-white hover:text-luga-gold text-[10px] uppercase tracking-ultra transition-colors"
            >
              ACCESS ADMIN CMS →
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 py-6 px-4 sm:px-12 flex flex-col sm:flex-row items-center justify-between text-[10px] font-mono text-[#73706A] tracking-wider gap-4 text-center sm:text-left">
        <div>
          © {new Date().getFullYear()} {footerContent.copyrightText}
        </div>
        <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3 sm:gap-6 text-center sm:text-right">
          <span>CURRENCY: NPR (रू)</span>
          <span>MADE IN NEPAL</span>
          <span>RASTAH.CO INSPIRED ARCHITECTURE</span>
        </div>
      </div>
    </footer>
  );
};
