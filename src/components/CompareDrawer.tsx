import React, { useMemo } from "react";
import { X, Scale, ShoppingBag, Check, Trash2, Star, Sparkles } from "lucide-react";
import { Product, CurrencyCode, DiscoveryPreferences } from "../types";
import { PRODUCTS } from "../data";
import { formatPrice } from "../utils/currency";
import { getBestForYouComparison } from "../utils/recommendations";

interface CompareDrawerProps {
  compareProducts?: Product[];
  compareIds?: string[];
  currency: CurrencyCode;
  isOpen: boolean;
  onClose: () => void;
  onOpen?: () => void;
  onRemoveFromCompare: (productOrId: Product | string) => void;
  onClearCompare: () => void;
  onAddToCart: (product: Product, size?: string, color?: string) => void;
  onProductClick: (product: Product) => void;
  userPrefs?: DiscoveryPreferences;
  theme?: "dark" | "light";
}

export const CompareDrawer: React.FC<CompareDrawerProps> = ({
  compareProducts,
  compareIds,
  currency,
  isOpen,
  onClose,
  onOpen,
  onRemoveFromCompare,
  onClearCompare,
  onAddToCart,
  onProductClick,
  userPrefs,
  theme = "dark",
}) => {
  const isDark = theme === "dark";

  // Safely resolve products from either compareProducts array or compareIds array
  const activeProducts = useMemo<Product[]>(() => {
    if (Array.isArray(compareProducts) && compareProducts.length > 0) {
      return compareProducts;
    }
    if (Array.isArray(compareIds) && compareIds.length > 0) {
      return compareIds
        .map((id) => PRODUCTS.find((p) => p.id === id))
        .filter((p): p is Product => p !== undefined);
    }
    return [];
  }, [compareProducts, compareIds]);

  if (!isOpen && (!activeProducts || activeProducts.length === 0)) return null;

  const { bestProduct, reason } = getBestForYouComparison(activeProducts, userPrefs);

  const handleRemove = (product: Product) => {
    if (onRemoveFromCompare) {
      onRemoveFromCompare(product);
    }
  };

  return (
    <>
      {/* Floating Dock Bar when items selected but drawer not full-screen */}
      {!isOpen && activeProducts.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 animate-slide-up">
          <div className="bg-zinc-900 border border-zinc-700 shadow-2xl rounded-2xl px-5 py-3 flex items-center gap-4 text-white backdrop-blur-md">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-semibold">
                Comparing <strong className="text-blue-400">{activeProducts.length}</strong> / 3 items
              </span>
            </div>

            <div className="flex items-center -space-x-2">
              {activeProducts.map((p) => (
                <div
                  key={p.id}
                  className="w-7 h-7 rounded-full overflow-hidden border-2 border-zinc-900 bg-zinc-800 flex items-center justify-center text-xs"
                  title={p.name}
                >
                  {p.image ? (
                    <img src={p.image} alt={p.name} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                  ) : (
                    <span>{p.icon}</span>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={onOpen || onClose}
              className="h-8 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors shadow-sm cursor-pointer"
              id="btn-open-compare-modal"
            >
              View Comparison
            </button>

            <button
              onClick={onClearCompare}
              className="text-zinc-400 hover:text-zinc-200 text-xs transition-colors p-1 cursor-pointer"
              title="Clear all"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Full Modal Comparison View */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in"
          onClick={onClose}
          id="compare-modal-overlay"
        >
          <div
            className={`relative w-full max-w-5xl max-h-[90vh] flex flex-col rounded-3xl overflow-hidden border shadow-2xl ${
              isDark ? "bg-zinc-900 border-zinc-800 text-white" : "bg-white border-zinc-200 text-zinc-900"
            }`}
            onClick={(e) => e.stopPropagation()}
            id="compare-modal-container"
          >
            {/* Header */}
            <div className="px-6 sm:px-8 py-5 border-b border-zinc-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold tracking-tight">Product Comparison</h2>
                  <p className="text-xs text-zinc-400">
                    Side-by-side analysis of specifications, style, and compatibility
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {activeProducts.length > 0 && (
                  <button
                    onClick={onClearCompare}
                    className="text-xs text-zinc-400 hover:text-rose-400 font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear All</span>
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="w-9 h-9 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-300 transition-colors cursor-pointer"
                  id="btn-close-compare"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Comparison Body */}
            <div className="p-6 sm:p-8 overflow-y-auto flex-grow">
              {activeProducts.length === 0 ? (
                <div className="py-16 text-center text-zinc-400 max-w-sm mx-auto">
                  <Scale className="w-12 h-12 mx-auto text-zinc-600 mb-4" />
                  <h3 className="text-lg font-bold mb-2">No products to compare</h3>
                  <p className="text-xs text-zinc-500 mb-6">
                    Click the comparison scale icon on any product card across the catalog to analyze up to 3 items side-by-side.
                  </p>
                  <button
                    onClick={onClose}
                    className="h-10 px-6 rounded-xl bg-blue-600 text-white font-semibold text-xs"
                  >
                    Browse Catalog
                  </button>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Product Cards Row */}
                  <div
                    className="grid gap-4"
                    style={{
                      gridTemplateColumns: `repeat(${Math.max(1, activeProducts.length)}, minmax(0, 1fr))`,
                    }}
                  >
                    {activeProducts.map((prod) => {
                      const isBest = bestProduct && prod.id === bestProduct.id;
                      return (
                        <div
                          key={prod.id}
                          className={`relative rounded-2xl border p-5 flex flex-col justify-between ${
                            isBest
                              ? "bg-blue-950/20 border-blue-500/80 ring-2 ring-blue-500/30"
                              : "bg-zinc-950/40 border-zinc-800"
                          }`}
                        >
                          {/* Remove button */}
                          <button
                            onClick={() => handleRemove(prod)}
                            className="absolute top-3 right-3 text-zinc-500 hover:text-rose-400 p-1 transition-colors cursor-pointer"
                            title="Remove"
                          >
                            <X className="w-4 h-4" />
                          </button>

                          {/* "Best for you" recommendation badge */}
                          {isBest && (
                            <div className="mb-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-500 text-white shadow-sm self-start">
                              <Sparkles className="w-3 h-3" />
                              <span>Best Match For You</span>
                            </div>
                          )}

                          {/* Image */}
                          <div
                            onClick={() => {
                              onClose();
                              onProductClick(prod);
                            }}
                            className="w-full aspect-square rounded-xl overflow-hidden bg-zinc-900/50 p-4 flex items-center justify-center cursor-pointer mb-3"
                          >
                            {prod.image ? (
                              <img src={prod.image} alt={prod.name} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                            ) : (
                              <span className="text-5xl">{prod.icon}</span>
                            )}
                          </div>

                          {/* Info */}
                          <div>
                            <div className="text-[11px] font-semibold text-zinc-500 uppercase">{prod.category}</div>
                            <h4
                              onClick={() => {
                                onClose();
                                onProductClick(prod);
                              }}
                              className="font-bold text-sm hover:text-blue-400 cursor-pointer line-clamp-1"
                            >
                              {prod.name}
                            </h4>

                            <div className="flex items-baseline gap-2 mt-1 mb-2">
                              <span className="text-lg font-extrabold text-blue-400">
                                {formatPrice(prod.price, currency)}
                              </span>
                              {prod.originalPrice && (
                                <span className="text-xs line-through text-zinc-500">
                                  {formatPrice(prod.originalPrice, currency)}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-1 text-xs text-amber-400 mb-4">
                              <Star className="w-3.5 h-3.5 fill-current" />
                              <span className="font-bold">{prod.rating}</span>
                              <span className="text-zinc-500">({prod.reviewCount})</span>
                            </div>

                            {/* Add to Bag CTA */}
                            <button
                              onClick={() => onAddToCart(prod)}
                              className="w-full h-9 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                            >
                              <ShoppingBag className="w-3.5 h-3.5" />
                              <span>Add to Bag</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Specification Table */}
                  <div className="rounded-2xl border border-zinc-800 overflow-hidden text-xs">
                    {/* Ecosystem row */}
                    <div
                      className="grid p-3.5 border-b border-zinc-800/60 bg-zinc-950/40"
                      style={{
                        gridTemplateColumns: `140px repeat(${Math.max(1, activeProducts.length)}, minmax(0, 1fr))`,
                      }}
                    >
                      <div className="font-semibold text-zinc-400">Ecosystem</div>
                      {activeProducts.map((p) => (
                        <div key={p.id} className="font-medium text-zinc-200">
                          {p.ecosystem}
                        </div>
                      ))}
                    </div>

                    {/* Style row */}
                    <div
                      className="grid p-3.5 border-b border-zinc-800/60"
                      style={{
                        gridTemplateColumns: `140px repeat(${Math.max(1, activeProducts.length)}, minmax(0, 1fr))`,
                      }}
                    >
                      <div className="font-semibold text-zinc-400">Aesthetic Style</div>
                      {activeProducts.map((p) => (
                        <div key={p.id} className="font-medium text-zinc-200">
                          {p.style}
                        </div>
                      ))}
                    </div>

                    {/* Intended Use row */}
                    <div
                      className="grid p-3.5 border-b border-zinc-800/60 bg-zinc-950/40"
                      style={{
                        gridTemplateColumns: `140px repeat(${Math.max(1, activeProducts.length)}, minmax(0, 1fr))`,
                      }}
                    >
                      <div className="font-semibold text-zinc-400">Intended Purpose</div>
                      {activeProducts.map((p) => (
                        <div key={p.id} className="text-zinc-300 leading-relaxed">
                          {p.intendedUse}
                        </div>
                      ))}
                    </div>

                    {/* Key Features row */}
                    <div
                      className="grid p-3.5 border-b border-zinc-800/60"
                      style={{
                        gridTemplateColumns: `140px repeat(${Math.max(1, activeProducts.length)}, minmax(0, 1fr))`,
                      }}
                    >
                      <div className="font-semibold text-zinc-400">Key Features</div>
                      {activeProducts.map((p) => (
                        <ul key={p.id} className="space-y-1 text-zinc-300">
                          {p.keyFeatures.slice(0, 3).map((feat, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <Check className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      ))}
                    </div>

                    {/* Materials row */}
                    <div
                      className="grid p-3.5 bg-zinc-950/40"
                      style={{
                        gridTemplateColumns: `140px repeat(${Math.max(1, activeProducts.length)}, minmax(0, 1fr))`,
                      }}
                    >
                      <div className="font-semibold text-zinc-400">Materials</div>
                      {activeProducts.map((p) => (
                        <div key={p.id} className="text-zinc-300">
                          {p.materials}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recommendation Rationale Callout */}
                  {bestProduct && (
                    <div className="p-4 rounded-2xl border border-blue-500/30 bg-blue-950/30 flex items-start gap-3">
                      <Sparkles className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-sm text-blue-300">
                          Why {bestProduct.name} is our top recommendation:
                        </div>
                        <p className="text-xs text-zinc-300 mt-1">
                          {reason}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
