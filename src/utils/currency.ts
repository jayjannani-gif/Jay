import { CurrencyCode } from "../types";

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  rate: number; // relative to USD base
  name: string;
  flag: string;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  USD: {
    code: "USD",
    symbol: "$",
    rate: 1.0,
    name: "US Dollar",
    flag: "🇺🇸",
  },
  INR: {
    code: "INR",
    symbol: "₹",
    rate: 85,
    name: "Indian Rupee",
    flag: "🇮🇳",
  },
  CAD: {
    code: "CAD",
    symbol: "CA$",
    rate: 1.35,
    name: "Canadian Dollar",
    flag: "🇨🇦",
  },
  GBP: {
    code: "GBP",
    symbol: "£",
    rate: 0.79,
    name: "British Pound",
    flag: "🇬🇧",
  },
};

export function formatPrice(amountInUSD: number, currency: CurrencyCode = "USD"): string {
  const config = CURRENCIES[currency] || CURRENCIES.USD;
  const converted = amountInUSD * config.rate;

  if (currency === "INR") {
    // Round to whole rupees
    return `${config.symbol}${Math.round(converted).toLocaleString("en-IN")}`;
  }

  // Two decimals for USD, CAD, GBP
  return `${config.symbol}${converted.toFixed(2)}`;
}

export function formatPriceInt(amountInUSD: number, currency: CurrencyCode = "USD"): string {
  const config = CURRENCIES[currency] || CURRENCIES.USD;
  const converted = Math.round(amountInUSD * config.rate);
  return `${config.symbol}${converted.toLocaleString()}`;
}

export function convertFromUSD(amountInUSD: number, currency: CurrencyCode = "USD"): number {
  const config = CURRENCIES[currency] || CURRENCIES.USD;
  return amountInUSD * config.rate;
}

/**
 * Checks if a product's USD price falls into budget tiers.
 * Budget labels:
 * - "Under ₹1,000" or "Under $15"
 * - "₹1,000–₹2,500" or "$15–$30"
 * - "₹2,500–₹5,000" or "$30–$60"
 * - "₹5,000+" or "$60+"
 */
export function matchesBudget(priceInUSD: number, budgetLabel: string): boolean {
  if (!budgetLabel || budgetLabel === "All" || budgetLabel === "Any") return true;

  const b = budgetLabel.toLowerCase();
  if (b.includes("under") && (b.includes("1,000") || b.includes("1000") || b.includes("15") || b.includes("12"))) {
    return priceInUSD < 15;
  }
  if ((b.includes("1,000") || b.includes("1000")) && (b.includes("2,500") || b.includes("2500") || b.includes("30"))) {
    return priceInUSD >= 12 && priceInUSD <= 30;
  }
  if ((b.includes("2,500") || b.includes("2500")) && (b.includes("5,000") || b.includes("5000") || b.includes("60"))) {
    return priceInUSD > 28 && priceInUSD <= 60;
  }
  if (b.includes("5,000+") || b.includes("5000+") || b.includes("60+")) {
    return priceInUSD >= 58;
  }

  // Fallback direct price check if numeric
  const numbers = budgetLabel.match(/\d+/g)?.map(Number);
  if (numbers && numbers.length === 1) {
    if (budgetLabel.includes("<") || budgetLabel.toLowerCase().includes("under")) {
      return priceInUSD <= numbers[0] / (budgetLabel.includes("₹") ? 85 : 1);
    }
  }

  return true;
}
