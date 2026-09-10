import React, { useState } from "react";
import { Sparkles, ShoppingBag, Check, Tag } from "lucide-react";
import { Product } from "../types";
import { motion } from "motion/react";

interface CustomizerStudioProps {
  onAddToCart: (product: Product, size?: string, color?: string, quantity?: number, customDesign?: any) => void;
  onPageChange: (page: string) => void;
  theme: "dark" | "light";
  onAddXp?: (amount: number, reason: string) => void;
}

const BASE_ITEMS = [
  {
    id: "hoodie",
    name: "Developer Heavyweight Hoodie",
    category: "Apparel",
    basePrice: 78.0,
    gradient: "linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)",
    icon: "🧥",
    description: "360 GSM heavy cotton fleece with customizable chest text and tech badge print.",
    sizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL"],
  },
  {
    id: "tee",
    name: "Google Organic Developer Tee",
    category: "Apparel",
    basePrice: 38.0,
    gradient: "linear-gradient(135deg, #EA4335 0%, #B31412 100%)",
    icon: "👕",
    description: "Ring-spun ultra-soft combed cotton canvas tailored for developer comfort.",
    sizes: ["XS", "S", "M", "L", "XL", "2XL"],
  },
  {
    id: "bottle",
    name: "Obsidian Smart Vacuum Bottle",
    category: "Accessories",
    basePrice: 42.0,
    gradient: "linear-gradient(135deg, #00C6FF 0%, #0072FF 100%)",
    icon: "💧",
    description: "Laser-etched thermal flask with temperature display cap and laser graphic print.",
    sizes: ["24 oz / 750ml"],
  },
  {
    id: "sleeve",
    name: "Shockproof Neoprene Laptop Sleeve",
    category: "Tech Gear",
    basePrice: 46.0,
    gradient: "linear-gradient(135deg, #1F2937 0%, #111827 100%)",
    icon: "💻",
    description: "3D impact-diffusing air padding with custom badge trim for 14-16 inch devices.",
    sizes: ["13-14 inch", "15-16 inch"],
  },
  {
    id: "mug",
    name: "Pixel Speckled Ceramic Mug",
    category: "Drinkware",
    basePrice: 28.0,
    gradient: "linear-gradient(135deg, #1E40AF 0%, #1E3A8A 100%)",
    icon: "☕",
    description: "15oz heavy artisan ceramic mug with custom laser logo and code quote overlay.",
    sizes: ["15 oz / 450ml"],
  },
  {
    id: "notebook",
    name: "Gemini Hardbound Grid Journal",
    category: "Stationery",
    basePrice: 24.0,
    gradient: "linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)",
    icon: "📓",
    description: "120 GSM acid-free dot grid paper with metallic foiled custom cover imprint.",
    sizes: ["A5 Standard"],
  },
];

const GARMENT_COLORS = [
  { name: "Obsidian Black", hex: "#111827", textColor: "#FFFFFF" },
  { name: "Google Red", hex: "#DC2626", textColor: "#FFFFFF" },
  { name: "Google Blue", hex: "#2563EB", textColor: "#FFFFFF" },
  { name: "Google Green", hex: "#059669", textColor: "#FFFFFF" },
  { name: "Google Yellow", hex: "#D97706", textColor: "#FFFFFF" },
  { name: "Gemini Purple", hex: "#7C3AED", textColor: "#FFFFFF" },
  { name: "Crisp White", hex: "#F9FAFB", textColor: "#111827" },
  { name: "Heather Slate", hex: "#4B5563", textColor: "#FFFFFF" },
];

const BADGES = [
  { id: "gemini", name: "Gemini Constellation", icon: "✨", tag: "AI / Gemini" },
  { id: "google", name: "Classic Google G", icon: "🌐", tag: "Google" },
  { id: "android", name: "Android Bot Emblem", icon: "🤖", tag: "Android" },
  { id: "dino", name: "Chrome Dino Pixel", icon: "🦖", tag: "Chrome" },
  { id: "cloud", name: "Google Cloud Node", icon: "☁️", tag: "Cloud" },
  { id: "noogler", name: "Noogler Propeller", icon: "🎓", tag: "Noogler" },
  { id: "code", name: "Terminal Code Brackets", icon: "⚡", tag: "Dev" },
];

const FONT_STYLES = [
  { id: "mono", name: "Monospace Code", fontClass: "font-mono" },
  { id: "sans", name: "Modern Sans Bold", fontClass: "font-sans font-bold tracking-tight" },
  { id: "serif", name: "Editorial Serif", fontClass: "font-serif italic" },
  { id: "retro", name: "Retro Pixel", fontClass: "font-mono uppercase tracking-widest font-black" },
];

const PRESET_QUOTES = [
  "const dev = new Noogler();",
  "git commit -m 'Ship it! 🚀'",
  "Powered by Gemini 1.5 Pro",
  "Works on my local container",
  "Hello, World! // Google Dev",
  "Deploy to Cloud Run",
];

export const CustomizerStudio: React.FC<CustomizerStudioProps> = ({
  onAddToCart,
  theme,
  onAddXp,
}) => {
  const isDark = theme === "dark";

  const [selectedItemId, setSelectedItemId] = useState<string>("hoodie");
  const [selectedColor, setSelectedColor] = useState(GARMENT_COLORS[0]);
  const [customText, setCustomText] = useState<string>("const dev = new Noogler();");
  const [fontStyle, setFontStyle] = useState<"mono" | "sans" | "serif" | "retro">("mono");
  const [textColor, setTextColor] = useState<string>("#FFFFFF");
  const [selectedBadge, setSelectedBadge] = useState(BADGES[0]);
  const [selectedSize, setSelectedSize] = useState<string>("L");
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<"item" | "color" | "text" | "badge">("item");

  const currentItem = BASE_ITEMS.find((item) => item.id === selectedItemId) || BASE_ITEMS[0];
  const activeFont = FONT_STYLES.find((f) => f.id === fontStyle) || FONT_STYLES[0];

  const handleAddToCart = () => {
    const customId = `custom-${selectedItemId}-${Date.now()}`;
    const customProduct: Product = {
      id: customId,
      name: `Custom ${currentItem.name}`,
      category: "Custom Studio",
      price: currentItem.basePrice,
      rating: 5.0,
      reviewCount: 1,
      badge: "Custom Edition",
      gradient: currentItem.gradient,
      icon: currentItem.icon,
      description: `Customized with badge "${selectedBadge.name}" and text "${customText}" in ${selectedColor.name}.`,
      details: [
        `Base Model: ${currentItem.name}`,
        `Colorway: ${selectedColor.name}`,
        `Chest Print: ${customText}`,
        `Emblem Badge: ${selectedBadge.name}`,
        `Garment Size: ${selectedSize}`,
      ],
      materials: "Custom Print-On-Demand Certified Organic & Eco Recycled Blend",
      shipping: "Customized & Hand-Printed in 48 hours with Express Delivery",
      sizes: currentItem.sizes,
      reviewsList: [],
      tags: ["Custom", "Studio", "Personalized", currentItem.name],
      audience: ["Developers", "Designers", "Custom Creators"],
      useCases: ["Custom Gift", "Personalized Style", "Team Gear"],
      ecosystem: "Google",
      style: "Creative",
      moods: ["creator-mode", "desk-day"],
      complementaryProductIds: ["stickers-dev-pack", "dino-plush-desk"],
      keyFeatures: [
        "Unique custom print on demand",
        "Selectable typographic style and emblems",
        "High-density organic cotton feel"
      ],
      intendedUse: "Personalized Google Merch Lab custom creation tailored to your taste.",
    };

    const customDesignData = {
      itemType: currentItem.name,
      customText,
      textColor,
      fontStyle: activeFont.name,
      badgeIcon: selectedBadge.icon,
      badgeName: selectedBadge.name,
      baseColorName: selectedColor.name,
      baseColorHex: selectedColor.hex,
      previewSummary: `${selectedColor.name} | ${selectedBadge.icon} ${selectedBadge.name} | "${customText}"`,
    };

    onAddToCart(customProduct, selectedSize, selectedColor.name, quantity, customDesignData);

    if (onAddXp) {
      onAddXp(150, "Customized Gear in Merch Studio!");
    }
  };

  return (
    <div className={`min-h-screen py-10 transition-colors ${isDark ? "bg-[#0E0F13]" : "bg-zinc-50"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-3 gemini-gradient-bg text-white shadow-md">
            <Sparkles className="h-3.5 w-3.5 animate-spin-slow" />
            <span>Interactive Custom Merch Studio</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-heading font-extrabold tracking-tight mb-3">
            Design Your Own <span className="gemini-gradient-text">Google Dev Gear</span>
          </h1>
          <p className={`text-base sm:text-lg ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
            Pick your base model, customize colors, type your code snippet or tagline, and select signature Google badges in real-time.
          </p>
        </div>

        {/* Main 2-Column Customizer Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: 2D Interactive Canvas Preview (Column 7) */}
          <div className="lg:col-span-7 sticky top-24">
            <div
              className={`rounded-3xl p-6 sm:p-10 border relative overflow-hidden transition-all shadow-xl flex flex-col items-center justify-center min-h-[460px] sm:min-h-[540px] ${
                isDark ? "bg-zinc-900/90 border-zinc-800" : "bg-white border-zinc-200"
              }`}
            >
              {/* Subtle background grid pattern */}
              <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                  backgroundImage: `radial-gradient(circle, ${isDark ? "#ffffff" : "#000000"} 1px, transparent 1px)`,
                  backgroundSize: "24px 24px",
                }}
              />

              {/* Dynamic Badges Overlay Pill */}
              <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-blue-500/10 text-blue-500 border border-blue-500/20">
                  {currentItem.name}
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-zinc-500/10 text-zinc-400 border border-zinc-500/20">
                  Size: {selectedSize}
                </span>
              </div>

              {/* Price Tag Pill */}
              <div className="absolute top-4 right-4 z-10 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-mono font-bold text-sm px-3.5 py-1 rounded-full flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5" />
                <span>${(currentItem.basePrice * quantity).toFixed(2)}</span>
              </div>

              {/* Dynamic Product Visual Container */}
              <motion.div
                key={`${selectedItemId}-${selectedColor.hex}`}
                initial={{ scale: 0.95, opacity: 0.8 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="relative w-72 sm:w-96 h-72 sm:h-96 rounded-3xl flex items-center justify-center shadow-2xl p-8 border border-white/10"
                style={{ backgroundColor: selectedColor.hex }}
              >
                {/* Visual Icon Illustration for garment/bottle */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 text-[180px] sm:text-[220px] select-none">
                  {currentItem.icon}
                </div>

                {/* Print Area Bounds Box */}
                <div className="relative z-10 w-full h-full border-2 border-dashed border-white/30 rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-4 bg-black/20 backdrop-blur-xs shadow-inner">
                  
                  {/* Selected Badge Emblem */}
                  <motion.div
                    key={selectedBadge.id}
                    initial={{ scale: 0.5, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="p-3 rounded-2xl bg-white/15 backdrop-blur-md shadow-lg border border-white/30 flex items-center justify-center"
                  >
                    <span className="text-4xl sm:text-5xl select-none filter drop-shadow-md">
                      {selectedBadge.icon}
                    </span>
                  </motion.div>

                  {/* Custom Print Text */}
                  <div className="max-w-[85%] overflow-hidden">
                    <p
                      className={`text-sm sm:text-base leading-snug break-words drop-shadow-md ${activeFont.fontClass}`}
                      style={{ color: textColor }}
                    >
                      {customText || "Your Custom Line Here"}
                    </p>
                  </div>

                  {/* Micro Branding Mark */}
                  <div className="text-[10px] uppercase font-mono tracking-widest text-white/60 font-semibold pt-1 border-t border-white/20">
                    Official Google Dev Studio
                  </div>
                </div>
              </motion.div>

              {/* Live Preview Summary Bar */}
              <div className={`mt-6 text-xs text-center font-mono py-2 px-4 rounded-xl border ${isDark ? "bg-zinc-800/60 border-zinc-700/60 text-zinc-400" : "bg-zinc-100 border-zinc-200 text-zinc-600"}`}>
                <span>Selected: </span>
                <span className="font-semibold text-blue-500">{selectedColor.name}</span>
                <span> • Badge: </span>
                <span className="font-semibold text-purple-500">{selectedBadge.name}</span>
              </div>
            </div>
          </div>

          {/* RIGHT: Customization Controls (Column 5) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Customizer Step Navigation Tabs */}
            <div className={`flex rounded-2xl p-1.5 border ${isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"}`}>
              <button
                onClick={() => setActiveTab("item")}
                className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === "item"
                    ? "bg-blue-600 text-white shadow-md"
                    : isDark ? "text-zinc-400 hover:text-white" : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                1. Item
              </button>
              <button
                onClick={() => setActiveTab("color")}
                className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === "color"
                    ? "bg-blue-600 text-white shadow-md"
                    : isDark ? "text-zinc-400 hover:text-white" : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                2. Color
              </button>
              <button
                onClick={() => setActiveTab("text")}
                className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === "text"
                    ? "bg-blue-600 text-white shadow-md"
                    : isDark ? "text-zinc-400 hover:text-white" : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                3. Text
              </button>
              <button
                onClick={() => setActiveTab("badge")}
                className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === "badge"
                    ? "bg-blue-600 text-white shadow-md"
                    : isDark ? "text-zinc-400 hover:text-white" : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                4. Badge
              </button>
            </div>

            {/* TAB CONTENT 1: Item Selection */}
            {activeTab === "item" && (
              <div className="space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400">Select Base Garment / Gear</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {BASE_ITEMS.map((item) => {
                    const isSelected = selectedItemId === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setSelectedItemId(item.id);
                          setSelectedSize(item.sizes[0]);
                        }}
                        className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer flex items-start gap-3 ${
                          isSelected
                            ? "bg-blue-500/10 border-blue-500 text-blue-500 shadow-md ring-1 ring-blue-500/30"
                            : isDark ? "bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 text-zinc-200" : "bg-white border-zinc-200 hover:border-zinc-300 text-zinc-800"
                        }`}
                      >
                        <span className="text-3xl p-2 rounded-xl bg-black/20 shrink-0">{item.icon}</span>
                        <div>
                          <div className="font-semibold text-sm line-clamp-1">{item.name}</div>
                          <div className="text-xs font-mono font-bold mt-0.5 text-blue-400">${item.basePrice.toFixed(2)}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB CONTENT 2: Color & Size Selection */}
            {activeTab === "color" && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400 mb-3">Select Base Colorway</h3>
                  <div className="grid grid-cols-4 gap-2.5">
                    {GARMENT_COLORS.map((c) => {
                      const isSelected = selectedColor.hex === c.hex;
                      return (
                        <button
                          key={c.name}
                          onClick={() => setSelectedColor(c)}
                          className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                            isSelected
                              ? "border-blue-500 ring-2 ring-blue-500/40 bg-blue-500/10"
                              : isDark ? "bg-zinc-900 border-zinc-800 hover:border-zinc-700" : "bg-white border-zinc-200 hover:border-zinc-300"
                          }`}
                        >
                          <span
                            className="w-8 h-8 rounded-full border border-white/20 shadow-xs flex items-center justify-center text-xs"
                            style={{ backgroundColor: c.hex }}
                          >
                            {isSelected && <Check className="h-4 w-4" style={{ color: c.textColor }} />}
                          </span>
                          <span className="text-[10px] font-medium text-center line-clamp-1">{c.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400 mb-2">Select Size</h3>
                  <div className="flex flex-wrap gap-2">
                    {currentItem.sizes.map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setSelectedSize(sz)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer border ${
                          selectedSize === sz
                            ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                            : isDark ? "bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700" : "bg-white border-zinc-200 text-zinc-700 hover:border-zinc-300"
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT 3: Text & Typography */}
            {activeTab === "text" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold uppercase tracking-wider text-zinc-400 mb-2">Custom Code Snippet / Text</label>
                  <input
                    type="text"
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    maxLength={40}
                    placeholder="Type your line (e.g. const dev = true;)"
                    className={`w-full px-4 py-3 rounded-xl border text-sm font-mono focus:outline-hidden focus:ring-2 focus:ring-blue-500 ${
                      isDark ? "bg-zinc-900 border-zinc-800 text-white" : "bg-white border-zinc-300 text-zinc-900"
                    }`}
                  />
                  <div className="text-[11px] text-zinc-500 mt-1 flex justify-between">
                    <span>Max 40 characters</span>
                    <span>{customText.length}/40</span>
                  </div>
                </div>

                {/* Quick Presets */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Quick Presets</label>
                  <div className="flex flex-wrap gap-1.5">
                    {PRESET_QUOTES.map((q) => (
                      <button
                        key={q}
                        onClick={() => setCustomText(q)}
                        className={`text-xs px-2.5 py-1 rounded-lg border transition-all cursor-pointer font-mono ${
                          customText === q
                            ? "bg-blue-500/20 text-blue-400 border-blue-500/40"
                            : isDark ? "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white" : "bg-zinc-100 border-zinc-200 text-zinc-600 hover:text-zinc-900"
                        }`}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Font Style */}
                <div>
                  <label className="block text-sm font-bold uppercase tracking-wider text-zinc-400 mb-2">Typography Font</label>
                  <div className="grid grid-cols-2 gap-2">
                    {FONT_STYLES.map((f) => (
                      <button
                        key={f.id}
                        onClick={() => setFontStyle(f.id as any)}
                        className={`p-2.5 rounded-xl border text-xs text-left transition-all cursor-pointer ${
                          fontStyle === f.id
                            ? "bg-blue-500/10 border-blue-500 text-blue-400 font-bold"
                            : isDark ? "bg-zinc-900 border-zinc-800 text-zinc-300" : "bg-white border-zinc-200 text-zinc-800"
                        }`}
                      >
                        <span className={`block text-sm mb-0.5 ${f.fontClass}`}>Aa Code</span>
                        <span className="text-[11px] opacity-70">{f.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Text Color */}
                <div>
                  <label className="block text-sm font-bold uppercase tracking-wider text-zinc-400 mb-2">Text Print Color</label>
                  <div className="flex gap-2">
                    {["#FFFFFF", "#111827", "#3B82F6", "#EC4899", "#10B981", "#F59E0B"].map((hex) => (
                      <button
                        key={hex}
                        onClick={() => setTextColor(hex)}
                        className={`w-8 h-8 rounded-full border-2 transition-transform cursor-pointer ${
                          textColor === hex ? "scale-110 border-blue-500 shadow-md" : "border-white/20"
                        }`}
                        style={{ backgroundColor: hex }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT 4: Emblem Badge */}
            {activeTab === "badge" && (
              <div className="space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400">Select Google Brand Emblem</h3>
                <div className="grid grid-cols-2 gap-2.5">
                  {BADGES.map((b) => {
                    const isSelected = selectedBadge.id === b.id;
                    return (
                      <button
                        key={b.id}
                        onClick={() => setSelectedBadge(b)}
                        className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                          isSelected
                            ? "bg-purple-500/10 border-purple-500 text-purple-400 shadow-md ring-1 ring-purple-500/30"
                            : isDark ? "bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700" : "bg-white border-zinc-200 text-zinc-800"
                        }`}
                      >
                        <span className="text-3xl p-1.5 rounded-xl bg-black/20 shrink-0">{b.icon}</span>
                        <div>
                          <div className="font-bold text-xs">{b.name}</div>
                          <span className="text-[10px] opacity-60 font-mono">{b.tag}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Bottom Add to Cart CTA */}
            <div className={`p-4 rounded-2xl border ${isDark ? "bg-zinc-900/90 border-zinc-800" : "bg-white border-zinc-200"}`}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-xs text-zinc-400">Custom Creation Total</div>
                  <div className="text-2xl font-extrabold font-mono text-emerald-400">
                    ${(currentItem.basePrice * quantity).toFixed(2)}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-zinc-400">Qty:</span>
                  <div className="flex items-center border border-zinc-700 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-2.5 py-1 text-xs hover:bg-zinc-800 cursor-pointer"
                    >
                      -
                    </button>
                    <span className="px-3 text-xs font-bold font-mono">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-2.5 py-1 text-xs hover:bg-zinc-800 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className="w-full py-3.5 px-6 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-md flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-98"
              >
                <ShoppingBag className="h-5 w-5" />
                <span>Add Custom Design to Cart (+150 XP)</span>
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
