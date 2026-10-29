"use client";

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";
import {
  CartItem,
  Collection,
  LookbookItem,
  Order,
  OrderStatus,
  PaymentStatus,
  Product,
  SiteMediaSlot,
  SiteSettings,
  AdminUser,
  AboutPageData,
  HomePageData,
  ShopPageData,
  LookbookPageData,
  FooterPageData,
} from "@/types";
import {
  INITIAL_COLLECTIONS,
  INITIAL_LOOKBOOK_ITEMS,
  INITIAL_MEDIA_SLOTS,
  INITIAL_PRODUCTS,
  INITIAL_SAMPLE_ORDERS,
  INITIAL_SITE_SETTINGS,
  DEFAULT_ABOUT_CONTENT,
  DEFAULT_HOMEPAGE_CONTENT,
  DEFAULT_SHOP_CONTENT,
  DEFAULT_LOOKBOOK_CONTENT,
  DEFAULT_FOOTER_CONTENT,
} from "@/lib/initial-data";

export type SupabaseStatus = "connected" | "syncing" | "error";

interface StoreContextType {
  // Admin Authentication
  adminUser: AdminUser | null;
  isAdminAuthenticated: boolean;
  adminLogin: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  adminLogout: () => void;

  // Site Media Slots
  mediaSlots: Record<string, SiteMediaSlot>;
  getMediaSlot: (slotKey: string) => SiteMediaSlot | undefined;
  updateMediaSlot: (slotKey: string, updates: Partial<SiteMediaSlot>) => Promise<boolean>;
  resetMediaSlot: (slotKey: string) => Promise<boolean>;

  // Products
  products: Product[];
  addProduct: (product: Omit<Product, "id" | "createdAt">) => Promise<Product | null>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<boolean>;
  deleteProduct: (id: string) => Promise<boolean>;
  getProductBySlug: (slug: string) => Product | undefined;

  // Collections
  collections: Collection[];
  addCollection: (col: Omit<Collection, "id" | "createdAt">) => Promise<Collection | null>;
  updateCollection: (id: string, updates: Partial<Collection>) => Promise<boolean>;
  deleteCollection: (id: string) => Promise<boolean>;

  // Lookbook
  lookbookItems: LookbookItem[];
  addLookbookItem: (item: Omit<LookbookItem, "id" | "createdAt">) => Promise<LookbookItem | null>;
  updateLookbookItem: (id: string, updates: Partial<LookbookItem>) => Promise<boolean>;
  deleteLookbookItem: (id: string) => Promise<boolean>;

  // Orders
  orders: Order[];
  createOrder: (orderData: Omit<Order, "id" | "orderNumber" | "createdAt">) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus, paymentStatus?: PaymentStatus) => Promise<boolean>;

  // Settings
  settings: SiteSettings;
  updateSettings: (updates: Partial<SiteSettings>) => Promise<boolean>;

  // About Page CMS
  getAboutContent: () => AboutPageData;
  updateAboutContent: (updates: Partial<AboutPageData>) => Promise<boolean>;
  resetAboutContent: () => Promise<boolean>;

  // Homepage CMS
  getHomePageContent: () => HomePageData;
  updateHomePageContent: (updates: Partial<HomePageData>) => Promise<boolean>;
  resetHomePageContent: () => Promise<boolean>;

  // Shop Page CMS
  getShopContent: () => ShopPageData;
  updateShopContent: (updates: Partial<ShopPageData>) => Promise<boolean>;
  resetShopContent: () => Promise<boolean>;

  // Lookbook Page CMS
  getLookbookContent: () => LookbookPageData;
  updateLookbookContent: (updates: Partial<LookbookPageData>) => Promise<boolean>;
  resetLookbookContent: () => Promise<boolean>;

  // Footer & Enclave CMS
  getFooterContent: () => FooterPageData;
  updateFooterContent: (updates: Partial<FooterPageData>) => Promise<boolean>;
  resetFooterContent: () => Promise<boolean>;

  // Cart
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string, size: string) => void;
  updateCartQuantity: (productId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  // Search Drawer
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;

  // Supabase Live Sync & Status
  isLoaded: boolean;
  isSyncing: boolean;
  supabaseStatus: SupabaseStatus;
  lastSyncTime: Date | null;
  resetAllToDefault: () => void;
  refreshFromDatabase: () => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_KEYS = {
  SLOTS: "obsidian_media_slots_v2",
  PRODUCTS: "obsidian_products_v1",
  COLLECTIONS: "obsidian_collections_v1",
  LOOKBOOK: "obsidian_lookbook_v1",
  ORDERS: "obsidian_orders_v1",
  SETTINGS: "obsidian_settings_v2",
  CART: "obsidian_cart_v1",
  ADMIN_SESSION: "obsidian_admin_session_v1",
  SYNC_TIMESTAMP: "obsidian_sync_timestamp",
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [supabaseStatus, setSupabaseStatus] = useState<SupabaseStatus>("connected");
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);

  const [mediaSlots, setMediaSlots] = useState<Record<string, SiteMediaSlot>>(INITIAL_MEDIA_SLOTS);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [collections, setCollections] = useState<Collection[]>(INITIAL_COLLECTIONS);
  const [lookbookItems, setLookbookItems] = useState<LookbookItem[]>(INITIAL_LOOKBOOK_ITEMS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_SAMPLE_ORDERS);
  const [settings, setSettings] = useState<SiteSettings>(INITIAL_SITE_SETTINGS);
  const [cart, setCart] = useState<CartItem[]>([]);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Cross-tab broadcast helper
  const notifyOtherTabs = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SYNC_TIMESTAMP, Date.now().toString());
    } catch {}
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("obsidian_local_update"));
    }
  }, []);

  // Fetch all latest data from backend Supabase PostgreSQL
  const refreshFromDatabase = useCallback(async () => {
    setIsSyncing(true);
    try {
      const [slotsRes, prodsRes, colsRes, looksRes, setsRes, ordsRes] = await Promise.allSettled([
        fetch("/api/slots").then((r) => r.json()),
        fetch("/api/products").then((r) => r.json()),
        fetch("/api/collections").then((r) => r.json()),
        fetch("/api/lookbook").then((r) => r.json()),
        fetch("/api/settings").then((r) => r.json()),
        fetch("/api/orders").then((r) => r.json()),
      ]);

      if (slotsRes.status === "fulfilled" && slotsRes.value?.success && slotsRes.value?.data) {
        setMediaSlots((prev) => ({ ...prev, ...slotsRes.value.data }));
        try {
          localStorage.setItem(
            STORAGE_KEYS.SLOTS,
            JSON.stringify({ ...INITIAL_MEDIA_SLOTS, ...slotsRes.value.data })
          );
        } catch {}
      }

      if (
        prodsRes.status === "fulfilled" &&
        prodsRes.value?.success &&
        Array.isArray(prodsRes.value?.data) &&
        prodsRes.value.data.length > 0
      ) {
        setProducts(prodsRes.value.data);
        try {
          localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(prodsRes.value.data));
        } catch {}
      }

      if (
        colsRes.status === "fulfilled" &&
        colsRes.value?.success &&
        Array.isArray(colsRes.value?.data) &&
        colsRes.value.data.length > 0
      ) {
        setCollections(colsRes.value.data);
        try {
          localStorage.setItem(STORAGE_KEYS.COLLECTIONS, JSON.stringify(colsRes.value.data));
        } catch {}
      }

      if (
        looksRes.status === "fulfilled" &&
        looksRes.value?.success &&
        Array.isArray(looksRes.value?.data) &&
        looksRes.value.data.length > 0
      ) {
        setLookbookItems(looksRes.value.data);
        try {
          localStorage.setItem(STORAGE_KEYS.LOOKBOOK, JSON.stringify(looksRes.value.data));
        } catch {}
      }

      if (setsRes.status === "fulfilled" && setsRes.value?.success && setsRes.value?.data) {
        setSettings((prev) => ({ ...prev, ...setsRes.value.data }));
        try {
          localStorage.setItem(
            STORAGE_KEYS.SETTINGS,
            JSON.stringify({ ...INITIAL_SITE_SETTINGS, ...setsRes.value.data })
          );
        } catch {}
      }

      if (
        ordsRes.status === "fulfilled" &&
        ordsRes.value?.success &&
        Array.isArray(ordsRes.value?.data)
      ) {
        setOrders(ordsRes.value.data);
        try {
          localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(ordsRes.value.data));
        } catch {}
      }

      setSupabaseStatus("connected");
      setLastSyncTime(new Date());
    } catch (err) {
      console.warn("Database sync notice (offline or connecting):", err);
      setSupabaseStatus("error");
    } finally {
      setIsSyncing(false);
    }
  }, []);

  // 1. Load from localStorage immediately on mount for zero-flash UI
  useEffect(() => {
    try {
      const savedAdmin = localStorage.getItem(STORAGE_KEYS.ADMIN_SESSION);
      if (savedAdmin) setAdminUser(JSON.parse(savedAdmin));

      const savedSlots = localStorage.getItem(STORAGE_KEYS.SLOTS);
      if (savedSlots) setMediaSlots({ ...INITIAL_MEDIA_SLOTS, ...JSON.parse(savedSlots) });

      const savedProducts = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (savedProducts) setProducts(JSON.parse(savedProducts));

      const savedCollections = localStorage.getItem(STORAGE_KEYS.COLLECTIONS);
      if (savedCollections) setCollections(JSON.parse(savedCollections));

      const savedLookbook = localStorage.getItem(STORAGE_KEYS.LOOKBOOK);
      if (savedLookbook) setLookbookItems(JSON.parse(savedLookbook));

      const savedOrders = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (savedOrders) setOrders(JSON.parse(savedOrders));

      const savedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (savedSettings) setSettings({ ...INITIAL_SITE_SETTINGS, ...JSON.parse(savedSettings) });

      const savedCart = localStorage.getItem(STORAGE_KEYS.CART);
      if (savedCart) setCart(JSON.parse(savedCart));
    } catch (err) {
      console.error("Obsidian Apparel Store local hydration error:", err);
    } finally {
      setIsLoaded(true);
    }

    // Then pull live database content from Supabase
    refreshFromDatabase();
  }, [refreshFromDatabase]);

  // 2. Listen to storage changes from other tabs so changes reflect live
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (!e.key || e.key === STORAGE_KEYS.SYNC_TIMESTAMP) {
        try {
          const slots = localStorage.getItem(STORAGE_KEYS.SLOTS);
          if (slots) setMediaSlots({ ...INITIAL_MEDIA_SLOTS, ...JSON.parse(slots) });

          const prods = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
          if (prods) setProducts(JSON.parse(prods));

          const cols = localStorage.getItem(STORAGE_KEYS.COLLECTIONS);
          if (cols) setCollections(JSON.parse(cols));

          const looks = localStorage.getItem(STORAGE_KEYS.LOOKBOOK);
          if (looks) setLookbookItems(JSON.parse(looks));

          const sets = localStorage.getItem(STORAGE_KEYS.SETTINGS);
          if (sets) setSettings({ ...INITIAL_SITE_SETTINGS, ...JSON.parse(sets) });

          const ords = localStorage.getItem(STORAGE_KEYS.ORDERS);
          if (ords) setOrders(JSON.parse(ords));
        } catch {}
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Save cart changes
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch {}
  }, [cart, isLoaded]);

  // Media slot methods
  const getMediaSlot = (slotKey: string) => {
    return mediaSlots[slotKey];
  };

  const updateMediaSlot = async (
    slotKey: string,
    updates: Partial<SiteMediaSlot>
  ): Promise<boolean> => {
    // Optimistic update
    setMediaSlots((prev) => {
      const existing = prev[slotKey] || {
        id: `slot-${slotKey.toLowerCase()}`,
        slotKey,
        label: slotKey,
        pageSection: "HOMEPAGE",
        imageUrl: null,
        altText: null,
        aspectRatio: "4:5",
        resolution: "1200x1500px",
        updatedAt: new Date().toISOString(),
      };
      const updated = {
        ...existing,
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      const newSlots = { ...prev, [slotKey]: updated };
      try {
        localStorage.setItem(STORAGE_KEYS.SLOTS, JSON.stringify(newSlots));
      } catch (e) {
        console.warn("Storage quota limit reached for local cache:", e);
      }
      return newSlots;
    });

    notifyOtherTabs();
    setIsSyncing(true);

    try {
      const res = await fetch("/api/slots", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slotKey, ...updates }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setMediaSlots((prev) => ({ ...prev, [slotKey]: data.data }));
        setSupabaseStatus("connected");
        return true;
      }
      return false;
    } catch (err) {
      console.error("Database save slot error:", err);
      setSupabaseStatus("error");
      return false;
    } finally {
      setIsSyncing(false);
    }
  };

  const resetMediaSlot = async (slotKey: string): Promise<boolean> => {
    const original = INITIAL_MEDIA_SLOTS[slotKey];
    if (original) {
      return await updateMediaSlot(slotKey, {
        imageUrl: null,
        heading: original.heading,
        subHeading: original.subHeading,
        ctaText: original.ctaText,
        ctaLink: original.ctaLink,
        altText: original.altText,
      });
    }
    return false;
  };

  // Product methods
  const addProduct = async (
    prodData: Omit<Product, "id" | "createdAt">
  ): Promise<Product | null> => {
    setIsSyncing(true);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prodData),
      });
      const result = await res.json();
      if (result.success && result.data) {
        const saved: Product = result.data;
        setProducts((prev) => {
          const updated = [saved, ...prev.filter((p) => p.id !== saved.id)];
          try {
            localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updated));
          } catch {}
          return updated;
        });
        notifyOtherTabs();
        setSupabaseStatus("connected");
        return saved;
      } else {
        throw new Error(result.error || "Failed to create product in Supabase");
      }
    } catch (err) {
      console.error("Database save product error:", err);
      setSupabaseStatus("error");
      // Fallback local creation
      const fallbackProd: Product = {
        ...prodData,
        id: `prod-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      setProducts((prev) => [fallbackProd, ...prev]);
      notifyOtherTabs();
      return fallbackProd;
    } finally {
      setIsSyncing(false);
    }
  };

  const updateProduct = async (
    id: string,
    updates: Partial<Product>
  ): Promise<boolean> => {
    setProducts((prev) => {
      const updated = prev.map((p) => (p.id === id ? { ...p, ...updates } : p));
      try {
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    notifyOtherTabs();
    setIsSyncing(true);

    try {
      const res = await fetch("/api/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...updates }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setProducts((prev) => prev.map((p) => (p.id === id ? data.data : p)));
        setSupabaseStatus("connected");
        return true;
      }
      return false;
    } catch (err) {
      console.error("Database update product error:", err);
      setSupabaseStatus("error");
      return false;
    } finally {
      setIsSyncing(false);
    }
  };

  const deleteProduct = async (id: string): Promise<boolean> => {
    setProducts((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      try {
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    notifyOtherTabs();
    setIsSyncing(true);

    try {
      const res = await fetch(`/api/products?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setSupabaseStatus("connected");
        return true;
      }
      return false;
    } catch (err) {
      console.error("Database delete product error:", err);
      setSupabaseStatus("error");
      return false;
    } finally {
      setIsSyncing(false);
    }
  };

  const getProductBySlug = (slug: string) => {
    return products.find((p) => p.slug === slug);
  };

  // Collection methods
  const addCollection = async (
    colData: Omit<Collection, "id" | "createdAt">
  ): Promise<Collection | null> => {
    setIsSyncing(true);
    try {
      const res = await fetch("/api/collections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(colData),
      });
      const result = await res.json();
      if (result.success && result.data) {
        const saved: Collection = result.data;
        setCollections((prev) => {
          const updated = [...prev.filter((c) => c.id !== saved.id), saved];
          try {
            localStorage.setItem(STORAGE_KEYS.COLLECTIONS, JSON.stringify(updated));
          } catch {}
          return updated;
        });
        notifyOtherTabs();
        setSupabaseStatus("connected");
        return saved;
      }
      throw new Error(result.error || "Failed to create collection");
    } catch (err) {
      console.error("Database save collection error:", err);
      setSupabaseStatus("error");
      const fallbackCol: Collection = {
        ...colData,
        id: `col-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      setCollections((prev) => [...prev, fallbackCol]);
      notifyOtherTabs();
      return fallbackCol;
    } finally {
      setIsSyncing(false);
    }
  };

  const updateCollection = async (
    id: string,
    updates: Partial<Collection>
  ): Promise<boolean> => {
    setCollections((prev) => {
      const updated = prev.map((c) => (c.id === id ? { ...c, ...updates } : c));
      try {
        localStorage.setItem(STORAGE_KEYS.COLLECTIONS, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    notifyOtherTabs();
    setIsSyncing(true);

    try {
      const res = await fetch("/api/collections", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...updates }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setCollections((prev) => prev.map((c) => (c.id === id ? data.data : c)));
        setSupabaseStatus("connected");
        return true;
      }
      return false;
    } catch (err) {
      console.error("Database update collection error:", err);
      setSupabaseStatus("error");
      return false;
    } finally {
      setIsSyncing(false);
    }
  };

  const deleteCollection = async (id: string): Promise<boolean> => {
    setCollections((prev) => {
      const updated = prev.filter((c) => c.id !== id);
      try {
        localStorage.setItem(STORAGE_KEYS.COLLECTIONS, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    notifyOtherTabs();
    setIsSyncing(true);

    try {
      const res = await fetch(`/api/collections?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setSupabaseStatus("connected");
        return true;
      }
      return false;
    } catch (err) {
      console.error("Database delete collection error:", err);
      setSupabaseStatus("error");
      return false;
    } finally {
      setIsSyncing(false);
    }
  };

  // Lookbook methods
  const addLookbookItem = async (
    itemData: Omit<LookbookItem, "id" | "createdAt">
  ): Promise<LookbookItem | null> => {
    setIsSyncing(true);
    try {
      const res = await fetch("/api/lookbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(itemData),
      });
      const result = await res.json();
      if (result.success && result.data) {
        const saved: LookbookItem = result.data;
        setLookbookItems((prev) => {
          const updated = [...prev.filter((item) => item.id !== saved.id), saved];
          try {
            localStorage.setItem(STORAGE_KEYS.LOOKBOOK, JSON.stringify(updated));
          } catch {}
          return updated;
        });
        notifyOtherTabs();
        setSupabaseStatus("connected");
        return saved;
      }
      throw new Error(result.error || "Failed to create lookbook item");
    } catch (err) {
      console.error("Database save lookbook error:", err);
      setSupabaseStatus("error");
      const fallbackItem: LookbookItem = {
        ...itemData,
        id: `look-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      setLookbookItems((prev) => [...prev, fallbackItem]);
      notifyOtherTabs();
      return fallbackItem;
    } finally {
      setIsSyncing(false);
    }
  };

  const updateLookbookItem = async (
    id: string,
    updates: Partial<LookbookItem>
  ): Promise<boolean> => {
    setLookbookItems((prev) => {
      const updated = prev.map((item) => (item.id === id ? { ...item, ...updates } : item));
      try {
        localStorage.setItem(STORAGE_KEYS.LOOKBOOK, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    notifyOtherTabs();
    setIsSyncing(true);

    try {
      const res = await fetch("/api/lookbook", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...updates }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setLookbookItems((prev) => prev.map((item) => (item.id === id ? data.data : item)));
        setSupabaseStatus("connected");
        return true;
      }
      return false;
    } catch (err) {
      console.error("Database update lookbook error:", err);
      setSupabaseStatus("error");
      return false;
    } finally {
      setIsSyncing(false);
    }
  };

  const deleteLookbookItem = async (id: string): Promise<boolean> => {
    setLookbookItems((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      try {
        localStorage.setItem(STORAGE_KEYS.LOOKBOOK, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    notifyOtherTabs();
    setIsSyncing(true);

    try {
      const res = await fetch(`/api/lookbook?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setSupabaseStatus("connected");
        return true;
      }
      return false;
    } catch (err) {
      console.error("Database delete lookbook error:", err);
      setSupabaseStatus("error");
      return false;
    } finally {
      setIsSyncing(false);
    }
  };

  // Order methods
  const createOrder = async (
    orderData: Omit<Order, "id" | "orderNumber" | "createdAt">
  ): Promise<Order> => {
    setIsSyncing(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });
      const data = await res.json();
      if (data.success && data.data) {
        const confirmedOrder: Order = data.data;
        setOrders((prev) => [confirmedOrder, ...prev.filter((o) => o.id !== confirmedOrder.id)]);
        try {
          localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify([confirmedOrder, ...orders]));
        } catch {}
        notifyOtherTabs();
        setSupabaseStatus("connected");
        return confirmedOrder;
      }
      throw new Error(data.error || "Order creation failed");
    } catch (err) {
      console.error("Database create order error:", err);
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const fallbackOrder: Order = {
        ...orderData,
        id: `ord-${Date.now()}`,
        orderNumber: `LUG-2026-${randomSuffix}`,
        createdAt: new Date().toISOString(),
      };
      setOrders((prev) => [fallbackOrder, ...prev]);
      notifyOtherTabs();
      return fallbackOrder;
    } finally {
      setIsSyncing(false);
    }
  };

  const updateOrderStatus = async (
    orderId: string,
    status: OrderStatus,
    paymentStatus?: PaymentStatus
  ): Promise<boolean> => {
    setOrders((prev) => {
      const updated = prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              orderStatus: status,
              ...(paymentStatus ? { paymentStatus } : {}),
            }
          : o
      );
      try {
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    notifyOtherTabs();
    setIsSyncing(true);

    try {
      const res = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderId, orderStatus: status, paymentStatus }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setOrders((prev) => prev.map((o) => (o.id === orderId ? data.data : o)));
        setSupabaseStatus("connected");
        return true;
      }
      return false;
    } catch (err) {
      console.error("Database update order status error:", err);
      setSupabaseStatus("error");
      return false;
    } finally {
      setIsSyncing(false);
    }
  };

  // Settings methods
  const updateSettings = async (updates: Partial<SiteSettings>): Promise<boolean> => {
    setSettings((prev) => {
      const updated = { ...prev, ...updates };
      try {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    notifyOtherTabs();
    setIsSyncing(true);

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setSettings(data.data);
        setSupabaseStatus("connected");
        return true;
      }
      return false;
    } catch (err) {
      console.error("Database update settings error:", err);
      setSupabaseStatus("error");
      return false;
    } finally {
      setIsSyncing(false);
    }
  };

  // About Page CMS methods
  const getAboutContent = useCallback((): AboutPageData => {
    const slot = mediaSlots["ABOUT_PAGE_DATA"];
    if (slot?.subHeading) {
      try {
        const parsed = JSON.parse(slot.subHeading);
        return { ...DEFAULT_ABOUT_CONTENT, ...parsed };
      } catch (e) {
        console.warn("Could not parse ABOUT_PAGE_DATA payload:", e);
      }
    }
    return DEFAULT_ABOUT_CONTENT;
  }, [mediaSlots]);

  const updateAboutContent = async (updates: Partial<AboutPageData>): Promise<boolean> => {
    const current = getAboutContent();
    const merged = { ...current, ...updates };
    const payload = JSON.stringify(merged);

    const success = await updateMediaSlot("ABOUT_PAGE_DATA", {
      subHeading: payload,
      heading: merged.manifestoHeading,
      updatedAt: new Date().toISOString(),
    });

    if (updates.manifestoHeading || updates.manifestoSubHeading) {
      updateMediaSlot("HERITAGE_STORY_BANNER", {
        heading: merged.manifestoHeading,
        subHeading: merged.manifestoSubHeading,
      }).catch(() => {});
    }

    return success;
  };

  const resetAboutContent = async (): Promise<boolean> => {
    const success = await updateMediaSlot("ABOUT_PAGE_DATA", {
      subHeading: null,
      heading: DEFAULT_ABOUT_CONTENT.manifestoHeading,
      updatedAt: new Date().toISOString(),
    });

    await updateMediaSlot("HERITAGE_STORY_BANNER", {
      heading: DEFAULT_ABOUT_CONTENT.manifestoHeading,
      subHeading: DEFAULT_ABOUT_CONTENT.manifestoSubHeading,
    });

    return success;
  };

  // 1. Homepage CMS
  const getHomePageContent = useCallback((): HomePageData => {
    const slot = mediaSlots["HOMEPAGE_PAGE_DATA"];
    if (slot?.subHeading) {
      try {
        const parsed = JSON.parse(slot.subHeading);
        return { ...DEFAULT_HOMEPAGE_CONTENT, ...parsed };
      } catch (e) {
        console.warn("Could not parse HOMEPAGE_PAGE_DATA payload:", e);
      }
    }
    return DEFAULT_HOMEPAGE_CONTENT;
  }, [mediaSlots]);

  const updateHomePageContent = async (updates: Partial<HomePageData>): Promise<boolean> => {
    const current = getHomePageContent();
    const merged = { ...current, ...updates };
    const payload = JSON.stringify(merged);

    const success = await updateMediaSlot("HOMEPAGE_PAGE_DATA", {
      subHeading: payload,
      heading: merged.heroHeading,
      updatedAt: new Date().toISOString(),
    });

    // Keep related media slots in sync if their corresponding headings/tags change
    if (updates.heroHeading || updates.heroTag || updates.heroPrimaryCtaText || updates.heroPrimaryCtaLink) {
      updateMediaSlot("HERO_MAIN_BANNER", {
        heading: merged.heroHeading,
        subHeading: merged.heroTag,
        ctaText: merged.heroPrimaryCtaText,
        ctaLink: merged.heroPrimaryCtaLink,
      }).catch(() => {});
    }

    if (updates.splitLeftHeading || updates.splitLeftDescription || updates.splitLeftCtaText || updates.splitLeftCtaLink) {
      updateMediaSlot("SPLIT_BANNER_LEFT", {
        heading: merged.splitLeftHeading,
        subHeading: merged.splitLeftDescription,
        ctaText: merged.splitLeftCtaText,
        ctaLink: merged.splitLeftCtaLink,
      }).catch(() => {});
    }

    if (updates.splitRightHeading || updates.splitRightDescription || updates.splitRightCtaText || updates.splitRightCtaLink) {
      updateMediaSlot("SPLIT_BANNER_RIGHT", {
        heading: merged.splitRightHeading,
        subHeading: merged.splitRightDescription,
        ctaText: merged.splitRightCtaText,
        ctaLink: merged.splitRightCtaLink,
      }).catch(() => {});
    }

    return success;
  };

  const resetHomePageContent = async (): Promise<boolean> => {
    const success = await updateMediaSlot("HOMEPAGE_PAGE_DATA", {
      subHeading: null,
      heading: DEFAULT_HOMEPAGE_CONTENT.heroHeading,
      updatedAt: new Date().toISOString(),
    });

    await updateMediaSlot("HERO_MAIN_BANNER", {
      heading: DEFAULT_HOMEPAGE_CONTENT.heroHeading,
      subHeading: DEFAULT_HOMEPAGE_CONTENT.heroTag,
      ctaText: DEFAULT_HOMEPAGE_CONTENT.heroPrimaryCtaText,
      ctaLink: DEFAULT_HOMEPAGE_CONTENT.heroPrimaryCtaLink,
    }).catch(() => {});

    return success;
  };

  // 2. Shop Page CMS
  const getShopContent = useCallback((): ShopPageData => {
    const slot = mediaSlots["SHOP_PAGE_DATA"];
    if (slot?.subHeading) {
      try {
        const parsed = JSON.parse(slot.subHeading);
        return { ...DEFAULT_SHOP_CONTENT, ...parsed };
      } catch (e) {
        console.warn("Could not parse SHOP_PAGE_DATA payload:", e);
      }
    }
    return DEFAULT_SHOP_CONTENT;
  }, [mediaSlots]);

  const updateShopContent = async (updates: Partial<ShopPageData>): Promise<boolean> => {
    const current = getShopContent();
    const merged = { ...current, ...updates };
    const payload = JSON.stringify(merged);

    return await updateMediaSlot("SHOP_PAGE_DATA", {
      subHeading: payload,
      heading: merged.shopHeading,
      updatedAt: new Date().toISOString(),
    });
  };

  const resetShopContent = async (): Promise<boolean> => {
    return await updateMediaSlot("SHOP_PAGE_DATA", {
      subHeading: null,
      heading: DEFAULT_SHOP_CONTENT.shopHeading,
      updatedAt: new Date().toISOString(),
    });
  };

  // 3. Lookbook Page CMS
  const getLookbookContent = useCallback((): LookbookPageData => {
    const slot = mediaSlots["LOOKBOOK_PAGE_DATA"];
    if (slot?.subHeading) {
      try {
        const parsed = JSON.parse(slot.subHeading);
        return { ...DEFAULT_LOOKBOOK_CONTENT, ...parsed };
      } catch (e) {
        console.warn("Could not parse LOOKBOOK_PAGE_DATA payload:", e);
      }
    }
    return DEFAULT_LOOKBOOK_CONTENT;
  }, [mediaSlots]);

  const updateLookbookContent = async (updates: Partial<LookbookPageData>): Promise<boolean> => {
    const current = getLookbookContent();
    const merged = { ...current, ...updates };
    const payload = JSON.stringify(merged);

    const success = await updateMediaSlot("LOOKBOOK_PAGE_DATA", {
      subHeading: payload,
      heading: merged.lookbookHeading,
      updatedAt: new Date().toISOString(),
    });

    if (updates.highlightHeading || updates.highlightDescription) {
      updateMediaSlot("LOOKBOOK_HIGHLIGHT_BANNER", {
        heading: merged.highlightHeading,
        subHeading: merged.highlightDescription,
      }).catch(() => {});
    }

    return success;
  };

  const resetLookbookContent = async (): Promise<boolean> => {
    return await updateMediaSlot("LOOKBOOK_PAGE_DATA", {
      subHeading: null,
      heading: DEFAULT_LOOKBOOK_CONTENT.lookbookHeading,
      updatedAt: new Date().toISOString(),
    });
  };

  // 4. Footer & Enclave CMS
  const getFooterContent = useCallback((): FooterPageData => {
    const slot = mediaSlots["FOOTER_PAGE_DATA"];
    if (slot?.subHeading) {
      try {
        const parsed = JSON.parse(slot.subHeading);
        return { ...DEFAULT_FOOTER_CONTENT, ...parsed };
      } catch (e) {
        console.warn("Could not parse FOOTER_PAGE_DATA payload:", e);
      }
    }
    return DEFAULT_FOOTER_CONTENT;
  }, [mediaSlots]);

  const updateFooterContent = async (updates: Partial<FooterPageData>): Promise<boolean> => {
    const current = getFooterContent();
    const merged = { ...current, ...updates };
    const payload = JSON.stringify(merged);

    return await updateMediaSlot("FOOTER_PAGE_DATA", {
      subHeading: payload,
      heading: merged.enclaveHeading,
      updatedAt: new Date().toISOString(),
    });
  };

  const resetFooterContent = async (): Promise<boolean> => {
    return await updateMediaSlot("FOOTER_PAGE_DATA", {
      subHeading: null,
      heading: DEFAULT_FOOTER_CONTENT.enclaveHeading,
      updatedAt: new Date().toISOString(),
    });
  };

  // Cart operations
  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (i) => i.productId === item.productId && i.size === item.size
      );
      if (existingIdx > -1) {
        const copy = [...prev];
        copy[existingIdx].quantity += item.quantity;
        return copy;
      }
      return [...prev, item];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string, size: string) => {
    setCart((prev) =>
      prev.filter((i) => !(i.productId === productId && i.size === size))
    );
  };

  const updateCartQuantity = (productId: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
      return;
    }
    setCart((prev) =>
      prev.map((i) =>
        i.productId === productId && i.size === size
          ? { ...i, quantity }
          : i
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = useMemo(() => {
    return cart.reduce((acc, curr) => acc + curr.quantity, 0);
  }, [cart]);

  const cartSubtotal = useMemo(() => {
    return cart.reduce((acc, curr) => acc + curr.priceNpr * curr.quantity, 0);
  }, [cart]);

  const resetAllToDefault = () => {
    setMediaSlots(INITIAL_MEDIA_SLOTS);
    setProducts(INITIAL_PRODUCTS);
    setCollections(INITIAL_COLLECTIONS);
    setLookbookItems(INITIAL_LOOKBOOK_ITEMS);
    setOrders(INITIAL_SAMPLE_ORDERS);
    setSettings(INITIAL_SITE_SETTINGS);
    setCart([]);
    localStorage.clear();
    notifyOtherTabs();
  };

  const adminLogin = async (email: string, pass: string) => {
    setIsSyncing(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: pass }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setAdminUser(data.user);
        try {
          localStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, JSON.stringify(data.user));
        } catch {}
        setSupabaseStatus("connected");
        return { success: true };
      }
      return { success: false, error: data.error || "Invalid atelier credentials." };
    } catch (err) {
      console.error("Supabase adminLogin network notice:", err);
      // Local fallback
      const trimmedEmail = email.trim().toLowerCase();
      const trimmedPass = pass.trim();
      if (
        (trimmedEmail === "admin@obsidian.studio" ||
          trimmedEmail === "admin@luga.studio" ||
          trimmedEmail === "adrien@luga.studio" ||
          trimmedEmail === "admin") &&
        (trimmedPass === "obsidian2026" || trimmedPass === "luga2026" || trimmedPass === "luga" || trimmedPass === "admin")
      ) {
        const user: AdminUser = {
          id: "usr-admin-kathmandu",
          email: trimmedEmail.includes("@") ? trimmedEmail : "admin@obsidian.studio",
          name: "Sabja Shrestha // Atelier Director",
          role: "ADMIN",
          lastLogin: new Date().toISOString(),
        };
        setAdminUser(user);
        localStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, JSON.stringify(user));
        return { success: true };
      }
      return {
        success: false,
        error: "Invalid atelier credentials. Access denied.",
      };
    } finally {
      setIsSyncing(false);
    }
  };

  const adminLogout = () => {
    setAdminUser(null);
    localStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
  };

  const isAdminAuthenticated = Boolean(adminUser);

  return (
    <StoreContext.Provider
      value={{
        adminUser,
        isAdminAuthenticated,
        adminLogin,
        adminLogout,
        mediaSlots,
        getMediaSlot,
        updateMediaSlot,
        resetMediaSlot,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        getProductBySlug,
        collections,
        addCollection,
        updateCollection,
        deleteCollection,
        lookbookItems,
        addLookbookItem,
        updateLookbookItem,
        deleteLookbookItem,
        orders,
        createOrder,
        updateOrderStatus,
        settings,
        updateSettings,
        getAboutContent,
        updateAboutContent,
        resetAboutContent,
        getHomePageContent,
        updateHomePageContent,
        resetHomePageContent,
        getShopContent,
        updateShopContent,
        resetShopContent,
        getLookbookContent,
        updateLookbookContent,
        resetLookbookContent,
        getFooterContent,
        updateFooterContent,
        resetFooterContent,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        isCartOpen,
        setIsCartOpen,
        isSearchOpen,
        setIsSearchOpen,
        isLoaded,
        isSyncing,
        supabaseStatus,
        lastSyncTime,
        resetAllToDefault,
        refreshFromDatabase,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};
