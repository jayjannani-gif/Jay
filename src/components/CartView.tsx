import React, { useState, useEffect } from "react";
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus, Tag, Gift, Percent, X } from "lucide-react";
import { Product, CartItem } from "../types";
import { PRODUCTS } from "../data";
import { trackViewCart, trackRemoveFromCart, trackBeginCheckout } from "../utils/analytics";

interface CartViewProps {
  cartItems: CartItem[];
  onQtyChange: (productId: string, delta: number, size?: string, color?: string) => void;
  onRemoveItem: (productId: string, size?: string, color?: string) => void;
  onPageChange: (page: string) => void;
  couponCode: string;
  onApplyCoupon: (code: string) => void;
  onRemoveCoupon: () => void;
  theme: "dark" | "light";
}

export const CartView: React.FC<CartViewProps> = ({
  cartItems,
  onQtyChange,
  onRemoveItem,
  onPageChange,
  couponCode,
  onApplyCoupon,
  onRemoveCoupon,
  theme,
}) => {
  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");

  // Map CartItem IDs back to rich Product references
  const enrichedCartItems = cartItems.map((item) => {
    const product = PRODUCTS.find((p) => p.id === item.productId)!;
    return {
      product,
      quantity: item.quantity,
      selectedSize: item.selectedSize,
      selectedColor: item.selectedColor,
    };
  }).filter((item) => item.product !== undefined);

  // Financial Computations
  const subtotal = enrichedCartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  
  // 15% discount for SHOPWEEK15
  const isPromoApplied = couponCode === "SHOPWEEK15";
  const discount = isPromoApplied ? subtotal * 0.15 : 0;
  
  // Shipping: free if coupon applied, or subtotal is over $35, else $5 flat
  const shipping = subtotal === 0 ? 0 : (isPromoApplied || subtotal >= 35) ? 0 : 5;
  
  // Estimated Tax: 8% of discounted subtotal
  const tax = subtotal === 0 ? 0 : (subtotal - discount) * 0.08;
  const total = subtotal - discount + shipping + tax;

  // Track View Cart in GA4 on mount
  useEffect(() => {
    if (enrichedCartItems.length > 0) {
      trackViewCart(
        enrichedCartItems.map((i) => ({ product: i.product, quantity: i.quantity, size: i.selectedSize, color: i.selectedColor })),
        total
      );
    }
  }, [cartItems]);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError("");
    setCouponSuccess("");

    if (couponInput.trim().toUpperCase() === "SHOPWEEK15") {
      onApplyCoupon("SHOPWEEK15");
      setCouponSuccess("Success! Code SHOPWEEK15 applied: 15% Off Sitewide + Free Delivery.");
      setCouponInput("");
    } else if (couponInput.trim() === "") {
      setCouponError("Please enter a coupon code.");
    } else {
      setCouponError("Invalid promo code. Did you try SHOPWEEK15?");
    }
  };

  const handleRemoveFromCart = (item: typeof enrichedCartItems[0]) => {
    onRemoveItem(item.product.id, item.selectedSize, item.selectedColor);
    trackRemoveFromCart(item.product, item.quantity, item.selectedSize, item.selectedColor);
  };

  const handleCheckoutClick = () => {
    trackBeginCheckout(
      enrichedCartItems.map((i) => ({ product: i.product, quantity: i.quantity, size: i.selectedSize, color: i.selectedColor })),
      total
    );
    onPageChange("checkout");
  };

  const isDark = theme === "dark";

  return (
    <div className={`transition-colors duration-300 min-h-screen py-8 ${isDark ? "bg-ai-bg text-ai-text" : "bg-zinc-50 text-zinc-900"}`} id="cart-view">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <h1 className="text-3xl font-bold font-heading mb-8" id="cart-header-title">Your Studio Cart</h1>

        {enrichedCartItems.length === 0 ? (
          /* EMPTY CART STATE */
          <div
            className={`py-16 text-center rounded-2xl border ${
              isDark ? "bg-ai-surface border-ai-border text-ai-muted" : "bg-white border-zinc-200 text-zinc-500"
            }`}
            id="empty-cart-state"
          >
            <ShoppingBag className="h-16 w-16 text-zinc-500 mx-auto mb-6 animate-bounce-slow" />
            <h2 className={`text-xl font-bold font-heading mb-2 ${isDark ? "text-zinc-200" : "text-zinc-800"}`}>Your cart is currently empty</h2>
            <p className="text-sm mb-8 px-4 max-w-sm mx-auto leading-relaxed">
              Before you proceed, fill your cart with redesigned stickers, hoodies, or vacuum insulated drinkware from the Studio catalog!
            </p>
            <button
              onClick={() => onPageChange("shop")}
              className="bg-linear-to-r from-blue-500 via-purple-500 to-rose-500 hover:opacity-95 text-white font-heading font-semibold text-sm py-3.5 px-8 rounded-xl shadow-md transition-opacity cursor-pointer"
              id="empty-cart-shop-cta"
            >
              Browse Collections
            </button>
          </div>
        ) : (
          /* FILLED CART LAYOUT */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="filled-cart-layout">
            
            {/* LEFT COLUMN: Line Items (lg:col-span-8) */}
            <div className="lg:col-span-8 flex flex-col gap-4" id="cart-items-column">
              {enrichedCartItems.map((item, idx) => (
                <div
                  key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}-${idx}`}
                  className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-zinc-700/50 ${
                    isDark ? "bg-ai-surface border-ai-border" : "bg-white border-zinc-200"
                  }`}
                  id={`cart-item-row-${item.product.id}`}
                >
                  
                  {/* Thumbnail + info details */}
                  <div className="flex items-center gap-4">
                    {/* Visual tile */}
                    <div
                      onClick={() => onPageChange(`product&id=${item.product.id}`)}
                      className="w-20 h-20 rounded-xl flex items-center justify-center relative overflow-hidden flex-shrink-0 cursor-pointer"
                      style={{ background: item.product.gradient }}
                      id={`cart-item-visual-${item.product.id}`}
                    >
                      {item.product.image ? (
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="absolute inset-0 w-full h-full object-cover select-none"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <span className="text-3.5xl filter drop-shadow-sm select-none">
                          {item.product.icon}
                        </span>
                      )}
                    </div>

                    {/* Meta information */}
                    <div>
                      <h3
                        onClick={() => onPageChange(`product&id=${item.product.id}`)}
                        className={`font-bold text-sm sm:text-base font-heading cursor-pointer hover:text-blue-400 transition-colors ${
                          isDark ? "text-ai-text" : "text-zinc-900"
                        }`}
                      >
                        {item.product.name}
                      </h3>
                      
                      <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-xs">
                        <span className={`font-mono ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
                          ID: #{item.product.id}
                        </span>
                        
                        {(item.selectedSize || item.selectedColor) && (
                          <span className={`text-[10px] uppercase font-bold py-0.5 px-2.5 rounded bg-zinc-800/40 text-purple-400 border border-purple-500/10`}>
                            {[item.selectedSize, item.selectedColor].filter(Boolean).join(" / ")}
                          </span>
                        )}
                      </div>

                      <div className="mt-2 flex items-center gap-2">
                        <span className="font-mono text-sm font-semibold text-blue-400">
                          ${item.product.price}
                        </span>
                        {item.product.originalPrice && (
                          <span className="font-mono text-xs text-zinc-500 line-through">
                            ${item.product.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Actions: Quantity modification + removal */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 border-zinc-800/10 dark:border-zinc-100/10 pt-4 sm:pt-0">
                    
                    {/* Stepper */}
                    <div className={`flex items-center rounded-lg border ${isDark ? "border-zinc-800 bg-zinc-900/40" : "border-zinc-300 bg-white"}`}>
                      <button
                        onClick={() => onQtyChange(item.product.id, -1, item.selectedSize, item.selectedColor)}
                        className={`p-1.5 cursor-pointer hover:opacity-85 ${item.quantity === 1 ? "opacity-30 cursor-not-allowed" : ""}`}
                        disabled={item.quantity === 1}
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-8 text-center font-mono font-bold text-xs select-none">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onQtyChange(item.product.id, 1, item.selectedSize, item.selectedColor)}
                        className="p-1.5 cursor-pointer hover:opacity-85"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {/* Total Price & Delete row */}
                    <div className="flex items-center gap-4 text-right">
                      <span className="font-mono text-sm sm:text-base font-bold text-blue-400 block min-w-[55px]">
                        ${item.product.price * item.quantity}
                      </span>
                      <button
                        onClick={() => handleRemoveFromCart(item)}
                        className={`p-2 rounded-lg transition-colors cursor-pointer ${
                          isDark ? "hover:bg-zinc-800 text-zinc-500 hover:text-rose-400" : "hover:bg-zinc-100 text-zinc-400 hover:text-rose-500"
                        }`}
                        aria-label="Remove item"
                        id={`cart-item-remove-btn-${item.product.id}`}
                      >
                        <Trash2 className="h-4.5 w-4.5" />
                      </button>
                    </div>

                  </div>

                </div>
              ))}
            </div>

            {/* RIGHT COLUMN: Summary and Checkout Panel (lg:col-span-4) */}
            <div className="lg:col-span-4 flex flex-col gap-6" id="cart-summary-column">
              
              {/* Promo code Form card */}
              <div
                className={`p-5 rounded-2xl border ${
                  isDark ? "bg-ai-surface border-ai-border" : "bg-white border-zinc-200"
                }`}
                id="promo-code-box"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Tag className="h-4.5 w-4.5 text-purple-400" />
                  <h3 className="font-heading font-bold text-sm">Promo Coupon Code</h3>
                </div>

                {isPromoApplied ? (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl p-3 flex items-start justify-between gap-2" id="coupon-applied-alert">
                    <div>
                      <span className="font-bold">SHOPWEEK15 active</span>
                      <p className="mt-0.5 opacity-85">15% discount successfully processed across items, plus zero delivery fees.</p>
                    </div>
                    <button
                      onClick={onRemoveCoupon}
                      className="text-emerald-400 hover:text-rose-400 font-bold font-mono transition-colors cursor-pointer"
                      id="remove-coupon-btn"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyPromo} className="flex gap-2" id="coupon-apply-form">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="e.g. SHOPWEEK15"
                      className={`flex-1 text-xs px-3 py-2.5 rounded-lg border focus:outline-hidden focus:ring-1 focus:ring-purple-500 ${
                        isDark ? "bg-zinc-900 border-zinc-800 text-white" : "bg-white border-zinc-300 text-zinc-900"
                      }`}
                      id="coupon-input-field"
                    />
                    <button
                      type="submit"
                      className="bg-zinc-800 hover:bg-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white font-bold text-xs py-2 px-4 rounded-lg transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  </form>
                )}

                {/* Coupon helpful info */}
                {!isPromoApplied && (
                  <p className="text-[10px] text-zinc-500 mt-2">
                    💡 Tip: Try applying code <span className="font-mono text-amber-500 font-bold bg-amber-500/10 px-1 py-0.5 rounded">SHOPWEEK15</span> for immediate savings.
                  </p>
                )}

                {couponError && <p className="text-rose-400 text-[11px] mt-2 font-medium" id="coupon-error">{couponError}</p>}
                {couponSuccess && <p className="text-emerald-400 text-[11px] mt-2 font-medium" id="coupon-success">{couponSuccess}</p>}
              </div>

              {/* Order summary card */}
              <div
                className={`p-6 rounded-2xl border ${
                  isDark ? "bg-ai-surface border-ai-border text-zinc-300" : "bg-white border-zinc-200 text-zinc-700"
                }`}
                id="cart-summary-totals-card"
              >
                <h3 className={`font-heading font-bold text-base mb-6 pb-3 border-b ${isDark ? "border-zinc-800 text-white" : "border-zinc-100 text-zinc-900"}`}>
                  Order Summary
                </h3>

                <div className="flex flex-col gap-3 text-xs mb-6">
                  <div className="flex items-center justify-between">
                    <span>Cart Subtotal</span>
                    <span className="font-mono font-bold">${subtotal.toFixed(2)}</span>
                  </div>

                  {isPromoApplied && (
                    <div className="flex items-center justify-between text-emerald-400">
                      <span className="flex items-center gap-1">
                        <Percent className="h-3 w-3" /> Coupon (SHOPWEEK15 -15%)
                      </span>
                      <span className="font-mono font-bold">-${discount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span>Estimated Shipping</span>
                    <span className="font-mono font-bold">
                      {shipping === 0 ? (
                        <span className="text-emerald-400 uppercase font-semibold">FREE</span>
                      ) : (
                        `$${shipping.toFixed(2)}`
                      )}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Estimated Tax (8%)</span>
                    <span className="font-mono font-bold">${tax.toFixed(2)}</span>
                  </div>
                </div>

                {/* Total row */}
                <div className={`flex items-baseline justify-between border-t py-4 mb-6 ${isDark ? "border-zinc-800 text-white" : "border-zinc-100 text-zinc-900"}`}>
                  <span className="font-heading font-bold text-sm">Estimated Total</span>
                  <span className="font-mono text-xl sm:text-2xl font-extrabold text-blue-400" id="cart-estimated-total">
                    ${total.toFixed(2)}
                  </span>
                </div>

                {/* Proceed Checkout Trigger */}
                <button
                  onClick={handleCheckoutClick}
                  className="w-full flex items-center justify-center gap-2 text-sm font-bold text-white bg-linear-to-r from-blue-500 via-purple-500 to-rose-500 hover:opacity-95 transition-opacity py-4 px-6 rounded-xl shadow-lg cursor-pointer"
                  id="checkout-proceed-btn"
                >
                  Proceed to Checkout <ArrowRight className="h-4 w-4" />
                </button>

                <p className="text-[10px] text-center text-zinc-500 mt-4 leading-normal">
                  All transaction values are calculated in live currency. Google Workspace OAuth integration provides premium checkout protection.
                </p>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
export default CartView;
