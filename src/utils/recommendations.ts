import { Product, DiscoveryPreferences, GiftPreferences } from "../types";
import { PRODUCTS } from "../data";
import { matchesBudget } from "./currency";

export interface ScoredRecommendation {
  product: Product;
  score: number;
  reason: string;
}

/**
 * Find Your Google Recommendation Engine (Rule-based)
 */
export function getFindYourGoogleRecommendations(prefs: DiscoveryPreferences): ScoredRecommendation[] {
  const scored = PRODUCTS.map((product) => {
    let score = 0;
    const reasons: string[] = [];

    // Vibe match (+30 pts)
    if (product.style.toLowerCase() === prefs.vibe.toLowerCase()) {
      score += 30;
      reasons.push(`${product.style} aesthetic`);
    }

    // Interests match (+20 pts per match)
    if (prefs.interests && prefs.interests.length > 0) {
      const interestMatches = prefs.interests.filter((interest) => {
        const intLower = interest.toLowerCase();
        return (
          product.useCases.some((uc) => uc.toLowerCase().includes(intLower)) ||
          product.tags.some((t) => t.toLowerCase().includes(intLower)) ||
          product.category.toLowerCase().includes(intLower) ||
          product.name.toLowerCase().includes(intLower)
        );
      });

      if (interestMatches.length > 0) {
        score += interestMatches.length * 20;
        reasons.push(`matches ${interestMatches.join(", ")}`);
      }
    }

    // Purpose match (+15 pts)
    if (prefs.purpose === "For Someone Else") {
      if (product.useCases.includes("Gifting") || ["1", "6", "10", "13", "5"].includes(product.id)) {
        score += 20;
        reasons.push("easy gifting favorite");
      }
    } else if (prefs.purpose === "Something New") {
      if (product.badge === "New" || product.rank === 1) {
        score += 20;
        reasons.push("new arrival spotlight");
      }
    } else if (prefs.purpose === "For Me") {
      score += 10;
    }

    // Budget match (+25 pts)
    if (prefs.budget && matchesBudget(product.price, prefs.budget)) {
      score += 25;
      reasons.push("comfortably in budget");
    }

    // Base quality bonus
    score += (product.rating - 4.0) * 10;

    const reasonText = reasons.length > 0
      ? `Picked for your ${reasons.slice(0, 2).join(" & ")}`
      : `Tailored pick for your ${prefs.vibe} aesthetic`;

    return { product, score, reason: reasonText };
  });

  return scored.sort((a, b) => b.score - a.score).slice(0, 6);
}

/**
 * Gift Lab Recommendation Engine (Rule-based)
 */
export function getGiftLabRecommendations(giftPrefs: GiftPreferences): ScoredRecommendation[] {
  const scored = PRODUCTS.map((product) => {
    let score = 0;
    const reasons: string[] = [];

    // Recipient audience match (+35 pts)
    const rec = giftPrefs.recipient.toLowerCase();
    const matchesAudience = product.audience.some((aud) => aud.toLowerCase().includes(rec));
    if (matchesAudience) {
      score += 35;
      reasons.push(`beloved by ${giftPrefs.recipient}s`);
    }

    // Specific recipient affinities
    if (giftPrefs.recipient === "Colleague") {
      if (["1", "10", "13", "4", "11"].includes(product.id)) {
        score += 20;
        reasons.push("workplace desk staple");
      }
    } else if (giftPrefs.recipient === "Student") {
      if (["2", "5", "6", "9", "12", "13"].includes(product.id)) {
        score += 25;
        reasons.push("campus favorite");
      }
    } else if (giftPrefs.recipient === "Google Fan") {
      if (["2", "3", "5", "6", "7", "9"].includes(product.id)) {
        score += 30;
        reasons.push("authentic Google culture collectible");
      }
    } else if (giftPrefs.recipient === "Partner") {
      if (["7", "10", "4", "6"].includes(product.id)) {
        score += 25;
        reasons.push("thoughtful comfort pick");
      }
    }

    // Interests match (+20 pts per match)
    if (giftPrefs.interests && giftPrefs.interests.length > 0) {
      const matched = giftPrefs.interests.filter((item) => {
        const itemLower = item.toLowerCase();
        return (
          product.useCases.some((uc) => uc.toLowerCase().includes(itemLower)) ||
          product.tags.some((t) => t.toLowerCase().includes(itemLower)) ||
          product.category.toLowerCase().includes(itemLower)
        );
      });
      if (matched.length > 0) {
        score += matched.length * 20;
        reasons.push(`aligned with ${matched.join(", ")}`);
      }
    }

    // Budget match (+25 pts)
    if (giftPrefs.budget && matchesBudget(product.price, giftPrefs.budget)) {
      score += 25;
    }

    // General Gifting score
    if (product.useCases.includes("Gifting")) {
      score += 15;
    }

    const reasonText = reasons.length > 0
      ? `Great for a ${giftPrefs.recipient} who loves ${reasons[0]}`
      : `Thoughtful present suited for a ${giftPrefs.recipient}`;

    return { product, score, reason: reasonText };
  });

  return scored.sort((a, b) => b.score - a.score).slice(0, 6);
}

/**
 * Filter products by Merch Mood
 */
export function getProductsByMood(mood: string): Product[] {
  if (!mood || mood === "All") return PRODUCTS;
  const filtered = PRODUCTS.filter((p) =>
    p.moods.some((m) => m.toLowerCase() === mood.toLowerCase())
  );
  return filtered.length > 0 ? filtered : PRODUCTS.slice(0, 6);
}

/**
 * Complete The Look Recommendation
 */
export function getCompleteTheLookItems(productId: string): Product[] {
  const current = PRODUCTS.find((p) => p.id === productId) || PRODUCTS[0];
  if (current.complementaryProductIds && current.complementaryProductIds.length > 0) {
    const items = current.complementaryProductIds
      .map((id) => PRODUCTS.find((p) => p.id === id))
      .filter((p): p is Product => p !== undefined);
    if (items.length >= 2) return items.slice(0, 3);
  }

  // Fallback: Pick items from different categories that share style or ecosystem
  return PRODUCTS.filter((p) => p.id !== current.id && p.category !== current.category)
    .slice(0, 3);
}

/**
 * Product Comparison Helper: Determines "Best for you"
 */
export function getBestForYouComparison(products: Product[], prefs?: DiscoveryPreferences): { bestProduct: Product; reason: string } {
  if (!products || products.length === 0) {
    return { bestProduct: PRODUCTS[0], reason: "Top community favorite" };
  }

  if (!prefs || !prefs.vibe) {
    // Default to highest rated item
    const sorted = [...products].sort((a, b) => b.rating - a.rating);
    return {
      bestProduct: sorted[0],
      reason: `Highest rated product (${sorted[0].rating}★ with ${sorted[0].reviewCount} reviews)`
    };
  }

  // Match against preferences
  let best = products[0];
  let highestScore = -1;
  let bestReason = "Strongest overall balance";

  products.forEach((p) => {
    let score = 0;
    let reason = "";

    if (p.style.toLowerCase() === prefs.vibe.toLowerCase()) {
      score += 30;
      reason = `Direct match for your ${prefs.vibe} style preference`;
    }
    if (prefs.budget && matchesBudget(p.price, prefs.budget)) {
      score += 20;
      if (!reason) reason = "Fits cleanly in your selected budget tier";
    }
    score += p.rating * 5;

    if (score > highestScore) {
      highestScore = score;
      best = p;
      bestReason = reason || `Top recommended for your ${prefs.vibe} aesthetic`;
    }
  });

  return { bestProduct: best, reason: bestReason };
}

/**
 * Smart Search Parser & Matcher
 * Parses natural queries such as:
 * - "gifts under 2000" / "under 25" / "under 1000"
 * - "something for my desk"
 * - "minimal Google merch"
 * - "gift for a tech friend"
 * - "travel products"
 */
export function executeSmartSearch(rawQuery: string): {
  results: Product[];
  appliedFilters: {
    maxPrice?: number;
    inferredCategory?: string;
    inferredStyle?: string;
    inferredUseCase?: string;
    tokens: string[];
  };
} {
  const query = rawQuery.trim().toLowerCase();
  if (!query) return { results: [], appliedFilters: { tokens: [] } };

  const tokens = query.split(/\s+/).filter((t) => t.length > 1);
  let maxPrice: number | undefined = undefined;
  let inferredCategory: string | undefined = undefined;
  let inferredStyle: string | undefined = undefined;
  let inferredUseCase: string | undefined = undefined;

  // 1. Price parsing
  const underMatch = query.match(/(?:under|below|less than|<)\s*(?:₹|\$)?\s*(\d+)/i);
  if (underMatch) {
    const rawNum = parseInt(underMatch[1], 10);
    // If > 100, assume INR (rate 85)
    maxPrice = rawNum > 100 ? rawNum / 85 : rawNum;
  }

  // 2. Desk / Workspace parsing
  if (query.includes("desk") || query.includes("workspace") || query.includes("table")) {
    inferredUseCase = "Desk Setup";
  } else if (query.includes("travel") || query.includes("commute") || query.includes("trip")) {
    inferredUseCase = "Travel";
  } else if (query.includes("code") || query.includes("coding") || query.includes("engineer")) {
    inferredUseCase = "Coding";
  }

  // 3. Style parsing
  if (query.includes("minimal") || query.includes("clean") || query.includes("simple")) {
    inferredStyle = "Minimal";
  } else if (query.includes("playful") || query.includes("fun") || query.includes("cute")) {
    inferredStyle = "Playful";
  } else if (query.includes("bold") || query.includes("vibrant")) {
    inferredStyle = "Bold";
  } else if (query.includes("classic")) {
    inferredStyle = "Classic";
  } else if (query.includes("creative") || query.includes("art")) {
    inferredStyle = "Creative";
  }

  // 4. Category parsing
  if (query.includes("hoodie") || query.includes("tee") || query.includes("t-shirt") || query.includes("shirt") || query.includes("apparel") || query.includes("wear")) {
    inferredCategory = "Apparel";
  } else if (query.includes("mug") || query.includes("bottle") || query.includes("flask") || query.includes("drink")) {
    inferredCategory = "Drinkware";
  } else if (query.includes("bag") || query.includes("backpack") || query.includes("tote")) {
    inferredCategory = "Bags";
  } else if (query.includes("sticker") || query.includes("pin") || query.includes("pen") || query.includes("notebook")) {
    inferredCategory = "Accessories";
  }

  const isGiftSearch = query.includes("gift") || query.includes("present");

  const scoredResults = PRODUCTS.map((product) => {
    let score = 0;

    // Price filter constraint
    if (maxPrice !== undefined && product.price > maxPrice) {
      return { product, score: -100 };
    }
    if (maxPrice !== undefined && product.price <= maxPrice) {
      score += 25;
    }

    // Exact text match in name or description
    if (product.name.toLowerCase().includes(query)) score += 50;
    if (product.description.toLowerCase().includes(query)) score += 20;

    // Token matches
    tokens.forEach((token) => {
      if (product.name.toLowerCase().includes(token)) score += 15;
      if (product.category.toLowerCase().includes(token)) score += 10;
      if (product.tags.some((t) => t.toLowerCase().includes(token))) score += 12;
      if (product.ecosystem.toLowerCase().includes(token)) score += 10;
      if (product.useCases.some((u) => u.toLowerCase().includes(token))) score += 10;
    });

    // Inferred filters boost
    if (inferredCategory && product.category.toLowerCase() === inferredCategory.toLowerCase()) score += 20;
    if (inferredStyle && product.style.toLowerCase() === inferredStyle.toLowerCase()) score += 20;
    if (inferredUseCase && product.useCases.some((u) => u.toLowerCase() === inferredUseCase!.toLowerCase())) score += 20;
    if (isGiftSearch && product.useCases.includes("Gifting")) score += 25;

    return { product, score };
  });

  const valid = scoredResults
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((r) => r.product);

  return {
    results: valid,
    appliedFilters: {
      maxPrice,
      inferredCategory,
      inferredStyle,
      inferredUseCase,
      tokens,
    },
  };
}
