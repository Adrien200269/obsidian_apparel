"use client";

import React from "react";
import Link from "next/link";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useStore } from "@/lib/store-context";
import { formatNpr } from "@/lib/utils";
import {
  DollarSign,
  ShoppingBag,
  Shirt,
  AlertTriangle,
  Image as ImageIcon,
  ArrowRight,
  Plus,
  Eye,
  CheckCircle2,
  Compass,
  Home,
  BookOpen,
  Sparkles,
} from "lucide-react";

export default function AdminDashboardPage() {
  const { products, orders, mediaSlots, collections } = useStore();

  // Metrics
  const totalRevenueNpr = orders.reduce((sum, o) => sum + o.totalNpr, 0);
  const totalOrdersCount = orders.length;
  const activeProductsCount = products.filter((p) => !p.isArchived).length;

  const lowStockCount = products.reduce((count, p) => {
    const hasLow = p.variants?.some((v) => v.stockQuantity > 0 && v.stockQuantity <= 5);
    return hasLow ? count + 1 : count;
  }, 0);

  // Slots stats
  const slotList = Object.values(mediaSlots);
  const uploadedSlotsCount = slotList.filter((s) => Boolean(s.imageUrl)).length;
  const awaitingSlotsCount = slotList.length - uploadedSlotsCount;

  return (
    <AdminLayout>
      <div className="space-y-10">
        {/* Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-luga-border dark:border-luga-darkBorder pb-6 gap-4">
          <div>
            <span className="font-mono text-[10px] sm:text-xs tracking-mega uppercase text-luga-crimson dark:text-luga-gold">
              OBSIDIAN ATELIER // KATHMANDU
            </span>
            <h1 className="font-editorial text-3xl sm:text-5xl uppercase tracking-tight text-luga-ink dark:text-luga-darkInk mt-1">
              STUDIO DASHBOARD
            </h1>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 font-mono text-xs w-full sm:w-auto">
            <Link
              href="/admin/about"
              className="px-4 py-2.5 border border-luga-border hover:border-luga-ink text-luga-ink dark:text-luga-darkInk uppercase tracking-ultra flex items-center justify-center gap-2 transition-colors text-center"
            >
              <Compass className="w-4 h-4 shrink-0 text-luga-crimson dark:text-luga-gold" />
              <span>ABOUT STORY CMS</span>
            </Link>
            <Link
              href="/admin/site-media"
              className="px-4 py-2.5 bg-luga-crimson text-white dark:bg-luga-gold dark:text-black uppercase tracking-ultra flex items-center justify-center gap-2 hover:opacity-90 transition-opacity text-center"
            >
              <ImageIcon className="w-4 h-4 shrink-0" />
              <span>SITE IMAGE MANAGER</span>
            </Link>
            <Link
              href="/admin/products"
              className="px-4 py-2.5 bg-luga-ink text-white dark:bg-luga-darkInk dark:text-black uppercase tracking-ultra flex items-center justify-center gap-2 hover:opacity-90 transition-opacity text-center"
            >
              <Plus className="w-4 h-4 shrink-0" />
              <span>NEW GARMENT</span>
            </Link>
          </div>
        </div>

        {/* KPI Cards in NPR */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-mono">
          {/* Revenue */}
          <div className="p-6 bg-luga-bg dark:bg-[#0F0F0F] border border-luga-border dark:border-luga-darkBorder space-y-2">
            <div className="flex items-center justify-between text-luga-muted dark:text-luga-darkMuted text-xs uppercase tracking-wider">
              <span>TOTAL REVENUE</span>
              <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-luga-ink dark:text-luga-darkInk">
              {formatNpr(totalRevenueNpr)}
            </div>
            <div className="text-[10px] text-luga-muted tracking-wide">
              {orders.filter((o) => o.paymentStatus === "PAID").length} PAID ORDERS IN NEPAL
            </div>
          </div>

          {/* Orders */}
          <div className="p-6 bg-luga-bg dark:bg-[#0F0F0F] border border-luga-border dark:border-luga-darkBorder space-y-2">
            <div className="flex items-center justify-between text-luga-muted dark:text-luga-darkMuted text-xs uppercase tracking-wider">
              <span>TOTAL ORDERS</span>
              <ShoppingBag className="w-4 h-4 text-luga-crimson dark:text-luga-gold" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-luga-ink dark:text-luga-darkInk">
              {totalOrdersCount}
            </div>
            <div className="text-[10px] text-luga-muted tracking-wide">
              {orders.filter((o) => o.orderStatus === "PENDING").length} AWAITING DISPATCH
            </div>
          </div>

          {/* Active Garments */}
          <div className="p-6 bg-luga-bg dark:bg-[#0F0F0F] border border-luga-border dark:border-luga-darkBorder space-y-2">
            <div className="flex items-center justify-between text-luga-muted dark:text-luga-darkMuted text-xs uppercase tracking-wider">
              <span>ACTIVE GARMENTS</span>
              <Shirt className="w-4 h-4 text-luga-ink dark:text-luga-darkInk" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-luga-ink dark:text-luga-darkInk">
              {activeProductsCount}
            </div>
            <div className="text-[10px] text-luga-muted tracking-wide">
              ACROSS {collections.length} CURATED VOLUMES
            </div>
          </div>

          {/* Low Stock Alerts */}
          <div className="p-6 bg-luga-bg dark:bg-[#0F0F0F] border border-luga-border dark:border-luga-darkBorder space-y-2">
            <div className="flex items-center justify-between text-luga-muted dark:text-luga-darkMuted text-xs uppercase tracking-wider">
              <span>LOW STOCK ALERTS</span>
              <AlertTriangle className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-luga-ink dark:text-luga-darkInk">
              {lowStockCount}
            </div>
            <div className="text-[10px] text-amber-600 dark:text-amber-400 tracking-wide">
              GARMENTS UNDER 5 UNITS IN PATAN
            </div>
          </div>
        </div>

        {/* Storefront Page CMS Control Rooms */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-luga-border dark:border-luga-darkBorder pb-2">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-mega text-luga-crimson dark:text-luga-gold">
                STOREFRONT CONTROL ROOMS
              </span>
              <h2 className="font-editorial text-2xl uppercase tracking-tight text-luga-ink dark:text-luga-darkInk">
                PAGE-BY-PAGE EDITORIAL CMS
              </h2>
            </div>
            <span className="font-mono text-xs text-luga-muted dark:text-luga-darkMuted hidden sm:inline">
              ALL PAGES ARE LIVE & EDITABLE
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 font-mono text-xs">
            {/* 1. Home */}
            <Link
              href="/admin/home"
              className="p-5 bg-luga-bg dark:bg-[#0F0F0F] border border-luga-border dark:border-luga-darkBorder hover:border-luga-ink dark:hover:border-luga-darkInk transition-all duration-200 group flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="p-2 bg-luga-crimson/10 dark:bg-luga-gold/10 text-luga-crimson dark:text-luga-gold">
                    <Home className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] uppercase px-1.5 py-0.5 bg-luga-surface dark:bg-luga-darkSurface text-luga-muted">
                    ROUTE /
                  </span>
                </div>
                <h3 className="font-editorial text-lg text-luga-ink dark:text-luga-darkInk uppercase">
                  Homepage CMS
                </h3>
                <p className="text-[10px] text-luga-muted dark:text-luga-darkMuted leading-relaxed">
                  Hero campaign film, split editorial frames, volume intros, and atelier story.
                </p>
              </div>
              <div className="flex items-center justify-between text-[10px] text-luga-crimson dark:text-luga-gold font-bold uppercase tracking-wider pt-2 border-t border-luga-border/30">
                <span>EDIT HOME</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* 2. Shop */}
            <Link
              href="/admin/shop-page"
              className="p-5 bg-luga-bg dark:bg-[#0F0F0F] border border-luga-border dark:border-luga-darkBorder hover:border-luga-ink dark:hover:border-luga-darkInk transition-all duration-200 group flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="p-2 bg-luga-crimson/10 dark:bg-luga-gold/10 text-luga-crimson dark:text-luga-gold">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] uppercase px-1.5 py-0.5 bg-luga-surface dark:bg-luga-darkSurface text-luga-muted">
                    ROUTE /shop
                  </span>
                </div>
                <h3 className="font-editorial text-lg text-luga-ink dark:text-luga-darkInk uppercase">
                  Shop Archive CMS
                </h3>
                <p className="text-[10px] text-luga-muted dark:text-luga-darkMuted leading-relaxed">
                  Catalog headers, category descriptions, and bespoke hero media for Outerwear, Knitwear & more.
                </p>
              </div>
              <div className="flex items-center justify-between text-[10px] text-luga-crimson dark:text-luga-gold font-bold uppercase tracking-wider pt-2 border-t border-luga-border/30">
                <span>EDIT SHOP</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* 3. About */}
            <Link
              href="/admin/about"
              className="p-5 bg-luga-bg dark:bg-[#0F0F0F] border border-luga-border dark:border-luga-darkBorder hover:border-luga-ink dark:hover:border-luga-darkInk transition-all duration-200 group flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="p-2 bg-luga-crimson/10 dark:bg-luga-gold/10 text-luga-crimson dark:text-luga-gold">
                    <Compass className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] uppercase px-1.5 py-0.5 bg-luga-surface dark:bg-luga-darkSurface text-luga-muted">
                    ROUTE /about
                  </span>
                </div>
                <h3 className="font-editorial text-lg text-luga-ink dark:text-luga-darkInk uppercase">
                  About & Story CMS
                </h3>
                <p className="text-[10px] text-luga-muted dark:text-luga-darkMuted leading-relaxed">
                  Valley manifesto, 3 technical discipline pillars, and Patan Salon visiting details.
                </p>
              </div>
              <div className="flex items-center justify-between text-[10px] text-luga-crimson dark:text-luga-gold font-bold uppercase tracking-wider pt-2 border-t border-luga-border/30">
                <span>EDIT ABOUT</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* 4. Lookbook */}
            <Link
              href="/admin/lookbook"
              className="p-5 bg-luga-bg dark:bg-[#0F0F0F] border border-luga-border dark:border-luga-darkBorder hover:border-luga-ink dark:hover:border-luga-darkInk transition-all duration-200 group flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="p-2 bg-luga-crimson/10 dark:bg-luga-gold/10 text-luga-crimson dark:text-luga-gold">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] uppercase px-1.5 py-0.5 bg-luga-surface dark:bg-luga-darkSurface text-luga-muted">
                    ROUTE /lookbook
                  </span>
                </div>
                <h3 className="font-editorial text-lg text-luga-ink dark:text-luga-darkInk uppercase">
                  Lookbook & Film
                </h3>
                <p className="text-[10px] text-luga-muted dark:text-luga-darkMuted leading-relaxed">
                  35mm cinematic film reels, editorial headers, and analog frame shop-the-look tags.
                </p>
              </div>
              <div className="flex items-center justify-between text-[10px] text-luga-crimson dark:text-luga-gold font-bold uppercase tracking-wider pt-2 border-t border-luga-border/30">
                <span>EDIT LOOKBOOK</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* 5. Footer */}
            <Link
              href="/admin/footer"
              className="p-5 bg-luga-bg dark:bg-[#0F0F0F] border border-luga-border dark:border-luga-darkBorder hover:border-luga-ink dark:hover:border-luga-darkInk transition-all duration-200 group flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="p-2 bg-luga-crimson/10 dark:bg-luga-gold/10 text-luga-crimson dark:text-luga-gold">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] uppercase px-1.5 py-0.5 bg-luga-surface dark:bg-luga-darkSurface text-luga-muted">
                    ALL PAGES
                  </span>
                </div>
                <h3 className="font-editorial text-lg text-luga-ink dark:text-luga-darkInk uppercase">
                  Footer & Enclave
                </h3>
                <p className="text-[10px] text-luga-muted dark:text-luga-darkMuted leading-relaxed">
                  Patron VIP newsletter invitations, craft quarter coordinates, and universal statements.
                </p>
              </div>
              <div className="flex items-center justify-between text-[10px] text-luga-crimson dark:text-luga-gold font-bold uppercase tracking-wider pt-2 border-t border-luga-border/30">
                <span>EDIT FOOTER</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
        <div className="p-6 sm:p-8 bg-luga-bg dark:bg-[#0F0F0F] border border-luga-border dark:border-luga-darkBorder flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 font-mono text-[10px] tracking-mega text-luga-crimson dark:text-luga-gold uppercase">
              <ImageIcon className="w-3.5 h-3.5" />
              <span>CENTRAL WEBSITE MEDIA HUB</span>
            </div>
            <h3 className="font-editorial text-2xl sm:text-3xl text-luga-ink dark:text-luga-darkInk">
              Replace Wireframe Slots with Editorial Photos
            </h3>
            <p className="font-mono text-xs text-luga-muted dark:text-luga-darkMuted leading-relaxed">
              Every slot across the storefront (Hero banners, split editorial frames, category headers, brand logos, and Fonepay QR code) is immediately manageable. Currently: <strong>{uploadedSlotsCount} uploaded</strong>, <strong>{awaitingSlotsCount} awaiting upload</strong>.
            </p>
          </div>

          <Link
            href="/admin/site-media"
            className="px-6 py-3.5 bg-luga-ink text-white dark:bg-luga-darkInk dark:text-black font-mono text-xs uppercase tracking-ultra flex items-center justify-center gap-2 hover:bg-luga-crimson dark:hover:bg-luga-gold transition-colors flex-shrink-0"
          >
            <span>MANAGE ALL SLOTS</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Recent Orders Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-editorial text-2xl uppercase tracking-tight text-luga-ink dark:text-luga-darkInk">
              RECENT STOREFRONT ORDERS
            </h2>
            <Link
              href="/admin/orders"
              className="font-mono text-xs uppercase tracking-ultra text-luga-muted hover:text-luga-ink dark:text-luga-darkMuted dark:hover:text-luga-darkInk"
            >
              VIEW ALL ORDERS ({orders.length}) →
            </Link>
          </div>

          <div className="overflow-x-auto border border-luga-border dark:border-luga-darkBorder bg-luga-bg dark:bg-[#0F0F0F]">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="bg-luga-surface/50 dark:bg-luga-darkSurface/50 border-b border-luga-border dark:border-luga-darkBorder text-[10px] uppercase tracking-wider text-luga-muted">
                  <th className="p-4">ORDER NUMBER</th>
                  <th className="p-4">CUSTOMER</th>
                  <th className="p-4">DELIVERY ZONE</th>
                  <th className="p-4">PAYMENT</th>
                  <th className="p-4">TOTAL (NPR)</th>
                  <th className="p-4">STATUS</th>
                  <th className="p-4 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-luga-border/50 dark:divide-luga-darkBorder/50">
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="hover:bg-luga-surface/30 dark:hover:bg-luga-darkSurface/30 transition-colors">
                    <td className="p-4 font-bold text-luga-ink dark:text-luga-darkInk">
                      {order.orderNumber}
                    </td>
                    <td className="p-4">
                      <div>{order.customerName}</div>
                      <div className="text-[10px] text-luga-muted">{order.phone}</div>
                    </td>
                    <td className="p-4 text-luga-muted">
                      {order.deliveryZone.replace(/_/g, " ")}
                    </td>
                    <td className="p-4">
                      <span className="font-semibold">{order.paymentMethod}</span>
                      <div className="text-[9px] text-luga-muted">{order.paymentStatus}</div>
                    </td>
                    <td className="p-4 font-bold text-luga-crimson dark:text-luga-gold">
                      {formatNpr(order.totalNpr)}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 text-[9px] uppercase tracking-wider font-bold ${
                          order.orderStatus === "DELIVERED"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                            : order.orderStatus === "CONFIRMED" || order.orderStatus === "PROCESSING"
                            ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30"
                            : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30"
                        }`}
                      >
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <Link
                        href="/admin/orders"
                        className="inline-flex items-center gap-1 text-[10px] uppercase text-luga-ink hover:underline dark:text-luga-darkInk"
                      >
                        <span>MANAGE</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
