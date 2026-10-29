import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/common/ThemeProvider";
import { StoreProvider } from "@/lib/store-context";
import { RouteLoadingIndicator } from "@/components/common/RouteLoadingIndicator";

export const metadata: Metadata = {
  title: "Obsidian Apparel // Contemporary Kathmandu Streetwear",
  description:
    "Modern unisex streetwear and casual wear designed in Kathmandu. 240+ GSM dense combed tees, 400+ GSM French terry hoodies, and boxy urban silhouettes built for daily rotation. Kathmandu 2026.",
  keywords: [
    "Obsidian Apparel",
    "Obsidian",
    "Nepali Streetwear",
    "Kathmandu Streetwear",
    "Streetwear Brand Nepal",
    "Heavyweight Hoodie",
    "Oversized Tees",
    "Cargo Pants",
    "Unisex Streetwear",
    "Casual Wear",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-luga-bg dark:bg-luga-darkBg text-luga-ink dark:text-luga-darkInk selection:bg-luga-crimson selection:text-white dark:selection:bg-luga-gold dark:selection:text-black">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <StoreProvider>
            <RouteLoadingIndicator />
            {children}
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
