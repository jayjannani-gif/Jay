import React, { useState } from "react";
import { Award, Zap, Check, Gift, Copy, ArrowRight, X, Sparkles, Shield, Flame } from "lucide-react";
import { LoyaltyProfile } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface LoyaltyRewardsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: LoyaltyProfile;
  onCheckIn: () => void;
  onApplyCoupon: (code: string) => void;
  theme: "dark" | "light";
}

const REWARD_TIERS = [
  {
    level: 1,
    title: "Junior Coder",
    requiredXp: 0,
    badge: "🌱",
    perk: "Access to Developer Perks & Quiz Rewards",
  },
  {
    level: 2,
    title: "Mid-Level Engineer",
    requiredXp: 250,
    badge: "⚡",
    perk: "Unlock 15% OFF Storewide Coupon",
    couponCode: "DEVXP15",
  },
  {
    level: 3,
    title: "Senior Architect",
    requiredXp: 500,
    badge: "👑",
    perk: "Unlock $20 Gift Credit Voucher",
    couponCode: "DEVXP20",
  },
  {
    level: 4,
    title: "Principal Fellow",
    requiredXp: 1000,
    badge: "🏆",
    perk: "Free Express Shipping + Priority Merch Access",
    couponCode: "DEVEXPRESS",
  },
];

export const LoyaltyRewardsModal: React.FC<LoyaltyRewardsModalProps> = ({
  isOpen,
  onClose,
  profile,
  onCheckIn,
  onApplyCoupon,
  theme,
}) => {
  const isDark = theme === "dark";

  // Calculate current tier
  const currentTier = REWARD_TIERS.reduce((acc, tier) => {
    return profile.xp >= tier.requiredXp ? tier : acc;
  }, REWARD_TIERS[0]);

  const nextTier = REWARD_TIERS.find((t) => t.requiredXp > profile.xp) || REWARD_TIERS[REWARD_TIERS.length - 1];
  const progressPercent = Math.min(
    100,
    Math.round(((profile.xp - currentTier.requiredXp) / Math.max(1, nextTier.requiredXp - currentTier.requiredXp)) * 100)
  );

  const todayStr = new Date().toISOString().split("T")[0];
  const checkedInToday = profile.lastCheckInDate === todayStr;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/75 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          className={`relative w-full max-w-xl rounded-3xl p-6 sm:p-8 shadow-2xl z-10 border overflow-hidden ${
            isDark ? "bg-[#121318] text-white border-zinc-800" : "bg-white text-zinc-900 border-zinc-200"
          }`}
        >
          {/* Top Decorative Header */}
          <div className="absolute top-0 left-0 right-0 h-2 gemini-gradient-bg" />

          <button
            onClick={onClose}
            className={`absolute top-5 right-5 p-2 rounded-xl transition-colors cursor-pointer ${
              isDark ? "hover:bg-zinc-800 text-zinc-400" : "hover:bg-zinc-100 text-zinc-600"
            }`}
          >
            <X className="h-5 w-5" />
          </button>

          {/* Header Info */}
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500">
              <Award className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-heading font-extrabold tracking-tight">Google Dev XP Perks</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                  {currentTier.badge} Level {currentTier.level}
                </span>
              </div>
              <p className="text-xs text-zinc-400">Earn Dev XP with every interaction & unlock exclusive discounts</p>
            </div>
          </div>

          {/* XP Progress Card */}
          <div className={`p-5 rounded-2xl border mb-6 ${isDark ? "bg-zinc-900/90 border-zinc-800" : "bg-zinc-50 border-zinc-200"}`}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-xs text-zinc-400 font-mono uppercase tracking-wider block">Current Rank</span>
                <span className="text-lg font-bold font-heading text-amber-400">{currentTier.title}</span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-mono font-extrabold text-blue-500">{profile.xp}</span>
                <span className="text-xs text-zinc-400 ml-1 font-mono">XP</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-zinc-800 h-2.5 rounded-full overflow-hidden p-0.5 border border-white/5 mb-2">
              <div
                className="gemini-gradient-bg h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="flex justify-between text-[11px] text-zinc-400 font-mono">
              <span>{currentTier.title} ({currentTier.requiredXp} XP)</span>
              <span>Next: {nextTier.title} ({nextTier.requiredXp} XP)</span>
            </div>
          </div>

          {/* Daily Streak Check-in CTA */}
          <div className={`p-4 rounded-2xl border mb-6 flex items-center justify-between gap-4 ${
            checkedInToday
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
              : "bg-blue-500/10 border-blue-500/30 text-blue-400"
          }`}>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-black/20 shrink-0">
                <Flame className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <div className="font-bold text-xs">Daily Developer Check-in</div>
                <div className="text-[11px] opacity-80">
                  {checkedInToday ? "Checked in today! +25 XP Claimed." : "Claim +25 XP bonus for today!"}
                </div>
              </div>
            </div>

            <button
              onClick={onCheckIn}
              disabled={checkedInToday}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                checkedInToday
                  ? "bg-emerald-600/20 text-emerald-400 cursor-default"
                  : "bg-blue-600 hover:bg-blue-500 text-white shadow-md active:scale-95"
              }`}
            >
              {checkedInToday ? "Checked In ✓" : "Claim +25 XP"}
            </button>
          </div>

          {/* Tier Unlockables & Coupons List */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Unlockable Tier Rewards</h3>
            <div className="space-y-2.5">
              {REWARD_TIERS.slice(1).map((tier) => {
                const isUnlocked = profile.xp >= tier.requiredXp;
                return (
                  <div
                    key={tier.level}
                    className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 ${
                      isUnlocked
                        ? isDark ? "bg-zinc-900 border-emerald-500/40 text-white" : "bg-white border-emerald-400 text-zinc-900"
                        : isDark ? "bg-zinc-950/60 border-zinc-800/80 text-zinc-500" : "bg-zinc-100/80 border-zinc-200 text-zinc-400"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl p-1.5 rounded-xl bg-black/20">{tier.badge}</span>
                      <div>
                        <div className="font-bold text-xs flex items-center gap-1.5">
                          <span>{tier.title}</span>
                          <span className="text-[10px] font-mono px-2 py-0.2 bg-zinc-800 text-zinc-300 rounded-md">
                            {tier.requiredXp} XP
                          </span>
                        </div>
                        <div className="text-[11px] opacity-80 mt-0.5">{tier.perk}</div>
                      </div>
                    </div>

                    {isUnlocked && tier.couponCode ? (
                      <button
                        onClick={() => {
                          onApplyCoupon(tier.couponCode!);
                          onClose();
                        }}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold cursor-pointer transition-transform active:scale-95 shrink-0"
                      >
                        Apply {tier.couponCode}
                      </button>
                    ) : (
                      <span className="text-xs font-mono font-semibold opacity-60">Locked 🔒</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
