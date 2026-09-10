import React, { useState } from "react";
import { Product, CurrencyCode } from "../types";
import { MERCH_MOODS, MoodConfig } from "../data";
import { getProductsByMood } from "../utils/recommendations";
import { ProductCard } from "./ProductCard";
import { trackMoodSelected } from "../utils/analytics";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Compass } from "lucide-react";

interface MerchMoodProps {
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

export const MerchMood: React.FC<MerchMoodProps> = ({
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
  const [activeMood, setActiveMood] = useState<string>("Desk Day");
  const isDark = theme === "dark";

  const handleMoodSelect = (moodId: string) => {
    setActiveMood(moodId);
    trackMoodSelected(moodId);
  };

  const currentConfig = MERCH_MOODS.find((m) => m.id === activeMood) || MERCH_MOODS[0];
  const moodProducts = getProductsByMood(activeMood);

  return (
    <section className="w-full py-12" id="merch-mood-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3 border bg-purple-500/10 text-purple-400 border-purple-500/20">
              <Compass className="w-3.5 h-3.5" />
              <span>Contextual Discovery</span>
            </div>
            <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${isDark ? "text-white" : "text-zinc-900"}`}>
              Merch Mood
            </h2>
            <p className="mt-2 text-sm sm:text-base text-zinc-400 max-w-xl">
              Switch your mindset. Whether you're locked into deep code or traveling offline, explore products engineered for the occasion.
            </p>
          </div>

          <div className="text-xs text-zinc-500 hidden md:block">
            Showing <strong className="text-zinc-300 font-semibold">{moodProducts.length}</strong> essentials for {currentConfig.name}
          </div>
        </div>

        {/* Mood Pills Selector */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-4 scrollbar-none no-scrollbar mb-8">
          {MERCH_MOODS.map((mood) => {
            const isSelected = activeMood === mood.id;
            return (
              <button
                key={mood.id}
                onClick={() => handleMoodSelect(mood.id)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all duration-200 flex items-center gap-2.5 border shrink-0 ${
                  isSelected
                    ? isDark
                      ? "bg-white text-zinc-950 border-white shadow-lg shadow-white/10 scale-105"
                      : "bg-zinc-900 text-white border-zinc-900 shadow-md scale-105"
                    : isDark
                    ? "bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700"
                    : "bg-white border-zinc-200 text-zinc-600 hover:text-zinc-900 hover:border-zinc-300"
                }`}
                id={`mood-pill-${mood.id.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <span className="text-base">{mood.icon}</span>
                <span>{mood.name}</span>
                <span className={`text-[10px] hidden sm:inline ${isSelected ? (isDark ? "text-zinc-600" : "text-zinc-300") : "text-zinc-500"}`}>
                  • {mood.tagline}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Mood Banner */}
        <div
          className={`p-4 sm:p-6 rounded-2xl mb-8 border transition-all duration-300 flex items-center justify-between gap-4 bg-gradient-to-r ${currentConfig.color} ${
            isDark ? "border-zinc-800" : "border-zinc-200"
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-black/20 backdrop-blur-md flex items-center justify-center text-2xl shrink-0">
              {currentConfig.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className={`text-base sm:text-lg font-bold ${isDark ? "text-white" : "text-zinc-900"}`}>
                  {currentConfig.name} Mood
                </h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-black/20 text-white/90 font-medium">
                  {currentConfig.tagline}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-300 mt-0.5 max-w-2xl">
                {currentConfig.description}
              </p>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {moodProducts.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
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
                  reason={`Perfect for ${currentConfig.name}`}
                  theme={theme}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
