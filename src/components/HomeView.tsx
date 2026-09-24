import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  ArrowRight,
  Compass,
  ShoppingBag,
  Star,
  Zap,
  TrendingUp,
  Tag,
  Grid,
  Sparkle,
  SlidersHorizontal,
  Flame,
} from "lucide-react";
import { Product, CurrencyCode, DiscoveryPreferences } from "../types";
import { PRODUCTS } from "../data";
import { formatPrice } from "../utils/currency";
import { trackViewItemList } from "../utils/analytics";
import { ProductCard } from "./ProductCard";
import { FindYourGoogle } from "./FindYourGoogle";
import { MerchMood } from "./MerchMood";
import { GoogleUniverse } from "./GoogleUniverse";
import { CompleteTheLook } from "./CompleteTheLook";
import { GiftLab } from "./GiftLab";
import { SmartBundles } from "./SmartBundles";
import { RecentlyViewed } from "./RecentlyViewed";
import { CitySpotlightSection } from "./CitySpotlightSection";
import { motion, useScroll, useTransform } from "motion/react";

interface HomeViewProps {
  onPageChange: (page: string) => void;
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product, size?: string, color?: string) => void;
  onToggleWishlist: (product: Product) => void;
  onToggleCompare: (product: Product) => void;
  onQuickView: (product: Product) => void;
  wishlistIds: string[];
  compareIds: string[];
  recentlyViewedIds: string[];
  currency: CurrencyCode;
  theme: "dark" | "light";
  onShowToast?: (text: string, type?: "success" | "error" | "info") => void;
  userPreferences?: DiscoveryPreferences;
  onPreferencesChanged?: (prefs: DiscoveryPreferences) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onPageChange,
  onProductClick,
  onAddToCart,
  onToggleWishlist,
  onToggleCompare,
  onQuickView,
  wishlistIds,
  compareIds,
  recentlyViewedIds,
  currency,
  theme,
  onShowToast,
  userPreferences,
  onPreferencesChanged,
}) => {
  const isDark = theme === "dark";
  const heroRef = useRef<HTMLDivElement>(null);

  // Scroll animations
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 50]);

  // Featured flagship products (Hoodie, Sleeve, Bot Pin, Water Bottle)
  const featuredProducts = PRODUCTS.filter((p) =>
    ["7", "11", "5", "4"].includes(p.id)
  );

  // Trending / Bestsellers (Google Pen White, Gemini Sticker, Google Red Tee, Chrome Dino)
  const trendingProducts = PRODUCTS.filter((p) =>
    ["1", "2", "3", "6"].includes(p.id)
  );

  // New Arrivals (Laptop Sleeve, Spark Bottle, Noogler Beanie, Cloud Backpack)
  const newArrivals = PRODUCTS.filter((p) =>
    ["11", "4", "9", "8"].includes(p.id)
  );

  // Track initial catalog view
  useEffect(() => {
    trackViewItemList(featuredProducts, "Featured Flagship Gear");
  }, []);

  // 3D Card Tilt State for Hero Spotlight Card
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setTilt({ x: (-y / (rect.height / 2)) * 8, y: (x / (rect.width / 2)) * 8 });
  };
  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const spotlightProduct = PRODUCTS.find((p) => p.id === "7") || PRODUCTS[0]; // Campus Hoodie

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  // Structured categories per GA4 Product Discovery engine
  const CATEGORIES = [
    {
      id: "Apparel",
      name: "Apparel",
      icon: "👕",
      count: "4 Products",
      desc: "Campus fleece, organic tees, beanies & dad caps",
      gradient: "from-blue-500/10 via-indigo-500/10 to-blue-600/10",
      accent: "text-blue-400 group-hover:border-blue-500/40",
      route: "shop&category=Apparel",
    },
    {
      id: "Accessories",
      name: "Accessories",
      icon: "✨",
      count: "4 Products",
      desc: "Tactile journals, aluminum pens & desk mascots",
      gradient: "from-purple-500/10 via-pink-500/10 to-indigo-500/10",
      accent: "text-purple-400 group-hover:border-purple-500/40",
      route: "shop&category=Accessories",
    },
    {
      id: "Drinkware",
      name: "Drinkware",
      icon: "💧",
      count: "2 Products",
      desc: "Artisan stoneware mugs & vacuum hydration flasks",
      gradient: "from-cyan-500/10 via-teal-500/10 to-blue-500/10",
      accent: "text-cyan-400 group-hover:border-cyan-500/40",
      route: "shop&category=Drinkware",
    },
    {
      id: "Collectibles",
      name: "Collectibles",
      icon: "🤖",
      count: "3 Products",
      desc: "Bugdroid enamel pins, offline dino & Noogler knit",
      gradient: "from-emerald-500/10 via-green-500/10 to-teal-500/10",
      accent: "text-emerald-400 group-hover:border-emerald-500/40",
      route: "shop&category=Accessories",
    },
    {
      id: "Home & Desk",
      name: "Home & Desk",
      icon: "☕",
      count: "4 Products",
      desc: "Pixel mugs, dot-grid books & stationery tools",
      gradient: "from-amber-500/10 via-orange-500/10 to-yellow-500/10",
      accent: "text-amber-400 group-hover:border-amber-500/40",
      route: "shop&category=Drinkware",
    },
    {
      id: "Bags & Tech",
      name: "Bags & Tech",
      icon: "🎒",
      count: "3 Products",
      desc: "900D Cloud commuter packs & padded laptop sleeves",
      gradient: "from-sky-500/10 via-blue-500/10 to-indigo-500/10",
      accent: "text-sky-400 group-hover:border-sky-500/40",
      route: "shop&category=Bags",
    },
  ];

  return (
    <div
      className={`transition-colors duration-300 min-h-screen ${
        isDark ? "bg-[#06070B] text-zinc-100" : "bg-zinc-50 text-zinc-900"
      }`}
    >
      {/* 1. HERO: GOOGLE MERCH STUDIO */}
      <section
        ref={heroRef}
        className="relative overflow-hidden pt-12 pb-20 border-b border-zinc-800/40"
        id="hero-section"
      >
        {/* Ambient background glows */}
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full filter blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full filter blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Brand Statement & Discovery Entry */}
            <motion.div style={{ y: heroY }} className="lg:col-span-7 flex flex-col items-start">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6 border bg-blue-500/10 text-blue-400 border-blue-500/20">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Google Merch Studio • Official 2026 Collection</span>
              </div>

              <h1
                className={`text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] mb-4 ${
                  isDark ? "text-white" : "text-zinc-900"
                }`}
              >
                GOOGLE MERCH <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                  STUDIO
                </span>
              </h1>

              <p className="text-xl sm:text-2xl font-bold tracking-tight text-blue-400 mb-3">
                Discover. Shop. Find Your Google.
              </p>

              <p className="text-base sm:text-lg text-zinc-400 max-w-xl leading-relaxed mb-8">
                From substantial campus fleece to artisan desk stoneware, engineering journals, and open-source collectibles. Discover official gear designed for makers and daily innovators.
              </p>

              {/* Primary & Secondary Hero CTAs */}
              <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
                <button
                  onClick={() => onPageChange("shop")}
                  className="h-12 px-8 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:opacity-95 text-white font-bold text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
                  id="btn-hero-shop-merch"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Shop Merch</span>
                </button>

                <button
                  onClick={() => scrollToSection("shop-by-category-section")}
                  className={`h-12 px-7 rounded-2xl border font-bold text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                    isDark
                      ? "bg-zinc-900/80 border-zinc-700 text-zinc-200 hover:bg-zinc-800 hover:text-white"
                      : "bg-white border-zinc-300 text-zinc-800 hover:bg-zinc-100"
                  }`}
                  id="btn-hero-explore-collections"
                >
                  <Compass className="w-4 h-4" />
                  <span>Explore Collections</span>
                </button>
              </div>

              {/* Discovery Vectors Trust Row */}
              <div className="grid grid-cols-3 gap-4 pt-8 mt-8 border-t border-zinc-800/60 w-full text-xs">
                <div
                  onClick={() => onPageChange("city-spotlight")}
                  className="cursor-pointer group"
                >
                  <div className="font-bold text-zinc-200 group-hover:text-blue-400 transition-colors">
                    City Spotlight 📍
                  </div>
                  <div className="text-zinc-500 mt-0.5">NY • MTV • Sunnyvale</div>
                </div>
                <div
                  onClick={() => scrollToSection("find-your-google-section")}
                  className="cursor-pointer group"
                >
                  <div className="font-bold text-zinc-200 group-hover:text-blue-400 transition-colors">
                    Find Your Google ✨
                  </div>
                  <div className="text-zinc-500 mt-0.5">Affinity-based fit</div>
                </div>
                <div
                  onClick={() => scrollToSection("smart-bundles-section")}
                  className="cursor-pointer group"
                >
                  <div className="font-bold text-zinc-200 group-hover:text-blue-400 transition-colors">
                    Smart Bundles
                  </div>
                  <div className="text-zinc-500 mt-0.5">Save up to 20%</div>
                </div>
              </div>
            </motion.div>

            {/* Right Interactive Spotlight Hero Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                  transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                  transition: "transform 0.15s ease-out",
                }}
                className={`relative w-full max-w-md rounded-3xl p-6 sm:p-8 border shadow-2xl transition-all ${
                  isDark
                    ? "bg-zinc-900/90 border-zinc-700/80 shadow-black/80"
                    : "bg-white border-zinc-200 shadow-zinc-300/60"
                }`}
                id="hero-spotlight-card"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-wider">
                    Spotlight Product
                  </span>
                  <div className="flex items-center gap-1 text-xs text-amber-400 font-semibold">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{spotlightProduct.rating}</span>
                    <span className="text-zinc-500">({spotlightProduct.reviewCount})</span>
                  </div>
                </div>

                {/* Product Image */}
                <div
                  onClick={() => onProductClick(spotlightProduct)}
                  className="w-full aspect-square rounded-2xl bg-zinc-950/40 p-6 flex items-center justify-center cursor-pointer overflow-hidden mb-6"
                >
                  {spotlightProduct.image ? (
                    <img
                      src={spotlightProduct.image}
                      alt={spotlightProduct.name}
                      className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span className="text-8xl">{spotlightProduct.icon}</span>
                  )}
                </div>

                <div>
                  <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                    {spotlightProduct.category} • {spotlightProduct.ecosystem}
                  </div>
                  <h3
                    onClick={() => onProductClick(spotlightProduct)}
                    className="text-xl font-bold hover:text-blue-400 cursor-pointer transition-colors"
                  >
                    {spotlightProduct.name}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1.5 line-clamp-2 leading-relaxed">
                    {spotlightProduct.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 mt-4 border-t border-zinc-800/80">
                    <div>
                      <div className="text-[10px] text-zinc-500 uppercase tracking-wider">Price</div>
                      <div className="text-xl font-extrabold text-blue-400">
                        {formatPrice(spotlightProduct.price, currency)}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onQuickView(spotlightProduct)}
                        className="h-10 px-3.5 rounded-xl border border-zinc-700 hover:border-zinc-600 text-xs font-semibold text-zinc-300 hover:text-white transition-colors cursor-pointer"
                      >
                        Quick View
                      </button>

                      <button
                        onClick={() => onAddToCart(spotlightProduct)}
                        className="h-10 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md transition-all active:scale-95 cursor-pointer"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add to Bag</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED MERCH (Visually strong merchandise cards immediately below hero) */}
      <section className="w-full py-12 sm:py-16 border-b border-zinc-800/40" id="featured-merch-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-2 border bg-blue-500/10 text-blue-400 border-blue-500/20">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Featured Merch</span>
              </div>
              <h2
                className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
                  isDark ? "text-white" : "text-zinc-900"
                }`}
              >
                Flagship Studio Gear
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-zinc-400 max-w-xl">
                High-potential essentials designed with premium materials, high-density fleece, and durable finishes.
              </p>
            </div>

            <button
              onClick={() => onPageChange("shop")}
              className="text-xs font-bold text-blue-400 hover:text-blue-300 inline-flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>Explore All Merch (14)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
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
        </div>
      </section>

      {/* 3. SHOP BY CATEGORY (Immediate active discovery path per GA4 insight) */}
      <section
        className={`w-full py-12 sm:py-16 border-b transition-colors ${
          isDark ? "border-zinc-800/40 bg-zinc-950/40" : "border-zinc-200 bg-white"
        }`}
        id="shop-by-category-section"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-2 border bg-purple-500/10 text-purple-400 border-purple-500/20">
                <Grid className="w-3.5 h-3.5" />
                <span>Product Discovery Engine</span>
              </div>
              <h2
                className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
                  isDark ? "text-white" : "text-zinc-900"
                }`}
              >
                Shop by Category
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-zinc-400 max-w-xl">
                Fast-track your shopping journey. Choose a category to jump directly into the filtered catalog.
              </p>
            </div>

            <button
              onClick={() => onPageChange("shop")}
              className="text-xs font-bold text-blue-400 hover:text-blue-300 inline-flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>View All Categories</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES.map((cat) => (
              <div
                key={cat.id}
                onClick={() => onPageChange(cat.route)}
                className={`group p-4 sm:p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between hover:scale-[1.02] shadow-sm ${
                  isDark
                    ? `bg-zinc-900/70 border-zinc-800/80 hover:bg-zinc-900 ${cat.accent}`
                    : `bg-zinc-50 border-zinc-200 hover:bg-white hover:border-zinc-300`
                }`}
                id={`cat-card-${cat.id.toLowerCase()}`}
              >
                <div>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-3 bg-zinc-950/30 group-hover:scale-110 transition-transform">
                    {cat.icon}
                  </div>
                  <h3
                    className={`font-bold text-sm sm:text-base group-hover:text-blue-400 transition-colors ${
                      isDark ? "text-white" : "text-zinc-900"
                    }`}
                  >
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-zinc-400 line-clamp-2 mt-1 leading-snug">
                    {cat.desc}
                  </p>
                </div>

                <div className="pt-4 mt-3 border-t border-zinc-800/40 flex items-center justify-between text-[11px] font-semibold text-zinc-500 group-hover:text-blue-400">
                  <span>{cat.count}</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. CITY SPOTLIGHT: Priority Test Markets (New York, Mountain View, Sunnyvale) */}
      <CitySpotlightSection
        currency={currency}
        wishlistIds={wishlistIds}
        compareIds={compareIds}
        onProductClick={onProductClick}
        onAddToCart={onAddToCart}
        onToggleWishlist={onToggleWishlist}
        onToggleCompare={onToggleCompare}
        onQuickView={onQuickView}
        onNavigateToCity={(cityId) => onPageChange(`city-spotlight&city=${cityId}`)}
        theme={theme}
      />

      {/* 5. TRENDING / BESTSELLERS */}
      <section className="w-full py-12 sm:py-16 border-b border-zinc-800/40" id="trending-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-2 border bg-amber-500/10 text-amber-400 border-amber-500/20">
                <Flame className="w-3.5 h-3.5" />
                <span>High Engagement</span>
              </div>
              <h2
                className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
                  isDark ? "text-white" : "text-zinc-900"
                }`}
              >
                Trending & Bestsellers
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-zinc-400 max-w-xl">
                The top-reviewed and most-added items across developers and creative professionals.
              </p>
            </div>

            <button
              onClick={() => onPageChange("shop&sort=bestselling")}
              className="text-xs font-bold text-blue-400 hover:text-blue-300 inline-flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>View Bestsellers</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingProducts.map((product) => (
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
        </div>
      </section>

      {/* 6. NEW ARRIVALS */}
      <section className="w-full py-12 sm:py-16 border-b border-zinc-800/40" id="new-arrivals-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-2 border bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                <Zap className="w-3.5 h-3.5" />
                <span>Fresh 2026 Releases</span>
              </div>
              <h2
                className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
                  isDark ? "text-white" : "text-zinc-900"
                }`}
              >
                New Arrivals
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-zinc-400 max-w-xl">
                Just dropped into the Studio: developer hardware sleeves, updated hydration flasks, and heritage knitwear.
              </p>
            </div>

            <button
              onClick={() => onPageChange("shop&filter=new")}
              className="text-xs font-bold text-blue-400 hover:text-blue-300 inline-flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>View All New</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.map((product) => (
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
        </div>
      </section>

      {/* 7. PERSONALIZED DISCOVERY ("Picked for you" / "Find Your Google") */}
      <section className="w-full" id="personalized-discovery-container">
        {/* Interactive Affinity Navigator */}
        <FindYourGoogle
          currency={currency}
          wishlistIds={wishlistIds}
          compareIds={compareIds}
          onProductClick={onProductClick}
          onAddToCart={onAddToCart}
          onToggleWishlist={onToggleWishlist}
          onToggleCompare={onToggleCompare}
          onQuickView={onQuickView}
          onPreferencesChanged={onPreferencesChanged}
          theme={theme}
        />

        {/* Merch Mood Interactive Selector */}
        <MerchMood
          currency={currency}
          wishlistIds={wishlistIds}
          compareIds={compareIds}
          onProductClick={onProductClick}
          onAddToCart={onAddToCart}
          onToggleWishlist={onToggleWishlist}
          onToggleCompare={onToggleCompare}
          onQuickView={onQuickView}
          theme={theme}
        />

        {/* Google Universe Ecosystem Navigation */}
        <GoogleUniverse
          currency={currency}
          wishlistIds={wishlistIds}
          compareIds={compareIds}
          onProductClick={onProductClick}
          onAddToCart={onAddToCart}
          onToggleWishlist={onToggleWishlist}
          onToggleCompare={onToggleCompare}
          onQuickView={onQuickView}
          theme={theme}
        />

        {/* Complete The Look Showcase */}
        <CompleteTheLook
          currency={currency}
          onAddToCart={onAddToCart}
          onProductClick={onProductClick}
          onShowToast={onShowToast}
          theme={theme}
        />

        {/* Dedicated Gift Lab */}
        <GiftLab
          currency={currency}
          wishlistIds={wishlistIds}
          compareIds={compareIds}
          onProductClick={onProductClick}
          onAddToCart={onAddToCart}
          onToggleWishlist={onToggleWishlist}
          onToggleCompare={onToggleCompare}
          onQuickView={onQuickView}
          onShowToast={onShowToast}
          theme={theme}
        />

        {/* Curated Smart Bundles */}
        <SmartBundles
          currency={currency}
          onAddToCart={onAddToCart}
          onProductClick={onProductClick}
          onShowToast={onShowToast}
          theme={theme}
        />

        {/* Recently Viewed (Persistent in localStorage) */}
        <RecentlyViewed
          recentIds={recentlyViewedIds}
          currency={currency}
          wishlistIds={wishlistIds}
          compareIds={compareIds}
          onProductClick={onProductClick}
          onAddToCart={onAddToCart}
          onToggleWishlist={onToggleWishlist}
          onToggleCompare={onToggleCompare}
          onQuickView={onQuickView}
          theme={theme}
        />
      </section>
    </div>
  );
};
