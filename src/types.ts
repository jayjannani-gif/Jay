export interface Review {
  id: string;
  name: string;
  location: string;
  rating: number;
  quote: string;
  date: string;
}

export type EcosystemType =
  | "Google"
  | "Pixel"
  | "Android"
  | "YouTube"
  | "Chrome"
  | "Google Maps"
  | "Google Cloud"
  | "Developer"
  | "Google Workspace";

export type StyleType = "Minimal" | "Playful" | "Bold" | "Classic" | "Creative";

export type MerchMoodType =
  | "desk-day"
  | "weekend"
  | "creator-mode"
  | "travel-mode"
  | "cozy"
  | "gift-mode"
  | "google-fan";

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  badge?: string; // 'Bestseller' | 'New' | 'On Sale'
  rank?: number; // 1, 2, 3
  gradient: string; // Tailwind linear-gradient background classes or CSS style
  icon: string; // Emoji or Lucide icon key
  image?: string; // Generated studio photograph URL
  description: string;
  details: string[];
  materials: string;
  shipping: string;
  sizes?: string[];
  colors?: { name: string; value: string }[];
  reviewsList: Review[];
  // Merch Lab Discovery & Personalization Metadata
  tags: string[];
  audience: string[];
  useCases: string[];
  ecosystem: EcosystemType;
  style: StyleType;
  moods: string[];
  complementaryProductIds: string[];
  keyFeatures: string[];
  intendedUse: string;
}

export type CurrencyCode = "USD" | "INR" | "CAD" | "GBP";

export interface DiscoveryPreferences {
  purpose: string; // "For Me" | "For Someone Else" | "Something New" | "Just Browsing"
  interests: string[]; // "Tech" | "Design" | "Gaming" | "Google Culture" | "Productivity" | "Travel" | "Everyday Essentials"
  vibe: string; // "Minimal" | "Playful" | "Bold" | "Classic" | "Creative"
  budget: string; // "Under ₹1,000" | "₹1,000–₹2,500" | "₹2,500–₹5,000" | "₹5,000+"
  timestamp?: number;
}

export interface GiftPreferences {
  recipient: string; // "Friend" | "Partner" | "Parent" | "Colleague" | "Student" | "Google Fan" | "Myself"
  budget: string; // "Under ₹1,000" | "₹1,000–₹2,500" | "₹2,500–₹5,000" | "₹5,000+"
  interests: string[]; // "Tech" | "Travel" | "Gaming" | "Design" | "Productivity" | "Google" | "Lifestyle"
  timestamp?: number;
}

export interface SmartBundle {
  id: string;
  name: string;
  tagline: string;
  description: string;
  productIds: string[];
  discountPercent: number; // e.g. 15 for 15% off
  theme: string;
  badge?: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
  customDesign?: {
    itemType: string;
    customText: string;
    textColor: string;
    fontStyle: string;
    badgeIcon: string;
    badgeName: string;
    baseColorName: string;
    baseColorHex: string;
    previewSummary: string;
  };
}

export interface LoyaltyProfile {
  xp: number;
  unlockedCodes: string[];
  lastCheckInDate?: string;
}

export interface CustomDesignConfig {
  itemType: "hoodie" | "tee" | "bottle" | "sleeve" | "mug" | "notebook";
  customText: string;
  textColor: string;
  fontStyle: "mono" | "sans" | "serif" | "retro";
  badgeId: string;
  baseColorHex: string;
  baseColorName: string;
  selectedSize: string;
  quantity: number;
}

export interface WishlistItem {
  productId: string;
}

export interface Order {
  orderId: string;
  items: {
    productId: string;
    quantity: number;
    price: number;
    name: string;
    selectedSize?: string;
    selectedColor?: string;
  }[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  couponCode?: string;
  shippingDetails: {
    email: string;
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    country: string;
    state: string;
    zipCode: string;
  };
  paymentMethod: string;
  date: string;
}

export interface QuizState {
  currentQuestionIndex: number;
  answers: Record<string, string>;
  isCompleted: boolean;
  recommendedProductIds: string[];
}
