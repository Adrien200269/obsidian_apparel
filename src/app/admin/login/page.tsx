"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/lib/store-context";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import {
  ShieldCheck,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  Compass,
  Sparkles,
  AlertCircle,
  KeyRound,
} from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const { adminLogin, isAdminAuthenticated } = useStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already logged in, redirect to /admin
  React.useEffect(() => {
    if (isAdminAuthenticated) {
      router.push("/admin");
    }
  }, [isAdminAuthenticated, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const result = await adminLogin(email, password);
      if (result.success) {
        router.push("/admin");
      } else {
        setErrorMessage(result.error || "Invalid credentials.");
      }
    } catch (err: any) {
      setErrorMessage("Authentication server error. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = async () => {
    setEmail("admin@luga.studio");
    setPassword("luga2026");
    setIsSubmitting(true);
    const result = await adminLogin("admin@luga.studio", "luga2026");
    if (result.success) {
      router.push("/admin");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-luga-bg dark:bg-[#080808] text-luga-ink dark:text-luga-darkInk selection:bg-luga-crimson selection:text-white dark:selection:bg-luga-gold dark:selection:text-black relative overflow-hidden">
      {/* Background Architectural Grid Pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05] dark:opacity-[0.08]"
        style={{
          backgroundImage: `
            linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px)
          `,
          backgroundSize: "32px 32px",
        }}
      />

      {/* Top Bar */}
      <header className="relative z-10 p-6 sm:p-10 flex items-center justify-between border-b border-luga-border/60 dark:border-luga-darkBorder/60">
        <Link href="/" className="group flex items-center gap-3">
          <div className="w-8 h-8 bg-luga-ink dark:bg-luga-darkInk text-white dark:text-black flex items-center justify-center font-editorial font-bold text-lg">
            O
          </div>
          <div>
            <span className="font-editorial text-2xl font-bold tracking-[0.25em] uppercase text-luga-ink dark:text-luga-darkInk">
              OBSIDIAN APPAREL
            </span>
            <span className="block font-mono text-[8px] tracking-mega uppercase text-luga-muted font-light">
              KATHMANDU 2026
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="font-mono text-xs uppercase tracking-ultra text-luga-muted hover:text-luga-ink dark:hover:text-luga-darkInk transition-colors hidden sm:inline"
          >
            ← STOREFRONT
          </Link>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Login Portal Box */}
      <main className="relative z-10 max-w-lg w-full mx-auto px-6 py-12">
        <div className="p-8 sm:p-12 bg-luga-surface/40 dark:bg-[#101010] border border-luga-border dark:border-luga-darkBorder shadow-2xl relative">
          {/* Architectural Corner L-Brackets */}
          <div className="pointer-events-none absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-luga-muted/40 dark:border-luga-darkMuted/40" />
          <div className="pointer-events-none absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-luga-muted/40 dark:border-luga-darkMuted/40" />
          <div className="pointer-events-none absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-luga-muted/40 dark:border-luga-darkMuted/40" />
          <div className="pointer-events-none absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-luga-muted/40 dark:border-luga-darkMuted/40" />

          {/* Heading */}
          <div className="space-y-2 mb-8">
            <div className="flex items-center gap-2 font-mono text-[10px] tracking-mega uppercase text-luga-crimson dark:text-luga-gold">
              <ShieldCheck className="w-4 h-4" />
              <span>ATELIER PORTAL // RESTRICTED</span>
            </div>
            <h1 className="font-editorial text-3xl sm:text-4xl uppercase tracking-tight text-luga-ink dark:text-luga-darkInk font-light">
              CMS ACCESS GATEWAY
            </h1>
            <p className="font-mono text-xs text-luga-muted dark:text-luga-darkMuted leading-relaxed">
              Authorized studio director login for visual slot deployment, garment inventory, and Nepal order dispatches.
            </p>
          </div>

          {/* Error Message Alert */}
          {errorMessage && (
            <div className="mb-6 p-3.5 bg-red-500/10 border border-red-500/40 text-red-600 dark:text-red-400 font-mono text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5 font-mono text-xs">
            <div className="space-y-1.5">
              <label className="text-[10px] text-luga-muted dark:text-luga-darkMuted uppercase tracking-wider block">
                ATELIER EMAIL / IDENTIFIER
              </label>
              <input
                type="text"
                required
                placeholder="admin@luga.studio"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border border-luga-border dark:border-luga-darkBorder p-3 text-luga-ink dark:text-luga-darkInk focus:outline-none focus:border-luga-ink dark:focus:border-luga-darkInk"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[10px] text-luga-muted dark:text-luga-darkMuted uppercase tracking-wider">
                  SECURITY PASSCODE
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[10px] text-luga-muted hover:text-luga-ink dark:text-luga-darkMuted dark:hover:text-luga-darkInk flex items-center gap-1"
                >
                  {showPassword ? (
                    <>
                      <EyeOff className="w-3 h-3" />
                      <span>HIDE</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3 h-3" />
                      <span>SHOW</span>
                    </>
                  )}
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent border border-luga-border dark:border-luga-darkBorder p-3 text-luga-ink dark:text-luga-darkInk focus:outline-none focus:border-luga-ink dark:focus:border-luga-darkInk"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-luga-ink text-white dark:bg-luga-darkInk dark:text-black font-mono text-xs uppercase tracking-ultra hover:bg-luga-crimson dark:hover:bg-luga-gold transition-colors flex items-center justify-center gap-2 font-bold disabled:opacity-90 disabled:cursor-wait"
            >
              {isSubmitting ? (
                <>
                  <Compass className="w-4 h-4 animate-spin-slow text-luga-crimson dark:text-luga-gold stroke-[1.5]" />
                  <span>AUTHENTICATING ATELIER DIRECTOR...</span>
                </>
              ) : (
                <>
                  <span>ENTER STUDIO CMS</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Autofill Section */}
          <div className="mt-8 pt-6 border-t border-luga-border/60 dark:border-luga-darkBorder/60 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between text-[10px] text-luga-muted dark:text-luga-darkMuted uppercase tracking-wider">
              <span>DEMO CREDENTIALS</span>
              <span className="text-emerald-600 dark:text-emerald-400">PATAN ACCESS</span>
            </div>

            <div className="p-3 bg-luga-surface dark:bg-[#161616] border border-luga-border dark:border-luga-darkBorder text-[11px] text-luga-muted space-y-1">
              <div>Email: <strong className="text-luga-ink dark:text-luga-darkInk">admin@luga.studio</strong></div>
              <div>Password: <strong className="text-luga-ink dark:text-luga-darkInk">luga2026</strong></div>
            </div>

            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full py-2.5 border border-dashed border-luga-crimson/60 dark:border-luga-gold/60 text-luga-crimson dark:text-luga-gold hover:bg-luga-crimson/5 dark:hover:bg-luga-gold/5 uppercase tracking-wider text-[10px] flex items-center justify-center gap-2 transition-colors"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>ONE-CLICK INSTANT DEMO LOGIN</span>
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 p-6 text-center font-mono text-[10px] text-luga-muted border-t border-luga-border/60 dark:border-luga-darkBorder/60">
        <div>OBSIDIAN APPAREL PATAN ATELIER // KATHMANDU VALLEY, NEPAL</div>
        <div>ALL RIGHTS RESERVED • 2026</div>
      </footer>
    </div>
  );
}
