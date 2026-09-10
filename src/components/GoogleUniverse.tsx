import React, { useState } from "react";
import { Product, CurrencyCode } from "../types";
import { GOOGLE_ECOSYSTEMS, EcosystemConfig, PRODUCTS } from "../data";
import { ProductCard } from "./ProductCard";
import { trackEcosystemSelected } from "../utils/analytics";
import { Globe2, Layers } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface GoogleUniverseProps {
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

export const GoogleUniverse: React.FC<GoogleUniverseProps> = ({
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
  const [selectedEcosystem, setSelectedEcosystem] = useState<EcosystemConfig["id"]>("Google");
  const isDark = theme === "dark";

  const handleSelect = (ecoId: EcosystemConfig["id"]) => {
    setSelectedEcosystem(ecoId);
    trackEcosystemSelected(ecoId);
  };

  const activeEco = GOOGLE_ECOSYSTEMS.find((e) => e.id === selectedEcosystem) || GOOGLE_ECOSYSTEMS[0];

  // Filter products matching the ecosystem
  const ecoProducts = PRODUCTS.filter((p) => p.ecosystem === selectedEcosystem);

  return (
    <section className="w-full py-12" id="google-universe-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3 border bg-blue-500/10 text-blue-400 border-blue-500/20">
              <Globe2 className="w-3.5 h-3.5" />
              <span>Ecosystem Architecture</span>
            </div>
            <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${isDark ? "text-white" : "text-zinc-900"}`}>
              Google Universe
            </h2>
            <p className="mt-2 text-sm sm:text-base text-zinc-400 max-w-2xl">
              Navigate merchandise by brand affinity. From Android's open-source spirit to Pixel hardware refinement and Developer AI tooling.
            </p>
          </div>

          <div className="text-xs text-zinc-500 hidden md:block">
            {ecoProducts.length} items catalogued under {activeEco.name}
          </div>
        </div>

        {/* Ecosystem Nav Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2.5 mb-8">
          {GOOGLE_ECOSYSTEMS.map((eco) => {
            const isSelected = selectedEcosystem === eco.id;
            const count = PRODUCTS.filter((p) => p.ecosystem === eco.id).length;
            return (
              <button
                key={eco.id}
                onClick={() => handleSelect(eco.id)}
                className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                  isSelected
                    ? isDark
                      ? "bg-zinc-800 border-white/80 text-white shadow-lg shadow-white/5 scale-102"
                      : "bg-zinc-900 border-zinc-900 text-white shadow-md scale-102"
                    : isDark
                    ? "bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                    : "bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300 hover:text-zinc-900"
                }`}
                id={`eco-tab-${eco.id.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <span className="text-xl">{eco.icon}</span>
                <span className="text-xs font-semibold truncate w-full">{eco.name}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? "bg-white/20 text-white" : "text-zinc-500"}`}>
                  {count} {count === 1 ? "item" : "items"}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Ecosystem Details Header */}
        <div
          className={`p-6 rounded-2xl mb-8 border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
            isDark ? "bg-zinc-900/60 border-zinc-800" : "bg-zinc-50 border-zinc-200"
          }`}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-zinc-800/80 flex items-center justify-center text-2xl shrink-0">
              {activeEco.icon}
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className={`text-lg font-bold ${isDark ? "text-white" : "text-zinc-900"}`}>
                  {activeEco.name} Collection
                </h3>
                <span className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${activeEco.badgeBg}`}>
                  Verified Gear
                </span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                {activeEco.description}
              </p>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {ecoProducts.length > 0 ? (
              ecoProducts.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <ProductCard
                    product={product}
                    currency={currency}
                    isWishlisted={wishlistIds.includes(product.id)}
                    isCompared={compareIds.includes(product.id)}
                    onProductClick={onProductClick}
                    onAddToCart={onAddToCart}
                    onToggleWishlist={onToggleWishlist}
                    onToggleCompare={onToggleCompare}
                    onQuickView={onQuickView}
                    reason={`Official ${activeEco.name} merchandise`}
                    theme={theme}
                  />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-zinc-400">
                <p>New drops coming soon to the {activeEco.name} ecosystem capsule.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
