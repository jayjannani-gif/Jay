import { Product, Review } from "./types";

// Generates realistic mock reviews for products
const generateReviewsForProduct = (productId: string, productName: string): Review[] => {
  const reviewsPool = [
    { name: "Aarav Sharma", location: "Bengaluru, India", rating: 5, quote: `The ${productName} exceeded my expectations. Elegant and matches my developer setup perfectly!` },
    { name: "Sarah Jenkins", location: "San Francisco, USA", rating: 5, quote: `Absolutely love the design. The Gemini theme accents are fantastic and the quality is premium.` },
    { name: "Meera Patel", location: "Mumbai, India", rating: 4, quote: `Very sleek design. Shipping to India was secure and quick. Will definitely buy from the collection again.` },
    { name: "Michael Chen", location: "Seattle, USA", rating: 5, quote: `A superb addition to my daily workspace. High quality materials, very happy with my purchase!` },
    { name: "Elena Rostova", location: "New York, USA", rating: 4, quote: `Excellent aesthetic. Clean, minimal, and premium. Just what you'd expect from the Google AI Studio design team.` }
  ];

  // Pick 3 reviews based on productId hash
  const hash = productId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const selectedReviews: Review[] = [];
  for (let i = 0; i < 3; i++) {
    const poolIndex = (hash + i) % reviewsPool.length;
    selectedReviews.push({
      id: `${productId}-rev-${i}`,
      name: reviewsPool[poolIndex].name,
      location: reviewsPool[poolIndex].location,
      rating: reviewsPool[poolIndex].rating - (i % 2 === 0 ? 0 : 1), // standard ratings
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
    image: "/src/assets/images/google_pen_white_1784175570902.jpg",
    description: "An ultra-premium white-bodied writing instrument featuring a soft-touch matte finish and the classic subtle Google logo. Designed for smooth flow, reliability, and precision brainstorming.",
    details: [
      "0.5mm fine tip Japanese gel ink (black)",
      "Mattified soft-grip aluminum housing",
      "Engraved minimalist Google branding",
      "Retractable click-to-deploy mechanism"
    ],
    materials: "Recycled aluminum, high-grade tungsten carbide ball, non-toxic ink.",
    shipping: "Dispatched within 24 hours. Free shipping eligible on orders containing SHOPWEEK15.",
    colors: [
      { name: "Chalk White", value: "#FFFFFF" },
      { name: "Charcoal Black", value: "#1F2937" }
    ],
    reviewsList: []
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
    image: "/src/assets/images/gemini_sticker_1784175582884.jpg",
    description: "Add a spark of intelligence to your workspace. This metallic hologram sticker shifts colors dynamically in the light, showcasing the Gemini signature design. Highly adhesive, scratch-resistant, and weatherproof.",
    details: [
      "Holographic rainbow-sheen vinyl",
      "UV protection layer prevents fading in direct sunlight",
      "Removable adhesive leaves no sticky residue",
      "Measures 3.0\" x 3.0\" - perfect for laptop lids"
    ],
    materials: "Heavy-duty 6mil vinyl sticker sheet.",
    shipping: "Lettermail delivery available globally. Arrives in 3-5 business days.",
    reviewsList: []
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
    image: "/src/assets/images/google_red_tee_1784175593072.jpg",
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
    reviewsList: []
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
    image: "/src/assets/images/gemini_water_bottle_1784175603244.jpg",
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
    reviewsList: []
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
    image: "/src/assets/images/android_enamel_pin_1784175614374.jpg",
    description: "Pin your love for open source. Featuring the newly redesigned 3D Android bot emblem in hard enamel, polished with premium silver-toned metal trim. A statement piece for bags, jackets, or lanyards.",
    details: [
      "Premium hard enamel with high-gloss topcoat",
      "Double pin back clasp prevents rotation",
      "Includes protective soft rubber clutches",
      "Official Android collector series card included"
    ],
    materials: "Iron alloy base, premium lead-free hard enamel color fills.",
    shipping: "Ships in a protective bubblesheet envelope. Super low delivery weight.",
    reviewsList: []
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
    image: "/src/assets/images/chrome_dino_plush_1784175626461.jpg",
    description: "Your offline companion is here to keep you company when the internet goes out. This soft, pixelated dinosaur plush features tactile pixel-edge details and a weighted base to sit securely next to your screen.",
    details: [
      "Authentic pixel-art embroidery details",
      "Stuffed with 100% recycled high-loft polyester fibers",
      "Weighted base allows self-standing display",
      "Dimensions: 8\" high x 5\" wide"
    ],
    materials: "Ultra-soft micro-velboa exterior plush, hypoallergenic polyfill.",
    shipping: "Vacuum-compressed for eco-friendly transit volume. Expands instantly when opened.",
    reviewsList: []
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
    image: "/src/assets/images/google_campus_hoodie_1784175638152.jpg",
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
    reviewsList: []
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
    image: "/src/assets/images/cloud_backpack_1784175649775.jpg",
    description: "Travel lighter with your ideas. The Cloud Backpack features a minimal exterior, custom rain-proof zippers, and an advanced ergonomic mesh suspension system. Includes dedicated quick-access tech sleeves for laptops and chargers.",
    details: [
      "Fully padded laptop pocket (fits up to 16\" devices)",
      "Water-repellent 900D ripstop polyester shell",
      "TSA-compliant lie-flat scan design",
      "Hidden luggage strap slides over rolling bag handles"
    ],
    materials: "900D Water-resistant Cordura, recycled polyester linings.",
    shipping: "Boxed shipping with mold-preventive air packets. Flat rate applicable.",
    reviewsList: []
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
    image: "/src/assets/images/noogler_beanie_1784175662642.jpg",
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
    reviewsList: []
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
    image: "/src/assets/images/pixel_blue_mug_1784175674776.jpg",
    description: "Designed with the iconic Pixel blue tone, this heavy ceramic mug features a speckled textured glaze that feels artisan-crafted. Boasts a massive comfortable grip handle made for coffee-fueled debugging hours.",
    details: [
      "Generous 15oz (450ml) liquid capacity",
      "Microwave and top-rack dishwasher safe",
      "Double-fired ceramic with lead-free glaze protection",
      "Heat-retentive extra thick sidewall build"
    ],
    materials: "100% heavy stoneware ceramic.",
    shipping: "Individually wrapped in 3 layers of cellular air-bubble sheets to ensure zero breakage.",
    reviewsList: []
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
    image: "/src/assets/images/laptop_sleeve_1784175684721.jpg",
    description: "Protect your hardware with the official AI Studio developer gear. Featuring high-density shock-absorbing neoprene lined with a soft scratch-free interior and detailed with the signature Gemini gradient glowing zipper tract.",
    details: [
      "Custom molded 3D impact-diffusing air pads",
      "YKK zipper pullers with colorful Gemini cord wraps",
      "External magnetic-slip pocket for cables, SSDs, and notebook",
      "Engineered slim profile fits easily into bags"
    ],
    materials: "Vegan neoprene exterior, brushed microfiber velvet lining.",
    shipping: "Ships flat-packed inside anti-static protective bags.",
    reviewsList: []
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
    image: "/src/assets/images/google_eco_tote_1784175696476.jpg",
    description: "Ditch the plastic. This heavy-duty cotton canvas tote is built with cross-stitched handles that hold up to 30 lbs of groceries, books, or tech gear. Minimalist line-art Google Earth graphics on the front.",
    details: [
      "Sturdy 12oz biological cotton duck canvas",
      "Double-reinforced handles prevent thread pulls under heavy load",
      "Internal dynamic key pocket with brass snap closure",
      "Biodegradable natural material wash-fade safe"
    ],
    materials: "100% unbleached organic cotton canvas.",
    shipping: "Folded shipping. 100% plastic-free packaging materials.",
    reviewsList: []
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
    image: "/src/assets/images/gemini_notebook_1784175706488.jpg",
    description: "Your offline staging zone for prompt engineering, mathematical formulas, and interface designs. Features a rigid hard-backed cover displaying the Gemini solar flow with ultra-smooth heavy bleed-proof paper.",
    details: [
      "160 pages of premium 120 GSM dotted acid-free paper",
      "Lays completely flat (180 degrees) for seamless drafting",
      "Integrated elastic security band and matching silk ribbon bookmark",
      "Rear expandable pocket for holding stickers and loose bills"
    ],
    materials: "Hard-back cardboard with dynamic print coating, sustainably sourced paper.",
    shipping: "Standard protective box shipping.",
    reviewsList: []
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
    image: "/src/assets/images/google_wordmark_cap_1784175716959.jpg",
    description: "Keep cool in the sun or under intense studio lights. This structured 6-panel dad cap comes in deep obsidian black, showcasing a perfectly embroidered flat-stitched Google wordmark on the face and an adjustable brass sliding buckle.",
    details: [
      "100% washed premium cotton twill",
      "Embroidered breathable ventilation eyelets",
      "Adjustable fabric strap featuring custom embossed brass buckle",
      "Pre-curved shape-retentive baseball visor design"
    ],
    materials: "100% breathable cotton twill, brass components.",
    shipping: "Shipped inside dedicated sturdy crown-protector cardboard boxes.",
    reviewsList: []
  }
];

// Enrich the initial products with reviews lists
PRODUCTS.forEach((p) => {
  p.reviewsList = generateReviewsForProduct(p.id, p.name);
});
