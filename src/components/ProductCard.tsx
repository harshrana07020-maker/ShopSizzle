import React from "react";
import { Product } from "../types";
import { useShop } from "../context/ShopContext";
import { Heart, Star, ShoppingBag, Eye } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { viewProduct, toggleWishlist, wishlist, addToCart, collectionImageFit, t } = useShop();

  const isLiked = wishlist.some(item => item.id === product.id);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Quick add default size and color
    const defaultColor = product.colors[0] || "Standard";
    const defaultSize = product.sizes[0] || "M";
    addToCart(product.id, 1, defaultColor, defaultSize);
  };

  return (
    <div
      id={`prod-card-${product.id}`}
      onClick={() => viewProduct(product.id)}
      className="group relative cursor-pointer bg-white border border-slate-150 rounded-2xl overflow-hidden hover:border-slate-300 hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-300 flex flex-col justify-between"
    >
      
      {/* Product Image section with indicators */}
      <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-slate-50">
        <img
          src={product.images[0]}
          alt={product.name}
          className={`w-full h-full object-center transform group-hover:scale-105 transition-all duration-500 ${
            collectionImageFit === 'cover' ? 'object-cover' : 'object-contain p-4 bg-slate-50'
          }`}
        />

        {/* Wishlist floating toggle bubble selector */}
        <button
          onClick={handleWishlistClick}
          className={`absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center shadow-md border transition-all duration-300 ${
            isLiked 
              ? "bg-rose-50 border-rose-200 text-rose-500" 
              : "bg-white hover:bg-slate-50 border-slate-100 text-slate-400 hover:text-rose-500 hover:scale-105"
          }`}
        >
          <Heart className={`w-4 h-4 ${isLiked ? "fill-rose-500 text-rose-500" : ""}`} />
        </button>

        {/* Promotion badges */}
        {product.badge && (
          <span className={`absolute top-4 left-4 text-[9px] font-black uppercase tracking-widest py-1 px-3 rounded-full shadow-sm text-white ${
            product.badge.toLowerCase().includes("stock") 
              ? "bg-rose-500 animate-pulse" 
              : "bg-slate-900"
          }`}>
            {product.badge}
          </span>
        )}

        {/* Action slide overlay on hover */}
        <div className="absolute inset-x-4 bottom-4 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10 hidden sm:flex space-x-2">
          <button
            onClick={handleQuickAdd}
            className="flex-1 bg-slate-900 hover:bg-[#38BDF8] hover:text-slate-950 text-white text-[10px] uppercase font-black py-2 px-3 rounded-full shadow-md flex items-center justify-center space-x-1.5 transition-all"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Quick Bag</span>
          </button>
          <button className="bg-white text-slate-800 hover:bg-slate-50 p-2 rounded-full border border-slate-100 shadow-md">
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Product Information Description body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center justify-between">
            <p className="text-[10px] text-[#38BDF8] font-black uppercase tracking-widest leading-none">
              {product.category} &bull; {product.subcategory}
            </p>
            
            {/* Rating Stars indicators */}
            <div className="flex items-center space-x-1">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span className="text-[10px] text-slate-400 font-bold font-mono">
                {product.rating}
              </span>
            </div>
          </div>

          <h3 className="font-extrabold text-slate-900 text-sm sm:text-base mt-2 line-clamp-1 group-hover:text-[#38BDF8] transition-colors leading-snug">
            {product.name}
          </h3>
        </div>

        {/* Dual pricing displays (New and Original line cuts) */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-3">
          <div className="flex items-baseline space-x-2">
            <span className="text-slate-900 font-black text-base sm:text-lg">
              ₹{product.price}
            </span>
            <span className="text-slate-400 line-through text-xs font-semibold">
              ₹{product.originalPrice}
            </span>
          </div>

          {/* Savings calculated banner */}
          <div className="text-[9px] font-black text-emerald-500 bg-emerald-50 rounded-full px-2.5 py-0.5 leading-none border border-emerald-100">
            {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
          </div>
        </div>

      </div>

    </div>
  );
};
