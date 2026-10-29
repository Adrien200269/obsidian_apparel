# Obsidian Apparel // Modern Kathmandu Unisex Streetwear

> Modern, unisex street and casual wear founded in Kathmandu. Engineered with custom heavyweight knits (240+ GSM dense combed cotton, 400+ GSM loopback French terry), boxy silhouettes, and daily durability. Kathmandu 2026.

---

## 🏛️ CORE ARCHITECTURAL PRINCIPLES

1. **NO AI IMAGES OR STOCK PHOTOS**:
   - Zero AI generated images, Unsplash stock photos, or external dummy assets.
   - Built with the custom **`<ManagedImage />`** architectural wireframe placeholder component displaying subtle grid crosshairs, coordinates (`KTM // 27.7172° N`), slot identifier, recommended resolution & aspect ratio, and the `"OBSIDIAN APPAREL STUDIO // AWAITING ADMIN UPLOAD"` badge.
   - When an administrator uploads a local file or pastes an image URL in the Admin Panel, the placeholder immediately renders the uploaded image across the website.

2. **GLOBAL WEBSITE IMAGE CONTROL CENTER (`/admin/site-media`)**:
   - Every single non-product visual slot on the entire website is editable and replaceable in real-time:
     - **Brand Assets**: Header Logo (Light/Dark), Favicon, Fonepay Merchant QR Code.
     - **Homepage Frames**: Hero Banner (Desktop & Mobile), Editorial Split Banners (Hoodies vs. Tees & Cargos), Streetwear Ethos Story Banner, Lookbook Teaser Spread.
     - **Category Headers**: Outerwear, Knitwear, Shirts, Trousers.
     - **About Studio Slots**: Kathmandu Studio Portrait, Custom Heavyweight Knits Detail.

3. **MADE FOR NEPAL (NPR `रू`)**:
   - Currency: **Nepali Rupees (`NPR` / `Rs.`)** formatted across all price tags, cart subtotals, shipping tiers, and admin revenue KPIs (e.g., `NPR 8,500`).
   - Nepal delivery zone selector:
     - *Kathmandu Valley — Inside Ring Road (NPR 100 • Complimentary over NPR 10,000)*
     - *Kathmandu Valley — Outside Ring Road (NPR 150)*
     - *Outside Valley Courier (NPR 250 — Pokhara, Chitwan, Dharan, Butwal, Biratnagar, etc.)*
   - Nepal payments: **Cash on Delivery (COD)**, **Fonepay QR** (with Admin-uploadable QR code), **eSewa**, and **Khalti**.

4. **FRONTEND-FIRST + PRISMA + SUPABASE READINESS**:
   - Fully interactive and reactive client-side store powered by React Context + `localStorage` + file-to-DataURL uploader that mirrors the exact database schema.
   - Complete `prisma/schema.prisma` configured for Supabase PostgreSQL.
   - `.env.example` pre-configured with pooling and direct database connection strings.
   - Modular data-access service (`src/services/db.ts`) ready to connect to Supabase simply by adding environment keys.

---

## 🎨 DESIGN SYSTEM

- **Editorial Typography**: High-contrast serif headings (`Cormorant Garamond` / `Playfair Display`) paired with geometric uppercase sans-serif micro-copy (`tracking-[0.25em] uppercase text-xs`).
- **Sharp Brutalism**: 0px border-radius across all buttons, cards, drawers, and input controls.
- **Light Mode**:
  - Background: Gallery Warm Alabaster (`#F8F6F2`), Secondary Surface (`#EFECE6`)
  - Ink: Deep Charcoal Black (`#111111`), Muted Stone (`#5C5A55`)
  - Borders: Crisp Hairline (`#E2DED7`)
- **Dark Mode**:
  - Background: Deep Obsidian (`#0A0A0A`), Secondary Surface (`#141414`)
  - Ink: Crisp Bone White (`#F5F3EF`), Muted Ash (`#9A968E`)
  - Borders: Subtle Charcoal (`#262626`)
- **Accents**: Himalayan Crimson (`#8B2616`) & Street Brass Gold (`#C2A265`).

---

## 🚀 APPLICATION DIRECTORY & ROUTES

### 🛍️ User Storefront
- **`/`**: Full-viewport hero campaign with editable CTAs, 4-column drop grid with quick size add on hover, editorial split banner (Hoodies vs Heavyweight Cargos), numbered Capsule showcase, interactive 35mm Lookbook "Shop the Look", and Streetwear Ethos story.
- **`/shop`**: Complete ready-to-wear archive with category, capsule, size, and price filters in NPR, plus 2-column editorial vs 4-column archive grid toggle.
- **`/collections/[slug]`**: Capsule drop archive detail (e.g. `/collections/capsule-01`, `/collections/core-capsule`, `/collections/urban-winter`).
- **`/product/[slug]`**: Multi-slot vertical gallery (Front, Back, Detail/Macro, Fit Reference), Nepal Size Guide Modal (inches & cm), WhatsApp concierge direct order link, and streetwear fabric specs.
- **`/lookbook`**: 35mm film spreads with "Shop the Look" garment tags.
- **`/checkout`**: Nepal checkout form with zone calculation, Tole/Ward inputs, COD, and Fonepay QR code payment.
- **`/about`**: Built for the Pavement, Cut for Every Day. Why We Build in Nepal, the Three Pillars (Heavyweight Density, Equal Duality & Fit, Small-Batch Drops), and Kathmandu Studio info.

### 🛡️ Admin CMS
- **`/admin`**: Studio Dashboard with real-time NPR revenue, orders, active garments, and low stock warnings.
- **`/admin/site-media`**: **Highest Priority** — visual control center for every non-product slot with file picker, URL paste, and instant live preview.
- **`/admin/products`**: Full CRUD for clothes, stock matrix across sizes (`XS`, `S`, `M`, `L`, `XL`, `XXL`), fabric GSM specs, and multi-angle photo uploader.
- **`/admin/collections`**: Curate Volumes, upload cover banners, and write volume narratives.
- **`/admin/lookbook`**: Add 35mm film frames, upload images, and tag garments to "Shop the Look".
- **`/admin/orders`**: View storefront orders, update dispatch and payment status, and review Nepal shipping details.
- **`/admin/settings`**: Edit top marquee announcement text, toggle visibility, adjust Nepal shipping rates, and update WhatsApp concierge numbers.

---

## 🛠️ GETTING STARTED

```bash
# Install dependencies
npm install

# Run the development server
npm run dev

# Or build for production
npm run build
npm run start
```

Visit **`http://localhost:3000`** (or configured port) to explore the storefront, and **`http://localhost:3000/admin`** to access the Admin CMS.
