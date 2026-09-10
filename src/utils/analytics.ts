/**
 * GA4 Ecommerce Tracking Utilities
 */

import { Product } from "../types";

declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
  }
}

// Safely fire standard GA4 gtag events
export const trackEvent = (eventName: string, params?: Record<string, any>) => {
  const cleanParams = params || {};
  
  // Log to console for debugging and validation
  console.log(
    `%c[GA4 event]%c ${eventName}`,
    "color: #10B981; font-weight: bold; background: #064E3B; padding: 2px 6px; border-radius: 4px;",
    "color: #F3F4F6; font-weight: bold;",
    cleanParams
  );

  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", eventName, cleanParams);
  }
};

// Maps a product to GA4 ecommerce item format
export const mapProductToGA4Item = (product: Product, quantity = 1, size?: string, color?: string) => {
  return {
    item_id: product.id,
    item_name: product.name,
    index: product.rank || undefined,
    item_category: product.category,
    price: product.price,
    quantity: quantity,
    item_variant: [size, color].filter(Boolean).join(" / ") || undefined,
  };
};

export const trackViewItemList = (products: Product[], listName = "Catalog Grid") => {
  trackEvent("view_item_list", {
    item_list_id: listName.toLowerCase().replace(/\s+/g, "_"),
    item_list_name: listName,
    items: products.map((p, idx) => ({ ...mapProductToGA4Item(p), index: idx + 1 })),
  });
};

export const trackSelectItem = (product: Product, listName = "Catalog Grid") => {
  trackEvent("select_item", {
    item_list_id: listName.toLowerCase().replace(/\s+/g, "_"),
    item_list_name: listName,
    items: [mapProductToGA4Item(product)],
  });
};

export const trackSelectPromotion = (promoId: string, promoName: string, creativeSlot = "top_banner") => {
  trackEvent("select_promotion", {
    creative_name: promoName,
    creative_slot: creativeSlot,
    promotion_id: promoId,
    promotion_name: promoName,
  });
};

export const trackViewItem = (product: Product) => {
  trackEvent("view_item", {
    currency: "USD",
    value: product.price,
    items: [mapProductToGA4Item(product)],
  });
};

export const trackAddToCart = (product: Product, quantity = 1, size?: string, color?: string) => {
  trackEvent("add_to_cart", {
    currency: "USD",
    value: product.price * quantity,
    items: [mapProductToGA4Item(product, quantity, size, color)],
  });
};

export const trackRemoveFromCart = (product: Product, quantity = 1, size?: string, color?: string) => {
  trackEvent("remove_from_cart", {
    currency: "USD",
    value: product.price * quantity,
    items: [mapProductToGA4Item(product, quantity, size, color)],
  });
};

export const trackAddToWishlist = (product: Product) => {
  trackEvent("add_to_wishlist", {
    currency: "USD",
    value: product.price,
    items: [mapProductToGA4Item(product)],
  });
};

export const trackViewCart = (items: { product: Product; quantity: number; size?: string; color?: string }[], value: number) => {
  trackEvent("view_cart", {
    currency: "USD",
    value: value,
    items: items.map((i) => mapProductToGA4Item(i.product, i.quantity, i.size, i.color)),
  });
};

export const trackBeginCheckout = (items: { product: Product; quantity: number; size?: string; color?: string }[], value: number) => {
  trackEvent("begin_checkout", {
    currency: "USD",
    value: value,
    items: items.map((i) => mapProductToGA4Item(i.product, i.quantity, i.size, i.color)),
  });
};

export const trackAddShippingInfo = (items: { product: Product; quantity: number }[], value: number, coupon?: string) => {
  trackEvent("add_shipping_info", {
    currency: "USD",
    value: value,
    coupon: coupon,
    items: items.map((i) => mapProductToGA4Item(i.product, i.quantity)),
  });
};

export const trackAddPaymentInfo = (items: { product: Product; quantity: number }[], value: number, paymentType: string, coupon?: string) => {
  trackEvent("add_payment_info", {
    currency: "USD",
    value: value,
    payment_type: paymentType,
    coupon: coupon,
    items: items.map((i) => mapProductToGA4Item(i.product, i.quantity)),
  });
};

export const trackPurchase = (
  transactionId: string,
  items: { product: Product; quantity: number; size?: string; color?: string }[],
  value: number,
  tax: number,
  shipping: number,
  coupon?: string
) => {
  trackEvent("purchase", {
    transaction_id: transactionId,
    value: value,
    tax: tax,
    shipping: shipping,
    currency: "USD",
    coupon: coupon,
    items: items.map((i) => mapProductToGA4Item(i.product, i.quantity, i.size, i.color)),
  });
};

export const trackSearch = (searchQuery: string) => {
  trackEvent("search", {
    search_term: searchQuery,
  });
};

export const trackGenerateLead = (formName: string, email: string) => {
  trackEvent("generate_lead", {
    form_id: formName.toLowerCase().replace(/\s+/g, "_"),
    form_name: formName,
    user_email_hash: email ? "provided" : "not_provided",
  });
};

// --- Merch Lab Custom UX & Discovery Events ---

export const trackQuickView = (product: Product) => {
  trackEvent("quick_view", {
    item_id: product.id,
    item_name: product.name,
    category: product.category,
    price: product.price,
    style: product.style,
    ecosystem: product.ecosystem,
  });
};

export const trackCompareProduct = (product: Product, action: "add" | "remove") => {
  trackEvent("compare_product", {
    action: action,
    item_id: product.id,
    item_name: product.name,
    category: product.category,
    price: product.price,
  });
};

export const trackFindYourGoogleStart = () => {
  trackEvent("find_your_google_start", {
    entry_point: "homepage_wizard",
  });
};

export const trackFindYourGoogleComplete = (prefs?: { purpose?: string; interests?: string[]; vibe?: string; budget?: string }) => {
  if (!prefs) return;
  trackEvent("find_your_google_complete", {
    purpose: prefs.purpose || "",
    interests_count: Array.isArray(prefs.interests) ? prefs.interests.length : 0,
    vibe: prefs.vibe || "",
    budget_tier: prefs.budget || "",
  });
};

export const trackGiftLabStart = () => {
  trackEvent("gift_lab_start", {
    entry_point: "gift_lab_view",
  });
};

export const trackGiftLabComplete = (prefs?: { recipient?: string; budget?: string; interests?: string[] }) => {
  if (!prefs) return;
  trackEvent("gift_lab_complete", {
    recipient: prefs.recipient || "",
    budget_tier: prefs.budget || "",
    interests_count: Array.isArray(prefs.interests) ? prefs.interests.length : 0,
  });
};

export const trackMoodSelected = (moodName: string) => {
  trackEvent("mood_selected", {
    mood: moodName,
  });
};

export const trackEcosystemSelected = (ecosystemName: string) => {
  trackEvent("ecosystem_selected", {
    ecosystem: ecosystemName,
  });
};

export const trackBundleSelected = (bundleId: string, bundleName: string, price: number) => {
  trackEvent("bundle_selected", {
    bundle_id: bundleId,
    bundle_name: bundleName,
    price: price,
  });
};

export const trackRecommendationClicked = (product: Product, sectionName: string) => {
  trackEvent("recommendation_clicked", {
    item_id: product.id,
    item_name: product.name,
    section: sectionName,
    price: product.price,
  });
};

export const trackCurrencySwitched = (newCurrency: string) => {
  trackEvent("currency_switched", {
    currency: newCurrency,
  });
};
