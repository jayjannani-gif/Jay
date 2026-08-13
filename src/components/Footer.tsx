import React, { useState } from "react";
import { Sparkles, Shield, CheckCircle, RotateCcw, Truck, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

interface FooterProps {
  onPageChange: (page: string) => void;
  theme: "dark" | "light";
  onShowToast?: (text: string, type?: "success" | "error" | "info") => void;
}

export const Footer: React.FC<FooterProps> = ({ onPageChange, theme, onShowToast }) => {
  const isDark = theme === "dark";
  const [emailInput, setEmailInput] = useState("");

  return (
    <footer
      className={`border-t transition-colors duration-300 relative overflow-hidden ${
        isDark ? "bg-[#05060A] border-white/10 text-zinc-400" : "bg-zinc-50 border-zinc-200 text-zinc-600"
      }`}
      id="app-footer"
    >
      {/* Background Ambient Glow */}
      <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Trust Guarantee Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5 }}
        className={`border-b ${isDark ? "border-white/10 bg-[#090A10]" : "border-zinc-200 bg-white"}`}
        id="footer-trust-bar"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center gap-3" id="trust-item-shipping">
              <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Truck className="h-5 w-5" />
              </div>
              <div>
                <h4 className={`text-sm font-mono font-bold uppercase tracking-wider ${isDark ? "text-white" : "text-zinc-900"}`}>
                  Global Express Shipping
                </h4>
                <p className="text-xs mt-0.5 text-zinc-400">Free delivery on orders over $35</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3" id="trust-item-returns">
              <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <RotateCcw className="h-5 w-5" />
              </div>
              <div>
                <h4 className={`text-sm font-mono font-bold uppercase tracking-wider ${isDark ? "text-white" : "text-zinc-900"}`}>
                  30-Day Easy Returns
                </h4>
                <p className="text-xs mt-0.5 text-zinc-400">Instant return label generation</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3" id="trust-item-security">
              <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <h4 className={`text-sm font-mono font-bold uppercase tracking-wider ${isDark ? "text-white" : "text-zinc-900"}`}>
                  Encrypted Checkout SSL
                </h4>
                <p className="text-xs mt-0.5 text-zinc-400">Safe merchant processing</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3" id="trust-item-authenticity">
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <CheckCircle className="h-5 w-5" />
              </div>
              <div>
                <h4 className={`text-sm font-mono font-bold uppercase tracking-wider ${isDark ? "text-white" : "text-zinc-900"}`}>
                  100% Certified Authentic
                </h4>
                <p className="text-xs mt-0.5 text-zinc-400">Official Google Merch tags</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Footer Links */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 relative z-10"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Column 1 - Brand Info */}
          <div className="space-y-4">
            <div
              onClick={() => onPageChange("home")}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className={`p-2 rounded-xl border shadow-md group-hover:scale-105 transition-transform flex items-center justify-center ${
                isDark ? "bg-[#0F111A] border-white/15" : "bg-white border-zinc-200"
              }`}>
                <svg viewBox="0 0 24 24" className="h-4 w-4" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
              </div>
              <span className={`font-display font-extrabold text-lg tracking-wider ${isDark ? "text-white" : "text-zinc-900"}`}>
                GOOGLE <span className="text-blue-500">MERCH</span>
              </span>
            </div>

            <p className="text-xs leading-relaxed max-w-xs text-zinc-400">
              High-performance developer gear, licensed apparel, drinkware, and custom print tools engineered for creators worldwide.
            </p>

            <div className="flex gap-2 pt-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                US Hub
              </span>
              <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                India Hub
              </span>
            </div>
          </div>

          {/* Column 2 - Catalog */}
          <div>
            <h3 className={`font-mono font-bold text-xs uppercase tracking-widest mb-4 ${isDark ? "text-white" : "text-zinc-900"}`}>
              Explore Shop
            </h3>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <button onClick={() => onPageChange("shop")} className="hover:text-blue-400 transition-colors cursor-pointer">
                  Entire Catalog
                </button>
              </li>
              <li>
                <button onClick={() => onPageChange("shop")} className="hover:text-blue-400 transition-colors cursor-pointer">
                  Developer Fleeces & Apparel
                </button>
              </li>
              <li>
                <button onClick={() => onPageChange("studio")} className="hover:text-purple-400 transition-colors cursor-pointer flex items-center gap-1.5">
                  <Sparkles className="h-3 w-3 text-purple-400" />
                  <span>Custom Print Studio</span>
                </button>
              </li>
              <li>
                <button onClick={() => onPageChange("shop")} className="hover:text-blue-400 transition-colors cursor-pointer">
                  Vacuum Insulated Drinkware
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3 - Brand Story */}
          <div>
            <h3 className={`font-mono font-bold text-xs uppercase tracking-widest mb-4 ${isDark ? "text-white" : "text-zinc-900"}`}>
              Company & FAQs
            </h3>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <button onClick={() => onPageChange("about")} className="hover:text-blue-400 transition-colors cursor-pointer">
                  Our Brand Story
                </button>
              </li>
              <li>
                <button onClick={() => onPageChange("contact")} className="hover:text-blue-400 transition-colors cursor-pointer">
                  Frequently Asked FAQs
                </button>
              </li>
              <li>
                <button onClick={() => onPageChange("contact")} className="hover:text-blue-400 transition-colors cursor-pointer">
                  Support & Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4 - Newsletter */}
          <div>
            <h3 className={`font-mono font-bold text-xs uppercase tracking-widest mb-4 ${isDark ? "text-white" : "text-zinc-900"}`}>
              Developer Drops
            </h3>
            <p className="text-xs mb-3 text-zinc-400 leading-relaxed">
              Subscribe for exclusive gear releases. Use checkout code <code className="text-amber-400 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded">SHOPWEEK15</code> for 15% off.
            </p>

            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Developer email..."
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className={`flex-1 text-xs px-3.5 py-2.5 rounded-xl border font-mono focus:outline-hidden focus:ring-1 focus:ring-blue-500 ${
                  isDark ? "bg-[#0E1018] border-white/15 text-white" : "bg-white border-zinc-300 text-zinc-900"
                }`}
              />
              <button
                onClick={() => {
                  if (!emailInput || !emailInput.includes("@")) {
                    if (onShowToast) onShowToast("Please enter a valid email address.", "error");
                    return;
                  }
                  if (onShowToast) onShowToast("Successfully subscribed to gear drop alerts!", "success");
                  setEmailInput("");
                }}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white cursor-pointer transition-colors"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

        </div>

        {/* Lower copyright bar */}
        <div className={`border-t mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono ${
          isDark ? "border-white/10 text-zinc-500" : "border-zinc-200 text-zinc-500"
        }`}>
          <p>© {new Date().getFullYear()} Google Merch Store. All Rights Reserved.</p>
          <div className="flex gap-4">
            <span className="hover:text-blue-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-blue-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-blue-400 cursor-pointer">Cookie Settings</span>
          </div>
        </div>
      </motion.div>
    </footer>
  );
};
export default Footer;
