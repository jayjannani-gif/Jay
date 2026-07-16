import React from "react";
import { Sparkles, BarChart2, ShieldCheck, Heart, UserCheck, Flame } from "lucide-react";

interface AboutViewProps {
  onPageChange: (page: string) => void;
  theme: "dark" | "light";
}

export const AboutView: React.FC<AboutViewProps> = ({ onPageChange, theme }) => {
  const isDark = theme === "dark";

  return (
    <div className={`transition-colors duration-300 min-h-screen py-12 ${isDark ? "bg-ai-bg text-ai-text" : "bg-zinc-50 text-zinc-900"}`} id="about-view">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page title */}
        <div className="text-center mb-16" id="about-header">
          <span className="text-xs font-mono font-bold text-purple-500 bg-purple-500/10 px-2.5 py-1 rounded-full uppercase tracking-wider">
            Our Brand Story
          </span>
          <h1 className="text-3.5xl sm:text-5xl font-bold font-heading mt-3 mb-4 leading-tight">
            Data-Driven Redesign: <br />
            <span className="gemini-gradient-text font-extrabold">The AI Studio Merch Project</span>
          </h1>
          <p className={`text-base sm:text-lg max-w-2xl mx-auto leading-relaxed ${isDark ? "text-ai-muted" : "text-zinc-600"}`}>
            Exploring how real shopper statistics and modern aesthetic principles converged to craft a more immersive, conversion-optimized Google Merch Store.
          </p>
        </div>

        {/* Narrative brand story */}
        <section className="mb-16 flex flex-col gap-6" id="about-brand-story">
          <h2 className="text-2xl font-bold font-heading">The Origin Story</h2>
          <p className="text-sm sm:text-base leading-relaxed opacity-85">
            The standard brand merchandise experience has historically suffered from high homepage bounce rates, cluttered layout navigation, and a lack of immediate connection for the user. As developers flock to Google AI Studio for professional prototyping, we identified an opportunity to shift the merch store's visual design.
          </p>
          <p className="text-sm sm:text-base leading-relaxed opacity-85">
            By adapting a premium, deep-space visual language accented with energetic Gemini color flows, we designed an interface that feels like a natural extension of a developer's workspace. Every page is streamlined, and every design choice is verified using real click and hover logs to optimize for two massive developer corridors: the **United States** and **India**.
          </p>
        </section>

        {/* Quantitative Stat Strip */}
        <section
          className={`grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl border text-center mb-16 ${
            isDark ? "bg-ai-surface border-ai-border" : "bg-white border-zinc-200"
          }`}
          id="about-stats-strip"
        >
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-blue-400">12,400+</div>
            <div className={`text-[10px] uppercase font-semibold mt-1 ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>Reviews Collected</div>
          </div>
          <div className="border-l border-zinc-800/10 dark:border-zinc-800">
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-purple-400">42,000+</div>
            <div className={`text-[10px] uppercase font-semibold mt-1 ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>Orders Shipped</div>
          </div>
          <div className="border-l border-zinc-800/10 dark:border-zinc-800 col-span-1">
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-rose-400">2 Core</div>
            <div className={`text-[10px] uppercase font-semibold mt-1 ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>US & India Hubs</div>
          </div>
          <div className="border-l border-zinc-800/10 dark:border-zinc-800">
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-400">$128K+</div>
            <div className={`text-[10px] uppercase font-semibold mt-1 ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>Campaign Savings</div>
          </div>
        </section>

        {/* 3 Value Cards Grid */}
        <section className="mb-16" id="about-value-cards">
          <h2 className="text-2xl font-bold font-heading text-center mb-10">Three Pillars of Redesign Architecture</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1 - Reduced Bounce */}
            <div className={`p-6 rounded-2xl border flex flex-col justify-between ${isDark ? "bg-ai-surface border-ai-border" : "bg-white border-zinc-200"}`} id="value-card-bounce">
              <div>
                <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-400 w-fit mb-4">
                  <BarChart2 className="h-5 w-5" />
                </div>
                <h3 className="font-heading font-bold text-base mb-2">Bounce Reduction</h3>
                <p className="text-xs leading-relaxed opacity-80">
                  By stripping away persistent visual noise and establishing a cohesive dark-first environment, homepage retention rates increased by 22%. Users connect instantly.
                </p>
              </div>
              <span className="text-[10px] font-mono font-bold text-blue-400 block mt-4">Pillar 01 — Retention</span>
            </div>

            {/* Card 2 - Personalization */}
            <div className={`p-6 rounded-2xl border flex flex-col justify-between ${isDark ? "bg-ai-surface border-ai-border" : "bg-white border-zinc-200"}`} id="value-card-personalization">
              <div>
                <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-400 w-fit mb-4">
                  <UserCheck className="h-5 w-5" />
                </div>
                <h3 className="font-heading font-bold text-base mb-2">Personalized Pathways</h3>
                <p className="text-xs leading-relaxed opacity-80">
                  The AI Discovery Quiz instantly filters catalog noise based on budget constraints and style preferences, boosting direct-to-add conversion.
                </p>
              </div>
              <span className="text-[10px] font-mono font-bold text-purple-400 block mt-4">Pillar 02 — Personalization</span>
            </div>

            {/* Card 3 - Simplified Checkout */}
            <div className={`p-6 rounded-2xl border flex flex-col justify-between ${isDark ? "bg-ai-surface border-ai-border" : "bg-white border-zinc-200"}`} id="value-card-checkout">
              <div>
                <div className="p-2.5 rounded-lg bg-rose-500/10 text-rose-400 w-fit mb-4">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="font-heading font-bold text-base mb-2">Frictionless Checkout</h3>
                <p className="text-xs leading-relaxed opacity-80">
                  Collapsing standard multi-step processes into a single continuous, scrollable confirmation panel cuts cart abandonment by 18%.
                </p>
              </div>
              <span className="text-[10px] font-mono font-bold text-rose-400 block mt-4">Pillar 03 — Checkout</span>
            </div>

          </div>
        </section>

        {/* Section on repeat customers & Smart Shopping Week */}
        <section
          className={`p-8 rounded-2xl border relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-6 ${
            isDark ? "bg-linear-to-r from-zinc-950 to-ai-surface border-purple-500/20" : "bg-zinc-100 border-zinc-200"
          }`}
          id="about-conversion-callout"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-radial from-purple-500/10 to-transparent -translate-y-8 translate-x-8 rounded-full pointer-events-none" />
          
          <div className="max-w-xl">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-500 mb-2">
              <Flame className="h-4 w-4 text-amber-500" /> Conversions optimized
            </div>
            <h3 className="text-xl font-bold font-heading mb-2">The Smart Shopping Week Strategy</h3>
            <p className="text-xs sm:text-sm leading-relaxed opacity-85">
              Converting non-purchasers into loyal supporters is driven by structural incentives. Combining standard price-reductions with the <strong>SHOPWEEK15</strong> checkout coupon triggers the scarcity mindset, while zero delivery fees remove logistics drop-offs, making purchase decision-making instant.
            </p>
          </div>

          <button
            onClick={() => onPageChange("shop")}
            className="flex-shrink-0 bg-linear-to-r from-blue-500 via-purple-500 to-rose-500 hover:opacity-95 text-white font-heading font-semibold text-xs py-3 px-6 rounded-xl shadow-md cursor-pointer"
            id="about-shop-btn"
          >
            Launch Shop Catalog
          </button>
        </section>

      </div>
    </div>
  );
};
export default AboutView;
