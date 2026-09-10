import React, { useState, useMemo } from "react";
import { Sparkles, Check, ShoppingBag, Plus, ArrowRight } from "lucide-react";
import { Product, CurrencyCode } from "../types";
import { PRODUCTS } from "../data";
import { getCompleteTheLookItems } from "../utils/recommendations";
import { formatPrice } from "../utils/currency";

interface CompleteTheLookProps {
  primaryProduct?: Product;
  currency: CurrencyCode;
  onAddToCart: (product: Product, size?: string, color?: string) => void;
  onProductClick: (product: Product) => void;
  onShowToast?: (text: string, type?: "success" | "error" | "info") => void;
  theme?: "dark" | "light";
}

export const CompleteTheLook: React.FC<CompleteTheLookProps> = ({
  primaryProduct,
  currency,
  onAddToCart,
  onProductClick,
  onShowToast,
  theme = "dark",
}) => {
  const isDark = theme === "dark";

  // Use either the provided product (e.g. on PDP) or default to Google Campus Hoodie for homepage showcase
  const mainItem = primaryProduct || PRODUCTS.find((p) => p.id === "7") || PRODUCTS[0];
  const complementaryItems = useMemo(() => {
    return getCompleteTheLookItems(mainItem.id);
  }, [mainItem.id]);

  // Track which items are selected (primary is always selected by default)
  const [selectedIds, setSelectedIds] = useState<string[]>([
    mainItem.id,
    ...complementaryItems.map((p) => p.id),
  ]);

  const [justAdded, setJustAdded] = useState(false);

  const toggleItem = (id: string) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length > 1) {
        setSelectedIds(selectedIds.filter((item) => item !== id));
      }
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const allItems = [mainItem, ...complementaryItems];
  const activeProducts = allItems.filter((p) => selectedIds.includes(p.id));

  const rawSubtotal = activeProducts.reduce((sum, p) => sum + p.price, 0);
  // 15% discount if 2 or more items selected
  const hasBundleDiscount = activeProducts.length >= 2;
  const bundleDiscountPercent = hasBundleDiscount ? 15 : 0;
  const discountedTotal = rawSubtotal * (1 - bundleDiscountPercent / 100);
  const savings = rawSubtotal - discountedTotal;

  const handleAddLook = () => {
    activeProducts.forEach((p) => {
      onAddToCart(p);
    });

    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);

    if (onShowToast) {
      onShowToast(`Added ${activeProducts.length} items from Complete the Look to your bag!`, "success");
    }
  };

  return (
    <section className="w-full py-12" id="complete-the-look-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3 border bg-indigo-500/10 text-indigo-400 border-indigo-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Curated Styling Synergy</span>
            </div>
            <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${isDark ? "text-white" : "text-zinc-900"}`}>
              Complete the Look
            </h2>
            <p className="mt-2 text-sm sm:text-base text-zinc-400 max-w-xl">
              Coordinated essentials styled to wear and use together. Select any combination and unlock an instant 15% bundle discount.
            </p>
          </div>

          {hasBundleDiscount && (
            <div className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20 self-start md:self-auto">
              15% Synergy Discount Applied ({activeProducts.length} items)
            </div>
          )}
        </div>

        {/* Card Showcase Container */}
        <div
          className={`rounded-3xl border p-6 sm:p-8 transition-all ${
            isDark ? "bg-zinc-900/70 border-zinc-800 shadow-xl" : "bg-white border-zinc-200 shadow-md"
          }`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Products Row / Columns */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {allItems.map((prod, index) => {
                const isSelected = selectedIds.includes(prod.id);
                const isPrimary = prod.id === mainItem.id;

                return (
                  <div
                    key={prod.id}
                    onClick={() => toggleItem(prod.id)}
                    className={`relative rounded-2xl border p-4 cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                      isSelected
                        ? isDark
                          ? "bg-zinc-800/80 border-blue-500 shadow-md shadow-blue-500/10"
                          : "bg-blue-50/50 border-blue-500 shadow-sm"
                        : isDark
                        ? "bg-zinc-950/40 border-zinc-800 opacity-60 hover:opacity-100"
                        : "bg-zinc-50 border-zinc-200 opacity-60 hover:opacity-100"
                    }`}
                  >
                    {/* Checkbox indicator */}
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className={`w-5 h-5 rounded-md flex items-center justify-center text-xs transition-colors ${
                          isSelected
                            ? "bg-blue-600 text-white"
                            : isDark
                            ? "border border-zinc-700 bg-zinc-900"
                            : "border border-zinc-300 bg-white"
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </span>

                      {isPrimary && (
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400">
                          Base Piece
                        </span>
                      )}
                    </div>

                    {/* Image / Icon */}
                    <div className="w-full aspect-square rounded-xl overflow-hidden bg-zinc-900/50 p-2 flex items-center justify-center mb-3">
                      {prod.image ? (
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="w-full h-full object-contain"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <span className="text-4xl">{prod.icon}</span>
                      )}
                    </div>

                    {/* Product Name & Price */}
                    <div>
                      <h4 className={`text-xs font-semibold line-clamp-1 ${isDark ? "text-zinc-100" : "text-zinc-900"}`}>
                        {prod.name}
                      </h4>
                      <div className="flex items-baseline justify-between mt-1">
                        <span className="text-xs text-zinc-400">{prod.category}</span>
                        <span className={`text-xs font-bold ${isDark ? "text-white" : "text-zinc-900"}`}>
                          {formatPrice(prod.price, currency)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bundle Checkout Box */}
            <div className="lg:col-span-4 flex flex-col justify-center p-6 rounded-2xl border border-zinc-800 bg-zinc-950/40">
              <div className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                Selected Ensemble ({activeProducts.length} items)
              </div>

              <div className="space-y-1.5 mb-4 text-xs text-zinc-400">
                {activeProducts.map((p) => (
                  <div key={p.id} className="flex justify-between">
                    <span className="truncate pr-2">{p.name}</span>
                    <span className="font-medium text-zinc-300">{formatPrice(p.price, currency)}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-zinc-800 space-y-1.5 mb-6">
                <div className="flex justify-between text-xs text-zinc-400">
                  <span>Regular Total</span>
                  <span className={hasBundleDiscount ? "line-through text-zinc-500" : ""}>
                    {formatPrice(rawSubtotal, currency)}
                  </span>
                </div>
                {hasBundleDiscount && (
                  <div className="flex justify-between text-xs text-emerald-400 font-medium">
                    <span>15% Bundle Savings</span>
                    <span>-{formatPrice(savings, currency)}</span>
                  </div>
                )}
                <div className="flex justify-between items-baseline pt-2 text-base font-bold text-white">
                  <span>Combined Price</span>
                  <span className="text-xl font-extrabold text-blue-400">
                    {formatPrice(discountedTotal, currency)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleAddLook}
                disabled={justAdded || activeProducts.length === 0}
                className={`w-full h-11 rounded-xl font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all active:scale-98 ${
                  justAdded
                    ? "bg-emerald-600 text-white cursor-default"
                    : "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/20"
                }`}
                id="btn-add-complete-look"
              >
                {justAdded ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Look Added to Bag!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add Selected Look ({activeProducts.length})</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
