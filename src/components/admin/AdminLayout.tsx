"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { LuxuryLoader } from "@/components/common/LuxuryLoader";
import { useStore } from "@/lib/store-context";
import {
  LayoutDashboard,
  Home,
  Image as ImageIcon,
  Shirt,
  Layers,
  BookOpen,
  ShoppingBag,
  Settings,
  ExternalLink,
  Menu,
  X,
  Compass,
  Sparkles,
  Lock,
  LogOut,
  ShieldCheck,
  ArrowRight,
  User,
} from "lucide-react";

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const {
    orders,
    adminUser,
    isAdminAuthenticated,
    adminLogout,
    isLoaded,
    isSyncing,
  } = useStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // If unauthenticated and on an admin page other than /admin/login, redirect
  useEffect(() => {
    if (isLoaded && !isAdminAuthenticated && pathname !== "/admin/login") {
      router.push("/admin/login");
    }
  }, [isLoaded, isAdminAuthenticated, pathname, router]);

  const handleSignOut = () => {
    adminLogout();
    router.push("/admin/login");
  };

  const pendingOrdersCount = orders.filter((o) => o.orderStatus === "PENDING").length;

  const navItems = [
    {
      label: "Overview",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      label: "Homepage CMS",
      href: "/admin/home",
      icon: Home,
      badge: "PAGE",
    },
    {
      label: "Shop & Catalog CMS",
      href: "/admin/shop-page",
      icon: ShoppingBag,
      badge: "PAGE",
    },
    {
      label: "About & Brand Story",
      href: "/admin/about",
      icon: Compass,
      badge: "PAGE",
    },
    {
      label: "Lookbook & Film CMS",
      href: "/admin/lookbook",
      icon: BookOpen,
      badge: "PAGE",
    },
    {
      label: "Footer & Enclave CMS",
      href: "/admin/footer",
      icon: Sparkles,
      badge: "PAGE",
    },
    {
      label: "Site Media Manager",
      href: "/admin/site-media",
      icon: ImageIcon,
      badge: "MEDIA",
    },
    {
      label: "Clothes & Products",
      href: "/admin/products",
      icon: Shirt,
    },
    {
      label: "Volumes & Collections",
      href: "/admin/collections",
      icon: Layers,
    },
    {
      label: "Customer Orders",
      href: "/admin/orders",
      icon: ShoppingBag,
      badge: pendingOrdersCount > 0 ? `${pendingOrdersCount}` : undefined,
    },
    {
      label: "Settings & Logistics",
      href: "/admin/settings",
      icon: Settings,
    },
  ];

  // 1. Initial hydration loading state
  if (!isLoaded) {
    return (
      <LuxuryLoader
        fullScreen
        label="VERIFYING ATELIER CREDENTIALS..."
        sublabel="KATHMANDU ATELIER // RESTRICTED CONSOLE"
      />
    );
  }

  // 2. Unauthenticated Lock Screen Barrier
  if (!isAdminAuthenticated && pathname !== "/admin/login") {
    return (
      <div className="min-h-screen bg-luga-bg dark:bg-[#070707] text-luga-ink dark:text-luga-darkInk flex flex-col justify-center items-center px-6 selection:bg-luga-crimson selection:text-white">
        <div className="max-w-md w-full p-8 sm:p-10 border border-luga-border dark:border-luga-darkBorder bg-luga-surface/40 dark:bg-[#0F0F0F] text-center space-y-6 shadow-2xl relative">
          {/* Architectural Corner Accents */}
          <div className="pointer-events-none absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-luga-muted/40 dark:border-luga-darkMuted/40" />
          <div className="pointer-events-none absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-luga-muted/40 dark:border-luga-darkMuted/40" />
          <div className="pointer-events-none absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-luga-muted/40 dark:border-luga-darkMuted/40" />
          <div className="pointer-events-none absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-luga-muted/40 dark:border-luga-darkMuted/40" />

          <div className="w-12 h-12 mx-auto bg-luga-crimson/10 dark:bg-luga-gold/10 border border-luga-crimson/30 dark:border-luga-gold/30 flex items-center justify-center text-luga-crimson dark:text-luga-gold">
            <Lock className="w-6 h-6" />
          </div>

          <div className="space-y-2">
            <div className="font-mono text-[9px] tracking-mega uppercase text-luga-crimson dark:text-luga-gold font-bold">
              RESTRICTED ATELIER PORTAL // ACCESS DENIED
            </div>
            <h2 className="font-editorial text-2xl uppercase tracking-wider text-luga-ink dark:text-luga-darkInk font-light">
              AUTHENTICATION REQUIRED
            </h2>
            <p className="font-mono text-xs text-luga-muted dark:text-luga-darkMuted leading-relaxed">
              Please sign in with your atelier director credentials to manage visual media slots, product inventory, and Nepal customer orders.
            </p>
          </div>

          <Link
            href="/admin/login"
            className="inline-flex items-center justify-center gap-2 w-full py-3.5 bg-luga-ink dark:bg-luga-darkInk text-white dark:text-black font-mono text-xs uppercase tracking-ultra hover:opacity-90 transition-opacity font-bold"
          >
            <span>PROCEED TO CMS LOGIN</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <div className="pt-2">
            <Link
              href="/"
              className="font-mono text-[10px] uppercase tracking-wider text-luga-muted hover:text-luga-ink dark:hover:text-luga-darkInk transition-colors"
            >
              ← RETURN TO STOREFRONT
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 3. Authenticated Admin Dashboard Layout
  return (
    <div className="min-h-screen flex bg-luga-surface/30 dark:bg-[#070707] text-luga-ink dark:text-luga-darkInk">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed lg:sticky top-0 inset-y-0 left-0 z-50 w-72 bg-luga-bg dark:bg-[#0F0F0F] border-r border-luga-border dark:border-luga-darkBorder flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-luga-border dark:border-luga-darkBorder flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="w-8 h-8 bg-luga-ink dark:bg-luga-darkInk text-white dark:text-black flex items-center justify-center font-editorial font-bold text-lg">
                O
              </div>
              <div>
                <div className="font-editorial text-xl font-bold tracking-widest uppercase">
                  OBSIDIAN CMS
                </div>
                <div className="font-mono text-[9px] tracking-mega text-luga-crimson dark:text-luga-gold uppercase">
                  KATHMANDU ATELIER
                </div>
              </div>
            </Link>

            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 text-luga-muted hover:text-luga-ink"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav Items */}
          <nav className="p-4 space-y-1 font-mono text-xs">
            <div className="px-3 py-2 text-[9px] uppercase tracking-mega text-luga-muted dark:text-luga-darkMuted">
              EDITORIAL CONTROL
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-3 py-2.5 transition-colors ${
                    isActive
                      ? "bg-luga-ink text-white dark:bg-luga-darkInk dark:text-black font-semibold"
                      : "text-luga-muted dark:text-luga-darkMuted hover:bg-luga-surface dark:hover:bg-luga-darkSurface hover:text-luga-ink dark:hover:text-luga-darkInk"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="tracking-wider uppercase">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`px-1.5 py-0.5 text-[9px] tracking-wider uppercase font-bold ${
                        isActive
                          ? "bg-white/20 text-white dark:bg-black/20 dark:text-black"
                          : "bg-luga-crimson text-white dark:bg-luga-gold dark:text-black"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions: Active Admin Session & View Storefront */}
        <div className="p-4 border-t border-luga-border dark:border-luga-darkBorder space-y-3 font-mono text-xs">
          {/* Authenticated Admin Identity */}
          <div className="p-3 bg-luga-surface/70 dark:bg-luga-darkSurface/70 border border-luga-border/80 dark:border-luga-darkBorder/80 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-luga-crimson dark:text-luga-gold font-semibold text-[10px] tracking-wider uppercase">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>ACTIVE SESSION</span>
              </div>
              <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[8px] font-mono font-bold tracking-wider uppercase">
                AUTHENTICATED
              </span>
            </div>
            <div className="text-[11px] font-medium text-luga-ink dark:text-luga-darkInk truncate">
              {adminUser?.name || "Atelier Director"}
            </div>
            <div className="text-[10px] text-luga-muted dark:text-luga-darkMuted truncate">
              {adminUser?.email || "admin@luga.studio"}
            </div>
            <button
              onClick={handleSignOut}
              className="w-full mt-2 py-1.5 px-2 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/20 text-[10px] font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3 h-3" />
              <span>SIGN OUT OF CMS</span>
            </button>
          </div>

          <Link
            href="/"
            target="_blank"
            className="w-full py-2.5 px-3 border border-luga-border hover:border-luga-ink dark:border-luga-darkBorder dark:hover:border-luga-darkInk flex items-center justify-center gap-2 uppercase tracking-ultra text-luga-ink dark:text-luga-darkInk hover:bg-luga-surface dark:hover:bg-luga-darkSurface transition-colors"
          >
            <span>VIEW LIVE STORE</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <div className="p-2.5 bg-luga-surface/40 dark:bg-luga-darkSurface/40 text-[9px] text-luga-muted space-y-0.5">
            <div className="flex items-center gap-1 text-luga-ink dark:text-luga-darkInk font-semibold">
              <Compass className="w-3 h-3 text-luga-crimson dark:text-luga-gold" />
              <span>OBSIDIAN PRODUCTION CMS</span>
            </div>
            <div>PATAN DURBAR CRAFT QUARTER // NPR (रू)</div>
          </div>
        </div>
      </aside>

      {/* Main Admin Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-14 sm:h-20 bg-luga-bg/95 dark:bg-[#0A0A0A]/95 backdrop-blur-md border-b border-luga-border dark:border-luga-darkBorder px-4 sm:px-10 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 text-luga-ink dark:text-luga-darkInk"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="font-mono text-xs uppercase tracking-ultra text-luga-muted dark:text-luga-darkMuted hidden sm:block">
              ADMIN CMS // NEPAL STUDIO PANEL
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {/* Admin identity pill */}
            <div className="hidden md:flex items-center gap-2 font-mono text-[10px] tracking-wider uppercase px-2.5 py-1 bg-luga-surface dark:bg-luga-darkSurface border border-luga-border dark:border-luga-darkBorder text-luga-ink dark:text-luga-darkInk">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-luga-muted">{adminUser?.email}</span>
              <button
                onClick={handleSignOut}
                className="ml-1 text-red-500 hover:text-red-600 text-[9px] uppercase tracking-wider underline cursor-pointer"
                title="Sign Out"
              >
                SIGN OUT
              </button>
            </div>

            <ThemeToggle />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-8 lg:p-10 max-w-[1920px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

