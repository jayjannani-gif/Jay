export interface Review {
  id: string;
  name: string;
  location: string;
  rating: number;
  quote: string;
  date: string;
}

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
