import React, { useState, useEffect } from "react";
import { MapPin, ArrowRight, Sparkles, Building2, Compass, Layers, Check, ShoppingBag } from "lucide-react";
import { Product, CurrencyCode } from "../types";
import { CITIES_SPOTLIGHT, CitySpotlightConfig, getCityProducts } from "../data/citySpotlight";
import { ProductCard } from "./ProductCard";
import { trackCitySpotlightView, trackCitySelected, trackCityProductInteraction } from "../utils/analytics";
import { motion, AnimatePresence } from "motion/react";

interface CitySpotlightSectionProps {
  currency: CurrencyCode;
  wishlistIds: string[];
  compareIds: string[];
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product, size?: string, color?: string) => void;
  onToggleWishlist: (product: Product) => void;
  onToggleCompare: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onNavigateToCity: (cityId: string) => void;
  theme?: "dark" | "light";
}

export const CitySpotlightSection: React.FC<CitySpotlightSectionProps> = ({
  currency,
  wishlistIds,
  compareIds,
  onProductClick,
  onAddToCart,
  onToggleWishlist,
  onToggleCompare,
  onQuickView,
  onNavigateToCity,
  theme = "dark",
}) => {
  const [selectedCityId, setSelectedCityId] = useState<string>("new-york");
  const isDark = theme === "dark";

  const activeCity =
    CITIES_SPOTLIGHT.find((c) => c.id === selectedCityId) || CITIES_SPOTLIGHT[0];
  const cityProducts = getCityProducts(activeCity).slice(0, 4);

  useEffect(() => {
    trackCitySpotlightView(activeCity.name, activeCity.testMarketId);
  }, []);

  const handleCitySelect = (city: CitySpotlightConfig) => {
    if (city.id !== selectedCityId) {
      trackCitySelected(city.name, activeCity.name, "homepage_section_tabs");
      setSelectedCityId(city.id);
    }
  };

  return (
    <section
      className={`w-full py-12 sm:py-16 border-b transition-colors ${
        isDark ? "border-zinc-800/60 bg-zinc-950/60" : "border-zinc-200 bg-zinc-50/70"
      }`}
      id="city-spotlight-section"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Top Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-2.5 border bg-blue-500/10 text-blue-400 border-blue-500/20">
              <MapPin className="w-3.5 h-3.5 text-blue-400" />
              <span>City Spotlight • Test Markets</span>
            </div>
            
            <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight ${isDark ? "text-white" : "text-zinc-900"}`}>
              Your Google. <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">Your City.</span>
            </h2>
            
            <p className="mt-2 text-xs sm:text-sm text-zinc-400 max-w-2xl leading-relaxed">
              Explore Google merch through a city-specific lens. Based on GA4 audience concentration, we're testing curated merchandise arrangements across New York, Mountain View, and Sunnyvale.
            </p>
          </div>

          {/* Quick Deep Dive CTA */}
          <button
            onClick={() => onNavigateToCity(activeCity.id)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm shrink-0 cursor-pointer ${
              isDark
                ? "bg-zinc-900 hover:bg-zinc-800 text-blue-400 border border-zinc-700/80 hover:border-blue-500/40"
                : "bg-white hover:bg-zinc-100 text-blue-600 border border-zinc-300"
            }`}
            id="btn-explore-full-city-spotlight"
          >
            <span>Explore {activeCity.name} Spotlight</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* City Switcher Segmented Control */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-zinc-800/40">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {CITIES_SPOTLIGHT.map((city) => {
              const isActive = city.id === selectedCityId;
              return (
                <button
                  key={city.id}
                  onClick={() => handleCitySelect(city)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer shadow-xs ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/20 scale-[1.02]"
                      : isDark
                      ? "bg-zinc-900/90 text-zinc-300 hover:text-white hover:bg-zinc-800 border border-zinc-800"
                      : "bg-white text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 border border-zinc-200"
                  }`}
                  id={`btn-city-tab-${city.id}`}
                >
                  <Building2 className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-zinc-400"}`} />
                  <span>{city.name}</span>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
                      isActive
                        ? "bg-white/20 text-white"
                        : isDark
                        ? "bg-zinc-800 text-zinc-400"
                        : "bg-zinc-100 text-zinc-600"
                    }`}
                  >
                    {city.state}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active City Status Pill */}
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-zinc-400 font-medium">Active Test Market:</span>
            <span className={`font-bold ${isDark ? "text-zinc-200" : "text-zinc-800"}`}>
              {activeCity.name} ({activeCity.testMarketId})
            </span>
          </div>
        </div>

        {/* City Context Card Banner */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCity.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className={`p-4 sm:p-5 rounded-2xl border mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
              isDark
                ? "bg-zinc-900/80 border-zinc-800 text-zinc-200"
                : "bg-white border-zinc-200 text-zinc-800 shadow-sm"
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${activeCity.badgeColor}`}>
                  {activeCity.badge}
                </span>
                <span className="text-xs text-zinc-400 font-medium">
                  {activeCity.marketVibe}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-blue-400">
                {activeCity.headline}
              </h3>
              <p className="text-xs text-zinc-400 max-w-3xl leading-relaxed">
                {activeCity.merchandisingRationale}
              </p>
            </div>

            {/* Category Focus Badges */}
            <div className="flex flex-wrap items-center gap-1.5 shrink-0">
              <span className="text-[11px] font-semibold text-zinc-400 mr-1">Focus Categories:</span>
              {activeCity.focusCategories.map((cat) => (
                <span
                  key={cat}
                  className={`text-xs px-2.5 py-1 rounded-lg font-medium border ${
                    isDark ? "bg-zinc-800/80 border-zinc-700 text-zinc-300" : "bg-zinc-100 border-zinc-200 text-zinc-700"
                  }`}
                >
                  {cat}
                </span>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Curated Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {cityProducts.map((product) => (
            <ProductCard
              key={`${activeCity.id}-${product.id}`}
              product={product}
              currency={currency}
              isWishlisted={wishlistIds.includes(product.id)}
              isCompared={compareIds.includes(product.id)}
              onProductClick={(p) => {
                trackCityProductInteraction("click", p, activeCity.name);
                onProductClick(p);
              }}
              onAddToCart={(p, size, color) => {
                trackCityProductInteraction("add_to_cart", p, activeCity.name);
                onAddToCart(p, size, color);
              }}
              onToggleWishlist={(p) => {
                trackCityProductInteraction("add_to_wishlist", p, activeCity.name);
                onToggleWishlist(p);
              }}
              onToggleCompare={onToggleCompare}
              onQuickView={(p) => {
                trackCityProductInteraction("quick_view", p, activeCity.name);
                onQuickView(p);
              }}
              reason={`${activeCity.name} Spotlight`}
              theme={theme}
            />
          ))}
        </div>

        {/* Bottom Banner with Direct Discovery Link */}
        <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs ${
          isDark ? "bg-zinc-900/40 border-zinc-800/80 text-zinc-400" : "bg-zinc-100/70 border-zinc-200 text-zinc-600"
        }`}>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            <span>
              Showing curated test market assortment for <strong>{activeCity.name}</strong>. Merchandising performance is tracked across City × Product × Channel.
            </span>
          </div>

          <button
            onClick={() => onNavigateToCity(activeCity.id)}
            className="text-blue-400 hover:text-blue-300 font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
          >
            <span>View Full {activeCity.name} Spotlight</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </section>
  );
};
