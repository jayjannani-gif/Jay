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
  devXp?: number;
  onOpenRewards?: () => void;
  onOpenAiStylist?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onPageChange,
  cartCount,
  wishlistCount,
  theme,
  onThemeToggle,
  devXp = 150,
  onOpenRewards,
  onOpenAiStylist,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: "home", label: "Home" },
    { id: "shop", label: "Shop Catalog" },
    { id: "studio", label: "Custom Studio ✨" },
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
        className={`sticky top-0 z-40 w-full transition-all duration-300 backdrop-blur-xl border-b ${
          isDark
            ? "bg-[#06070B]/90 border-white/10 text-white shadow-xl shadow-black/60"
            : "bg-white/90 border-zinc-200/90 text-zinc-900 shadow-sm"
        }`}
        id="app-header"
      >
        {/* Top Accent Line */}
        <div className="h-[2px] w-full bg-blue-600" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between">
          
          {/* Logo Brand area */}
          <div
            onClick={() => handleNavClick("home")}
            className="flex items-center gap-3 cursor-pointer group"
            id="header-brand-logo"
          >
            <div className={`p-2 rounded-xl border shadow-sm group-hover:scale-105 transition-transform flex items-center justify-center ${
              isDark ? "bg-[#0F111A] border-white/15" : "bg-white border-zinc-200"
            }`}>
              <svg viewBox="0 0 24 24" className="h-5 w-5" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-base sm:text-lg tracking-wider leading-none">
                GOOGLE <span className="text-blue-500 font-extrabold">MERCH</span>
              </span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 font-bold mt-0.5">
                OFFICIAL STORE
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className={`hidden md:flex items-center gap-1 p-1 rounded-full border shadow-xs ${
            isDark ? "bg-[#0C0E15]/90 border-white/10" : "bg-zinc-100/90 border-zinc-200"
          }`} id="header-desktop-nav">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative px-4 py-2 text-xs font-mono font-bold transition-all cursor-pointer rounded-full ${
                    isActive
                      ? "text-white"
                      : isDark
                      ? "text-zinc-400 hover:text-white"
                      : "text-zinc-600 hover:text-zinc-900"
                  }`}
                  id={`nav-item-${item.id}`}
                >
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute inset-0 bg-blue-600 rounded-full -z-10 shadow-sm"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action Utilities */}
          <div className="flex items-center gap-2" id="header-actions">
            
            {/* AI Stylist Button */}
            {onOpenAiStylist && (
              <button
                onClick={onOpenAiStylist}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-mono font-extrabold text-white bg-blue-600 hover:bg-blue-500 transition-all active:scale-95 cursor-pointer shadow-sm"
                id="ai-stylist-trigger-btn"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>AI STYLIST</span>
              </button>
            )}

            {/* Dev XP Loyalty Badge */}
            {onOpenRewards && (
              <button
                onClick={onOpenRewards}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-extrabold bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 transition-all cursor-pointer shadow-xs"
                id="dev-xp-trigger-btn"
                title="View Rewards & Perks"
              >
                <span className="text-amber-400">⚡</span>
                <span>{devXp} XP</span>
              </button>
            )}

            {/* Theme Toggle */}
            <button
              onClick={onThemeToggle}
              className={`p-2.5 rounded-full border transition-all cursor-pointer ${
                isDark
                  ? "bg-[#0F111A] border-white/10 hover:bg-zinc-800 text-amber-400"
                  : "bg-white border-zinc-200 hover:bg-zinc-100 text-zinc-700"
              }`}
              aria-label="Toggle visual theme"
              id="theme-toggle-btn"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {/* Wishlist Icon */}
            <button
              onClick={() => handleNavClick("shop")}
              className={`p-2.5 rounded-full border transition-all relative cursor-pointer ${
                isDark
                  ? "bg-[#0F111A] border-white/10 hover:bg-zinc-800 text-zinc-300"
                  : "bg-white border-zinc-200 hover:bg-zinc-100 text-zinc-700"
              }`}
              aria-label="View wishlist"
              id="wishlist-trigger"
            >
              <Heart className="h-4 w-4" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-mono font-extrabold w-4 h-4 flex items-center justify-center rounded-full animate-pulse shadow-md">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Icon */}
            <button
              onClick={() => handleNavClick("cart")}
              className={`p-2.5 rounded-full border transition-all relative cursor-pointer ${
                isDark
                  ? "bg-[#0F111A] border-white/10 hover:bg-zinc-800 text-zinc-300"
                  : "bg-white border-zinc-200 hover:bg-zinc-100 text-zinc-700"
              }`}
              aria-label="View shopping cart"
              id="cart-trigger"
            >
              <ShoppingCart className="h-4 w-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-[10px] font-mono font-extrabold w-4 h-4 flex items-center justify-center rounded-full shadow-md">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Drawer Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2.5 rounded-full border md:hidden transition-all cursor-pointer ${
                isDark
                  ? "bg-[#0F111A] border-white/10 hover:bg-zinc-800 text-zinc-300"
                  : "bg-white border-zinc-200 hover:bg-zinc-100 text-zinc-700"
              }`}
              aria-label="Open menu"
              id="mobile-drawer-toggle"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Slide-In Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden pointer-events-auto" id="mobile-drawer-wrapper">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 240 }}
              className={`absolute right-0 top-0 bottom-0 w-80 border-l shadow-2xl p-6 flex flex-col justify-between ${
                isDark ? "bg-[#090A0F] border-white/10 text-white" : "bg-white border-zinc-200 text-zinc-900"
              }`}
              id="mobile-drawer-body"
            >
              <div className="mt-6">
                <div className="flex items-center gap-3 pb-6 border-b border-white/10 mb-6">
                  <span className="font-display font-extrabold text-lg tracking-wider">GOOGLE MERCH</span>
                </div>

                <div className="flex flex-col gap-2">
                  {navItems.map((item) => {
                    const isActive = currentPage === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNavClick(item.id)}
                        className={`w-full text-left py-3.5 px-4 rounded-xl text-sm font-mono font-bold transition-all flex items-center justify-between cursor-pointer ${
                          isActive
                            ? "bg-blue-600/15 text-blue-400 border border-blue-500/30"
                            : isDark
                            ? "text-zinc-300 hover:bg-zinc-800/60"
                            : "text-zinc-700 hover:bg-zinc-100"
                        }`}
                        id={`mobile-nav-item-${item.id}`}
                      >
                        {item.label}
                        {isActive && <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="border-t border-white/10 pt-6 space-y-2">
                <p className="text-xs font-mono text-zinc-400 text-center">
                  Official Google Merchandise Store
                </p>
                <p className="text-[10px] font-mono text-zinc-500 text-center">
                  Global Express Delivery Active
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
