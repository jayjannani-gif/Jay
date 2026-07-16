import React, { useState, useEffect } from "react";
import { ShieldCheck, CreditCard, ChevronRight, CheckCircle2, Gift, ClipboardCheck, Percent } from "lucide-react";
import { Product, CartItem, Order } from "../types";
import { PRODUCTS } from "../data";
import { trackAddShippingInfo, trackAddPaymentInfo, trackPurchase } from "../utils/analytics";

interface CheckoutProps {
  cartItems: CartItem[];
  couponCode: string;
  onClearCart: () => void;
  onPageChange: (page: string) => void;
  theme: "dark" | "light";
  onShowToast?: (text: string, type?: "success" | "error" | "info") => void;
}

export const CheckoutView: React.FC<CheckoutProps> = ({
  cartItems,
  couponCode,
  onClearCart,
  onPageChange,
  theme,
  onShowToast,
}) => {
  // Map Cart Items
  const enrichedCartItems = cartItems.map((item) => {
    const product = PRODUCTS.find((p) => p.id === item.productId)!;
    return {
      product,
      quantity: item.quantity,
      selectedSize: item.selectedSize,
      selectedColor: item.selectedColor,
    };
  }).filter((item) => item.product !== undefined);

  // Financial Calculations
  const subtotal = enrichedCartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const isPromoApplied = couponCode === "SHOPWEEK15";
  const discount = isPromoApplied ? subtotal * 0.15 : 0;
  const shipping = subtotal === 0 ? 0 : (isPromoApplied || subtotal >= 35) ? 0 : 5;
  const tax = subtotal === 0 ? 0 : (subtotal - discount) * 0.08;
  const total = subtotal - discount + shipping + tax;

  // Checkout Stages / continuous forms State
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("United States");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");

  const [paymentTab, setPaymentTab] = useState<"card" | "upi" | "paypal">("card");
  
  // Card forms
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVC, setCardCVC] = useState("");

  // UPI forms
  const [upiId, setUpiId] = useState("");

  // Order Success Screen State
  const [isCompleted, setIsCompleted] = useState(false);
  const [generatedOrder, setGeneratedOrder] = useState<Order | null>(null);

  // Validation Error state
  const [errorText, setErrorText] = useState("");

  // Track initial checkout step on mount
  useEffect(() => {
    if (enrichedCartItems.length > 0) {
      trackAddShippingInfo(
        enrichedCartItems.map((i) => ({ product: i.product, quantity: i.quantity })),
        total,
        couponCode || undefined
      );
    }
  }, []);

  const handleCountryChange = (val: string) => {
    setCountry(val);
    setState(""); // reset state
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText("");

    // Form validations
    if (!email || !firstName || !lastName || !address || !city || !zipCode) {
      setErrorText("Please complete all required shipping fields before processing payment.");
      // Scroll to error
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (paymentTab === "card" && (!cardNumber || !cardExpiry || !cardCVC)) {
      setErrorText("Please complete all credit card details.");
      return;
    }

    if (paymentTab === "upi" && !upiId) {
      setErrorText("Please enter a valid UPI ID (e.g. name@okhdfcbank).");
      return;
    }

    // Trigger Payment log in GA4
    trackAddPaymentInfo(
      enrichedCartItems.map((i) => ({ product: i.product, quantity: i.quantity })),
      total,
      paymentTab.toUpperCase(),
      couponCode || undefined
    );

    // Create realistic Order Object
    const transactionId = `T-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder: Order = {
      orderId: transactionId,
      items: enrichedCartItems.map((i) => ({
        productId: i.product.id,
        quantity: i.quantity,
        price: i.product.price,
        name: i.product.name,
        selectedSize: i.selectedSize,
        selectedColor: i.selectedColor,
      })),
      subtotal,
      discount,
      shipping,
      tax,
      total,
      couponCode: couponCode || undefined,
      shippingDetails: {
        email,
        firstName,
        lastName,
        address,
        city,
        country,
        state,
        zipCode,
      },
      paymentMethod: paymentTab.toUpperCase(),
      date: new Date().toISOString().split("T")[0],
    };

    // Track Purchase event in GA4
    trackPurchase(
      transactionId,
      enrichedCartItems.map((i) => ({ product: i.product, quantity: i.quantity, size: i.selectedSize, color: i.selectedColor })),
      total,
      tax,
      shipping,
      couponCode || undefined
    );

    // Set confirmation data, clear store cart, and toggle complete screen
    setGeneratedOrder(newOrder);
    setIsCompleted(true);
    onClearCart();
    
    // Scroll to top for success card
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isDark = theme === "dark";

  if (isCompleted && generatedOrder) {
    /* CONFIRMATION SCREEN */
    return (
      <div className={`transition-colors duration-300 py-16 px-4 ${isDark ? "bg-ai-bg text-ai-text" : "bg-zinc-50 text-zinc-900"}`} id="checkout-success-view">
        <div className="max-w-xl mx-auto text-center">
          
          <div className="inline-flex p-4 rounded-full bg-emerald-500/10 text-emerald-400 mb-6 border border-emerald-500/20" id="success-icon-badge">
            <CheckCircle2 className="h-16 w-16" />
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold font-heading mb-3">Order Confirmed!</h1>
          <p className={`text-sm mb-8 ${isDark ? "text-ai-muted" : "text-zinc-600"}`}>
            Thank you for shopping at the Google Merch Store. Your order has been registered, paid, and dispatched to our global routing system.
          </p>

          {/* Receipt details */}
          <div
            className={`p-6 rounded-2xl border text-left mb-8 flex flex-col gap-4 ${
              isDark ? "bg-ai-surface border-ai-border" : "bg-white border-zinc-200"
            }`}
            id="success-receipt-card"
          >
            <div className="flex items-center justify-between border-b border-zinc-800/15 dark:border-zinc-800 pb-3 font-mono text-xs text-zinc-500">
              <span>ORDER REFERENCE ID</span>
              <span className="font-bold text-blue-400" id="receipt-order-id">{generatedOrder.orderId}</span>
            </div>

            <div className="flex flex-col gap-2 border-b border-zinc-800/15 dark:border-zinc-800 pb-4">
              <span className="text-xs font-mono font-bold uppercase text-zinc-500">Shipping To</span>
              <p className="text-sm font-semibold">{generatedOrder.shippingDetails.firstName} {generatedOrder.shippingDetails.lastName}</p>
              <p className="text-xs leading-normal opacity-85">
                {generatedOrder.shippingDetails.address}, {generatedOrder.shippingDetails.city}, {generatedOrder.shippingDetails.state || ""} {generatedOrder.shippingDetails.zipCode}, {generatedOrder.shippingDetails.country}
              </p>
              <p className="text-xs text-zinc-500 mt-1 font-mono">{generatedOrder.shippingDetails.email}</p>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-xs font-mono font-bold uppercase text-zinc-500">Items Ordered</span>
              <div className="flex flex-col gap-2">
                {generatedOrder.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between items-baseline text-xs">
                    <span className="opacity-85 line-clamp-1 max-w-[280px]">
                      {it.name} <span className="text-purple-400 font-bold">x{it.quantity}</span>
                    </span>
                    <span className="font-mono font-semibold">${it.price * it.quantity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Price breakdown */}
            <div className="border-t border-zinc-800/15 dark:border-zinc-800 pt-3 mt-1 flex flex-col gap-1 text-xs">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono font-bold">${generatedOrder.subtotal.toFixed(2)}</span>
              </div>
              {generatedOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Discount</span>
                  <span className="font-mono font-bold">-${generatedOrder.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-mono">
                <span>Shipping Fees</span>
                <span className="font-bold">{generatedOrder.shipping === 0 ? "FREE" : `$${generatedOrder.shipping}`}</span>
              </div>
              <div className="flex justify-between">
                <span>Est. Duties & Taxes</span>
                <span className="font-mono font-bold">${generatedOrder.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold mt-2 pt-2 border-t border-zinc-800/15 dark:border-zinc-800">
                <span>Grand Total Paid</span>
                <span className="font-mono text-blue-400 text-base" id="receipt-grand-total">
                  ${generatedOrder.total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onPageChange("home")}
            className="w-full sm:w-auto bg-zinc-800 hover:bg-zinc-700 text-white font-semibold py-3.5 px-8 rounded-xl transition-colors cursor-pointer"
            id="success-home-btn"
          >
            Return to Store Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`transition-colors duration-300 min-h-screen py-8 ${isDark ? "bg-ai-bg text-ai-text" : "bg-zinc-50 text-zinc-900"}`} id="checkout-form-view">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <h1 className="text-3xl font-bold font-heading mb-8" id="checkout-title">Secure AI Studio Checkout</h1>

        {enrichedCartItems.length === 0 ? (
          /* fallback if no items */
          <div className="text-center py-12">
            <p className="mb-4">No items inside checkout buffer.</p>
            <button onClick={() => onPageChange("shop")} className="text-blue-400 font-bold underline cursor-pointer">
              Add products first
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="checkout-workspace">
            
            {/* LEFT COLUMN: Continuous scroll checkout forms (lg:col-span-8) */}
            <div className="lg:col-span-8 flex flex-col gap-6" id="checkout-forms-column">
              
              {errorText && (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm font-semibold" id="checkout-error-panel">
                  {errorText}
                </div>
              )}

              {/* Express checkout block */}
              <div className={`p-6 rounded-2xl border ${isDark ? "bg-ai-surface border-ai-border" : "bg-white border-zinc-200"}`} id="express-checkout-box">
                <h3 className="text-xs font-mono font-bold uppercase text-zinc-500 mb-4 tracking-wider">
                  Express Checkout Services
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      if (onShowToast) {
                        onShowToast("Express Google Pay visual checkout activated! Standard fields prefilled.", "info");
                      } else {
                        alert("Express Google Pay visual checkout activated! Standard fields prefilled for demonstration.");
                      }
                    }}
                    className="h-12 rounded-xl bg-zinc-950 text-white font-sans font-semibold text-sm flex items-center justify-center gap-2 hover:bg-black transition-colors border border-zinc-800 cursor-pointer"
                    id="gpay-express-btn"
                  >
                    <span className="text-xs">Pay with</span>
                    <span className="font-heading font-black tracking-tighter text-base">
                      <span className="text-blue-400">G</span>
                      <span className="text-red-400">o</span>
                      <span className="text-yellow-400">o</span>
                      <span className="text-blue-400">g</span>
                      <span className="text-green-400">l</span>
                      <span className="text-red-400">e</span> Pay
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setEmail("jay.jannani@gmail.com");
                      setFirstName("Jay");
                      setLastName("Jannani");
                      setAddress("1600 Amphitheatre Parkway");
                      setCity("Mountain View");
                      setCountry("United States");
                      setState("California");
                      setZipCode("94043");
                      setCardNumber("4111 2222 3333 4444");
                      setCardExpiry("12/28");
                      setCardCVC("123");
                      if (onShowToast) {
                        onShowToast("Filled standard shipping with saved credentials!", "success");
                      } else {
                        alert("Filled standard shipping with saved credentials!");
                      }
                    }}
                    className={`h-12 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      isDark ? "bg-zinc-900 border-zinc-800 text-zinc-200 hover:bg-zinc-800" : "bg-zinc-100 border-zinc-300 text-zinc-700 hover:bg-zinc-200"
                    }`}
                    id="saved-creds-express-btn"
                  >
                    Fill Saved Address Vibe
                  </button>
                </div>
              </div>

              {/* Form block */}
              <form onSubmit={handlePlaceOrder} className="flex flex-col gap-6" id="checkout-main-form">
                
                {/* STAGE 1: SHIPPING ADDRESS */}
                <fieldset className={`p-6 rounded-2xl border ${isDark ? "bg-ai-surface border-ai-border" : "bg-white border-zinc-200"}`} id="checkout-shipping-fieldset">
                  <legend className="px-3 text-xs font-mono font-bold uppercase tracking-wider text-purple-400">
                    Step 1: Shipping Address
                  </legend>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    
                    {/* Email */}
                    <div className="sm:col-span-2">
                      <label className="text-xs font-semibold text-zinc-400 block mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. developer@example.com"
                        className={`w-full text-sm px-3.5 py-2.5 rounded-lg border focus:outline-hidden focus:ring-1 focus:ring-purple-500 ${
                          isDark ? "bg-zinc-900 border-zinc-800 text-white" : "bg-white border-zinc-300 text-zinc-900"
                        }`}
                      />
                    </div>

                    {/* First Name */}
                    <div>
                      <label className="text-xs font-semibold text-zinc-400 block mb-1">First Name *</label>
                      <input
                        type="text"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className={`w-full text-sm px-3.5 py-2.5 rounded-lg border focus:outline-hidden focus:ring-1 focus:ring-purple-500 ${
                          isDark ? "bg-zinc-900 border-zinc-800 text-white" : "bg-white border-zinc-300 text-zinc-900"
                        }`}
                      />
                    </div>

                    {/* Last Name */}
                    <div>
                      <label className="text-xs font-semibold text-zinc-400 block mb-1">Last Name *</label>
                      <input
                        type="text"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className={`w-full text-sm px-3.5 py-2.5 rounded-lg border focus:outline-hidden focus:ring-1 focus:ring-purple-500 ${
                          isDark ? "bg-zinc-900 border-zinc-800 text-white" : "bg-white border-zinc-300 text-zinc-900"
                        }`}
                      />
                    </div>

                    {/* Address */}
                    <div className="sm:col-span-2">
                      <label className="text-xs font-semibold text-zinc-400 block mb-1">Street Address *</label>
                      <input
                        type="text"
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="e.g. 1600 Amphitheatre Pkwy, Bldg 41"
                        className={`w-full text-sm px-3.5 py-2.5 rounded-lg border focus:outline-hidden focus:ring-1 focus:ring-purple-500 ${
                          isDark ? "bg-zinc-900 border-zinc-800 text-white" : "bg-white border-zinc-300 text-zinc-900"
                        }`}
                      />
                    </div>

                    {/* Country Dropdown (includes US & India) */}
                    <div>
                      <label className="text-xs font-semibold text-zinc-400 block mb-1">Country *</label>
                      <select
                        value={country}
                        onChange={(e) => handleCountryChange(e.target.value)}
                        className={`w-full text-sm px-3.5 py-2.5 rounded-lg border focus:outline-hidden focus:ring-1 focus:ring-purple-500 ${
                          isDark ? "bg-zinc-900 border-zinc-800 text-white" : "bg-white border-zinc-300 text-zinc-900"
                        }`}
                      >
                        <option value="United States">🇺🇸 United States</option>
                        <option value="India">🇮🇳 India</option>
                      </select>
                    </div>

                    {/* City */}
                    <div>
                      <label className="text-xs font-semibold text-zinc-400 block mb-1">City *</label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className={`w-full text-sm px-3.5 py-2.5 rounded-lg border focus:outline-hidden focus:ring-1 focus:ring-purple-500 ${
                          isDark ? "bg-zinc-900 border-zinc-800 text-white" : "bg-white border-zinc-300 text-zinc-900"
                        }`}
                      />
                    </div>

                    {/* State / Province (changes placeholder based on country) */}
                    <div>
                      <label className="text-xs font-semibold text-zinc-400 block mb-1">
                        {country === "United States" ? "State" : "State / Union Territory"}
                      </label>
                      <input
                        type="text"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        placeholder={country === "United States" ? "e.g. California" : "e.g. Karnataka"}
                        className={`w-full text-sm px-3.5 py-2.5 rounded-lg border focus:outline-hidden focus:ring-1 focus:ring-purple-500 ${
                          isDark ? "bg-zinc-900 border-zinc-800 text-white" : "bg-white border-zinc-300 text-zinc-900"
                        }`}
                      />
                    </div>

                    {/* Zip/Postal code */}
                    <div>
                      <label className="text-xs font-semibold text-zinc-400 block mb-1">
                        {country === "United States" ? "ZIP Code *" : "PIN Code *"}
                      </label>
                      <input
                        type="text"
                        required
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                        className={`w-full text-sm px-3.5 py-2.5 rounded-lg border focus:outline-hidden focus:ring-1 focus:ring-purple-500 ${
                          isDark ? "bg-zinc-900 border-zinc-800 text-white" : "bg-white border-zinc-300 text-zinc-900"
                        }`}
                      />
                    </div>

                  </div>
                </fieldset>

                {/* STAGE 2: SECURE PAYMENT GATEWAY */}
                <fieldset className={`p-6 rounded-2xl border ${isDark ? "bg-ai-surface border-ai-border" : "bg-white border-zinc-200"}`} id="checkout-payment-fieldset">
                  <legend className="px-3 text-xs font-mono font-bold uppercase tracking-wider text-purple-400">
                    Step 2: Payment Details
                  </legend>

                  {/* Payment tab buttons */}
                  <div className="flex border-b border-zinc-800/10 dark:border-zinc-800/60 pb-3 mb-6 gap-2" id="payment-tabs-picker">
                    {[
                      { id: "card", label: "Credit Card" },
                      { id: "upi", label: "UPI (India hubs)" },
                      { id: "paypal", label: "PayPal" },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setPaymentTab(tab.id as any)}
                        className={`py-2 px-4 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                          paymentTab === tab.id
                            ? "bg-purple-500/10 text-purple-400 font-bold border border-purple-500/10"
                            : isDark
                            ? "text-zinc-500 hover:bg-zinc-900"
                            : "text-zinc-500 hover:bg-zinc-100"
                        }`}
                        id={`payment-tab-btn-${tab.id}`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* CARD TAB PANEL */}
                  {paymentTab === "card" && (
                    <div className="grid grid-cols-3 gap-4" id="card-tab-panel">
                      <div className="col-span-3">
                        <label className="text-xs font-semibold text-zinc-400 block mb-1">Card Number *</label>
                        <div className="relative">
                          <input
                            type="text"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            placeholder="4111 2222 3333 4444"
                            className={`w-full text-sm pl-10 pr-4 py-2.5 rounded-lg border focus:outline-hidden focus:ring-1 focus:ring-purple-500 ${
                              isDark ? "bg-zinc-900 border-zinc-800 text-white" : "bg-white border-zinc-300 text-zinc-900"
                            }`}
                          />
                          <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-zinc-500" />
                        </div>
                      </div>

                      <div className="col-span-2">
                        <label className="text-xs font-semibold text-zinc-400 block mb-1">Expiry Date *</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="MM/YY"
                          className={`w-full text-sm px-3.5 py-2.5 rounded-lg border focus:outline-hidden focus:ring-1 focus:ring-purple-500 ${
                            isDark ? "bg-zinc-900 border-zinc-800 text-white" : "bg-white border-zinc-300 text-zinc-900"
                          }`}
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-zinc-400 block mb-1">CVC *</label>
                        <input
                          type="text"
                          value={cardCVC}
                          onChange={(e) => setCardCVC(e.target.value)}
                          placeholder="123"
                          maxLength={4}
                          className={`w-full text-sm px-3.5 py-2.5 rounded-lg border focus:outline-hidden focus:ring-1 focus:ring-purple-500 ${
                            isDark ? "bg-zinc-900 border-zinc-800 text-white" : "bg-white border-zinc-300 text-zinc-900"
                          }`}
                        />
                      </div>
                    </div>
                  )}

                  {/* UPI PANEL */}
                  {paymentTab === "upi" && (
                    <div className="flex flex-col gap-3" id="upi-tab-panel">
                      <label className="text-xs font-semibold text-zinc-400 block mb-1">Virtual Payment Address (VPA / UPI ID) *</label>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="e.g. name@okhdfcbank"
                        className={`w-full text-sm px-3.5 py-2.5 rounded-lg border focus:outline-hidden focus:ring-1 focus:ring-purple-500 ${
                          isDark ? "bg-zinc-900 border-zinc-800 text-white" : "bg-white border-zinc-300 text-zinc-900"
                        }`}
                      />
                      <p className="text-[10px] text-zinc-500">
                        *Instant push notification will be fired to your Google Pay, BHIM, or PhonePe application upon clicking Place Order.
                      </p>
                    </div>
                  )}

                  {/* PAYPAL PANEL */}
                  {paymentTab === "paypal" && (
                    <div className="py-6 text-center border border-dashed rounded-xl border-zinc-800 bg-zinc-900/10" id="paypal-tab-panel">
                      <p className="text-xs mb-3">PayPal express payment will open securely in a separate popup frame.</p>
                      <span className="text-xs font-bold text-blue-400">PayPal integration ACTIVE</span>
                    </div>
                  )}
                </fieldset>

                {/* STAGE 3: ORDER REVIEW SUMMARY BAR */}
                <div className={`p-6 rounded-2xl border ${isDark ? "bg-ai-surface border-ai-border" : "bg-white border-zinc-200"}`} id="checkout-agreement-row">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-heading font-bold text-sm">Review & Process Authorization</h4>
                      <p className="text-xs text-zinc-500 leading-normal mt-1">
                        By authorizing this payment, you authorize the secure clearance of standard items, duties prepaid, to the specified address. No credit card information is permanently logged in AI Studio workspace files.
                      </p>
                    </div>
                  </div>
                </div>

              </form>
            </div>

            {/* RIGHT COLUMN: Sticky Order Summary Sidebar (lg:col-span-4) */}
            <div className="lg:col-span-4 flex flex-col gap-6 animate-fade-in" id="checkout-summary-column">
              <div
                className={`p-6 rounded-2xl border sticky top-24 ${
                  isDark ? "bg-ai-surface border-ai-border text-zinc-300" : "bg-white border-zinc-200 text-zinc-700"
                }`}
                id="checkout-summary-sidebar"
              >
                <h3 className={`font-heading font-bold text-base mb-6 pb-3 border-b ${isDark ? "border-zinc-800 text-white" : "border-zinc-100 text-zinc-900"}`}>
                  Review Order
                </h3>

                {/* Short item list review */}
                <div className="flex flex-col gap-3.5 mb-6 max-h-56 overflow-y-auto pr-1" id="checkout-sidebar-items-list">
                  {enrichedCartItems.map((it, idx) => (
                    <div key={idx} className="flex justify-between gap-3 text-xs">
                      <div>
                        <span className="font-bold">{it.product.name}</span>
                        {it.selectedSize && <span className="text-[10px] text-zinc-500 block">Size: {it.selectedSize}</span>}
                        <span className="text-zinc-500 block mt-0.5">Qty {it.quantity} x ${it.product.price}</span>
                      </div>
                      <span className="font-mono font-bold whitespace-nowrap">${it.product.price * it.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-3 text-xs mb-6 border-t border-zinc-800/15 dark:border-zinc-800 pt-5">
                  <div className="flex items-center justify-between">
                    <span>Subtotal</span>
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
                    <span>Est. Shipping Fees</span>
                    <span className="font-mono font-bold">
                      {shipping === 0 ? <span className="text-emerald-400 uppercase font-semibold">FREE</span> : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Estimated Taxes (8%)</span>
                    <span className="font-mono font-bold">${tax.toFixed(2)}</span>
                  </div>
                </div>

                <div className={`flex items-baseline justify-between border-t py-4 mb-6 ${isDark ? "border-zinc-800 text-white" : "border-zinc-100 text-zinc-900"}`}>
                  <span className="font-heading font-bold text-sm">Total Due</span>
                  <span className="font-mono text-xl sm:text-2xl font-extrabold text-blue-400" id="checkout-total-due">
                    ${total.toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  className="w-full flex items-center justify-center gap-2 text-sm font-bold text-white bg-linear-to-r from-blue-500 via-purple-500 to-rose-500 hover:opacity-95 transition-opacity py-4 px-6 rounded-xl shadow-lg cursor-pointer"
                  id="checkout-submit-btn"
                >
                  <ClipboardCheck className="h-4.5 w-4.5" /> Place Order Now
                </button>

                {couponCode && (
                  <p className="text-[10px] text-center text-emerald-400 mt-4 bg-emerald-500/10 p-2 rounded-lg font-semibold">
                    🎉 Promo Code {couponCode} applied to this security channel.
                  </p>
                )}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
export default CheckoutView;
