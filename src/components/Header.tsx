import React, { useState } from "react";
import { ShoppingCart, Heart, Menu, X, Sun, Moon, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface HeaderProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  cartCount: number;
  wishlistCount: number;
  theme: "dark" | "light";
  onThemeToggle: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onPageChange,
  cartCount,
  wishlistCount,
  theme,
  onThemeToggle,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: "home", label: "Home" },
    { id: "shop", label: "Shop" },
    { id: "about", label: "Our Story" },
    { id: "contact", label: "Contact & FAQs" },
  ];

  const handleNavClick = (pageId: string) => {
    onPageChange(pageId);
    setMobileMenuOpen(false);
  };

  const isDark = theme === "dark";

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full border-b transition-colors duration-300 glass-header ${
          isDark
            ? "bg-ai-bg/85 border-ai-border text-ai-text"
            : "bg-white/85 border-zinc-200 text-zinc-900"
        }`}
        id="app-header"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo Brand area */}
          <div
            onClick={() => handleNavClick("home")}
            className="flex items-center gap-2.5 cursor-pointer group"
            id="header-brand-logo"
          >
            <div className={`p-1.5 rounded-lg shadow-xs group-hover:scale-105 transition-transform flex items-center justify-center ${
              isDark ? "bg-zinc-900 border border-zinc-800" : "bg-white border border-zinc-100"
            }`}>
              <svg viewBox="0 0 24 24" className="h-5 w-5" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-bold text-base sm:text-lg tracking-tight leading-none">
                Google <span className="gemini-gradient-text">Merch Store</span>
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1" id="header-desktop-nav">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative px-4 py-2 text-sm font-medium transition-colors cursor-pointer rounded-lg hover:bg-zinc-500/5 ${
                    isActive
                      ? isDark
                        ? "text-white"
                        : "text-zinc-950 font-semibold"
                      : isDark
                      ? "text-zinc-400 hover:text-zinc-200"
                      : "text-zinc-600 hover:text-zinc-900"
                  }`}
                  id={`nav-item-${item.id}`}
                >
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-3 right-3 h-0.5 gemini-gradient-bg rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action Utilities (Cart, Wishlist, Theme, Mobile Hamburger) */}
          <div className="flex items-center gap-1.5 sm:gap-3" id="header-actions">
            
            {/* Theme Toggle */}
            <button
              onClick={onThemeToggle}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                isDark ? "hover:bg-zinc-800 text-zinc-300" : "hover:bg-zinc-100 text-zinc-600"
              }`}
              aria-label="Toggle visual theme"
              id="theme-toggle-btn"
            >
              {isDark ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Wishlist Icon */}
            <button
              onClick={() => handleNavClick("shop")} // Wishlist triggers shop with 'wishlisted only' checked, or goes to a shop section
              className={`p-2 rounded-lg transition-colors relative cursor-pointer ${
                isDark ? "hover:bg-zinc-800 text-zinc-300" : "hover:bg-zinc-100 text-zinc-600"
              }`}
              aria-label="View wishlist"
              id="wishlist-trigger"
            >
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 bg-rose-500 text-white text-[10px] font-mono font-bold w-4 h-4 flex items-center justify-center rounded-full animate-pulse">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Icon */}
            <button
              onClick={() => handleNavClick("cart")}
              className={`p-2 rounded-lg transition-colors relative cursor-pointer ${
                isDark ? "hover:bg-zinc-800 text-zinc-300" : "hover:bg-zinc-100 text-zinc-600"
              }`}
              aria-label="View shopping cart"
              id="cart-trigger"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-blue-500 text-white text-[10px] font-mono font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Drawer Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-lg md:hidden transition-colors cursor-pointer ${
                isDark ? "hover:bg-zinc-800 text-zinc-300" : "hover:bg-zinc-100 text-zinc-600"
              }`}
              aria-label="Open menu"
              id="mobile-drawer-toggle"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Slide-In Mobile Navigation Drawer (< 760px) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-30 md:hidden pointer-events-auto" id="mobile-drawer-wrapper">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="absolute inset-0 bg-black"
            />

            {/* Drawer Body */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={`absolute right-0 top-0 bottom-0 w-72 max-w-[80vw] border-l shadow-2xl p-6 flex flex-col justify-between ${
                isDark ? "bg-ai-surface border-ai-border text-ai-text" : "bg-white border-zinc-200 text-zinc-900"
              }`}
              id="mobile-drawer-body"
            >
              <div className="mt-8">
                <div className="flex items-center gap-2.5 pb-6 border-b border-zinc-800/10 dark:border-zinc-100/10 mb-6">
                  <div className="p-1.5 rounded-lg bg-linear-to-r from-blue-500 via-purple-500 to-rose-500 text-white">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <span className="font-heading font-bold text-lg">Google Store</span>
                </div>

                <div className="flex flex-col gap-2">
                  {navItems.map((item) => {
                    const isActive = currentPage === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNavClick(item.id)}
                        className={`w-full text-left py-3 px-4 rounded-xl text-base font-semibold transition-all flex items-center justify-between cursor-pointer ${
                          isActive
                            ? "bg-linear-to-r from-blue-500/10 via-purple-500/10 to-rose-500/10 text-blue-400 font-bold"
                            : isDark
                            ? "text-zinc-300 hover:bg-zinc-800/50"
                            : "text-zinc-700 hover:bg-zinc-100"
                        }`}
                        id={`mobile-nav-item-${item.id}`}
                      >
                        {item.label}
                        {isActive && <div className="w-1.5 h-1.5 rounded-full gemini-gradient-bg" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Drawer footer info */}
              <div className="border-t border-zinc-800/10 dark:border-zinc-100/10 pt-6">
                <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400 text-center">
                  Smart Shopping Campaign active
                </p>
                <p className="text-[10px] text-zinc-400 dark:text-zinc-500 text-center mt-1">
                  United States & India Delivery
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
export default Header;
