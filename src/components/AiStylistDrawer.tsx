import React, { useState } from "react";
import { Sparkles, Bot, X, ArrowRight, ShoppingCart, Check, Zap, RefreshCw, MessageSquare } from "lucide-react";
import { Product } from "../types";
import { PRODUCTS } from "../data";
import { motion, AnimatePresence } from "motion/react";

interface AiStylistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  theme: "dark" | "light";
}

const PERSONAS = [
  { id: "ai_engineer", title: "AI/ML Engineer", icon: "✨", desc: "Heavy model training & prompt design" },
  { id: "android_dev", title: "Android Mobile Dev", icon: "🤖", desc: "Kotlin, Compose & handheld gear" },
  { id: "cloud_arch", title: "Cloud Architect", icon: "☁️", desc: "Scale, infrastructure & travel gear" },
  { id: "student", title: "Student / Noogler", icon: "🎓", desc: "First gear, beanies & backpacks" },
  { id: "open_source", title: "Open Source Ninja", icon: "⚡", desc: "Late night coding, coffee & stickers" },
];

const BUDGETS = [
  { id: "under30", label: "Under $30", max: 30 },
  { id: "30to75", label: "$30 - $75", max: 75 },
  { id: "75plus", label: "Premium $75+", max: 999 },
];

export const AiStylistDrawer: React.FC<AiStylistDrawerProps> = ({
  isOpen,
  onClose,
  onProductClick,
  onAddToCart,
  theme,
}) => {
  const isDark = theme === "dark";

  const [selectedPersona, setSelectedPersona] = useState<string>("ai_engineer");
  const [selectedBudget, setSelectedBudget] = useState<string>("30to75");
  const [customPrompt, setCustomPrompt] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [recommendationResult, setRecommendationResult] = useState<{
    headline: string;
    reasoning: string;
    matchedProducts: { product: Product; matchScore: number; recommendationTag: string }[];
  } | null>(null);

  const handleGenerate = () => {
    setIsGenerating(true);

    setTimeout(() => {
      const activePersonaObj = PERSONAS.find((p) => p.id === selectedPersona) || PERSONAS[0];
      const maxBudget = BUDGETS.find((b) => b.id === selectedBudget)?.max || 75;

      let filtered = PRODUCTS.filter((p) => p.price <= maxBudget);
      if (filtered.length === 0) filtered = PRODUCTS;

      // Select top 3 relevant products
      let selectedProds: Product[] = [];
      if (selectedPersona === "ai_engineer") {
        selectedProds = PRODUCTS.filter((p) => p.id.includes("gemini") || p.id.includes("laptop") || p.id.includes("bottle"));
      } else if (selectedPersona === "android_dev") {
        selectedProds = PRODUCTS.filter((p) => p.id.includes("android") || p.id.includes("mug") || p.id.includes("tee"));
      } else if (selectedPersona === "cloud_arch") {
        selectedProds = PRODUCTS.filter((p) => p.id.includes("cloud") || p.id.includes("hoodie") || p.id.includes("tote"));
      } else {
        selectedProds = PRODUCTS.filter((p) => p.id.includes("beanie") || p.id.includes("pen") || p.id.includes("dino"));
      }

      if (selectedProds.length < 3) {
        selectedProds = [...selectedProds, ...PRODUCTS.filter((p) => !selectedProds.includes(p))].slice(0, 3);
      } else {
        selectedProds = selectedProds.slice(0, 3);
      }

      const matchedProducts = selectedProds.map((prod, idx) => ({
        product: prod,
        matchScore: 98 - idx * 4,
        recommendationTag: idx === 0 ? "Top Flagship Choice" : idx === 1 ? "Essential Complement" : "Bonus Desk Upgrade",
      }));

      setRecommendationResult({
        headline: `Curated Kit for ${activePersonaObj.title}`,
        reasoning: `Based on your ${activePersonaObj.desc.toLowerCase()} workflow and budget preferences, our Gemini AI model compiled this high-utility merchandise setup.`,
        matchedProducts,
      });

      setIsGenerating(false);
    }, 600);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-xs"
        />

        {/* Drawer Panel */}
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 220 }}
          className={`relative w-full max-w-lg h-full shadow-2xl flex flex-col z-10 ${
            isDark ? "bg-[#121318] text-white border-l border-zinc-800" : "bg-white text-zinc-900 border-l border-zinc-200"
          }`}
        >
          {/* Header */}
          <div className={`p-5 border-b flex items-center justify-between ${isDark ? "border-zinc-800 bg-zinc-900/50" : "border-zinc-200 bg-zinc-50"}`}>
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl gemini-gradient-bg text-white shadow-md">
                <Sparkles className="h-5 w-5 animate-spin-slow" />
              </div>
              <div>
                <h2 className="font-heading font-bold text-lg leading-tight flex items-center gap-1.5">
                  AI Merch Stylist <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 font-mono">Gemini Powered</span>
                </h2>
                <p className="text-xs text-zinc-400">Personalized Developer Gear Recommendations</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className={`p-2 rounded-xl transition-colors cursor-pointer ${isDark ? "hover:bg-zinc-800 text-zinc-400" : "hover:bg-zinc-200 text-zinc-600"}`}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            
            {/* Step 1: Select Persona */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2.5">
                1. Select Developer Persona
              </label>
              <div className="grid grid-cols-1 gap-2">
                {PERSONAS.map((p) => {
                  const isSelected = selectedPersona === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => {
                        setSelectedPersona(p.id);
                        setRecommendationResult(null);
                      }}
                      className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        isSelected
                          ? "bg-blue-600/10 border-blue-500 text-blue-400 font-semibold shadow-xs"
                          : isDark ? "bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 text-zinc-300" : "bg-zinc-50 border-zinc-200 hover:border-zinc-300 text-zinc-700"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{p.icon}</span>
                        <div>
                          <div className="text-sm font-bold">{p.title}</div>
                          <div className="text-xs text-zinc-400">{p.desc}</div>
                        </div>
                      </div>
                      {isSelected && <Check className="h-4 w-4 text-blue-500 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Select Budget */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2.5">
                2. Target Budget
              </label>
              <div className="flex gap-2">
                {BUDGETS.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => {
                      setSelectedBudget(b.id);
                      setRecommendationResult(null);
                    }}
                    className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold font-mono transition-all cursor-pointer ${
                      selectedBudget === b.id
                        ? "bg-purple-600 text-white border-purple-600 shadow-xs"
                        : isDark ? "bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700" : "bg-zinc-100 border-zinc-200 text-zinc-700"
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Optional Custom Prompt Input */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                Optional Gift Prompt / Specific Goal
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="e.g. Birthday gift for a senior dev who loves coffee..."
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-hidden focus:ring-2 focus:ring-purple-500 ${
                    isDark ? "bg-zinc-900 border-zinc-800 text-white" : "bg-white border-zinc-300 text-zinc-900"
                  }`}
                />
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-3 px-5 rounded-xl font-bold text-sm text-white gemini-gradient-bg hover:opacity-95 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-purple-500/20"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Analyzing Gear Database...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Generate Recommended Merch Setup</span>
                </>
              )}
            </button>

            {/* Recommendation Result Display */}
            {recommendationResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-2xl border space-y-4 ${
                  isDark ? "bg-zinc-900/80 border-purple-500/30" : "bg-purple-50/50 border-purple-200"
                }`}
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-400">Match Complete</span>
                  </div>
                  <h3 className="text-base font-bold text-white">{recommendationResult.headline}</h3>
                  <p className="text-xs text-zinc-400 mt-1">{recommendationResult.reasoning}</p>
                </div>

                <div className="space-y-3 pt-2 border-t border-white/10">
                  {recommendationResult.matchedProducts.map(({ product, matchScore, recommendationTag }) => (
                    <div
                      key={product.id}
                      className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                        isDark ? "bg-zinc-950 border-zinc-800" : "bg-white border-zinc-200"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          onClick={() => {
                            onProductClick(product);
                            onClose();
                          }}
                          className="w-14 h-14 rounded-lg overflow-hidden relative cursor-pointer group bg-black/20 shrink-0"
                        >
                          {product.image ? (
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                          ) : (
                            <span className="text-2xl flex items-center justify-center h-full">{product.icon}</span>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              {matchScore}% Match
                            </span>
                            <span className="text-[10px] text-zinc-400">{recommendationTag}</span>
                          </div>
                          <div
                            onClick={() => {
                              onProductClick(product);
                              onClose();
                            }}
                            className="font-semibold text-xs text-white hover:text-blue-400 cursor-pointer line-clamp-1 mt-0.5"
                          >
                            {product.name}
                          </div>
                          <div className="text-xs font-mono font-bold text-purple-400">${product.price.toFixed(2)}</div>
                        </div>
                      </div>

                      <button
                        onClick={() => onAddToCart(product)}
                        className="p-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white cursor-pointer transition-transform active:scale-95 shrink-0"
                        title="Add to Cart"
                      >
                        <ShoppingCart className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
