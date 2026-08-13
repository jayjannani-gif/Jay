import React, { useState } from "react";
import { Sparkles, ArrowRight, ArrowLeft, RefreshCw, ShoppingCart, Heart, Check } from "lucide-react";
import { Product } from "../types";
import { PRODUCTS } from "../data";
import { motion, AnimatePresence } from "motion/react";

interface QuizProps {
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product, size?: string, color?: string) => void;
  onAddToWishlist: (product: Product) => void;
  wishlistIds: string[];
  cartIds: string[];
  theme: "dark" | "light";
}

interface Question {
  id: string;
  title: string;
  subtitle: string;
  options: {
    label: string;
    description: string;
    icon: string;
    value: string;
  }[];
}

const QUESTIONS: Question[] = [
  {
    id: "persona",
    title: "Who are you shopping for today?",
    subtitle: "We'll tailor your recommendations to match their perfect vibe.",
    options: [
      { label: "Myself (Tech Vibe)", description: "Looking for premium workspace or apparel gear", icon: "💻", value: "self" },
      { label: "A Fellow Developer", description: "Finding the perfect, geeky yet high-end gift", icon: "🚀", value: "gift_dev" },
      { label: "Casual Supporter", description: "Classic, reliable daily merchandise basics", icon: "✨", value: "casual" },
      { label: "Dino Fanatic", description: "Quirky, fun, and nostalgic office gear", icon: "🦖", value: "fun" }
    ]
  },
  {
    id: "category",
    title: "What is your main interest?",
    subtitle: "Select the department you'd love to explore.",
    options: [
      { label: "Style & Wearables", description: "Premium apparel, hoodies, and beanies", icon: "👕", value: "Apparel" },
      { label: "Everyday Tech & Stationery", description: "Stickers, laptop sleeves, enamel pins, and notebooks", icon: "📓", value: "Accessories_Tech" },
      { label: "Smart Drinkware", description: "Vacuum bottles and insulated mugs", icon: "💧", value: "Drinkware" },
      { label: "Bags & Carriers", description: "Everyday backpacks and ecological totes", icon: "🎒", value: "Bags" }
    ]
  },
  {
    id: "aesthetic",
    title: "Choose your preferred aesthetic:",
    subtitle: "How do you like to showcase your setup?",
    options: [
      { label: "Obsidian Developer Dark", description: "Deep black, matte graphite, carbon gray", icon: "🖤", value: "dark" },
      { label: "Dynamic Hologram Gradient", description: "Shifting colors inspired by Gemini AI flow", icon: "🌈", value: "gemini" },
      { label: "Classic Google Brand Accent", description: "Vibrant brand primary colors on crisp backdrops", icon: "🔴", value: "primary" },
      { label: "Eco-Friendly Organic Green", description: "Sustainably produced soft, earth-toned visuals", icon: "🌱", value: "eco" }
    ]
  },
  {
    id: "budget",
    title: "What is your target budget?",
    subtitle: "We'll suggest options that fit your wallet.",
    options: [
      { label: "Friendly Budget (< $15)", description: "Cool accessories, stickers, and key pins", icon: "💸", value: "budget" },
      { label: "Mid-tier Premium ($15 - $35)", description: "Premium tees, laptop sleeves, and bottles", icon: "💳", value: "medium" },
      { label: "Campus Luxury (> $35)", description: "Heavy fleece hoodies and advanced backpacks", icon: "💎", value: "premium" }
    ]
  }
];

export const Quiz: React.FC<QuizProps> = ({
  onProductClick,
  onAddToCart,
  onAddToWishlist,
  wishlistIds,
  cartIds,
  theme
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});

  const handleSelectOption = (questionId: string, optionValue: string) => {
    const updatedAnswers = { ...answers, [questionId]: optionValue };
    setAnswers(updatedAnswers);

    if (currentIdx < QUESTIONS.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      // Calculate Recommendations
      calculateResults(updatedAnswers);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx((prev) => prev - 1);
    }
  };

  const calculateResults = (finalAnswers: Record<string, string>) => {
    const scoredProducts = PRODUCTS.map((product) => {
      let score = 0;

      // 1. Category matching
      const targetCat = finalAnswers["category"];
      if (targetCat === "Apparel" && product.category === "Apparel") score += 5;
      if (targetCat === "Bags" && product.category === "Bags") score += 5;
      if (targetCat === "Drinkware" && product.category === "Drinkware") score += 5;
      if (targetCat === "Accessories_Tech") {
        if (["Accessories", "Stickers", "Tech"].includes(product.category)) score += 5;
      }

      // 2. Budget matching
      const budget = finalAnswers["budget"];
      if (budget === "budget") {
        if (product.price <= 15) score += 6;
        else if (product.price <= 25) score -= 3;
        else score -= 8;
      } else if (budget === "medium") {
        if (product.price > 15 && product.price <= 35) score += 6;
        else if (product.price <= 15) score += 2;
        else score -= 4;
      } else if (budget === "premium") {
        if (product.price > 35) score += 6;
        else if (product.price > 20 && product.price <= 35) score += 2;
        else score -= 6;
      }

      // 3. Aesthetic matching
      const aesthetic = finalAnswers["aesthetic"];
      if (aesthetic === "dark") {
        if (["Google Pen White", "Gemini Hologram Sticker", "Google Eco Tote Bag"].includes(product.name)) {
          score -= 2;
        } else if (["AI Studio Laptop Sleeve", "Gemini Spark Water Bottle", "Google Wordmark Cap"].includes(product.name)) {
          score += 5;
        }
      } else if (aesthetic === "gemini") {
        if (product.name.includes("Gemini")) score += 6;
        if (["AI Studio Laptop Sleeve"].includes(product.name)) score += 4;
      } else if (aesthetic === "primary") {
        if (["Google Signature Red Tee", "Pixel Blue Mug", "Android Bot Enamel Pin", "Noogler Beanie"].includes(product.name)) {
          score += 5;
        }
      } else if (aesthetic === "eco") {
        if (["Google Eco Tote Bag", "Google Pen White", "Chrome Dino Plush"].includes(product.name)) {
          score += 5;
        }
      }

      // 4. Persona matching
      const persona = finalAnswers["persona"];
      if (persona === "fun") {
        if (["Chrome Dino Plush", "Android Bot Enamel Pin", "Noogler Beanie", "Gemini Hologram Sticker"].includes(product.name)) {
          score += 5;
        }
      } else if (persona === "gift_dev") {
        if (["AI Studio Laptop Sleeve", "Gemini Spark Water Bottle", "Gemini Gradient Notebook"].includes(product.name)) {
          score += 4;
        }
      } else if (persona === "self") {
        score += 1; // general slight boost
      }

      // Small random noise to prevent identical rank lists
      const noise = (product.id.split("").reduce((a, b) => a + b.charCodeAt(0), 0) % 10) / 10;

      return { product, finalScore: score + noise };
    });

    // Sort by highest score and take top 3
    const topProducts = scoredProducts
      .sort((a, b) => b.finalScore - a.finalScore)
      .slice(0, 3)
      .map((item) => item.product);

    setRecommendations(topProducts);
    setIsCompleted(true);
  };

  const handleReset = () => {
    setCurrentIdx(0);
    setAnswers({});
    setIsCompleted(false);
    setRecommendations([]);
    setAddedItems({});
  };

  const handleQuizAddToCart = (product: Product) => {
    // Select default sizes/colors if apparel
    const size = product.sizes ? product.sizes[1] || product.sizes[0] : undefined;
    const color = product.colors ? product.colors[0].name : undefined;
    onAddToCart(product, size, color);
    setAddedItems((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [product.id]: false }));
    }, 2000);
  };

  const isDark = theme === "dark";

  return (
    <div
      className={`rounded-2xl p-6 sm:p-8 border shadow-xl relative overflow-hidden transition-colors duration-300 ${
        isDark
          ? "bg-ai-surface border-ai-border text-ai-text"
          : "bg-white border-zinc-200 text-zinc-900"
      }`}
      id="quiz-container"
    >
      {/* Decorative Gradient Glow in background */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-radial from-violet-600/10 via-transparent to-transparent -translate-y-12 translate-x-12 pointer-events-none rounded-full" />

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-6" id="quiz-header-badge">
          <div className={`p-1.5 rounded-lg shadow-xs flex items-center justify-center transition-all ${
            isDark ? "bg-zinc-900 border border-red-600/50" : "bg-red-50 border border-red-200"
          }`}>
            <svg viewBox="0 0 24 24" className="h-4 w-4" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
          </div>
          <span className="text-xs font-sans font-bold uppercase tracking-wider text-red-600">
            AI Discovery Studio
          </span>
        </div>

        <AnimatePresence mode="wait">
          {!isCompleted ? (
            <motion.div
              key={`question-${currentIdx}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              {/* Progress Bar */}
              <div className="flex items-center justify-between gap-4 mb-6">
                <span className="text-xs font-mono text-ai-muted">
                  Question {currentIdx + 1} of {QUESTIONS.length}
                </span>
                <div className="flex-1 h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                  <div
                    className="h-full bg-linear-to-r from-blue-500 via-purple-500 to-rose-500 transition-all duration-300"
                    style={{ width: `${((currentIdx + 1) / QUESTIONS.length) * 100}%` }}
                  />
                </div>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold font-heading mb-1" id="quiz-question-title">
                {QUESTIONS[currentIdx].title}
              </h3>
              <p className={`text-sm mb-6 ${isDark ? "text-ai-muted" : "text-zinc-500"}`}>
                {QUESTIONS[currentIdx].subtitle}
              </p>

              {/* Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8" id="quiz-options-grid">
                {QUESTIONS[currentIdx].options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleSelectOption(QUESTIONS[currentIdx].id, option.value)}
                    className={`flex items-start gap-4 p-4 rounded-xl border text-left transition-all group duration-200 cursor-pointer ${
                      isDark
                        ? "bg-zinc-900/60 hover:bg-zinc-800/80 border-zinc-800 hover:border-zinc-700 text-ai-text"
                        : "bg-zinc-50 hover:bg-zinc-100/80 border-zinc-200 hover:border-zinc-300 text-zinc-800"
                    }`}
                    id={`quiz-option-${option.value}`}
                  >
                    <span className="text-3xl filter drop-shadow-sm group-hover:scale-110 transition-transform flex-shrink-0">
                      {option.icon}
                    </span>
                    <div>
                      <h4 className="font-semibold text-sm font-heading group-hover:text-blue-400 transition-colors">
                        {option.label}
                      </h4>
                      <p className={`text-xs mt-1 leading-snug ${isDark ? "text-ai-muted" : "text-zinc-500"}`}>
                        {option.description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Back Button */}
              {currentIdx > 0 && (
                <button
                  onClick={handlePrev}
                  className={`flex items-center gap-2 text-xs font-semibold py-2 px-4 rounded-lg transition-colors cursor-pointer ${
                    isDark ? "text-zinc-400 hover:text-zinc-200" : "text-zinc-600 hover:text-zinc-800"
                  }`}
                  id="quiz-back-btn"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Back
                </button>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              id="quiz-results"
            >
              <div className="text-center max-w-xl mx-auto mb-8">
                <h3 className="text-2xl sm:text-3xl font-bold font-heading mb-2">
                  Your Studio Vibe matches these 3 items!
                </h3>
                <p className={`text-sm ${isDark ? "text-ai-muted" : "text-zinc-500"}`}>
                  We scanned the redesigned catalog and matched your persona, aesthetic preference, and target budget to deliver optimal utility and style.
                </p>
              </div>

              {/* Recommendations Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8" id="quiz-recommendations-grid">
                {recommendations.map((product) => {
                  const isInWishlist = wishlistIds.includes(product.id);
                  const isAdded = addedItems[product.id];

                  return (
                    <div
                      key={product.id}
                      className={`rounded-xl border p-4 flex flex-col justify-between transition-all hover:shadow-md group relative ${
                        isDark ? "bg-zinc-900/40 border-zinc-800" : "bg-zinc-50 border-zinc-200"
                      }`}
                      id={`quiz-rec-card-${product.id}`}
                    >
                      <div>
                        {/* Placeholder visual */}
                        <div
                          onClick={() => onProductClick(product)}
                          className="h-28 rounded-lg mb-3 flex items-center justify-center relative overflow-hidden cursor-pointer group"
                          style={{ background: product.gradient }}
                          id={`quiz-rec-visual-${product.id}`}
                        >
                          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                          <span className="text-4xl filter drop-shadow-md group-hover:scale-110 transition-transform">
                            {product.icon}
                          </span>
                        </div>

                        {/* Title and details */}
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4
                            onClick={() => onProductClick(product)}
                            className={`font-semibold text-sm font-heading line-clamp-1 cursor-pointer hover:text-blue-400 transition-colors ${
                              isDark ? "text-ai-text" : "text-zinc-900"
                            }`}
                          >
                            {product.name}
                          </h4>
                          <span className="font-mono text-xs font-semibold text-blue-400">
                            ${product.price}
                          </span>
                        </div>
                        <p className={`text-xs line-clamp-2 mb-3 leading-snug ${isDark ? "text-ai-muted" : "text-zinc-500"}`}>
                          {product.description}
                        </p>
                      </div>

                      <div className="flex gap-2 mt-2">
                        {/* Add to cart */}
                        <button
                          onClick={() => handleQuizAddToCart(product)}
                          className={`flex-1 flex items-center justify-center gap-1 text-xs font-semibold py-2 px-3 rounded-lg transition-all cursor-pointer ${
                            isAdded
                              ? "bg-emerald-600 text-white"
                              : isDark
                              ? "bg-zinc-800 hover:bg-zinc-700 text-white"
                              : "bg-zinc-200 hover:bg-zinc-300 text-zinc-900"
                          }`}
                          id={`quiz-rec-add-cart-${product.id}`}
                        >
                          {isAdded ? (
                            <>
                              <Check className="h-3 w-3" /> Added
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="h-3 w-3" /> Add
                            </>
                          )}
                        </button>

                        {/* Wishlist */}
                        <button
                          onClick={() => onAddToWishlist(product)}
                          className={`p-2 rounded-lg transition-colors border cursor-pointer ${
                            isInWishlist
                              ? "bg-rose-500/10 border-rose-500/30 text-rose-500"
                              : isDark
                              ? "border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200"
                              : "border-zinc-300 bg-zinc-100 hover:bg-zinc-200 text-zinc-600 hover:text-zinc-800"
                          }`}
                          aria-label="Add to wishlist"
                          id={`quiz-rec-wishlist-${product.id}`}
                        >
                          <Heart className="h-3.5 w-3.5" fill={isInWishlist ? "currentColor" : "none"} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Reset Control */}
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 text-xs font-semibold bg-linear-to-r from-blue-500 via-purple-500 to-rose-500 hover:opacity-90 text-white py-2.5 px-6 rounded-lg transition-opacity shadow-md cursor-pointer"
                  id="quiz-reset-btn"
                >
                  <RefreshCw className="h-3.5 w-3.5 animate-spin-slow" /> Take Quiz Again
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
export default Quiz;
