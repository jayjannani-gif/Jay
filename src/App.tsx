import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { TopTickerBar } from "./components/TopTickerBar";
import { Footer } from "./components/Footer";
import { HomeView } from "./components/HomeView";
import { ShopView } from "./components/ShopView";
import { ProductDetailView } from "./components/ProductDetailView";
import { CartView } from "./components/CartView";
import { CheckoutView } from "./components/CheckoutView";
import { AboutView } from "./components/AboutView";
import { ContactView } from "./components/ContactView";
import { Quiz } from "./components/Quiz";
import { CustomizerStudio } from "./components/CustomizerStudio";
import { AiStylistDrawer } from "./components/AiStylistDrawer";
import { LoyaltyRewardsModal } from "./components/LoyaltyRewardsModal";
import { Toast, ToastMessage } from "./components/Toast";
import { Product, CartItem, LoyaltyProfile } from "./types";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles } from "lucide-react";

export default function App() {
  // --- Persistent Shared States ---
  const [currentPage, setCurrentPage] = useState<string>("home");
  
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const local = localStorage.getItem("google-store-cart");
    return local ? JSON.parse(local) : [];
  });

  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    const local = localStorage.getItem("google-store-wishlist");
    return local ? JSON.parse(local) : [];
  });

  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>(() => {
    const local = localStorage.getItem("google-store-recently-viewed");
    return local ? JSON.parse(local) : [];
  });

  const [theme, setTheme] = useState<"dark" | "light font-sans font-sans">(() => {
    const local = localStorage.getItem("google-store-theme");
    return (local as any) || "dark";
  });

  const [couponCode, setCouponCode] = useState<string>(() => {
    const local = localStorage.getItem("google-store-coupon");
    return local || "";
  });

  const [loyaltyProfile, setLoyaltyProfile] = useState<LoyaltyProfile>(() => {
    const local = localStorage.getItem("google-store-loyalty");
    return local ? JSON.parse(local) : { xp: 175, unlockedCodes: ["DEVXP15"] };
  });

  const [isAiStylistOpen, setIsAiStylistOpen] = useState(false);
  const [isRewardsOpen, setIsRewardsOpen] = useState(false);

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // --- Dynamic Copy-Pasteable Deep Linking Router ---
  useEffect(() => {
    const handleUrlRouting = () => {
      const params = new URLSearchParams(window.location.search);
      const page = params.get("page");
      const id = params.get("id");
      if (page) {
        if (page === "product" && id) {
          setCurrentPage(`product&id=${id}`);
        } else {
          setCurrentPage(page);
        }
      }
    };

    handleUrlRouting();
    window.addEventListener("popstate", handleUrlRouting);
    return () => window.removeEventListener("popstate", handleUrlRouting);
  }, []);

  // Sync states to LocalStorage
  useEffect(() => {
    localStorage.setItem("google-store-cart", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem("google-store-wishlist", JSON.stringify(wishlistIds));
  }, [wishlistIds]);

  useEffect(() => {
    localStorage.setItem("google-store-theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("google-store-coupon", couponCode);
  }, [couponCode]);

  useEffect(() => {
    localStorage.setItem("google-store-loyalty", JSON.stringify(loyaltyProfile));
  }, [loyaltyProfile]);

  const handleAddXp = (amount: number, reason: string) => {
    setLoyaltyProfile((prev) => ({ ...prev, xp: prev.xp + amount }));
    showToast(`⚡ +${amount} Dev XP Earned! (${reason})`, "success");
  };

  const handleDailyCheckIn = () => {
    const todayStr = new Date().toISOString().split("T")[0];
    if (loyaltyProfile.lastCheckInDate === todayStr) {
      showToast("Already checked in today!", "info");
      return;
    }
    setLoyaltyProfile((prev) => ({
      ...prev,
      xp: prev.xp + 25,
      lastCheckInDate: todayStr,
    }));
    showToast("🔥 Daily Check-in Complete! +25 Dev XP", "success");
  };

  // --- Navigation Coordinator ---
  const changePage = (pageStr: string) => {
    setCurrentPage(pageStr);
    
    const url = new URL(window.location.href);
    if (pageStr === "home") {
      url.searchParams.delete("page");
      url.searchParams.delete("id");
    } else if (pageStr.startsWith("product&id=")) {
      const id = pageStr.split("=")[1];
      url.searchParams.set("page", "product");
      url.searchParams.set("id", id);
      
      // Log to recently viewed list
      setRecentlyViewedIds((prev) => {
        const next = [id, ...prev.filter((item) => item !== id)].slice(0, 8);
        localStorage.setItem("google-store-recently-viewed", JSON.stringify(next));
        return next;
      });
    } else {
      url.searchParams.set("page", pageStr);
      url.searchParams.delete("id");
    }
    window.history.pushState({}, "", url.toString());
  };

  // --- Notification Center ---
  const showToast = (text: string, type: "success" | "error" | "info" = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 2500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // --- Shopping Handlers ---
  const handleAddToCart = (
    product: Product,
    size?: string,
    color?: string,
    quantity = 1,
    customDesign?: any
  ) => {
    setCartItems((prev) => {
      const existingIdx = prev.findIndex(
        (item) =>
          item.productId === product.id &&
          item.selectedSize === size &&
          item.selectedColor === color &&
          JSON.stringify(item.customDesign) === JSON.stringify(customDesign)
      );

      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += quantity;
        return updated;
      } else {
        return [
          ...prev,
          { productId: product.id, quantity, selectedSize: size, selectedColor: color, customDesign },
        ];
      }
    });

    // Award +20 Dev XP on purchase add
    setLoyaltyProfile((prev) => ({ ...prev, xp: prev.xp + 20 * quantity }));
    showToast(`Added ${quantity}x ${product.name} to cart. (+${20 * quantity} XP)`, "success");
  };

  const handleRemoveFromCart = (productId: string, size?: string, color?: string) => {
    setCartItems((prev) =>
      prev.filter(
        (item) =>
          !(item.productId === productId && item.selectedSize === size && item.selectedColor === color)
      )
    );
    showToast("Removed item from cart.", "info");
  };

  const handleQtyChange = (productId: string, delta: number, size?: string, color?: string) => {
    setCartItems((prev) => {
      return prev
        .map((item) => {
          if (
            item.productId === productId &&
            item.selectedSize === size &&
            item.selectedColor === color
          ) {
            const nextQty = item.quantity + delta;
            return { ...item, quantity: Math.max(1, nextQty) };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);
    });
  };

  const handleAddToWishlist = (product: Product) => {
    setWishlistIds((prev) => {
      const isPresent = prev.includes(product.id);
      if (isPresent) {
        showToast(`Removed ${product.name} from wishlist.`, "info");
        return prev.filter((id) => id !== product.id);
      } else {
        showToast(`Added ${product.name} to wishlist!`, "success");
        return [...prev, product.id];
      }
    });
  };

  const handleBuyNow = (product: Product, size?: string, color?: string, quantity = 1) => {
    // Add to cart first
    handleAddToCart(product, size, color, quantity);
    // Direct navigate to checkout
    changePage("checkout");
  };

  const handleApplyCoupon = (code: string) => {
    setCouponCode(code);
    showToast(`Coupon code ${code} applied successfully!`, "success");
  };

  const handleRemoveCoupon = () => {
    setCouponCode("");
    showToast("Coupon code removed.", "info");
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleThemeToggle = () => {
    setTheme((prev) => (prev.startsWith("dark") ? "light" : "dark"));
    showToast(`Switched theme to ${theme.startsWith("dark") ? "Light Mode" : "Obsidian Dark"}.`, "info");
  };

  // Extract ID if details page
  const detailProductId = currentPage.startsWith("product&id=") ? currentPage.split("=")[1] : "";
  const activeCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const isDark = theme.startsWith("dark");

  return (
    <div
      className={`min-h-screen flex flex-col font-sans selection:bg-blue-500/20 transition-colors duration-300 ${
        isDark ? "bg-[#0A0B0E] text-[#F3F4F6] dark" : "bg-[#FAF9F6] text-[#0A0B0E]"
      }`}
      id="app-root"
    >
      {/* Top Continuous Ticker Bar */}
      <TopTickerBar
        theme={isDark ? "dark" : "light"}
        onOpenStudio={() => changePage("studio")}
        onOpenStylist={() => setIsAiStylistOpen(true)}
      />

      {/* Sticky Header Navigation */}
      <Header
        currentPage={currentPage.startsWith("product") ? "shop" : currentPage}
        onPageChange={changePage}
        cartCount={activeCartCount}
        wishlistCount={wishlistIds.length}
        theme={isDark ? "dark" : "light"}
        onThemeToggle={handleThemeToggle}
        devXp={loyaltyProfile.xp}
        onOpenRewards={() => setIsRewardsOpen(true)}
        onOpenAiStylist={() => setIsAiStylistOpen(true)}
      />

      {/* Main Content Area with Page Transitions */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage + (detailProductId ? `-${detailProductId}` : "")}
            initial={{ opacity: 0, y: 12, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.99 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Page Router mapping */}
            {currentPage === "home" && (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  <HomeView
                    onPageChange={changePage}
                    onProductClick={(p) => changePage(`product&id=${p.id}`)}
                    onAddToCart={handleAddToCart}
                    onAddToWishlist={handleAddToWishlist}
                    wishlistIds={wishlistIds}
                    cartIds={cartItems.map((c) => c.productId)}
                    recentlyViewedIds={recentlyViewedIds}
                    theme={isDark ? "dark" : "light"}
                    onApplyCoupon={handleApplyCoupon}
                    couponCode={couponCode}
                  />
                </motion.div>
                
                {/* Embedded Interactive Discovery Quiz on Homepage with whileInView scroll-triggered animation */}
                <motion.section
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className={`py-16 border-t ${isDark ? "border-white/10 bg-[#07080B]" : "border-zinc-200 bg-white"}`}
                  id="home-discovery-quiz"
                >
                  <div className="max-w-4xl mx-auto px-4 sm:px-6">
                    <Quiz
                      onProductClick={(p) => changePage(`product&id=${p.id}`)}
                      onAddToCart={handleAddToCart}
                      onAddToWishlist={handleAddToWishlist}
                      wishlistIds={wishlistIds}
                      cartIds={cartItems.map((c) => c.productId)}
                      theme={isDark ? "dark" : "light"}
                    />
                  </div>
                </motion.section>
              </>
            )}

            {currentPage === "shop" && (
              <motion.section
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <ShopView
                  onProductClick={(p) => changePage(`product&id=${p.id}`)}
                  onAddToCart={handleAddToCart}
                  onAddToWishlist={handleAddToWishlist}
                  wishlistIds={wishlistIds}
                  theme={isDark ? "dark" : "light"}
                />
              </motion.section>
            )}

            {currentPage === "studio" && (
              <motion.section
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <CustomizerStudio
                  onAddToCart={handleAddToCart}
                  onPageChange={changePage}
                  theme={isDark ? "dark" : "light"}
                  onAddXp={handleAddXp}
                />
              </motion.section>
            )}

            {detailProductId !== "" && (
              <motion.section
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <ProductDetailView
                  productId={detailProductId}
                  onPageChange={changePage}
                  onAddToCart={handleAddToCart}
                  onAddToWishlist={handleAddToWishlist}
                  onBuyNow={handleBuyNow}
                  wishlistIds={wishlistIds}
                  theme={isDark ? "dark" : "light"}
                />
              </motion.section>
            )}

            {currentPage === "cart" && (
              <motion.section
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <CartView
                  cartItems={cartItems}
                  onQtyChange={handleQtyChange}
                  onRemoveItem={handleRemoveFromCart}
                  onPageChange={changePage}
                  couponCode={couponCode}
                  onApplyCoupon={handleApplyCoupon}
                  onRemoveCoupon={handleRemoveCoupon}
                  theme={isDark ? "dark" : "light"}
                />
              </motion.section>
            )}

            {currentPage === "checkout" && (
              <motion.section
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <CheckoutView
                  cartItems={cartItems}
                  couponCode={couponCode}
                  onClearCart={handleClearCart}
                  onPageChange={changePage}
                  theme={isDark ? "dark" : "light"}
                  onShowToast={showToast}
                />
              </motion.section>
            )}

            {currentPage === "about" && (
              <motion.section
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <AboutView onPageChange={changePage} theme={isDark ? "dark" : "light"} />
              </motion.section>
            )}

            {currentPage === "contact" && (
              <motion.section
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <ContactView theme={isDark ? "dark" : "light"} />
              </motion.section>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Global Toast Alerts */}
      <Toast toasts={toasts} onRemove={removeToast} />

      {/* AI Stylist Slide Drawer */}
      <AiStylistDrawer
        isOpen={isAiStylistOpen}
        onClose={() => setIsAiStylistOpen(false)}
        onProductClick={(p) => changePage(`product&id=${p.id}`)}
        onAddToCart={handleAddToCart}
        theme={isDark ? "dark" : "light"}
      />

      {/* Dev XP Loyalty Hub Modal */}
      <LoyaltyRewardsModal
        isOpen={isRewardsOpen}
        onClose={() => setIsRewardsOpen(false)}
        profile={loyaltyProfile}
        onCheckIn={handleDailyCheckIn}
        onApplyCoupon={handleApplyCoupon}
        theme={isDark ? "dark" : "light"}
      />

      {/* Persistent Floating AI Stylist Action Button */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="fixed bottom-6 right-6 z-40"
      >
        <motion.button
          whileHover={{ scale: 1.08, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsAiStylistOpen(true)}
          className="px-5 py-3 rounded-full text-white font-bold text-xs bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all flex items-center gap-2.5 cursor-pointer border border-white/20"
          id="floating-ai-stylist-btn"
        >
          <Sparkles className="h-4 w-4 text-cyan-300 animate-pulse" />
          <span>Ask AI Stylist</span>
        </motion.button>
      </motion.div>

      {/* Footer Block */}
      <Footer onPageChange={changePage} theme={isDark ? "dark" : "light"} onShowToast={showToast} />
    </div>
  );
}
