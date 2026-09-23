import { Product } from "../types";
import { PRODUCTS } from "../data";

export interface CitySpotlightConfig {
  id: "new-york" | "mountain-view" | "sunnyvale";
  name: string;
  state: string;
  testMarketId: string;
  badge: string;
  headline: string;
  subheadline: string;
  marketVibe: string;
  context: string;
  merchandisingRationale: string;
  heroProductId: string;
  curatedProductIds: string[];
  focusCategories: string[];
  keyHighlights: string[];
  accentColor: string;
  badgeColor: string;
}

export const CITIES_SPOTLIGHT: CitySpotlightConfig[] = [
  {
    id: "new-york",
    name: "New York",
    state: "NY",
    testMarketId: "Test Market 01",
    badge: "Spotlight City • Test Market 01",
    headline: "Urban transit resilience, studio workflows & minimal tech essentials.",
    subheadline: "Curated for high-density commutes, fast transitions, and clean workspace aesthetics.",
    marketVibe: "Metro Transit & Studio Minimal",
    context:
      "Identified as a priority test market due to high GA4 audience concentration and strong engagement with versatile everyday carry and minimalist apparel.",
    merchandisingRationale:
      "Prioritizes weather-resistant commuter carry, low-profile laptop protection, and minimalist stationery suited for subway transit and high-pace creative studios.",
    heroProductId: "11", // AI Studio Laptop Sleeve
    curatedProductIds: ["11", "7", "12", "1", "4", "14"],
    focusCategories: ["Apparel", "Bags", "Stationery", "Accessories"],
    keyHighlights: [
      "Lightweight transit protection & weather-ready commuter gear",
      "Studio-grade notebooks & fine-point aluminum writing tools",
      "Monochrome apparel designed for subway-to-office transitions",
    ],
    accentColor: "#4285F4",
    badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  },
  {
    id: "mountain-view",
    name: "Mountain View",
    state: "CA",
    testMarketId: "Test Market 02",
    badge: "Spotlight City • Test Market 02",
    headline: "Googleplex campus heritage, developer rituals & open-source classics.",
    subheadline: "Curated around software craftsmanship, hackathon culture, and iconic campus lore.",
    marketVibe: "Campus Heritage & Software Craft",
    context:
      "Selected as a core test market representing Google's global headquarters corridor to test developer affinity, iconic brand collectibles, and daily desk rituals.",
    merchandisingRationale:
      "Features iconic brand heritage, developer enamel collectibles, tactile engineering notebooks, and Bugdroid mascots celebrating open-source engineering culture.",
    heroProductId: "5", // Android Bot Enamel Pin
    curatedProductIds: ["5", "9", "13", "6", "3", "10"],
    focusCategories: ["Collectibles", "Stationery", "Apparel", "Drinkware"],
    keyHighlights: [
      "Iconic Android Bugdroid & Chrome offline collectible mascots",
      "Noogler heritage knitwear & signature Google brand apparel",
      "Tactile dot-grid journals & artisan stoneware desk mugs",
    ],
    accentColor: "#34A853",
    badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  },
  {
    id: "sunnyvale",
    name: "Sunnyvale",
    state: "CA",
    testMarketId: "Test Market 03",
    badge: "Spotlight City • Test Market 03",
    headline: "Cloud scale systems, commuter ergonomics & high-performance accessories.",
    subheadline: "Curated for systems architects, distributed engineering, and daily technical carry.",
    marketVibe: "Cloud Architecture & Technical Carry",
    context:
      "Selected as a major test market covering Silicon Valley's cloud and enterprise corridor to test demand for high-utility technical bags and workday hydration gear.",
    merchandisingRationale:
      "Emphasizes ergonomic multi-compartment carry systems, insulated hydration, and tactile accessories designed for long technical deep-work sprints.",
    heroProductId: "8", // Cloud Backpack
    curatedProductIds: ["8", "4", "10", "2", "1", "11"],
    focusCategories: ["Bags", "Drinkware", "Stickers", "Accessories"],
    keyHighlights: [
      "High-capacity Cloud backpacks with dedicated tech compartments",
      "Insulated double-wall hydration for all-day focus sessions",
      "Prismatic Gemini holographic stickers for workstation personalization",
    ],
    accentColor: "#FBBC05",
    badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  },
];

export const getCityById = (cityId: string): CitySpotlightConfig => {
  const normalized = cityId.toLowerCase().replace(/\s+/g, "-");
  return (
    CITIES_SPOTLIGHT.find((c) => c.id === normalized) || CITIES_SPOTLIGHT[0]
  );
};

export const getCityProducts = (cityConfig: CitySpotlightConfig): Product[] => {
  return cityConfig.curatedProductIds
    .map((id) => PRODUCTS.find((p) => p.id === id))
    .filter((p): p is Product => p !== undefined);
};
