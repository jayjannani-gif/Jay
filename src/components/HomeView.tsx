import React, { useState, useEffect, useRef } from "react";
import { Sparkles, ArrowRight, Star, Heart, ShoppingCart, Check, Percent, ChevronLeft, ChevronRight, Copy, Gift, Layers, Flame, Zap, Clock } from "lucide-react";
import { Product } from "../types";
import { PRODUCTS } from "../data";
import { trackViewItemList, trackSelectItem, trackSelectPromotion } from "../utils/analytics";
import { motion, AnimatePresence } from "motion/react";

interface HomeViewProps {
  onPageChange: (page: string) => void;
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product, size?: string, color?: string) => void;
  onAddToWishlist: (product: Product) => void;
  wishlistIds: string[];
  cartIds: string[];
  recentlyViewedIds: string[];
  theme: "dark" | "light";
  onApplyCoupon: (code: string) => void;
  couponCode: string;
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
  onApplyCoupon,
  couponCode,
}) => {
  const [region, setRegion] = useState<"US" | "India">("US");
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});
  
  // Top Campaign Slider (Poster Slider) State
  const [topActiveSlide, setTopActiveSlide] = useState(0);
  const [topSuccessMessage, setTopSuccessMessage] = useState<string | null>(null);
  const topAutoplayTimerRef = useRef<NodeJS.Timeout | null>(null);

  const TOP_SLIDES = [
    {
      id: "sustainable",
      title: "The Sustainable Choice Bundle",
      tagline: "Eco-Friendly Developer Gear",
      description: "A premium, eco-conscious collection featuring our classic Google Eco Tote Bag with a dynamic gemstone-faceted Google G logo, coupled with the Gemini Spark bamboo-glass water bottle.",
      badge: "Sustainable Edition",
      price: "$68.00",
      originalPrice: "$88.00",
      image: "/assets/images/sustainable_bundle_poster_1784181177171.jpg",
      buttonColor: "bg-emerald-600 hover:bg-emerald-500 border-emerald-600 focus:ring-emerald-500/50",
      actionText: "Claim Sustainable Combo",
      onClick: () => {
        const tote = PRODUCTS.find((p) => p.name.toLowerCase().includes("tote")) || PRODUCTS[0];
        const bottle = PRODUCTS.find((p) => p.name.toLowerCase().includes("bottle")) || PRODUCTS[1];
        onAddToCart(tote, undefined, undefined);
        onAddToCart(bottle, undefined, "Obsidian Spark");
        setTopSuccessMessage("Added Sustainable Bundle to your cart!");
        setTimeout(() => setTopSuccessMessage(null), 3500);
      }
    },
    {
      id: "discount",
      title: "The Discount Week Bundle",
      tagline: "Official Developer R&D Lab Merch",
      description: "Step up your setup: the professional Cloud Backpack, our comfortable Google Campus Hoodie, and the official Wordmark Cap. Apply SHOPWEEK15 for an instant 15% discount!",
      badge: "Flash Deal Bundle",
      price: "$98.00",
      originalPrice: "$124.00",
      image: "/assets/images/discount_bundle_poster_1784181190493.jpg",
      buttonColor: "bg-red-600 hover:bg-red-500 border-red-600 focus:ring-red-500/50",
      actionText: "Apply SHOPWEEK15 & Buy Bundle",
      onClick: () => {
        onApplyCoupon("SHOPWEEK15");
        const backpack = PRODUCTS.find((p) => p.name.toLowerCase().includes("backpack")) || PRODUCTS[0];
        const hoodie = PRODUCTS.find((p) => p.name.toLowerCase().includes("hoodie")) || PRODUCTS[1];
        const cap = PRODUCTS.find((p) => p.name.toLowerCase().includes("cap")) || PRODUCTS[2];
        onAddToCart(backpack, undefined, undefined);
        onAddToCart(hoodie, undefined, undefined);
        onAddToCart(cap, undefined, undefined);
        setTopSuccessMessage("Coupon applied & Bundle added to cart!");
        setTimeout(() => setTopSuccessMessage(null), 3500);
      }
    }
  ];

  // Slide Carousel State
  const [activeSlide, setActiveSlide] = useState(0);
  const [isCopied, setIsCopied] = useState(false);
  const totalSlides = 3;
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);

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

  // Autoplay and controls for the promotional slider
  useEffect(() => {
    autoplayTimerRef.current = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % totalSlides);
    }, 7500);
    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
      }
    };
  }, []);

  const resetAutoplay = () => {
    if (autoplayTimerRef.current) {
      clearInterval(autoplayTimerRef.current);
    }
    autoplayTimerRef.current = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % totalSlides);
    }, 7500);
  };

  const handlePrevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
    resetAutoplay();
  };

  const handleNextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveSlide((prev) => (prev + 1) % totalSlides);
    resetAutoplay();
  };

  const handleDotClick = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveSlide(index);
    resetAutoplay();
  };

  // Autoplay and controls for the top posters campaign slider
  useEffect(() => {
    topAutoplayTimerRef.current = setInterval(() => {
      setTopActiveSlide((prev) => (prev + 1) % 2);
    }, 6500);
    return () => {
      if (topAutoplayTimerRef.current) {
        clearInterval(topAutoplayTimerRef.current);
      }
    };
  }, []);

  const resetTopAutoplay = () => {
    if (topAutoplayTimerRef.current) {
      clearInterval(topAutoplayTimerRef.current);
    }
    topAutoplayTimerRef.current = setInterval(() => {
      setTopActiveSlide((prev) => (prev + 1) % 2);
    }, 6500);
  };

  const handlePrevTopSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setTopActiveSlide((prev) => (prev - 1 + 2) % 2);
    resetTopAutoplay();
  };

  const handleNextTopSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setTopActiveSlide((prev) => (prev + 1) % 2);
    resetTopAutoplay();
  };

  const handleCopyCode = (code: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    onApplyCoupon(code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleBogoQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    const pen = PRODUCTS.find((p) => p.id === "1");
    const sticker = PRODUCTS.find((p) => p.id === "2");
    if (pen) onAddToCart(pen, undefined, "Chalk White");
    if (sticker) onAddToCart(sticker, undefined, undefined);
  };

  const handleBundleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    const bottle = PRODUCTS.find((p) => p.id === "4");
    const backpack = PRODUCTS.find((p) => p.id === "8");
    if (bottle) onAddToCart(bottle, undefined, "Obsidian Spark");
    if (backpack) onAddToCart(backpack, undefined, undefined);
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
      <div className="bg-red-600 text-white text-center py-2.5 px-4 text-xs font-semibold tracking-wide flex items-center justify-center gap-2 relative overflow-hidden" id="home-promo-strip">
        <Percent className="h-3.5 w-3.5 animate-bounce-slow" />
        <span>Smart Shopping Week — 15% off sitewide + free shipping with code <strong className="font-sans bg-white/20 px-1.5 py-0.5 rounded ml-1 font-bold">SHOPWEEK15</strong></span>
      </div>

      {/* Top Banner Campaign Slider (Posters) */}
      <div className={`relative ${isDark ? "bg-zinc-950/40 border-b border-zinc-900" : "bg-white border-b border-zinc-100"}`} id="top-campaign-slider-container">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
          
          {/* Headline badge for the campaign */}
          <div className="flex items-center gap-2 mb-4 justify-center sm:justify-start">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <span className="text-xs uppercase tracking-widest font-heading font-extrabold text-red-600">
              Featured Studio bundles
            </span>
          </div>

          <div className={`relative overflow-hidden rounded-2xl border ${isDark ? "border-zinc-800/60 bg-zinc-900/20" : "border-zinc-200 bg-white"} shadow-xl`}>
            {/* Slider frame */}
            <div className="relative min-h-[440px] sm:min-h-[380px] md:min-h-[420px] lg:min-h-[460px] flex items-center">
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={topActiveSlide}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center p-5 sm:p-8 w-full"
                >
                  {/* Left Column: Interactive Promo Info */}
                  <div className="lg:col-span-5 flex flex-col justify-center text-center lg:text-left order-2 lg:order-1">
                    <span className="inline-flex items-center self-center lg:self-start px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 mb-3 border border-red-200 dark:border-red-900/30 uppercase tracking-wider">
                      {TOP_SLIDES[topActiveSlide].badge}
                    </span>
                    
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold font-heading tracking-tight leading-tight mb-2">
                      {TOP_SLIDES[topActiveSlide].title}
                    </h2>
                    
                    <p className="text-xs sm:text-sm font-sans font-semibold text-blue-500 dark:text-blue-400 mb-3">
                      {TOP_SLIDES[topActiveSlide].tagline}
                    </p>
                    
                    <p className={`text-xs sm:text-sm leading-relaxed mb-5 ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                      {TOP_SLIDES[topActiveSlide].description}
                    </p>

                    {/* Price and Action Section */}
                    <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 mb-2">
                      <div className="flex items-baseline gap-2 mb-2 sm:mb-0">
                        <span className={`text-2xl sm:text-3xl font-extrabold font-sans ${isDark ? "text-white" : "text-zinc-900"}`}>
                          {TOP_SLIDES[topActiveSlide].price}
                        </span>
                        <span className="text-xs sm:text-sm line-through text-zinc-500 font-sans">
                          {TOP_SLIDES[topActiveSlide].originalPrice}
                        </span>
                      </div>
                      
                      <button
                        onClick={TOP_SLIDES[topActiveSlide].onClick}
                        className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-heading font-bold text-xs sm:text-sm text-white shadow-md transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 border ${TOP_SLIDES[topActiveSlide].buttonColor}`}
                      >
                        <ShoppingCart className="h-4 w-4" />
                        {TOP_SLIDES[topActiveSlide].actionText}
                      </button>
                    </div>

                    {topSuccessMessage && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs text-emerald-500 font-sans font-semibold mt-1 text-center lg:text-left flex items-center justify-center lg:justify-start gap-1"
                      >
                        <Check className="h-3.5 w-3.5" /> {topSuccessMessage}
                      </motion.div>
                    )}
                  </div>

                  {/* Right Column: Poster Image */}
                  <div className="lg:col-span-7 relative order-1 lg:order-2 flex items-center justify-center">
                    <div className="relative group w-full overflow-hidden rounded-xl border border-zinc-800/10 dark:border-zinc-100/10 shadow-md bg-zinc-950/20">
                      {/* Image zoom on hover */}
                      <img
                        src={TOP_SLIDES[topActiveSlide].image}
                        alt={TOP_SLIDES[topActiveSlide].title}
                        referrerPolicy="no-referrer"
                        className="w-full h-auto aspect-video object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Slider Controls (Chevrons) */}
              <button
                onClick={handlePrevTopSlide}
                className={`absolute left-2 sm:left-4 p-2 rounded-full border transition-all duration-300 z-20 cursor-pointer ${
                  isDark
                    ? "bg-zinc-900/90 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800"
                    : "bg-white/90 border-zinc-200 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
                }`}
                aria-label="Previous Campaign"
              >
                <ChevronLeft className="h-4 sm:h-5 w-4 sm:w-5" />
              </button>
              <button
                onClick={handleNextTopSlide}
                className={`absolute right-2 sm:right-4 p-2 rounded-full border transition-all duration-300 z-20 cursor-pointer ${
                  isDark
                    ? "bg-zinc-900/90 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800"
                    : "bg-white/90 border-zinc-200 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
                }`}
                aria-label="Next Campaign"
              >
                <ChevronRight className="h-4 sm:h-5 w-4 sm:w-5" />
              </button>
            </div>

            {/* Slider Dots */}
            <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
              {TOP_SLIDES.map((slide, idx) => (
                <button
                  key={slide.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setTopActiveSlide(idx);
                    resetTopAutoplay();
                  }}
                  className={`h-1.5 transition-all duration-300 rounded-full cursor-pointer ${
                    topActiveSlide === idx ? "w-5 bg-red-600" : "w-1.5 bg-zinc-400/50"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
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
            The <span className="text-red-600 font-extrabold">Google Merch Store</span>
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
              className="w-full sm:w-auto flex items-center justify-center gap-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-500 transition-colors py-3.5 px-8 rounded-xl shadow-lg cursor-pointer font-heading border border-red-600"
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

      {/* Smart Shopping Campaign Countdown Banner & Multi-Deal Slider */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fade-in" id="home-campaign-banner">
        <div
          className={`relative rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-10 md:p-12 transition-all duration-500 min-h-[460px] md:min-h-[400px] flex items-center justify-between group border ${
            activeSlide === 0
              ? isDark
                ? "bg-linear-to-r from-blue-950/40 via-[#101124] to-zinc-950 border-blue-500/20"
                : "bg-linear-to-r from-blue-50/70 via-indigo-50/50 to-purple-50/70 border-blue-200"
              : activeSlide === 1
              ? isDark
                ? "bg-linear-to-r from-[#1d1222] via-[#0f0e1c] to-zinc-950 border-purple-500/20"
                : "bg-linear-to-r from-purple-50/70 via-pink-50/50 to-rose-50/70 border-purple-200"
              : isDark
              ? "bg-linear-to-r from-[#0d1c1a] via-[#0d121c] to-zinc-950 border-emerald-500/20"
              : "bg-linear-to-r from-emerald-50/70 via-teal-50/50 to-blue-50/70 border-emerald-200"
          }`}
        >
          {/* Animated Background Pulse Glow */}
          <div className={`absolute inset-0 bg-radial via-transparent to-transparent opacity-40 transition-opacity duration-700 pointer-events-none ${
            activeSlide === 0 ? "from-blue-500/10" : activeSlide === 1 ? "from-purple-500/10" : "from-emerald-500/10"
          }`} />

          {/* Left Arrow Navigation */}
          <button
            onClick={handlePrevSlide}
            className={`absolute left-4 z-20 p-2.5 rounded-full backdrop-blur-md border transition-all cursor-pointer opacity-0 group-hover:opacity-100 hover:scale-105 active:scale-95 shadow-lg ${
              isDark
                ? "bg-zinc-900/80 border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800"
                : "bg-white/90 border-zinc-200 text-zinc-700 hover:text-zinc-950 hover:bg-zinc-50"
            }`}
            aria-label="Previous Deal"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {/* Right Arrow Navigation */}
          <button
            onClick={handleNextSlide}
            className={`absolute right-4 z-20 p-2.5 rounded-full backdrop-blur-md border transition-all cursor-pointer opacity-0 group-hover:opacity-100 hover:scale-105 active:scale-95 shadow-lg ${
              isDark
                ? "bg-zinc-900/80 border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800"
                : "bg-white/90 border-zinc-200 text-zinc-700 hover:text-zinc-950 hover:bg-zinc-50"
            }`}
            aria-label="Next Deal"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Slide Content with AnimatePresence for super smooth transitions */}
          <div className="w-full relative z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide}
                initial={{ opacity: 0, x: 25 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -25 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-12"
              >
                
                {/* Text Content Block */}
                <div className="flex-1 text-center lg:text-left max-w-2xl">
                  
                  {/* Dynamic Slide Badge */}
                  <span className={`inline-flex items-center gap-1.5 py-1 px-3.5 rounded-full text-xs font-bold font-sans uppercase tracking-wider mb-4 border shadow-xs ${
                    activeSlide === 0
                      ? "bg-blue-500/10 border-blue-500/20 text-blue-400"
                      : activeSlide === 1
                      ? "bg-purple-500/10 border-purple-500/20 text-purple-400"
                      : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                  }`}>
                    {activeSlide === 0 && <Gift className="h-3.5 w-3.5" />}
                    {activeSlide === 1 && <Percent className="h-3.5 w-3.5 animate-pulse" />}
                    {activeSlide === 2 && <Layers className="h-3.5 w-3.5" />}
                    {activeSlide === 0 ? "BOGO Flash Event" : activeSlide === 1 ? "Exclusive Coupon Code" : "Developer Bundles"}
                  </span>

                  {/* Heading */}
                  <h2 className={`text-3xl sm:text-4.5xl font-extrabold font-heading leading-tight mb-4 ${
                    isDark ? "text-white" : "text-zinc-900"
                  }`}>
                    {activeSlide === 0 && (
                      <>
                        Buy 1 Get 1 <span className="gemini-gradient-text font-black">FREE</span> on Accessories
                      </>
                    )}
                    {activeSlide === 1 && (
                      <>
                        Smart Shopping Week: <span className="gemini-gradient-text font-black">15% Off Sitewide</span>
                      </>
                    )}
                    {activeSlide === 2 && (
                      <>
                        Save up to <span className="gemini-gradient-text font-black">25% Off</span> with Workspace Kits
                      </>
                    )}
                  </h2>

                  {/* Description Paragraph */}
                  <p className={`text-sm sm:text-base leading-relaxed mb-6 max-w-xl ${
                    isDark ? "text-zinc-400" : "text-zinc-600"
                  }`}>
                    {activeSlide === 0 && (
                      "Double up on developer style. Add any of our premium official accessories (Google custom pens, pixelated plush toys, enamel pins, or hologram stickers) to your cart, and receive a second one absolutely free. Discount applied live!"
                    )}
                    {activeSlide === 1 && (
                      "We are celebrating global coder setups with our highest sitewide discount this year. Apply code SHOPWEEK15 below at cart to instantly shave off 15% from all items and trigger free delivery worldwide."
                    )}
                    {activeSlide === 2 && (
                      "Accelerate your productivity and elevate your setup in one click. Our 'Developer Desk Pack' aggregates the vacuum-insulated Gemini Spark Water Bottle and professional Cloud Backpack for a special grouped discount."
                    )}
                  </p>

                  {/* Action Layout depending on Active Slide */}
                  <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                    {activeSlide === 0 && (
                      <>
                        <button
                          onClick={handleBogoQuickAdd}
                          className="w-full sm:w-auto flex items-center justify-center gap-2 font-heading font-bold text-sm bg-red-600 hover:bg-red-500 text-white py-3 px-6 rounded-xl transition-all shadow-md cursor-pointer hover:scale-102 active:scale-98 border border-red-500"
                        >
                          <ShoppingCart className="h-4 w-4" /> Quick BOGO Combo ($8)
                        </button>
                        <button
                          onClick={() => onPageChange("shop")}
                          className={`w-full sm:w-auto text-xs font-semibold py-3 px-6 rounded-xl border transition-colors cursor-pointer ${
                            isDark
                              ? "border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-300"
                              : "border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-700"
                          }`}
                        >
                          Shop Accessories Collection
                        </button>
                      </>
                    )}

                    {activeSlide === 1 && (
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                        <div
                          onClick={(e) => handleCopyCode("SHOPWEEK15", e)}
                          className={`flex items-center justify-between gap-4 px-4 py-3 rounded-xl border border-dashed cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] ${
                            isDark
                              ? "bg-purple-950/20 border-purple-500/40 hover:border-purple-500/80 text-white"
                              : "bg-purple-100/50 border-purple-300 hover:border-purple-500 text-purple-950"
                          }`}
                          title="Click to copy coupon code"
                        >
                          <div className="text-left">
                            <div className={`text-[10px] font-sans uppercase font-bold tracking-widest ${isDark ? "text-purple-400" : "text-purple-700"}`}>
                              Click to Copy Code
                            </div>
                            <div className="font-mono text-base font-bold tracking-wider">
                              SHOPWEEK15
                            </div>
                          </div>
                          <div className={`p-1.5 rounded-lg ${isDark ? "bg-purple-900/40" : "bg-purple-200"}`}>
                            {couponCode === "SHOPWEEK15" || isCopied ? (
                              <Check className="h-4 w-4 text-emerald-500" />
                            ) : (
                              <Copy className="h-4 w-4 text-purple-400" />
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            onApplyCoupon("SHOPWEEK15");
                            onPageChange("shop");
                          }}
                          className="font-heading font-bold text-sm py-3 px-6 rounded-xl transition-all shadow-md cursor-pointer hover:scale-102 active:scale-98 bg-red-600 hover:bg-red-500 text-white border border-red-500"
                        >
                          Apply & Shop Store
                        </button>
                      </div>
                    )}

                    {activeSlide === 2 && (
                      <>
                        <button
                          onClick={handleBundleQuickAdd}
                          className="w-full sm:w-auto flex items-center justify-center gap-2 font-heading font-bold text-sm bg-red-600 hover:bg-red-500 text-white py-3 px-6 rounded-xl transition-all shadow-md cursor-pointer hover:scale-102 active:scale-98 border border-red-500"
                        >
                          <ShoppingCart className="h-4 w-4" /> Add Desk Pack ($66)
                        </button>
                        <button
                          onClick={() => onPageChange("shop")}
                          className={`w-full sm:w-auto text-xs font-semibold py-3 px-6 rounded-xl border transition-colors cursor-pointer ${
                            isDark
                              ? "border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-300"
                              : "border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-700"
                          }`}
                        >
                          Explore Workspace Category
                        </button>
                      </>
                    )}
                  </div>
                  
                  {/* Applied Feedback label */}
                  {activeSlide === 1 && (couponCode === "SHOPWEEK15" || isCopied) && (
                    <p className="text-xs text-emerald-500 font-bold mt-2 flex items-center justify-center lg:justify-start gap-1">
                      <Check className="h-3.5 w-3.5" /> Code applied successfully! 15% discount will reflect in cart.
                    </p>
                  )}
                  {activeSlide === 0 && (
                    <p className={`text-[11px] mt-3 ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
                      *Simply add multiple eligible accessories. BOGO triggers automatically.
                    </p>
                  )}
                  {activeSlide === 2 && (
                    <p className={`text-[11px] mt-3 ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
                      *Desk Pack contains (1x Gemini Spark Water Bottle + 1x Cloud Backpack). Normal price: $88. Save $22!
                    </p>
                  )}
                </div>

                {/* Right Side Visual/Interactive Panel */}
                <div className="flex-shrink-0 flex items-center justify-center min-w-[220px]">
                  
                  {/* SLIDE 0 VISUAL: Interactive BOGO Floating Icons */}
                  {activeSlide === 0 && (
                    <div className="relative flex items-center justify-center h-48 w-48 sm:h-56 sm:w-56">
                      <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-purple-500/10 rounded-full animate-pulse" />
                      
                      {/* Product 1: Pen */}
                      <div className="absolute -translate-x-6 -translate-y-4 rotate-12 scale-90 sm:scale-100 p-4 rounded-2xl shadow-xl flex flex-col items-center justify-center w-28 h-28 border transition-transform hover:scale-105 duration-300 bg-zinc-900 border-zinc-800 text-white">
                        <span className="text-3xl">🖋️</span>
                        <span className="text-[10px] font-bold text-zinc-400 mt-2">Google Pen</span>
                        <span className="text-[10px] font-mono text-blue-400 font-bold">$8.00</span>
                      </div>

                      {/* Product 2: Hologram Sticker with Free Badge */}
                      <div className="absolute translate-x-8 translate-y-6 -rotate-12 scale-95 sm:scale-105 p-4 rounded-2xl shadow-2xl flex flex-col items-center justify-center w-28 h-28 text-white bg-linear-to-r from-blue-500 to-purple-500 hover:scale-110 duration-300">
                        <span className="text-3xl">✨</span>
                        <span className="text-[10px] font-bold text-white/90 mt-1">Gemini Sticker</span>
                        <span className="text-[10px] font-mono text-zinc-200 line-through">$4.00</span>
                        
                        <div className="absolute -top-3 -right-3 bg-rose-500 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider shadow-md">
                          FREE
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SLIDE 1 VISUAL: Active Countdown Clock */}
                  {activeSlide === 1 && (
                    <div className="flex flex-col items-center gap-3 bg-zinc-950/20 dark:bg-zinc-900/10 p-4 sm:p-5 rounded-2xl border border-dashed border-zinc-500/20" id="campaign-countdown">
                      <div className={`flex items-center gap-1.5 mb-2 font-semibold text-xs ${isDark ? "text-zinc-400" : "text-purple-950"}`}>
                        <Clock className="h-3.5 w-3.5 text-amber-400 animate-spin-slow" /> Sprint Closes In:
                      </div>
                      <div className="flex gap-2">
                        {[
                          { label: "Days", value: timeLeft.days },
                          { label: "Hrs", value: timeLeft.hours },
                          { label: "Min", value: timeLeft.minutes },
                          { label: "Sec", value: timeLeft.seconds },
                        ].map((c, i) => (
                          <div key={i} className="flex flex-col items-center">
                            <div className={`w-11 sm:w-14 h-11 sm:h-14 rounded-xl flex items-center justify-center font-mono text-sm sm:text-base font-bold shadow-md ${
                              isDark
                                ? "bg-zinc-900/95 border border-zinc-800 text-white"
                                : "bg-white border border-purple-100 text-purple-900"
                            }`}>
                              {String(c.value).padStart(2, "0")}
                            </div>
                            <span className={`text-[9px] mt-1.5 font-bold font-sans ${
                              isDark ? "text-zinc-500" : "text-purple-600"
                            }`}>
                              {c.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* SLIDE 2 VISUAL: Curated Workspace Kit */}
                  {activeSlide === 2 && (
                    <div className="relative flex items-center justify-center h-48 w-48 sm:h-56 sm:w-56">
                      <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 to-teal-500/10 rounded-full animate-pulse" />
                      
                      {/* Bottle */}
                      <div className="absolute -translate-x-6 -translate-y-4 rotate-6 p-4 rounded-2xl bg-zinc-950 border border-zinc-800 shadow-xl flex flex-col items-center justify-center w-28 h-28 text-white transition-transform hover:scale-105 duration-300">
                        <span className="text-3xl">💧</span>
                        <span className="text-[10px] font-bold text-zinc-400 mt-2">Gemini Bottle</span>
                        <span className="text-[10px] font-mono text-zinc-500 line-through">$24.00</span>
                      </div>

                      {/* Backpack with Bundle Badge */}
                      <div className="absolute translate-x-8 translate-y-6 -rotate-6 p-4 rounded-2xl shadow-2xl flex flex-col items-center justify-center w-28 h-28 transition-transform hover:scale-105 duration-300 bg-zinc-900 border-zinc-800 text-white">
                        <span className="text-3xl">🎒</span>
                        <span className="text-[10px] font-bold text-zinc-400 mt-2">Cloud Bag</span>
                        <span className="text-[10px] font-mono text-zinc-500 line-through">$64.00</span>
                        
                        <div className="absolute -top-3 -right-3 bg-emerald-500 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-md uppercase tracking-wider shadow-md">
                          SAVE 25%
                        </div>
                      </div>
                    </div>
                  )}

                </div>

              </motion.div>
            </AnimatePresence>
          </div>

          {/* Indicator Navigation Dots & Autoplay state */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
            {Array.from({ length: totalSlides }).map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => handleDotClick(idx, e)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  activeSlide === idx
                    ? activeSlide === 0
                      ? "w-6 bg-blue-500"
                      : activeSlide === 1
                      ? "w-6 bg-purple-500"
                      : "w-6 bg-emerald-500"
                    : isDark
                    ? "w-2 bg-zinc-700 hover:bg-zinc-500"
                    : "w-2 bg-zinc-300 hover:bg-zinc-400"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
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
                  <div className="w-10 h-10 rounded-full bg-red-600 border-2 border-white flex items-center justify-center font-bold text-sm text-white shadow-sm">
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
