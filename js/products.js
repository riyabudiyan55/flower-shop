/* ============================================================
   products.js
   Central product catalog for Bloom & Blossom.
   Every page (shop, home, product details, cart) reads from
   this single array so product data never gets out of sync.
   ============================================================ */

const PRODUCTS = [
  {
    id: 1,
    name: "Crimson Rose Bunch",
    category: "Roses",
    price: 799,
    discountPrice: 649,
    rating: 4.8,
    reviews: 132,
    image: "https://picsum.photos/seed/rose-crimson/600/600",
    thumb: "https://picsum.photos/seed/rose-crimson/300/300",
    colors: ["Red", "Deep Pink"],
    badge: "Best Seller",
    description:
      "A hand-tied bunch of 12 premium crimson roses, wrapped in kraft paper with a satin ribbon. Perfect for anniversaries and heartfelt surprises."
  },
  {
    id: 2,
    name: "Blush Pink Rose Box",
    category: "Roses",
    price: 999,
    discountPrice: null,
    rating: 4.6,
    reviews: 88,
    image: "https://picsum.photos/seed/rose-blush/600/600",
    thumb: "https://picsum.photos/seed/rose-blush/300/300",
    colors: ["Pink", "White"],
    badge: "",
    description:
      "24 blush pink roses arranged in an elegant round box. A soft, romantic gift that never goes out of style."
  },
  {
    id: 3,
    name: "White Rose Elegance",
    category: "Roses",
    price: 899,
    discountPrice: 749,
    rating: 4.7,
    reviews: 64,
    image: "https://picsum.photos/seed/rose-white/600/600",
    thumb: "https://picsum.photos/seed/rose-white/300/300",
    colors: ["White"],
    badge: "Sale",
    description:
      "Pure white roses symbolising grace and new beginnings. Ideal for weddings, sympathy, or a calming gesture."
  },
  {
    id: 4,
    name: "Mixed Seasonal Bouquet",
    category: "Bouquets",
    price: 1099,
    discountPrice: 899,
    rating: 4.9,
    reviews: 201,
    image: "https://picsum.photos/seed/bouquet-mixed/600/600",
    thumb: "https://picsum.photos/seed/bouquet-mixed/300/300",
    colors: ["Multicolor"],
    badge: "Best Seller",
    description:
      "A vibrant hand-picked mix of the season's freshest blooms — roses, lilies, and carnations layered with greens."
  },
  {
    id: 5,
    name: "Pastel Dream Bouquet",
    category: "Bouquets",
    price: 1249,
    discountPrice: null,
    rating: 4.5,
    reviews: 47,
    image: "https://picsum.photos/seed/bouquet-pastel/600/600",
    thumb: "https://picsum.photos/seed/bouquet-pastel/300/300",
    colors: ["Lavender", "Pink", "White"],
    badge: "",
    description:
      "Soft lavender, blush, and cream tones combine in this dreamy bouquet — a gentle gift for any occasion."
  },
  {
    id: 6,
    name: "Sunshine Bouquet",
    category: "Bouquets",
    price: 949,
    discountPrice: 799,
    rating: 4.4,
    reviews: 59,
    image: "https://picsum.photos/seed/bouquet-sun/600/600",
    thumb: "https://picsum.photos/seed/bouquet-sun/300/300",
    colors: ["Yellow", "Orange"],
    badge: "Sale",
    description:
      "Bright sunflowers and orange roses bundled together to bring warmth and cheer to any room."
  },
  {
    id: 7,
    name: "Casablanca Lily Bunch",
    category: "Lilies",
    price: 1049,
    discountPrice: null,
    rating: 4.7,
    reviews: 39,
    image: "https://picsum.photos/seed/lily-casa/600/600",
    thumb: "https://picsum.photos/seed/lily-casa/300/300",
    colors: ["White"],
    badge: "",
    description:
      "Fragrant Casablanca lilies known for their large petals and heady scent — a statement gift for special days."
  },
  {
    id: 8,
    name: "Stargazer Lily Vase",
    category: "Lilies",
    price: 1199,
    discountPrice: 999,
    rating: 4.6,
    reviews: 52,
    image: "https://picsum.photos/seed/lily-star/600/600",
    thumb: "https://picsum.photos/seed/lily-star/300/300",
    colors: ["Pink", "White"],
    badge: "Sale",
    description:
      "Bold pink stargazer lilies arranged in a glass vase, radiating fragrance and elegance in every petal."
  },
  {
    id: 9,
    name: "Golden Lily Basket",
    category: "Lilies",
    price: 1149,
    discountPrice: null,
    rating: 4.3,
    reviews: 21,
    image: "https://picsum.photos/seed/lily-gold/600/600",
    thumb: "https://picsum.photos/seed/lily-gold/300/300",
    colors: ["Yellow"],
    badge: "",
    description:
      "Golden lilies nestled in a woven basket — a cheerful centrepiece for housewarmings and celebrations."
  },
  {
    id: 10,
    name: "Rainbow Tulip Bunch",
    category: "Tulips",
    price: 899,
    discountPrice: 749,
    rating: 4.8,
    reviews: 74,
    image: "https://picsum.photos/seed/tulip-rainbow/600/600",
    thumb: "https://picsum.photos/seed/tulip-rainbow/300/300",
    colors: ["Multicolor"],
    badge: "Best Seller",
    description:
      "A joyful mix of multicoloured tulips, freshly cut and bundled — spring in a bouquet, any time of year."
  },
  {
    id: 11,
    name: "Purple Tulip Elegance",
    category: "Tulips",
    price: 799,
    discountPrice: null,
    rating: 4.4,
    reviews: 28,
    image: "https://picsum.photos/seed/tulip-purple/600/600",
    thumb: "https://picsum.photos/seed/tulip-purple/300/300",
    colors: ["Purple"],
    badge: "",
    description:
      "Deep purple tulips wrapped simply to let their rich colour take centre stage."
  },
  {
    id: 12,
    name: "Classic Red Tulips",
    category: "Tulips",
    price: 749,
    discountPrice: 649,
    rating: 4.5,
    reviews: 33,
    image: "https://picsum.photos/seed/tulip-red/600/600",
    thumb: "https://picsum.photos/seed/tulip-red/300/300",
    colors: ["Red"],
    badge: "Sale",
    description:
      "Bold red tulips, a timeless symbol of true love, gathered into a neat hand-tied bunch."
  },
  {
    id: 13,
    name: "Happy Birthday Bloom Box",
    category: "Birthday Flowers",
    price: 1299,
    discountPrice: 1099,
    rating: 4.9,
    reviews: 156,
    image: "https://picsum.photos/seed/birthday-box/600/600",
    thumb: "https://picsum.photos/seed/birthday-box/300/300",
    colors: ["Multicolor"],
    badge: "Best Seller",
    description:
      "A festive mixed arrangement with a 'Happy Birthday' topper — bright, fun, and ready to celebrate."
  },
  {
    id: 14,
    name: "Balloons & Blooms Combo",
    category: "Birthday Flowers",
    price: 1499,
    discountPrice: null,
    rating: 4.6,
    reviews: 41,
    image: "https://picsum.photos/seed/birthday-balloon/600/600",
    thumb: "https://picsum.photos/seed/birthday-balloon/300/300",
    colors: ["Multicolor"],
    badge: "",
    description:
      "A cheerful bunch of gerberas and roses paired with a birthday balloon for an extra-special surprise."
  },
  {
    id: 15,
    name: "Bridal White Bouquet",
    category: "Wedding Flowers",
    price: 1899,
    discountPrice: 1599,
    rating: 4.9,
    reviews: 67,
    image: "https://picsum.photos/seed/wedding-white/600/600",
    thumb: "https://picsum.photos/seed/wedding-white/300/300",
    colors: ["White", "Ivory"],
    badge: "Sale",
    description:
      "An elegant cascading bridal bouquet of white roses, lilies, and baby's breath for the perfect walk down the aisle."
  },
  {
    id: 16,
    name: "Wedding Centerpiece Arrangement",
    category: "Wedding Flowers",
    price: 2199,
    discountPrice: null,
    rating: 4.7,
    reviews: 24,
    image: "https://picsum.photos/seed/wedding-center/600/600",
    thumb: "https://picsum.photos/seed/wedding-center/300/300",
    colors: ["Pink", "White", "Green"],
    badge: "",
    description:
      "A lush table centerpiece combining roses, lilies, and eucalyptus — designed to elevate wedding décor."
  }
];

/* Coupon codes available at checkout/cart (demo only) */
const COUPONS = {
  BLOOM10: 0.10,
  FLOWER20: 0.20,
  WELCOME50: 0.50 // flat 50 rupees off, handled specially in script.js
};

/* Flat delivery charge, waived above a free-delivery threshold */
const DELIVERY_CHARGE = 79;
const FREE_DELIVERY_THRESHOLD = 1500;
