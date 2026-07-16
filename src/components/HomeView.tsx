import React, { useState, useEffect } from "react";
import { Sparkles, ArrowRight, Star, Heart, ShoppingCart, Check, Percent } from "lucide-react";
import { Product } from "../types";
import { PRODUCTS } from "../data";
import { trackViewItemList, trackSelectItem, trackSelectPromotion } from "../utils/analytics";
import { motion } from "motion/react";

interface HomeViewProps {
  onPageChange: (page: string) => void;
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product, size?: string, color?: string) => void;
  onAddToWishlist: (product: Product) => void;
  wishlistIds: string[];
  cartIds: string[];
  recentlyViewedIds: string[];
  theme: "dark" | "light";
}

export const HomeView: React.FC<HomeViewProps> = ({
  onPageChange,
  onProductClick,
  onAddToCart,
  onAddToWishlist,
  wishlistIds,
  cartIds,
  recentlyViewedIds,
  theme,
}) => {
  const [region, setRegion] = useState<"US" | "India">("US");
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});

  // Live countdown timer state (counts down to 5 days from today's date context)
  const [timeLeft, setTimeLeft] = useState({ days: 3, hours: 14, minutes: 28, seconds: 45 });

  useEffect(() => {
    // Fire view item list for home page bestseller section on mount
    const bestsellers = PRODUCTS.filter((p) => p.rank && p.rank <= 3);
    trackViewItemList(bestsellers, "Home Page Bestsellers");

    // Live Ticking Clock
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        } else {
          clearInterval(timer);
          return prev;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleProductClick = (product: Product, listName: string) => {
    trackSelectItem(product, listName);
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

  const handlePromoBannerClick = () => {
    trackSelectPromotion("promo_shopweek15", "Smart Shopping Week Banner", "home_hero_campaign");
    onPageChange("shop");
  };

  // Adaptive recommendation system based on region & user history (cart, wishlist, viewed)
  const getAdaptiveRecommendations = (): Product[] => {
    // 1. Gather categoric interests
    const interestedCategories = new Set<string>();
    
    // Add categories from wishlist
    PRODUCTS.filter(p => wishlistIds.includes(p.id)).forEach(p => interestedCategories.add(p.category));
    // Add categories from cart
    PRODUCTS.filter(p => cartIds.includes(p.id)).forEach(p => interestedCategories.add(p.category));
    // Add categories from recently viewed
    PRODUCTS.filter(p => recentlyViewedIds.includes(p.id)).forEach(p => interestedCategories.add(p.category));

    // 2. Score remaining products
    const candidates = PRODUCTS.filter(p => !cartIds.includes(p.id)); // recommend items not yet in cart

    const scored = candidates.map(product => {
      let score = 0;

      // Category matching
      if (interestedCategories.has(product.category)) {
        score += 5;
      }

      // Region-based weights
      if (region === "US") {
        // US developers love premium fleece & functional gear
        if (["Apparel", "Tech", "Bags"].includes(product.category)) score += 3;
        if (product.name === "Google Campus Hoodie") score += 2;
        if (product.name === "AI Studio Laptop Sleeve") score += 2;
      } else {
        // India developers love sturdy drinkware & notebooks
        if (["Drinkware", "Accessories", "Stickers"].includes(product.category)) score += 3;
        if (product.name === "Gemini Spark Water Bottle") score += 2;
        if (product.name === "Gemini Gradient Notebook") score += 2;
      }

      // Popularity boosts
      if (product.badge === "New") score += 1;
      if (product.badge === "Bestseller") score += 2;

      return { product, score };
    });

    // Sort by highest score and pick top 4
    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .map(item => item.product);
  };

  const bestsellers = PRODUCTS.filter((p) => p.rank && p.rank <= 3).sort((a, b) => (a.rank || 0) - (b.rank || 0));
  const recommendedItems = getAdaptiveRecommendations();
  const isDark = theme === "dark";

  return (
    <div className={`transition-colors duration-300 ${isDark ? "bg-ai-bg text-ai-text" : "bg-zinc-50 text-zinc-900"}`} id="home-view">
      
      {/* Top Promo Strip */}
      <div className="bg-linear-to-r from-blue-600 via-purple-600 to-rose-600 text-white text-center py-2.5 px-4 text-xs font-semibold tracking-wide flex items-center justify-center gap-2 relative overflow-hidden" id="home-promo-strip">
        <Percent className="h-3.5 w-3.5 animate-bounce-slow" />
        <span>Smart Shopping Week — 15% off sitewide + free shipping with code <strong className="font-sans bg-white/20 px-1.5 py-0.5 rounded ml-1 font-bold">SHOPWEEK15</strong></span>
      </div>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 sm:pt-16 sm:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden" id="home-hero">
        {/* Soft Background Spark Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-radial from-purple-500/10 via-blue-500/5 to-transparent rounded-full spark-glow pointer-events-none" />

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full border border-zinc-800 bg-zinc-900/40 text-xs font-sans text-zinc-300 mb-6 shadow-xs"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Vibe Shift: The Studio Collection
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl font-bold font-heading tracking-tight leading-tight mb-6"
            id="hero-title"
          >
            The New <span className="gemini-gradient-text font-extrabold">Google Merch Store</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className={`text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed ${isDark ? "text-ai-muted" : "text-zinc-600"}`}
            id="hero-subtitle"
          >
            An elite redesign merging official Google developer merchandise with the dark-mode-first aesthetic of Google AI Studio. Streamlined, responsive, and tailored to your region.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
            id="hero-ctas"
          >
            <button
              onClick={() => onPageChange("shop")}
              className="w-full sm:w-auto flex items-center justify-center gap-2 text-sm font-semibold text-white bg-linear-to-r from-blue-500 via-purple-500 to-rose-500 hover:opacity-95 transition-opacity py-3.5 px-8 rounded-xl shadow-lg cursor-pointer font-heading"
              id="hero-primary-cta"
            >
              Shop Collections <ArrowRight className="h-4 w-4" />
            </button>
            <a
              href="#bestsellers"
              className={`w-full sm:w-auto text-sm font-semibold py-3.5 px-8 rounded-xl border transition-colors flex items-center justify-center gap-2 cursor-pointer font-heading ${
                isDark ? "border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-300" : "border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-700"
              }`}
              id="hero-secondary-cta"
            >
              See Bestsellers
            </a>
          </motion.div>

          {/* Stat Row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className={`grid grid-cols-3 gap-4 max-w-xl mx-auto py-6 px-4 rounded-xl border text-center ${
              isDark ? "border-zinc-800 bg-zinc-900/20" : "border-zinc-200 bg-white"
            }`}
            id="hero-stats-row"
          >
            <div>
              <div className="text-xl sm:text-2xl font-bold font-sans text-blue-400">4.88★</div>
              <div className={`text-[10px] sm:text-xs uppercase mt-1 ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>Avg Satisfaction</div>
            </div>
            <div className={`border-x ${isDark ? "border-zinc-800" : "border-zinc-200"}`}>
              <div className="text-xl sm:text-2xl font-bold font-sans text-purple-400">42,000+</div>
              <div className={`text-[10px] sm:text-xs uppercase mt-1 ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>Orders Shipped</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold font-sans text-rose-400">-15%</div>
              <div className={`text-[10px] sm:text-xs uppercase mt-1 ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>SHOPWEEK15 Code</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bestsellers Section */}
      <section className={`py-16 sm:py-20 border-y ${isDark ? "border-ai-border/40" : "border-zinc-200"}`} id="bestsellers">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 text-center sm:text-left">
            <div>
              <span className="text-xs font-sans font-bold text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-full uppercase tracking-wider">
                Trending High
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-heading mt-2">Ranked Store Bestsellers</h2>
            </div>
            <button
              onClick={() => onPageChange("shop")}
              className="text-sm font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
              id="view-all-bestsellers-btn"
            >
              Browse complete catalog <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" id="bestsellers-grid">
            {bestsellers.map((product) => {
              const isInWishlist = wishlistIds.includes(product.id);
              const isAdded = addedItems[product.id];

              return (
                <div
                  key={product.id}
                  onClick={() => handleProductClick(product, "Home Page Bestsellers")}
                  className={`group relative rounded-2xl border p-4 transition-all duration-300 hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between ${
                    isDark ? "bg-ai-surface border-ai-border hover:border-zinc-700 hover:shadow-lg hover:shadow-black/20" : "bg-white border-zinc-200 hover:border-zinc-300 hover:shadow-md"
                  }`}
                  id={`bestseller-card-${product.id}`}
                >
                  <div>
                    {/* Visual Placeholder Tile */}
                    <div
                      className="h-56 rounded-xl flex items-center justify-center relative overflow-hidden mb-4"
                      style={{ background: product.gradient }}
                      id={`bestseller-tile-${product.id}`}
                    >
                      <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <span className="text-6xl filter drop-shadow-md group-hover:scale-110 transition-transform duration-300">
                          {product.icon}
                        </span>
                      )}

                      {/* Rank Indicator Badge */}
                      <span className="absolute top-3 left-3 bg-zinc-950/80 backdrop-blur-md border border-zinc-800 text-white font-mono text-xs font-extrabold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-sm z-10">
                        <span className="gemini-gradient-text font-black">#</span>
                        {product.rank}
                      </span>

                      {/* Sale/New Indicator */}
                      {product.badge && (
                        <span className="absolute top-3 right-3 bg-amber-500 text-zinc-950 font-sans text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider shadow-sm">
                          {product.badge}
                        </span>
                      )}
                    </div>

                    {/* Metadata */}
                    <div className="flex items-center gap-1 mb-1" id={`bestseller-rating-${product.id}`}>
                      <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                      <span className="text-xs font-bold">{product.rating}</span>
                      <span className={`text-[10px] ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>({product.reviewCount})</span>
                    </div>

                    <h3 className={`font-bold font-heading text-base leading-snug group-hover:text-blue-400 transition-colors ${isDark ? "text-ai-text" : "text-zinc-900"}`}>
                      {product.name}
                    </h3>
                    <p className={`text-xs mt-1.5 leading-relaxed line-clamp-2 ${isDark ? "text-ai-muted" : "text-zinc-500"}`}>
                      {product.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-zinc-800/10 dark:border-zinc-100/10">
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-mono text-base font-semibold text-blue-400" id={`bestseller-price-${product.id}`}>
                        ${product.price}
                      </span>
                      {product.originalPrice && (
                        <span className={`font-mono text-xs line-through ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
                          ${product.originalPrice}
                        </span>
                      )}
                    </div>

                    <div className="flex gap-1.5">
                      {/* Wishlist Icon */}
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
                        id={`bestseller-wishlist-btn-${product.id}`}
                      >
                        <Heart className="h-4 w-4" fill={isInWishlist ? "currentColor" : "none"} />
                      </button>

                      {/* Add to Cart Icon Button */}
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
                        id={`bestseller-cart-btn-${product.id}`}
                      >
                        {isAdded ? <Check className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Smart Shopping Campaign Countdown Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16" id="home-campaign-banner">
        <div
          onClick={handlePromoBannerClick}
          className={`relative rounded-2xl overflow-hidden p-8 sm:p-12 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8 cursor-pointer group transition-all duration-300 ${
            isDark
              ? "bg-linear-to-r from-slate-950 via-[#13111C] to-slate-950 border border-purple-500/20 hover:border-purple-500/40"
              : "bg-linear-to-r from-purple-50 via-indigo-50/50 to-purple-50 border border-purple-200 hover:border-purple-300"
          }`}
        >
          {/* Animated Background Mesh */}
          <div className={`absolute inset-0 bg-radial via-transparent to-transparent opacity-60 group-hover:scale-105 transition-transform ${
            isDark ? "from-purple-500/10" : "from-purple-500/5"
          }`} />

          <div className="relative z-10 max-w-xl text-center lg:text-left">
            <span className="inline-flex items-center gap-1 py-1 px-3 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-sans text-amber-400 font-bold mb-4 uppercase">
              Limited-Time Sprint
            </span>
            <h2 className={`text-3xl sm:text-4xl font-bold font-heading leading-tight mb-4 ${isDark ? "text-white" : "text-zinc-900"}`}>
              Smart Shopping Week <br />
              <span className="gemini-gradient-text font-black">15% Sitewide Discount</span>
            </h2>
            <p className={`text-sm mb-2 leading-relaxed ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
              We are celebrating developer productivity around the world. Copy coupon <span className="font-sans text-amber-400 font-bold">SHOPWEEK15</span> and paste it in your cart summary for automatic sitewide reduction + zero shipping fees.
            </p>
            <p className={`text-xs font-sans ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
              *Applies to orders dispatched to both United States and India express logistics nodes.
            </p>
          </div>

          {/* Countdown Clock Panel */}
          <div className="relative z-10 flex flex-col items-center gap-4 flex-shrink-0" id="campaign-countdown">
            <div className="flex gap-2 sm:gap-3">
              {[
                { label: "Days", value: timeLeft.days },
                { label: "Hrs", value: timeLeft.hours },
                { label: "Min", value: timeLeft.minutes },
                { label: "Sec", value: timeLeft.seconds },
              ].map((c, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className={`w-14 sm:w-16 h-14 sm:h-16 rounded-xl flex items-center justify-center font-mono text-xl sm:text-2xl font-bold shadow-md transition-colors duration-300 ${
                    isDark
                      ? "bg-zinc-900/90 border border-zinc-800 text-white"
                      : "bg-white border border-purple-100 text-purple-900"
                  }`}>
                    {String(c.value).padStart(2, "0")}
                  </div>
                  <span className={`text-[10px] sm:text-xs mt-1.5 font-semibold font-sans ${
                    isDark ? "text-zinc-500" : "text-purple-600"
                  }`}>
                    {c.label}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePromoBannerClick();
              }}
              className={`w-full mt-3 font-heading font-semibold text-xs sm:text-sm py-2.5 px-6 rounded-xl transition-colors shadow-lg cursor-pointer ${
                isDark
                  ? "bg-white hover:bg-zinc-200 text-zinc-950"
                  : "bg-purple-600 hover:bg-purple-700 text-white"
              }`}
              id="countdown-cta-btn"
            >
              Shop the Campaign
            </button>
          </div>
        </div>
      </section>

      {/* Regional & Adaptive Recommendations Section */}
      <section className={`py-16 border-t ${isDark ? "border-ai-border/40" : "border-zinc-200"}`} id="personalized-recommendations">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10 text-center md:text-left">
            <div>
              <span className="text-xs font-sans font-bold text-blue-500 bg-blue-500/10 px-2.5 py-1 rounded-full uppercase tracking-wider">
                Personalized Hub
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-heading mt-2">Recommended for You</h2>
              <p className={`text-xs mt-1 ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
                Adapting automatically based on your local navigation history and geographic preferences.
              </p>
            </div>

            {/* Region Toggle Buttons */}
            <div className={`p-1 rounded-xl border flex items-center gap-1 ${isDark ? "bg-zinc-900/50 border-zinc-800" : "bg-zinc-100 border-zinc-200"}`} id="region-selector">
              <button
                onClick={() => setRegion("US")}
                className={`py-1.5 px-4 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  region === "US"
                    ? isDark
                      ? "bg-zinc-800 text-white"
                      : "bg-white text-zinc-950 shadow-xs font-bold"
                    : isDark
                    ? "text-zinc-500 hover:text-zinc-300"
                    : "text-zinc-500 hover:text-zinc-800"
                }`}
                id="region-btn-us"
              >
                🇺🇸 United States
              </button>
              <button
                onClick={() => setRegion("India")}
                className={`py-1.5 px-4 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  region === "India"
                    ? isDark
                      ? "bg-zinc-800 text-white"
                      : "bg-white text-zinc-950 shadow-xs font-bold"
                    : isDark
                    ? "text-zinc-500 hover:text-zinc-300"
                    : "text-zinc-500 hover:text-zinc-800"
                }`}
                id="region-btn-india"
              >
                🇮🇳 India Setup
              </button>
            </div>
          </div>

          {/* Regional Copy block banner */}
          <div className={`p-5 rounded-xl border mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${isDark ? "bg-zinc-900/25 border-zinc-800" : "bg-zinc-50 border-zinc-200"}`} id="recommendations-region-info">
            <div className="max-w-2xl">
              <h4 className={`text-sm font-bold font-heading ${isDark ? "text-zinc-200" : "text-zinc-900"}`}>
                {region === "US" ? "Mountain View & Silicon Valley Core Catalog" : "Bengaluru & Hyderabad Tech Hub Curation"}
              </h4>
              <p className={`text-xs mt-1 leading-relaxed ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                {region === "US"
                  ? "Premium developer merchandise optimized for professional workspace aesthetics and corporate sprints. Dispatched from direct Pacific logistics centers with local next-day shipping priority."
                  : "Sturdy, highly useful developer tools and drinkware custom selected for high-productivity setups in India's leading tech centers. Complete custom duties integration and fast subcontinent courier networks."}
              </p>
            </div>
            <span className="text-[10px] font-sans uppercase bg-linear-to-r from-blue-500/10 to-rose-500/10 border border-purple-500/20 text-purple-400 font-bold py-1 px-2.5 rounded-full self-start sm:self-auto">
              {region === "US" ? "US Standard Dispatch" : "India Express Hub"}
            </span>
          </div>

          {/* Recommended Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12" id="recommended-grid">
            {recommendedItems.map((product) => {
              const isInWishlist = wishlistIds.includes(product.id);
              const isAdded = addedItems[product.id];

              return (
                <div
                  key={product.id}
                  onClick={() => handleProductClick(product, "Personalized Recommendations")}
                  className={`group relative rounded-xl border p-3.5 transition-all duration-300 hover:shadow-md cursor-pointer flex flex-col justify-between ${
                    isDark ? "bg-ai-surface/60 border-ai-border hover:border-zinc-700 text-ai-text" : "bg-white border-zinc-200 hover:border-zinc-300 text-zinc-950"
                  }`}
                  id={`recommended-card-${product.id}`}
                >
                  <div>
                    {/* Visual Placeholder Tile */}
                    <div
                      className="h-36 sm:h-44 rounded-lg flex items-center justify-center relative overflow-hidden mb-3"
                      style={{ background: product.gradient }}
                      id={`rec-tile-${product.id}`}
                    >
                      <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <span className="text-4xl filter drop-shadow-sm group-hover:scale-105 transition-transform duration-300">
                          {product.icon}
                        </span>
                      )}
                    </div>

                    <h3 className={`font-semibold font-heading text-xs sm:text-sm line-clamp-1 group-hover:text-blue-400 transition-colors`}>
                      {product.name}
                    </h3>
                    <p className={`text-[10px] sm:text-xs font-mono uppercase tracking-wider mt-1 ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
                      {product.category}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-1 mt-3 pt-2.5 border-t border-zinc-800/10 dark:border-zinc-100/10">
                    <span className="font-mono text-xs sm:text-sm font-semibold text-blue-400">
                      ${product.price}
                    </span>

                    <div className="flex gap-1">
                      {/* Wishlist */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToWishlist(product);
                        }}
                        className={`p-1.5 rounded-md transition-colors border cursor-pointer ${
                          isInWishlist
                            ? "bg-rose-500/10 border-rose-500/30 text-rose-500"
                            : isDark
                            ? "border-zinc-800 bg-zinc-900 text-zinc-400"
                            : "border-zinc-300 bg-zinc-100 text-zinc-600"
                        }`}
                        aria-label="Add to wishlist"
                        id={`rec-wishlist-${product.id}`}
                      >
                        <Heart className="h-3.5 w-3.5" fill={isInWishlist ? "currentColor" : "none"} />
                      </button>

                      {/* Add to Cart */}
                      <button
                        onClick={(e) => handleQuickAdd(product, e)}
                        className={`p-1.5 rounded-md transition-all cursor-pointer ${
                          isAdded
                            ? "bg-emerald-600 text-white animate-pulse"
                            : isDark
                            ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
                            : "bg-zinc-200 hover:bg-zinc-300 text-zinc-800"
                        }`}
                        aria-label="Add to cart"
                        id={`rec-cart-${product.id}`}
                      >
                        {isAdded ? <Check className="h-3.5 w-3.5" /> : <ShoppingCart className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className={`py-16 sm:py-20 border-t ${isDark ? "border-ai-border/40" : "border-zinc-200"}`} id="customer-reviews">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-sans font-bold text-purple-500 bg-purple-500/10 px-2.5 py-1 rounded-full uppercase tracking-wider">
              Testimonials
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-heading mt-2">What Developers are Saying</h2>
            <p className={`text-sm mt-2 ${isDark ? "text-ai-muted" : "text-zinc-500"}`}>
              Verified buyers and engineers sharing their experiences with our premium AI Studio redesign line.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="reviews-grid">
            {[
              {
                name: "Ananya Iyer",
                location: "Bengaluru, India",
                rating: 5,
                quote: "The Gemini Hologram Stickers look incredibly sleek on my dev laptop! Delivery to Bengaluru took only 3 days and there were absolutely no customs headaches. A premium product all around.",
              },
              {
                name: "Preston Cole",
                location: "Austin, USA",
                rating: 5,
                quote: "Bought the Google Campus Hoodie and Gemini Spark Water bottle. The fabric feels robust, heavyweight, and perfect for freezing office AC. Safe shopping and immediate tracking, love the AI Studio vibe.",
              },
              {
                name: "Kabir Mehta",
                location: "New Delhi, India",
                rating: 5,
                quote: "I am super impressed with the Pixel Blue Mug and Noogler Beanie. The glaze finish on the stoneware is artisan quality and the customer support team responded to my tracking inquiry in ten minutes.",
              },
            ].map((rev, idx) => (
              <div
                key={idx}
                className={`p-6 rounded-2xl border flex flex-col justify-between ${
                  isDark ? "bg-ai-surface border-ai-border" : "bg-white border-zinc-200"
                }`}
                id={`customer-review-card-${idx}`}
              >
                <div>
                  {/* Stars */}
                  <div className="flex items-center gap-0.5 mb-4 text-amber-400" id={`review-stars-${idx}`}>
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400" />
                    ))}
                  </div>
                  <blockquote className={`text-sm italic leading-relaxed mb-6 ${isDark ? "text-zinc-300" : "text-zinc-600"}`}>
                    "{rev.quote}"
                  </blockquote>
                </div>
                <div className="flex items-center gap-3 border-t border-zinc-800/10 dark:border-zinc-100/10 pt-4" id={`review-author-${idx}`}>
                  <div className="w-10 h-10 rounded-full bg-linear-to-r from-blue-500 to-rose-500 flex items-center justify-center font-bold text-sm text-white">
                    {rev.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <cite className={`not-italic font-bold text-sm block ${isDark ? "text-ai-text" : "text-zinc-900"}`}>{rev.name}</cite>
                    <span className={`text-[10px] font-sans ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>{rev.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

    </div>
  );
};
export default HomeView;
