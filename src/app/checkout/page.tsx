"use client";

import React, { useState } from "react";
import Link from "next/link";
import { StorefrontLayout } from "@/components/storefront/StorefrontLayout";
import { ManagedImage } from "@/components/common/ManagedImage";
import { useStore } from "@/lib/store-context";
import { DeliveryZone, PaymentMethod, Order } from "@/types";
import { formatNpr } from "@/lib/utils";
import {
  ShieldCheck,
  Truck,
  QrCode,
  CreditCard,
  Banknote,
  CheckCircle2,
  ArrowRight,
  ShoppingBag,
  Compass,
} from "lucide-react";

export default function CheckoutPage() {
  const { cart, cartSubtotal, clearCart, createOrder, settings, getMediaSlot } = useStore();

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("+977 ");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("Kathmandu");
  const [deliveryZone, setDeliveryZone] = useState<DeliveryZone>("VALLEY_INSIDE_RING_ROAD");
  const [toleAddress, setToleAddress] = useState("");
  const [landmark, setLandmark] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("COD");

  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delivery fee calculation
  const isFreeInsideRingRoad =
    deliveryZone === "VALLEY_INSIDE_RING_ROAD" &&
    cartSubtotal >= settings.freeShippingThresholdNpr;

  const shippingNpr =
    isFreeInsideRingRoad
      ? 0
      : deliveryZone === "VALLEY_INSIDE_RING_ROAD"
      ? settings.shippingInsideRingRoadNpr
      : deliveryZone === "VALLEY_OUTSIDE_RING_ROAD"
      ? settings.shippingOutsideRingRoadNpr
      : settings.shippingOutsideValleyNpr;

  const totalNpr = cartSubtotal + shippingNpr;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !phone || !toleAddress) {
      alert("Please fill in your name, Nepal contact number, and address.");
      return;
    }

    setIsSubmitting(true);

    try {
      const order = await createOrder({
      customerName,
      phone,
      email: email || "customer@luga.studio",
      city,
      deliveryZone,
      toleAddress,
      landmark,
      paymentMethod,
      paymentStatus: paymentMethod === "COD" ? "PENDING" : "PENDING",
      orderStatus: "PENDING",
      subtotalNpr: cartSubtotal,
      shippingNpr,
      totalNpr,
      notes,
      items: cart.map((item) => ({
        id: `item-${Date.now()}-${item.productId}`,
        productId: item.productId,
        productTitle: item.title,
        size: item.size,
        quantity: item.quantity,
        priceNpr: item.priceNpr,
        primaryImageUrl: item.primaryImageUrl,
      })),
    });

    clearCart();
    setPlacedOrder(order);
    } catch (err) {
      console.error("Checkout order submission error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Order Confirmed State
  if (placedOrder) {
    const fonepaySlot = getMediaSlot("FONEPAY_QR_CODE");

    return (
      <StorefrontLayout>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-20 text-center space-y-6 sm:space-y-8">
          <div className="w-16 h-16 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto rounded-none">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="font-mono text-[10px] tracking-mega uppercase text-luga-crimson dark:text-luga-gold">
              ORDER CONFIRMED // PATAN ATELIER DISPATCH
            </span>
            <h1 className="font-editorial text-3xl sm:text-5xl text-luga-ink dark:text-luga-darkInk break-words">
              Thank You, {placedOrder.customerName}
            </h1>
            <p className="font-mono text-xs text-luga-muted dark:text-luga-darkMuted uppercase tracking-wider">
              ORDER NUMBER: <strong className="text-luga-ink dark:text-luga-darkInk">{placedOrder.orderNumber}</strong>
            </p>
          </div>

          {/* Payment Specific Instructions */}
          {placedOrder.paymentMethod === "FONEPAY" && (
            <div className="p-6 bg-luga-surface dark:bg-luga-darkSurface border border-luga-border dark:border-luga-darkBorder text-left space-y-4 max-w-md mx-auto">
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-luga-ink dark:text-luga-darkInk uppercase">
                <QrCode className="w-4 h-4 text-luga-crimson dark:text-luga-gold" />
                <span>SCAN & PAY VIA FONEPAY QR</span>
              </div>
              <p className="font-mono text-xs text-luga-muted dark:text-luga-darkMuted leading-relaxed">
                Scan using eSewa, Khalti, or any mobile banking app in Nepal. Amount: <strong>{formatNpr(placedOrder.totalNpr)}</strong>.
              </p>
              <div className="aspect-square w-48 mx-auto bg-white p-2 border border-luga-border">
                <ManagedImage
                  slotKey="FONEPAY_QR_CODE"
                  aspectRatio="1:1"
                  resolution="800×800px"
                  alt="Obsidian Apparel Official Fonepay QR"
                  editorialBadge="FONEPAY QR SLOT"
                />
              </div>
              <p className="font-mono text-[10px] text-center text-luga-muted uppercase">
                Please mention Order ID &apos;{placedOrder.orderNumber}&apos; in Remarks
              </p>
            </div>
          )}

          {placedOrder.paymentMethod === "COD" && (
            <div className="p-4 bg-luga-surface dark:bg-luga-darkSurface border border-luga-border dark:border-luga-darkBorder text-center font-mono text-xs text-luga-muted dark:text-luga-darkMuted max-w-md mx-auto">
              Payment will be collected via <strong>Cash on Delivery ({formatNpr(placedOrder.totalNpr)})</strong> upon courier arrival. Please have exact change ready.
            </div>
          )}

          {/* Summary Box */}
          <div className="border border-luga-border dark:border-luga-darkBorder p-6 text-left font-mono text-xs space-y-3 max-w-md mx-auto">
            <div className="text-[10px] tracking-mega uppercase text-luga-muted border-b border-luga-border/50 dark:border-luga-darkBorder/50 pb-2">
              DISPATCH SUMMARY
            </div>
            <div className="flex justify-between">
              <span className="text-luga-muted">Recipient:</span>
              <span className="font-semibold">{placedOrder.customerName} ({placedOrder.phone})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-luga-muted">Delivery Address:</span>
              <span className="text-right">{placedOrder.toleAddress}, {placedOrder.city}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-luga-muted">Zone:</span>
              <span>{placedOrder.deliveryZone.replace(/_/g, " ")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-luga-muted">Payment:</span>
              <span>{placedOrder.paymentMethod} ({placedOrder.paymentStatus})</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-luga-border/50 dark:border-luga-darkBorder/50 font-bold text-sm">
              <span>Total NPR:</span>
              <span className="text-luga-crimson dark:text-luga-gold">{formatNpr(placedOrder.totalNpr)}</span>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 font-mono text-xs w-full">
            <Link
              href="/shop"
              className="w-full sm:w-auto text-center px-8 py-3.5 bg-luga-ink text-white dark:bg-luga-darkInk dark:text-black uppercase tracking-ultra"
            >
              CONTINUE BROWSING
            </Link>
            <Link
              href="/admin/orders"
              className="w-full sm:w-auto text-center px-8 py-3.5 border border-luga-border dark:border-luga-darkBorder text-luga-ink dark:text-luga-darkInk uppercase tracking-ultra hover:border-luga-crimson dark:hover:border-luga-gold"
            >
              VIEW IN ADMIN CMS →
            </Link>
          </div>
        </div>
      </StorefrontLayout>
    );
  }

  // Empty cart fallback
  if (cart.length === 0) {
    return (
      <StorefrontLayout>
        <div className="max-w-4xl mx-auto py-32 px-6 text-center space-y-4">
          <ShoppingBag className="w-12 h-12 text-luga-muted mx-auto" />
          <h1 className="font-editorial text-4xl text-luga-ink dark:text-luga-darkInk">
            Your Bag is Empty
          </h1>
          <p className="font-mono text-xs text-luga-muted dark:text-luga-darkMuted uppercase tracking-wider">
            Add garments to your shopping bag before proceeding to checkout.
          </p>
          <Link
            href="/shop"
            className="inline-block px-8 py-3.5 bg-luga-ink text-white dark:bg-luga-darkInk dark:text-black font-mono text-xs uppercase tracking-ultra"
          >
            EXPLORE READY-TO-WEAR
          </Link>
        </div>
      </StorefrontLayout>
    );
  }

  return (
    <StorefrontLayout>
      <div className="max-w-[1920px] mx-auto px-4 sm:px-8 py-8 sm:py-16">
        <div className="border-b border-luga-border dark:border-luga-darkBorder pb-6 mb-8 sm:mb-10">
          <span className="font-mono text-[10px] tracking-mega uppercase text-luga-crimson dark:text-luga-gold">
            SECURE CLIENT CHECKOUT
          </span>
          <h1 className="font-editorial text-3xl sm:text-5xl uppercase tracking-tight text-luga-ink dark:text-luga-darkInk mt-1 break-words">
            NEPAL DISPATCH & ORDER
          </h1>
        </div>

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* LEFT: Checkout Form Details */}
          <div className="lg:col-span-7 space-y-8 sm:space-y-10 font-mono text-xs">
            {/* 1. Contact Information */}
            <div className="space-y-4">
              <h3 className="text-xs uppercase tracking-mega font-bold text-luga-ink dark:text-luga-darkInk border-b border-luga-border dark:border-luga-darkBorder pb-2">
                01 // CUSTOMER DETAILS
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-luga-muted dark:text-luga-darkMuted uppercase">
                    FULL NAME *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aayush Shrestha"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-transparent border border-luga-border dark:border-luga-darkBorder p-3 text-luga-ink dark:text-luga-darkInk focus:outline-none focus:border-luga-ink dark:focus:border-luga-darkInk"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-luga-muted dark:text-luga-darkMuted uppercase">
                    NEPAL PHONE NUMBER (+977) *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+977 98XXXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-transparent border border-luga-border dark:border-luga-darkBorder p-3 text-luga-ink dark:text-luga-darkInk focus:outline-none focus:border-luga-ink dark:focus:border-luga-darkInk"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-[10px] text-luga-muted dark:text-luga-darkMuted uppercase">
                    EMAIL ADDRESS (FOR ARCHIVE RECEIPT)
                  </label>
                  <input
                    type="email"
                    placeholder="aayush@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent border border-luga-border dark:border-luga-darkBorder p-3 text-luga-ink dark:text-luga-darkInk focus:outline-none focus:border-luga-ink dark:focus:border-luga-darkInk"
                  />
                </div>
              </div>
            </div>

            {/* 2. Nepal Delivery Zone & Address */}
            <div className="space-y-4">
              <h3 className="text-xs uppercase tracking-mega font-bold text-luga-ink dark:text-luga-darkInk border-b border-luga-border dark:border-luga-darkBorder pb-2">
                02 // NEPAL DELIVERY REGION & ADDRESS
              </h3>

              {/* Delivery Zone Selector */}
              <div className="space-y-2">
                <label className="text-[10px] text-luga-muted dark:text-luga-darkMuted uppercase">
                  SELECT DELIVERY ZONE *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    {
                      zone: "VALLEY_INSIDE_RING_ROAD" as DeliveryZone,
                      label: "Inside Ring Road",
                      citySub: "Kathmandu / Lalitpur",
                      fee: isFreeInsideRingRoad ? "COMPLIMENTARY" : `NPR ${settings.shippingInsideRingRoadNpr}`,
                    },
                    {
                      zone: "VALLEY_OUTSIDE_RING_ROAD" as DeliveryZone,
                      label: "Outside Ring Road",
                      citySub: "Bhaktapur / Valley Outskirts",
                      fee: `NPR ${settings.shippingOutsideRingRoadNpr}`,
                    },
                    {
                      zone: "OUTSIDE_VALLEY" as DeliveryZone,
                      label: "Outside Valley",
                      citySub: "Pokhara, Chitwan, etc.",
                      fee: `NPR ${settings.shippingOutsideValleyNpr}`,
                    },
                  ].map((option) => (
                    <button
                      type="button"
                      key={option.zone}
                      onClick={() => setDeliveryZone(option.zone)}
                      className={`p-3.5 text-left border transition-all ${
                        deliveryZone === option.zone
                          ? "border-luga-ink bg-luga-surface dark:border-luga-darkInk dark:bg-luga-darkSurface font-semibold"
                          : "border-luga-border dark:border-luga-darkBorder hover:border-luga-ink"
                      }`}
                    >
                      <div className="text-xs text-luga-ink dark:text-luga-darkInk">{option.label}</div>
                      <div className="text-[10px] text-luga-muted">{option.citySub}</div>
                      <div className="mt-2 text-[10px] text-luga-crimson dark:text-luga-gold font-bold">
                        {option.fee}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tole / Ward / Landmark */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-luga-muted dark:text-luga-darkMuted uppercase">
                    CITY / DISTRICT *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kathmandu, Lalitpur, Pokhara"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-transparent border border-luga-border dark:border-luga-darkBorder p-3 text-luga-ink dark:text-luga-darkInk focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-luga-muted dark:text-luga-darkMuted uppercase">
                    NEAREST LANDMARK
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Opposite Labim Mall, Near Bhatbhateni"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    className="w-full bg-transparent border border-luga-border dark:border-luga-darkBorder p-3 text-luga-ink dark:text-luga-darkInk focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-[10px] text-luga-muted dark:text-luga-darkMuted uppercase">
                    TOLE / WARD / STREET ADDRESS *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ward No. 3, Jhamsikhel, Lalitpur"
                    value={toleAddress}
                    onChange={(e) => setToleAddress(e.target.value)}
                    className="w-full bg-transparent border border-luga-border dark:border-luga-darkBorder p-3 text-luga-ink dark:text-luga-darkInk focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-[10px] text-luga-muted dark:text-luga-darkMuted uppercase">
                    DELIVERY INSTRUCTIONS (OPTIONAL)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Special instructions for the courier rider..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-transparent border border-luga-border dark:border-luga-darkBorder p-3 text-luga-ink dark:text-luga-darkInk focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 3. Payment Method */}
            <div className="space-y-4">
              <h3 className="text-xs uppercase tracking-mega font-bold text-luga-ink dark:text-luga-darkInk border-b border-luga-border dark:border-luga-darkBorder pb-2">
                03 // PAYMENT METHOD
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    method: "COD" as PaymentMethod,
                    title: "Cash on Delivery (COD)",
                    desc: "Pay in cash upon doorstep delivery anywhere in Nepal.",
                    icon: Banknote,
                  },
                  {
                    method: "FONEPAY" as PaymentMethod,
                    title: "Fonepay QR / Mobile Banking",
                    desc: "Instant dynamic QR code scan via eSewa, Khalti, or Bank apps.",
                    icon: QrCode,
                  },
                  {
                    method: "ESEWA" as PaymentMethod,
                    title: "eSewa Wallet",
                    desc: "Direct wallet payment authorization.",
                    icon: CreditCard,
                  },
                  {
                    method: "KHALTI" as PaymentMethod,
                    title: "Khalti Digital Wallet",
                    desc: "Fast digital wallet checkout.",
                    icon: CreditCard,
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      type="button"
                      key={item.method}
                      onClick={() => setPaymentMethod(item.method)}
                      className={`p-4 text-left border flex gap-3 transition-all ${
                        paymentMethod === item.method
                          ? "border-luga-ink bg-luga-surface dark:border-luga-darkInk dark:bg-luga-darkSurface"
                          : "border-luga-border dark:border-luga-darkBorder hover:border-luga-ink"
                      }`}
                    >
                      <Icon className="w-5 h-5 text-luga-crimson dark:text-luga-gold flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-luga-ink dark:text-luga-darkInk">
                          {item.title}
                        </div>
                        <div className="text-[10px] text-luga-muted dark:text-luga-darkMuted mt-1 leading-snug">
                          {item.desc}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT: Order Summary Rail */}
          <div className="lg:col-span-5 font-mono text-xs">
            <div className="border border-luga-border dark:border-luga-darkBorder bg-luga-surface/40 dark:bg-luga-darkSurface/40 p-4 sm:p-8 space-y-5 sm:space-y-6 lg:sticky lg:top-28">
              <h3 className="text-xs uppercase tracking-mega font-bold text-luga-ink dark:text-luga-darkInk border-b border-luga-border dark:border-luga-darkBorder pb-3">
                ORDER ARCHIVE SUMMARY ({cart.reduce((a, b) => a + b.quantity, 0)})
              </h3>

              {/* Items in Cart */}
              <div className="space-y-4 max-h-72 overflow-y-auto pr-2 divide-y divide-luga-border/50 dark:divide-luga-darkBorder/50">
                {cart.map((item) => (
                  <div key={`${item.productId}-${item.size}`} className="pt-3 first:pt-0 flex gap-3 items-center">
                    <div className="w-12 h-14 bg-luga-surface dark:bg-luga-darkSurface flex-shrink-0 overflow-hidden border border-luga-border/50">
                      <ManagedImage
                        src={item.primaryImageUrl}
                        slotName={item.size}
                        aspectRatio="4:5"
                        resolution="150×200px"
                        alt={item.title}
                        showInfo={false}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-editorial text-sm text-luga-ink dark:text-luga-darkInk truncate font-medium">
                        {item.title}
                      </div>
                      <div className="text-[10px] text-luga-muted">
                        SIZE: {item.size} • QTY: {item.quantity}
                      </div>
                    </div>
                    <div className="font-semibold text-luga-ink dark:text-luga-darkInk">
                      {formatNpr(item.priceNpr * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Calculations */}
              <div className="border-t border-luga-border dark:border-luga-darkBorder pt-4 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-luga-muted">SUBTOTAL</span>
                  <span className="font-medium text-luga-ink dark:text-luga-darkInk">{formatNpr(cartSubtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-luga-muted">NEPAL DELIVERY</span>
                  <span className="font-medium text-luga-ink dark:text-luga-darkInk">
                    {shippingNpr === 0 ? "COMPLIMENTARY" : formatNpr(shippingNpr)}
                  </span>
                </div>
                <div className="flex justify-between border-t border-luga-border dark:border-luga-darkBorder pt-3 text-sm font-bold">
                  <span>TOTAL (NPR)</span>
                  <span className="text-luga-crimson dark:text-luga-gold text-base">
                    {formatNpr(totalNpr)}
                  </span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-luga-ink text-white dark:bg-luga-darkInk dark:text-black font-mono text-xs uppercase tracking-ultra hover:bg-luga-crimson dark:hover:bg-luga-gold transition-colors flex items-center justify-center gap-2.5 disabled:opacity-90 disabled:cursor-wait relative overflow-hidden"
              >
                {isSubmitting ? (
                  <>
                    <Compass className="w-4 h-4 animate-spin-slow text-luga-crimson dark:text-luga-gold stroke-[1.5]" />
                    <span>TRANSMITTING ORDER TO ATELIER...</span>
                  </>
                ) : (
                  <>
                    <span>PLACE ORDER NOW</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="space-y-1 text-[10px] text-luga-muted text-center leading-relaxed">
                <p>• Authentic handcrafted production in Lalitpur, Nepal.</p>
                <p>• 7-day hassle-free exchange on unworn garments.</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </StorefrontLayout>
  );
}
