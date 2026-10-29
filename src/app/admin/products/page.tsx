"use client";

import React, { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ManagedImage } from "@/components/common/ManagedImage";
import { useStore } from "@/lib/store-context";
import { Product, ProductCategory, GarmentSize, ProductVariant } from "@/types";
import { formatNpr } from "@/lib/utils";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Upload,
  X,
  Check,
  Sparkles,
  Shirt,
  Compass,
  RotateCw,
} from "lucide-react";
import { compressImage } from "@/lib/image-utils";
import { uploadToUploadcare } from "@/lib/uploadcare";

export default function AdminProductsPage() {
  const { products, collections, addProduct, updateProduct, deleteProduct } = useStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [sku, setSku] = useState("");
  const [description, setDescription] = useState("");
  const [craftStory, setCraftStory] = useState("");
  const [fabricGsm, setFabricGsm] = useState("");
  const [priceNpr, setPriceNpr] = useState<number>(8500);
  const [compareAtPriceNpr, setCompareAtPriceNpr] = useState<number | undefined>(undefined);
  const [category, setCategory] = useState<ProductCategory>("knitwear");
  const [collectionId, setCollectionId] = useState<string>(collections[0]?.id || "");
  const [primaryImageUrl, setPrimaryImageUrl] = useState<string | null>(null);
  const [hoverImageUrl, setHoverImageUrl] = useState<string | null>(null);
  const [galleryUrls, setGalleryUrls] = useState<string[]>([]);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(true);
  const [stockMatrix, setStockMatrix] = useState<Record<GarmentSize, number>>({
    XS: 4,
    S: 8,
    M: 12,
    L: 8,
    XL: 4,
    XXL: 2,
  });

  const openCreateModal = () => {
    setEditingProduct(null);
    setTitle("");
    setSlug("");
    setSku(`LUG-V1-${Date.now().toString().slice(-4)}`);
    setDescription("");
    setCraftStory("");
    setFabricGsm("460 GSM Heavyweight Organic Cotton");
    setPriceNpr(8500);
    setCompareAtPriceNpr(undefined);
    setCategory("knitwear");
    setCollectionId(collections[0]?.id || "");
    setPrimaryImageUrl(null);
    setHoverImageUrl(null);
    setGalleryUrls([]);
    setIsFeatured(false);
    setIsNewArrival(true);
    setStockMatrix({ XS: 4, S: 8, M: 12, L: 8, XL: 4, XXL: 2 });
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setTitle(product.title);
    setSlug(product.slug);
    setSku(product.sku);
    setDescription(product.description);
    setCraftStory(product.craftStory || "");
    setFabricGsm(product.fabricGsm || "");
    setPriceNpr(product.priceNpr);
    setCompareAtPriceNpr(product.compareAtPriceNpr);
    setCategory(product.category);
    setCollectionId(product.collectionId || "");
    setPrimaryImageUrl(product.primaryImageUrl);
    setHoverImageUrl(product.hoverImageUrl);
    setGalleryUrls(product.galleryUrls || []);
    setIsFeatured(product.isFeatured);
    setIsNewArrival(product.isNewArrival);

    const matrix: Record<GarmentSize, number> = { XS: 0, S: 0, M: 0, L: 0, XL: 0, XXL: 0 };
    product.variants?.forEach((v) => {
      matrix[v.size] = v.stockQuantity;
    });
    setStockMatrix(matrix);

    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !priceNpr) return;

    setIsSaving(true);
    try {
      const generatedSlug = slug.trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const collection = collections.find((c) => c.id === collectionId);
      const cleanCollectionId = collectionId && collectionId.trim() !== "" ? collectionId : undefined;

      const variants: ProductVariant[] = (["XS", "S", "M", "L", "XL", "XXL"] as GarmentSize[]).map((size) => ({
        id: `var-${size.toLowerCase()}-${Date.now()}`,
        productId: editingProduct?.id || "",
        size,
        stockQuantity: stockMatrix[size] || 0,
        sku: `${sku}-${size}`,
      }));

      if (editingProduct) {
        await updateProduct(editingProduct.id, {
          title,
          slug: generatedSlug,
          sku,
          description,
          craftStory,
          fabricGsm,
          priceNpr,
          compareAtPriceNpr,
          category,
          collectionId: cleanCollectionId,
          collectionTitle: collection?.title,
          primaryImageUrl,
          hoverImageUrl,
          galleryUrls,
          isFeatured,
          isNewArrival,
          variants,
        });
      } else {
        await addProduct({
          title,
          slug: generatedSlug,
          sku,
          description,
          craftStory,
          fabricGsm,
          priceNpr,
          compareAtPriceNpr,
          category,
          collectionId: cleanCollectionId,
          collectionTitle: collection?.title,
          primaryImageUrl,
          hoverImageUrl,
          galleryUrls,
          isFeatured,
          isNewArrival,
          isArchived: false,
          variants,
        });
      }

      setIsModalOpen(false);
    } catch (err) {
      console.error("Save product error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileToUrl = async (file: File, target: "primary" | "hover" | "gallery") => {
    if (!file) return;
    try {
      const res = await uploadToUploadcare(file);
      if (target === "primary") setPrimaryImageUrl(res.cdnUrl);
      if (target === "hover") setHoverImageUrl(res.cdnUrl);
      if (target === "gallery") setGalleryUrls((prev) => [...prev, res.cdnUrl]);
    } catch (err) {
      console.warn("Uploadcare upload failed, falling back to local compression:", err);
      try {
        const dataUrl = await compressImage(file, 1600, 2000, 0.84);
        if (target === "primary") setPrimaryImageUrl(dataUrl);
        if (target === "hover") setHoverImageUrl(dataUrl);
        if (target === "gallery") setGalleryUrls((prev) => [...prev, dataUrl]);
      } catch (compErr) {
        console.error("Product image compression error:", compErr);
      }
    }
  };

  // Filtered list
  const filteredProducts = products.filter((p) => {
    if (selectedCategory !== "ALL" && p.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-luga-border dark:border-luga-darkBorder pb-6 gap-4">
          <div>
            <span className="font-mono text-[10px] sm:text-xs tracking-mega uppercase text-luga-crimson dark:text-luga-gold">
              OBSIDIAN ATELIER INVENTORY
            </span>
            <h1 className="font-editorial text-3xl sm:text-5xl uppercase tracking-tight text-luga-ink dark:text-luga-darkInk mt-1">
              CLOTHES & PRODUCTS
            </h1>
            <p className="font-mono text-xs text-luga-muted dark:text-luga-darkMuted mt-1">
              Manage garment silhouettes, NPR pricing, Patan craftsmanship stories, and multi-angle photo uploads.
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="px-6 py-3 bg-luga-ink text-white dark:bg-luga-darkInk dark:text-black font-mono text-xs uppercase tracking-ultra flex items-center gap-2 hover:bg-luga-crimson dark:hover:bg-luga-gold transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>CREATE NEW GARMENT</span>
          </button>
        </div>

        {/* Toolbar: Search + Category Filter */}
        <div className="flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-luga-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="SEARCH BY TITLE, SKU, OR CATEGORY..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border border-luga-border dark:border-luga-darkBorder pl-9 pr-4 py-2 text-luga-ink dark:text-luga-darkInk focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {["ALL", "outerwear", "knitwear", "shirts", "trousers"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 uppercase border transition-colors ${
                  selectedCategory === cat
                    ? "bg-luga-ink text-white border-luga-ink dark:bg-luga-darkInk dark:text-black dark:border-luga-darkInk font-bold"
                    : "border-luga-border dark:border-luga-darkBorder hover:border-luga-ink text-luga-ink dark:text-luga-darkInk"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Products Table */}
        <div className="overflow-x-auto border border-luga-border dark:border-luga-darkBorder bg-luga-bg dark:bg-[#0F0F0F]">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="bg-luga-surface/50 dark:bg-luga-darkSurface/50 border-b border-luga-border dark:border-luga-darkBorder text-[10px] uppercase tracking-wider text-luga-muted">
                <th className="p-4">VISUAL</th>
                <th className="p-4">GARMENT TITLE / SKU</th>
                <th className="p-4">CATEGORY</th>
                <th className="p-4">PRICE (NPR)</th>
                <th className="p-4">FABRIC / GSM</th>
                <th className="p-4">TOTAL STOCK</th>
                <th className="p-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-luga-border/50 dark:divide-luga-darkBorder/50">
              {filteredProducts.map((p) => {
                const totalUnits = p.variants?.reduce((sum, v) => sum + v.stockQuantity, 0) ?? 0;

                return (
                  <tr key={p.id} className="hover:bg-luga-surface/30 dark:hover:bg-luga-darkSurface/30 transition-colors">
                    <td className="p-4 w-16">
                      <div className="w-12 h-14 bg-luga-surface dark:bg-luga-darkSurface border border-luga-border/50 overflow-hidden">
                        <ManagedImage
                          src={p.primaryImageUrl}
                          slotName={p.sku}
                          aspectRatio="4:5"
                          resolution="150×200px"
                          alt={p.title}
                          showInfo={false}
                        />
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="font-editorial text-base text-luga-ink dark:text-luga-darkInk font-medium">
                        {p.title}
                      </div>
                      <div className="text-[10px] text-luga-muted">
                        SKU: {p.sku} • {p.isFeatured && "★ FEATURED"} {p.isNewArrival && "• NEW"}
                      </div>
                    </td>

                    <td className="p-4 uppercase text-luga-muted">
                      {p.category}
                    </td>

                    <td className="p-4 font-bold text-luga-crimson dark:text-luga-gold">
                      {formatNpr(p.priceNpr)}
                    </td>

                    <td className="p-4 text-luga-muted max-w-xs truncate">
                      {p.fabricGsm || "—"}
                    </td>

                    <td className="p-4">
                      <span className={`font-bold ${totalUnits < 10 ? "text-amber-600" : "text-luga-ink dark:text-luga-darkInk"}`}>
                        {totalUnits} units
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1.5 border border-luga-border hover:border-luga-ink dark:border-luga-darkBorder dark:hover:border-luga-darkInk transition-colors"
                          title="Edit Garment"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-luga-ink dark:text-luga-darkInk" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Archive or delete garment "${p.title}"?`)) {
                              deleteProduct(p.id);
                            }
                          }}
                          className="p-1.5 border border-luga-border hover:border-red-500 hover:text-red-500 text-luga-muted transition-colors"
                          title="Delete Garment"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* CREATE / EDIT MODAL */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm overflow-y-auto">
            <div className="bg-luga-bg dark:bg-[#121212] border border-luga-border dark:border-luga-darkBorder max-w-4xl w-full max-h-[92vh] overflow-y-auto p-5 sm:p-10 shadow-2xl relative my-auto">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-luga-muted hover:text-luga-ink dark:hover:text-luga-darkInk"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="border-b border-luga-border dark:border-luga-darkBorder pb-4 mb-6">
                <span className="font-mono text-[10px] tracking-mega uppercase text-luga-crimson dark:text-luga-gold">
                  {editingProduct ? "EDIT GARMENT SPECIFICATIONS" : "NEW PATAN ARCHIVE ENTRY"}
                </span>
                <h2 className="font-editorial text-3xl uppercase tracking-tight text-luga-ink dark:text-luga-darkInk mt-1">
                  {editingProduct ? editingProduct.title : "CREATE NEW GARMENT"}
                </h2>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-6 font-mono text-xs">
                {/* Basic Details */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-[10px] text-luga-muted uppercase">GARMENT TITLE *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Patan Monolith Handloom Trench Coat"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-transparent border border-luga-border dark:border-luga-darkBorder p-2.5 text-luga-ink dark:text-luga-darkInk focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-luga-muted uppercase">SKU CODE *</label>
                    <input
                      type="text"
                      required
                      placeholder="LUG-V1-OUT-001"
                      value={sku}
                      onChange={(e) => setSku(e.target.value)}
                      className="w-full bg-transparent border border-luga-border dark:border-luga-darkBorder p-2.5 text-luga-ink dark:text-luga-darkInk focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-luga-muted uppercase">PRICE (NPR रू) *</label>
                    <input
                      type="number"
                      required
                      min={0}
                      step={100}
                      value={priceNpr}
                      onChange={(e) => setPriceNpr(Number(e.target.value))}
                      className="w-full bg-transparent border border-luga-border dark:border-luga-darkBorder p-2.5 text-luga-ink dark:text-luga-darkInk focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-luga-muted uppercase">COMPARE-AT PRICE (NPR)</label>
                    <input
                      type="number"
                      min={0}
                      step={100}
                      placeholder="Optional strike price"
                      value={compareAtPriceNpr || ""}
                      onChange={(e) => setCompareAtPriceNpr(e.target.value ? Number(e.target.value) : undefined)}
                      className="w-full bg-transparent border border-luga-border dark:border-luga-darkBorder p-2.5 text-luga-ink dark:text-luga-darkInk focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-luga-muted uppercase">CATEGORY *</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as ProductCategory)}
                      className="w-full bg-transparent border border-luga-border dark:border-luga-darkBorder p-2.5 text-luga-ink dark:text-luga-darkInk focus:outline-none"
                    >
                      <option value="outerwear" className="bg-luga-bg dark:bg-black">Outerwear & Coats</option>
                      <option value="knitwear" className="bg-luga-bg dark:bg-black">Knitwear & Hoodies</option>
                      <option value="shirts" className="bg-luga-bg dark:bg-black">Shirts & Heavy Tees</option>
                      <option value="trousers" className="bg-luga-bg dark:bg-black">Trousers & Bottoms</option>
                      <option value="accessories" className="bg-luga-bg dark:bg-black">Accessories</option>
                    </select>
                  </div>
                </div>

                {/* Fabric GSM & Craft Story */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-luga-muted uppercase">FABRIC GSM & WEAVE SPEC</label>
                    <input
                      type="text"
                      placeholder="e.g. 520 GSM Double-Face Cotton Twill • Pure Handloom Dhaka"
                      value={fabricGsm}
                      onChange={(e) => setFabricGsm(e.target.value)}
                      className="w-full bg-transparent border border-luga-border dark:border-luga-darkBorder p-2.5 text-luga-ink dark:text-luga-darkInk focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-luga-muted uppercase">COLLECTION / VOLUME</label>
                    <select
                      value={collectionId}
                      onChange={(e) => setCollectionId(e.target.value)}
                      className="w-full bg-transparent border border-luga-border dark:border-luga-darkBorder p-2.5 text-luga-ink dark:text-luga-darkInk focus:outline-none"
                    >
                      {collections.map((c) => (
                        <option key={c.id} value={c.id} className="bg-luga-bg dark:bg-black">
                          {c.volumeNumber}: {c.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-[10px] text-luga-muted uppercase">GARMENT DESCRIPTION</label>
                    <textarea
                      rows={2}
                      placeholder="Detailed architectural cut, drape, and silhouette description..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full bg-transparent border border-luga-border dark:border-luga-darkBorder p-2.5 text-luga-ink dark:text-luga-darkInk focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-[10px] text-luga-muted uppercase">KATHMANDU CRAFTSMANSHIP STORY</label>
                    <textarea
                      rows={2}
                      placeholder="Details on Patan/Bhaktapur weavers, pit-looms, raw Mustang yak fibers, or natural dye origins..."
                      value={craftStory}
                      onChange={(e) => setCraftStory(e.target.value)}
                      className="w-full bg-transparent border border-luga-border dark:border-luga-darkBorder p-2.5 text-luga-ink dark:text-luga-darkInk focus:outline-none"
                    />
                  </div>
                </div>

                {/* Stock Matrix across sizes */}
                <div className="space-y-2 border-t border-luga-border dark:border-luga-darkBorder pt-4">
                  <label className="text-[10px] text-luga-muted uppercase tracking-wider block font-bold">
                    SIZE & INVENTORY MATRIX (AVAILABLE UNITS)
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3">
                    {(["XS", "S", "M", "L", "XL", "XXL"] as GarmentSize[]).map((size) => (
                      <div key={size} className="space-y-1 text-center">
                        <span className="text-[10px] font-bold text-luga-ink dark:text-luga-darkInk">{size}</span>
                        <input
                          type="number"
                          min={0}
                          value={stockMatrix[size]}
                          onChange={(e) =>
                            setStockMatrix({ ...stockMatrix, [size]: Number(e.target.value) })
                          }
                          className="w-full bg-transparent border border-luga-border dark:border-luga-darkBorder p-2 text-center text-luga-ink dark:text-luga-darkInk focus:outline-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Multi-Image Uploader */}
                <div className="space-y-4 border-t border-luga-border dark:border-luga-darkBorder pt-4">
                  <label className="text-[10px] text-luga-muted uppercase tracking-wider block font-bold">
                    GARMENT EDITORIAL VISUAL SLOTS (NO STOCK PHOTOS NEEDED)
                  </label>
                  <p className="text-[10px] text-luga-muted">
                    If no photo is uploaded, Obsidian Apparel&apos;s architectural wireframe placeholder will automatically display in the storefront.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Primary Front */}
                    <div className="p-4 border border-luga-border dark:border-luga-darkBorder space-y-3">
                      <div className="text-[10px] uppercase font-bold text-luga-ink dark:text-luga-darkInk">
                        01 // PRIMARY FRONT IMAGE
                      </div>
                      <div className="h-36 bg-luga-surface dark:bg-luga-darkSurface overflow-hidden">
                        <ManagedImage
                          src={primaryImageUrl}
                          slotName="PRODUCT_FRONT"
                          aspectRatio="4:5"
                          resolution="1200×1500px"
                          showInfo={false}
                          className="h-full w-full"
                        />
                      </div>
                      <label className="cursor-pointer block py-2 px-3 border border-luga-border text-center hover:border-luga-ink text-[10px] uppercase">
                        Upload Front File
                        <input
                          type="file"
                          accept="image/*,video/mp4,video/webm,video/quicktime"
                          className="hidden"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) handleFileToUrl(f, "primary");
                          }}
                        />
                      </label>
                      <input
                        type="url"
                        placeholder="Or paste media / video URL..."
                        value={primaryImageUrl || ""}
                        onChange={(e) => setPrimaryImageUrl(e.target.value)}
                        className="w-full bg-transparent border border-luga-border p-1.5 text-[10px] focus:outline-none"
                      />
                    </div>

                    {/* Hover Back */}
                    <div className="p-4 border border-luga-border dark:border-luga-darkBorder space-y-3">
                      <div className="text-[10px] uppercase font-bold text-luga-ink dark:text-luga-darkInk">
                        02 // SECONDARY HOVER BACK IMAGE
                      </div>
                      <div className="h-36 bg-luga-surface dark:bg-luga-darkSurface overflow-hidden">
                        <ManagedImage
                          src={hoverImageUrl}
                          slotName="PRODUCT_BACK"
                          aspectRatio="4:5"
                          resolution="1200×1500px"
                          showInfo={false}
                          className="h-full w-full"
                        />
                      </div>
                      <label className="cursor-pointer block py-2 px-3 border border-luga-border text-center hover:border-luga-ink text-[10px] uppercase">
                        Upload Back File
                        <input
                          type="file"
                          accept="image/*,video/mp4,video/webm,video/quicktime"
                          className="hidden"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) handleFileToUrl(f, "hover");
                          }}
                        />
                      </label>
                      <input
                        type="url"
                        placeholder="Or paste media / video URL..."
                        value={hoverImageUrl || ""}
                        onChange={(e) => setHoverImageUrl(e.target.value)}
                        className="w-full bg-transparent border border-luga-border p-1.5 text-[10px] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Toggles */}
                <div className="flex gap-6 border-t border-luga-border dark:border-luga-darkBorder pt-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="accent-luga-crimson dark:accent-luga-gold"
                    />
                    <span className="uppercase text-[11px]">Feature on Homepage</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isNewArrival}
                      onChange={(e) => setIsNewArrival(e.target.checked)}
                      className="accent-luga-crimson dark:accent-luga-gold"
                    />
                    <span className="uppercase text-[11px]">Mark as New Drop</span>
                  </label>
                </div>

                {/* Actions */}
                <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6 border-t border-luga-border dark:border-luga-darkBorder">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="w-full sm:w-auto px-6 py-3 border border-luga-border uppercase tracking-ultra text-luga-muted hover:text-luga-ink text-center"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="w-full sm:w-auto px-8 py-3 bg-luga-ink text-white dark:bg-luga-darkInk dark:text-black uppercase tracking-ultra hover:bg-luga-crimson dark:hover:bg-luga-gold transition-colors text-center flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-wait"
                  >
                    {isSaving ? (
                      <>
                        <Compass className="w-4 h-4 animate-spin-slow text-luga-crimson dark:text-luga-gold" />
                        <span>SYNCING TO SUPABASE...</span>
                      </>
                    ) : (
                      <span>{editingProduct ? "SAVE CHANGES" : "PUBLISH GARMENT"}</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
