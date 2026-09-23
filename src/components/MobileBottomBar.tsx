import React from "react";
import { Home, Compass, MapPin, Heart, ShoppingBag } from "lucide-react";

interface MobileBottomBarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  cartCount: number;
  wishlistCount: number;
  onOpenWishlist: () => void;
  theme?: "dark" | "light";
}

export const MobileBottomBar: React.FC<MobileBottomBarProps> = ({
  currentPage,
  onPageChange,
  cartCount,
  wishlistCount,
  onOpenWishlist,
  theme = "dark",
}) => {
  const isDark = theme === "dark";

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 md:hidden border-t backdrop-blur-xl transition-colors ${
        isDark
          ? "bg-[#06070B]/95 border-white/10 text-white"
          : "bg-white/95 border-zinc-200 text-zinc-900 shadow-lg"
      }`}
      style={{ paddingBottom: "env(safe-area-inset-bottom, 8px)" }}
      id="mobile-bottom-bar"
    >
      <div className="grid grid-cols-5 h-16 items-center px-1">
        
        {/* 1. Home */}
        <button
          onClick={() => onPageChange("home")}
          className={`flex flex-col items-center justify-center gap-1 h-full min-h-[44px] transition-colors cursor-pointer ${
            currentPage === "home"
              ? "text-blue-500 font-bold"
              : isDark
              ? "text-zinc-400 hover:text-zinc-200"
              : "text-zinc-500 hover:text-zinc-900"
          }`}
          aria-label="Home"
          id="mobile-nav-home"
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] tracking-tight">Home</span>
        </button>

        {/* 2. Catalog */}
        <button
          onClick={() => onPageChange("shop")}
          className={`flex flex-col items-center justify-center gap-1 h-full min-h-[44px] transition-colors cursor-pointer ${
            currentPage === "shop"
              ? "text-blue-500 font-bold"
              : isDark
              ? "text-zinc-400 hover:text-zinc-200"
              : "text-zinc-500 hover:text-zinc-900"
          }`}
          aria-label="Catalog"
          id="mobile-nav-catalog"
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px] tracking-tight">Catalog</span>
        </button>

        {/* 3. City Spotlight (Special Featured Center Tab) */}
        <button
          onClick={() => onPageChange("city-spotlight")}
          className={`flex flex-col items-center justify-center gap-1 h-full min-h-[44px] transition-colors cursor-pointer relative ${
            currentPage.startsWith("city-spotlight")
              ? "text-blue-500 font-bold"
              : isDark
              ? "text-zinc-300 hover:text-white"
              : "text-zinc-700 hover:text-zinc-900"
          }`}
          aria-label="City Spotlight"
          id="mobile-nav-spotlight"
        >
          <div className="relative">
            <MapPin className="w-5 h-5" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-blue-500 animate-ping" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-blue-500" />
          </div>
          <span className="text-[10px] tracking-tight font-medium">Spotlight</span>
        </button>

        {/* 4. Wishlist Drawer */}
        <button
          onClick={onOpenWishlist}
          className={`flex flex-col items-center justify-center gap-1 h-full min-h-[44px] transition-colors cursor-pointer relative ${
            isDark ? "text-zinc-400 hover:text-rose-400" : "text-zinc-500 hover:text-rose-600"
          }`}
          aria-label="Wishlist"
          id="mobile-nav-wishlist"
        >
          <div className="relative">
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-rose-500 text-white text-[9px] font-bold min-w-4 h-4 rounded-full flex items-center justify-center px-1 shadow-sm">
                {wishlistCount}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight">Saved</span>
        </button>

        {/* 5. Cart / Bag */}
        <button
          onClick={() => onPageChange("cart")}
          className={`flex flex-col items-center justify-center gap-1 h-full min-h-[44px] transition-colors cursor-pointer relative ${
            currentPage === "cart" || currentPage === "checkout"
              ? "text-blue-500 font-bold"
              : isDark
              ? "text-zinc-400 hover:text-zinc-200"
              : "text-zinc-500 hover:text-zinc-900"
          }`}
          aria-label="Shopping Bag"
          id="mobile-nav-cart"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-blue-600 text-white text-[9px] font-bold min-w-4 h-4 rounded-full flex items-center justify-center px-1 shadow-sm">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight">Bag</span>
        </button>

      </div>
    </div>
  );
};
