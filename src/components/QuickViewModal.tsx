import React, { useState, useEffect } from "react";
import { X, Heart, ShoppingBag, Scale, Star, Check, ShieldCheck, Truck, ArrowRight } from "lucide-react";
import { Product, CurrencyCode } from "../types";
import { formatPrice } from "../utils/currency";
import { trackQuickView } from "../utils/analytics";
import { GOOGLE_ECOSYSTEMS } from "../data";

interface QuickViewModalProps {
  product: Product | null;
  isOpen?: boolean;
  currency: CurrencyCode;
  isWishlisted: boolean;
  isCompared: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, size?: string, color?: string) => void;
  onToggleWishlist?: (product: Product) => void;
  onAddToWishlist?: (product: Product) => void;
  onToggleCompare: (product: Product) => void;
  onViewProductDetail?: (product: Product) => void;
  onProductClick?: (product: Product) => void;
  theme?: "dark" | "light";
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  isOpen,
  currency,
  isWishlisted,
  isCompared,
  onClose,
  onAddToCart,
  onToggleWishlist,
  onAddToWishlist,
  onToggleCompare,
  onViewProductDetail,
  onProductClick,
  theme = "dark",
}) => {
  if (!product || (isOpen !== undefined && !isOpen)) return null;

  const handleWishlistToggle = () => {
    if (onToggleWishlist) onToggleWishlist(product);
    else if (onAddToWishlist) onAddToWishlist(product);
  };

  const handleProductDetail = () => {
    onClose();
    if (onViewProductDetail) onViewProductDetail(product);
    else if (onProductClick) onProductClick(product);
  };

  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    product.sizes ? product.sizes[0] : undefined
  );
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    product.colors ? product.colors[0].name : undefined
  );
  const [justAdded, setJustAdded] = useState(false);
  const isDark = theme === "dark";

  useEffect(() => {
    trackQuickView(product);
  }, [product.id]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleAdd = () => {
    onAddToCart(product, selectedSize, selectedColor);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1600);
  };

  const ecoConfig = GOOGLE_ECOSYSTEMS.find((e) => e.id === product.ecosystem);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      id="quick-view-overlay"
    >
      <div
        className={`relative w-full max-w-3xl rounded-3xl overflow-hidden border shadow-2xl transition-all ${
          isDark
            ? "bg-zinc-900 border-zinc-800 text-white"
            : "bg-white border-zinc-200 text-zinc-900"
        }`}
        onClick={(e) => e.stopPropagation()}
        id="quick-view-dialog"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white flex items-center justify-center transition-colors"
          aria-label="Close modal"
          id="btn-close-quickview"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Visual Showcase */}
          <div
            className="relative aspect-square md:aspect-auto flex items-center justify-center p-8 bg-zinc-950/40"
            style={{ background: product.image ? undefined : product.gradient }}
          >
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="max-h-72 w-full object-contain"
                referrerPolicy="no-referrer"
              />
            ) : (
              <span className="text-8xl filter drop-shadow-lg">{product.icon}</span>
            )}

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-1.5">
              {product.badge && (
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-600 text-white uppercase shadow-sm">
                  {product.badge}
                </span>
              )}
              {ecoConfig && (
                <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${ecoConfig.badgeBg}`}>
                  {ecoConfig.name}
                </span>
              )}
            </div>
          </div>

          {/* Product Details & Selection */}
          <div className="p-6 sm:p-8 flex flex-col justify-between max-h-[85vh] overflow-y-auto">
            <div>
              {/* Category & Rating */}
              <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
                <span className="uppercase font-semibold tracking-wider">{product.category}</span>
                <div className="flex items-center gap-1 text-amber-400">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-bold">{product.rating}</span>
                  <span className="text-zinc-500">({product.reviewCount} reviews)</span>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold tracking-tight mb-2">
                {product.name}
              </h2>

              {/* Price */}
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-2xl font-extrabold text-blue-400">
                  {formatPrice(product.price, currency)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm line-through text-zinc-500">
                    {formatPrice(product.originalPrice, currency)}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-4">
                {product.description}
              </p>

              {/* Key Features */}
              <div className="mb-4">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 mb-2">
                  Key Specifications
                </div>
                <ul className="space-y-1 text-xs text-zinc-300">
                  {product.details.slice(0, 3).map((detail, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Color selector (if any) */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-4">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 mb-2">
                    Color: <strong className="text-zinc-300 font-normal">{selectedColor}</strong>
                  </div>
                  <div className="flex items-center gap-2">
                    {product.colors.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => setSelectedColor(c.name)}
                        className={`w-7 h-7 rounded-full border-2 transition-all ${
                          selectedColor === c.name ? "border-blue-500 scale-110" : "border-transparent opacity-80 hover:opacity-100"
                        }`}
                        style={{ backgroundColor: c.value }}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Size selector (if any) */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-4">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 mb-2">
                    Size: <strong className="text-zinc-300 font-normal">{selectedSize}</strong>
                  </div>
                  <div className="flex items-center gap-2">
                    {product.sizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-all ${
                          selectedSize === s
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-zinc-800 text-zinc-300 border-zinc-700 hover:border-zinc-500"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-zinc-800/80 mt-4 space-y-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleAdd}
                  disabled={justAdded}
                  className={`flex-grow h-11 rounded-xl font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all active:scale-98 ${
                    justAdded
                      ? "bg-emerald-600 text-white"
                      : "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/20"
                  }`}
                  id="btn-quickview-add-bag"
                >
                  {justAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Bag!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Bag</span>
                    </>
                  )}
                </button>

                {/* Wishlist Toggle */}
                <button
                  onClick={handleWishlistToggle}
                  className={`w-11 h-11 rounded-xl border flex items-center justify-center transition-colors ${
                    isWishlisted
                      ? "bg-rose-500/20 border-rose-500 text-rose-400"
                      : "border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-600"
                  }`}
                  title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                  id="btn-quickview-wishlist"
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`} />
                </button>

                {/* Compare Toggle */}
                <button
                  onClick={() => onToggleCompare(product)}
                  className={`w-11 h-11 rounded-xl border flex items-center justify-center transition-colors ${
                    isCompared
                      ? "bg-blue-500/20 border-blue-500 text-blue-400"
                      : "border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-600"
                  }`}
                  title={isCompared ? "In comparison" : "Add to compare"}
                  id="btn-quickview-compare"
                >
                  <Scale className="w-4 h-4" />
                </button>
              </div>

              {/* View Full Product Link */}
              <button
                onClick={handleProductDetail}
                className="w-full text-center text-xs text-blue-400 hover:text-blue-300 font-medium inline-flex items-center justify-center gap-1 pt-1 transition-colors"
                id="btn-quickview-full-page"
              >
                <span>View Full Product Experience</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
