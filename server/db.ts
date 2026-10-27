import fs from 'fs';
import path from 'path';

export interface Product {
  id: string;
  name: string;
  category: 'Men' | 'Women' | 'Kids';
  subcategory: 'T-Shirts' | 'Shirts' | 'Jeans' | 'Hoodies' | 'Jackets' | 'Kurta' | 'Saree' | 'Dress' | 'Footwear' | 'Accessories';
  price: number;
  originalPrice: number;
  description: string;
  images: string[];
  colors: string[];
  sizes: string[];
  stock: number;
  rating: number;
  reviewsCount: number;
  badge?: string;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Order {
  id: string;
  userId: string;
  items: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    color: string;
    size: string;
    image: string;
  }[];
  shippingAddress: {
    fullName: string;
    email: string;
    phoneNumber: string;
    address: string;
    state: string;
    city: string;
    pinCode: string;
  };
  paymentMethod: 'COD' | 'UPI' | 'NetBanking';
  paymentStatus: 'Pending' | 'Paid' | 'Failed';
  totalAmount: number;
  orderStatus: 'Placed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  createdAt: string;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  passwordHash: string; // hashed simple or stored
  phoneNumber?: string;
  isAdmin?: boolean;
  addresses?: {
    fullName: string;
    phoneNumber: string;
    address: string;
    state: string;
    city: string;
    pinCode: string;
  }[];
}

export interface DatabaseState {
  users: UserProfile[];
  products: Product[];
  reviews: Review[];
  orders: Order[];
  wishlists: Record<string, string[]>; // userId -> productIds[]
  carts: Record<string, { productId: string, quantity: number, color: string, size: string }[]>; // userId -> items
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Initialize with massive rich fashion catalog representing all items
const INITIAL_PRODUCTS: Product[] = [
  {
    id: "prod_1",
    name: "Classic Oxford Cotton Tailored Shirt",
    category: "Men",
    subcategory: "Shirts",
    price: 1899,
    originalPrice: 2499,
    description: "Crafted from 100% fine combed cotton oxford fabric. Perfect balance of casual elegance and comfortable structured drape. Features an aesthetic button-down collar, elegant chest pocket, and robust pearlized buttons.",
    images: [
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop"
    ],
    colors: ["Sky Blue", "Chalk White", "Dusty Pink"],
    sizes: ["S", "M", "L", "XL"],
    stock: 24,
    rating: 4.8,
    reviewsCount: 42,
    badge: "Best Seller"
  },
  {
    id: "prod_2",
    name: "Handcrafted Indigo Denim Shirt",
    category: "Men",
    subcategory: "Shirts",
    price: 2199,
    originalPrice: 2999,
    description: "A rugged, elegant modern standard casual denim shirt. Features beautiful brass buttons, single-needle tailor finishing, contrast orange stitch lining, and faded texture details developed with eco-friendly wash techniques.",
    images: [
      "https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&auto=format&fit=crop"
    ],
    colors: ["Indigo Wash", "Carbon Grey"],
    sizes: ["M", "L", "XL", "XXL"],
    stock: 12,
    rating: 4.5,
    reviewsCount: 28,
    badge: "Trending"
  },
  {
    id: "prod_3",
    name: "Chanderi Silk Golden Zari Saree",
    category: "Women",
    subcategory: "Saree",
    price: 4999,
    originalPrice: 6500,
    description: "Exquisite hand-woven Chanderi silk saree showcasing beautiful gold zari border and delicate floral motifs over an elegant emerald canvas. Traditional craftsmanship meeting contemporary high luxury. Includes custom blouse material.",
    images: [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop"
    ],
    colors: ["Emerald Green", "Royal Crimson", "Regal Maroon"],
    sizes: ["One Size"],
    stock: 5,
    rating: 4.9,
    reviewsCount: 19,
    badge: "Festival Offer"
  },
  {
    id: "prod_4",
    name: "Relaxed French Terry Cotton Hoodie",
    category: "Men",
    subcategory: "Hoodies",
    price: 2499,
    originalPrice: 3499,
    description: "Our core heavy knit premium French wear. Styled in a drop-shoulder boxy oversized fit, custom woven drawstrings with steel tips, kangaroo pouch pocket, and robust ribbed cuffs.",
    images: [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&auto=format&fit=crop"
    ],
    colors: ["Off-White", "Charcoal Grey", "Burgundy Red"],
    sizes: ["S", "M", "L", "XL"],
    stock: 4,
    rating: 4.7,
    reviewsCount: 56,
    badge: "Low Stock Alert"
  },
  {
    id: "prod_5",
    name: "Classic Silk-Blend Royal Festive Kurta Set",
    category: "Women",
    subcategory: "Kurta",
    price: 3299,
    originalPrice: 4200,
    description: "Premium silk blend Kurta paired with sleek cigarette pants. Beautiful handiwork embroidery lining the collar and sleeves. High comfort breathability suited for traditional festivals and family celebrations.",
    images: [
      "https://images.unsplash.com/photo-1605784401368-5af1d9d6c4dc?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1610030470233-01047190ca1e?w=800&auto=format&fit=crop"
    ],
    colors: ["Pastel Mint", "Warm Saffron", "Rich Navy"],
    sizes: ["S", "M", "L", "XL"],
    stock: 18,
    rating: 4.6,
    reviewsCount: 31,
    badge: "Most Loved"
  },
  {
    id: "prod_6",
    name: "Luxe Satin Silhouette Dress",
    category: "Women",
    subcategory: "Dress",
    price: 2899,
    originalPrice: 3999,
    description: "Elevated evening wear featuring premium heavy-weight fluid satin drape. Styled with adjustable cowl neckline, asymmetric side slits, and a glossy, luxurious premium shimmer. Impeccable tailoring.",
    images: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&auto=format&fit=crop"
    ],
    colors: ["Midnight Gold", "Ruby Maroon", "Satin Black"],
    sizes: ["XS", "S", "M", "L"],
    stock: 9,
    rating: 4.9,
    reviewsCount: 65,
    badge: "Trending"
  },
  {
    id: "prod_7",
    name: "Cozy Fleece Bear-Ear Unisex Kids Hoodie",
    category: "Kids",
    subcategory: "Hoodies",
    price: 1199,
    originalPrice: 1699,
    description: "Ultra-soft combed baby-safe fleece hoodie for ultimate play warmth. Features high durable dual stitch build and adorable soft 3D bear ears on the snug hood. Certified hypoallergenic dye safety.",
    images: [
      "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=800&auto=format&fit=crop"
    ],
    colors: ["Creamy Ivory", "Soft Pink", "Earthy Mustard"],
    sizes: ["2-3 Yrs", "4-5 Yrs", "6-7 Yrs"],
    stock: 15,
    rating: 4.4,
    reviewsCount: 14,
    badge: "Sweet Deal"
  },
  {
    id: "prod_8",
    name: "Floral Cotton Party Dress for Girls",
    category: "Kids",
    subcategory: "Dress",
    price: 1499,
    originalPrice: 1999,
    description: "Breathable pure premium Egyptian cotton fabric with classic hand-painted blooming botanicals print. Detailed with custom ribbon tie-back, structured elegant tiers, and breathable lightweight voil lining.",
    images: [
      "https://images.unsplash.com/photo-1595853035070-59a39fe84de3?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1515488042361-404e92539b20?w=800&auto=format&fit=crop"
    ],
    colors: ["Sky Daisy", "Blush Tulip"],
    sizes: ["3-4 Yrs", "5-6 Yrs", "7-8 Yrs"],
    stock: 8,
    rating: 4.7,
    reviewsCount: 22,
    badge: "New Arrival"
  },
  {
    id: "prod_9",
    name: "Minimalist Italian White Sneaker",
    category: "Men",
    subcategory: "Footwear",
    price: 3499,
    originalPrice: 4999,
    description: "Premium full-grain soft leather sneakers custom hand-stitched in premium workshop settings. Equipped with orthotic memory cushioning, breathable micro-perforated side walls, and custom vulcanized rubber grip outsoles.",
    images: [
      "/my-logo.png"
    ],
    colors: ["Chalk White", "Off-White Beige"],
    sizes: ["UK 7", "UK 8", "UK 9", "UK 10"],
    stock: 14,
    rating: 4.8,
    reviewsCount: 88,
    badge: "Premium Line"
  },
  {
    id: "prod_10",
    name: "Polarized Carbon Sleek Aviators",
    category: "Men",
    subcategory: "Accessories",
    price: 1299,
    originalPrice: 1899,
    description: "Engineered ultra-tough lightweight magnesium alloy frame. Fully-polarized, shatterproof dark-tint lenses offering total UV400 radiation shielding. Complemented by flexible smart spring pressure hinges.",
    images: [
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop"
    ],
    colors: ["Matte Black", "Gunmetal Silver"],
    sizes: ["One Size"],
    stock: 35,
    rating: 4.6,
    reviewsCount: 51,
    badge: "Summer Essential"
  },
  {
    id: "prod_11",
    name: "Tailored Slim Fit Denim Jeans",
    category: "Men",
    subcategory: "Jeans",
    price: 1999,
    originalPrice: 2799,
    description: "Constructed with heavyweight Japanese selvedge-inspired denim with 2% elastane for premium flexible contour stretching. Finished in dark indigo wash with elegant custom branding copper rivets.",
    images: [
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop"
    ],
    colors: ["Midnight Blue", "Washed Grey"],
    sizes: ["30", "32", "34", "36"],
    stock: 22,
    rating: 4.5,
    reviewsCount: 39,
    badge: "Comfort Fit"
  },
  {
    id: "prod_12",
    name: "Fine Leather Chronograph Masterpiece",
    category: "Men",
    subcategory: "Accessories",
    price: 4499,
    originalPrice: 5999,
    description: "Executive collection watch housing custom Japanese multi-dial movement. Enclosed in polished scratch-resistant sapphire crystal casing and strapped with elegant dark handworked grain leather.",
    images: [
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800&auto=format&fit=crop"
    ],
    colors: ["Tan Leather-Gold", "Black Leather-Silver"],
    sizes: ["One Size"],
    stock: 7,
    rating: 4.9,
    reviewsCount: 12,
    badge: "Exclusive"
  }
];

const DEFAULT_REVIEWS: Review[] = [
  {
    id: "rev_1",
    productId: "prod_1",
    userName: "Aarav Sharma",
    rating: 5,
    comment: "The fabric quality of this Oxford shirt is absolutely magnificent. Feels incredibly rich on the body and keeps shape perfectly throughout the day. Best tailored purchase this year!",
    createdAt: "2026-05-10T12:00:00Z"
  },
  {
    id: "rev_2",
    productId: "prod_1",
    userName: "Priya Patel",
    rating: 4,
    comment: "Bought it for my husband. The color Sky Blue is exactly as displayed on screen. Fast shipping, great fit. Will buy again.",
    createdAt: "2026-06-01T14:30:00Z"
  },
  {
    id: "rev_3",
    productId: "prod_3",
    userName: "Meera Mehta",
    rating: 5,
    comment: "Incredibly elegant Chanderi silk saree. The zari hand embroidery catches light perfectly. Received numerous compliments at my family wedding!",
    createdAt: "2026-06-15T09:15:00Z"
  },
  {
    id: "rev_4",
    productId: "prod_6",
    userName: "Anjali Vyas",
    rating: 5,
    comment: "Stunning evening satin dress! Has an flawless heavy flow drape which contours gorgeously. Worth every single rupee paid.",
    createdAt: "2026-06-18T18:45:00Z"
  }
];

export function getDatabase(): DatabaseState {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    const initialState: DatabaseState = {
      users: [
        {
          id: "admin_user",
          fullName: "Admin Controller",
          email: "admin@shopsizzle.com",
          passwordHash: "$2a$10$xyzAdminHashedPasswordPlaceHolding", // placeholder simple
          phoneNumber: "9988776655",
          isAdmin: true
        },
        {
          id: "demo_customer",
          fullName: "Devasya Patel",
          email: "pr0596793@gmail.com",
          passwordHash: "$2a$10$xyzCustomerHashedPasswordPlaceHolding",
          phoneNumber: "9876543210",
          isAdmin: false,
          addresses: [
            {
              fullName: "Devasya Patel",
              phoneNumber: "9876543210",
              address: "404, Elegance Avenue, CG Road",
              state: "Gujarat",
              city: "Ahmedabad",
              pinCode: "380009"
            }
          ]
        }
      ],
      products: INITIAL_PRODUCTS,
      reviews: DEFAULT_REVIEWS,
      orders: [
        {
          id: "order_1",
          userId: "demo_customer",
          items: [
            {
              productId: "prod_1",
              name: "Classic Oxford Cotton Tailored Shirt",
              price: 1899,
              quantity: 1,
              color: "Sky Blue",
              size: "M",
              image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop"
            }
          ],
          shippingAddress: {
            fullName: "Devasya Patel",
            email: "pr0596793@gmail.com",
            phoneNumber: "9876543210",
            address: "404, Elegance Avenue, CG Road",
            state: "Gujarat",
            city: "Ahmedabad",
            pinCode: "380009"
          },
          paymentMethod: "UPI",
          paymentStatus: "Paid",
          totalAmount: 1899,
          orderStatus: "Processing",
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // 1 day ago
        }
      ],
      wishlists: {
        "demo_customer": ["prod_3", "prod_6"]
      },
      carts: {
        "demo_customer": [
          { productId: "prod_2", quantity: 1, color: "Indigo Wash", size: "M" }
        ]
      }
    };
    saveDatabase(initialState);
    return initialState;
  }

  try {
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error("Failed to parse database, reinitializing: ", err);
    return {
      users: [],
      products: INITIAL_PRODUCTS,
      reviews: DEFAULT_REVIEWS,
      orders: [],
      wishlists: {},
      carts: {}
    };
  }
}

export function saveDatabase(state: DatabaseState): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(DB_FILE, JSON.stringify(state, null, 2), 'utf8');
}
