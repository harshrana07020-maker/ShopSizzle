import React, { useState, useEffect, useRef } from "react";
import { useShop } from "../context/ShopContext";
import { Product, Order, UserProfile } from "../types";
import { 
  LayoutDashboard, 
  Package, 
  ClipboardList, 
  Users, 
  Plus, 
  Trash2, 
  Edit, 
  Upload, 
  AlertTriangle, 
  TrendingUp, 
  DollarSign, 
  Check, 
  X,
  Search,
  MapPin,
  Sparkles,
  ShoppingBag
} from "lucide-react";

export function AdminDashboard() {
  const {
    adminDashboardData,
    loadAdminDashboard,
    adminUpdateOrderStatus,
    adminSaveProduct,
    adminDeleteProduct,
    products,
    token,
    t
  } = useShop();

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'customers'>('dashboard');

  // Customer state retrieved from the newly added API
  const [customers, setCustomers] = useState<any[]>([]);
  const [customersLoading, setCustomersLoading] = useState(false);

  // Search filter inside products list
  const [productSearch, setProductSearch] = useState("");

  // Product form state
  const [formId, setFormId] = useState("");
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState<'Men' | 'Women' | 'Kids'>("Men");
  const [formSubcategory, setFormSubcategory] = useState<'T-Shirts' | 'Shirts' | 'Jeans' | 'Hoodies' | 'Jackets' | 'Kurta' | 'Saree' | 'Dress' | 'Footwear' | 'Accessories'>("Shirts");
  const [formPrice, setFormPrice] = useState("");
  const [formOriginalPrice, setFormOriginalPrice] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formImages, setFormImages] = useState("https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=1200&auto=format&fit=crop");
  const [formColors, setFormColors] = useState("Midnight Black, Deep Blue");
  const [formSizes, setFormSizes] = useState("S, M, L, XL");
  const [formStock, setFormStock] = useState("20");
  const [formBadge, setFormBadge] = useState("Trending");

  // Notification / feedback alerts
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Template fashion image alternatives for fast selection
  const FASHION_PRESETS = [
    { title: "Men Shirt", url: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop" },
    { title: "Denim Jacket", url: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&auto=format&fit=crop" },
    { title: "Women Dress", url: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop" },
    { title: "Saree Collection", url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop" },
    { title: "Kids Hoodie", url: "https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=800&auto=format&fit=crop" },
    { title: "Footwear Sneaker", url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop" }
  ];

  // Retrieve statistics and customers list on load
  useEffect(() => {
    loadAdminDashboard();
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setCustomersLoading(true);
      const headers: any = { "Content-Type": "application/json" };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      const res = await fetch("/api/admin/users", { headers });
      if (res.ok) {
        const data = await res.json();
        setCustomers(data.users || []);
      }
    } catch (e) {
      console.error("Could not fetch customer accounts:", e);
    } finally {
      setCustomersLoading(false);
    }
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  // Convert uploaded image file to absolute Base64 representation
  const processImageFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      showNotification("error", "Invalid file type. Please select an image file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setFormImages(reader.result);
        showNotification("success", "Custom product image successfully compiled.");
      }
    };
    reader.onerror = () => {
      showNotification("error", "Error decoding product file.");
    };
    reader.readAsDataURL(file);
  };

  // Drag and drop event handlers matching specifications
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processImageFile(e.target.files[0]);
    }
  };

  // Product submission handler
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formPrice || !formDescription) {
      showNotification("error", "Required fields are missing.");
      return;
    }

    const payload = {
      id: formId || undefined,
      name: formName,
      category: formCategory,
      subcategory: formSubcategory,
      price: Number(formPrice),
      originalPrice: Number(formOriginalPrice || formPrice),
      description: formDescription,
      images: [formImages],
      colors: formColors.split(",").map(c => c.trim()).filter(Boolean),
      sizes: formSizes.split(",").map(s => s.trim()).filter(Boolean),
      stock: Number(formStock),
      badge: formBadge
    };

    const success = await adminSaveProduct(payload);
    if (success) {
      showNotification("success", formId ? "Product style specifications updated successfully." : "New product options created successfully.");
      // Reset form states
      setFormId("");
      setFormName("");
      setFormPrice("");
      setFormOriginalPrice("");
      setFormDescription("");
      setFormStock("20");
      setFormColors("Midnight Black, Deep Blue");
      setFormSizes("S, M, L, XL");
      setFormBadge("Trending");
      // Re-trigger visual updates
      await loadAdminDashboard();
    } else {
      showNotification("error", "Backend service refused update.");
    }
  };

  const handleEditProduct = (p: Product) => {
    setFormId(p.id);
    setFormName(p.name);
    setFormCategory(p.category);
    setFormSubcategory(p.subcategory);
    setFormPrice(String(p.price));
    setFormOriginalPrice(String(p.originalPrice || p.price));
    setFormDescription(p.description);
    setFormColors(p.colors ? p.colors.join(", ") : "");
    setFormSizes(p.sizes ? p.sizes.join(", ") : "");
    setFormStock(String(p.stock));
    setFormBadge(p.badge || "");
    if (p.images && p.images[0]) {
      setFormImages(p.images[0]);
    }
    showNotification("success", `Editing option for: ${p.name}`);
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"? This action is permanent.`)) {
      const success = await adminDeleteProduct(id);
      if (success) {
        showNotification("success", "Style successfully deleted from catalogs.");
        await loadAdminDashboard();
      } else {
        showNotification("error", "Could not delete product style.");
      }
    }
  };

  const triggerFileClick = () => {
    fileInputRef.current?.click();
  };

  // Filtered lists
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.subcategory.toLowerCase().includes(productSearch.toLowerCase())
  );

  return (
    <div id="shopsizzle-admin-layout" className="flex flex-col lg:flex-row min-h-[650px] bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
      
      {/* SIDEBAR ON THE LEFT */}
      <aside className="w-full lg:w-64 bg-slate-950 text-slate-350 p-6 flex flex-col justify-between border-r border-slate-900">
        <div className="space-y-8">
          
          {/* Admin title header */}
          <div className="flex items-center space-x-3.5 pb-4 border-b border-slate-900">
            <span className="p-2.5 bg-sky-500/10 text-sky-400 rounded-xl">
              <ShoppingBag className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-sm font-black tracking-widest text-white uppercase leading-none">ShopSizzle</h2>
              <span className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-wider">Enterprise Controller</span>
            </div>
          </div>

          {/* Navigation Links list */}
          <nav className="space-y-1.5">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center space-x-3 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all text-left ${
                activeTab === 'dashboard' 
                  ? 'bg-sky-500 text-[#070b19] shadow-md shadow-sky-500/10' 
                  : 'hover:bg-slate-900/50 hover:text-white text-slate-400'
              }`}
            >
              <LayoutDashboard className="w-4.5 h-4.5" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center space-x-3 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all text-left ${
                activeTab === 'products' 
                  ? 'bg-sky-500 text-[#070b19] shadow-md shadow-sky-500/10' 
                  : 'hover:bg-slate-900/50 hover:text-white text-slate-400'
              }`}
            >
              <Package className="w-4.5 h-4.5" />
              <span>Products</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center space-x-3 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all text-left ${
                activeTab === 'orders' 
                  ? 'bg-sky-500 text-[#070b19] shadow-md shadow-sky-500/10' 
                  : 'hover:bg-slate-900/50 hover:text-white text-slate-400'
              }`}
            >
              <ClipboardList className="w-4.5 h-4.5" />
              <span>Orders</span>
            </button>

            <button
              onClick={() => setActiveTab('customers')}
              className={`w-full flex items-center space-x-3 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all text-left ${
                activeTab === 'customers' 
                  ? 'bg-sky-500 text-[#070b19] shadow-md shadow-sky-500/10' 
                  : 'hover:bg-slate-900/50 hover:text-white text-slate-400'
              }`}
            >
              <Users className="w-4.5 h-4.5" />
              <span>Customers</span>
            </button>
          </nav>

        </div>

        <div className="pt-6 border-t border-slate-900 hidden lg:block">
          <p className="text-[9px] text-slate-500 font-mono tracking-wider">
            SYSTEM IP: 127.0.0.1<br/>
            STATUS: ACTIVE DEPLOYMENT
          </p>
        </div>
      </aside>

      {/* RIGHT SIDE MAIN PANEL */}
      <main className="flex-1 bg-slate-50/40 p-6 sm:p-8 overflow-x-hidden min-h-[500px]">
        
        {/* Toast alert feedback notifier */}
        {feedback && (
          <div className={`fixed top-4 right-4 z-50 px-5 py-3.5 rounded-2xl shadow-xl border text-xs font-extrabold flex items-center space-x-3 animate-slide-in ${
            feedback.type === 'success' 
              ? 'bg-emerald-50 border-emerald-100 text-emerald-800' 
              : 'bg-rose-50 border-rose-100 text-rose-800'
          }`}>
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{feedback.message}</span>
          </div>
        )}

        {/* LOADING INDICATOR SKELETON */}
        {!adminDashboardData ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <div className="w-12 h-12 rounded-full border-4 border-sky-400 border-t-transparent animate-spin" />
            <p className="font-mono text-xs text-slate-400 uppercase tracking-widest">Compiling Dashboard Metrics...</p>
          </div>
        ) : (
          <div className="space-y-8 animate-fade-in">
            
            {/* Header section with Dynamic Titles */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-5 gap-3">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-850 uppercase tracking-tight flex items-center space-x-2">
                  <span>{activeTab === 'dashboard' && "Analytics Dashboard"}</span>
                  <span>{activeTab === 'products' && "Product Catalog House"}</span>
                  <span>{activeTab === 'orders' && "Dispatch & Shipments Pack"}</span>
                  <span>{activeTab === 'customers' && "Customer Register Ledger"}</span>
                </h1>
                <p className="text-xs text-slate-400 font-medium">
                  {activeTab === 'dashboard' && "Synthesized sales statistics, dynamic charts & inventory monitors."}
                  {activeTab === 'products' && "Register, edit options, or retire garments and stock structures."}
                  {activeTab === 'orders' && "Sort shipments, package, and adjust chronological delivery status."}
                  {activeTab === 'customers' && "Direct secure access to client list, contacts, and delivery logs."}
                </p>
              </div>
            </div>

            {/* TAB 1: DASHBOARD VIEW */}
            {activeTab === 'dashboard' && (
              <div className="space-y-8">
                
                {/* 4 STAT CARDS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  
                  <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Enterprise Revenue</span>
                      <p className="text-2xl font-black text-slate-900 mt-1">₹{adminDashboardData.revenue.toLocaleString()}</p>
                      <div className="flex items-center text-[10px] text-emerald-600 font-bold mt-1 leading-none">
                        <TrendingUp className="w-3.5 h-3.5 mr-1" />
                        <span>+14.5% Active Grow</span>
                      </div>
                    </div>
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                      <DollarSign className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Deliveries Placed</span>
                      <p className="text-2xl font-black text-slate-900 mt-1">{adminDashboardData.ordersCount}</p>
                      <span className="text-[10px] text-slate-400 block mt-1.5 font-medium leading-none">Shipments dispatched live</span>
                    </div>
                    <div className="p-3 bg-sky-50 text-sky-600 rounded-xl">
                      <ClipboardList className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Products</span>
                      <p className="text-2xl font-black text-slate-900 mt-1">{adminDashboardData.productsCount}</p>
                      <span className="text-[10px] text-slate-400 block mt-1.5 font-medium leading-none">Across style genders</span>
                    </div>
                    <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                      <Package className="w-6 h-6" />
                    </div>
                  </div>

                  <div className={`border rounded-2xl p-6 shadow-sm flex items-center justify-between transition-all ${
                    adminDashboardData.lowStock?.length > 0 
                      ? 'bg-rose-50/30 border-rose-100' 
                      : 'bg-white border-slate-200'
                  }`}>
                    <div>
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${
                        adminDashboardData.lowStock?.length > 0 ? 'text-rose-500' : 'text-slate-400'
                      }`}>Low Stock Alerts</span>
                      <p className={`text-2xl font-black mt-1 ${
                        adminDashboardData.lowStock?.length > 0 ? 'text-rose-600' : 'text-slate-900'
                      }`}>{adminDashboardData.lowStock?.length || 0}</p>
                      {adminDashboardData.lowStock?.length > 0 ? (
                        <div className="flex items-center text-[10px] text-rose-500 font-bold mt-1 leading-none animate-pulse">
                          <AlertTriangle className="w-3.5 h-3.5 mr-1" />
                          <span>Action Required!</span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-emerald-600 font-extrabold block mt-1.5 leading-none">Catalog secure & loaded</span>
                      )}
                    </div>
                    <div className={`p-3 rounded-xl ${
                      adminDashboardData.lowStock?.length > 0 ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-500'
                    }`}>
                      <AlertTriangle className="w-6 h-6" />
                    </div>
                  </div>

                </div>

                {/* GRAPHICAL METRICS CHART & LOW INVENTORY COMPILER */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  
                  {/* Category bars representing visual segments */}
                  <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white space-y-4 shadow-sm">
                    <div className="flex justify-between items-start border-b border-slate-800 pb-3">
                      <div>
                        <h3 className="text-xs font-black uppercase tracking-widest text-sky-400">Relative Category Sales</h3>
                        <p className="text-[11px] text-slate-400 font-medium">Aggregated store revenue mapped by main departments</p>
                      </div>
                    </div>

                    <div className="space-y-5 pt-3">
                      {Object.entries(adminDashboardData.categorySales || {}).map(([cat, val]: any) => {
                        const salesList: number[] = Object.values(adminDashboardData.categorySales || {});
                        const maxVal = Math.max(...salesList, 1);
                        const percentRatio = Math.round((val / maxVal) * 100);
                        return (
                          <div key={cat} className="space-y-1.5">
                            <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                              <span className="text-slate-300">{cat} Segment</span>
                              <span className="font-mono text-sky-300">₹{val.toLocaleString()} ({percentRatio}%)</span>
                            </div>
                            <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
                              <div
                                style={{ width: `${percentRatio}%` }}
                                className="h-full bg-gradient-to-r from-sky-450 to-blue-500 rounded-full transition-all duration-1000"
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Low Inventory list */}
                  <div className="bg-white border border-slate-200/80 rounded-2xl p-6 space-y-4 shadow-sm max-h-[300px] overflow-y-auto">
                    <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
                      <AlertTriangle className="w-4.5 h-4.5 text-rose-500" />
                      <h4 className="font-bold text-xs uppercase text-slate-800 leading-none">Low Stock Warning</h4>
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold leading-relaxed">
                      These clothing options have dangerously low stock count. Consider preparing supplier manifests.
                    </p>
                    <div className="space-y-3.5">
                      {adminDashboardData.lowStock?.length === 0 ? (
                        <div className="text-center py-6 text-xs font-medium text-slate-400 uppercase">
                          No low stock warning flags
                        </div>
                      ) : (
                        adminDashboardData.lowStock?.map((item: Product) => (
                          <div key={item.id} className="flex justify-between items-center text-xs">
                            <span className="font-bold text-slate-700 leading-snug line-clamp-1">{item.name}</span>
                            <span className="bg-rose-50 text-rose-600 font-extrabold font-mono rounded-lg px-2.5 py-1 text-[10px] shrink-0">
                              {item.stock} Units
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                </div>

                {/* RECENT LIVE ORDERS TABLE VIEW */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-6 space-y-4 shadow-sm">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Recent Orders Ledger</h4>
                    <button 
                      onClick={() => setActiveTab('orders')} 
                      className="text-[10px] text-sky-500 hover:text-sky-600 font-black uppercase tracking-wider flex items-center space-x-1"
                    >
                      <span>Manage All Orders</span>
                    </button>
                  </div>
                  <div className="overflow-x-auto text-left">
                    <table className="w-full text-xs text-slate-500 font-medium whitespace-nowrap">
                      <thead>
                        <tr className="border-b border-slate-150 py-2.5 text-[10px] uppercase font-black text-slate-400 text-left">
                          <th className="py-3">Order Hash ID</th>
                          <th>Recipient</th>
                          <th>Grand Total</th>
                          <th>Purchased Date</th>
                          <th>Shipment Stage</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-sans">
                        {adminDashboardData.recentOrders?.slice(0, 5).map((ord: Order) => (
                          <tr key={ord.id} className="hover:bg-slate-50/40">
                            <td className="py-3.5 font-bold text-slate-800">{ord.id}</td>
                            <td>{ord.shippingAddress.fullName}</td>
                            <td className="font-mono font-bold text-slate-700">₹{ord.totalAmount.toLocaleString()}</td>
                            <td>{new Date(ord.createdAt).toLocaleDateString()}</td>
                            <td>
                              <span className={`px-2.5 py-0.5 rounded text-[9px] font-black uppercase ${
                                ord.orderStatus === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                                ord.orderStatus === 'Cancelled' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                              }`}>
                                {ord.orderStatus}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            {/* TAB 2: PRODUCTS CATALOG HOUSE */}
            {activeTab === 'products' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* 1. STATEFUL ADD / EDIT FORM FOR PRODUCTS */}
                <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-sm space-y-5">
                  <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                    <h3 className="font-extrabold text-xs text-slate-850 uppercase tracking-widest">
                      {formId ? "⚡ Modify Selected Garment Specifications" : "✨ Register New Custom Garment Option"}
                    </h3>
                    {formId && (
                      <button 
                        onClick={() => {
                          setFormId("");
                          setFormName("");
                          setFormPrice("");
                          setFormOriginalPrice("");
                          setFormDescription("");
                          setFormStock("20");
                          setFormBadge("Trending");
                          setFormColors("Midnight Black, Deep Blue");
                        }}
                        className="text-[10px] text-rose-500 hover:text-rose-600 font-black uppercase tracking-wider"
                      >
                        Reset Add Mode
                      </button>
                    )}
                  </div>

                  <form onSubmit={handleProductSubmit} className="space-y-4 text-left">
                    
                    {/* Name Input */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Garment Title Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="Ex. Elite Silk Blend Tuxedo Saree"
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-semibold focus:outline-none focus:border-sky-400 focus:bg-white transition-all text-slate-800"
                      />
                    </div>

                    {/* Category Selection */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Gender Focus *</label>
                        <select
                          value={formCategory}
                          onChange={(e) => setFormCategory(e.target.value as any)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-2.5 text-xs font-bold text-slate-800 focus:outline-none"
                        >
                          <option value="Men">Men</option>
                          <option value="Women">Women</option>
                          <option value="Kids">Kids</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Subcategory *</label>
                        <select
                          value={formSubcategory}
                          onChange={(e) => setFormSubcategory(e.target.value as any)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-2.5 text-xs font-bold text-slate-800 focus:outline-none"
                        >
                          <option value="T-Shirts">T-Shirts</option>
                          <option value="Shirts">Shirts</option>
                          <option value="Jeans">Jeans</option>
                          <option value="Hoodies">Hoodies</option>
                          <option value="Jackets">Jackets</option>
                          <option value="Kurta">Kurta</option>
                          <option value="Saree">Saree</option>
                          <option value="Dress">Dress</option>
                          <option value="Footwear">Footwear</option>
                          <option value="Accessories">Accessories</option>
                        </select>
                      </div>
                    </div>

                    {/* Price and Original slash Price */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Retail Tag Price (₹) *</label>
                        <input
                          type="number"
                          required
                          placeholder="Ex. 1499"
                          value={formPrice}
                          onChange={(e) => setFormPrice(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-semibold focus:outline-none focus:border-sky-400 text-slate-800"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Original Slash Price (₹)</label>
                        <input
                          type="number"
                          placeholder="Ex. 2499"
                          value={formOriginalPrice}
                          onChange={(e) => setFormOriginalPrice(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-semibold focus:outline-none focus:border-sky-400 text-slate-800"
                        />
                      </div>
                    </div>

                    {/* Stock, badge and Specs */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="col-span-1 space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Stock Unit *</label>
                        <input
                          type="number"
                          required
                          value={formStock}
                          onChange={(e) => setFormStock(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-2 text-xs font-bold text-slate-800 focus:outline-none"
                        />
                      </div>

                      <div className="col-span-2 space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Badge Tag</label>
                        <input
                          type="text"
                          placeholder="Ex. 25% OFF, Best Seller"
                          value={formBadge}
                          onChange={(e) => setFormBadge(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-semibold text-slate-800 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Color specs and Size specs */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sizes (comma split)</label>
                        <input
                          type="text"
                          placeholder="S, M, L, XL"
                          value={formSizes}
                          onChange={(e) => setFormSizes(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-semibold text-slate-800 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Colors (comma split)</label>
                        <input
                          type="text"
                          placeholder="Black, Blue, Cream"
                          value={formColors}
                          onChange={(e) => setFormColors(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-semibold text-slate-800 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Main Description */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Material Specs & Info *</label>
                      <textarea
                        rows={3}
                        required
                        placeholder="Provide details about the premium fibers, sewing quality, and care instructions..."
                        value={formDescription}
                        onChange={(e) => setFormDescription(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-medium focus:outline-none text-slate-700"
                      />
                    </div>

                    {/* IMAGE FILE UPLOAD WITH DRAG-AND-DROP OR LINK */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Garment Image Showcase *</label>
                      
                      <div 
                        onDragEnter={handleDrag}
                        onDragOver={handleDrag}
                        onDragLeave={handleDrag}
                        onDrop={handleDrop}
                        onClick={triggerFileClick}
                        className={`w-full py-4 px-2 border-2 border-dashed rounded-2xl cursor-pointer flex flex-col items-center justify-center transition-all ${
                          dragActive 
                            ? 'bg-sky-50/50 border-sky-400' 
                            : 'bg-slate-50 hover:bg-slate-100/50 border-slate-200 hover:border-slate-350'
                        }`}
                      >
                        <Upload className="w-5 h-5 text-slate-400 mb-1.5" />
                        <span className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wide">Drag & Drop Image or Click</span>
                        <span className="text-[9px] text-slate-400 mt-0.5">Supports PNG, JPG, WEBP, or GIF</span>
                        <input 
                          type="file" 
                          ref={fileInputRef} 
                          onChange={handleFileSelect} 
                          className="hidden" 
                          accept="image/*"
                        />
                      </div>

                      {/* Display image preview to verify base-64 or preset loads */}
                      {formImages && (
                        <div className="flex items-center space-x-2.5 mt-2 p-2 bg-slate-50 border rounded-xl overflow-hidden">
                          <img src={formImages} alt="Upload preview" className="w-9 h-9 object-cover rounded-md shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="text-[10px] text-slate-400 uppercase font-black leading-none tracking-wider">Active Image URL/Pasted Base64</p>
                            <input 
                              type="text" 
                              required
                              value={formImages} 
                              onChange={(e) => setFormImages(e.target.value)}
                              className="w-full bg-transparent text-[10px] text-slate-500 font-mono truncate focus:outline-none border-b border-transparent focus:border-slate-300"
                            />
                          </div>
                        </div>
                      )}

                      {/* Professional presets quick picker */}
                      <div className="mt-2 space-y-1">
                        <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider block">Or click to apply an elegant template:</label>
                        <div className="flex flex-wrap gap-1.5">
                          {FASHION_PRESETS.map((p) => (
                            <button
                              key={p.title}
                              type="button"
                              onClick={() => {
                                setFormImages(p.url);
                                showNotification("success", `Applied preset image: ${p.title}`);
                              }}
                              className={`text-[9.5px] px-2 py-1 border rounded-lg transition-all font-bold ${
                                formImages === p.url 
                                  ? 'bg-slate-900 border-slate-900 text-white' 
                                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600'
                              }`}
                            >
                              {p.title}
                            </button>
                          ))}
                        </div>
                      </div>

                    </div>

                    {/* Submit layout control */}
                    <button
                      type="submit"
                      className="w-full mt-4 bg-slate-950 hover:bg-sky-500 text-white hover:text-[#070b19] font-black uppercase tracking-wider text-xs py-3 rounded-xl shadow-md cursor-pointer transition-all active:scale-98"
                    >
                      {formId ? "Save Style Updates" : "Publish to ShopSizzle"}
                    </button>

                  </form>
                </div>

                {/* 2. PRODUCT MANAGEMENT TABLE */}
                <div id="product-management-ledger" className="lg:col-span-7 bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4 text-left">
                  
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-slate-100 gap-3">
                    <h3 className="font-extrabold text-xs text-slate-850 uppercase tracking-widest">Active Garment Selections Ledger</h3>
                    
                    {/* Catalog search bar */}
                    <div className="relative max-w-xs w-full">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        placeholder="Search garments catalog..."
                        value={productSearch}
                        onChange={(e) => setProductSearch(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200/80 rounded-xl py-1.5 pl-8 pr-3 text-xs font-semibold focus:outline-none focus:bg-white text-slate-800"
                      />
                    </div>
                  </div>

                  <div className="max-h-[580px] overflow-y-auto pr-1">
                    <table className="w-full text-xs text-left text-slate-500 font-medium whitespace-nowrap">
                      <thead>
                        <tr className="border-b border-slate-150 py-2.5 text-[10px] uppercase font-black text-slate-400">
                          <th className="py-3">Option</th>
                          <th>Segment</th>
                          <th>Type</th>
                          <th>In Stock</th>
                          <th>Offers</th>
                          <th className="text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-sans">
                        {filteredProducts.map((p) => (
                          <tr key={p.id} className="hover:bg-slate-50/40">
                            
                            {/* Option thumbnail + title */}
                            <td className="py-2.5 font-bold text-slate-900 max-w-xs truncate flex items-center space-x-2">
                              {p.images && p.images[0] ? (
                                <img src={p.images[0]} alt="" className="w-7 h-7 object-cover rounded-lg shrink-0 border" />
                              ) : (
                                <div className="w-7 h-7 bg-slate-100 rounded-lg flex items-center justify-center shrink-0 border uppercase font-mono text-[9px] text-slate-400">NA</div>
                              )}
                              <span className="truncate">{p.name}</span>
                            </td>

                            <td className="py-2.5">{p.category}</td>
                            <td className="py-2.5">{p.subcategory}</td>
                            
                            <td className="py-2.5">
                              <span className={`font-mono font-bold ${p.stock <= 10 ? 'text-rose-600 animate-pulse' : 'text-slate-600'}`}>
                                {p.stock} units
                              </span>
                            </td>

                            <td className="font-mono font-bold text-slate-800">
                              ₹{p.price.toLocaleString()}
                            </td>

                            <td className="py-2.5 text-right space-x-1.5">
                              <button
                                onClick={() => handleEditProduct(p)}
                                className="bg-slate-100 hover:bg-sky-400/20 text-slate-900 px-2.5 py-1 text-[10px] font-extrabold rounded-lg transition-colors cursor-pointer"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(p.id, p.name)}
                                className="bg-rose-50 hover:bg-rose-100 text-rose-600 px-2.5 py-1 text-[10px] font-extrabold rounded-lg transition-colors cursor-pointer"
                              >
                                Delete
                              </button>
                            </td>

                          </tr>
                        ))}
                        {filteredProducts.length === 0 && (
                          <tr>
                            <td colSpan={6} className="text-center py-10 text-slate-400 font-bold uppercase text-[10px]">No garments options matched search values</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                </div>

              </div>
            )}

            {/* TAB 3: DISPATCH & SHIPMENTS PACK */}
            {activeTab === 'orders' && (
              <div id="order-dispatch-ledger" className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-sm space-y-5 text-left">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="font-extrabold text-xs text-slate-850 uppercase tracking-widest">Active Orders packing list & router</h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-slate-500 font-medium whitespace-nowrap">
                    <thead>
                      <tr className="border-b border-slate-150 py-3 text-[10px] uppercase font-black text-slate-400 text-left">
                        <th className="py-2.5">Shipment ID</th>
                        <th>Customer Shipping Details</th>
                        <th>Checkout Price</th>
                        <th>Payment Mode</th>
                        <th>Status Stage</th>
                        <th className="text-right">Administrative State Updates</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-sans">
                      {adminDashboardData.recentOrders?.map((ord: Order) => (
                        <tr key={ord.id} className="hover:bg-slate-50/40">
                          
                          <td className="py-3.5 font-bold text-slate-850">{ord.id}</td>
                          
                          <td className="py-3.5 max-w-xs truncate">
                            <p className="font-bold text-slate-850 inline">{ord.shippingAddress.fullName}</p> 
                            <span className="text-slate-400 mx-1">&bull;</span>
                            <span className="text-slate-500 text-[11px]">{ord.shippingAddress.address}, {ord.shippingAddress.city}</span>
                          </td>

                          <td className="py-3.5 font-mono font-bold text-slate-800">
                            ₹{ord.totalAmount.toLocaleString()}
                          </td>

                          <td className="py-3.5 text-slate-650 font-bold">{ord.paymentMethod}</td>
                          
                          <td className="py-3.5">
                            <span className={`px-2.5 py-0.5 rounded text-[9px] font-black uppercase ${
                              ord.orderStatus === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                              ord.orderStatus === 'Cancelled' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {ord.orderStatus}
                            </span>
                          </td>

                          <td className="py-3.5 text-right">
                            {ord.orderStatus !== 'Cancelled' && ord.orderStatus !== 'Delivered' ? (
                              <div className="inline-flex gap-1.5">
                                <button
                                  onClick={() => {
                                    adminUpdateOrderStatus(ord.id, "Processing");
                                    showNotification("success", `Shipment ${ord.id} marked as Processing`);
                                  }}
                                  className="bg-slate-100 hover:bg-sky-100 text-slate-800 px-2.5 py-1 text-[10px] font-black rounded-lg transition-all"
                                >
                                  Sort Pack
                                </button>
                                <button
                                  onClick={() => {
                                    adminUpdateOrderStatus(ord.id, "Shipped");
                                    showNotification("success", `Shipment ${ord.id} marked as Shipped`);
                                  }}
                                  className="bg-slate-100 hover:bg-indigo-100 text-slate-800 px-2.5 py-1 text-[10px] font-black rounded-lg transition-all"
                                >
                                  Dispatch Route
                                </button>
                                <button
                                  onClick={() => {
                                    adminUpdateOrderStatus(ord.id, "Delivered");
                                    showNotification("success", `Shipment ${ord.id} marked as Delivered`);
                                  }}
                                  className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 px-2.5 py-1 text-[10px] font-black rounded-lg transition-all"
                                >
                                  Deliver
                                </button>
                              </div>
                            ) : (
                              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">No Pending States</span>
                            )}
                          </td>

                        </tr>
                      ))}
                      {(!adminDashboardData.recentOrders || adminDashboardData.recentOrders.length === 0) && (
                        <tr>
                          <td colSpan={6} className="text-center py-10 font-bold uppercase text-slate-400 text-[10px]">No active dispatch tickets available</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 4: CUSTOMERS REGISTER LEDGER */}
            {activeTab === 'customers' && (
              <div id="customers-register-ledger" className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-sm space-y-5 text-left">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="font-extrabold text-xs text-slate-850 uppercase tracking-widest">Active Customer Accounts Ledger</h3>
                </div>

                {customersLoading ? (
                  <div className="text-center py-10 space-y-2">
                    <div className="w-8 h-8 rounded-full border-2 border-sky-450 border-t-transparent animate-spin mx-auto" />
                    <p className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Bypassing local data pipelines...</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-slate-500 font-medium whitespace-nowrap">
                      <thead>
                        <tr className="border-b border-slate-150 py-3 text-[10px] uppercase font-black text-slate-400 text-left">
                          <th className="py-2.5">User Hash ID</th>
                          <th>Full Name</th>
                          <th>Email Address</th>
                          <th>Contact Phone</th>
                          <th>Role Permission</th>
                          <th>Main Checkout Address</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-sans">
                        {customers.map((c) => {
                          const primaryAddress = c.addresses && c.addresses[0] 
                            ? `${c.addresses[0].address}, ${c.addresses[0].city}, ${c.addresses[0].state}`
                            : "Not updated";
                          return (
                            <tr key={c.id} className="hover:bg-slate-50/40">
                              
                              <td className="py-3 font-bold text-slate-800">{c.id}</td>
                              
                              <td className="py-3 font-bold text-slate-850">{c.fullName}</td>
                              
                              <td className="py-3 text-slate-650">{c.email}</td>
                              
                              <td className="py-3 font-mono">{c.phoneNumber || "N/A"}</td>
                              
                              <td className="py-3">
                                {c.isAdmin ? (
                                  <span className="bg-purple-100 border border-purple-200 text-purple-700 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider">SYSTEM ADMIN</span>
                                ) : (
                                  <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider">STANDARD USER</span>
                                )}
                              </td>

                              <td className="py-3 max-w-xs truncate text-[11px] text-slate-500" title={primaryAddress}>
                                {primaryAddress}
                              </td>

                            </tr>
                          );
                        })}
                        {customers.length === 0 && (
                          <tr>
                            <td colSpan={6} className="text-center py-10 font-bold uppercase text-slate-400 text-[10px]">No customer logs retrieved from datastore</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

          </div>
        )}

      </main>

    </div>
  );
}
