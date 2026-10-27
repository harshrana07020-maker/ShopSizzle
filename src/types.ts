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
  badge?: string; // e.g. "Best Seller", "New Arrival", "20% OFF", "Trending"
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor: string;
  selectedSize: string;
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
  phoneNumber?: string;
  addresses?: {
    fullName: string;
    phoneNumber: string;
    address: string;
    state: string;
    city: string;
    pinCode: string;
  }[];
  isAdmin?: boolean;
}

export type Language = 'en' | 'gu' | 'hi';

export const TRANSLATIONS = {
  en: {
    brandName: "ShopSizzle",
    tagline: "Smart Fashion. Smarter Shopping.",
    searchPlaceholder: "Search styles, brands & more...",
    allCategories: "All Collections",
    men: "Men",
    women: "Women",
    kids: "Kids",
    bestSellers: "Best Sellers",
    newArrivals: "New Arrivals",
    trending: "Trending Products",
    festivalOffers: "Festival Offers",
    aiRecommended: "AI Smart Stylist Matches",
    aiExplain: "Personalized selections curated via Gemini",
    addToCart: "Add to Bag",
    addedToBag: "Added to Bag!",
    buyNow: "Instant Checkout",
    wishlist: "Wishlist",
    cart: "Shopping Bag",
    emptyCart: "Your shopping bag is waiting to be filled",
    checkout: "Proceed to Secure Payment",
    orderSummary: "Order Details",
    size: "Size",
    color: "Color",
    quantity: "Qty",
    remove: "Remove",
    price: "Price",
    discount: "Discount",
    shipping: "Delivery Fees",
    free: "FREE",
    total: "To Pay",
    reviews: "Buyer Reviews",
    writeReview: "Write review",
    orderHistory: "My Orders",
    profile: "Profile Settings",
    adminDashboard: "Admin Suite",
    trendingLabel: "Trending Now",
    lowStock: "Few Left!",
    selectSize: "Select Size",
    selectColor: "Select Color",
    ratings: "Reviews",
    originalPrice: "Original Price",
    save: "Save",
    paymentMethods: "Choose Payment Route",
    cod: "Cash On Delivery (COD)",
    upi: "UPI (Paytm/GPay/PhonePe)",
    netbanking: "Secure Net Banking",
    placeOrder: "Confirm Order",
    ordersuccess: "Order Successfully Placed!",
    ordernumber: "Reference Hash ID",
    trackOrder: "Track Shipment",
    cancelOrder: "Request Cancellation",
    orderStatusPl: "Under Review",
    orderStatusPr: "In Pack & Sort",
    orderStatusSh: "In Route & Loaded",
    orderStatusDe: "Delivered & Settled",
    orderStatusCa: "Cancelled & Refended",
    revenue: "Total Revenue",
    lowStockAlert: "Low Inventory Warning (< 10 units)",
    salesAnalytics: "Sales Dashboard",
    productsCount: "Total Curated Items",
    customersCount: "Active Customers",
    recentOrders: "Live Purchase Activity",
    lowInventoryNotice: "Alert: Reorder list generated"
  },
  gu: {
    brandName: "ShopSizzle",
    tagline: "સ્માર્ટ ફેશન. સ્માર્ટર શોપિંગ.",
    searchPlaceholder: "સ્ટાઈલ, બ્રાન્ડ્સ અને વધુ શોધો...",
    allCategories: "બધા કલેક્શન",
    men: "પુરુષો",
    women: "મહિલાઓ",
    kids: "બાળકો",
    bestSellers: "સૌથી વધુ વેચાતા",
    newArrivals: "નવું સંગ્રહ",
    trending: "ટ્રેન્ડિંગ પ્રોડક્ટ્સ",
    festivalOffers: "તહેવારની ઓફરો",
    aiRecommended: "AI સ્માર્ટ સ્ટાઇલિશ મેચ",
    aiExplain: "Gemini દ્વારા વ્યક્તિગત પસંદગીઓ",
    addToCart: "બેગમાં ઉમેરો",
    addedToBag: "બેગમાં ઉમેરાયું!",
    buyNow: "તરત જ ખરીદો",
    wishlist: "વિશલિસ્ટ",
    cart: "શોપિંગ બેગ",
    emptyCart: "તમારી શોપિંગ બેગ ખાલી છે",
    checkout: "સુરક્ષિત પેમેન્ટ પર આગળ વધો",
    orderSummary: "ઓર્ડર વિગતો",
    size: "કદ",
    color: "રંગ",
    quantity: "જથ્થો",
    remove: "દૂર કરો",
    price: "કિંમત",
    discount: "ડિસ્કાઉન્ટ",
    shipping: "ડિલિવરી ચાર્જ",
    free: "મફત",
    total: "કુલ ચૂકવણી",
    reviews: "ગ્રાહક સમીક્ષાઓ",
    writeReview: "સમીક્ષા લખો",
    orderHistory: "મારા ઓર્ડર્સ",
    profile: "પ્રોફાઇલ સેટિંગ્સ",
    adminDashboard: "એડમિન પેનલ",
    trendingLabel: "ટ્રેન્ડિંગ",
    lowStock: "થોડો જ સ્ટોક બાકી છે!",
    selectSize: "કદ પસંદ કરો",
    selectColor: "રંગ પસંદ કરો",
    ratings: "રેટિંગ્સ",
    originalPrice: "મૂળ કિંમત",
    save: "બચત કરો",
    paymentMethods: "પેમેન્ટ પદ્ધતિ પસંદ કરો",
    cod: "કેશ ઓન ડિલિવરી (COD)",
    upi: "UPI (Paytm/GPay/PhonePe)",
    netbanking: "ઇન્ટરનેટ બેન્કિંગ",
    placeOrder: "ઓર્ડર કન્ફર્મ કરો",
    ordersuccess: "ઓર્ડર સફળતાપૂર્વક મૂકવામાં આવ્યો છે!",
    ordernumber: "ઓર્ડર નંબર",
    trackOrder: "ટ્રેક ઓર્ડર",
    cancelOrder: "ઓર્ડર કેન્સલ કરો",
    orderStatusPl: "સમીક્ષા હેઠળ",
    orderStatusPr: "પેકિંગ ચાલુ છે",
    orderStatusSh: "રસ્તામાં છે",
    orderStatusDe: "ડિલિવર થયું",
    orderStatusCa: "કેન્સલ કરેલ",
    revenue: "કુલ આવક",
    lowStockAlert: "ઓછો સ્ટોક ચેતવણી (< 10 એકમો)",
    salesAnalytics: "વેચાણ વિશ્લેષણ",
    productsCount: "કુલ ઉત્પાદનો",
    customersCount: "સક્રિય ગ્રાહકો",
    recentOrders: "તાજેતરના ઓર્ડરો",
    lowInventoryNotice: "ચેતવણી: સ્ટોક ઓછો છે"
  },
  hi: {
    brandName: "ShopSizzle",
    tagline: "स्मार्ट फैशन। स्मार्ट शॉपिंग।",
    searchPlaceholder: "स्टाइल, ब्रांड और बहुत कुछ खोजें...",
    allCategories: "सभी कलेक्शंस",
    men: "पुरुष",
    women: "महिलाएं",
    kids: "बच्चे",
    bestSellers: "बेस्ट सेलर्स",
    newArrivals: "नए आगमन",
    trending: "ट्रेंडिंग उत्पाद",
    festivalOffers: "त्योहार के ऑफर्स",
    aiRecommended: "AI स्मार्ट स्टाइलिस्ट मैच",
    aiExplain: "Gemini द्वारा पर्सनलाइज्ड सिलेक्शन",
    addToCart: "बैग में जोड़ें",
    addedToBag: "बैग में जोड़ दिया गया!",
    buyNow: "तुरंत खरीदें",
    wishlist: "विशलिस्ट",
    cart: "शॉपिंग बैग",
    emptyCart: "आपका शॉपिंग बैग खाली है",
    checkout: "सुरक्षित भुगतान के लिए बढ़ें",
    orderSummary: "ऑर्डर का विवरण",
    size: "साइज",
    color: "रंग",
    quantity: "मात्रा",
    remove: "हटाएं",
    price: "कीमत",
    discount: "छूट",
    shipping: "डिलीवरी शुल्क",
    free: "मुफ़्त",
    total: "कुल भुगतान",
    reviews: "ग्राहक समीक्षाएं",
    writeReview: "समीक्षा लिखें",
    orderHistory: "मेरे ऑर्डर्स",
    profile: "प्रोफ़ाइल सेटिंग्स",
    adminDashboard: "एडमिन पैनल",
    trendingLabel: "ट्रेंडिंग",
    lowStock: "कुछ ही बचे हैं!",
    selectSize: "साइज चुनें",
    selectColor: "रंग चुनें",
    ratings: "रेटिंग्स",
    originalPrice: "मूल्य",
    save: "बचत",
    paymentMethods: "भुगतान का प्रकार चुनें",
    cod: "कैश ऑन डिलीवरी (COD)",
    upi: "UPI (Paytm/GPay/PhonePe)",
    netbanking: "नेट बैंकिंग",
    placeOrder: "ऑर्डर कन्फर्म करें",
    ordersuccess: "ऑर्डर सफलतापूर्वक स्वीकार किया गया!",
    ordernumber: "ऑर्डर नंबर",
    trackOrder: "ऑर्डर ट्रैक करें",
    cancelOrder: "ऑर्डर कैंसिल करें",
    orderStatusPl: "समीक्षा के तहत",
    orderStatusPr: "पैकिंग की जा रही है",
    orderStatusSh: "भेज दिया गया है",
    orderStatusDe: "डिलीवर हो गया",
    orderStatusCa: "रद्द किया गया",
    revenue: "कुल राजस्व",
    lowStockAlert: "कम स्टॉक चेतावनी (< 10 इकाइयां)",
    salesAnalytics: "बिक्री का विश्लेषण",
    productsCount: "कुल उत्पाद",
    customersCount: "सक्रिय ग्राहक",
    recentOrders: "हाल ही के ऑर्डर्स",
    lowInventoryNotice: "चेतावनी: स्टॉक कम है"
  }
};
