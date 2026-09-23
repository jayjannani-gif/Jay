import React, { useState, useEffect, useMemo } from "react";
import {
  MapPin,
  Building2,
  Sparkles,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  ShoppingBag,
  Eye,
  SlidersHorizontal,
  Compass,
  CheckCircle2,
  TrendingUp,
  Award,
} from "lucide-react";
import { Product, CurrencyCode } from "../types";
import { CITIES_SPOTLIGHT, CitySpotlightConfig, getCityProducts, getCityById } from "../data/citySpotlight";
import { ProductCard } from "./ProductCard";
import { formatPrice } from "../utils/currency";
import {
  trackCitySpotlightView,
  trackCitySelected,
  trackCityCollectionView,
  trackCityProductInteraction,
} from "../utils/analytics";
import { motion, AnimatePresence } from "motion/react";

interface CitySpotlightViewProps {
  initialCityId?: string;
  currency: CurrencyCode;
  wishlistIds: string[];
  compareIds: string[];
  onPageChange: (page: string) => void;
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product, size?: string, color?: string) => void;
  onToggleWishlist: (product: Product) => void;
  onToggleCompare: (product: Product) => void;
  onQuickView: (product: Product) => void;
  theme?: "dark" | "light";
}

export const CitySpotlightView: React.FC<CitySpotlightViewProps> = ({
  initialCityId = "new-york",
  currency,
  wishlistIds,
  compareIds,
  onPageChange,
  onProductClick,
  onAddToCart,
  onToggleWishlist,
  onToggleCompare,
  onQuickView,
  theme = "dark",
}) => {
  const [activeCityId, setActiveCityId] = useState<string>(initialCityId);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const isDark = theme === "dark";

  // Sync if initialCityId prop changes from routing query
  useEffect(() => {
    if (initialCityId) {
      setActiveCityId(initialCityId);
    }
  }, [initialCityId]);

  const activeCity = useMemo(() => getCityById(activeCityId), [activeCityId]);
  const allCityProducts = useMemo(() => getCityProducts(activeCity), [activeCity]);

  // Hero product for the active city
  const heroProduct = useMemo(() => {
    return allCityProducts.find((p) => p.id === activeCity.heroProductId) || allCityProducts[0];
  }, [allCityProducts, activeCity]);

  // Filtered products if category pill selected
  const displayedProducts = useMemo(() => {
    if (selectedCategory === "all") return allCityProducts;
    return allCityProducts.filter((p) => p.category === selectedCategory);
  }, [allCityProducts, selectedCategory]);

  // Fire GA4 tracking
  useEffect(() => {
    trackCitySpotlightView(activeCity.name, activeCity.testMarketId);
    trackCityCollectionView(
      activeCity.name,
      displayedProducts.length,
      activeCity.focusCategories
    );
  }, [activeCity.id]);

  const handleCityChange = (cityId: string) => {
    if (cityId !== activeCityId) {
      const prevCityName = activeCity.name;
      const nextCity = getCityById(cityId);
      trackCitySelected(nextCity.name, prevCityName, "spotlight_page_tabs");
      setActiveCityId(cityId);
      setSelectedCategory("all");
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 py-8 ${
        isDark ? "bg-[#06070B] text-zinc-100" : "bg-zinc-50 text-zinc-900"
      }`}
      id="city-spotlight-view"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-semibold mb-6 select-none" id="city-spotlight-breadcrumbs">
          <button
            onClick={() => onPageChange("home")}
            className={`hover:text-blue-400 transition-colors cursor-pointer ${
              isDark ? "text-zinc-500" : "text-zinc-400"
            }`}
          >
            Home
          </button>
          <ChevronRight className={`h-3 w-3 ${isDark ? "text-zinc-700" : "text-zinc-400"}`} />
          <button
            onClick={() => onPageChange("city-spotlight")}
            className={`hover:text-blue-400 transition-colors cursor-pointer ${
              isDark ? "text-zinc-500" : "text-zinc-400"
            }`}
          >
            City Spotlight
          </button>
          <ChevronRight className={`h-3 w-3 ${isDark ? "text-zinc-700" : "text-zinc-400"}`} />
          <span className="text-blue-400 font-bold">{activeCity.name}</span>
        </nav>

        {/* Page Top Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2.5 border bg-blue-500/10 text-blue-400 border-blue-500/20">
              <MapPin className="w-3.5 h-3.5 text-blue-400" />
              <span>Google Merch City Spotlight Program</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              {activeCity.name} <span className="text-blue-500">Spotlight</span>
            </h1>

            <p className="mt-2 text-sm sm:text-base text-zinc-400 max-w-2xl leading-relaxed">
              {activeCity.subheadline}
            </p>
          </div>

          {/* Test Market Indicator Card */}
          <div
            className={`p-3.5 rounded-2xl border flex items-center gap-3.5 shrink-0 ${
              isDark ? "bg-zinc-900/80 border-zinc-800" : "bg-white border-zinc-200 shadow-sm"
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-400 flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-bold">
                GA4 Test Market Program
              </div>
              <div className="text-xs font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{activeCity.testMarketId} ({activeCity.state})</span>
              </div>
            </div>
          </div>
        </div>

        {/* City Selector Segmented Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-8 border-b border-zinc-800/40">
          {CITIES_SPOTLIGHT.map((city) => {
            const isActive = city.id === activeCityId;
            return (
              <button
                key={city.id}
                onClick={() => handleCityChange(city.id)}
                className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2.5 cursor-pointer shadow-sm ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25 scale-[1.02]"
                    : isDark
                    ? "bg-zinc-900/90 text-zinc-300 hover:text-white hover:bg-zinc-800 border border-zinc-800"
                    : "bg-white text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 border border-zinc-200"
                }`}
                id={`btn-city-page-tab-${city.id}`}
              >
                <Building2 className={`w-4 h-4 ${isActive ? "text-white" : "text-zinc-400"}`} />
                <span>{city.name}</span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                    isActive
                      ? "bg-white/20 text-white"
                      : isDark
                      ? "bg-zinc-800 text-zinc-400"
                      : "bg-zinc-100 text-zinc-600"
                  }`}
                >
                  {city.testMarketId}
                </span>
              </button>
            );
          })}
        </div>

        {/* City Hero Banner & Lead Spotlight Product */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          
          {/* Left: City Overview & Merchandising Focus */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-6">
            <div
              className={`p-6 sm:p-8 rounded-3xl border ${
                isDark ? "bg-zinc-900/70 border-zinc-800" : "bg-white border-zinc-200 shadow-sm"
              }`}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border ${activeCity.badgeColor}`}>
                  {activeCity.badge}
                </span>
                <span className="text-xs text-zinc-400 font-medium">
                  {activeCity.marketVibe}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold leading-snug mb-3">
                {activeCity.headline}
              </h2>

              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-6">
                {activeCity.context}
              </p>

              {/* Highlights List */}
              <div className="space-y-2.5 pt-4 border-t border-zinc-800/60">
                <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-400 mb-2">
                  Market Merchandising Priorities:
                </div>
                {activeCity.keyHighlights.map((highlight, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-zinc-300">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Test Market Measurement Notice */}
            <div
              className={`p-4 rounded-2xl border text-xs flex items-center gap-3 ${
                isDark ? "bg-blue-950/20 border-blue-900/40 text-blue-300" : "bg-blue-50 border-blue-200 text-blue-800"
              }`}
            >
              <TrendingUp className="w-5 h-5 text-blue-400 shrink-0" />
              <div>
                <strong className="font-semibold">City-Level Performance Testing:</strong> Active merchandising data from {activeCity.name} allows comparison across City × Product × Channel without assuming speculative profitability.
              </div>
            </div>
          </div>

          {/* Right: Featured Lead Product Card */}
          {heroProduct && (
            <div className="lg:col-span-5">
              <div
                className={`h-full p-6 sm:p-7 rounded-3xl border flex flex-col justify-between relative overflow-hidden ${
                  isDark
                    ? "bg-gradient-to-b from-zinc-900 to-zinc-950 border-zinc-800"
                    : "bg-white border-zinc-200 shadow-md"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5" />
                    <span>Featured Lead Selection</span>
                  </span>
                  <span className="text-xs font-mono text-zinc-400">{heroProduct.category}</span>
                </div>

                {/* Hero Product Visual */}
                <div
                  onClick={() => {
                    trackCityProductInteraction("click", heroProduct, activeCity.name);
                    onProductClick(heroProduct);
                  }}
                  className="w-full aspect-[4/3] rounded-2xl cursor-pointer overflow-hidden flex items-center justify-center p-4 mb-4 select-none bg-zinc-900/50 hover:bg-zinc-800/40 transition-colors"
                  style={{
                    background: heroProduct.image ? undefined : heroProduct.gradient,
                  }}
                >
                  {heroProduct.image ? (
                    <img
                      src={heroProduct.image}
                      alt={heroProduct.name}
                      className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <span className="text-7xl">{heroProduct.icon}</span>
                  )}
                </div>

                <div>
                  <h3
                    onClick={() => {
                      trackCityProductInteraction("click", heroProduct, activeCity.name);
                      onProductClick(heroProduct);
                    }}
                    className="text-lg font-bold hover:text-blue-400 cursor-pointer transition-colors"
                  >
                    {heroProduct.name}
                  </h3>
                  <p className="text-xs text-zinc-400 line-clamp-2 mt-1 leading-relaxed">
                    {heroProduct.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 mt-4 border-t border-zinc-800/80">
                    <div>
                      <div className="text-[10px] text-zinc-500 uppercase tracking-wider">Price</div>
                      <div className="text-xl font-extrabold text-blue-400">
                        {formatPrice(heroProduct.price, currency)}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          trackCityProductInteraction("quick_view", heroProduct, activeCity.name);
                          onQuickView(heroProduct);
                        }}
                        className="h-10 px-3.5 rounded-xl border border-zinc-700 hover:border-zinc-600 text-xs font-semibold text-zinc-300 hover:text-white transition-colors cursor-pointer"
                      >
                        Quick View
                      </button>

                      <button
                        onClick={() => {
                          trackCityProductInteraction("add_to_cart", heroProduct, activeCity.name);
                          onAddToCart(heroProduct);
                        }}
                        className="h-10 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md transition-all active:scale-95 cursor-pointer"
                        id="btn-spotlight-hero-add"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add to Bag</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* City Assortment Section */}
        <section className="mb-16">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                Curated Merchandise Assortment
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                Showing {displayedProducts.length} items curated for {activeCity.name}'s test market profile.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === "all"
                    ? "bg-blue-600 text-white"
                    : isDark
                    ? "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
                    : "bg-white text-zinc-600 hover:text-zinc-900 border border-zinc-200"
                }`}
              >
                All Focus ({allCityProducts.length})
              </button>

              {activeCity.focusCategories.map((cat) => {
                const count = allCityProducts.filter((p) => p.category === cat).length;
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-blue-600 text-white"
                        : isDark
                        ? "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
                        : "bg-white text-zinc-600 hover:text-zinc-900 border border-zinc-200"
                    }`}
                  >
                    {cat} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Curated Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedProducts.map((product) => (
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

          {/* CTA Banner to Catalog */}
          <div
            className={`mt-10 p-6 sm:p-8 rounded-3xl border flex flex-col md:flex-row md:items-center justify-between gap-6 ${
              isDark ? "bg-zinc-900/60 border-zinc-800" : "bg-white border-zinc-200 shadow-sm"
            }`}
          >
            <div>
              <h3 className="text-lg font-bold mb-1">
                Looking for more beyond {activeCity.name}?
              </h3>
              <p className="text-xs text-zinc-400 max-w-xl">
                Browse our complete catalog of developer apparel, workspace accessories, and smart bundles across all Google ecosystems.
              </p>
            </div>

            <button
              onClick={() => onPageChange("shop")}
              className="h-11 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer shrink-0"
              id="btn-explore-full-catalog-from-city"
            >
              <span>Explore Full Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>

      </div>
    </div>
  );
};
