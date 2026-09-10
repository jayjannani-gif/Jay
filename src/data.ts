import { Product, Review, SmartBundle } from "./types";
import { IMAGES } from "./assets/images";

// Generates realistic reviews for products
const generateReviewsForProduct = (productId: string, productName: string): Review[] => {
  const reviewsPool = [
    { name: "Aarav Sharma", location: "Bengaluru, India", rating: 5, quote: `The ${productName} exceeded my expectations. Elegant and matches my developer setup perfectly!` },
    { name: "Sarah Jenkins", location: "San Francisco, USA", rating: 5, quote: `Absolutely love the design. The Gemini theme accents are fantastic and the quality is premium.` },
    { name: "Meera Patel", location: "Mumbai, India", rating: 4, quote: `Very sleek design. Shipping to India was secure and quick. Will definitely buy from the collection again.` },
    { name: "Michael Chen", location: "Seattle, USA", rating: 5, quote: `A superb addition to my daily workspace. High quality materials, very happy with my purchase!` },
    { name: "Elena Rostova", location: "New York, USA", rating: 4, quote: `Excellent aesthetic. Clean, minimal, and premium. Just what you'd expect from the Google AI Studio design team.` },
    { name: "David Miller", location: "London, UK", rating: 5, quote: `Precision craftsmanship and arrived in pristine condition. Exactly the quality I wanted.` }
  ];

  const hash = productId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const selectedReviews: Review[] = [];
  for (let i = 0; i < 3; i++) {
    const poolIndex = (hash + i) % reviewsPool.length;
    selectedReviews.push({
      id: `${productId}-rev-${i}`,
      name: reviewsPool[poolIndex].name,
      location: reviewsPool[poolIndex].location,
      rating: reviewsPool[poolIndex].rating - (i % 2 === 0 ? 0 : 1),
      quote: reviewsPool[poolIndex].quote,
      date: `2026-06-${10 + i}`
    });
  }
  return selectedReviews;
};

export const PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Google Pen White",
    category: "Accessories",
    price: 8,
    rating: 4.8,
    reviewCount: 142,
    badge: "Bestseller",
    rank: 1,
    gradient: "linear-gradient(135deg, #F9FAFB 0%, #D1D5DB 100%)",
    icon: "🖋️",
    image: IMAGES.googlePenWhite,
    description: "An ultra-premium white-bodied writing instrument featuring a soft-touch matte finish and the classic subtle Google logo. Designed for smooth flow, reliability, and precision brainstorming.",
    details: [
      "0.5mm fine tip Japanese gel ink (black)",
      "Mattified soft-grip aluminum housing",
      "Engraved minimalist Google branding",
      "Retractable click-to-deploy mechanism"
    ],
    materials: "Recycled aluminum, high-grade tungsten carbide ball, non-toxic ink.",
    shipping: "Dispatched within 24 hours. Free shipping eligible on orders over $35.",
    colors: [
      { name: "Chalk White", value: "#FFFFFF" },
      { name: "Charcoal Black", value: "#1F2937" }
    ],
    reviewsList: [],
    tags: ["stationery", "desk", "writing", "minimal", "aluminum", "workspace"],
    audience: ["Designer", "Developer", "Student", "Colleague", "Friend"],
    useCases: ["Desk Setup", "Productivity", "Coding", "Everyday Essentials", "Gifting"],
    ecosystem: "Google Workspace",
    style: "Minimal",
    moods: ["Desk Day", "Creator Mode", "Google Fan", "Cozy"],
    complementaryProductIds: ["13", "10", "4"],
    keyFeatures: ["0.5mm fine tip gel cartridge", "Matte aircraft-grade aluminum barrel", "Engraved subtle logo", "Balanced 22g center-of-mass"],
    intendedUse: "Daily engineering brainstorming, architecture review notes, and desk journaling"
  },
  {
    id: "2",
    name: "Gemini Hologram Sticker",
    category: "Stickers",
    price: 4,
    rating: 4.9,
    reviewCount: 328,
    badge: "Bestseller",
    rank: 2,
    gradient: "linear-gradient(100deg, #4285F4 0%, #9168C0 50%, #EE6C8B 100%)",
    icon: "✨",
    image: IMAGES.geminiSticker,
    description: "Add a spark of intelligence to your workspace. This metallic hologram sticker shifts colors dynamically in the light, showcasing the Gemini signature design. Highly adhesive, scratch-resistant, and weatherproof.",
    details: [
      "Holographic rainbow-sheen vinyl",
      "UV protection layer prevents fading in direct sunlight",
      "Removable adhesive leaves no sticky residue",
      "Measures 3.0\" x 3.0\" - perfect for laptop lids"
    ],
    materials: "Heavy-duty 6mil vinyl sticker sheet.",
    shipping: "Lettermail delivery available globally. Arrives in 3-5 business days.",
    reviewsList: [],
    tags: ["sticker", "hologram", "gemini", "ai", "laptop", "metallic"],
    audience: ["Developer", "Student", "Google Fan", "Friend"],
    useCases: ["Tech", "Everyday Essentials", "Gifting", "Google Culture"],
    ecosystem: "Developer",
    style: "Creative",
    moods: ["Creator Mode", "Google Fan", "Desk Day"],
    complementaryProductIds: ["11", "13", "4"],
    keyFeatures: ["Prismatic color shift in ambient light", "Weatherproof 6mil vinyl", "Residue-free clean peel", "UV fade-resistant finish"],
    intendedUse: "Personalizing workstation hardware, water bottles, and engineering notebooks"
  },
  {
    id: "3",
    name: "Google Signature Red Tee",
    category: "Apparel",
    price: 32,
    originalPrice: 38,
    rating: 4.7,
    reviewCount: 215,
    badge: "On Sale",
    rank: 3,
    gradient: "linear-gradient(135deg, #EA4335 0%, #B31412 100%)",
    icon: "👕",
    image: IMAGES.googleRedTee,
    description: "The ultimate casual comfort. Crafted in a rich Google-signature red, this t-shirt is designed with a premium, relaxed tailored fit, featuring a subtle Google chest graphic in vintage white wash.",
    details: [
      "100% certified organic ring-spun cotton",
      "Pre-shrunk fabric to prevent size changes after laundry",
      "Comfort seam stitching at neck and shoulders",
      "Breathable, lightweight 180 GSM yarn density"
    ],
    materials: "100% organic cotton grown sustainably without harmful pesticides.",
    shipping: "Standard domestic flat-rate shipping. Available for international priority delivery.",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Signature Red", value: "#EA4335" },
      { name: "Cosmic Charcoal", value: "#1F2937" }
    ],
    reviewsList: [],
    tags: ["t-shirt", "apparel", "organic cotton", "red", "casual", "vintage"],
    audience: ["Developer", "Google Fan", "Friend", "Student", "Colleague"],
    useCases: ["Everyday Essentials", "Travel", "Google Culture", "Lifestyle"],
    ecosystem: "Google",
    style: "Bold",
    moods: ["Weekend", "Cozy", "Google Fan", "Travel Mode"],
    complementaryProductIds: ["14", "4", "8"],
    keyFeatures: ["180 GSM combed organic cotton", "Pre-shrunk fabric stabilization", "Reinforced shoulder tape", "Water-based breathable ink"],
    intendedUse: "Everyday developer comfort, tech meetups, and relaxed weekend exploration"
  },
  {
    id: "4",
    name: "Gemini Spark Water Bottle",
    category: "Drinkware",
    price: 24,
    rating: 4.6,
    reviewCount: 88,
    badge: "New",
    gradient: "linear-gradient(135deg, #00C6FF 0%, #0072FF 100%)",
    icon: "💧",
    image: IMAGES.geminiWaterBottle,
    description: "Stay hydrated during intense coding sprints. This matte obsidian-finish vacuum flask features a laser-etched Gemini constellation that shifts brilliantly. Keeps drinks icy cold for 24 hours or steaming hot for 12.",
    details: [
      "Double-walled 18/8 professional-grade stainless steel",
      "BPA-free and toxin-free materials",
      "Leakproof sports cap with integrated carrying loop",
      "Fits perfectly in standard car and bicycle cup holders"
    ],
    materials: "Premium 18/8 stainless steel, food-grade silicone seals.",
    shipping: "Safely double-boxed with paper-cushioned shock buffers.",
    colors: [
      { name: "Obsidian Spark", value: "#111827" },
      { name: "Stardust Silver", value: "#E5E7EB" }
    ],
    reviewsList: [],
    tags: ["drinkware", "water bottle", "vacuum flask", "insulated", "gemini", "hydration", "desk"],
    audience: ["Developer", "Designer", "Student", "Google Fan", "Colleague", "Traveler"],
    useCases: ["Desk Setup", "Travel", "Everyday Essentials", "Coding", "Gifting"],
    ecosystem: "Developer",
    style: "Minimal",
    moods: ["Desk Day", "Travel Mode", "Creator Mode", "Weekend"],
    complementaryProductIds: ["3", "7", "8", "1"],
    keyFeatures: ["Double-wall vacuum insulation (24h cold / 12h hot)", "18/8 food-grade pro stainless steel", "100% leakproof magnetic lid", "Zero condensation sweat-free exterior"],
    intendedUse: "All-day hydration at developer workstations, fitness commutes, and flights"
  },
  {
    id: "5",
    name: "Android Bot Enamel Pin",
    category: "Accessories",
    price: 6,
    rating: 4.9,
    reviewCount: 167,
    gradient: "linear-gradient(135deg, #3DDC84 0%, #1D7C43 100%)",
    icon: "🤖",
    image: IMAGES.androidEnamelPin,
    description: "Pin your love for open source. Featuring the newly redesigned 3D Android bot emblem in hard enamel, polished with premium silver-toned metal trim. A statement piece for bags, jackets, or lanyards.",
    details: [
      "Premium hard enamel with high-gloss topcoat",
      "Double pin back clasp prevents rotation",
      "Includes protective soft rubber clutches",
      "Official Android collector series card included"
    ],
    materials: "Iron alloy base, premium lead-free hard enamel color fills.",
    shipping: "Ships in a protective bubblesheet envelope. Super low delivery weight.",
    reviewsList: [],
    tags: ["pin", "enamel", "android", "bugdroid", "open source", "collectible"],
    audience: ["Developer", "Google Fan", "Student", "Friend"],
    useCases: ["Tech", "Gaming", "Everyday Essentials", "Google Culture", "Gifting"],
    ecosystem: "Android",
    style: "Playful",
    moods: ["Google Fan", "Creator Mode", "Weekend"],
    complementaryProductIds: ["8", "14", "7"],
    keyFeatures: ["Hard-fired scratch-resistant enamel", "Double back posts for zero tilt", "Jewelry-grade polished nickel electroplate", "Collector numbered backing card"],
    intendedUse: "Customizing developer backpacks, denim jackets, conference lanyards, and lapels"
  },
  {
    id: "6",
    name: "Chrome Dino Plush",
    category: "Accessories",
    price: 18,
    rating: 4.9,
    reviewCount: 412,
    badge: "New",
    gradient: "linear-gradient(135deg, #9CA3AF 0%, #4B5563 100%)",
    icon: "🦖",
    image: IMAGES.chromeDinoPlush,
    description: "Your offline companion is here to keep you company when the internet goes out. This soft, pixelated dinosaur plush features tactile pixel-edge details and a weighted base to sit securely next to your screen.",
    details: [
      "Authentic pixel-art embroidery details",
      "Stuffed with 100% recycled high-loft polyester fibers",
      "Weighted base allows self-standing display",
      "Dimensions: 8\" high x 5\" wide"
    ],
    materials: "Ultra-soft micro-velboa exterior plush, hypoallergenic polyfill.",
    shipping: "Vacuum-compressed for eco-friendly transit volume. Expands instantly when opened.",
    reviewsList: [],
    tags: ["plush", "dino", "chrome", "offline", "desk companion", "collectible", "cute"],
    audience: ["Developer", "Designer", "Student", "Friend", "Partner", "Google Fan"],
    useCases: ["Gaming", "Desk Setup", "Google Culture", "Gifting", "Cozy"],
    ecosystem: "Chrome",
    style: "Playful",
    moods: ["Desk Day", "Cozy", "Google Fan", "Gift Mode"],
    complementaryProductIds: ["10", "1", "13"],
    keyFeatures: ["Self-balancing pellet-weighted base", "Micro-velboa ultra-soft touch fabric", "Precision pixel-art embroidery", "Authentic Google Easter egg licensed product"],
    intendedUse: "Rubber-duck debugging companion on developer monitors and playful gift giving"
  },
  {
    id: "7",
    name: "Google Campus Hoodie",
    category: "Apparel",
    price: 58,
    rating: 4.8,
    reviewCount: 304,
    gradient: "linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)",
    icon: "🧥",
    image: IMAGES.googleCampusHoodie,
    description: "A tribute to the vibrant spirit of Google's global campuses. Crafted from super-heavyweight premium brushed fleece, this hoodie boasts an incredibly comfortable inner lining, a spacious kangaroo pouch, and an adjustable lined hood.",
    details: [
      "Ultra-thick 360 GSM heavy cotton fleece blend",
      "Embossed Google wordmark on the sleeve cuff",
      "Metal-tipped drawstring pulls with custom engraving",
      "Ribbed side panels for expanded freedom of movement"
    ],
    materials: "80% Organic cotton, 20% Recycled polyester for superior structure.",
    shipping: "Weight-rated shipping. Sent in biodegradable mailer bag.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Campus Grey", value: "#4B5563" },
      { name: "Navy Ingress", value: "#1E3A8A" }
    ],
    reviewsList: [],
    tags: ["hoodie", "apparel", "fleece", "campus", "heavyweight", "comfort", "winter"],
    audience: ["Developer", "Designer", "Student", "Google Fan", "Partner", "Colleague"],
    useCases: ["Everyday Essentials", "Coding", "Travel", "Cozy", "Lifestyle"],
    ecosystem: "Google",
    style: "Classic",
    moods: ["Cozy", "Desk Day", "Weekend", "Travel Mode"],
    complementaryProductIds: ["14", "4", "8", "5"],
    keyFeatures: ["Substantial 360 GSM brushed inner fleece", "Double-layered thermal hood", "Engraved gunmetal drawstring aglets", "Hidden interior phone sleeve inside kangaroo pouch"],
    intendedUse: "Comfortable late-night coding sessions, chilly flights, and campus life"
  },
  {
    id: "8",
    name: "Cloud Backpack",
    category: "Bags",
    price: 64,
    originalPrice: 76,
    rating: 4.5,
    reviewCount: 96,
    badge: "On Sale",
    gradient: "linear-gradient(135deg, #60A5FA 0%, #2563EB 100%)",
    icon: "🎒",
    image: IMAGES.cloudBackpack,
    description: "Travel lighter with your ideas. The Cloud Backpack features a minimal exterior, custom rain-proof zippers, and an advanced ergonomic mesh suspension system. Includes dedicated quick-access tech sleeves for laptops and chargers.",
    details: [
      "Fully padded laptop pocket (fits up to 16\" devices)",
      "Water-repellent 900D ripstop polyester shell",
      "TSA-compliant lie-flat scan design",
      "Hidden luggage strap slides over rolling bag handles"
    ],
    materials: "900D Water-resistant Cordura, recycled polyester linings.",
    shipping: "Boxed shipping with mold-preventive air packets. Flat rate applicable.",
    reviewsList: [],
    tags: ["backpack", "bag", "laptop bag", "water-resistant", "travel", "commute", "google cloud"],
    audience: ["Developer", "Tech Lover", "Student", "Colleague", "Traveler"],
    useCases: ["Travel", "Tech", "Productivity", "Everyday Essentials"],
    ecosystem: "Google Cloud",
    style: "Minimal",
    moods: ["Travel Mode", "Creator Mode", "Desk Day"],
    complementaryProductIds: ["11", "4", "1", "13"],
    keyFeatures: ["Suspended 16-inch fleece laptop compartment", "Waterproof PU-coated inverted zippers", "Breathable 3D-airflow spinal channel", "Trolley pass-through sleeve for rolling luggage"],
    intendedUse: "Commuting with engineering laptops, international travel, and tech gear storage"
  },
  {
    id: "9",
    name: "Noogler Beanie",
    category: "Apparel",
    price: 16,
    rating: 4.7,
    reviewCount: 57,
    gradient: "linear-gradient(135deg, #FBBF24 0%, #D97706 100%)",
    icon: "🎓",
    image: IMAGES.nooglerBeanie,
    description: "Celebrate the starting spirit of learning. This snug, colorful cuffed beanie pays homage to the legendary Noogler propellor caps, styled in a mature knit pattern with vibrant Google primaries blended beautifully.",
    details: [
      "High-loft acrylic knit fabric delivers rich thermal retention",
      "Stretchable double-cuff band fits all head sizes",
      "Embroidered learning propeller icon on the crown",
      "Breathable weave lets heat cycle comfortably"
    ],
    materials: "100% hypoallergenic premium acrylic.",
    shipping: "Ships in poly-mailer. Delivery standard 2-4 days.",
    colors: [
      { name: "Noogler Multi", value: "#FBBF24" },
      { name: "Chalk", value: "#F3F4F6" }
    ],
    reviewsList: [],
    tags: ["beanie", "hat", "knit", "noogler", "learning", "colorful", "winter"],
    audience: ["Student", "Developer", "Google Fan", "Friend"],
    useCases: ["Everyday Essentials", "Google Culture", "Gifting"],
    ecosystem: "Google",
    style: "Playful",
    moods: ["Weekend", "Cozy", "Google Fan", "Gift Mode"],
    complementaryProductIds: ["7", "10", "2"],
    keyFeatures: ["Fine gauge double-rib knit construction", "Embroidered Noogler heritage icon", "Snug four-way stretch memory", "Thermal micro-air pocket insulation"],
    intendedUse: "Celebrating career onboarding milestones, winter outings, and playful style"
  },
  {
    id: "10",
    name: "Pixel Blue Mug",
    category: "Drinkware",
    price: 14,
    rating: 4.6,
    reviewCount: 78,
    gradient: "linear-gradient(135deg, #1E40AF 0%, #1E3A8A 100%)",
    icon: "☕",
    image: IMAGES.pixelBlueMug,
    description: "Designed with the iconic Pixel blue tone, this heavy ceramic mug features a speckled textured glaze that feels artisan-crafted. Boasts a massive comfortable grip handle made for coffee-fueled debugging hours.",
    details: [
      "Generous 15oz (450ml) liquid capacity",
      "Microwave and top-rack dishwasher safe",
      "Double-fired ceramic with lead-free glaze protection",
      "Heat-retentive extra thick sidewall build"
    ],
    materials: "100% heavy stoneware ceramic.",
    shipping: "Individually wrapped in 3 layers of cellular air-bubble sheets to ensure zero breakage.",
    reviewsList: [],
    tags: ["mug", "coffee", "tea", "ceramic", "pixel", "speckled", "desk"],
    audience: ["Developer", "Designer", "Colleague", "Parent", "Partner"],
    useCases: ["Desk Setup", "Productivity", "Coding", "Everyday Essentials", "Gifting"],
    ecosystem: "Pixel",
    style: "Classic",
    moods: ["Desk Day", "Cozy", "Creator Mode", "Gift Mode"],
    complementaryProductIds: ["1", "13", "6"],
    keyFeatures: ["Heavyweight 450ml (15oz) capacity", "Thermal mass retains drink temperature longer", "Wide ergonomic 3-finger handle", "Artisanal natural reactive glaze with unique specks"],
    intendedUse: "Powering deep work sessions, coffee rituals, and morning scrum calls"
  },
  {
    id: "11",
    name: "AI Studio Laptop Sleeve",
    category: "Tech",
    price: 28,
    rating: 4.8,
    reviewCount: 120,
    badge: "New",
    gradient: "linear-gradient(135deg, #1F2937 0%, #111827 100%)",
    icon: "💻",
    image: IMAGES.laptopSleeve,
    description: "Protect your hardware with the official AI Studio developer gear. Featuring high-density shock-absorbing neoprene lined with a soft scratch-free interior and detailed with the signature Gemini gradient glowing zipper tract.",
    details: [
      "Custom molded 3D impact-diffusing air pads",
      "YKK zipper pullers with colorful Gemini cord wraps",
      "External magnetic-slip pocket for cables, SSDs, and notebook",
      "Engineered slim profile fits easily into bags"
    ],
    materials: "Vegan neoprene exterior, brushed microfiber velvet lining.",
    shipping: "Ships flat-packed inside anti-static protective bags.",
    reviewsList: [],
    tags: ["laptop sleeve", "tech", "neoprene", "shockproof", "ai studio", "gemini"],
    audience: ["Developer", "Tech Lover", "Student", "Designer"],
    useCases: ["Tech", "Travel", "Productivity", "Coding"],
    ecosystem: "Developer",
    style: "Minimal",
    moods: ["Creator Mode", "Desk Day", "Travel Mode"],
    complementaryProductIds: ["8", "4", "2"],
    keyFeatures: ["360-degree edge protective bumper", "Silky microfiber scratchless inner lining", "Expandable magnetic stash pouch for dongles", "Gemini signature iridescent zipper pull"],
    intendedUse: "Transporting laptop computers safely between co-working spaces and flights"
  },
  {
    id: "12",
    name: "Google Eco Tote Bag",
    category: "Bags",
    price: 12,
    rating: 4.4,
    reviewCount: 45,
    gradient: "linear-gradient(135deg, #10B981 0%, #047857 100%)",
    icon: "👜",
    image: IMAGES.googleEcoTote,
    description: "Ditch the plastic. This heavy-duty cotton canvas tote is built with cross-stitched handles that hold up to 30 lbs of groceries, books, or tech gear. Minimalist line-art Google Earth graphics on the front.",
    details: [
      "Sturdy 12oz biological cotton duck canvas",
      "Double-reinforced handles prevent thread pulls under heavy load",
      "Internal dynamic key pocket with brass snap closure",
      "Biodegradable natural material wash-fade safe"
    ],
    materials: "100% unbleached organic cotton canvas.",
    shipping: "Folded shipping. 100% plastic-free packaging materials.",
    reviewsList: [],
    tags: ["tote bag", "canvas", "eco-friendly", "organic", "grocery", "minimal"],
    audience: ["Designer", "Student", "Friend", "Parent", "Colleague"],
    useCases: ["Everyday Essentials", "Travel", "Lifestyle", "Design"],
    ecosystem: "Google Maps",
    style: "Creative",
    moods: ["Weekend", "Travel Mode", "Creator Mode"],
    complementaryProductIds: ["1", "13", "4"],
    keyFeatures: ["12oz untreated heavy duck canvas", "Box-stitched stress-point handle joints", "Internal hanging pocket for phone and keys", "Tested to support up to 30 lbs load"],
    intendedUse: "Eco-friendly market trips, carrying design books, and casual weekend errands"
  },
  {
    id: "13",
    name: "Gemini Gradient Notebook",
    category: "Accessories",
    price: 10,
    rating: 4.7,
    reviewCount: 64,
    gradient: "linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)",
    icon: "📓",
    image: IMAGES.geminiNotebook,
    description: "Your offline staging zone for prompt engineering, mathematical formulas, and interface designs. Features a rigid hard-backed cover displaying the Gemini solar flow with ultra-smooth heavy bleed-proof paper.",
    details: [
      "160 pages of premium 120 GSM dotted acid-free paper",
      "Lays completely flat (180 degrees) for seamless drafting",
      "Integrated elastic security band and matching silk ribbon bookmark",
      "Rear expandable pocket for holding stickers and loose bills"
    ],
    materials: "Hard-back cardboard with dynamic print coating, sustainably sourced paper.",
    shipping: "Standard protective box shipping.",
    reviewsList: [],
    tags: ["notebook", "journal", "dotted", "stationery", "gemini", "brainstorming"],
    audience: ["Designer", "Developer", "Student", "Colleague", "Friend"],
    useCases: ["Productivity", "Design", "Desk Setup", "Coding", "Gifting"],
    ecosystem: "Developer",
    style: "Creative",
    moods: ["Desk Day", "Creator Mode", "Gift Mode"],
    complementaryProductIds: ["1", "10", "4"],
    keyFeatures: ["120 GSM fountain-pen friendly dot grid sheets", "180-degree flat opening binding", "Integrated elastic band and silk bookmark", "Back pocket for receipts and sticker sheets"],
    intendedUse: "Drafting algorithms, system architecture diagrams, and prompt design logs"
  },
  {
    id: "14",
    name: "Google Wordmark Cap",
    category: "Apparel",
    price: 22,
    rating: 4.5,
    reviewCount: 89,
    gradient: "linear-gradient(135deg, #3B82F6 0%, #10B981 100%)",
    icon: "🧢",
    image: IMAGES.googleWordmarkCap,
    description: "Keep cool in the sun or under intense studio lights. This structured 6-panel dad cap comes in deep obsidian black, showcasing a perfectly embroidered flat-stitched Google wordmark on the face and an adjustable brass sliding buckle.",
    details: [
      "100% washed premium cotton twill",
      "Embroidered breathable ventilation eyelets",
      "Adjustable fabric strap featuring custom embossed brass buckle",
      "Pre-curved shape-retentive baseball visor design"
    ],
    materials: "100% breathable cotton twill, brass components.",
    shipping: "Shipped inside dedicated sturdy crown-protector cardboard boxes.",
    reviewsList: [],
    tags: ["cap", "hat", "dad hat", "twill", "minimal", "wordmark"],
    audience: ["Developer", "Google Fan", "Student", "Friend", "Colleague"],
    useCases: ["Everyday Essentials", "Travel", "Design", "Google Culture"],
    ecosystem: "Google",
    style: "Classic",
    moods: ["Weekend", "Travel Mode", "Google Fan"],
    complementaryProductIds: ["3", "7", "4"],
    keyFeatures: ["Structured 6-panel washed cotton crown", "Direct dense embroidery with Google colors", "Antiqued brass slider buckle with tuck-in strap", "Built-in moisture wicking sweatband"],
    intendedUse: "Outdoor sun protection, developer conferences, and everyday casual wear"
  }
];

// Enrich products with reviews lists
PRODUCTS.forEach((p) => {
  p.reviewsList = generateReviewsForProduct(p.id, p.name);
});

// CURATED SMART BUNDLES
export const SMART_BUNDLES: SmartBundle[] = [
  {
    id: "bundle-desk-setup",
    name: "Developer Desk Setup",
    tagline: "Hydrate, ideate, and code with zero friction.",
    description: "The quintessential focus setup. Features the Pixel Blue Mug, Gemini Notebook, Google Pen White, and Gemini Water Bottle to keep your desk organized and energised.",
    productIds: ["10", "13", "1", "4"], // Mug ($14) + Notebook ($10) + Pen ($8) + Bottle ($24) = $56 -> 18% off = $45.92
    discountPercent: 18,
    theme: "from-blue-600/20 via-indigo-600/20 to-purple-600/20",
    badge: "Most Popular"
  },
  {
    id: "bundle-weekend-kit",
    name: "Weekend Explorer Kit",
    tagline: "Effortless casual comfort wherever Saturday takes you.",
    description: "Pair the ultra-thick 360 GSM Google Campus Hoodie with the washed twill Wordmark Cap and Eco Tote Bag for easy coffee walks and market visits.",
    productIds: ["7", "14", "12"], // Hoodie ($58) + Cap ($22) + Tote ($12) = $92 -> 15% off = $78.20
    discountPercent: 15,
    theme: "from-emerald-600/20 via-teal-600/20 to-cyan-600/20",
    badge: "Staff Pick"
  },
  {
    id: "bundle-google-starter",
    name: "Google Fan Starter Pack",
    tagline: "Celebrate your favorite tools and open-source icons.",
    description: "The fan-favorite combination: Signature Red Organic Tee, the charming Chrome Dino Desk Plush, metallic Gemini Hologram Sticker, and Android Bot Pin.",
    productIds: ["3", "6", "2", "5"], // Tee ($32) + Dino ($18) + Sticker ($4) + Pin ($6) = $60 -> 20% off = $48.00
    discountPercent: 20,
    theme: "from-rose-600/20 via-amber-600/20 to-yellow-600/20",
    badge: "20% Off"
  },
  {
    id: "bundle-creator-kit",
    name: "AI Creator & Engineer Kit",
    tagline: "Take your models and hardware anywhere in complete security.",
    description: "Engineered for digital makers: Cloud Backpack, AI Studio Laptop Sleeve, Gemini Gradient Notebook, and precision Google Pen.",
    productIds: ["8", "11", "13", "1"], // Backpack ($64) + Sleeve ($28) + Notebook ($10) + Pen ($8) = $110 -> 15% off = $93.50
    discountPercent: 15,
    theme: "from-purple-600/20 via-pink-600/20 to-indigo-600/20",
    badge: "Pro Kit"
  },
  {
    id: "bundle-travel-kit",
    name: "Commuter & Travel Kit",
    tagline: "Built for planes, trains, and tech conferences.",
    description: "High-mileage durability: 900D water-repellent Cloud Backpack, double-wall insulated Water Bottle, and UV-blocking Wordmark Cap.",
    productIds: ["8", "4", "14"], // Backpack ($64) + Bottle ($24) + Cap ($22) = $110 -> 18% off = $90.20
    discountPercent: 18,
    theme: "from-sky-600/20 via-blue-600/20 to-indigo-600/20",
    badge: "Travel Ready"
  },
  {
    id: "bundle-gift-set",
    name: "Thoughtful Colleague Gift Set",
    tagline: "A clean, functional present that every developer appreciates.",
    description: "Handpicked premium stationery and drinkware: the artisanal Pixel Blue Mug, Gemini Dotted Notebook, and aluminum Google Pen.",
    productIds: ["10", "13", "1"], // Mug ($14) + Notebook ($10) + Pen ($8) = $32 -> 15% off = $27.20
    discountPercent: 15,
    theme: "from-amber-600/20 via-orange-600/20 to-red-600/20",
    badge: "Perfect Gift"
  }
];

// Merch Mood definitions
export interface MoodConfig {
  id: string;
  name: string;
  tagline: string;
  icon: string;
  color: string;
  description: string;
}

export const MERCH_MOODS: MoodConfig[] = [
  { id: "Desk Day", name: "Desk Day", tagline: "Locked in & shipping", icon: "💻", color: "from-blue-500/20 to-indigo-500/20", description: "Mugs, notebooks, pens, and desk companions tailored for flow state." },
  { id: "Weekend", name: "Weekend", tagline: "Offline exploration", icon: "☀️", color: "from-amber-500/20 to-orange-500/20", description: "Easy-going hoodies, tees, beanies, and totes for casual relaxation." },
  { id: "Creator Mode", name: "Creator Mode", tagline: "Designing & drafting", icon: "🎨", color: "from-purple-500/20 to-pink-500/20", description: "Creative gear, laptop sleeves, dotted journals, and bold stickers." },
  { id: "Travel Mode", name: "Travel Mode", tagline: "On the move with tech", icon: "✈️", color: "from-emerald-500/20 to-teal-500/20", description: "Ergonomic backpacks, insulated flasks, and weather-ready caps." },
  { id: "Cozy", name: "Cozy", tagline: "Warm comfort for coding", icon: "☕", color: "from-rose-500/20 to-red-500/20", description: "360 GSM fleece, warm stoneware mugs, and soft knit beanies." },
  { id: "Gift Mode", name: "Gift Mode", tagline: "Delight a fellow dev", icon: "🎁", color: "from-cyan-500/20 to-blue-500/20", description: "High-affinity collector pins, plush mascots, and curated stationery." },
  { id: "Google Fan", name: "Google Fan", tagline: "Open source & culture pride", icon: "✨", color: "from-indigo-500/20 to-purple-500/20", description: "Signature logos, Android Bugdroid, and Chrome offline iconography." },
];

// Google Universe Ecosystem definitions
export interface EcosystemConfig {
  id: "Google" | "Pixel" | "Android" | "YouTube" | "Chrome" | "Google Maps" | "Google Cloud" | "Developer" | "Google Workspace";
  name: string;
  description: string;
  icon: string;
  accentColor: string;
  badgeBg: string;
}

export const GOOGLE_ECOSYSTEMS: EcosystemConfig[] = [
  { id: "Google", name: "Google", description: "Core brand heritage, campus culture, and signature colorways", icon: "🌐", accentColor: "#4285F4", badgeBg: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
  { id: "Developer", name: "Developer & AI", description: "AI Studio, Gemini models, Flutter SDK, and engineering gear", icon: "⚡", accentColor: "#8B5CF6", badgeBg: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
  { id: "Android", name: "Android", description: "Open source pride, Bugdroid mascots, and modern OS spirit", icon: "🤖", accentColor: "#3DDC84", badgeBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  { id: "Pixel", name: "Pixel", description: "Refined artisan stoneware, thoughtful materials, and hardware harmony", icon: "📱", accentColor: "#1E40AF", badgeBg: "bg-blue-600/10 text-blue-400 border-blue-600/20" },
  { id: "Chrome", name: "Chrome", description: "Browser companions, offline Easter eggs, and web platform speed", icon: "🦖", accentColor: "#F59E0B", badgeBg: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  { id: "Google Cloud", name: "Google Cloud", description: "Scalable infrastructure, enterprise security, and durable commuter packs", icon: "☁️", accentColor: "#60A5FA", badgeBg: "bg-sky-500/10 text-sky-400 border-sky-500/20" },
  { id: "Google Workspace", name: "Google Workspace", description: "Productivity essentials, tactile writing tools, and streamlined collaboration", icon: "📑", accentColor: "#10B981", badgeBg: "bg-teal-500/10 text-teal-400 border-teal-500/20" },
  { id: "Google Maps", name: "Google Maps", description: "Organic cotton totes, environmental consciousness, and world exploration", icon: "🗺️", accentColor: "#34A853", badgeBg: "bg-green-500/10 text-green-400 border-green-500/20" },
  { id: "YouTube", name: "YouTube", description: "Creator studio energy and streaming creativity", icon: "▶️", accentColor: "#EF4444", badgeBg: "bg-red-500/10 text-red-400 border-red-500/20" }
];
