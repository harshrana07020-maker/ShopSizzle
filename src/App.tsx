import React, { useState, useEffect } from "react";
import { ShopProvider, useShop } from "./context/ShopContext";
import { Header } from "./components/Header";
import { HeroCarousel } from "./components/HeroCarousel";
import { AiStylistMatches } from "./components/AiStylistMatches";
import { FiltersSidebar } from "./components/FiltersSidebar";
import { ProductCard } from "./components/ProductCard";
import { AdminDashboard } from "./components/AdminDashboard";
import {
  Heart,
  Star,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  CheckCircle,
  Clock,
  Truck,
  PackageCheck,
  User,
  MapPin,
  TrendingUp,
  AlertTriangle,
  FileCheck,
  Languages,
  DollarSign,
  Calendar,
  X,
  CreditCard,
  QrCode,
  Sparkles,
  Eye,
  EyeOff,
  ArrowLeft,
  Maximize2
} from "lucide-react";

// Wrap core App body in ShopProvider to enable full state matching
export default function App() {
  return (
    <ShopProvider>
      <AppBody />
    </ShopProvider>
  );
}

// Inner App Body with screen router selectors
function AppBody() {
  const { currentPage, setPage, t } = useShop();

  return (
    <div className="min-h-screen bg-[#FCFCFD] font-sans antialiased flex flex-col justify-between text-[#1E293B]">
      
      {/* 1. Header Navigation brand bar */}
      <Header />

      {/* 2. Main screen view selectors */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentPage === "home" && <HomeScreen />}
        {currentPage === "product-detail" && <ProductDetailScreen />}
        {currentPage === "cart" && <CartScreen />}
        {currentPage === "checkout" && <CheckoutScreen />}
        {currentPage === "orders" && <OrdersScreen />}
        {currentPage === "admin" && <AdminScreen />}
        {currentPage === "auth" && <AuthScreen />}
        {currentPage === "wishlist" && <WishlistScreen />}
      </main>

      {/* 3. Luxury professional Footer */}
      <Footer />
    </div>
  );
}

// ==========================================
// A. HOME SCREEN LAYOUT
// ==========================================
function HomeScreen() {
  const { products, collectionImageFit, setCollectionImageFit, t } = useShop();

  return (
    <div id="screen-home" className="space-y-8 animate-fade-in">
      
      {/* Premium Hero sliders banner */}
      <HeroCarousel />

      {/* Inteligent Gemini-powered Stylist Panel */}
      <AiStylistMatches />

      {/* Main product listings with sidebar filtering bento */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left filter options sidebar */}
        <div className="lg:col-span-1">
          <FiltersSidebar />
        </div>

        {/* Right active catalog items gridding */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-3">
            <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center space-x-2">
              <span className="w-1 h-5 bg-slate-950 rounded-full inline-block"></span>
              <span>CURATED COLLECTIONS</span>
              <span className="text-[10px] text-slate-400 font-mono font-bold bg-slate-100 py-0.5 px-2 rounded-full">
                {products.length} ITEMS
              </span>
            </h2>

            {/* Collection Image Fit Switch */}
            <div className="flex items-center gap-2 self-start sm:self-auto bg-slate-100 p-1 rounded-xl border border-slate-200">
              <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider pl-2 pr-1">Image Grid:</span>
              <button
                type="button"
                onClick={() => setCollectionImageFit('cover')}
                className={`text-[9px] font-black uppercase tracking-widest py-1.5 px-3 rounded-lg transition-all ${
                  collectionImageFit === 'cover'
                    ? 'bg-white text-[#0F172A] shadow-sm font-black'
                    : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                Fill (Cover)
              </button>
              <button
                type="button"
                onClick={() => setCollectionImageFit('contain')}
                className={`text-[9px] font-black uppercase tracking-widest py-1.5 px-3 rounded-lg transition-all ${
                  collectionImageFit === 'contain'
                    ? 'bg-white text-[#0F172A] shadow-sm font-black'
                    : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                Fit (Contain)
              </button>
            </div>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="bg-white border border-dashed border-slate-300 rounded-3xl p-12 text-center space-y-3">
              <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
              <h3 className="font-extrabold text-sm text-slate-800 uppercase">No Matches Found</h3>
              <p className="text-xs text-slate-500">Try adjusting your filters, price sliders or categories match.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}

// ==========================================
// B. PRODUCT DETAILS SCREEN (REVIEWS & RATINGS LOGS)
// ==========================================
function ProductDetailScreen() {
  const { currentProduct, addToCart, submitReview, toggleWishlist, wishlist, t, setPage } = useShop();
  
  if (!currentProduct) {
    return (
      <div className="text-center py-20 bg-white border border-slate-200 rounded-3xl">
        <p className="text-slate-500 text-sm">Please select a product from home catalog to inspect details.</p>
        <button onClick={() => setPage("home")} className="mt-4 bg-[#0F172A] text-white px-5 py-2 rounded-xl text-xs font-bold text-center">Back Home</button>
      </div>
    );
  }

  const isLiked = wishlist.some(item => item.id === currentProduct.id);

  const [activeImage, setActiveImage] = useState(currentProduct.images[0]);
  const [selectedSize, setSelectedSize] = useState(currentProduct.sizes[0] || "M");
  const [selectedColor, setSelectedColor] = useState(currentProduct.colors[0] || "Standard");
  const [quantity, setQuantity] = useState(1);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [addedToBagToast, setAddedToBagToast] = useState(false);
  const [imageFit, setImageFit] = useState<'cover' | 'contain'>('cover');
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Set first image as default on products swaps
  useEffect(() => {
    setActiveImage(currentProduct.images[0]);
    setSelectedSize(currentProduct.sizes[0] || "M");
    setSelectedColor(currentProduct.colors[0] || "Standard");
    setQuantity(1);
    setImageFit('cover');
    setIsLightboxOpen(false);
  }, [currentProduct.id]);

  const handleAddToBag = () => {
    addToCart(currentProduct.id, quantity, selectedColor, selectedSize);
    setAddedToBagToast(true);
    setTimeout(() => setAddedToBagToast(false), 3000);
  };

  const handleBuyNow = () => {
    addToCart(currentProduct.id, quantity, selectedColor, selectedSize);
    setPage("cart");
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    const ok = await submitReview(currentProduct.id, reviewRating, reviewComment);
    if (ok) {
      setReviewComment("");
      setReviewSuccess(true);
      setTimeout(() => setReviewSuccess(false), 3000);
    }
  };

  return (
    <div id="screen-product-detail" className="relative bg-white border border-slate-150 rounded-2xl p-6 sm:p-8 space-y-8 animate-fade-in">
      
      {/* Navigation back header row */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <button
          onClick={() => setPage("home")}
          className="group flex items-center space-x-2 text-xs font-black text-slate-500 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-150 py-2.5 px-4 rounded-xl transition-all"
        >
          <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-0.5 transition-transform" />
          <span className="uppercase tracking-wider">Back to Collections</span>
        </button>
      </div>

      {addedToBagToast && (
        <div className="fixed bottom-8 right-8 z-50 bg-slate-900 border border-slate-800 text-white rounded-xl shadow-2xl py-3 px-5 flex items-center space-x-3 animate-fade-in">
          <CheckCircle className="w-4.5 h-4.5 text-emerald-400" />
          <span className="text-xs font-black uppercase tracking-wider">{t.addedToBag}</span>
        </div>
      )}
      
      {/* 1. Main visual specifications area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        
        {/* Left: Interactive Multi-Image zoom preview gallery */}
        <div className="space-y-4">
          <div className="relative h-96 sm:h-[450px] w-full rounded-2xl overflow-hidden bg-slate-50 border border-slate-200 group">
            <img 
              src={activeImage} 
              alt={currentProduct.name} 
              className={`w-full h-full object-center transition-all duration-300 ${
                imageFit === 'cover' ? 'object-cover' : 'object-contain'
              }`} 
            />

            {/* Image fit control switch banner */}
            <div className="absolute top-4 left-4 flex gap-1.5 z-20">
              <button
                type="button"
                onClick={() => setImageFit('cover')}
                className={`text-[9px] font-black uppercase tracking-widest py-1.5 px-3 rounded-xl shadow-md border transition-all ${
                  imageFit === 'cover' 
                    ? 'bg-slate-900 border-slate-900 text-white' 
                    : 'bg-white hover:bg-slate-50 border-slate-100 text-slate-500'
                }`}
              >
                Fill Image
              </button>
              <button
                type="button"
                onClick={() => setImageFit('contain')}
                className={`text-[9px] font-black uppercase tracking-widest py-1.5 px-3 rounded-xl shadow-md border transition-all ${
                  imageFit === 'contain' 
                    ? 'bg-slate-900 border-slate-900 text-white' 
                    : 'bg-white hover:bg-slate-50 border-slate-100 text-slate-500'
                }`}
              >
                Fit Image
              </button>
            </div>

            {/* Click to expand lightbox trigger button */}
            <button
              type="button"
              onClick={() => setIsLightboxOpen(true)}
              className="absolute bottom-4 right-4 p-2.5 bg-white/90 backdrop-blur-md rounded-xl text-slate-700 border border-slate-150 shadow-md hover:bg-white transition-all hover:scale-105 active:scale-95"
              title="Expand garment image"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          <div className="flex space-x-3 overflow-x-auto pb-1">
            {currentProduct.images.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveImage(img)}
                className={`w-20 h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                  activeImage === img ? "border-[#38BDF8] scale-105" : "border-slate-200 opacity-80 hover:opacity-100"
                }`}
              >
                <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Full-Screen Lightbox Modal popup */}
        {isLightboxOpen && (
          <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex flex-col items-center justify-center p-4">
            <button 
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-6 right-6 text-white hover:text-slate-300 bg-slate-900/80 p-3 rounded-full border border-slate-800 transition-all shadow-lg hover:scale-105 active:scale-95"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="relative max-w-4xl max-h-[85vh] overflow-hidden rounded-2xl bg-slate-950 flex items-center justify-center border border-slate-800 p-2 shadow-2xl">
              <img 
                src={activeImage} 
                alt={currentProduct.name} 
                className="max-w-full max-h-[80vh] object-contain rounded-lg"
              />
            </div>
            
            <div className="mt-5 text-center text-white space-y-1">
              <h3 className="text-sm font-black uppercase tracking-widest text-[#38BDF8]">{currentProduct.name}</h3>
              <p className="text-[10px] uppercase font-black tracking-wider text-slate-400 bg-slate-900/60 px-3 py-1.5 rounded-full inline-block border border-slate-800">
                Expanded Wear Showcase &bull; 100% Filled View
              </p>
            </div>
          </div>
        )}

        {/* Right: Premium selection specifications panel */}
        <div className="space-y-6 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <span className="bg-[#0F172A] text-white text-[9px] font-black tracking-widest px-2.5 py-1 rounded-full uppercase">
                {currentProduct.category}
              </span>
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                {currentProduct.subcategory}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 leading-tight">
              {currentProduct.name}
            </h1>

            {/* Star metrics display */}
            <div className="flex items-center space-x-3 border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-1 bg-amber-50 border border-amber-200 py-1 px-2.5 rounded-lg">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span className="text-xs font-black text-amber-700">{currentProduct.rating}</span>
              </div>
              <span className="text-xs font-semibold text-slate-400">
                Sorted by {currentProduct.reviewsCount} Buyer Reviews
              </span>
            </div>

            {/* Price tag with cashbacks */}
            <div className="space-y-1">
              <div className="flex items-baseline space-x-3">
                <span className="text-3xl font-black text-[#0F172A]">₹{currentProduct.price}</span>
                <span className="text-slate-400 line-through text-sm">₹{currentProduct.originalPrice}</span>
                <span className="text-emerald-600 font-bold text-xs bg-emerald-50 px-2.5 py-0.5 rounded-full">
                  Save ₹{currentProduct.originalPrice - currentProduct.price}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-semibold tracking-wide">Inclusive of all local manufacturing taxes & CGST.</p>
            </div>

            <div className="border-t border-slate-100 pt-3">
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {currentProduct.description}
              </p>
            </div>
          </div>

          <div className="space-y-5 pt-3">
            {/* Color Swatch selections */}
            <div className="space-y-2">
              <span className="text-xs font-black uppercase tracking-widest text-slate-400">Choose Shades</span>
              <div className="flex items-center space-x-2">
                {currentProduct.colors.map(col => {
                  const isS = selectedColor === col;
                  return (
                    <button
                      key={col}
                      onClick={() => setSelectedColor(col)}
                      className={`text-xs font-bold py-1.5 px-3.5 rounded-full border transition-all duration-200 ${
                        isS 
                          ? "bg-[#0F172A] border-[#0F172A] text-white" 
                          : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      {col}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Size Grid selections */}
            <div className="space-y-2">
              <span className="text-xs font-black uppercase tracking-widest text-slate-400">Available Sizing</span>
              <div className="flex items-center space-x-2">
                {currentProduct.sizes.map(sz => {
                  const isS = selectedSize === sz;
                  return (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`w-11 h-11 rounded-xl text-xs font-extrabold border transition-all duration-200 flex items-center justify-center ${
                        isS
                          ? "bg-[#38BDF8] border-[#38BDF8] text-[#0F172A]"
                          : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      {sz}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity select counter */}
            <div className="flex items-center space-x-3">
              <span className="text-xs font-black uppercase tracking-widest text-slate-400">Bag Qty:</span>
              <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  className="bg-white hover:bg-slate-50 p-1.5 rounded-lg text-slate-600 transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-xs font-extrabold w-8 text-center font-mono">{quantity}</span>
                <button
                  onClick={() => setQuantity(prev => prev + 1)}
                  className="bg-white hover:bg-slate-50 p-1.5 rounded-lg text-slate-600 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Main Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-3">
              <button
                onClick={handleAddToBag}
                className="flex-[2] bg-slate-900 hover:bg-[#38BDF8] hover:text-slate-900 text-white font-extrabold py-3.5 rounded-xl text-center text-sm shadow-md transition-all uppercase tracking-wider"
              >
                {t.addToCart}
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-[2] bg-[#38BDF8] hover:bg-[#38BDF8]/90 text-[#0F172A] font-extrabold py-3.5 rounded-xl text-center text-sm shadow-md transition-all uppercase tracking-wider"
              >
                {t.buyNow}
              </button>
              <button
                onClick={() => toggleWishlist(currentProduct.id)}
                className={`flex-1 flex items-center justify-center p-3 rounded-xl border shadow-md transition-all duration-300 ${
                  isLiked
                    ? "bg-rose-50 border-rose-200 text-rose-500"
                    : "bg-white hover:bg-slate-50 border-slate-200 text-slate-400 hover:text-rose-500"
                }`}
                title={isLiked ? "Remove from Wishlist" : "Add to Wishlist"}
              >
                <Heart className={`w-5 h-5 ${isLiked ? "fill-rose-500 text-rose-500" : ""}`} />
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* 2. Customer Reviews logs (Read / Write interaction) */}
      <div className="border-t border-slate-200 pt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Logged Customer honest reviews lists */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-lg font-extrabold text-slate-800 uppercase tracking-tight flex items-center space-x-2">
            <span>Verified Customer Testimonials</span>
            <span className="bg-slate-100 text-slate-500 font-mono text-xs font-bold py-0.5 px-2.5 rounded-full">
              {(currentProduct as any).reviews?.length || 0}
            </span>
          </h3>

          <div className="space-y-4">
            {(currentProduct as any).reviews && (currentProduct as any).reviews.length > 0 ? (
              (currentProduct as any).reviews.map((r: any) => (
                <div key={r.id} className="bg-slate-50/70 border border-slate-100 rounded-2xl p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="bg-slate-300 text-slate-600 w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs uppercase">
                        {r.userName.substring(0, 1)}
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-800 leading-none">{r.userName}</p>
                        <span className="text-[9px] text-slate-400 font-mono mt-0.5 inline-block">
                          {new Date(r.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    {/* Stars line */}
                    <div className="flex items-center space-x-0.5">
                      {[1, 2, 3, 4, 5].map((st) => (
                        <Star
                          key={st}
                          className={`w-3 h-3 ${st <= r.rating ? "text-amber-400 fill-amber-400" : "text-slate-200"}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {r.comment}
                  </p>
                </div>
              ))
            ) : (
              <div className="bg-slate-50 border border-dashed rounded-2xl p-8 text-center text-slate-400 text-xs">
                No local reviews submitted for this specific style option yet. Be the first to share your thoughts!
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Submission review rating form */}
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 sm:p-6 space-y-4 h-fit">
          <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-tight">Write Buyer Evaluation</h3>
          
          {reviewSuccess && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold py-3 px-4 rounded-xl flex items-center space-x-2">
              <CheckCircle className="w-4.5 h-4.5" />
              <span>Sensing details synced to active database successfully.</span>
            </div>
          )}

          <form onSubmit={handleReviewSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400">Score Metrics</label>
              <div className="flex items-center space-x-1.5">
                {[1, 2, 3, 4, 5].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setReviewRating(st)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-6 h-6 ${st <= reviewRating ? "text-amber-400 fill-amber-400" : "text-slate-300"}`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400">Honest Review Comments</label>
              <textarea
                rows={4}
                required
                placeholder="Ex. Color depth details, fit metrics comfort, material texture, wash quality etc."
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-xs font-medium placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#38BDF8]"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-[#38BDF8] text-white hover:text-slate-900 font-extrabold py-2.5 rounded-xl text-xs transition-colors tracking-wide uppercase"
            >
              Submit Verification
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}

// ==========================================
// C. CART SCREEN (QUANTITIES MODIFIERS & TAX RECEIPTS)
// ==========================================
function CartScreen() {
  const { cart, updateCartQty, removeFromCart, toggleWishlist, wishlist, t, setPage } = useShop();

  const cartSubtotal = cart.reduce((acc, c) => acc + (c.product.price * c.quantity), 0);
  const gstTaxAmt = Math.round(cartSubtotal * 0.12); // 12% GST standard
  const actualPayTotal = cartSubtotal > 0 ? (cartSubtotal + gstTaxAmt) : 0;

  if (cart.length === 0) {
    return (
      <div id="screen-cart-empty" className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-4 max-w-lg mx-auto py-16">
        <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-inner text-slate-400">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-xl font-extrabold text-slate-800 tracking-tight uppercase">Bag is Waiting</h2>
        <p className="text-sm text-slate-500 leading-relaxed">
          {t.emptyCart}. Check latest styles added to Men's, Women's and Kids catalog segments.
        </p>
        <button
          onClick={() => setPage("home")}
          className="bg-[#0F172A] hover:bg-[#38BDF8] text-white hover:text-[#0F172A] font-extrabold py-3 px-6 rounded-xl text-xs transition-all tracking-wider uppercase inline-block"
        >
          Discover Fashion
        </button>
      </div>
    );
  }

  return (
    <div id="screen-cart" className="space-y-6 animate-fade-in">
      <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
          {t.cart} ({cart.length} unique style lines)
        </h1>
        <button
          onClick={() => setPage("home")}
          className="group flex items-center space-x-1.5 px-3.5 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-150 rounded-xl text-xs font-black text-slate-500 hover:text-slate-900 transition-all self-start sm:self-auto"
        >
          <ArrowLeft className="w-3.5 h-3.5 transform group-hover:-translate-x-0.5 transition-transform" />
          <span className="uppercase tracking-wider">Back to Collections</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Cart items list rows */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item, idx) => (
            <div
              key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}`}
              className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 flex items-center justify-between space-x-4 shadow-sm"
            >
              <div className="flex items-center space-x-4">
                <div className="w-20 h-24 rounded-lg overflow-hidden bg-slate-50 border border-slate-100 flex-shrink-0">
                  <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-extrabold text-[#0F172A] text-sm sm:text-base leading-snug line-clamp-1">
                    {item.product.name}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">
                    Size: <span className="text-[#0F172A]">{item.selectedSize}</span> &bull; Color: <span className="text-[#0F172A]">{item.selectedColor}</span>
                  </p>
                  <p className="font-extrabold text-[#0F172A] text-sm mt-1.5 font-mono">
                    ₹{item.product.price}
                  </p>
                </div>
              </div>

              {/* Adjust quantifiers or remove buttons */}
              <div className="flex flex-col sm:flex-row items-center sm:space-x-4 space-y-2 sm:space-y-0">
                <div className="flex items-center space-x-1.5 bg-slate-50 p-1 rounded-xl border border-slate-200/50">
                  <button
                    onClick={() => updateCartQty(item.product.id, item.selectedColor, item.selectedSize, item.quantity - 1)}
                    className="p-1 hover:bg-slate-200 rounded text-slate-600 transition-all"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-xs font-black font-mono w-6 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateCartQty(item.product.id, item.selectedColor, item.selectedSize, item.quantity + 1)}
                    className="p-1 hover:bg-slate-200 rounded text-slate-600 transition-all"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                <button
                  onClick={async () => {
                    const isAlreadyLiked = wishlist.some((w) => w.id === item.product.id);
                    if (!isAlreadyLiked) {
                      await toggleWishlist(item.product.id);
                    }
                    await removeFromCart(item.product.id, item.selectedColor, item.selectedSize);
                  }}
                  className="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-xl transition-all"
                  title="Move to Wishlist"
                >
                  <Heart className="w-4.5 h-4.5 text-rose-400 fill-rose-500/20" />
                </button>

                <button
                  onClick={() => removeFromCart(item.product.id, item.selectedColor, item.selectedSize)}
                  className="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-xl transition-all"
                  title="Delete from Bag"
                >
                  <Trash2 className="w-4.5 h-4.5" />
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* Right: Payment receipt billing parameters */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm space-y-6 h-fit">
          <h3 className="text-base font-extrabold text-slate-800 uppercase tracking-tight">{t.orderSummary}</h3>

          <div className="space-y-3 font-medium text-xs border-b border-slate-100 pb-4">
            <div className="flex justify-between text-slate-500">
              <span>Checkout Subtotal</span>
              <span className="font-mono text-slate-800">₹{cartSubtotal}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>12% CGST & SGST Taxes</span>
              <span className="font-mono text-slate-800">₹{gstTaxAmt}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Shipment Courier charges</span>
              <span className="text-emerald-600 font-extrabold uppercase">FREE DELIVERY</span>
            </div>
          </div>

          <div className="flex items-center justify-between pb-2">
            <span className="font-extrabold text-slate-800 text-sm sm:text-base">Aggregated To Pay</span>
            <span className="font-black text-slate-900 font-mono text-lg sm:text-xl">
              ₹{actualPayTotal}
            </span>
          </div>

          <button
            onClick={() => setPage("checkout")}
            className="w-full bg-[#0F172A] hover:bg-[#38BDF8] hover:text-[#0F172A] text-white font-extrabold py-3.5 rounded-xl text-center text-sm shadow-md transition-all uppercase tracking-wider"
          >
            {t.checkout}
          </button>
        </div>

      </div>

    </div>
  );
}

// ==========================================
// D. CHECKOUT SCREEN (SHIPPING & PAYMENT INTEGRATION)
// ==========================================
function CheckoutScreen() {
  const { user, cart, placeOrder, t, setPage, setViewingOrderId } = useShop();

  const cartSubtotal = cart.reduce((acc, c) => acc + (c.product.price * c.quantity), 0);
  const gstTaxAmt = Math.round(cartSubtotal * 0.12);
  const actualPayTotal = cartSubtotal + gstTaxAmt;

  const [fullName, setFullName] = useState(user?.fullName || "");
  const [email, setEmail] = useState(user?.email || "pr0596793@gmail.com");
  const [phone, setPhone] = useState(user?.phoneNumber || "");
  const [showEmail, setShowEmail] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [address, setAddress] = useState("");
  const [state, setState] = useState("Gujarat");
  const [city, setCity] = useState("Ahmedabad");
  const [pinCode, setPinCode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'UPI' | 'NetBanking'>("COD");
  
  // Checkout Success / tracking states
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState("");

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutError("");

    if (!fullName || !email || !phone || !address || !pinCode) {
      setCheckoutError("Please fill in all shipping fields correctly.");
      return;
    }

    const shippingAddress = { fullName, email, phoneNumber: phone, address, state, city, pinCode };
    const orderId = await placeOrder(shippingAddress, paymentMethod);

    if (orderId) {
      setCreatedOrderId(orderId);
    } else {
      setCheckoutError("Checkout failed. Check stock margins.");
    }
  };

  if (createdOrderId) {
    return (
      <div id="screen-checkout-success" className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 text-center max-w-xl mx-auto py-16 space-y-6 shadow-md animate-fade-in">
        <div className="bg-emerald-50 text-emerald-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-md">
          <CheckCircle className="w-12 h-12" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">{t.ordersuccess}</h2>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Your premium fashion booking is successfully processed and registered with our shipping networks.
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl max-w-xs mx-auto font-mono text-center">
          <p className="text-[10px] text-slate-400 font-bold uppercase">{t.ordernumber}</p>
          <p className="text-base font-extrabold text-[#0F172A] tracking-wider mt-1">{createdOrderId}</p>
        </div>

        <div className="flex gap-3 justify-center max-w-xs mx-auto pt-3">
          <button
            onClick={() => {
              setViewingOrderId(createdOrderId);
              setPage("orders");
            }}
            className="flex-1 bg-[#38BDF8] text-[#0F172A] font-extrabold py-3 px-4 rounded-xl text-xs uppercase tracking-wide shadow-md"
          >
            {t.trackOrder}
          </button>
          <button
            onClick={() => {
              setPage("home");
            }}
            className="flex-1 bg-slate-900 text-white font-extrabold py-3 px-4 rounded-xl text-xs uppercase tracking-wide shadow-md"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div id="screen-checkout" className="space-y-6 animate-fade-in">
      <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Secure Shipping Checkout</h1>
        <button
          onClick={() => setPage("cart")}
          className="group flex items-center space-x-1.5 px-3.5 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-150 rounded-xl text-xs font-black text-slate-500 hover:text-slate-900 transition-all self-start sm:self-auto"
        >
          <ArrowLeft className="w-3.5 h-3.5 transform group-hover:-translate-x-0.5 transition-transform" />
          <span className="uppercase tracking-wider">Back to Bag</span>
        </button>
      </div>

      {checkoutError && (
        <div className="bg-rose-50 border border-rose-150 text-rose-800 text-xs font-bold p-4 rounded-xl flex items-center space-x-2 animate-fade-in">
          <AlertTriangle className="w-4 h-4 text-rose-500" />
          <span>{checkoutError}</span>
        </div>
      )}

      <form onSubmit={handleCheckoutSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left & Middle: Address parameters forms */}
        <div className="lg:col-span-2 space-y-6 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <h3 className="text-base font-extrabold text-slate-800 uppercase tracking-tight flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-[#38BDF8]" />
            <span>Enter Shipping Destination</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400">Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your Name"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#38BDF8]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400">Email Address</label>
              <div className="relative">
                <input
                  type={showEmail ? "email" : "password"}
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-3 pr-10 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#38BDF8]"
                />
                <button
                  type="button"
                  onClick={() => setShowEmail(!showEmail)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition-colors"
                  title={showEmail ? "Hide email" : "Show email"}
                >
                  {showEmail ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400">10-Digit Mobile Number</label>
              <div className="relative">
                <input
                  type={showPhone ? "tel" : "password"}
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Ex. 9876543210"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-3 pr-10 text-xs font-semibold focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPhone(!showPhone)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition-colors"
                  title={showPhone ? "Hide phone" : "Show phone"}
                >
                  {showPhone ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400">6-Digit PIN Code</label>
              <input
                type="text"
                required
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value)}
                placeholder="Ex. 380009"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-semibold focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400">Street / Flat Address Detail</label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Ex. 404 Room, Elegance Avenue, CG Road"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-semibold focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400">City / Town Name</label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-semibold focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400">State Country</label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-semibold focus:outline-none"
              >
                <option value="Gujarat">Gujarat</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Delhi">Delhi</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Rajasthan">Rajasthan</option>
              </select>
            </div>

          </div>

          {/* Payment Gateways selection panels */}
          <div className="border-t border-slate-100 pt-6 space-y-4">
            <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-tight flex items-center space-x-2">
              <CreditCard className="w-4.5 h-4.5 text-[#38BDF8]" />
              <span>{t.paymentMethods}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              
              <div
                onClick={() => setPaymentMethod("COD")}
                className={`cursor-pointer border-2 p-4 rounded-2xl flex flex-col items-center justify-center space-y-2 text-center transition-all ${
                  paymentMethod === "COD" ? "bg-[#38BDF8]/10 border-[#38BDF8] text-[#0F172A]" : "border-slate-200 hover:bg-slate-50 text-slate-500"
                }`}
              >
                <DollarSign className="w-6 h-6" />
                <span className="text-xs font-extrabold">COD Route</span>
                <p className="text-[10px] text-slate-400 leading-none">Cash/UPI on home delivery</p>
              </div>

              <div
                onClick={() => setPaymentMethod("UPI")}
                className={`cursor-pointer border-2 p-4 rounded-2xl flex flex-col items-center justify-center space-y-2 text-center transition-all ${
                  paymentMethod === "UPI" ? "bg-[#38BDF8]/10 border-[#38BDF8] text-[#0F172A]" : "border-slate-200 hover:bg-slate-50 text-slate-500"
                }`}
              >
                <QrCode className="w-6 h-6" />
                <span className="text-xs font-extrabold">UPI QR Scan</span>
                <p className="text-[10px] text-slate-400 leading-none">Instant secure UPI pay</p>
              </div>

              <div
                onClick={() => setPaymentMethod("NetBanking")}
                className={`cursor-pointer border-2 p-4 rounded-2xl flex flex-col items-center justify-center space-y-2 text-center transition-all ${
                  paymentMethod === "NetBanking" ? "bg-[#38BDF8]/10 border-[#38BDF8] text-[#0F172A]" : "border-slate-200 hover:bg-slate-50 text-slate-500"
                }`}
              >
                <CreditCard className="w-6 h-6" />
                <span className="text-xs font-extrabold">Net Banking</span>
                <p className="text-[10px] text-slate-400 leading-none">Bypass direct card routing</p>
              </div>

            </div>

            {/* Simulated UPI Scan code panel */}
            {paymentMethod === "UPI" && (
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex items-center justify-center space-x-4 max-w-md mx-auto animate-fade-in">
                <div className="bg-white border border-slate-200 p-2 rounded-xl">
                  {/* Dynamic clean mock QR representation */}
                  <div className="w-20 h-20 bg-gradient-to-tr from-slate-900 to-[#38BDF8] flex items-center justify-center rounded">
                    <QrCode className="w-12 h-12 text-white" />
                  </div>
                </div>
                <div>
                  <span className="text-[9px] font-black text-[#38BDF8] uppercase tracking-widest bg-[#38BDF8]/10 px-2 py-0.5 rounded-full">Test Mode GPay/UPI</span>
                  <p className="font-extrabold text-[#0F172A] text-sm mt-1">Pay to: shopsizzle@upi</p>
                  <p className="text-[11px] text-slate-400 leading-snug mt-1">Please scan or proceed. System automatically authorizes test pay elements.</p>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Right: Payment receipt parameters values */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm space-y-6 h-fit">
          <h3 className="text-base font-extrabold text-slate-800 uppercase tracking-tight">Checkout Summary</h3>

          <div className="space-y-3 font-medium text-xs border-b border-slate-100 pb-4 text-slate-500">
            <div className="flex justify-between">
              <span>Items Total Amount</span>
              <span className="font-mono text-slate-800">₹{cartSubtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Taxes 12% GST</span>
              <span className="font-mono text-slate-800">₹{gstTaxAmt}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Cost</span>
              <span className="text-emerald-500 font-extrabold">FREE</span>
            </div>
          </div>

          <div className="flex items-center justify-between pb-2">
            <span className="font-extrabold text-slate-800 text-sm">To Pay</span>
            <span className="font-black text-slate-900 font-mono text-lg">
              ₹{actualPayTotal}
            </span>
          </div>

          <button
            type="submit"
            className="w-full bg-slate-900 hover:bg-[#38BDF8] hover:text-slate-900 text-white font-extrabold py-3.5 rounded-xl text-center text-sm shadow-md transition-all uppercase tracking-wider"
          >
            {t.placeOrder} &bull; ₹{actualPayTotal}
          </button>
        </div>

      </form>
    </div>
  );
}

// ==========================================
// E. ORDERS SCREEN (TRACK TRACKING STATUS PROGRESS & CANCELLATIONS)
// ==========================================
function OrdersScreen() {
  const { orders, cancelOrder, viewingOrderId, setViewingOrderId, t, setPage } = useShop();

  if (orders.length === 0) {
    return (
      <div id="screen-orders-empty" className="bg-white border border-slate-200 rounded-3xl p-12 text-center max-w-md mx-auto py-16 space-y-4">
        <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto text-slate-400">
          <Clock className="w-10 h-10" />
        </div>
        <h2 className="text-xl font-extrabold text-slate-800 uppercase tracking-tight">No Purchases Yet</h2>
        <p className="text-xs text-slate-500">Check standard catalogs or perform checkouts to view order track routes.</p>
        <button onClick={() => setPage("home")} className="bg-[#0F172A] text-white py-2.5 px-5 text-xs font-bold rounded-xl mt-2">Discover Styles</button>
      </div>
    );
  }

  // Active track order
  const activeTrackOrder = orders.find(o => o.id === viewingOrderId) || orders[0];

  const getStatusStep = (status: string) => {
    switch (status) {
      case "Placed": return 1;
      case "Processing": return 2;
      case "Shipped": return 3;
      case "Delivered": return 4;
      case "Cancelled": return -1;
      default: return 1;
    }
  };

  const activeStep = getStatusStep(activeTrackOrder.orderStatus);

  return (
    <div id="screen-orders" className="space-y-8 animate-fade-in">
      <div className="border-b border-slate-100 pb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <button
            onClick={() => setPage("home")}
            className="group flex items-center space-x-1.5 px-3.5 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-150 rounded-xl text-xs font-black text-slate-500 hover:text-slate-900 transition-all self-start sm:self-auto"
          >
            <ArrowLeft className="w-3.5 h-3.5 transform group-hover:-translate-x-0.5 transition-transform" />
            <span className="uppercase tracking-wider">Back</span>
          </button>
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">My Historical Shipments</h1>
        </div>
        <div className="text-[10px] text-slate-400 font-mono font-bold bg-slate-100 py-1 px-3 rounded-full w-fit">
          LOGGED: {orders.length} DELIVERIES
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left column: Past deliveries lists scroll */}
        <div className="lg:col-span-1 space-y-3 max-h-[600px] overflow-y-auto pr-1">
          {orders.map((o) => {
            const isSel = activeTrackOrder.id === o.id;
            return (
              <div
                key={o.id}
                onClick={() => setViewingOrderId(o.id)}
                className={`cursor-pointer border rounded-2xl p-4 transition-all shadow-sm ${
                  isSel ? "bg-[#0F172A] text-white border-[#0F172A]" : "bg-white hover:bg-slate-50 border-slate-200 text-slate-700"
                }`}
              >
                <div className="flex justify-between items-center text-xs font-black uppercase tracking-wider">
                  <span>{o.id}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] ${
                    o.orderStatus === "Delivered" ? "bg-emerald-500 text-white" :
                    o.orderStatus === "Cancelled" ? "bg-rose-500 text-white" : "bg-[#38BDF8] text-[#0F172A]"
                  }`}>
                    {o.orderStatus}
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-400 mt-1">
                  Placed: {new Date(o.createdAt).toLocaleDateString()}
                </p>
                <div className="flex justify-between items-center mt-3 border-t border-slate-100/10 pt-2 text-xs font-mono font-bold">
                  <span>₹{o.totalAmount}</span>
                  <span className="text-slate-400 leading-none">{o.items.length} items</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right column: Chronological Track progress panel */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4 mb-2 gap-3">
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{t.ordernumber}</p>
              <h2 className="text-lg font-black text-slate-800 leading-none mt-1">{activeTrackOrder.id}</h2>
            </div>
            
            {activeTrackOrder.orderStatus !== "Cancelled" && activeTrackOrder.orderStatus !== "Delivered" ? (
              <button
                onClick={() => cancelOrder(activeTrackOrder.id)}
                className="bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white border border-rose-300 text-xs font-extrabold py-2 px-4 rounded-xl transition-colors tracking-wide uppercase self-start w-full sm:w-auto text-center"
              >
                {t.cancelOrder}
              </button>
            ) : activeTrackOrder.orderStatus === "Cancelled" ? (
              <span className="text-xs font-extrabold text-rose-500 bg-rose-50 border border-rose-200 py-1.5 px-4 rounded-xl uppercase tracking-wider leading-none">ORDER CANCELLED</span>
            ) : null}
          </div>

          {/* SENSOR PROGRESSION TRACK TRACKER */}
          {activeStep > -1 ? (
            <div className="grid grid-cols-4 gap-2 relative">
              {[
                { title: "Placed", desc: "Under Review", icon: FileCheck, step: 1 },
                { title: "Processed", desc: "Sort & Packed", icon: Clock, step: 2 },
                { title: "Shipped", desc: "Out Route", icon: Truck, step: 3 },
                { title: "Delivered", desc: "Settled", icon: PackageCheck, step: 4 }
              ].map((st, idx) => {
                const checked = activeStep >= st.step;
                const activeLine = activeStep > st.step;
                return (
                  <div key={st.step} className="flex flex-col items-center text-center space-y-3 select-none relative">
                    
                    {/* Visual node */}
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all shadow-md z-10 ${
                      checked 
                        ? "bg-[#38BDF8] border-[#38BDF8] text-[#0F172A]" 
                        : "bg-slate-50 border-slate-200 text-slate-400"
                    }`}>
                      <st.icon className="w-5.5 h-5.5" />
                    </div>

                    <div>
                      <p className={`text-xs font-extrabold ${checked ? "text-slate-800" : "text-slate-400"}`}>{st.title}</p>
                      <p className="text-[9px] text-slate-400 leading-none mt-0.5">{st.desc}</p>
                    </div>

                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-rose-50 border border-rose-100 rounded-3xl p-6 text-center text-rose-700 font-extrabold text-sm flex items-center justify-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-rose-500" />
              <span>Canceled Status. Item stock values was successfully restocked to main database inventories.</span>
            </div>
          )}

          {/* Visual product entries billing list */}
          <div className="border-t border-slate-100 pt-6 space-y-4">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-400">Order Contents</h4>
            <div className="space-y-3">
              {activeTrackOrder.items.map((itm, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs border-b border-slate-50 pb-3">
                  <div className="flex items-center space-x-3">
                    <img src={itm.image} alt={itm.name} className="w-10 h-12 object-cover rounded-lg border" />
                    <div>
                      <p className="font-extrabold text-slate-800 leading-snug">{itm.name}</p>
                      <p className="text-[10px] text-slate-400 font-bold mt-0.5">Size: {itm.size} &bull; Color: {itm.color}</p>
                    </div>
                  </div>
                  <div className="text-right font-mono font-bold text-slate-700">
                    <span>{itm.quantity}x &mdash; ₹{itm.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Aggregated Receipt info */}
          <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex items-center justify-between text-xs font-extrabold">
            <span className="text-slate-500 uppercase">Settled Shipment Payment</span>
            <span className="font-bold text-slate-800 font-mono">₹{activeTrackOrder.totalAmount} via {activeTrackOrder.paymentMethod}</span>
          </div>

        </div>

      </div>

    </div>
  );
}

// ==========================================
// F. ADMINISTRATIVE DASHBOARD PANEL (CRUD PRODUCTS, ENFORCERS)
// ==========================================
function AdminScreen() {
  return <AdminDashboard />;
}

function LegacyAdminScreen() {
  const {
    adminDashboardData,
    loadAdminDashboard,
    adminUpdateOrderStatus,
    adminSaveProduct,
    adminDeleteProduct,
    products,
    t
  } = useShop();

  const [activePane, setActivePane] = useState<'analytics' | 'product-manager' | 'order-list'>('analytics');

  // Load Admin statistical metrics on mount
  useEffect(() => {
    loadAdminDashboard();
  }, []);

  const [formId, setFormId] = useState("");
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState<'Men' | 'Women' | 'Kids'>("Men");
  const [formSubcategory, setFormSubcategory] = useState<'T-Shirts' | 'Shirts' | 'Jeans' | 'Hoodies' | 'Jackets' | 'Kurta' | 'Saree' | 'Dress' | 'Footwear' | 'Accessories'>("Shirts");
  const [formPrice, setFormPrice] = useState("");
  const [formOriginalPrice, setFormOriginalPrice] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formImages, setFormImages] = useState("https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop");
  const [formColors, setFormColors] = useState("Navy Blue, Chalk White");
  const [formSizes, setFormSizes] = useState("S, M, L, XL");
  const [formStock, setFormStock] = useState("15");
  const [formBadge, setFormBadge] = useState("Premium Collection");
  const [crudOk, setCrudOk] = useState(false);

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formPrice || !formDescription) return;

    const payload = {
      id: formId || undefined,
      name: formName,
      category: formCategory,
      subcategory: formSubcategory,
      price: Number(formPrice),
      originalPrice: Number(formOriginalPrice || formPrice),
      description: formDescription,
      images: [formImages],
      colors: formColors.split(",").map(c => c.trim()),
      sizes: formSizes.split(",").map(s => s.trim()),
      stock: Number(formStock),
      badge: formBadge
    };

    const success = await adminSaveProduct(payload);
    if (success) {
      setCrudOk(true);
      setTimeout(() => setCrudOk(false), 3000);
      // Reset form fields
      setFormId("");
      setFormName("");
      setFormPrice("");
      setFormOriginalPrice("");
      setFormDescription("");
    }
  };

  const handleEditProduct = (prod: any) => {
    setFormId(prod.id);
    setFormName(prod.name);
    setFormCategory(prod.category);
    setFormSubcategory(prod.subcategory);
    setFormPrice(String(prod.price));
    setFormOriginalPrice(String(prod.originalPrice));
    setFormDescription(prod.description);
    setFormColors(prod.colors.join(", "));
    setFormSizes(prod.sizes.join(", "));
    setFormStock(String(prod.stock));
    setFormBadge(prod.badge || "");
    setFormImages(prod.images[0]);
    setActivePane('product-manager');
  };

  if (!adminDashboardData) {
    return (
      <div className="text-center py-20 bg-white border border-slate-200 rounded-3xl animate-pulse">
        <Clock className="w-10 h-10 text-[#38BDF8] mx-auto animate-spin" />
        <p className="text-xs text-slate-500 mt-2 font-mono">Retriving active ShopSizzle warehouse matrices...</p>
      </div>
    );
  }

  // Calculate static visual elements using clean in-house logic
  const categoryChartColors = ["#0F172A", "#38BDF8", "#F59E0B"];
  const categorySalesArray = Object.entries(adminDashboardData.categorySales || {}) as [string, number][];

  return (
    <div id="screen-admin" className="space-y-6 animate-fade-in">
      <div className="border-b border-gray-200 pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 uppercase tracking-tight">{t.adminDashboard}</h1>
          <p className="text-xs text-slate-400 font-semibold tracking-wide">Secure warehouse enforcer suite parented by MERN Engine & Gemini</p>
        </div>
        
        {/* Toggle sub panes links */}
        <div className="flex bg-slate-100 p-1 rounded-xl self-start">
          <button
            onClick={() => setActivePane('analytics')}
            className={`text-xs font-bold py-2 px-4 rounded-lg transition-all ${activePane === 'analytics' ? 'bg-white text-[#0F172A] shadow-sm' : 'text-slate-500 hover:text-[#0F172A]'}`}
          >
            Analytics & charts
          </button>
          <button
            onClick={() => setActivePane('product-manager')}
            className={`text-xs font-bold py-2 px-4 rounded-lg transition-all ${activePane === 'product-manager' ? 'bg-white text-[#0F172A] shadow-sm' : 'text-slate-500 hover:text-[#0F172A]'}`}
          >
            Manage Catalog Items
          </button>
          <button
            onClick={() => setActivePane('order-list')}
            className={`text-xs font-bold py-2 px-4 rounded-lg transition-all ${activePane === 'order-list' ? 'bg-white text-[#0F172A] shadow-sm' : 'text-slate-500 hover:text-[#0F172A]'}`}
          >
            Sort Shipments & Pack
          </button>
        </div>
      </div>

      {activePane === 'analytics' && (
        <div className="space-y-8">
          {/* Quick Info Grid cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="bg-white border rounded-2xl p-5 shadow-sm">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Enterprise Revenue</span>
              <p className="text-2xl font-black text-[#0F172A] font-mono mt-1">₹{adminDashboardData.revenue}</p>
              <div className="flex items-center text-[10px] text-emerald-600 font-bold mt-1">
                <TrendingUp className="w-3.5 h-3.5 mr-1" />
                <span>+12.8% Since yesterday</span>
              </div>
            </div>

            <div className="bg-white border rounded-2xl p-5 shadow-sm">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Total Deliveries Placed</span>
              <p className="text-2xl font-black text-[#0F172A] font-mono mt-1">{adminDashboardData.ordersCount}</p>
              <p className="text-[10px] text-slate-400 leading-none mt-1.5 font-sans">Active shipping tracking enabled</p>
            </div>

            <div className="bg-white border rounded-2xl p-5 shadow-sm">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">{t.productsCount}</span>
              <p className="text-2xl font-black text-[#0F172A] font-mono mt-1">{adminDashboardData.productsCount}</p>
              <p className="text-[10px] text-slate-400 leading-none mt-1.5 font-sans">Across Men, Women & Kids collections</p>
            </div>

            <div className="bg-white border rounded-2xl p-5 shadow-sm bg-rose-50/20 border-rose-100">
              <span className="text-[10px] font-black uppercase text-rose-500 tracking-wider">Low Stock Inventory Alert</span>
              <p className="text-2xl font-black text-rose-600 font-mono mt-1">{adminDashboardData.lowStock?.length || 0}</p>
              <div className="flex items-center text-[10px] text-rose-500 font-bold mt-1 animate-pulse">
                <AlertTriangle className="w-3.5 h-3.5 mr-1" />
                <span>Items under 10 units!</span>
              </div>
            </div>

          </div>

          {/* Multi-Pane: Inline custom visual graphics using beautiful responsive SVG curves */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white space-y-4">
              <h3 className="text-sm font-extrabold uppercase tracking-widest text-[#38BDF8]">Genders Collection metrics representation</h3>
              <p className="text-xs text-slate-400">Total processed revenue aggregated per catalog focus category.</p>
              
              {/* Dynamic visual bars matching categories */}
              <div className="space-y-4 pt-4">
                {categorySalesArray.map(([cat, val], idx) => {
                  const max = Math.max(...categorySalesArray.map(([_, v]) => v), 1);
                  const pct = Math.round((val / max) * 100);
                  return (
                    <div key={cat} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                        <span>{cat} Collection</span>
                        <span className="font-mono">₹{val} ({pct}%)</span>
                      </div>
                      <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${pct}%` }}
                          className="h-full bg-gradient-to-r from-[#38BDF8] to-cyan-500 rounded-full"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Low Inventory notices list panel */}
            <div className="bg-white border rounded-3xl p-6 space-y-4 max-h-80 overflow-y-auto">
              <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
                <AlertTriangle className="w-4.5 h-4.5 text-rose-500" />
                <h4 className="font-extrabold text-sm text-slate-850 uppercase leading-none">{t.lowStockAlert}</h4>
              </div>
              <p className="text-[10px] text-slate-400 font-bold leading-none">{t.lowInventoryNotice}</p>
              <div className="space-y-3">
                {adminDashboardData.lowStock?.map((item: any) => (
                  <div key={item.id} className="flex justify-between items-center text-xs">
                    <span className="font-extrabold text-slate-700 leading-snug line-clamp-1">{item.name}</span>
                    <span className="bg-rose-50 border border-rose-200 text-rose-600 font-extrabold font-mono rounded-lg px-2 py-0.5 leading-none">
                      {item.stock} Left!
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Recent Live activity lists */}
          <div className="bg-white border rounded-3xl p-6 space-y-4">
            <h4 className="text-sm font-extrabold text-slate-800 uppercase tracking-tight">{t.recentOrders}</h4>
            <div className="overflow-x-auto text-left">
              <table className="w-full text-xs text-slate-500 font-medium">
                <thead>
                  <tr className="border-b border-slate-150 uppercase text-[10px] font-black text-slate-400 text-left">
                    <th className="py-2.5">Hash ID</th>
                    <th>Customer Name</th>
                    <th>Paid aggregated</th>
                    <th>Chronological Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans">
                  {adminDashboardData.recentOrders?.map((ord: any) => (
                    <tr key={ord.id} className="hover:bg-slate-50/40">
                      <td className="py-3 font-bold text-slate-800">{ord.id}</td>
                      <td>{ord.shippingAddress.fullName}</td>
                      <td className="font-mono font-bold text-slate-700">₹{ord.totalAmount}</td>
                      <td>{new Date(ord.createdAt).toLocaleDateString()}</td>
                      <td>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                          ord.orderStatus === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                          ord.orderStatus === 'Cancelled' ? 'bg-rose-150 text-rose-800' : 'bg-amber-100 text-amber-800'
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

      {activePane === 'product-manager' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Add / Edit product form parameters */}
          <div className="lg:col-span-1 bg-white border rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
            <h3 className="font-extrabold text-sm text-slate-850 uppercase tracking-tight">
              {formId ? "Edit Existing Product Style" : "Add New Fashion Style Options"}
            </h3>

            {crudOk && (
              <div className="bg-emerald-50 border border-emerald-200 text-[#006e3d] text-xs font-bold py-2 px-3 rounded-xl">
                Style successfully registered with active core catalogs.
              </div>
            )}

            <form onSubmit={handleProductSubmit} className="space-y-4">
              
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-slate-400">Garment Name Title</label>
                <input
                  type="text"
                  required
                  placeholder="Ex. Classic Oxford Dress Shirt"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-1.5 px-3 text-xs font-semibold focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-slate-400">Gender Segment</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-1.5 px-2 text-xs font-semibold"
                  >
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Kids">Kids</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-slate-400">Garment Subcategory</label>
                  <select
                    value={formSubcategory}
                    onChange={(e) => setFormSubcategory(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-1.5 px-2 text-xs font-semibold"
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

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-slate-400">Offer Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-1.5 px-3 text-xs font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-slate-400">Slash Price Original (₹)</label>
                  <input
                    type="number"
                    value={formOriginalPrice}
                    onChange={(e) => setFormOriginalPrice(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-1.5 px-3 text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-slate-400">Full specs description</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Material specs, tailored details or styles advice guidelines..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-1.5 px-3 text-xs font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-slate-400">Stock count availability</label>
                <input
                  type="number"
                  value={formStock}
                  onChange={(e) => setFormStock(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-1.5 px-3 text-xs font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-slate-400">Representative Unsplash image link</label>
                <input
                  type="text"
                  required
                  value={formImages}
                  onChange={(e) => setFormImages(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-1.5 px-3 text-xs font-semibold"
                />
              </div>

              <div className="space-y-1.5">
                <button
                  type="submit"
                  className="w-full bg-[#0F172A] hover:bg-[#38BDF8] text-white hover:text-[#0F172A] text-xs font-extrabold py-3 rounded-xl transition-all uppercase tracking-wide"
                >
                  Save to Catalogs
                </button>
                {formId && (
                  <button
                    type="button"
                    onClick={() => {
                      setFormId("");
                      setFormName("");
                      setFormPrice("");
                      setFormDescription("");
                    }}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold py-2 rounded-xl transition-all"
                  >
                    Bypass / Discard changes
                  </button>
                )}
              </div>

            </form>
          </div>

          {/* Catalog search/edit tables scroll */}
          <div className="lg:col-span-2 bg-white border rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
            <h3 className="font-extrabold text-sm text-slate-850 uppercase tracking-tight">Active garments listed table</h3>
            <div className="max-h-[500px] overflow-y-auto pr-1">
              <table className="w-full text-xs text-left text-slate-500 font-medium">
                <thead>
                  <tr className="border-b border-slate-150 py-2.5 text-[10px] uppercase font-black text-slate-400">
                    <th className="py-2.5">Style</th>
                    <th>Category</th>
                    <th>Subtype</th>
                    <th>Inventories</th>
                    <th>Tag price</th>
                    <th className="text-right">Enforcement Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/40">
                      <td className="py-2.5 font-bold text-[#0F172A]">{p.name}</td>
                      <td>{p.category}</td>
                      <td>{p.subcategory}</td>
                      <td className="font-semibold">{p.stock} Units</td>
                      <td className="font-mono font-bold">₹{p.price}</td>
                      <td className="py-2.5 text-right space-x-2">
                        <button
                          onClick={() => handleEditProduct(p)}
                          className="bg-slate-100 hover:bg-[#38BDF8]/25 text-[#0F172A] px-2.5 py-1 text-[10px] font-bold rounded-lg transition-colors"
                        >
                          Modify
                        </button>
                        <button
                          onClick={async () => {
                            if (confirm("Delete this catalog option? This cannot be undone.")) {
                              await adminDeleteProduct(p.id);
                            }
                          }}
                          className="bg-rose-50 hover:bg-rose-100 text-rose-600 px-2.5 py-1 text-[10px] font-bold rounded-lg transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {activePane === 'order-list' && (
        <div className="bg-white border rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
          <h3 className="font-extrabold text-sm text-slate-850 uppercase tracking-tight">Active shipments packing & route optimizer</h3>
          <div className="overflow-x-auto text-left">
            <table className="w-full text-xs text-slate-500 font-medium whitespace-nowrap">
              <thead>
                <tr className="border-b border-slate-150 text-[10px] uppercase font-black text-slate-400 text-left">
                  <th className="py-2.5">Order ID</th>
                  <th>Customer Address</th>
                  <th>Aggregated values</th>
                  <th>Current status</th>
                  <th className="text-right">Status Updates</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {adminDashboardData.recentOrders?.map((ord: any) => (
                  <tr key={ord.id} className="hover:bg-slate-50/40">
                    <td className="py-3 font-bold text-slate-800">{ord.id}</td>
                    <td className="max-w-xs truncate">
                      <p className="font-bold text-slate-750 inline">{ord.shippingAddress.fullName}</p> &bull; {ord.shippingAddress.address}, {ord.shippingAddress.city}, PIN: {ord.shippingAddress.pinCode}
                    </td>
                    <td className="font-mono font-bold text-slate-700">₹{ord.totalAmount}</td>
                    <td>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                        ord.orderStatus === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                        ord.orderStatus === 'Cancelled' ? 'bg-rose-150 text-rose-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {ord.orderStatus}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      {ord.orderStatus !== 'Cancelled' && ord.orderStatus !== 'Delivered' ? (
                        <div className="inline-flex gap-1.5">
                          <button
                            onClick={() => adminUpdateOrderStatus(ord.id, "Processing")}
                            className="bg-slate-100 hover:bg-[#38BDF8]/20 px-2 py-1 text-[10px] font-bold rounded-lg transition-colors text-[#0F172A]"
                          >
                            Sort Pack
                          </button>
                          <button
                            onClick={() => adminUpdateOrderStatus(ord.id, "Shipped")}
                            className="bg-slate-100 hover:bg-[#38BDF8]/20 px-2 py-1 text-[10px] font-bold rounded-lg transition-colors text-[#0F172A]"
                          >
                            Dispatch Route
                          </button>
                          <button
                            onClick={() => adminUpdateOrderStatus(ord.id, "Delivered")}
                            className="bg-emerald-50 hover:bg-emerald-150 px-2 py-1 text-[10px] font-bold rounded-lg transition-colors text-emerald-800"
                          >
                            Deliver
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-semibold italic uppercase">Completed Order lifecycle</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}

// ==========================================
// G. DUMMY AUTH SCREEN CONTROLLER
// ==========================================
function AuthScreen() {
  const { login, register, t, setPage } = useShop();

  const [isLogin, setIsLogin] = useState(true);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [authMsg, setAuthMsg] = useState("");
  const [authErr, setAuthErr] = useState("");

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthMsg("");
    setAuthErr("");
    
    if (isLogin) {
      const ok = await login(email, password);
      if (ok) {
        setPage("home");
      } else {
        setAuthErr("Unauthorized credentials. Check email or password.");
      }
    } else {
      const ok = await register(fullName, email, password, phone);
      if (ok) {
        setPage("home");
      } else {
        setAuthErr("Account registration failed. Dual emails matching.");
      }
    }
  };

  return (
    <div id="screen-auth" className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-md mx-auto py-12 space-y-6 shadow-md animate-fade-in">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
          {isLogin ? "Sign In to ShopSizzle" : "Design Custom Wardrobe"}
        </h2>
        <p className="text-xs text-slate-400">Connect to checkout luxury catalog items and track shipments.</p>
      </div>

      {authErr && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold py-2.5 px-4 rounded-xl leading-snug">
          {authErr}
        </div>
      )}

      <form onSubmit={handleAuthSubmit} className="space-y-4">
        
        {!isLogin && (
          <div className="space-y-1.5">
            <label className="text-[9px] font-black uppercase text-slate-400">Full Name</label>
            <input
              type="text"
              required
              placeholder="Your Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-semibold focus:outline-none"
            />
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-[9px] font-black uppercase text-slate-400">Email Address</label>
          <input
            type="email"
            required
            placeholder="yourname@domain.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-semibold focus:outline-none"
          />
        </div>

        {!isLogin && (
          <div className="space-y-1.5">
            <label className="text-[9px] font-black uppercase text-slate-400">10-Digit Phone</label>
            <input
              type="tel"
              required
              placeholder="Ex. 9876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-semibold focus:outline-none"
            />
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-[9px] font-black uppercase text-slate-400">Credential password</label>
          <input
            type="password"
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-semibold focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-slate-900 hover:bg-[#38BDF8] text-white hover:text-slate-900 font-extrabold py-3 rounded-xl text-xs transition-all tracking-wide uppercase"
        >
          {isLogin ? "Sign In" : "Register Credentials"}
        </button>

      </form>

      <div className="border-t border-slate-100 pt-4 flex flex-col space-y-3.5 items-center text-xs">
        <span
          onClick={() => setIsLogin(!isLogin)}
          className="text-slate-500 hover:text-[#38BDF8] cursor-pointer font-bold select-none leading-none"
        >
          {isLogin ? "New to ShopSizzle? Launch custom card" : "Already registered? Login directly"}
        </span>
      </div>

    </div>
  );
}

// ==========================================
// H. WISHLIST SCREEN LAYOUT
// ==========================================
function WishlistScreen() {
  const { wishlist, toggleWishlist, viewProduct, addToCart, collectionImageFit, t, setPage } = useShop();

  if (wishlist.length === 0) {
    return (
      <div id="screen-wishlist-empty" className="bg-white border border-slate-150 rounded-2xl p-12 text-center space-y-4 max-w-lg mx-auto py-16">
        <div className="bg-rose-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-inner text-rose-500">
          <Heart className="w-10 h-10 fill-rose-500" />
        </div>
        <h2 className="text-xl font-extrabold text-slate-800 tracking-tight uppercase">Your Wishlist is Empty</h2>
        <p className="text-sm text-slate-500 leading-relaxed">
          Looks like you haven't added any elegant selections to your wishlist yet. Explore our latest premium fashion curation now.
        </p>
        <button
          onClick={() => setPage("home")}
          className="bg-slate-900 hover:bg-[#38BDF8] text-white hover:text-slate-950 font-extrabold py-3 px-6 rounded-xl text-xs transition-all tracking-wider uppercase inline-block"
        >
          Discover Fashion
        </button>
      </div>
    );
  }

  return (
    <div id="screen-wishlist" className="space-y-6 animate-fade-in">
      <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center space-x-2">
          <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
          <span className="uppercase">My Wishlist</span>
          <span className="text-[10px] text-slate-400 font-mono font-bold bg-slate-100 py-0.5 px-2.5 rounded-full">
            {wishlist.length} ITEMS
          </span>
        </h1>
        <button
          onClick={() => setPage("home")}
          className="group flex items-center space-x-1.5 px-3.5 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-150 rounded-xl text-xs font-black text-slate-500 hover:text-slate-900 transition-all self-start sm:self-auto"
        >
          <ArrowLeft className="w-3.5 h-3.5 transform group-hover:-translate-x-0.5 transition-transform" />
          <span className="uppercase tracking-wider">Back To Collections</span>
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlist.map((product) => {
          const defaultColor = product.colors[0] || "Standard";
          const defaultSize = product.sizes[0] || "M";
          
          return (
            <div
              key={product.id}
              onClick={() => viewProduct(product.id)}
              className="group relative cursor-pointer bg-white border border-slate-150 rounded-2xl overflow-hidden hover:border-slate-300 hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-300 flex flex-col justify-between"
            >
              {/* Image with overlay action buttons */}
              <div className="relative h-64 w-full overflow-hidden bg-slate-50">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className={`w-full h-full object-center transform group-hover:scale-105 transition-all duration-500 ${
                    collectionImageFit === 'cover' ? 'object-cover' : 'object-contain p-4 bg-slate-50'
                  }`}
                />
                
                {/* Remove heart button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(product.id);
                  }}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-rose-50 border border-rose-200 text-rose-500 flex items-center justify-center shadow-md hover:bg-rose-100 transition-all duration-300 animate-fade-in"
                  title="Remove from wishlist"
                >
                  <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                </button>
              </div>

              {/* Info Details */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <p className="text-[10px] text-[#38BDF8] font-black uppercase tracking-widest leading-none">
                    {product.category} &bull; {product.subcategory}
                  </p>
                  <h3 className="font-extrabold text-slate-900 text-sm sm:text-base mt-2 line-clamp-1 group-hover:text-[#38BDF8] transition-colors leading-snug">
                    {product.name}
                  </h3>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                  <div className="flex items-baseline space-x-2">
                    <span className="text-slate-900 font-black text-sm sm:text-base">
                      ₹{product.price}
                    </span>
                    <span className="text-slate-400 line-through text-xs">
                      ₹{product.originalPrice}
                    </span>
                  </div>
                </div>

                {/* Move / Add to bag action */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(product.id, 1, defaultColor, defaultSize);
                  }}
                  className="w-full bg-slate-900 hover:bg-[#38BDF8] hover:text-slate-950 text-white text-[10px] uppercase font-black py-2.5 px-3 rounded-xl shadow-md flex items-center justify-center space-x-1.5 transition-all"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add To Bag</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ==========================================
// I. STATIC DESIGN SYSTEM FOOTER
// ==========================================
function Footer() {
  const { t } = useShop();
  return (
    <footer id="shopsizzle-footer" className="bg-white text-slate-600 text-xs py-10 border-t border-slate-100 mt-20 leading-relaxed select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <span className="font-black text-slate-900 text-sm tracking-tight">
            {t.brandName}
          </span>
          <span className="text-slate-200">|</span>
          <p className="text-[10px] font-bold text-slate-400 tracking-wide">
            {t.tagline}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center sm:space-x-4 space-y-1 sm:space-y-0 text-[10px] text-slate-400">
          <p className="font-mono">
            &copy; {new Date().getFullYear()} ShopSizzle Sourcing Labs. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
