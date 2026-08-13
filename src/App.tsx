import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { HomeView } from "./components/HomeView";
import { ShopView } from "./components/ShopView";
import { ProductDetailView } from "./components/ProductDetailView";
import { CartView } from "./components/CartView";
import { CheckoutView } from "./components/CheckoutView";
import { AboutView } from "./components/AboutView";
import { ContactView } from "./components/ContactView";
import { Quiz } from "./components/Quiz";
import { Toast, ToastMessage } from "./components/Toast";
import { Product, CartItem } from "./types";
import { PRODUCTS } from "./data";
import { motion, AnimatePresence } from "motion/react";

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

  const [theme, setTheme] = useState<"dark" | "light font-sans">(() => {
    const local = localStorage.getItem("google-store-theme");
    return (local as any) || "dark";
  });

  const [couponCode, setCouponCode] = useState<string>(() => {
    const local = localStorage.getItem("google-store-coupon");
    return local || "";
  });

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
  const handleAddToCart = (product: Product, size?: string, color?: string, quantity = 1) => {
    setCartItems((prev) => {
      const existingIdx = prev.findIndex(
        (item) =>
          item.productId === product.id &&
          item.selectedSize === size &&
          item.selectedColor === color
      );

      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += quantity;
        return updated;
      } else {
        return [...prev, { productId: product.id, quantity, selectedSize: size, selectedColor: color }];
      }
    });

    showToast(`Added ${quantity}x ${product.name} to cart.`, "success");
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
      className={`min-h-screen flex flex-col font-sans selection:bg-purple-500/30 transition-colors duration-300 ${
        isDark ? "bg-[#0E0F13] text-[#F3F4F6] dark" : "bg-zinc-50 text-zinc-900"
      }`}
      id="app-root"
    >
      {/* Sticky Header Navigation */}
      <Header
        currentPage={currentPage.startsWith("product") ? "shop" : currentPage}
        onPageChange={changePage}
        cartCount={activeCartCount}
        wishlistCount={wishlistIds.length}
        theme={isDark ? "dark" : "light"}
        onThemeToggle={handleThemeToggle}
      />

      {/* Main Content Area */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {/* Page Router mapping */}
            {currentPage === "home" && (
              <>
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
                
                {/* Embedded Interactive Discovery Quiz on Homepage to PERSONALISE experience immediately */}
                <section className={`py-12 border-t ${isDark ? "border-ai-border/40" : "border-zinc-200"}`} id="home-discovery-quiz">
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
                </section>
              </>
            )}

            {currentPage === "shop" && (
              <ShopView
                onProductClick={(p) => changePage(`product&id=${p.id}`)}
                onAddToCart={handleAddToCart}
                onAddToWishlist={handleAddToWishlist}
                wishlistIds={wishlistIds}
                theme={isDark ? "dark" : "light"}
              />
            )}

            {detailProductId !== "" && (
              <ProductDetailView
                productId={detailProductId}
                onPageChange={changePage}
                onAddToCart={handleAddToCart}
                onAddToWishlist={handleAddToWishlist}
                onBuyNow={handleBuyNow}
                wishlistIds={wishlistIds}
                theme={isDark ? "dark" : "light"}
              />
            )}

            {currentPage === "cart" && (
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
            )}

            {currentPage === "checkout" && (
              <CheckoutView
                cartItems={cartItems}
                couponCode={couponCode}
                onClearCart={handleClearCart}
                onPageChange={changePage}
                theme={isDark ? "dark" : "light"}
                onShowToast={showToast}
              />
            )}

            {currentPage === "about" && (
              <AboutView onPageChange={changePage} theme={isDark ? "dark" : "light"} />
            )}

            {currentPage === "contact" && (
              <ContactView theme={isDark ? "dark" : "light"} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Global Toast Alerts */}
      <Toast toasts={toasts} onRemove={removeToast} />

      {/* Footer Block */}
      <Footer onPageChange={changePage} theme={isDark ? "dark" : "light"} onShowToast={showToast} />
    </div>
  );
}
