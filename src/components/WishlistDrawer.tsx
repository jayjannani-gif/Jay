import React from "react";
import { X, Heart, ShoppingBag, Trash2, ArrowRight, Check } from "lucide-react";
import { Product, CurrencyCode } from "../types";
import { PRODUCTS } from "../data";
import { formatPrice } from "../utils/currency";

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistIds?: string[];
  currency: CurrencyCode;
  onRemoveFromWishlist: (product: Product) => void;
  onAddToCart: (product: Product, size?: string, color?: string) => void;
  onProductClick: (product: Product) => void;
  onClearWishlist?: () => void;
  onShowToast?: (text: string, type?: "success" | "error" | "info") => void;
  theme?: "dark" | "light";
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlistIds = [],
  currency,
  onRemoveFromWishlist,
  onAddToCart,
  onProductClick,
  onClearWishlist,
  onShowToast,
  theme = "dark",
}) => {
  if (!isOpen) return null;

  const isDark = theme === "dark";
  const safeWishlistIds = Array.isArray(wishlistIds) ? wishlistIds : [];
  const wishlistedProducts = safeWishlistIds
    .map((id) => PRODUCTS.find((p) => p.id === id))
    .filter((p): p is Product => p !== undefined);

  const totalValue = wishlistedProducts.reduce((sum, p) => sum + p.price, 0);

  const handleMoveToBag = (product: Product) => {
    onAddToCart(product);
    onRemoveFromWishlist(product);
    if (onShowToast) {
      onShowToast(`Moved ${product.name} to your bag!`, "success");
    }
  };

  const handleMoveAllToBag = () => {
    wishlistedProducts.forEach((p) => {
      onAddToCart(p);
      onRemoveFromWishlist(p);
    });
    if (onShowToast) {
      onShowToast(`Moved all ${wishlistedProducts.length} saved items to your bag!`, "success");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      id="wishlist-overlay"
    >
      <div
        className={`w-full max-w-md h-full flex flex-col border-l shadow-2xl transition-all ${
          isDark ? "bg-zinc-900 border-zinc-800 text-white" : "bg-white border-zinc-200 text-zinc-900"
        }`}
        onClick={(e) => e.stopPropagation()}
        id="wishlist-drawer"
      >
        {/* Header */}
        <div className="p-6 border-b border-zinc-800/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
              <Heart className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Saved Items</h2>
              <p className="text-xs text-zinc-400">
                {wishlistedProducts.length} {wishlistedProducts.length === 1 ? "item" : "items"} on your shelf
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
            id="btn-close-wishlist"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Wishlist Items List */}
        <div className="p-6 overflow-y-auto flex-grow space-y-4">
          {wishlistedProducts.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-16 text-zinc-400">
              <div className="w-16 h-16 rounded-2xl bg-zinc-800/50 flex items-center justify-center text-3xl mb-4">
                🛍️
              </div>
              <h3 className={`text-base font-bold mb-1 ${isDark ? "text-white" : "text-zinc-900"}`}>
                Your Google shelf is waiting.
              </h3>
              <p className="text-xs text-zinc-400 max-w-xs mb-6 leading-relaxed">
                Save your favorite hoodies, desk companions, and stationery here to easily pick up where you left off.
              </p>
              <button
                onClick={onClose}
                className="h-10 px-5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors"
              >
                Discover Products
              </button>
            </div>
          ) : (
            wishlistedProducts.map((prod) => (
              <div
                key={prod.id}
                className={`p-3.5 rounded-2xl border flex items-center gap-3.5 transition-all ${
                  isDark ? "bg-zinc-950/40 border-zinc-800" : "bg-zinc-50 border-zinc-200"
                }`}
              >
                {/* Image */}
                <div
                  onClick={() => {
                    onClose();
                    onProductClick(prod);
                  }}
                  className="w-14 h-14 rounded-xl overflow-hidden bg-zinc-900/50 p-2 flex items-center justify-center cursor-pointer shrink-0"
                >
                  {prod.image ? (
                    <img src={prod.image} alt={prod.name} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                  ) : (
                    <span className="text-2xl">{prod.icon}</span>
                  )}
                </div>

                {/* Details */}
                <div className="flex-grow min-w-0">
                  <h4
                    onClick={() => {
                      onClose();
                      onProductClick(prod);
                    }}
                    className="text-xs font-bold hover:text-blue-400 cursor-pointer truncate"
                  >
                    {prod.name}
                  </h4>
                  <div className="text-[11px] text-zinc-400">{prod.category}</div>
                  <div className="text-xs font-bold text-blue-400 mt-1">
                    {formatPrice(prod.price, currency)}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-1.5 shrink-0">
                  <button
                    onClick={() => handleMoveToBag(prod)}
                    className="h-8 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-semibold flex items-center gap-1.5 transition-colors"
                    title="Move to bag"
                  >
                    <ShoppingBag className="w-3 h-3" />
                    <span>Move</span>
                  </button>

                  <button
                    onClick={() => onRemoveFromWishlist(prod)}
                    className="h-6 text-[10px] text-zinc-500 hover:text-rose-400 transition-colors flex items-center justify-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Bottom Total & Move All CTA */}
        {wishlistedProducts.length > 0 && (
          <div className="p-6 border-t border-zinc-800/80 bg-zinc-950/20 shrink-0 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400">Total Shelf Value:</span>
              <span className="font-extrabold text-base text-white">
                {formatPrice(totalValue, currency)}
              </span>
            </div>

            <button
              onClick={handleMoveAllToBag}
              className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 transition-all active:scale-98"
              id="btn-move-all-wishlist-bag"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Move All to Bag ({wishlistedProducts.length})</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
