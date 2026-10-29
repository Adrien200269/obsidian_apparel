import { PrismaClient } from "@prisma/client";
import {
  INITIAL_COLLECTIONS,
  INITIAL_LOOKBOOK_ITEMS,
  INITIAL_MEDIA_SLOTS,
  INITIAL_PRODUCTS,
  INITIAL_SAMPLE_ORDERS,
  INITIAL_SITE_SETTINGS,
} from "../src/lib/initial-data";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Obsidian Apparel live Supabase database...");

  // 1. Site Settings
  console.log("Upserting site settings...");
  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: INITIAL_SITE_SETTINGS,
    create: { id: "singleton", ...INITIAL_SITE_SETTINGS },
  });

  // 2. Site Media Slots
  console.log("Upserting media slots...");
  for (const slot of Object.values(INITIAL_MEDIA_SLOTS)) {
    await prisma.siteMediaSlot.upsert({
      where: { slotKey: slot.slotKey },
      update: {
        label: slot.label,
        pageSection: slot.pageSection,
        imageUrl: slot.imageUrl,
        altText: slot.altText,
        aspectRatio: slot.aspectRatio,
        resolution: slot.resolution,
        heading: slot.heading,
        subHeading: slot.subHeading,
        ctaText: slot.ctaText,
        ctaLink: slot.ctaLink,
      },
      create: {
        slotKey: slot.slotKey,
        label: slot.label,
        pageSection: slot.pageSection,
        imageUrl: slot.imageUrl,
        altText: slot.altText,
        aspectRatio: slot.aspectRatio,
        resolution: slot.resolution,
        heading: slot.heading,
        subHeading: slot.subHeading,
        ctaText: slot.ctaText,
        ctaLink: slot.ctaLink,
      },
    });
  }

  // 3. Collections
  console.log("Upserting collections...");
  for (const col of INITIAL_COLLECTIONS) {
    await prisma.collection.upsert({
      where: { slug: col.slug },
      update: {
        title: col.title,
        volumeNumber: col.volumeNumber,
        description: col.description,
        coverImageUrl: col.coverImageUrl,
        isActive: col.isActive,
      },
      create: {
        id: col.id,
        title: col.title,
        slug: col.slug,
        volumeNumber: col.volumeNumber,
        description: col.description,
        coverImageUrl: col.coverImageUrl,
        isActive: col.isActive,
      },
    });
  }

  // 4. Products & Variants
  console.log("Upserting products & variants...");
  for (const prod of INITIAL_PRODUCTS) {
    const createdProd = await prisma.product.upsert({
      where: { sku: prod.sku },
      update: {
        title: prod.title,
        slug: prod.slug,
        description: prod.description,
        craftStory: prod.craftStory,
        fabricGsm: prod.fabricGsm,
        priceNpr: prod.priceNpr,
        compareAtPriceNpr: prod.compareAtPriceNpr,
        category: prod.category,
        collectionId: prod.collectionId,
        primaryImageUrl: prod.primaryImageUrl,
        hoverImageUrl: prod.hoverImageUrl,
        galleryUrls: prod.galleryUrls,
        isFeatured: prod.isFeatured,
        isNewArrival: prod.isNewArrival,
        isArchived: prod.isArchived,
      },
      create: {
        id: prod.id,
        title: prod.title,
        slug: prod.slug,
        sku: prod.sku,
        description: prod.description,
        craftStory: prod.craftStory,
        fabricGsm: prod.fabricGsm,
        priceNpr: prod.priceNpr,
        compareAtPriceNpr: prod.compareAtPriceNpr,
        category: prod.category,
        collectionId: prod.collectionId,
        primaryImageUrl: prod.primaryImageUrl,
        hoverImageUrl: prod.hoverImageUrl,
        galleryUrls: prod.galleryUrls,
        isFeatured: prod.isFeatured,
        isNewArrival: prod.isNewArrival,
        isArchived: prod.isArchived,
      },
    });

    // Variants
    if (prod.variants) {
      for (const v of prod.variants) {
        await prisma.productVariant.upsert({
          where: { sku: v.sku },
          update: {
            size: v.size,
            stockQuantity: v.stockQuantity,
          },
          create: {
            id: v.id,
            productId: createdProd.id,
            size: v.size,
            stockQuantity: v.stockQuantity,
            sku: v.sku,
          },
        });
      }
    }
  }

  // 5. Lookbook Items
  console.log("Upserting lookbook items...");
  for (const item of INITIAL_LOOKBOOK_ITEMS) {
    const existing = await prisma.lookbookItem.findFirst({
      where: { title: item.title },
    });
    if (existing) {
      await prisma.lookbookItem.update({
        where: { id: existing.id },
        data: {
          volume: item.volume,
          imageUrl: item.imageUrl,
          caption: item.caption,
          featuredProductIds: item.featuredProductIds,
          sortOrder: item.sortOrder,
        },
      });
    } else {
      await prisma.lookbookItem.create({
        data: {
          id: item.id,
          title: item.title,
          volume: item.volume,
          imageUrl: item.imageUrl,
          caption: item.caption,
          featuredProductIds: item.featuredProductIds,
          sortOrder: item.sortOrder,
        },
      });
    }
  }

  // 6. Sample Orders
  console.log("Upserting sample orders...");
  for (const ord of INITIAL_SAMPLE_ORDERS) {
    await prisma.order.upsert({
      where: { orderNumber: ord.orderNumber },
      update: {
        customerName: ord.customerName,
        phone: ord.phone,
        email: ord.email,
        city: ord.city,
        deliveryZone: ord.deliveryZone as any,
        toleAddress: ord.toleAddress,
        landmark: ord.landmark,
        paymentMethod: ord.paymentMethod as any,
        paymentStatus: ord.paymentStatus as any,
        orderStatus: ord.orderStatus as any,
        subtotalNpr: ord.subtotalNpr,
        shippingNpr: ord.shippingNpr,
        totalNpr: ord.totalNpr,
        notes: ord.notes,
      },
      create: {
        id: ord.id,
        orderNumber: ord.orderNumber,
        customerName: ord.customerName,
        phone: ord.phone,
        email: ord.email,
        city: ord.city,
        deliveryZone: ord.deliveryZone as any,
        toleAddress: ord.toleAddress,
        landmark: ord.landmark,
        paymentMethod: ord.paymentMethod as any,
        paymentStatus: ord.paymentStatus as any,
        orderStatus: ord.orderStatus as any,
        subtotalNpr: ord.subtotalNpr,
        shippingNpr: ord.shippingNpr,
        totalNpr: ord.totalNpr,
        notes: ord.notes,
        items: {
          create: ord.items.map((i) => ({
            id: i.id,
            productId: i.productId,
            productTitle: i.productTitle,
            size: i.size,
            quantity: i.quantity,
            priceNpr: i.priceNpr,
            primaryImageUrl: i.primaryImageUrl,
          })),
        },
      },
    });
  }

  console.log("✔ Live Supabase Database successfully seeded with Obsidian Apparel Streetwear Archive!");
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
