import React, { useState } from "react";
import { Heart, ShoppingBag, Eye, Scale, Check, Star } from "lucide-react";
import { Product, CurrencyCode } from "../types";
import { formatPrice } from "../utils/currency";
import { motion } from "motion/react";
import { GOOGLE_ECOSYSTEMS } from "../data";

interface ProductCardProps {
  product: Product;
  currency: CurrencyCode;
  isWishlisted: boolean;
  isCompared: boolean;
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product, size?: string, color?: string) => void;
  onToggleWishlist: (product: Product) => void;
  onToggleCompare: (product: Product) => void;
  onQuickView: (product: Product) => void;
  reason?: string; // Optional discovery explanation badge
  theme?: "dark" | "light";
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currency,
  isWishlisted,
  isCompared,
  onProductClick,
  onAddToCart,
  onToggleWishlist,
  onToggleCompare,
  onQuickView,
  reason,
  theme = "dark",
}) => {
  const [justAdded, setJustAdded] = useState(false);
  const isDark = theme === "dark";

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    const defaultSize = product.sizes ? product.sizes[0] : undefined;
    const defaultColor = product.colors ? product.colors[0].name : undefined;
    onAddToCart(product, defaultSize, defaultColor);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1600);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleWishlist(product);
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleCompare(product);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    onQuickView(product);
  };

  const ecoConfig = GOOGLE_ECOSYSTEMS.find((e) => e.id === product.ecosystem);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={`group relative flex flex-col rounded-2xl overflow-hidden border transition-all duration-300 ${
        isDark
          ? "bg-zinc-900/90 border-zinc-800/80 hover:border-zinc-700 shadow-lg shadow-black/20"
          : "bg-white border-zinc-200/80 hover:border-zinc-300 shadow-md shadow-zinc-200/50"
      }`}
      id={`product-card-${product.id}`}
    >
      {/* Visual / Image Showcase */}
      <div
        onClick={() => onProductClick(product)}
        className="relative w-full aspect-square cursor-pointer overflow-hidden flex items-center justify-center p-6 select-none bg-zinc-950/20"
        style={{
          background: product.image
            ? undefined
            : product.gradient,
        }}
      >
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain object-center transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        ) : (
          <span className="text-6xl filter drop-shadow-md transition-transform duration-300 group-hover:scale-110">
            {product.icon}
          </span>
        )}

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.badge && (
            <span
              className={`text-[11px] font-semibold tracking-wide px-2.5 py-1 rounded-full uppercase shadow-sm ${
                product.badge === "Bestseller"
                  ? "bg-amber-500/90 text-zinc-950 font-bold backdrop-blur-sm"
                  : product.badge === "On Sale"
                  ? "bg-rose-500/90 text-white font-bold backdrop-blur-sm"
                  : "bg-blue-600/90 text-white font-bold backdrop-blur-sm"
              }`}
            >
              {product.badge}
            </span>
          )}
          {ecoConfig && (
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border backdrop-blur-sm ${ecoConfig.badgeBg}`}>
              {ecoConfig.name}
            </span>
          )}
        </div>

        {/* Top Right Quick Action Buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10 opacity-90 group-hover:opacity-100 transition-opacity">
          {/* Wishlist Button */}
          <button
            onClick={handleWishlist}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-sm ${
              isWishlisted
                ? "bg-rose-500 text-white scale-105"
                : isDark
                ? "bg-zinc-900/80 text-zinc-300 hover:text-rose-400 hover:bg-zinc-800"
                : "bg-white/90 text-zinc-600 hover:text-rose-500 hover:bg-white"
            }`}
            id={`btn-wishlist-${product.id}`}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`} />
          </button>

          {/* Quick View Button */}
          <button
            onClick={handleQuickView}
            aria-label="Quick View"
            className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-sm ${
              isDark
                ? "bg-zinc-900/80 text-zinc-300 hover:text-blue-400 hover:bg-zinc-800"
                : "bg-white/90 text-zinc-600 hover:text-blue-600 hover:bg-white"
            }`}
            title="Quick view"
            id={`btn-quickview-${product.id}`}
          >
            <Eye className="w-4 h-4" />
          </button>

          {/* Compare Button */}
          <button
            onClick={handleCompare}
            aria-label={isCompared ? "Remove from comparison" : "Compare this product"}
            className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-sm ${
              isCompared
                ? "bg-blue-600 text-white scale-105"
                : isDark
                ? "bg-zinc-900/80 text-zinc-300 hover:text-blue-400 hover:bg-zinc-800"
                : "bg-white/90 text-zinc-600 hover:text-blue-600 hover:bg-white"
            }`}
            title={isCompared ? "In comparison" : "Add to compare"}
            id={`btn-compare-${product.id}`}
          >
            <Scale className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Discovery Rationale (if passed) */}
      {reason && (
        <div className={`px-4 py-1.5 text-xs font-medium border-y flex items-center gap-1.5 ${
          isDark
            ? "bg-blue-950/40 text-blue-300 border-blue-900/40"
            : "bg-blue-50 text-blue-700 border-blue-100"
        }`}>
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
          <span className="truncate">{reason}</span>
        </div>
      )}

      {/* Product Content Details */}
      <div className="p-4 flex flex-col flex-grow justify-between gap-3">
        <div>
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
            <span className="uppercase tracking-wider font-semibold">{product.category}</span>
            <div className="flex items-center gap-1 text-amber-400 font-medium">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{product.rating}</span>
              <span className="text-zinc-500 text-[11px]">({product.reviewCount})</span>
            </div>
          </div>

          <h3
            onClick={() => onProductClick(product)}
            className={`text-base font-semibold leading-snug cursor-pointer transition-colors line-clamp-1 ${
              isDark ? "text-zinc-100 hover:text-blue-400" : "text-zinc-900 hover:text-blue-600"
            }`}
          >
            {product.name}
          </h3>

          <p className="text-xs text-zinc-400 line-clamp-2 mt-1 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & Add to Bag CTA */}
        <div className="pt-2 border-t border-zinc-800/40 flex items-center justify-between gap-2 mt-auto">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className={`text-lg font-bold tracking-tight ${isDark ? "text-white" : "text-zinc-900"}`}>
                {formatPrice(product.price, currency)}
              </span>
              {product.originalPrice && (
                <span className="text-xs line-through text-zinc-500">
                  {formatPrice(product.originalPrice, currency)}
                </span>
              )}
            </div>
            <span className="text-[10px] text-zinc-500">
              Style: <strong className="font-medium text-zinc-400">{product.style}</strong>
            </span>
          </div>

          <button
            onClick={handleAdd}
            disabled={justAdded}
            className={`h-9 px-3.5 rounded-xl font-medium text-xs flex items-center gap-1.5 transition-all duration-200 shadow-sm ${
              justAdded
                ? "bg-emerald-600 text-white cursor-default"
                : isDark
                ? "bg-white text-zinc-950 hover:bg-zinc-200 active:scale-95"
                : "bg-zinc-900 text-white hover:bg-zinc-800 active:scale-95"
            }`}
            id={`btn-add-bag-${product.id}`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add to Bag</span>
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};
