import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/common/ThemeProvider";
import { StoreProvider } from "@/lib/store-context";
import { RouteLoadingIndicator } from "@/components/common/RouteLoadingIndicator";

export const metadata: Metadata = {
  title: "Obsidian Apparel // Contemporary Nepali Luxury Streetwear & Artisanal Fashion",
  description:
    "High-fashion South Asian contemporary editorial streetwear, handcrafted in Kathmandu Valley, Nepal. Kathmandu 2026. 420-580 GSM artisanal silhouettes, traditional handloom Dhaka and Yak wool blends.",
  keywords: [
    "Obsidian Apparel",
    "Obsidian",
    "Nepali Streetwear",
    "Luxury Fashion Nepal",
    "Kathmandu Fashion",
    "Artisanal Handloom",
    "South Asian Luxury",
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
