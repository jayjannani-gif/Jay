import React, { useState } from "react";
import { Package, ShoppingBag, Check, Sparkles, ArrowRight, Tag } from "lucide-react";
import { Product, CurrencyCode, SmartBundle } from "../types";
import { SMART_BUNDLES, PRODUCTS } from "../data";
import { formatPrice } from "../utils/currency";
import { trackBundleSelected } from "../utils/analytics";

interface SmartBundlesProps {
  currency: CurrencyCode;
  onAddToCart: (product: Product, size?: string, color?: string) => void;
  onProductClick: (product: Product) => void;
  onShowToast?: (text: string, type?: "success" | "error" | "info") => void;
  theme?: "dark" | "light";
}

export const SmartBundles: React.FC<SmartBundlesProps> = ({
  currency,
  onAddToCart,
  onProductClick,
  onShowToast,
  theme = "dark",
}) => {
  const [addedBundles, setAddedBundles] = useState<Record<string, boolean>>({});
  const isDark = theme === "dark";

  const handleAddBundle = (bundle: SmartBundle, bundleProducts: Product[], bundleTotal: number) => {
    bundleProducts.forEach((p) => {
      onAddToCart(p);
    });

    setAddedBundles((prev) => ({ ...prev, [bundle.id]: true }));
    setTimeout(() => {
      setAddedBundles((prev) => ({ ...prev, [bundle.id]: false }));
    }, 2000);

    trackBundleSelected(bundle.id, bundle.name, bundleTotal);

    if (onShowToast) {
      onShowToast(`Added all ${bundleProducts.length} items from "${bundle.name}" to your bag!`, "success");
    }
  };

  return (
    <section className="w-full py-12" id="smart-bundles-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3 border bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
              <Package className="w-3.5 h-3.5" />
              <span>Smart Synergy Bundles</span>
            </div>
            <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${isDark ? "text-white" : "text-zinc-900"}`}>
              Curated Smart Bundles
            </h2>
            <p className="mt-2 text-sm sm:text-base text-zinc-400 max-w-2xl">
              Engineered sets that complement each other naturally. Save up to 20% compared to buying items individually.
            </p>
          </div>

          <div className="text-xs text-zinc-400">
            All bundles include guaranteed fast dispatch & eco packaging.
          </div>
        </div>

        {/* Bundles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SMART_BUNDLES.map((bundle) => {
            const bundleProducts = bundle.productIds
              .map((id) => PRODUCTS.find((p) => p.id === id))
              .filter((p): p is Product => p !== undefined);

            const individualTotal = bundleProducts.reduce((sum, p) => sum + p.price, 0);
            const bundleTotal = individualTotal * (1 - bundle.discountPercent / 100);
            const savings = individualTotal - bundleTotal;
            const isAdded = !!addedBundles[bundle.id];

            return (
              <div
                key={bundle.id}
                className={`rounded-3xl border flex flex-col justify-between overflow-hidden transition-all duration-300 hover:border-zinc-700 ${
                  isDark
                    ? "bg-zinc-900/80 border-zinc-800 shadow-xl shadow-black/30"
                    : "bg-white border-zinc-200/80 shadow-lg shadow-zinc-200/50"
                }`}
                id={`smart-bundle-${bundle.id}`}
              >
                {/* Bundle Header */}
                <div className="p-6 border-b border-zinc-800/50">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                      Save {bundle.discountPercent}%
                    </span>
                    {bundle.badge && (
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        {bundle.badge}
                      </span>
                    )}
                  </div>

                  <h3 className={`text-xl font-bold ${isDark ? "text-white" : "text-zinc-900"}`}>
                    {bundle.name}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                    {bundle.description}
                  </p>
                </div>

                {/* Included Products Visual List */}
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-3">
                      Includes {bundleProducts.length} items:
                    </div>

                    <div className="space-y-3">
                      {bundleProducts.map((prod) => (
                        <div
                          key={prod.id}
                          onClick={() => onProductClick(prod)}
                          className={`flex items-center gap-3 p-2 rounded-xl border cursor-pointer transition-colors ${
                            isDark
                              ? "bg-zinc-950/40 border-zinc-800 hover:border-zinc-700"
                              : "bg-zinc-50 border-zinc-200 hover:border-zinc-300"
                          }`}
                        >
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-zinc-900 shrink-0 flex items-center justify-center p-1">
                            {prod.image ? (
                              <img src={prod.image} alt={prod.name} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                            ) : (
                              <span className="text-lg">{prod.icon}</span>
                            )}
                          </div>
                          <div className="flex-grow min-w-0">
                            <div className="text-xs font-semibold truncate text-zinc-200">{prod.name}</div>
                            <div className="text-[11px] text-zinc-400">{prod.category}</div>
                          </div>
                          <div className="text-xs font-bold text-zinc-300 shrink-0">
                            {formatPrice(prod.price, currency)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Financial Total & CTA */}
                  <div className="pt-6 mt-6 border-t border-zinc-800/40">
                    <div className="flex items-baseline justify-between mb-4">
                      <div>
                        <div className="text-xs text-zinc-400">Bundle Price</div>
                        <div className="flex items-baseline gap-2">
                          <span className={`text-2xl font-extrabold tracking-tight ${isDark ? "text-white" : "text-zinc-900"}`}>
                            {formatPrice(bundleTotal, currency)}
                          </span>
                          <span className="text-xs line-through text-zinc-500">
                            {formatPrice(individualTotal, currency)}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                          Save {formatPrice(savings, currency)}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleAddBundle(bundle, bundleProducts, bundleTotal)}
                      disabled={isAdded}
                      className={`w-full h-11 rounded-xl font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 ${
                        isAdded
                          ? "bg-emerald-600 text-white cursor-default"
                          : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-95 text-white"
                      }`}
                      id={`btn-add-bundle-${bundle.id}`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Bundle Added to Bag!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-4 h-4" />
                          <span>Add Entire Bundle to Bag</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
