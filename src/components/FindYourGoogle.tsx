import React, { useState, useEffect } from "react";
import { Sparkles, ArrowRight, RotateCcw, Check, ShoppingBag, Sliders } from "lucide-react";
import { Product, CurrencyCode, DiscoveryPreferences } from "../types";
import { getFindYourGoogleRecommendations } from "../utils/recommendations";
import { ProductCard } from "./ProductCard";
import { trackFindYourGoogleStart, trackFindYourGoogleComplete } from "../utils/analytics";
import { motion, AnimatePresence } from "motion/react";

interface FindYourGoogleProps {
  currency: CurrencyCode;
  wishlistIds: string[];
  compareIds: string[];
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product, size?: string, color?: string) => void;
  onToggleWishlist: (product: Product) => void;
  onToggleCompare: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onPreferencesChanged?: (prefs: DiscoveryPreferences) => void;
  theme?: "dark" | "light";
}

const PURPOSES = [
  { id: "For Me", title: "For Me", desc: "Upgrading my workstation or personal style", icon: "👤" },
  { id: "For Someone Else", title: "For Someone Else", desc: "Finding a thoughtful, functional gift", icon: "🎁" },
  { id: "Something New", title: "Something New", desc: "Checking out fresh drops and new arrivals", icon: "✨" },
  { id: "Just Browsing", title: "Just Browsing", desc: "Exploring the full Google ecosystem", icon: "🔍" },
];

const INTERESTS = [
  { id: "Tech", title: "Tech & Hardware", icon: "💻" },
  { id: "Design", title: "Design & Aesthetics", icon: "🎨" },
  { id: "Gaming", title: "Gaming & Easter Eggs", icon: "👾" },
  { id: "Google Culture", title: "Google Culture", icon: "🌐" },
  { id: "Productivity", title: "Productivity & Focus", icon: "⚡" },
  { id: "Travel", title: "Travel & Commute", icon: "✈️" },
  { id: "Everyday Essentials", title: "Daily Essentials", icon: "☕" },
];

const VIBES = [
  { id: "Minimal", title: "Minimal", desc: "Clean, disciplined, understated lines", icon: "◽" },
  { id: "Playful", title: "Playful", desc: "Quirky, fun, Bugdroid & Chrome Dino", icon: "🦖" },
  { id: "Bold", title: "Bold", desc: "Vibrant Google colors and statement pieces", icon: "🔴" },
  { id: "Classic", title: "Classic", desc: "Timeless campus heritage and comfort", icon: "🏛️" },
  { id: "Creative", title: "Creative", desc: "Gemini gradients and artistic flair", icon: "🌌" },
];

export const FindYourGoogle: React.FC<FindYourGoogleProps> = ({
  currency,
  wishlistIds,
  compareIds,
  onProductClick,
  onAddToCart,
  onToggleWishlist,
  onToggleCompare,
  onQuickView,
  onPreferencesChanged,
  theme = "dark",
}) => {
  const isDark = theme === "dark";

  // Budget label generator based on currency
  const getBudgets = () => {
    if (currency === "INR") {
      return [
        { id: "Under ₹1,000", label: "Under ₹1,000", subtitle: "Pins, stickers, pens" },
        { id: "₹1,000–₹2,500", label: "₹1,000–₹2,500", subtitle: "Mugs, notebooks, bottles" },
        { id: "₹2,500–₹5,000", label: "₹2,500–₹5,000", subtitle: "Tees, caps, tech sleeves" },
        { id: "₹5,000+", label: "₹5,000+", subtitle: "Heavyweight hoodies, backpacks" },
      ];
    }
    return [
      { id: "Under ₹1,000", label: "Under $15", subtitle: "Pins, stickers, pens" },
      { id: "₹1,000–₹2,500", label: "$15–$30", subtitle: "Mugs, notebooks, bottles" },
      { id: "₹2,500–₹5,000", label: "$30–$60", subtitle: "Tees, caps, tech sleeves" },
      { id: "₹5,000+", label: "$60+", subtitle: "Heavyweight hoodies, backpacks" },
    ];
  };

  const budgets = getBudgets();

  // Wizard state
  const [step, setStep] = useState<number>(0); // 0 = not started, 1..4 = steps, 5 = results
  const [purpose, setPurpose] = useState<string>("For Me");
  const [selectedInterests, setSelectedInterests] = useState<string[]>(["Tech", "Productivity"]);
  const [vibe, setVibe] = useState<string>("Minimal");
  const [budget, setBudget] = useState<string>("₹1,000–₹2,500");
  const [results, setResults] = useState<ReturnType<typeof getFindYourGoogleRecommendations>>([]);
  const [addAllSuccess, setAddAllSuccess] = useState(false);

  // Load persisted preferences if any
  useEffect(() => {
    try {
      const saved = localStorage.getItem("merch_lab_discovery_prefs");
      if (saved) {
        const parsed: DiscoveryPreferences = JSON.parse(saved);
        if (parsed.purpose) setPurpose(parsed.purpose);
        if (parsed.interests) setSelectedInterests(parsed.interests);
        if (parsed.vibe) setVibe(parsed.vibe);
        if (parsed.budget) setBudget(parsed.budget);
        const recs = getFindYourGoogleRecommendations(parsed);
        setResults(recs);
        setStep(5); // Show results directly if previously answered
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const handleStart = () => {
    trackFindYourGoogleStart();
    setStep(1);
  };

  const toggleInterest = (id: string) => {
    if (selectedInterests.includes(id)) {
      if (selectedInterests.length > 1) {
        setSelectedInterests(selectedInterests.filter((i) => i !== id));
      }
    } else {
      setSelectedInterests([...selectedInterests, id]);
    }
  };

  const handleComplete = () => {
    const prefs: DiscoveryPreferences = {
      purpose,
      interests: selectedInterests,
      vibe,
      budget,
      timestamp: Date.now(),
    };

    try {
      localStorage.setItem("merch_lab_discovery_prefs", JSON.stringify(prefs));
    } catch (e) {
      // ignore
    }

    const recs = getFindYourGoogleRecommendations(prefs);
    setResults(recs);
    setStep(5);
    trackFindYourGoogleComplete(prefs);
    if (onPreferencesChanged) onPreferencesChanged(prefs);
  };

  const handleReset = () => {
    setStep(1);
  };

  const handleAddAll = () => {
    results.forEach(({ product }) => {
      onAddToCart(product);
    });
    setAddAllSuccess(true);
    setTimeout(() => setAddAllSuccess(false), 2000);
  };

  return (
    <section className="w-full py-12" id="find-your-google-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Intro */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-4 border bg-blue-500/10 text-blue-400 border-blue-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Discovery Flow</span>
          </div>
          <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${isDark ? "text-white" : "text-zinc-900"}`}>
            Find Your Google
          </h2>
          <p className="mt-3 text-base sm:text-lg text-zinc-400">
            Answer four quick questions about your purpose, setup, and aesthetic vibe to unlock a personalized Google merchandise capsule.
          </p>
        </div>

        {/* Wizard Container */}
        <div
          className={`rounded-3xl border p-6 sm:p-10 transition-all duration-300 ${
            isDark
              ? "bg-zinc-900/60 border-zinc-800/80 shadow-2xl shadow-black/40"
              : "bg-white border-zinc-200/80 shadow-xl shadow-zinc-200/40"
          }`}
        >
          {/* Step 0: Start Screen (If not started and no saved state) */}
          {step === 0 && (
            <div className="text-center py-10 max-w-xl mx-auto">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-blue-500 via-indigo-500 to-purple-500 flex items-center justify-center text-white text-3xl shadow-lg mb-6">
                ✨
              </div>
              <h3 className={`text-2xl font-bold mb-3 ${isDark ? "text-white" : "text-zinc-900"}`}>
                Ready to find your match?
              </h3>
              <p className="text-sm text-zinc-400 mb-8 leading-relaxed">
                Skip the generic catalogue browsing. Our intelligent discovery engine matches your daily rituals, desk setup, and personality with genuine Google culture gear.
              </p>
              <button
                onClick={handleStart}
                className="h-12 px-8 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm inline-flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all active:scale-95"
                id="btn-start-find-your-google"
              >
                <span>Start Guided Discovery</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Steps 1 to 4: Question Wizard */}
          {step >= 1 && step <= 4 && (
            <div className="max-w-3xl mx-auto">
              {/* Progress Indicator */}
              <div className="mb-8">
                <div className="flex items-center justify-between text-xs font-semibold text-zinc-400 mb-2">
                  <span>Step {step} of 4</span>
                  <span>{Math.round((step / 4) * 100)}% Complete</span>
                </div>
                <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 transition-all duration-300 rounded-full"
                    style={{ width: `${(step / 4) * 100}%` }}
                  />
                </div>
              </div>

              {/* Step 1: Purpose */}
              {step === 1 && (
                <div>
                  <h3 className={`text-xl sm:text-2xl font-bold mb-2 ${isDark ? "text-white" : "text-zinc-900"}`}>
                    1. What brings you here today?
                  </h3>
                  <p className="text-sm text-zinc-400 mb-6">
                    Tell us who you're curating for so we can tailor the collection.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {PURPOSES.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setPurpose(item.id)}
                        className={`p-5 rounded-2xl border text-left transition-all flex items-start gap-4 ${
                          purpose === item.id
                            ? isDark
                              ? "bg-blue-600/20 border-blue-500 text-white shadow-md shadow-blue-500/10"
                              : "bg-blue-50 border-blue-600 text-zinc-900 shadow-md shadow-blue-200/40"
                            : isDark
                            ? "bg-zinc-950/40 border-zinc-800 hover:border-zinc-700 text-zinc-300"
                            : "bg-zinc-50 border-zinc-200 hover:border-zinc-300 text-zinc-700"
                        }`}
                      >
                        <span className="text-2xl">{item.icon}</span>
                        <div>
                          <div className="font-semibold text-sm">{item.title}</div>
                          <div className="text-xs text-zinc-400 mt-1">{item.desc}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Interests */}
              {step === 2 && (
                <div>
                  <h3 className={`text-xl sm:text-2xl font-bold mb-2 ${isDark ? "text-white" : "text-zinc-900"}`}>
                    2. What are you into?
                  </h3>
                  <p className="text-sm text-zinc-400 mb-6">
                    Select one or more interest pillars that define your daily flow.
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {INTERESTS.map((item) => {
                      const isSelected = selectedInterests.includes(item.id);
                      return (
                        <button
                          key={item.id}
                          onClick={() => toggleInterest(item.id)}
                          className={`p-4 rounded-xl border text-left transition-all flex items-center gap-3 ${
                            isSelected
                              ? isDark
                                ? "bg-blue-600/20 border-blue-500 text-white"
                                : "bg-blue-50 border-blue-600 text-zinc-900"
                              : isDark
                              ? "bg-zinc-950/40 border-zinc-800 hover:border-zinc-700 text-zinc-400"
                              : "bg-zinc-50 border-zinc-200 hover:border-zinc-300 text-zinc-700"
                          }`}
                        >
                          <span className="text-xl">{item.icon}</span>
                          <span className="font-semibold text-xs flex-grow">{item.title}</span>
                          {isSelected && <Check className="w-4 h-4 text-blue-500 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 3: Vibe */}
              {step === 3 && (
                <div>
                  <h3 className={`text-xl sm:text-2xl font-bold mb-2 ${isDark ? "text-white" : "text-zinc-900"}`}>
                    3. Pick your aesthetic vibe
                  </h3>
                  <p className="text-sm text-zinc-400 mb-6">
                    How do you like your merchandise to express itself?
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {VIBES.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setVibe(item.id)}
                        className={`p-4 rounded-2xl border text-left transition-all flex items-center gap-4 ${
                          vibe === item.id
                            ? isDark
                              ? "bg-blue-600/20 border-blue-500 text-white shadow-sm"
                              : "bg-blue-50 border-blue-600 text-zinc-900 shadow-sm"
                            : isDark
                            ? "bg-zinc-950/40 border-zinc-800 hover:border-zinc-700 text-zinc-300"
                            : "bg-zinc-50 border-zinc-200 hover:border-zinc-300 text-zinc-700"
                        }`}
                      >
                        <span className="text-2xl">{item.icon}</span>
                        <div>
                          <div className="font-semibold text-sm">{item.title}</div>
                          <div className="text-xs text-zinc-400 mt-0.5">{item.desc}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 4: Budget */}
              {step === 4 && (
                <div>
                  <h3 className={`text-xl sm:text-2xl font-bold mb-2 ${isDark ? "text-white" : "text-zinc-900"}`}>
                    4. What's your target budget?
                  </h3>
                  <p className="text-sm text-zinc-400 mb-6">
                    We'll calibrate recommendations that respect your intended spend.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {budgets.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setBudget(item.id)}
                        className={`p-5 rounded-2xl border text-left transition-all ${
                          budget === item.id
                            ? isDark
                              ? "bg-blue-600/20 border-blue-500 text-white shadow-md shadow-blue-500/10"
                              : "bg-blue-50 border-blue-600 text-zinc-900 shadow-md shadow-blue-200/40"
                            : isDark
                            ? "bg-zinc-950/40 border-zinc-800 hover:border-zinc-700 text-zinc-300"
                            : "bg-zinc-50 border-zinc-200 hover:border-zinc-300 text-zinc-700"
                        }`}
                      >
                        <div className="font-bold text-base">{item.label}</div>
                        <div className="text-xs text-zinc-400 mt-1">{item.subtitle}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Navigation CTAs */}
              <div className="flex items-center justify-between mt-10 pt-6 border-t border-zinc-800/40">
                <button
                  onClick={() => setStep(step - 1)}
                  className="px-5 py-2.5 rounded-xl border border-zinc-700 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
                >
                  Back
                </button>

                {step < 4 ? (
                  <button
                    onClick={() => setStep(step + 1)}
                    className="h-11 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs inline-flex items-center gap-2 shadow-md transition-all active:scale-95"
                  >
                    <span>Next</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleComplete}
                    className="h-11 px-7 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:opacity-95 text-white font-semibold text-xs inline-flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all active:scale-95"
                    id="btn-generate-curated-picks"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Generate My Capsule</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Step 5: Personalized Results View */}
          {step === 5 && (
            <div>
              {/* Summary Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-zinc-800/50">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                      Tailored Match Found
                    </span>
                  </div>
                  <h3 className={`text-2xl font-bold ${isDark ? "text-white" : "text-zinc-900"}`}>
                    Your Curated Google Capsule
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className="text-xs px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium">
                      {purpose}
                    </span>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 font-medium">
                      {vibe} Aesthetic
                    </span>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-medium">
                      {selectedInterests.slice(0, 2).join(" & ")}
                    </span>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                      {budgets.find((b) => b.id === budget)?.label || budget}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleReset}
                    className="h-10 px-4 rounded-xl border border-zinc-700 text-xs font-semibold text-zinc-300 hover:text-white hover:border-zinc-600 transition-colors inline-flex items-center gap-2"
                    title="Retake discovery quiz"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Retake Quiz</span>
                  </button>

                  <button
                    onClick={handleAddAll}
                    disabled={addAllSuccess}
                    className={`h-10 px-5 rounded-xl font-semibold text-xs inline-flex items-center gap-2 shadow-md transition-all active:scale-95 ${
                      addAllSuccess
                        ? "bg-emerald-600 text-white"
                        : "bg-blue-600 hover:bg-blue-500 text-white"
                    }`}
                    id="btn-add-all-find-your-google"
                  >
                    {addAllSuccess ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>All Added to Bag!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>Add Capsule to Bag</span>
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
          )}
        </div>
      </div>
    </section>
  );
};
