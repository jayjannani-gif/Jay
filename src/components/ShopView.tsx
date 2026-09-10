import React, { useState, useEffect, useMemo } from "react";
import { Search, SlidersHorizontal, Heart, ShoppingCart, Star, X, Check, Grid, Sparkles, Scale, RefreshCw } from "lucide-react";
import { Product, CurrencyCode, EcosystemType, MerchMoodType, StyleType } from "../types";
import { PRODUCTS, GOOGLE_ECOSYSTEMS, MERCH_MOODS } from "../data";
import { formatPrice } from "../utils/currency";
import { trackViewItemList, trackSelectItem, trackSearch } from "../utils/analytics";
import { ProductCard } from "./ProductCard";

interface ShopViewProps {
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product, size?: string, color?: string) => void;
  onToggleWishlist: (product: Product) => void;
  onToggleCompare: (product: Product) => void;
  onQuickView: (product: Product) => void;
  wishlistIds: string[];
  compareIds: string[];
  currency: CurrencyCode;
  theme: "dark" | "light";
}

type SortOption = "featured" | "bestselling" | "price_low" | "price_high" | "top_rated";

export const ShopView: React.FC<ShopViewProps> = ({
  onProductClick,
  onAddToCart,
  onToggleWishlist,
  onToggleCompare,
  onQuickView,
  wishlistIds,
  compareIds,
  currency,
  theme,
}) => {
  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedEcosystems, setSelectedEcosystems] = useState<string[]>([]);
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(100);
  const [showOnlyOnSale, setShowOnlyOnSale] = useState(false);
  const [showOnlyNew, setShowOnlyNew] = useState(false);
  const [showOnlyWishlisted, setShowOnlyWishlisted] = useState(false);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<SortOption>("featured");

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Search Debouncer for GA4 tracking
  useEffect(() => {
    if (!searchQuery) return;
    const tracker = setTimeout(() => {
      trackSearch(searchQuery);
    }, 1000);
    return () => clearTimeout(tracker);
  }, [searchQuery]);

  // Unique categories derived from PRODUCTS
  const categories = useMemo(() => {
    return Array.from(new Set(PRODUCTS.map((p) => p.category)));
  }, []);

  const styles: StyleType[] = ["Minimal", "Playful", "Bold", "Classic", "Creative"];

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    let result = [...PRODUCTS];

    // Search query filter
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          p.ecosystem.toLowerCase().includes(query) ||
          p.tags.some((t) => t.toLowerCase().includes(query))
      );
    }

    // Category filter
    if (selectedCategories.length > 0) {
      result = result.filter((p) => selectedCategories.includes(p.category));
    }

    // Ecosystem filter
    if (selectedEcosystems.length > 0) {
      result = result.filter((p) => selectedEcosystems.includes(p.ecosystem));
    }

    // Merch Mood filter
    if (selectedMoods.length > 0) {
      result = result.filter((p) => selectedMoods.some((m) => p.moods.includes(m as any)));
    }

    // Style filter
    if (selectedStyles.length > 0) {
      result = result.filter((p) => selectedStyles.includes(p.style));
    }

    // Price range filter
    result = result.filter((p) => p.price <= maxPrice);

    // On Sale filter
    if (showOnlyOnSale) {
      result = result.filter((p) => p.badge === "On Sale" || p.originalPrice);
    }

    // New filter
    if (showOnlyNew) {
      result = result.filter((p) => p.badge === "New");
    }

    // Wishlisted only filter
    if (showOnlyWishlisted) {
      result = result.filter((p) => wishlistIds.includes(p.id));
    }

    // Rating filter
    if (minRating > 0) {
      result = result.filter((p) => p.rating >= minRating);
    }

    // Sorting
    switch (sortBy) {
      case "bestselling":
        result.sort((a, b) => {
          if (a.rank && b.rank) return a.rank - b.rank;
          if (a.rank) return -1;
          if (b.rank) return 1;
          return b.reviewCount - a.reviewCount;
        });
        break;
      case "price_low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price_high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "top_rated":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "featured":
      default:
        result.sort((a, b) => {
          if (a.badge === "New" && b.badge !== "New") return -1;
          if (b.badge === "New" && a.badge !== "New") return 1;
          return a.id.localeCompare(b.id);
        });
        break;
    }

    return result;
  }, [
    searchQuery,
    selectedCategories,
    selectedEcosystems,
    selectedMoods,
    selectedStyles,
    maxPrice,
    showOnlyOnSale,
    showOnlyNew,
    showOnlyWishlisted,
    minRating,
    sortBy,
    wishlistIds,
  ]);

  useEffect(() => {
    trackViewItemList(filteredProducts, "Catalog Filter Grid");
  }, [filteredProducts]);

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const toggleEcosystem = (eco: string) => {
    setSelectedEcosystems((prev) =>
      prev.includes(eco) ? prev.filter((e) => e !== eco) : [...prev, eco]
    );
  };

  const toggleMood = (mood: string) => {
    setSelectedMoods((prev) =>
      prev.includes(mood) ? prev.filter((m) => m !== mood) : [...prev, mood]
    );
  };

  const toggleStyle = (st: string) => {
    setSelectedStyles((prev) =>
      prev.includes(st) ? prev.filter((s) => s !== st) : [...prev, st]
    );
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedCategories([]);
    setSelectedEcosystems([]);
    setSelectedMoods([]);
    setSelectedStyles([]);
    setMaxPrice(100);
    setShowOnlyOnSale(false);
    setShowOnlyNew(false);
    setShowOnlyWishlisted(false);
    setMinRating(0);
    setSortBy("featured");
  };

  const hasActiveFilters =
    searchQuery !== "" ||
    selectedCategories.length > 0 ||
    selectedEcosystems.length > 0 ||
    selectedMoods.length > 0 ||
    selectedStyles.length > 0 ||
    maxPrice < 100 ||
    showOnlyOnSale ||
    showOnlyNew ||
    showOnlyWishlisted ||
    minRating > 0;

  const isDark = theme === "dark";

  return (
    <div
      className={`transition-colors duration-300 min-h-screen py-8 ${
        isDark ? "bg-[#06070B] text-zinc-100" : "bg-zinc-50 text-zinc-900"
      }`}
      id="shop-view"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Area */}
        <div className="mb-8" id="shop-header">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-2 border bg-blue-500/10 text-blue-400 border-blue-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Merch Lab Catalog</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">
            Explore All Creations
          </h1>
          <p className="text-sm text-zinc-400 max-w-2xl">
            Filter by brand ecosystem, contextual mood, aesthetic style, and budget to find gear engineered for your workspace.
          </p>
        </div>

        {/* Live Search & Sort Ribbon */}
        <div className="flex flex-col md:flex-row gap-4 mb-6 items-center justify-between" id="shop-search-ribbon">
          {/* Live Search Input */}
          <div className="w-full md:max-w-md relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search catalog... (e.g. Hoodie, Dino, Desk, Gemini)"
              className={`w-full text-sm pl-10 pr-10 py-2.5 rounded-2xl border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isDark
                  ? "bg-zinc-900/80 border-zinc-800 text-white placeholder-zinc-500"
                  : "bg-white border-zinc-200 text-zinc-900 placeholder-zinc-400"
              }`}
              id="shop-search-input"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white p-1"
                id="clear-search-btn"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex w-full md:w-auto items-center justify-between md:justify-end gap-3">
            {/* Mobile Filters Toggle */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`lg:hidden flex items-center gap-2 text-xs font-semibold py-2.5 px-4 rounded-xl border ${
                isDark ? "border-zinc-800 bg-zinc-900 text-zinc-300" : "border-zinc-200 bg-white text-zinc-700"
              }`}
              id="mobile-filter-toggle"
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span>Filters ({selectedCategories.length + selectedEcosystems.length + selectedMoods.length})</span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-500 whitespace-nowrap">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className={`text-xs font-semibold py-2 px-3 rounded-xl border focus:outline-none cursor-pointer ${
                  isDark
                    ? "bg-zinc-900 border-zinc-800 text-zinc-200"
                    : "bg-white border-zinc-200 text-zinc-800"
                }`}
                id="shop-sort-select"
              >
                <option value="featured">Featured / New Drops</option>
                <option value="bestselling">Most Popular</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="top_rated">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filters Chips Bar */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-6 p-3 rounded-2xl bg-zinc-900/30 border border-zinc-800/60">
            <span className="text-xs font-semibold text-zinc-400">Active Filters:</span>
            {selectedCategories.map((c) => (
              <button
                key={c}
                onClick={() => toggleCategory(c)}
                className="px-2.5 py-1 rounded-lg text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-1.5"
              >
                <span>Category: {c}</span>
                <X className="w-3 h-3" />
              </button>
            ))}
            {selectedEcosystems.map((eco) => (
              <button
                key={eco}
                onClick={() => toggleEcosystem(eco)}
                className="px-2.5 py-1 rounded-lg text-xs bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center gap-1.5"
              >
                <span>Ecosystem: {eco}</span>
                <X className="w-3 h-3" />
              </button>
            ))}
            {selectedMoods.map((m) => (
              <button
                key={m}
                onClick={() => toggleMood(m)}
                className="px-2.5 py-1 rounded-lg text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5"
              >
                <span>Mood: {m}</span>
                <X className="w-3 h-3" />
              </button>
            ))}
            {selectedStyles.map((s) => (
              <button
                key={s}
                onClick={() => toggleStyle(s)}
                className="px-2.5 py-1 rounded-lg text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1.5"
              >
                <span>Style: {s}</span>
                <X className="w-3 h-3" />
              </button>
            ))}
            {maxPrice < 100 && (
              <button
                onClick={() => setMaxPrice(100)}
                className="px-2.5 py-1 rounded-lg text-xs bg-zinc-800 text-zinc-300 border border-zinc-700 flex items-center gap-1.5"
              >
                <span>Under {formatPrice(maxPrice, currency)}</span>
                <X className="w-3 h-3" />
              </button>
            )}
            <button
              onClick={clearAllFilters}
              className="text-xs text-rose-400 hover:text-rose-300 font-semibold ml-auto flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset All</span>
            </button>
          </div>
        )}

        {/* Catalog Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar Filters */}
          <aside
            className={`lg:col-span-3 lg:block ${
              sidebarOpen ? "fixed inset-0 z-50 p-6 bg-black/90 overflow-y-auto block" : "hidden"
            }`}
          >
            <div
              className={`p-6 rounded-3xl border space-y-6 ${
                isDark ? "bg-zinc-900/60 border-zinc-800" : "bg-white border-zinc-200"
              }`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
                <div className="font-bold text-sm flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-blue-400" />
                  <span>Refine Catalog</span>
                </div>
                {sidebarOpen && (
                  <button onClick={() => setSidebarOpen(false)} className="text-zinc-400 lg:hidden">
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Ecosystem Facet */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
                  Google Ecosystem
                </h4>
                <div className="space-y-1.5">
                  {GOOGLE_ECOSYSTEMS.map((eco) => {
                    const isChecked = selectedEcosystems.includes(eco.id);
                    return (
                      <button
                        key={eco.id}
                        onClick={() => toggleEcosystem(eco.id)}
                        className={`w-full text-left px-3 py-1.5 rounded-xl text-xs flex items-center justify-between transition-colors ${
                          isChecked
                            ? "bg-blue-600/20 text-blue-400 font-bold border border-blue-500/30"
                            : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span>{eco.icon}</span>
                          <span>{eco.name}</span>
                        </div>
                        {isChecked && <Check className="w-3.5 h-3.5 text-blue-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Categories Facet */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
                  Product Category
                </h4>
                <div className="space-y-1.5">
                  {categories.map((cat) => {
                    const isChecked = selectedCategories.includes(cat);
                    return (
                      <button
                        key={cat}
                        onClick={() => toggleCategory(cat)}
                        className={`w-full text-left px-3 py-1.5 rounded-xl text-xs flex items-center justify-between transition-colors ${
                          isChecked
                            ? "bg-blue-600/20 text-blue-400 font-bold border border-blue-500/30"
                            : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
                        }`}
                      >
                        <span>{cat}</span>
                        {isChecked && <Check className="w-3.5 h-3.5 text-blue-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Merch Mood Facet */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
                  Merch Mood
                </h4>
                <div className="space-y-1.5">
                  {MERCH_MOODS.map((m) => {
                    const isChecked = selectedMoods.includes(m.id);
                    return (
                      <button
                        key={m.id}
                        onClick={() => toggleMood(m.id)}
                        className={`w-full text-left px-3 py-1.5 rounded-xl text-xs flex items-center justify-between transition-colors ${
                          isChecked
                            ? "bg-purple-600/20 text-purple-400 font-bold border border-purple-500/30"
                            : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span>{m.icon}</span>
                          <span>{m.name}</span>
                        </div>
                        {isChecked && <Check className="w-3.5 h-3.5 text-purple-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Aesthetic Style Facet */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
                  Aesthetic Style
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {styles.map((st) => {
                    const isChecked = selectedStyles.includes(st);
                    return (
                      <button
                        key={st}
                        onClick={() => toggleStyle(st)}
                        className={`px-3 py-1 rounded-xl text-xs border transition-colors ${
                          isChecked
                            ? "bg-amber-500/20 border-amber-500 text-amber-300 font-bold"
                            : "border-zinc-800 text-zinc-400 hover:border-zinc-700"
                        }`}
                      >
                        {st}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price Range Slider */}
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold uppercase tracking-wider text-zinc-400">Max Budget</span>
                  <span className="font-extrabold text-blue-400">
                    {formatPrice(maxPrice, currency)}
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-zinc-500 mt-1">
                  <span>{formatPrice(10, currency)}</span>
                  <span>{formatPrice(100, currency)}</span>
                </div>
              </div>

              {/* Quick Checkbox Toggles */}
              <div className="pt-4 border-t border-zinc-800/80 space-y-2.5 text-xs text-zinc-300">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showOnlyOnSale}
                    onChange={(e) => setShowOnlyOnSale(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-0 cursor-pointer"
                  />
                  <span>On Sale / Special Value</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showOnlyNew}
                    onChange={(e) => setShowOnlyNew(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-0 cursor-pointer"
                  />
                  <span>New Drop Arrivals</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showOnlyWishlisted}
                    onChange={(e) => setShowOnlyWishlisted(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-0 cursor-pointer"
                  />
                  <span>Saved in Wishlist ({wishlistIds.length})</span>
                </label>
              </div>

              {sidebarOpen && (
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="w-full h-11 rounded-xl bg-blue-600 text-white font-semibold text-xs uppercase tracking-wider lg:hidden"
                >
                  Apply & View {filteredProducts.length} Results
                </button>
              )}
            </div>
          </aside>

          {/* Products Grid */}
          <main className="lg:col-span-9">
            <div className="flex items-center justify-between mb-6 text-xs text-zinc-400">
              <div>
                Showing <strong className="text-zinc-200">{filteredProducts.length}</strong> of {PRODUCTS.length} creations
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="py-20 text-center rounded-3xl border border-zinc-800 bg-zinc-900/30 p-8">
                <Grid className="w-12 h-12 mx-auto text-zinc-600 mb-4" />
                <h3 className="text-lg font-bold mb-2">No matching products found</h3>
                <p className="text-xs text-zinc-400 max-w-sm mx-auto mb-6">
                  No merchandise satisfies all active filters. Try broadening your criteria or reset the filters.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="h-10 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
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
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
