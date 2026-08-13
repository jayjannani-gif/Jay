import React, { useState, useEffect, useRef } from "react";
import { Sparkles, ArrowRight, Heart, ShoppingCart, Eye, Palette } from "lucide-react";
import { Product } from "../types";
import { PRODUCTS } from "../data";
import { trackViewItemList } from "../utils/analytics";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";

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
  theme,
}) => {
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [selectedHeroSize] = useState<string>("L");
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null);

  // 3D Card Tilt State for Hero Card
  const [tilt, setTilt] = useState({ x: 0, y: 0, active: false });

  const isDark = theme === "dark";

  // Section Refs for scroll-driven animations
  const heroSectionRef = useRef<HTMLDivElement>(null);
  const catalogSectionRef = useRef<HTMLElement>(null);

  // Global Scroll & Parallax Transformations
  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroSectionRef,
    offset: ["start start", "end start"],
  });

  const heroContentY = useTransform(heroScrollProgress, [0, 1], [0, 60]);
  const heroCardY = useTransform(heroScrollProgress, [0, 1], [0, -40]);
  const heroOpacity = useTransform(heroScrollProgress, [0, 0.85], [1, 0.1]);

  useEffect(() => {
    trackViewItemList(PRODUCTS.slice(0, 6), "Homepage Catalog Showcase");
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotateX = (-y / (rect.height / 2)) * 10;
    const rotateY = (x / (rect.width / 2)) * 10;
    setTilt({ x: rotateX, y: rotateY, active: true });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0, active: false });
  };

  const handleQuickAdd = (product: Product, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const defaultSize = product.sizes ? product.sizes[1] || product.sizes[0] : undefined;
    const defaultColor = product.colors ? product.colors[0].name : undefined;
    onAddToCart(product, defaultSize, defaultColor);

    setAddedItems((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [product.id]: false }));
    }, 2000);
  };

  const categories = ["All", "Apparel", "Drinkware", "Accessories", "Tech"];

  const filteredProducts = PRODUCTS.filter((p) => {
    if (activeCategory === "All") return true;
    return p.category.toLowerCase().includes(activeCategory.toLowerCase());
  }).slice(0, 8);

  const heroProduct = PRODUCTS[1] || PRODUCTS[0]; // Google Campus Hoodie

  const fadeInUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  return (
    <div
      className={`min-h-screen relative overflow-hidden transition-colors duration-300 ${
        isDark ? "bg-[#06070B] text-[#F3F4F6]" : "bg-[#FAF8F5] text-[#0D0E12]"
      }`}
      id="homepage-root"
    >
      {/* Background Soft Lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none overflow-hidden z-0">
        <div className="absolute top-10 left-1/4 w-[380px] h-[380px] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute top-24 right-1/4 w-[400px] h-[400px] rounded-full bg-indigo-600/10 blur-[130px]" />
      </div>

      {/* SECTION 1: HERO SHOWCASE */}
      <section
        ref={heroSectionRef}
        className="relative z-10 pt-10 pb-16 sm:pt-16 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Column */}
          <motion.div
            style={{ y: heroContentY, opacity: heroOpacity }}
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="lg:col-span-7 space-y-6"
          >
            {/* License Badge */}
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-zinc-700/60 bg-zinc-900/60 text-xs font-mono font-bold text-zinc-300">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="uppercase tracking-widest text-[11px]">OFFICIAL GOOGLE MERCHANDISE</span>
            </motion.div>

            {/* Title */}
            <motion.h1
              variants={fadeInUp}
              className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.06] font-display"
              id="hero-heading"
            >
              Engineered for <br />
              <span className="text-blue-500">Developers & Creators.</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={fadeInUp}
              className={`text-base sm:text-lg leading-relaxed max-w-xl font-normal ${
                isDark ? "text-zinc-400" : "text-zinc-600"
              }`}
            >
              Premium official Google developer apparel, tech gear, and drinkware. Crafted with 360GSM organic fleece, minimal lines, and luxury comfort.
            </motion.p>

            {/* Action Buttons */}
            <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => onPageChange("shop")}
                className="px-7 py-3.5 rounded-full font-heading font-bold text-sm text-white bg-blue-600 hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/25 active:scale-95 cursor-pointer flex items-center gap-2 group"
                id="hero-primary-shop-btn"
              >
                <span>Shop Merchandise Catalog</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onPageChange("studio")}
                className={`px-6 py-3.5 rounded-full font-heading font-bold text-sm transition-all border cursor-pointer flex items-center gap-2 active:scale-95 ${
                  isDark
                    ? "bg-zinc-900 border-zinc-700 text-white hover:bg-zinc-800"
                    : "bg-white border-zinc-300 text-zinc-900 hover:bg-zinc-50 shadow-xs"
                }`}
                id="hero-custom-studio-btn"
              >
                <Palette className="h-4 w-4 text-purple-400" />
                <span>Custom Print Studio</span>
              </button>
            </motion.div>

            {/* Specs Bar */}
            <motion.div
              variants={fadeInUp}
              className={`grid grid-cols-3 gap-6 pt-6 border-t ${isDark ? "border-zinc-800" : "border-zinc-200"}`}
            >
              <div>
                <span className="block text-xl sm:text-2xl font-extrabold font-mono text-white">360 GSM</span>
                <span className="text-xs text-zinc-400 uppercase tracking-wider font-mono">Organic Cotton</span>
              </div>
              <div>
                <span className="block text-1xl sm:text-2xl font-extrabold font-mono text-blue-400">100%</span>
                <span className="text-xs text-zinc-400 uppercase tracking-wider font-mono">Certified Authentic</span>
              </div>
              <div>
                <span className="block text-xl sm:text-2xl font-extrabold font-mono text-emerald-400">Global</span>
                <span className="text-xs text-zinc-400 uppercase tracking-wider font-mono">Express Delivery</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Hero Interactive 3D Card */}
          <motion.div
            style={{ y: heroCardY, opacity: heroOpacity }}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="lg:col-span-5 relative perspective-1000"
          >
            <div
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{
                transform: tilt.active
                  ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.01, 1.01, 1.01)`
                  : "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
                transition: tilt.active ? "transform 0.1s ease-out" : "transform 0.5s ease-out",
              }}
              className={`relative rounded-3xl p-6 border shadow-2xl overflow-hidden ${
                isDark
                  ? "bg-[#0F111A] border-white/10 shadow-black/80 hover:border-white/20"
                  : "bg-white border-zinc-200 shadow-zinc-200 hover:border-zinc-300"
              }`}
            >
              {/* Product Badge */}
              <div className="flex items-center justify-between mb-4 relative z-10">
                <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-wider">
                  FEATURED SPOTLIGHT
                </span>
                <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>In Stock</span>
                </div>
              </div>

              {/* Main Image */}
              <div
                onClick={() => onProductClick(heroProduct)}
                className="h-80 sm:h-96 rounded-2xl flex items-center justify-center relative overflow-hidden mb-5 cursor-pointer group/img"
                style={{ background: heroProduct.gradient }}
              >
                {heroProduct.image ? (
                  <img
                    src={heroProduct.image}
                    alt={heroProduct.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span className="text-8xl">{heroProduct.icon}</span>
                )}

                <div className="absolute top-3 right-3 z-10">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewProduct(heroProduct);
                    }}
                    className="p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors cursor-pointer"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Title & Price */}
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold font-heading">{heroProduct.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex text-amber-400 text-xs">{"★".repeat(5)}</div>
                      <span className="text-xs font-mono text-zinc-400">(248 reviews)</span>
                    </div>
                  </div>
                  <span className="text-xl font-mono font-bold text-blue-500">${heroProduct.price}</span>
                </div>

                <button
                  onClick={() => {
                    onAddToCart(heroProduct, selectedHeroSize);
                    setAddedItems((prev) => ({ ...prev, [heroProduct.id]: true }));
                    setTimeout(() => setAddedItems((prev) => ({ ...prev, [heroProduct.id]: false })), 2000);
                  }}
                  className="w-full py-3 rounded-xl text-white font-heading font-bold text-sm bg-blue-600 hover:bg-blue-500 transition-all cursor-pointer shadow-md active:scale-98 flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span>{addedItems[heroProduct.id] ? "✓ Added to Bag!" : "Add to Bag"}</span>
                </button>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* SECTION 2: MARQUEE PARTNER TICKER */}
      <section className={`py-4 border-y ${isDark ? "bg-[#090A0E] border-white/10" : "bg-white border-zinc-200"}`}>
        <div className="flex animate-marquee-slow whitespace-nowrap gap-12 items-center py-1 select-none">
          {[
            "GOOGLE CLOUD", "GEMINI 1.5 PRO", "ANDROID 15", "DEEPMIND", "FLUTTER SDK", "GO LANGUAGE",
            "GOOGLE CLOUD", "GEMINI 1.5 PRO", "ANDROID 15", "DEEPMIND", "FLUTTER SDK", "GO LANGUAGE"
          ].map((brand, idx) => (
            <div key={idx} className="flex items-center gap-3 shrink-0 opacity-70">
              <span className="text-xs font-mono font-bold tracking-widest">{brand}</span>
              <span className="text-blue-500 text-xs">•</span>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: CUSTOM PRINT STUDIO BANNER */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className={`p-8 sm:p-12 rounded-3xl border relative overflow-hidden ${
            isDark ? "bg-[#0F111A] border-purple-500/30" : "bg-purple-50/70 border-purple-200"
          }`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold text-purple-400 bg-purple-500/10 border border-purple-500/20 uppercase tracking-wider">
                INTERACTIVE MERCH CUSTOMIZER
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold font-heading tracking-tight">
                Design Custom Developer Gear in Real-Time
              </h2>
              <p className={`text-sm leading-relaxed ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                Pick base hoodies, tees, flasks, or sleeves. Custom-print code lines, Google emblems, and colorways with live 2D preview & instant ordering.
              </p>
              <button
                onClick={() => onPageChange("studio")}
                className="px-7 py-3.5 rounded-full font-heading font-bold text-sm text-white bg-purple-600 hover:bg-purple-500 transition-all shadow-md cursor-pointer inline-flex items-center gap-2 active:scale-95"
              >
                <Palette className="h-4 w-4" />
                <span>Launch Custom Print Studio</span>
              </button>
            </div>

            <div className="flex justify-center">
              <div className="w-full max-w-md aspect-video rounded-2xl bg-black/80 border border-white/10 p-6 flex flex-col items-center justify-center text-center shadow-xl">
                <Sparkles className="h-10 w-10 text-purple-400 mb-3 animate-pulse" />
                <span className="text-xs font-mono font-bold text-white mb-1">Custom Print-On-Demand Engine</span>
                <span className="text-[10px] text-zinc-400 font-mono">100% Organic Fabrics • Eco-Inks • Hand Crafted</span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* SECTION 4: CATALOG GALLERY */}
      <section ref={catalogSectionRef} className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="catalog-gallery">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest block mb-1">
              OFFICIAL CATALOG
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold font-heading tracking-tight">
              Developer Merchandise
            </h2>
          </div>

          {/* Filter Categories */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-mono font-bold transition-all cursor-pointer ${
                  activeCategory === cat
                    ? "bg-blue-600 text-white"
                    : isDark
                    ? "bg-zinc-900 text-zinc-400 hover:text-white"
                    : "bg-zinc-100 text-zinc-600 hover:text-zinc-900"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {filteredProducts.map((product) => {
            const isInWishlist = wishlistIds.includes(product.id);
            const isAdded = addedItems[product.id];

            return (
              <motion.div
                key={product.id}
                variants={fadeInUp}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                onClick={() => onProductClick(product)}
                className={`group rounded-2xl border p-4 transition-all cursor-pointer flex flex-col justify-between ${
                  isDark ? "bg-[#0F111A] border-white/10 hover:border-white/20 hover:shadow-xl hover:shadow-blue-500/5" : "bg-white border-zinc-200 shadow-xs hover:shadow-md"
                }`}
              >
                <div>
                  <div
                    className="h-56 rounded-xl flex items-center justify-center relative overflow-hidden mb-3"
                    style={{ background: product.gradient }}
                  >
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                    ) : (
                      <span className="text-6xl">{product.icon}</span>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToWishlist(product);
                      }}
                      className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-all z-10 cursor-pointer ${
                        isInWishlist ? "bg-rose-500 text-white" : "bg-black/40 text-white/80"
                      }`}
                    >
                      <Heart className={`h-3.5 w-3.5 ${isInWishlist ? "fill-white" : ""}`} />
                    </button>
                  </div>

                  <span className="text-[10px] font-mono font-bold uppercase text-blue-400 block mb-1">
                    {product.category}
                  </span>
                  <h3 className="font-heading font-bold text-sm mb-1 group-hover:text-blue-500 transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-zinc-800/80">
                  <span className="font-mono text-base font-bold text-blue-400">${product.price}</span>
                  <button
                    onClick={(e) => handleQuickAdd(product, e)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      isAdded ? "bg-emerald-600 text-white" : "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
                    }`}
                  >
                    {isAdded ? "Added" : "Add"}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* QUICK PREVIEW MODAL */}
      <AnimatePresence>
        {previewProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPreviewProduct(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-xs"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`relative z-10 w-full max-w-xl rounded-2xl p-6 border shadow-2xl ${
                isDark ? "bg-[#12141D] border-white/10 text-white" : "bg-white border-zinc-200 text-zinc-900"
              }`}
            >
              <h3 className="text-xl font-bold mb-2">{previewProduct.name}</h3>
              <p className="text-xs text-zinc-400 mb-4">{previewProduct.description}</p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    handleQuickAdd(previewProduct);
                    setPreviewProduct(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs cursor-pointer"
                >
                  Add to Bag (${previewProduct.price})
                </button>
                <button
                  onClick={() => setPreviewProduct(null)}
                  className="px-4 py-2.5 rounded-xl border border-zinc-700 text-xs font-bold cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
export default HomeView;
