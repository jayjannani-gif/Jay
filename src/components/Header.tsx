import React, { useState } from "react";
import { ShoppingCart, Heart, Menu, X, Sun, Moon, Sparkles, Search, Scale, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { CurrencyCode } from "../types";
import { CURRENCIES } from "../utils/currency";

interface HeaderProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  cartCount: number;
  wishlistCount: number;
  compareCount: number;
  currency: CurrencyCode;
  onCurrencyChange: (currency: CurrencyCode) => void;
  onOpenSearch: () => void;
  onOpenWishlist: () => void;
  onOpenCompare: () => void;
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
  compareCount,
  currency,
  onCurrencyChange,
  onOpenSearch,
  onOpenWishlist,
  onOpenCompare,
  theme,
  onThemeToggle,
  devXp = 150,
  onOpenRewards,
  onOpenAiStylist,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);

  const navItems = [
    { id: "home", label: "Home" },
    { id: "shop", label: "Catalog" },
    { id: "find", label: "Find Your Google" },
    { id: "mood", label: "Merch Mood" },
    { id: "gift", label: "Gift Lab" },
    { id: "bundles", label: "Smart Bundles" },
    { id: "studio", label: "Studio ✨" },
  ];

  const handleNavClick = (pageId: string) => {
    if (pageId === "find") {
      onPageChange("home");
      setTimeout(() => {
        const el = document.getElementById("find-your-google-section");
        el?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else if (pageId === "mood") {
      onPageChange("home");
      setTimeout(() => {
        const el = document.getElementById("merch-mood-section");
        el?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else if (pageId === "gift") {
      onPageChange("home");
      setTimeout(() => {
        const el = document.getElementById("gift-lab-section");
        el?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else if (pageId === "bundles") {
      onPageChange("home");
      setTimeout(() => {
        const el = document.getElementById("smart-bundles-section");
        el?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      onPageChange(pageId);
    }
    setMobileMenuOpen(false);
  };

  const isDark = theme === "dark";
  const currentCurrencyConfig = CURRENCIES[currency] || CURRENCIES.USD;

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 backdrop-blur-xl border-b ${
          isDark
            ? "bg-[#06070B]/90 border-white/10 text-white shadow-xl shadow-black/60"
            : "bg-white/95 border-zinc-200 text-zinc-900 shadow-sm"
        }`}
        id="app-header"
      >
        {/* Top Accent Line */}
        <div className="h-[2px] w-full bg-gradient-to-r from-blue-500 via-emerald-500 to-amber-500" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-2">
          
          {/* Logo Brand Area: GOOGLE MERCH LAB */}
          <div
            onClick={() => handleNavClick("home")}
            className="flex items-center gap-3 cursor-pointer group shrink-0"
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
              <span className="font-display font-black text-sm sm:text-base tracking-wider leading-none">
                GOOGLE <span className="text-blue-500 font-black">MERCH LAB</span>
              </span>
              <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-400 font-bold mt-0.5">
                FIND YOUR GOOGLE
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className={`hidden xl:flex items-center gap-1 p-1 rounded-full border shadow-xs ${
            isDark ? "bg-[#0C0E15]/90 border-white/10" : "bg-zinc-100 border-zinc-200"
          }`} id="header-desktop-nav">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative px-3.5 py-1.5 text-xs font-medium transition-all cursor-pointer rounded-full whitespace-nowrap ${
                    isActive
                      ? "text-white bg-blue-600 shadow-sm"
                      : isDark
                      ? "text-zinc-400 hover:text-white"
                      : "text-zinc-600 hover:text-zinc-900"
                  }`}
                  id={`nav-item-${item.id}`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Action Utilities */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0" id="header-actions">
            
            {/* Currency Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
                className={`h-9 px-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  isDark
                    ? "bg-zinc-900/90 border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700"
                    : "bg-white border-zinc-200 text-zinc-700 hover:text-zinc-900 hover:border-zinc-300"
                }`}
                title="Switch Display Currency"
                id="currency-selector-btn"
              >
                <span>{currentCurrencyConfig.flag}</span>
                <span className="hidden sm:inline font-mono">{currentCurrencyConfig.code}</span>
                <span className="font-bold text-blue-400">{currentCurrencyConfig.symbol}</span>
                <ChevronDown className="w-3 h-3 text-zinc-500" />
              </button>

              {currencyDropdownOpen && (
                <div
                  className={`absolute top-full mt-1.5 right-0 w-44 rounded-2xl border shadow-xl py-1.5 z-50 animate-fade-in ${
                    isDark ? "bg-zinc-900 border-zinc-800 text-white" : "bg-white border-zinc-200 text-zinc-900"
                  }`}
                  id="currency-dropdown-menu"
                >
                  <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-500 border-b border-zinc-800/40">
                    Select Currency
                  </div>
                  {(Object.keys(CURRENCIES) as CurrencyCode[]).map((code) => {
                    const c = CURRENCIES[code];
                    const isSelected = currency === code;
                    return (
                      <button
                        key={code}
                        onClick={() => {
                          onCurrencyChange(code);
                          setCurrencyDropdownOpen(false);
                        }}
                        className={`w-full px-3 py-2 text-left text-xs font-medium flex items-center justify-between transition-colors ${
                          isSelected
                            ? isDark
                              ? "bg-blue-600/20 text-blue-400 font-bold"
                              : "bg-blue-50 text-blue-600 font-bold"
                            : isDark
                            ? "hover:bg-zinc-800 text-zinc-300"
                            : "hover:bg-zinc-100 text-zinc-700"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span>{c.flag}</span>
                          <span>{c.name}</span>
                        </div>
                        <span className="font-mono text-zinc-400">{c.symbol}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Smart Search Trigger */}
            <button
              onClick={onOpenSearch}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                isDark
                  ? "bg-zinc-900/90 border-zinc-800 hover:bg-zinc-800 text-zinc-300 hover:text-blue-400"
                  : "bg-white border-zinc-200 hover:bg-zinc-100 text-zinc-700 hover:text-blue-600"
              }`}
              aria-label="Smart Search"
              title="Smart Search"
              id="search-trigger-btn"
            >
              <Search className="h-4 w-4" />
            </button>

            {/* Compare Drawer Trigger */}
            <button
              onClick={onOpenCompare}
              className={`p-2 rounded-xl border transition-all relative cursor-pointer ${
                isDark
                  ? "bg-zinc-900/90 border-zinc-800 hover:bg-zinc-800 text-zinc-300 hover:text-blue-400"
                  : "bg-white border-zinc-200 hover:bg-zinc-100 text-zinc-700 hover:text-blue-600"
              }`}
              aria-label="View comparison"
              title="Product Comparison"
              id="compare-trigger-btn"
            >
              <Scale className="h-4 w-4" />
              {compareCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-md">
                  {compareCount}
                </span>
              )}
            </button>

            {/* Wishlist Trigger */}
            <button
              onClick={onOpenWishlist}
              className={`p-2 rounded-xl border transition-all relative cursor-pointer ${
                isDark
                  ? "bg-zinc-900/90 border-zinc-800 hover:bg-zinc-800 text-zinc-300 hover:text-rose-400"
                  : "bg-white border-zinc-200 hover:bg-zinc-100 text-zinc-700 hover:text-rose-600"
              }`}
              aria-label="View saved shelf"
              title="Saved Items"
              id="wishlist-trigger-btn"
            >
              <Heart className="h-4 w-4" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-md">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Trigger */}
            <button
              onClick={() => handleNavClick("cart")}
              className={`p-2 rounded-xl border transition-all relative cursor-pointer ${
                isDark
                  ? "bg-zinc-900/90 border-zinc-800 hover:bg-zinc-800 text-zinc-300 hover:text-blue-400"
                  : "bg-white border-zinc-200 hover:bg-zinc-100 text-zinc-700 hover:text-blue-600"
              }`}
              aria-label="View shopping bag"
              title="Shopping Bag"
              id="cart-trigger-btn"
            >
              <ShoppingCart className="h-4 w-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-md">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Theme Toggle */}
            <button
              onClick={onThemeToggle}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                isDark
                  ? "bg-zinc-900/90 border-zinc-800 hover:bg-zinc-800 text-amber-400"
                  : "bg-white border-zinc-200 hover:bg-zinc-100 text-zinc-700"
              }`}
              aria-label="Toggle theme"
              id="theme-toggle-btn"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl border border-zinc-700 text-zinc-300 xl:hidden"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div
            className={`xl:hidden border-t px-4 py-4 space-y-2 animate-fade-in ${
              isDark ? "bg-zinc-950 border-zinc-800" : "bg-white border-zinc-200"
            }`}
          >
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold ${
                  currentPage === item.id
                    ? "bg-blue-600 text-white"
                    : isDark
                    ? "text-zinc-300 hover:bg-zinc-900"
                    : "text-zinc-700 hover:bg-zinc-100"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </header>
    </>
  );
};
