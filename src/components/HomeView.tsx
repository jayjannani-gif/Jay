import React, { useState, useRef, useEffect } from "react";
import { Sparkles, ArrowRight, Compass, ShieldCheck, Heart, ShoppingBag, Eye, Star, Check, Zap } from "lucide-react";
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

  // Track initial catalog view
  useEffect(() => {
    trackViewItemList(PRODUCTS.slice(0, 4), "Trending Featured Drops");
  }, []);

  // Featured trending products
  const featuredProducts = PRODUCTS.slice(0, 4);

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

  return (
    <div className={`transition-colors duration-300 min-h-screen ${isDark ? "bg-[#06070B] text-zinc-100" : "bg-zinc-50 text-zinc-900"}`}>
      
      {/* 1. PREMIUM HERO: "More than merch. Find your Google." */}
      <section ref={heroRef} className="relative overflow-hidden pt-12 pb-20 border-b border-zinc-800/40" id="hero-section">
        {/* Ambient background glows */}
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full filter blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full filter blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Brand Statement & Discovery Entry */}
            <motion.div style={{ y: heroY }} className="lg:col-span-7 flex flex-col items-start">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6 border bg-blue-500/10 text-blue-400 border-blue-500/20">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Google Merch Lab • Autumn 2026</span>
              </div>

              <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] mb-6 ${isDark ? "text-white" : "text-zinc-900"}`}>
                More than merch. <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                  Find your Google.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-zinc-400 max-w-xl leading-relaxed mb-8">
                From the physical comfort of heavy campus fleece to artisan desk stoneware, engineering journals, and open-source Bugdroid companions. Discover gear curated around your daily flow.
              </p>

              {/* Discovery CTA Actions */}
              <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
                <button
                  onClick={() => scrollToSection("find-your-google-section")}
                  className="h-12 px-7 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:opacity-95 text-white font-semibold text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all active:scale-95"
                  id="btn-hero-find-your-google"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Start Guided Discovery</span>
                </button>

                <button
                  onClick={() => onPageChange("shop")}
                  className={`h-12 px-6 rounded-2xl border font-semibold text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 ${
                    isDark
                      ? "bg-zinc-900/80 border-zinc-700 text-zinc-200 hover:bg-zinc-800 hover:text-white"
                      : "bg-white border-zinc-300 text-zinc-800 hover:bg-zinc-100"
                  }`}
                  id="btn-hero-explore-catalog"
                >
                  <span>Explore Full Catalog</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Discovery Vectors Trust Row */}
              <div className="grid grid-cols-3 gap-4 pt-8 mt-8 border-t border-zinc-800/60 w-full text-xs">
                <div>
                  <div className="font-bold text-zinc-200">7 Merch Moods</div>
                  <div className="text-zinc-500 mt-0.5">Desk to travel flow</div>
                </div>
                <div>
                  <div className="font-bold text-zinc-200">9 Ecosystems</div>
                  <div className="text-zinc-500 mt-0.5">Pixel, Android, Cloud</div>
                </div>
                <div>
                  <div className="font-bold text-zinc-200">Smart Bundles</div>
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
                        className="h-10 px-3.5 rounded-xl border border-zinc-700 hover:border-zinc-600 text-xs font-semibold text-zinc-300 hover:text-white transition-colors"
                      >
                        Quick View
                      </button>

                      <button
                        onClick={() => onAddToCart(spotlightProduct)}
                        className="h-10 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md transition-all active:scale-95"
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

      {/* 2. TRENDING / FEATURED DROPS */}
      <section className="w-full py-12 border-b border-zinc-800/40" id="trending-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-2 border bg-amber-500/10 text-amber-400 border-amber-500/20">
                <Zap className="w-3.5 h-3.5" />
                <span>High Demand Drops</span>
              </div>
              <h2 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${isDark ? "text-white" : "text-zinc-900"}`}>
                Trending in the Merch Lab
              </h2>
            </div>

            <button
              onClick={() => onPageChange("shop")}
              className="text-xs font-bold text-blue-400 hover:text-blue-300 inline-flex items-center gap-1 transition-colors"
            >
              <span>View All Products</span>
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

      {/* 3. FIND YOUR GOOGLE INTERACTIVE DISCOVERY SYSTEM */}
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

      {/* 4. MERCH MOOD INTERACTIVE SELECTOR */}
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

      {/* 5. GOOGLE UNIVERSE ECOSYSTEM NAVIGATION */}
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

      {/* 6. COMPLETE THE LOOK SHOWCASE */}
      <CompleteTheLook
        currency={currency}
        onAddToCart={onAddToCart}
        onProductClick={onProductClick}
        onShowToast={onShowToast}
        theme={theme}
      />

      {/* 7. DEDICATED GIFT LAB */}
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

      {/* 8. CURATED SMART BUNDLES */}
      <SmartBundles
        currency={currency}
        onAddToCart={onAddToCart}
        onProductClick={onProductClick}
        onShowToast={onShowToast}
        theme={theme}
      />

      {/* 9. RECENTLY VIEWED (Real localStorage persistence) */}
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

      {/* 10. CRAFT FOOTER */}
      <footer className="w-full py-12 border-t border-zinc-800/80 bg-zinc-950/40 text-xs text-zinc-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="font-extrabold text-sm text-white mb-2">GOOGLE MERCH LAB</div>
              <p className="text-zinc-500 leading-relaxed">
                More than merch. Find your Google. Personalized discovery platform powered by ecosystem affinities and contextual moods.
              </p>
            </div>
            <div>
              <div className="font-bold text-zinc-300 mb-2">Discovery</div>
              <ul className="space-y-1.5 text-zinc-500">
                <li><button onClick={() => scrollToSection("find-your-google-section")} className="hover:text-white">Find Your Google</button></li>
                <li><button onClick={() => scrollToSection("merch-mood-section")} className="hover:text-white">Merch Mood</button></li>
                <li><button onClick={() => scrollToSection("google-universe-section")} className="hover:text-white">Google Universe</button></li>
                <li><button onClick={() => scrollToSection("gift-lab-section")} className="hover:text-white">Gift Lab</button></li>
              </ul>
            </div>
            <div>
              <div className="font-bold text-zinc-300 mb-2">Synergy & Savings</div>
              <ul className="space-y-1.5 text-zinc-500">
                <li><button onClick={() => scrollToSection("smart-bundles-section")} className="hover:text-white">Smart Bundles (up to 20% off)</button></li>
                <li><button onClick={() => scrollToSection("complete-the-look-section")} className="hover:text-white">Complete the Look</button></li>
                <li><button onClick={() => onPageChange("studio")} className="hover:text-white">Custom Studio ✨</button></li>
              </ul>
            </div>
            <div>
              <div className="font-bold text-zinc-300 mb-2">Shipping & Guarantee</div>
              <p className="text-zinc-500 leading-relaxed">
                Worldwide dispatch with eco-packaging. Free shipping eligible on orders over $35 or with promotional code.
              </p>
            </div>
          </div>
          <div className="pt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-zinc-500">
            <div>© 2026 Google Merch Lab. Official Google Merchandise Store Clone.</div>
            <div className="flex items-center gap-4">
              <span>Privacy & Terms</span>
              <span>•</span>
              <span>GA4 Analytics Instrumented</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
