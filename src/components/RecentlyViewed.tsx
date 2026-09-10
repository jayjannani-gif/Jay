import React from "react";
import { History, ArrowRight } from "lucide-react";
import { Product, CurrencyCode } from "../types";
import { PRODUCTS } from "../data";
import { ProductCard } from "./ProductCard";

interface RecentlyViewedProps {
  recentIds: string[];
  currentProductId?: string;
  currency: CurrencyCode;
  wishlistIds: string[];
  compareIds: string[];
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product, size?: string, color?: string) => void;
  onToggleWishlist: (product: Product) => void;
  onToggleCompare: (product: Product) => void;
  onQuickView: (product: Product) => void;
  theme?: "dark" | "light";
}

export const RecentlyViewed: React.FC<RecentlyViewedProps> = ({
  recentIds,
  currentProductId,
  currency,
  wishlistIds,
  compareIds,
  onProductClick,
  onAddToCart,
  onToggleWishlist,
  onToggleCompare,
  onQuickView,
  theme = "dark",
}) => {
  const isDark = theme === "dark";

  // Filter out current product if on PDP, and preserve order
  const filteredIds = recentIds.filter((id) => id !== currentProductId);
  const recentProducts = filteredIds
    .map((id) => PRODUCTS.find((p) => p.id === id))
    .filter((p): p is Product => p !== undefined)
    .slice(0, 4);

  if (recentProducts.length === 0) return null;

  return (
    <section className="w-full py-12" id="recently-viewed-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-400">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h3 className={`text-xl font-bold ${isDark ? "text-white" : "text-zinc-900"}`}>
                Pick up where you left off
              </h3>
              <p className="text-xs text-zinc-400">
                Recently viewed items stored in your local session shelf
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recentProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              currency={currency}
              isWishlisted={wishlistIds.includes(product.id)}
              isCompared={compareIds.includes(product.id)}
              onProductClick={onProductClick}
              onAddToCart={onAddToCart}
              onToggleWishlist={onToggleWishlist}
              onToggleCompare={onToggleCompare}
              onQuickView={onQuickView}
              theme={theme}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
