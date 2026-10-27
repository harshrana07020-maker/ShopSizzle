import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, CartItem, Order, UserProfile, Language, TRANSLATIONS } from "../types";

interface ShopContextType {
  user: UserProfile | null;
  token: string | null;
  cart: CartItem[];
  wishlist: Product[];
  orders: Order[];
  products: Product[];
  currentProduct: Product | null;
  language: Language;
  t: typeof TRANSLATIONS['en'];
  searchQuery: string;
  selectedCategory: 'all' | 'Men' | 'Women' | 'Kids';
  selectedSubcategory: string;
  sortBy: string;
  selectedSize: string;
  selectedColor: string;
  priceRange: [number, number];
  viewingOrderId: string | null;
  currentPage: 'home' | 'product-detail' | 'cart' | 'checkout' | 'orders' | 'admin' | 'auth';
  collectionImageFit: 'cover' | 'contain';
  setCollectionImageFit: (fit: 'cover' | 'contain') => void;
  aiRecommendations: { productId: string; reason: string }[];
  aiLoading: boolean;
  setSearchQuery: (q: string) => void;
  setSelectedCategory: (cat: 'all' | 'Men' | 'Women' | 'Kids') => void;
  setSelectedSubcategory: (sub: string) => void;
  setSortBy: (sort: string) => void;
  setSelectedSize: (size: string) => void;
  setSelectedColor: (color: string) => void;
  setPriceRange: (range: [number, number]) => void;
  setPage: (page: 'home' | 'product-detail' | 'cart' | 'checkout' | 'orders' | 'admin' | 'auth') => void;
  setViewingOrderId: (id: string | null) => void;
  setLanguage: (lang: Language) => void;
  login: (email: string, password: string) => Promise<boolean>;
  register: (fullName: string, email: string, password: string, phone: string) => Promise<boolean>;
  logout: () => void;
  loadProducts: () => Promise<void>;
  viewProduct: (id: string) => Promise<void>;
  toggleWishlist: (productId: string) => Promise<void>;
  addToCart: (productId: string, qty: number, color: string, size: string) => Promise<void>;
  updateCartQty: (productId: string, color: string, size: string, qty: number) => Promise<void>;
  removeFromCart: (productId: string, color: string, size: string) => Promise<void>;
  loadCart: () => Promise<void>;
  loadWishlist: () => Promise<void>;
  loadOrders: () => Promise<void>;
  submitReview: (productId: string, rating: number, comment: string) => Promise<boolean>;
  placeOrder: (shippingAddress: any, paymentMethod: 'COD' | 'UPI' | 'NetBanking') => Promise<string | null>;
  cancelOrder: (orderId: string) => Promise<void>;
  fetchAiRecommendations: (searchHistory?: string, currentProdId?: string) => Promise<void>;
  
  // Admin Methods
  adminDashboardData: any;
  loadAdminDashboard: () => Promise<void>;
  adminUpdateOrderStatus: (id: string, status: string) => Promise<void>;
  adminSaveProduct: (formData: any) => Promise<boolean>;
  adminDeleteProduct: (id: string) => Promise<boolean>;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("ssh_token")); // Default to standard session token
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [language, setLanguageState] = useState<Language>((localStorage.getItem("ssh_lang") as Language) || "en");
  
  // Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'Men' | 'Women' | 'Kids'>("all");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 8000]);

  // Page controller
  const [currentPage, setCurrentPage] = useState<'home' | 'product-detail' | 'cart' | 'checkout' | 'orders' | 'admin' | 'auth'>("home");
  const [viewingOrderId, setViewingOrderId] = useState<string | null>(null);
  const [collectionImageFit, setCollectionImageFitState] = useState<'cover' | 'contain'>(
    (localStorage.getItem("ssh_collection_fit") as 'cover' | 'contain') || "cover"
  );

  const setCollectionImageFit = (fit: 'cover' | 'contain') => {
    setCollectionImageFitState(fit);
    localStorage.setItem("ssh_collection_fit", fit);
  };
  
  // AI recommendation variables
  const [aiRecommendations, setAiRecommendations] = useState<{ productId: string; reason: string }[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  
  // Admin data
  const [adminDashboardData, setAdminDashboardData] = useState<any>(null);

  const t = TRANSLATIONS[language];

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("ssh_lang", lang);
  };

  const setPage = (page: 'home' | 'product-detail' | 'cart' | 'checkout' | 'orders' | 'admin' | 'auth') => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Helper values for standard headers
  const getHeaders = () => ({
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  });

  // Get current products with filtering applied
  useEffect(() => {
    loadProducts();
  }, [searchQuery, selectedCategory, selectedSubcategory, sortBy, priceRange]);

  // Sync user databases on token status changes
  useEffect(() => {
    if (token) {
      localStorage.setItem("ssh_token", token);
      loadUserProfile();
      loadWishlist();
      loadCart();
      loadOrders();
    } else {
      localStorage.removeItem("ssh_token");
      setUser(null);
      setCart([]);
      setWishlist([]);
      setOrders([]);
    }
  }, [token]);

  // Auto trigger AI Recommendations on user wishlist/cart activity
  useEffect(() => {
    if (products.length > 0) {
      fetchAiRecommendations(searchQuery, currentProduct?.id);
    }
  }, [products.length, wishlist.length, currentProduct?.id]);

  const loadUserProfile = async () => {
    try {
      const res = await fetch("/api/auth/profile", { headers: getHeaders() });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        setToken(null);
      }
    } catch (err) {
      console.error("Profile fetching failed: ", err);
    }
  };

  const loadProducts = async () => {
    try {
      let queryUrl = "/api/products?";
      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);
      if (selectedCategory !== "all") params.append("category", selectedCategory);
      if (selectedSubcategory) params.append("subcategory", selectedSubcategory);
      if (priceRange[0] > 0) params.append("minPrice", String(priceRange[0]));
      if (priceRange[1] < 8000) params.append("maxPrice", String(priceRange[1]));
      if (sortBy !== "default") params.append("sortBy", sortBy);
      if (selectedSize) params.append("size", selectedSize);
      if (selectedColor) params.append("color", selectedColor);

      const res = await fetch(queryUrl + params.toString());
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error("Products catalog loading error: ", err);
    }
  };

  const viewProduct = async (id: string) => {
    try {
      const res = await fetch(`/api/products/${id}`);
      if (res.ok) {
        const data = await res.json();
        setCurrentProduct(data);
        setPage("product-detail");
      }
    } catch (err) {
      console.error("Product fetching error: ", err);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      if (res.ok) {
        const data = await res.json();
        setToken(data.token);
        setUser(data.user);
        setPage("home");
        return true;
      }
    } catch (err) {
      console.error("Login crashed: ", err);
    }
    return false;
  };

  const register = async (fullName: string, email: string, password: string, phone: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, password, phoneNumber: phone })
      });
      if (res.ok) {
        const data = await res.json();
        setToken(data.token);
        setUser(data.user);
        setPage("home");
        return true;
      }
    } catch (err) {
      console.error("Registration failed", err);
    }
    return false;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setPage("home");
  };

  const loadCart = async () => {
    if (!token) return;
    try {
      const res = await fetch("/api/cart", { headers: getHeaders() });
      if (res.ok) {
        const data = await res.json();
        setCart(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const loadWishlist = async () => {
    if (!token) return;
    try {
      const res = await fetch("/api/wishlist", { headers: getHeaders() });
      if (res.ok) {
        const data = await res.json();
        setWishlist(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const loadOrders = async () => {
    if (!token) return;
    try {
      const res = await fetch("/api/orders", { headers: getHeaders() });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const toggleWishlist = async (productId: string) => {
    if (!token) {
      setPage("auth");
      return;
    }
    try {
      const res = await fetch("/api/wishlist/toggle", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ productId })
      });
      if (res.ok) {
        await loadWishlist();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const addToCart = async (productId: string, qty: number, color: string, size: string) => {
    if (!token) {
      setPage("auth");
      return;
    }
    try {
      const res = await fetch("/api/cart/add", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ productId, quantity: qty, color, size })
      });
      if (res.ok) {
        await loadCart();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const updateCartQty = async (productId: string, color: string, size: string, qty: number) => {
    try {
      const res = await fetch("/api/cart/update", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ productId, color, size, quantity: qty })
      });
      if (res.ok) {
        await loadCart();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const removeFromCart = async (productId: string, color: string, size: string) => {
    try {
      const res = await fetch("/api/cart/remove", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ productId, color, size })
      });
      if (res.ok) {
        await loadCart();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const submitReview = async (productId: string, rating: number, comment: string): Promise<boolean> => {
    if (!token) {
      setPage("auth");
      return false;
    }
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ productId, rating, comment })
      });
      if (res.ok) {
        if (currentProduct && currentProduct.id === productId) {
          await viewProduct(productId);
        }
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  const placeOrder = async (shippingAddress: any, paymentMethod: 'COD' | 'UPI' | 'NetBanking'): Promise<string | null> => {
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ shippingAddress, paymentMethod })
      });
      if (res.ok) {
        const data = await res.json();
        await loadCart();
        await loadOrders();
        return data.order.id;
      }
    } catch (err) {
      console.error(err);
    }
    return null;
  };

  const cancelOrder = async (orderId: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/cancel`, {
        method: "POST",
        headers: getHeaders()
      });
      if (res.ok) {
        await loadOrders();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAiRecommendations = async (qHistory?: string, currentId?: string) => {
    setAiLoading(true);
    try {
      const res = await fetch("/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id || null,
          searchHistory: qHistory || searchQuery || "",
          currentProductId: currentId || null
        })
      });
      if (res.ok) {
        const data = await res.json();
        setAiRecommendations(data);
      }
    } catch (e) {
      console.error("AI recommendation failed", e);
    } finally {
      setAiLoading(false);
    }
  };

  // Admin Methods implementation
  const loadAdminDashboard = async () => {
    try {
      const res = await fetch("/api/admin/dashboard", { headers: getHeaders() });
      if (res.ok) {
        const data = await res.json();
        setAdminDashboardData(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const adminUpdateOrderStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${id}/status`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        await loadAdminDashboard();
        await loadOrders();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const adminSaveProduct = async (formData: any): Promise<boolean> => {
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        await loadProducts();
        await loadAdminDashboard();
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  const adminDeleteProduct = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
        headers: getHeaders()
      });
      if (res.ok) {
        await loadProducts();
        await loadAdminDashboard();
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  return (
    <ShopContext.Provider
      value={{
        user,
        token,
        cart,
        wishlist,
        orders,
        products,
        currentProduct,
        language,
        t,
        searchQuery,
        selectedCategory,
        selectedSubcategory,
        sortBy,
        selectedSize,
        selectedColor,
        priceRange,
        currentPage,
        collectionImageFit,
        setCollectionImageFit,
        viewingOrderId,
        aiRecommendations,
        aiLoading,
        adminDashboardData,
        setSearchQuery,
        setSelectedCategory,
        setSelectedSubcategory,
        setSortBy,
        setSelectedSize,
        setSelectedColor,
        setPriceRange,
        setPage,
        setViewingOrderId,
        setLanguage,
        login,
        register,
        logout,
        loadProducts,
        viewProduct,
        toggleWishlist,
        addToCart,
        updateCartQty,
        removeFromCart,
        loadCart,
        loadWishlist,
        loadOrders,
        submitReview,
        placeOrder,
        cancelOrder,
        fetchAiRecommendations,
        loadAdminDashboard,
        adminUpdateOrderStatus,
        adminSaveProduct,
        adminDeleteProduct
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (context === undefined) {
    throw new Error("useShop must be declared within a ShopProvider wrapper");
  }
  return context;
};
