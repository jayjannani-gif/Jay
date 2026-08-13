import React from "react";
import { Sparkles, Mail, Shield, CheckCircle, RotateCcw, Truck } from "lucide-react";

interface FooterProps {
  onPageChange: (page: string) => void;
  theme: "dark" | "light";
  onShowToast?: (text: string, type?: "success" | "error" | "info") => void;
}

export const Footer: React.FC<FooterProps> = ({ onPageChange, theme, onShowToast }) => {
  const isDark = theme === "dark";
  const [emailInput, setEmailInput] = React.useState("");

  return (
    <footer
      className={`border-t transition-colors duration-300 ${
        isDark ? "bg-[#0A0B0E] border-ai-border text-zinc-400" : "bg-zinc-50 border-zinc-200 text-zinc-600"
      }`}
      id="app-footer"
    >
      {/* Dynamic Trust bar inside footer area */}
      <div className={`border-b ${isDark ? "border-ai-border/60 bg-ai-surface/20" : "border-zinc-200 bg-white"}`} id="footer-trust-bar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center gap-3" id="trust-item-shipping">
              <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-400">
                <Truck className="h-5 w-5" />
              </div>
              <div>
                <h4 className={`text-sm font-semibold font-heading ${isDark ? "text-zinc-200" : "text-zinc-900"}`}>Free Global Shipping</h4>
                <p className="text-xs mt-0.5">On orders over $35 (US & India priority hubs)</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3" id="trust-item-returns">
              <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-400">
                <RotateCcw className="h-5 w-5" />
              </div>
              <div>
                <h4 className={`text-sm font-semibold font-heading ${isDark ? "text-zinc-200" : "text-zinc-900"}`}>30-Day Easy Returns</h4>
                <p className="text-xs mt-0.5">Hassle-free shipping labels generated instantly</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3" id="trust-item-security">
              <div className="p-2.5 rounded-lg bg-rose-500/10 text-rose-400">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <h4 className={`text-sm font-semibold font-heading ${isDark ? "text-zinc-200" : "text-zinc-900"}`}>Secure Checkout SSL</h4>
                <p className="text-xs mt-0.5">Enriched OAuth encryption & safe merchant processing</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3" id="trust-item-authenticity">
              <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                <CheckCircle className="h-5 w-5" />
              </div>
              <div>
                <h4 className={`text-sm font-semibold font-heading ${isDark ? "text-zinc-200" : "text-zinc-900"}`}>100% Certified Original</h4>
                <p className="text-xs mt-0.5">Official Google Merch Store verified items</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Column 1 - Brand Summary */}
          <div className="flex flex-col gap-4">
            <div
              onClick={() => onPageChange("home")}
              className="flex items-center gap-2 cursor-pointer group w-fit"
            >
              <div className={`p-1.5 rounded-lg shadow-xs group-hover:scale-105 transition-transform flex items-center justify-center ${
                isDark ? "bg-zinc-900 border border-zinc-800" : "bg-white border border-zinc-100"
              }`}>
                <svg viewBox="0 0 24 24" className="h-4 w-4" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
              </div>
              <span className={`font-heading font-bold text-lg tracking-tight ${isDark ? "text-white" : "text-zinc-900"}`}>
                Google <span className="text-red-600 font-extrabold">Merch Store</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed max-w-sm">
              The premium Google Store redesign inspired by the sleek visual layout of AI Studio. Merging intelligent interfaces with official brand apparel, tech, drinkware, and accessories for developers globally.
            </p>
            <div className="flex gap-2.5 mt-2">
              <span className="text-[10px] font-sans uppercase tracking-wider py-1 px-2.5 rounded bg-zinc-800/60 text-zinc-300 border border-zinc-700/30 font-bold">
                US Hub
              </span>
              <span className="text-[10px] font-sans uppercase tracking-wider py-1 px-2.5 rounded bg-zinc-800/60 text-zinc-300 border border-zinc-700/30 font-bold">
                India Hub
              </span>
            </div>
          </div>

          {/* Column 2 - Catalog Links */}
          <div>
            <h3 className={`font-heading font-bold text-sm tracking-wide uppercase mb-4 ${isDark ? "text-zinc-200" : "text-zinc-900"}`}>
              Shop Catalog
            </h3>
            <ul className="flex flex-col gap-2.5 text-xs">
              <li>
                <button onClick={() => onPageChange("shop")} className="hover:text-blue-400 transition-colors cursor-pointer">
                  All Collections
                </button>
              </li>
              <li>
                <button onClick={() => onPageChange("shop")} className="hover:text-blue-400 transition-colors cursor-pointer">
                  Apparel & Fleeces
                </button>
              </li>
              <li>
                <button onClick={() => onPageChange("shop")} className="hover:text-blue-400 transition-colors cursor-pointer">
                  Tech Sleeves & Gears
                </button>
              </li>
              <li>
                <button onClick={() => onPageChange("shop")} className="hover:text-blue-400 transition-colors cursor-pointer">
                  Vacuum Insulated Drinkware
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3 - Corporate/Story */}
          <div>
            <h3 className={`font-heading font-bold text-sm tracking-wide uppercase mb-4 ${isDark ? "text-zinc-200" : "text-zinc-900"}`}>
              The Project
            </h3>
            <ul className="flex flex-col gap-2.5 text-xs">
              <li>
                <button onClick={() => onPageChange("about")} className="hover:text-blue-400 transition-colors cursor-pointer">
                  Our Brand Story
                </button>
              </li>
              <li>
                <a href="https://ai.studio" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                  Google AI Studio UI
                </a>
              </li>
              <li>
                <button onClick={() => onPageChange("contact")} className="hover:text-blue-400 transition-colors cursor-pointer">
                  Frequently Asked FAQs
                </button>
              </li>
              <li>
                <button onClick={() => onPageChange("contact")} className="hover:text-blue-400 transition-colors cursor-pointer">
                  Global Support Desk
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4 - Campaign Newsletter */}
          <div>
            <h3 className={`font-heading font-bold text-sm tracking-wide uppercase mb-4 ${isDark ? "text-zinc-200" : "text-zinc-900"}`}>
              Smart Shopping Week
            </h3>
            <p className="text-xs mb-4 leading-relaxed">
              Unlock 15% off everything during our active sprint. Enter checkout coupon code <span className="font-sans font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">SHOPWEEK15</span>.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Developer email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className={`flex-1 text-xs px-3 py-2 rounded-lg border focus:outline-hidden focus:ring-1 focus:ring-purple-500 ${
                  isDark ? "bg-zinc-900 border-zinc-800 text-white" : "bg-white border-zinc-300 text-zinc-900"
                }`}
                aria-label="Email address for subscription"
              />
              <button
                onClick={() => {
                  if (!emailInput || !emailInput.includes("@")) {
                    if (onShowToast) {
                      onShowToast("Please enter a valid email address.", "error");
                    } else {
                      alert("Please enter a valid email address.");
                    }
                    return;
                  }
                  if (onShowToast) {
                    onShowToast("Successfully subscribed! Look out for exclusive prompt engineering gear drops.", "success");
                  } else {
                    alert("Successfully subscribed! Look out for exclusive prompt engineering gear drops.");
                  }
                  setEmailInput("");
                }}
                className="p-2 rounded-lg bg-red-600 hover:bg-red-500 text-white cursor-pointer transition-colors duration-300"
                aria-label="Subscribe"
              >
                <Mail className="h-4 w-4" />
              </button>
            </div>
          </div>

        </div>

        {/* Lower copyright bar */}
        <div className={`border-t mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] ${isDark ? "border-ai-border/50" : "border-zinc-200"}`}>
          <p>© {new Date().getFullYear()} Redesigned Google Merch Store. Fully functional preview powered by Google AI Studio.</p>
          <div className="flex gap-4">
            <span className="hover:text-blue-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-blue-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-blue-400 cursor-pointer">Cookie Preferences</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
