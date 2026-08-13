import React, { useState, useEffect, useMemo } from "react";
import { Search, SlidersHorizontal, Heart, ShoppingCart, Star, X, Check, Grid } from "lucide-react";
import { Product } from "../types";
import { PRODUCTS } from "../data";
import { trackViewItemList, trackSelectItem, trackSearch } from "../utils/analytics";

interface ShopViewProps {
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product, size?: string, color?: string) => void;
  onAddToWishlist: (product: Product) => void;
  wishlistIds: string[];
  theme: "dark" | "light";
}

type SortOption = "featured" | "bestselling" | "price_low" | "price_high" | "top_rated";

export const ShopView: React.FC<ShopViewProps> = ({
  onProductClick,
  onAddToCart,
  onAddToWishlist,
  wishlistIds,
  theme,
}) => {
  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(80);
  const [showOnlyOnSale, setShowOnlyOnSale] = useState(false);
  const [showOnlyNew, setShowOnlyNew] = useState(false);
  const [showOnlyWishlisted, setShowOnlyWishlisted] = useState(false);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<SortOption>("featured");

  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Search Debouncer for GA4 tracking to prevent spamming
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

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    let result = [...PRODUCTS];

    // Search query filter
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategories.length > 0) {
      result = result.filter((p) => selectedCategories.includes(p.category));
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
        // Sort by rank ascending (rank 1, 2, 3 first), and then by reviews count
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
        // Featured (stable order, mostly new at the top)
        result.sort((a, b) => {
          if (a.badge === "New" && b.badge !== "New") return -1;
          if (b.badge === "New" && a.badge !== "New") return 1;
          return a.id.localeCompare(b.id);
        });
        break;
    }

    return result;
  }, [searchQuery, selectedCategories, maxPrice, showOnlyOnSale, showOnlyNew, showOnlyWishlisted, minRating, sortBy, wishlistIds]);

  // Fire GA4 View Item List on list load/change
  useEffect(() => {
    trackViewItemList(filteredProducts, "Catalog Filter Grid");
  }, [filteredProducts]);

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedCategories([]);
    setMaxPrice(80);
    setShowOnlyOnSale(false);
    setShowOnlyNew(false);
    setShowOnlyWishlisted(false);
    setMinRating(0);
    setSortBy("featured");
  };

  const removeCategoryChip = (cat: string) => {
    setSelectedCategories((prev) => prev.filter((c) => c !== cat));
  };

  const handleProductClick = (product: Product) => {
    trackSelectItem(product, "Catalog Filter Grid");
    onProductClick(product);
  };

  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    const defaultSize = product.sizes ? product.sizes[1] || product.sizes[0] : undefined;
    const defaultColor = product.colors ? product.colors[0].name : undefined;
    onAddToCart(product, defaultSize, defaultColor);

    setAddedItems((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [product.id]: false }));
    }, 2000);
  };

  const isDark = theme === "dark";

  return (
    <div className={`transition-colors duration-300 min-h-screen py-8 ${isDark ? "bg-ai-bg text-ai-text" : "bg-zinc-50 text-zinc-900"}`} id="shop-view">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Area */}
        <div className="mb-8" id="shop-header">
          <h1 className="text-3xl font-bold font-heading mb-2">Explore the Studio Collection</h1>
          <p className={`text-sm ${isDark ? "text-ai-muted" : "text-zinc-500"}`}>
            Configure live filters to discover the perfect apparel, tech carryovers, and premium writing tools.
          </p>
        </div>

        {/* Live Search & Sort Controls Ribbon */}
        <div className="flex flex-col md:flex-row gap-4 mb-6 items-center justify-between" id="shop-search-ribbon">
          {/* Live Search Input */}
          <div className="w-full md:max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search catalog... (e.g. Red Tee, Bottle, Beanie)"
              className={`w-full text-sm pl-10 pr-4 py-2.5 rounded-xl border focus:outline-hidden focus:ring-1 focus:ring-purple-500 ${
                isDark ? "bg-ai-surface border-ai-border text-white" : "bg-white border-zinc-300 text-zinc-900"
              }`}
              id="shop-search-input"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200"
                id="clear-search-btn"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex w-full md:w-auto items-center justify-between md:justify-end gap-3">
            {/* Mobile Sidebar Toggle */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`md:hidden flex items-center gap-2 text-xs font-semibold py-2.5 px-4 rounded-xl border cursor-pointer ${
                isDark ? "border-zinc-800 bg-zinc-900 text-zinc-300" : "border-zinc-200 bg-white text-zinc-700"
              }`}
              id="mobile-filter-toggle"
            >
              <SlidersHorizontal className="h-4 w-4" /> Filters
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className={`text-xs font-mono whitespace-nowrap ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className={`text-xs font-semibold py-2 px-3 rounded-lg border focus:outline-hidden focus:ring-1 focus:ring-purple-500 cursor-pointer ${
                  isDark ? "bg-ai-surface border-ai-border text-white" : "bg-white border-zinc-300 text-zinc-900"
                }`}
                id="shop-sort-dropdown"
              >
                <option value="featured">Featured Arrivals</option>
                <option value="bestselling">Bestselling Rank</option>
                <option value="price_low">Price: Low → High</option>
                <option value="price_high">Price: High → Low</option>
                <option value="top_rated">Top Customer Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Filter Chips row */}
        <div className="flex flex-wrap items-center gap-2 mb-6" id="filter-chips-row">
          {selectedCategories.map((cat) => (
            <span
              key={cat}
              className={`inline-flex items-center gap-1.5 py-1 px-3 rounded-lg text-xs font-semibold border ${
                isDark ? "bg-zinc-900 border-zinc-800 text-blue-400" : "bg-zinc-100 border-zinc-200 text-blue-600"
              }`}
              id={`chip-cat-${cat}`}
            >
              Category: {cat}
              <button onClick={() => removeCategoryChip(cat)} className="hover:text-rose-400 transition-colors cursor-pointer">
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}

          {maxPrice < 80 && (
            <span
              className={`inline-flex items-center gap-1.5 py-1 px-3 rounded-lg text-xs font-semibold border ${
                isDark ? "bg-zinc-900 border-zinc-800 text-blue-400" : "bg-zinc-100 border-zinc-200 text-blue-600"
              }`}
              id="chip-price"
            >
              Under ${maxPrice}
              <button onClick={() => setMaxPrice(80)} className="hover:text-rose-400 transition-colors cursor-pointer">
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {showOnlyOnSale && (
            <span
              className={`inline-flex items-center gap-1.5 py-1 px-3 rounded-lg text-xs font-semibold border ${
                isDark ? "bg-zinc-900 border-zinc-800 text-amber-400" : "bg-zinc-100 border-zinc-200 text-amber-600"
              }`}
              id="chip-sale"
            >
              On Sale Only
              <button onClick={() => setShowOnlyOnSale(false)} className="hover:text-rose-400 transition-colors cursor-pointer">
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {showOnlyNew && (
            <span
              className={`inline-flex items-center gap-1.5 py-1 px-3 rounded-lg text-xs font-semibold border ${
                isDark ? "bg-zinc-900 border-zinc-800 text-purple-400" : "bg-zinc-100 border-zinc-200 text-purple-600"
              }`}
              id="chip-new"
            >
              New Only
              <button onClick={() => setShowOnlyNew(false)} className="hover:text-rose-400 transition-colors cursor-pointer">
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {showOnlyWishlisted && (
            <span
              className={`inline-flex items-center gap-1.5 py-1 px-3 rounded-lg text-xs font-semibold border ${
                isDark ? "bg-zinc-900 border-zinc-800 text-rose-400" : "bg-zinc-100 border-zinc-200 text-rose-600"
              }`}
              id="chip-wishlist"
            >
              Wishlisted Only
              <button onClick={() => setShowOnlyWishlisted(false)} className="hover:text-rose-400 transition-colors cursor-pointer">
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {minRating > 0 && (
            <span
              className={`inline-flex items-center gap-1.5 py-1 px-3 rounded-lg text-xs font-semibold border ${
                isDark ? "bg-zinc-900 border-zinc-800 text-amber-400" : "bg-zinc-100 border-zinc-200 text-amber-600"
              }`}
              id="chip-rating"
            >
              {minRating}+ Stars
              <button onClick={() => setMinRating(0)} className="hover:text-rose-400 transition-colors cursor-pointer">
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {/* Clear button if any filter is active */}
          {(selectedCategories.length > 0 || maxPrice < 80 || showOnlyOnSale || showOnlyNew || showOnlyWishlisted || minRating > 0 || searchQuery !== "") && (
            <button
              onClick={clearAllFilters}
              className={`text-xs font-semibold py-1 px-3 rounded-lg transition-colors cursor-pointer ${
                isDark ? "text-zinc-400 hover:text-white hover:bg-zinc-800" : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200"
              }`}
              id="clear-all-filters-btn"
            >
              Clear All Filters
            </button>
          )}
        </div>

        <div className="flex gap-8" id="shop-workspace">
          
          {/* SIDEBAR FILTERS - Desktop (Visible above md) */}
          <aside
            className={`hidden md:block w-64 flex-shrink-0 p-6 rounded-2xl border ${
              isDark ? "bg-ai-surface border-ai-border text-ai-text" : "bg-white border-zinc-200 text-zinc-900"
            }`}
            id="desktop-filters-sidebar"
          >
            {/* Filters Section Header */}
            <div className="flex items-center gap-2 pb-4 mb-6 border-b border-zinc-800/10 dark:border-zinc-100/10">
              <SlidersHorizontal className="h-4 w-4 text-purple-400" />
              <h3 className="font-heading font-bold text-sm uppercase tracking-wide">Filter Options</h3>
            </div>

            {/* Categories */}
            <div className="mb-6">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 mb-3">Categories</h4>
              <div className="flex flex-col gap-2">
                {categories.map((cat) => (
                  <label key={cat} className="flex items-center gap-2.5 text-sm font-medium cursor-pointer" id={`label-cat-${cat}`}>
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat)}
                      onChange={() => toggleCategory(cat)}
                      className="rounded border-zinc-700 bg-zinc-900 text-purple-500 focus:ring-purple-500 h-4 w-4 cursor-pointer"
                    />
                    <span>{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Max Budget Slider */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500">Max Budget</h4>
                <span className="font-mono text-xs font-semibold text-blue-400">${maxPrice}</span>
              </div>
              <input
                type="range"
                min="4"
                max="80"
                step="2"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-400"
                id="desktop-price-slider"
              />
              <div className="flex items-center justify-between text-[10px] text-zinc-500 mt-1">
                <span>$4</span>
                <span>$80</span>
              </div>
            </div>

            {/* Badges / Exclusives */}
            <div className="mb-6 border-t border-zinc-800/10 dark:border-zinc-100/10 pt-5">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 mb-3">Campaigns</h4>
              <div className="flex flex-col gap-2.5">
                <label className="flex items-center gap-2.5 text-sm font-medium cursor-pointer" id="label-sale-only">
                  <input
                    type="checkbox"
                    checked={showOnlyOnSale}
                    onChange={(e) => setShowOnlyOnSale(e.target.checked)}
                    className="rounded border-zinc-700 bg-zinc-900 text-purple-500 focus:ring-purple-500 h-4 w-4 cursor-pointer"
                  />
                  <span className="text-amber-400">On Sale Only</span>
                </label>
                <label className="flex items-center gap-2.5 text-sm font-medium cursor-pointer" id="label-new-only">
                  <input
                    type="checkbox"
                    checked={showOnlyNew}
                    onChange={(e) => setShowOnlyNew(e.target.checked)}
                    className="rounded border-zinc-700 bg-zinc-900 text-purple-500 focus:ring-purple-500 h-4 w-4 cursor-pointer"
                  />
                  <span className="text-purple-400">New Arrivals Only</span>
                </label>
                <label className="flex items-center gap-2.5 text-sm font-medium cursor-pointer" id="label-wishlist-only">
                  <input
                    type="checkbox"
                    checked={showOnlyWishlisted}
                    onChange={(e) => setShowOnlyWishlisted(e.target.checked)}
                    className="rounded border-zinc-700 bg-zinc-900 text-purple-500 focus:ring-purple-500 h-4 w-4 cursor-pointer"
                  />
                  <span className="text-rose-400">Wishlisted Items</span>
                </label>
              </div>
            </div>

            {/* Ratings Checkbox */}
            <div className="border-t border-zinc-800/10 dark:border-zinc-100/10 pt-5">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 mb-3">Minimum Rating</h4>
              <div className="flex flex-col gap-2">
                {[4.8, 4.6, 4.4].map((ratingVal) => (
                  <label key={ratingVal} className="flex items-center gap-2.5 text-sm font-medium cursor-pointer" id={`label-rating-${ratingVal}`}>
                    <input
                      type="radio"
                      name="minRatingRadio"
                      checked={minRating === ratingVal}
                      onChange={() => setMinRating(ratingVal)}
                      className="rounded-full border-zinc-700 bg-zinc-900 text-purple-500 focus:ring-purple-500 h-4 w-4 cursor-pointer"
                    />
                    <span className="flex items-center gap-1">
                      {ratingVal}+ <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    </span>
                  </label>
                ))}
                <button
                  onClick={() => setMinRating(0)}
                  className={`text-left text-xs font-semibold mt-1 transition-colors cursor-pointer ${
                    minRating > 0 ? "text-purple-400 hover:text-purple-300" : "text-zinc-500"
                  }`}
                  disabled={minRating === 0}
                  id="reset-rating-btn"
                >
                  Show all ratings
                </button>
              </div>
            </div>
          </aside>

          {/* MOBILE SIDEBAR FILTER MODAL DRAWER */}
          {sidebarOpen && (
            <div className="fixed inset-0 z-50 md:hidden" id="mobile-filter-modal">
              {/* Backdrop */}
              <div onClick={() => setSidebarOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-xs" />
              
              {/* Slider drawer */}
              <div className={`absolute left-0 top-0 bottom-0 w-80 max-w-[85vw] p-6 flex flex-col justify-between overflow-y-auto ${
                isDark ? "bg-ai-surface text-ai-text" : "bg-white text-zinc-900"
              }`} id="mobile-filter-drawer-body">
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-zinc-800/10 dark:border-zinc-100/10 mb-6">
                    <h3 className="font-bold font-heading">Filter Catalog</h3>
                    <button onClick={() => setSidebarOpen(false)} className="p-1 cursor-pointer">
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Categories */}
                  <div className="mb-6">
                    <h4 className="text-xs font-mono font-bold uppercase text-zinc-500 mb-3">Categories</h4>
                    <div className="flex flex-col gap-2">
                      {categories.map((cat) => (
                        <label key={cat} className="flex items-center gap-2.5 text-sm font-medium cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedCategories.includes(cat)}
                            onChange={() => toggleCategory(cat)}
                            className="rounded border-zinc-700 bg-zinc-900 text-purple-500 focus:ring-purple-500 h-4 w-4 cursor-pointer"
                          />
                          <span>{cat}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-xs font-mono font-bold uppercase text-zinc-500">Max Budget</h4>
                      <span className="font-mono text-xs font-semibold text-blue-400">${maxPrice}</span>
                    </div>
                    <input
                      type="range"
                      min="4"
                      max="80"
                      step="2"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      className="w-full accent-blue-400"
                    />
                  </div>

                  {/* Badges */}
                  <div className="mb-6">
                    <h4 className="text-xs font-mono font-bold uppercase text-zinc-500 mb-3">Exclusives</h4>
                    <div className="flex flex-col gap-2.5">
                      <label className="flex items-center gap-2.5 text-sm font-medium cursor-pointer">
                        <input
                          type="checkbox"
                          checked={showOnlyOnSale}
                          onChange={(e) => setShowOnlyOnSale(e.target.checked)}
                          className="rounded border-zinc-700 bg-zinc-900 text-purple-500 focus:ring-purple-500 h-4 w-4 cursor-pointer"
                        />
                        <span className="text-amber-400">On Sale Only</span>
                      </label>
                      <label className="flex items-center gap-2.5 text-sm font-medium cursor-pointer">
                        <input
                          type="checkbox"
                          checked={showOnlyNew}
                          onChange={(e) => setShowOnlyNew(e.target.checked)}
                          className="rounded border-zinc-700 bg-zinc-900 text-purple-500 focus:ring-purple-500 h-4 w-4 cursor-pointer"
                        />
                        <span className="text-purple-400">New Only</span>
                      </label>
                      <label className="flex items-center gap-2.5 text-sm font-medium cursor-pointer">
                        <input
                          type="checkbox"
                          checked={showOnlyWishlisted}
                          onChange={(e) => setShowOnlyWishlisted(e.target.checked)}
                          className="rounded border-zinc-700 bg-zinc-900 text-purple-500 focus:ring-purple-500 h-4 w-4 cursor-pointer"
                        />
                        <span className="text-rose-400">Wishlisted Items</span>
                      </label>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setSidebarOpen(false)}
                  className="w-full bg-linear-to-r from-blue-500 via-purple-500 to-rose-500 text-white font-semibold py-3 rounded-xl mt-4 cursor-pointer"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}

          {/* CATALOG GRID - Main area */}
          <main className="flex-1" id="shop-catalog-main">
            {filteredProducts.length === 0 ? (
              <div
                className={`py-16 text-center rounded-2xl border ${
                  isDark ? "bg-ai-surface/20 border-ai-border text-ai-muted" : "bg-white border-zinc-200 text-zinc-500"
                }`}
                id="empty-results"
              >
                <Grid className="h-10 w-10 text-zinc-500 mx-auto mb-4" />
                <h3 className={`text-lg font-bold font-heading mb-1 ${isDark ? "text-zinc-300" : "text-zinc-800"}`}>No items match your filters</h3>
                <p className="text-xs mb-6 px-4">Try relaxing your search terms or expanding your maximum price constraints.</p>
                <button
                  onClick={clearAllFilters}
                  className="bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold py-2 px-5 rounded-lg transition-colors cursor-pointer"
                  id="reset-filters-empty-btn"
                >
                  Reset all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in" id="catalog-products-grid">
                {filteredProducts.map((product) => {
                  const isInWishlist = wishlistIds.includes(product.id);
                  const isAdded = addedItems[product.id];

                  return (
                    <div
                      key={product.id}
                      onClick={() => handleProductClick(product)}
                      className={`group rounded-2xl border p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer flex flex-col justify-between ${
                        isDark ? "bg-ai-surface border-ai-border hover:border-zinc-700 hover:shadow-black/25" : "bg-white border-zinc-200 hover:border-zinc-300"
                      }`}
                      id={`product-card-${product.id}`}
                    >
                      <div>
                        {/* Visual Placeholder Tile */}
                        <div
                          className="h-48 rounded-xl flex items-center justify-center relative overflow-hidden mb-4"
                          style={{ background: product.gradient }}
                          id={`product-tile-${product.id}`}
                        >
                          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).style.display = "none";
                              }}
                            />
                          ) : (
                            <span className="text-5xl filter drop-shadow-md group-hover:scale-110 transition-transform duration-300">
                              {product.icon}
                            </span>
                          )}

                          {/* Bestseller Rank badge if applicable */}
                          {product.rank && product.rank <= 3 && (
                            <span className="absolute top-3 left-3 bg-zinc-950/80 backdrop-blur-xs border border-zinc-800 text-white font-mono text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-0.5 z-10">
                              <span className="gemini-gradient-text font-black">#</span>
                              {product.rank} Best
                            </span>
                          )}

                          {/* Sale/New Badge */}
                          {product.badge && (
                            <span className="absolute top-3 right-3 bg-amber-500 text-zinc-950 font-sans text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider shadow-sm">
                              {product.badge}
                            </span>
                          )}
                        </div>

                        {/* Title & category */}
                        <div className="flex items-center gap-1 mb-1" id={`product-rating-${product.id}`}>
                          <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                          <span className="text-xs font-bold">{product.rating}</span>
                          <span className={`text-[10px] ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>({product.reviewCount})</span>
                        </div>

                        <h3 className={`font-bold font-heading text-sm leading-snug group-hover:text-blue-400 transition-colors ${isDark ? "text-ai-text" : "text-zinc-900"}`}>
                          {product.name}
                        </h3>
                        <p className={`text-xs mt-1 leading-snug line-clamp-2 ${isDark ? "text-ai-muted" : "text-zinc-500"}`}>
                          {product.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-zinc-800/10 dark:border-zinc-100/10">
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-mono text-sm sm:text-base font-semibold text-blue-400" id={`product-price-${product.id}`}>
                            ${product.price}
                          </span>
                          {product.originalPrice && (
                            <span className={`font-mono text-xs line-through ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
                              ${product.originalPrice}
                            </span>
                          )}
                        </div>

                        <div className="flex gap-1.5">
                          {/* Wishlist */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onAddToWishlist(product);
                            }}
                            className={`p-2 rounded-lg transition-colors border cursor-pointer ${
                              isInWishlist
                                ? "bg-rose-500/10 border-rose-500/30 text-rose-500"
                                : isDark
                                ? "border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-400"
                                : "border-zinc-300 bg-zinc-100 hover:bg-zinc-200 text-zinc-600"
                            }`}
                            aria-label="Add to wishlist"
                            id={`product-wishlist-btn-${product.id}`}
                          >
                            <Heart className="h-3.5 w-3.5" fill={isInWishlist ? "currentColor" : "none"} />
                          </button>

                          {/* Quick Add Cart */}
                          <button
                            onClick={(e) => handleQuickAdd(product, e)}
                            className={`p-2 rounded-lg transition-all cursor-pointer ${
                              isAdded
                                ? "bg-emerald-600 text-white"
                                : isDark
                                ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
                                : "bg-zinc-200 hover:bg-zinc-300 text-zinc-800"
                            }`}
                            aria-label="Add to cart"
                            id={`product-cart-btn-${product.id}`}
                          >
                            {isAdded ? <Check className="h-3.5 w-3.5" /> : <ShoppingCart className="h-3.5 w-3.5" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </main>

        </div>
      </div>
    </div>
  );
};
export default ShopView;
