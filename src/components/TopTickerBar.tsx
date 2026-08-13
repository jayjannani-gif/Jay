import React from "react";
import { Sparkles, Truck, ShieldCheck, Zap, ArrowUpRight } from "lucide-react";

interface TopTickerBarProps {
  theme: "dark" | "light";
  onOpenStudio: () => void;
  onOpenStylist: () => void;
}

export const TopTickerBar: React.FC<TopTickerBarProps> = ({ theme, onOpenStudio, onOpenStylist }) => {
  const isDark = theme === "dark";

  const tickerItems = [
    { icon: <Truck className="h-3 w-3 text-emerald-400" />, text: "FREE EXPRESS WORLDWIDE SHIPPING ON ORDERS $50+" },
    { icon: <Sparkles className="h-3 w-3 text-amber-400" />, text: "OFFICIAL GOOGLE & GEMINI DEVELOPER GEAR 2026" },
    { icon: <Zap className="h-3 w-3 text-purple-400" />, text: "PRINT-ON-DEMAND CUSTOM MERCH STUDIO LIVE", action: onOpenStudio, actionText: "OPEN STUDIO" },
    { icon: <ShieldCheck className="h-3 w-3 text-blue-400" />, text: "AUTHENTIC QUALITY • 100% ORGANIC COTTON & RECYCLED MATERIALS" },
    { icon: <Sparkles className="h-3 w-3 text-pink-400" />, text: "AI MERCH STYLIST ASSISTANT 24/7", action: onOpenStylist, actionText: "ASK STYLIST" },
  ];

  return (
    <div
      className={`relative w-full overflow-hidden text-[11px] font-mono font-medium py-2.5 border-b select-none transition-colors duration-300 ${
        isDark
          ? "bg-[#090A0D] text-zinc-300 border-zinc-800/80"
          : "bg-[#0F1015] text-zinc-200 border-zinc-900"
      }`}
      id="top-ticker-banner"
    >
      <div className="flex animate-marquee-slow whitespace-nowrap gap-12 items-center">
        {[...tickerItems, ...tickerItems, ...tickerItems].map((item, idx) => (
          <div key={idx} className="flex items-center gap-2.5 shrink-0">
            {item.icon}
            <span className="tracking-widest uppercase text-[10px]">{item.text}</span>
            {item.action && (
              <button
                onClick={item.action}
                className="ml-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer border border-white/20 flex items-center gap-1 active:scale-95"
              >
                <span>{item.actionText}</span>
                <ArrowUpRight className="h-2.5 w-2.5" />
              </button>
            )}
            <span className="text-zinc-600 ml-4 opacity-50">•</span>
          </div>
        ))}
      </div>
    </div>
  );
};
