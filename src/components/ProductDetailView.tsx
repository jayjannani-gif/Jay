import React, { useState, useEffect } from "react";
import { Star, Heart, ShoppingCart, Minus, Plus, ChevronRight, ChevronDown, Check, ShieldCheck, HelpCircle } from "lucide-react";
import { Product } from "../types";
import { PRODUCTS } from "../data";
import { trackViewItem, trackAddToCart, trackAddToWishlist } from "../utils/analytics";

interface ProductDetailViewProps {
  productId: string;
  onPageChange: (page: string) => void;
  onAddToCart: (product: Product, size?: string, color?: string, quantity?: number) => void;
  onAddToWishlist: (product: Product) => void;
  onBuyNow: (product: Product, size?: string, color?: string, quantity?: number) => void;
  wishlistIds: string[];
  theme: "dark" | "light";
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  productId,
  onPageChange,
  onAddToCart,
  onAddToWishlist,
  onBuyNow,
  wishlistIds,
  theme,
}) => {
  // Find current product or fallback
  const product = PRODUCTS.find((p) => p.id === productId) || PRODUCTS[0];

  // State Management
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes ? product.sizes[1] || product.sizes[0] : "");
  const [selectedColor, setSelectedColor] = useState<string>(product.colors ? product.colors[0].name : "");
  const [quantity, setQuantity] = useState<number>(1);
  const [activeSwatchIdx, setActiveSwatchIdx] = useState<number>(0);
  const [addedMessage, setAddedMessage] = useState(false);

  // Accordion Toggles
  const [openSection, setOpenSection] = useState<"desc" | "shipping" | "materials" | null>("desc");

  // Track product view in GA4 on mount / product change
  useEffect(() => {
    trackViewItem(product);
    // Reset variants when product changes
    setSelectedSize(product.sizes ? product.sizes[1] || product.sizes[0] : "");
    setSelectedColor(product.colors ? product.colors[0].name : "");
    setQuantity(1);
    setActiveSwatchIdx(0);
  }, [product]);

  const handleQtyChange = (val: number) => {
    setQuantity((prev) => Math.max(1, prev + val));
  };

  const handleAddToCartClick = () => {
    onAddToCart(product, selectedSize || undefined, selectedColor || undefined, quantity);
    trackAddToCart(product, quantity, selectedSize, selectedColor);

    setAddedMessage(true);
    setTimeout(() => {
      setAddedMessage(false);
    }, 2500);
  };

  const handleBuyNowClick = () => {
    onBuyNow(product, selectedSize || undefined, selectedColor || undefined, quantity);
  };

  // Generate 3 thumbnail variants using rotational CSS angles on the gradient
  const swatches = [
    { name: "Signature Canvas", style: product.gradient },
    { name: "Contrast Glaze", style: product.gradient.replace("135deg", "45deg").replace("100deg", "180deg") },
    { name: "Obsidian Core", style: `linear-gradient(180deg, #1A1C23 0%, #111217 100%)` },
  ];

  const toggleAccordion = (section: "desc" | "shipping" | "materials") => {
    setOpenSection((prev) => (prev === section ? null : section));
  };

  // Get related products (same category or top rated, excluding active product)
  const relatedProducts = PRODUCTS.filter((p) => p.id !== product.id)
    .sort((a, b) => {
      if (a.category === product.category && b.category !== product.category) return -1;
      if (b.category === product.category && a.category !== product.category) return 1;
      return b.rating - a.rating;
    })
    .slice(0, 4);

  const isInWishlist = wishlistIds.includes(product.id);
  const isDark = theme === "dark";

  return (
    <div className={`transition-colors duration-300 py-8 ${isDark ? "bg-ai-bg text-ai-text" : "bg-zinc-50 text-zinc-900"}`} id="product-detail-view">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation Row */}
        <nav className="flex items-center gap-1.5 text-xs font-semibold mb-8 select-none" id="product-breadcrumbs">
          <button onClick={() => onPageChange("home")} className={`hover:text-blue-400 transition-colors cursor-pointer ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
            Home
          </button>
          <ChevronRight className={`h-3 w-3 ${isDark ? "text-zinc-700" : "text-zinc-400"}`} />
          <button onClick={() => onPageChange("shop")} className={`hover:text-blue-400 transition-colors cursor-pointer ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
            Shop Catalog
          </button>
          <ChevronRight className={`h-3 w-3 ${isDark ? "text-zinc-700" : "text-zinc-400"}`} />
          <span className={`font-medium ${isDark ? "text-zinc-400" : "text-zinc-700"}`}>{product.name}</span>
        </nav>

        {/* Core Detail Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-16" id="product-detail-core-grid">
          
          {/* LEFT: Swatch Gallery Panel (lg:col-span-7) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            
            {/* Primary active view container */}
            <div
              className="h-96 sm:h-[480px] rounded-2xl flex items-center justify-center relative overflow-hidden shadow-xl border border-zinc-800/10 dark:border-zinc-800"
              style={{ background: swatches[activeSwatchIdx].style }}
              id="active-swatch-canvas"
            >
              {/* Backglow element */}
              <div className="absolute inset-0 bg-radial from-black/5 to-black/35 pointer-events-none z-10" />
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-cover select-none"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                  }}
                />
              ) : (
                <span className="text-8xl sm:text-9xl filter drop-shadow-2xl select-none animate-bounce-slow">
                  {product.icon}
                </span>
              )}
            </div>

            {/* Thumbnail selector matrix */}
            <div className="flex gap-4" id="gallery-swatch-picker">
              {swatches.map((swatch, idx) => {
                const isActive = activeSwatchIdx === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveSwatchIdx(idx)}
                    className={`flex-1 h-20 rounded-xl flex items-center justify-center relative overflow-hidden border cursor-pointer transition-all ${
                      isActive
                        ? "border-blue-400 scale-[1.02] shadow-md ring-2 ring-blue-500/10"
                        : isDark
                        ? "border-zinc-800 bg-zinc-900/60 hover:border-zinc-700"
                        : "border-zinc-200 bg-zinc-100 hover:border-zinc-300"
                    }`}
                    id={`swatch-thumb-${idx}`}
                  >
                    <div className="absolute inset-0" style={{ background: swatch.style }} />
                    {product.image ? (
                      <div className="absolute inset-0 z-10">
                        <img
                          src={product.image}
                          alt={`${product.name} swatch`}
                          className="w-full h-full object-cover select-none opacity-80"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).style.display = "none";
                          }}
                        />
                        <div className="absolute inset-0 bg-black/10 mix-blend-multiply pointer-events-none" />
                      </div>
                    ) : (
                      <span className="text-2xl relative z-10 filter drop-shadow-xs select-none">
                        {product.icon}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* RIGHT: Product specs / Purchase panel (lg:col-span-5) */}
          <div className="lg:col-span-5 flex flex-col justify-between" id="purchase-control-panel">
            <div>
              {/* Promo badge / Bestseller banner */}
              <div className="flex items-center gap-2 mb-3">
                {product.rank && (
                  <span className="text-[10px] font-mono font-bold py-1 px-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 uppercase tracking-wide">
                    #{product.rank} Ranked Seller
                  </span>
                )}
                {product.badge && (
                  <span className="text-[10px] font-sans font-bold py-1 px-2.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-500 uppercase tracking-wide">
                    {product.badge}
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold font-heading mb-2 leading-tight" id="product-detail-title">
                {product.name}
              </h1>

              {/* Rating + review summary */}
              <div className="flex items-center gap-3 mb-6" id="product-detail-reviews-summary">
                <div className="flex items-center gap-0.5 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < Math.floor(product.rating) ? "fill-amber-400" : "text-zinc-600"}`}
                    />
                  ))}
                </div>
                <span className="text-xs font-bold font-mono text-zinc-400">{product.rating} / 5</span>
                <span className={`text-xs ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>|</span>
                <span className="text-xs font-medium underline text-zinc-400 hover:text-blue-400 cursor-pointer">
                  {product.reviewCount} user verified reviews
                </span>
              </div>

              {/* Prices Section */}
              <div className="flex items-baseline gap-3 mb-8" id="product-detail-price-box">
                <span className="font-mono text-2xl sm:text-3xl font-semibold text-blue-400">
                  ${product.price}
                </span>
                {product.originalPrice && (
                  <span className={`font-mono text-base line-through ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
                    ${product.originalPrice}
                  </span>
                )}
                {product.originalPrice && (
                  <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                    Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                  </span>
                )}
              </div>

              {/* Variant selection fields */}
              {/* 1. Apparel Sizes */}
              {product.sizes && (
                <div className="mb-6" id="product-detail-sizes-picker">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold uppercase text-zinc-400">Select Size</span>
                    <span className="text-xs font-semibold text-purple-400 underline cursor-pointer">Size Chart</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => {
                      const isSelected = selectedSize === size;
                      return (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`min-w-[42px] h-10 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                            isSelected
                              ? "border-purple-400 bg-purple-500/10 text-purple-400 shadow-xs"
                              : isDark
                              ? "border-zinc-800 bg-zinc-900/40 text-zinc-300 hover:border-zinc-700"
                              : "border-zinc-200 bg-white text-zinc-800 hover:border-zinc-300"
                          }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 2. Color variants */}
              {product.colors && (
                <div className="mb-6" id="product-detail-colors-picker">
                  <span className="text-xs font-mono font-bold uppercase text-zinc-400 block mb-2">
                    Visual Color Variant: <span className="text-blue-400 font-semibold">{selectedColor}</span>
                  </span>
                  <div className="flex gap-2.5">
                    {product.colors.map((color) => {
                      const isSelected = selectedColor === color.name;
                      return (
                        <button
                          key={color.name}
                          onClick={() => setSelectedColor(color.name)}
                          className={`w-8 h-8 rounded-full cursor-pointer transition-transform relative ${
                            isSelected ? "scale-110 ring-2 ring-purple-500/40" : "hover:scale-105"
                          }`}
                          style={{ backgroundColor: color.value }}
                          aria-label={`Select color ${color.name}`}
                        >
                          {isSelected && (
                            <span className="absolute inset-0 flex items-center justify-center text-white drop-shadow-xs">
                              <Check className="h-4 w-4" />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 3. Quantity Stepper */}
              <div className="mb-8" id="product-detail-qty-box">
                <span className="text-xs font-mono font-bold uppercase text-zinc-400 block mb-2">Quantity</span>
                <div className="flex items-center gap-3">
                  <div className={`flex items-center rounded-xl border ${isDark ? "border-zinc-800 bg-zinc-900/40" : "border-zinc-300 bg-white"}`}>
                    <button
                      onClick={() => handleQtyChange(-1)}
                      className={`p-2.5 cursor-pointer hover:opacity-85 ${quantity === 1 ? "opacity-30 cursor-not-allowed" : ""}`}
                      disabled={quantity === 1}
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-10 text-center font-mono font-bold text-sm select-none">{quantity}</span>
                    <button
                      onClick={() => handleQtyChange(1)}
                      className="p-2.5 cursor-pointer hover:opacity-85"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    In stock, dispatches immediately
                  </span>
                </div>
              </div>

              {/* BUYING ACTION MATRIX BUTTONS */}
              <div className="flex flex-col gap-3 mb-8" id="action-buttons-matrix">
                <div className="flex gap-3">
                  {/* Add to Cart */}
                  <button
                    onClick={handleAddToCartClick}
                    className={`flex-1 flex items-center justify-center gap-2 text-sm font-semibold py-3.5 px-6 rounded-xl transition-all cursor-pointer ${
                      addedMessage
                        ? "bg-emerald-600 text-white"
                        : "bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-bold"
                    }`}
                    id="add-to-cart-btn"
                  >
                    {addedMessage ? (
                      <>
                        <Check className="h-4 w-4" /> Added to Cart!
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="h-4 w-4" /> Add to Cart
                      </>
                    )}
                  </button>

                  {/* Wishlist toggle */}
                  <button
                    onClick={() => {
                      trackAddToWishlist(product);
                      onAddToWishlist(product);
                    }}
                    className={`p-3.5 rounded-xl border transition-colors cursor-pointer ${
                      isInWishlist
                        ? "bg-rose-500/10 border-rose-500/30 text-rose-500"
                        : isDark
                        ? "border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-400"
                        : "border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-600"
                    }`}
                    aria-label="Add to wishlist"
                    id="detail-wishlist-toggle-btn"
                  >
                    <Heart className="h-5 w-5" fill={isInWishlist ? "currentColor" : "none"} />
                  </button>
                </div>

                {/* Buy Now (Direct to Checkout) */}
                <button
                  onClick={handleBuyNowClick}
                  className="w-full text-sm font-bold text-white bg-linear-to-r from-blue-500 via-purple-500 to-rose-500 hover:opacity-95 transition-opacity py-3.5 px-6 rounded-xl shadow-lg cursor-pointer"
                  id="buy-now-btn"
                >
                  Buy Now (Express Checkout)
                </button>
              </div>
            </div>

            {/* EXPANDABLE ACCORDIONS */}
            <div className="border-t border-zinc-800/10 dark:border-zinc-800 pt-6" id="product-accordions">
              
              {/* Accordion 1 - Description */}
              <div className="border-b border-zinc-800/10 dark:border-zinc-800/60 pb-4 mb-4">
                <button
                  onClick={() => toggleAccordion("desc")}
                  className="w-full flex items-center justify-between text-left font-heading font-bold text-sm tracking-wide cursor-pointer"
                  id="acc-desc-btn"
                >
                  <span>PRODUCT DESCRIPTION</span>
                  {openSection === "desc" ? <ChevronDown className="h-4 w-4 text-purple-400" /> : <ChevronRight className="h-4 w-4" />}
                </button>
                {openSection === "desc" && (
                  <div className={`mt-3 text-xs leading-relaxed flex flex-col gap-2.5 ${isDark ? "text-zinc-400" : "text-zinc-600"}`} id="acc-desc-content">
                    <p>{product.description}</p>
                    <ul className="list-disc pl-4 flex flex-col gap-1.5">
                      {product.details.map((detail, idx) => (
                        <li key={idx}>{detail}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Accordion 2 - Shipping */}
              <div className="border-b border-zinc-800/10 dark:border-zinc-800/60 pb-4 mb-4">
                <button
                  onClick={() => toggleAccordion("shipping")}
                  className="w-full flex items-center justify-between text-left font-heading font-bold text-sm tracking-wide cursor-pointer"
                  id="acc-shipping-btn"
                >
                  <span>SHIPPING & RETURNS POLICY</span>
                  {openSection === "shipping" ? <ChevronDown className="h-4 w-4 text-purple-400" /> : <ChevronRight className="h-4 w-4" />}
                </button>
                {openSection === "shipping" && (
                  <div className={`mt-3 text-xs leading-relaxed flex flex-col gap-2 ${isDark ? "text-zinc-400" : "text-zinc-600"}`} id="acc-shipping-content">
                    <p>{product.shipping}</p>
                    <p>Standard delivery to United States (Mountain View hub) and India (Bengaluru hub) utilizes priority duty-prepaid local express tracks. 30-day no-stress return labels are automatically generated on support ticket open.</p>
                  </div>
                )}
              </div>

              {/* Accordion 3 - Care */}
              <div className="pb-2">
                <button
                  onClick={() => toggleAccordion("materials")}
                  className="w-full flex items-center justify-between text-left font-heading font-bold text-sm tracking-wide cursor-pointer"
                  id="acc-materials-btn"
                >
                  <span>MATERIALS & CARE INFORMATION</span>
                  {openSection === "materials" ? <ChevronDown className="h-4 w-4 text-purple-400" /> : <ChevronRight className="h-4 w-4" />}
                </button>
                {openSection === "materials" && (
                  <div className={`mt-3 text-xs leading-relaxed ${isDark ? "text-zinc-400" : "text-zinc-600"}`} id="acc-materials-content">
                    <p className="font-semibold mb-1">Composition:</p>
                    <p className="mb-2">{product.materials}</p>
                    <p className="font-semibold mb-1">Recommended Care Instructions:</p>
                    <p>Machine-wash friendly on gentle cycle using phosphate-free liquid agents. Tumble-dry low or hang-dry to preserve structural fibers and colorful print vibrancy.</p>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>

        {/* CUSTOMER REVIEWS (SPECIFIC TO PRODUCT) */}
        <section className={`py-12 border-t ${isDark ? "border-ai-border/40" : "border-zinc-200"}`} id="product-detail-reviews-list">
          <div className="flex flex-col sm:flex-row items-baseline justify-between gap-2 mb-8">
            <h2 className="text-xl sm:text-2xl font-bold font-heading">Product Verified Reviews</h2>
            <span className="text-xs font-semibold text-zinc-500">Verified buyers from United States & India hubs</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="product-specific-reviews-grid">
            {product.reviewsList.map((review) => (
              <div
                key={review.id}
                className={`p-6 rounded-xl border flex flex-col justify-between ${
                  isDark ? "bg-ai-surface border-ai-border" : "bg-white border-zinc-200"
                }`}
                id={`specific-review-${review.id}`}
              >
                <div>
                  <div className="flex items-center gap-0.5 text-amber-400 mb-3" id={`review-stars-${review.id}`}>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3.5 w-3.5 ${i < review.rating ? "fill-amber-400" : "text-zinc-600"}`}
                      />
                    ))}
                  </div>
                  <blockquote className={`text-xs sm:text-sm italic leading-relaxed mb-6 ${isDark ? "text-zinc-300" : "text-zinc-600"}`}>
                    "{review.quote}"
                  </blockquote>
                </div>
                <div className="flex items-center gap-3 border-t border-zinc-800/10 dark:border-zinc-100/10 pt-4" id={`review-author-${review.id}`}>
                  <div className="w-8 h-8 rounded-full bg-zinc-800 text-xs text-zinc-300 font-bold flex items-center justify-center">
                    {review.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <cite className={`not-italic font-bold text-xs block ${isDark ? "text-ai-text" : "text-zinc-900"}`}>
                      {review.name}
                    </cite>
                    <span className={`text-[10px] font-mono block mt-0.5 ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
                      {review.location} — {review.date}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* AI-RECOMMENDED RELATED PRODUCTS */}
        <section className={`py-12 border-t ${isDark ? "border-ai-border/40" : "border-zinc-200"}`} id="product-related-row">
          <div className="flex items-center gap-2 mb-8" id="related-badge">
            <span className="p-1 rounded-md bg-linear-to-r from-blue-500 to-rose-500 text-white">
              <ShieldCheck className="h-4 w-4" />
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-heading">AI-Recommended Related Products</h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6" id="related-products-grid">
            {relatedProducts.map((p) => (
              <div
                key={p.id}
                onClick={() => {
                  onPageChange(`product&id=${p.id}`);
                }}
                className={`group rounded-xl border p-3.5 transition-all duration-300 hover:shadow-md cursor-pointer flex flex-col justify-between ${
                  isDark ? "bg-ai-surface/40 border-ai-border hover:border-zinc-700" : "bg-white border-zinc-200 hover:border-zinc-300"
                }`}
                id={`related-card-${p.id}`}
              >
                <div>
                  <div className="h-32 sm:h-36 rounded-lg flex items-center justify-center relative overflow-hidden mb-3" style={{ background: p.gradient }}>
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                    {p.image ? (
                      <img
                        src={p.image}
                        alt={p.name}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <span className="text-4xl filter drop-shadow-sm group-hover:scale-105 transition-transform">
                        {p.icon}
                      </span>
                    )}
                  </div>

                  <h3 className={`font-semibold font-heading text-xs sm:text-sm line-clamp-1 group-hover:text-blue-400 transition-colors ${isDark ? "text-ai-text" : "text-zinc-900"}`}>
                    {p.name}
                  </h3>
                  <p className={`text-[10px] sm:text-xs font-mono uppercase tracking-wider mt-1 ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
                    {p.category}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-1 mt-3 pt-2 border-t border-zinc-800/10 dark:border-zinc-100/10">
                  <span className="font-mono text-xs font-bold text-blue-400">${p.price}</span>
                  <span className="text-[10px] font-mono text-emerald-400 font-semibold uppercase">Quick View →</span>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};
export default ProductDetailView;
