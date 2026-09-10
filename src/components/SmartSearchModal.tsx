import React, { useState, useEffect, useRef } from "react";
import { Search, X, Sparkles, SlidersHorizontal, ArrowRight } from "lucide-react";
import { Product, CurrencyCode } from "../types";
import { executeSmartSearch } from "../utils/recommendations";
import { ProductCard } from "./ProductCard";
import { trackSearch } from "../utils/analytics";

interface SmartSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
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

const SEARCH_SUGGESTIONS = [
  "gifts under 2000",
  "something for my desk",
  "minimal Google merch",
  "gift for a tech friend",
  "travel products",
  "cozy hoodies & beanies",
  "developer stationery",
];

export const SmartSearchModal: React.FC<SmartSearchModalProps> = ({
  isOpen,
  onClose,
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
  if (!isOpen) return null;

  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const isDark = theme === "dark";

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Debounced search tracking
  useEffect(() => {
    if (!query) return;
    const timer = setTimeout(() => {
      trackSearch(query);
    }, 800);
    return () => clearTimeout(timer);
  }, [query]);

  const { results, appliedFilters } = executeSmartSearch(query);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
      id="smart-search-overlay"
    >
      <div
        className={`w-full max-w-4xl max-h-[85vh] flex flex-col rounded-3xl overflow-hidden border shadow-2xl ${
          isDark ? "bg-zinc-900 border-zinc-800 text-white" : "bg-white border-zinc-200 text-zinc-900"
        }`}
        onClick={(e) => e.stopPropagation()}
        id="smart-search-dialog"
      >
        {/* Search Input Header */}
        <div className="p-4 sm:p-6 border-b border-zinc-800/80 flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-400 flex items-center justify-center shrink-0">
            <Search className="w-5 h-5" />
          </div>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Try natural search: 'gifts under 2000', 'desk items', 'minimal tech hoodie'..."
            className={`w-full bg-transparent border-none text-base sm:text-lg focus:outline-none placeholder-zinc-500 font-medium ${
              isDark ? "text-white" : "text-zinc-900"
            }`}
            id="smart-search-input"
          />

          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-zinc-400 hover:text-white p-1 text-xs"
            >
              Clear
            </button>
          )}

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-300 transition-colors shrink-0"
            id="btn-close-smart-search"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Suggestion Chips */}
        <div className="px-6 py-3 border-b border-zinc-800/50 bg-zinc-950/20 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
          <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-blue-400" />
            <span>Try:</span>
          </span>
          {SEARCH_SUGGESTIONS.map((sug) => (
            <button
              key={sug}
              onClick={() => setQuery(sug)}
              className="px-3 py-1 rounded-full text-xs bg-zinc-800/70 hover:bg-zinc-700 text-zinc-300 whitespace-nowrap transition-colors border border-zinc-700/60"
            >
              {sug}
            </button>
          ))}
        </div>

        {/* Inferred Filters Chips (if user typed something) */}
        {query && (
          <div className="px-6 py-2 bg-blue-950/20 border-b border-blue-900/30 flex items-center gap-2 text-xs text-blue-300 shrink-0">
            <SlidersHorizontal className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span className="font-semibold">AI Inferred Intent:</span>
            {appliedFilters.maxPrice && (
              <span className="px-2 py-0.5 rounded-md bg-blue-500/20 border border-blue-500/30 font-medium">
                Max Price: ${appliedFilters.maxPrice.toFixed(0)}
              </span>
            )}
            {appliedFilters.inferredUseCase && (
              <span className="px-2 py-0.5 rounded-md bg-purple-500/20 border border-purple-500/30 font-medium">
                Use Case: {appliedFilters.inferredUseCase}
              </span>
            )}
            {appliedFilters.inferredStyle && (
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-500/30 font-medium">
                Style: {appliedFilters.inferredStyle}
              </span>
            )}
            {appliedFilters.inferredCategory && (
              <span className="px-2 py-0.5 rounded-md bg-amber-500/20 border border-amber-500/30 font-medium">
                Category: {appliedFilters.inferredCategory}
              </span>
            )}
          </div>
        )}

        {/* Results Body */}
        <div className="p-6 overflow-y-auto flex-grow">
          {!query ? (
            <div className="py-12 text-center text-zinc-400">
              <Search className="w-10 h-10 mx-auto text-zinc-600 mb-3" />
              <h3 className="text-base font-bold mb-1">Search the Google Merch Lab</h3>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                Type natural phrases including your budget, desired room or desk setting, or specific aesthetic preference.
              </p>
            </div>
          ) : results.length === 0 ? (
            <div className="py-12 text-center text-zinc-400">
              <p className="text-sm font-semibold mb-1">No exact matches found for "{query}".</p>
              <p className="text-xs text-zinc-500">Try broadening your search or adjusting your price threshold.</p>
            </div>
          ) : (
            <div>
              <div className="text-xs font-semibold text-zinc-400 mb-4">
                Found <strong className="text-zinc-200">{results.length}</strong> matching products
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    currency={currency}
                    isWishlisted={wishlistIds.includes(product.id)}
                    isCompared={compareIds.includes(product.id)}
                    onProductClick={(p) => {
                      onClose();
                      onProductClick(p);
                    }}
                    onAddToCart={onAddToCart}
                    onToggleWishlist={onToggleWishlist}
                    onToggleCompare={onToggleCompare}
                    onQuickView={(p) => {
                      onClose();
                      onQuickView(p);
                    }}
                    theme={theme}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
