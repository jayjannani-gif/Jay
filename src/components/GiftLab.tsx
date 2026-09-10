import React, { useState, useEffect } from "react";
import { Gift, Sparkles, Share2, ShoppingBag, Heart, ArrowRight, RotateCcw, Check, Copy } from "lucide-react";
import { Product, CurrencyCode, GiftPreferences } from "../types";
import { getGiftLabRecommendations } from "../utils/recommendations";
import { ProductCard } from "./ProductCard";
import { trackGiftLabStart, trackGiftLabComplete } from "../utils/analytics";
import { motion, AnimatePresence } from "motion/react";

interface GiftLabProps {
  currency: CurrencyCode;
  wishlistIds: string[];
  compareIds: string[];
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product, size?: string, color?: string) => void;
  onToggleWishlist: (product: Product) => void;
  onToggleCompare: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onShowToast?: (text: string, type?: "success" | "error" | "info") => void;
  theme?: "dark" | "light";
}

const RECIPIENTS = [
  { id: "Colleague", name: "Colleague / Coworker", icon: "💼", hint: "Desk upgrades & stationery" },
  { id: "Student", name: "Student / Intern", icon: "🎓", hint: "Backpacks, beanies & pins" },
  { id: "Google Fan", name: "Google Enthusiast", icon: "🤖", hint: "Collector icons & Bugdroid" },
  { id: "Friend", name: "Friend", icon: "🤝", hint: "Fun collectibles & casual wear" },
  { id: "Partner", name: "Partner", icon: "❤️", hint: "Cozy fleece & premium drinkware" },
  { id: "Parent", name: "Parent", icon: "🏡", hint: "Comfort apparel & ceramic mugs" },
  { id: "Myself", name: "Myself", icon: "✨", hint: "Self-reward developer treats" },
];

const GIFT_INTERESTS = [
  { id: "Tech", title: "Tech & Coding", icon: "⚡" },
  { id: "Design", title: "Design & Aesthetics", icon: "🎨" },
  { id: "Gaming", title: "Gaming & Easter Eggs", icon: "👾" },
  { id: "Travel", title: "Travel & Commute", icon: "✈️" },
  { id: "Productivity", title: "Productivity & Focus", icon: "📑" },
  { id: "Google", title: "Google Culture", icon: "🌐" },
  { id: "Lifestyle", title: "Everyday Lifestyle", icon: "☕" },
];

export const GiftLab: React.FC<GiftLabProps> = ({
  currency,
  wishlistIds,
  compareIds,
  onProductClick,
  onAddToCart,
  onToggleWishlist,
  onToggleCompare,
  onQuickView,
  onShowToast,
  theme = "dark",
}) => {
  const isDark = theme === "dark";

  const getBudgets = () => {
    if (currency === "INR") {
      return [
        { id: "Under ₹1,000", label: "Under ₹1,000", desc: "Token gifts, pins & stickers" },
        { id: "₹1,000–₹2,500", label: "₹1,000–₹2,500", desc: "Mugs, notebooks & flasks" },
        { id: "₹2,500–₹5,000", label: "₹2,500–₹5,000", desc: "Tees, caps & tech sleeves" },
        { id: "₹5,000+", label: "₹5,000+", desc: "Heavyweight hoodies & bags" },
      ];
    }
    return [
      { id: "Under ₹1,000", label: "Under $15", desc: "Token gifts, pins & stickers" },
      { id: "₹1,000–₹2,500", label: "$15–$30", desc: "Mugs, notebooks & flasks" },
      { id: "₹2,500–₹5,000", label: "$30–$60", desc: "Tees, caps & tech sleeves" },
      { id: "₹5,000+", label: "$60+", desc: "Heavyweight hoodies & bags" },
    ];
  };

  const budgets = getBudgets();

  const [step, setStep] = useState<number>(1);
  const [recipient, setRecipient] = useState<string>("Colleague");
  const [budget, setBudget] = useState<string>("₹1,000–₹2,500");
  const [selectedInterests, setSelectedInterests] = useState<string[]>(["Tech", "Productivity"]);
  const [results, setResults] = useState<ReturnType<typeof getGiftLabRecommendations>>([]);
  const [isGenerated, setIsGenerated] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [addAllSuccess, setAddAllSuccess] = useState(false);

  // Trigger start event on mount
  useEffect(() => {
    trackGiftLabStart();
    // Pre-calculate initial preview
    const initialRecs = getGiftLabRecommendations({
      recipient,
      budget,
      interests: selectedInterests,
    });
    setResults(initialRecs);
  }, []);

  const toggleInterest = (id: string) => {
    if (selectedInterests.includes(id)) {
      if (selectedInterests.length > 1) {
        setSelectedInterests(selectedInterests.filter((i) => i !== id));
      }
    } else {
      setSelectedInterests([...selectedInterests, id]);
    }
  };

  const handleGenerate = () => {
    const prefs: GiftPreferences = {
      recipient,
      budget,
      interests: selectedInterests,
      timestamp: Date.now(),
    };

    const recs = getGiftLabRecommendations(prefs);
    setResults(recs);
    setIsGenerated(true);
    trackGiftLabComplete(prefs);
    if (onShowToast) {
      onShowToast(`Curated ${recs.length} personalized gifts for your ${recipient}!`, "success");
    }
  };

  const handleAddAllBundle = () => {
    results.forEach(({ product }) => {
      onAddToCart(product);
    });
    setAddAllSuccess(true);
    setTimeout(() => setAddAllSuccess(false), 2000);
    if (onShowToast) {
      onShowToast("Added entire gift bundle to your bag!", "success");
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
      if (onShowToast) {
        onShowToast("Gift collection link copied to clipboard!", "success");
      }
    }
  };

  return (
    <section className="w-full py-12" id="gift-lab-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-4 border bg-rose-500/10 text-rose-400 border-rose-500/20">
            <Gift className="w-3.5 h-3.5" />
            <span>Dedicated Gifting Engine</span>
          </div>
          <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${isDark ? "text-white" : "text-zinc-900"}`}>
            Gift Lab
          </h2>
          <p className="mt-3 text-base sm:text-lg text-zinc-400">
            Give something authentic. Select the recipient, your spending budget, and their interests to reveal gifts with clear reasoning.
          </p>
        </div>

        {/* Gifting Selector Box */}
        <div
          className={`rounded-3xl border p-6 sm:p-8 mb-10 transition-all ${
            isDark
              ? "bg-zinc-900/60 border-zinc-800/80 shadow-2xl shadow-black/40"
              : "bg-white border-zinc-200/80 shadow-xl shadow-zinc-200/40"
          }`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 1. Recipient */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-6 h-6 rounded-full bg-blue-600/20 text-blue-400 text-xs font-bold flex items-center justify-center">1</span>
                <h3 className={`text-sm font-bold uppercase tracking-wider ${isDark ? "text-zinc-200" : "text-zinc-800"}`}>
                  Who are you shopping for?
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
                {RECIPIENTS.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setRecipient(item.id);
                      setIsGenerated(false);
                    }}
                    className={`p-3 rounded-xl border text-left transition-all flex items-center gap-3 ${
                      recipient === item.id
                        ? isDark
                          ? "bg-rose-600/20 border-rose-500 text-white shadow-sm"
                          : "bg-rose-50 border-rose-500 text-zinc-900 shadow-sm"
                        : isDark
                        ? "bg-zinc-950/40 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-white"
                        : "bg-zinc-50 border-zinc-200 text-zinc-700 hover:border-zinc-300"
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <div className="flex-grow">
                      <div className="font-semibold text-xs">{item.name}</div>
                      <div className="text-[10px] text-zinc-500">{item.hint}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Budget */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-6 h-6 rounded-full bg-blue-600/20 text-blue-400 text-xs font-bold flex items-center justify-center">2</span>
                <h3 className={`text-sm font-bold uppercase tracking-wider ${isDark ? "text-zinc-200" : "text-zinc-800"}`}>
                  What is your budget?
                </h3>
              </div>
              <div className="flex flex-col gap-2.5">
                {budgets.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setBudget(item.id);
                      setIsGenerated(false);
                    }}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      budget === item.id
                        ? isDark
                          ? "bg-rose-600/20 border-rose-500 text-white shadow-sm"
                          : "bg-rose-50 border-rose-500 text-zinc-900 shadow-sm"
                        : isDark
                        ? "bg-zinc-950/40 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-white"
                        : "bg-zinc-50 border-zinc-200 text-zinc-700 hover:border-zinc-300"
                    }`}
                  >
                    <div className="font-bold text-sm">{item.label}</div>
                    <div className="text-xs text-zinc-500 mt-0.5">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Interests & Curate Trigger */}
            <div className="flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-6 h-6 rounded-full bg-blue-600/20 text-blue-400 text-xs font-bold flex items-center justify-center">3</span>
                  <h3 className={`text-sm font-bold uppercase tracking-wider ${isDark ? "text-zinc-200" : "text-zinc-800"}`}>
                    What are they into?
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {GIFT_INTERESTS.map((item) => {
                    const isSelected = selectedInterests.includes(item.id);
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          toggleInterest(item.id);
                          setIsGenerated(false);
                        }}
                        className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-center gap-2 ${
                          isSelected
                            ? isDark
                              ? "bg-rose-600/20 border-rose-500 text-white font-medium"
                              : "bg-rose-50 border-rose-500 text-zinc-900 font-medium"
                            : isDark
                            ? "bg-zinc-950/40 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-white"
                            : "bg-zinc-50 border-zinc-200 text-zinc-600 hover:border-zinc-300"
                        }`}
                      >
                        <span>{item.icon}</span>
                        <span className="truncate flex-grow">{item.title}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-rose-500 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Generate CTA Button */}
              <div className="mt-6 pt-4 border-t border-zinc-800/40">
                <button
                  onClick={handleGenerate}
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 hover:opacity-95 text-white font-semibold text-xs uppercase tracking-wider shadow-lg shadow-rose-600/20 transition-all flex items-center justify-center gap-2 active:scale-98"
                  id="btn-generate-gift-recs"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Curate Gift Recommendations</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Showcase Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className={`text-xl font-bold ${isDark ? "text-white" : "text-zinc-900"}`}>
              Recommended Gifts for your {recipient}
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              Budget: <strong className="text-zinc-300 font-semibold">{budgets.find((b) => b.id === budget)?.label || budget}</strong> • Aligned with {selectedInterests.join(", ")}
            </p>
          </div>

          {/* Action Row: Add Entire Bundle + Share */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleShare}
              className="h-9 px-3.5 rounded-xl border border-zinc-700 text-xs font-semibold text-zinc-300 hover:text-white hover:border-zinc-600 transition-colors inline-flex items-center gap-2"
              title="Share gift collection"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedLink ? "Link Copied!" : "Share Gift List"}</span>
            </button>

            <button
              onClick={handleAddAllBundle}
              disabled={addAllSuccess}
              className={`h-9 px-4 rounded-xl font-semibold text-xs inline-flex items-center gap-2 shadow-md transition-all active:scale-95 ${
                addAllSuccess
                  ? "bg-emerald-600 text-white"
                  : "bg-rose-600 hover:bg-rose-500 text-white"
              }`}
              id="btn-add-all-gift-bundle"
            >
              {addAllSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Bundle Added!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add Entire Gift Bundle</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map(({ product, reason }) => (
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
              reason={reason}
              theme={theme}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
