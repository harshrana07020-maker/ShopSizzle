import React from "react";
import { useShop } from "../context/ShopContext";
import { Sparkles, ArrowUpRight, Cpu } from "lucide-react";

export const AiStylistMatches: React.FC = () => {
  const {
    aiRecommendations,
    aiLoading,
    products,
    viewProduct,
    collectionImageFit,
    t
  } = useShop();

  // Match recommended list to full product definitions
  const recommendedItems = aiRecommendations
    .map(rec => {
      const p = products.find(prod => prod.id === rec.productId);
      if (p) {
        return { product: p, reason: rec.reason };
      }
      return null;
    })
    .filter(item => item !== null) as { product: typeof products[0]; reason: string }[];

  if (aiLoading) {
    return (
      <div id="ai-stylist-loading-skeleton" className="bg-white border border-slate-150 rounded-2xl p-6 sm:p-8 shadow-sm mt-8">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
          <div className="flex items-center space-x-2">
            <Cpu className="w-5 h-5 text-[#38BDF8] animate-spin" />
            <span className="font-bold text-slate-900 text-base tracking-wide">Gemini Wardrobe Optimizer Analysis...</span>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((id) => (
            <div key={id} className="animate-pulse space-y-3">
              <div className="bg-slate-100 h-56 rounded-2xl w-full" />
              <div className="bg-slate-200 h-4 rounded w-3/4" />
              <div className="bg-slate-100 h-3 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // If recommendations have not loaded yet or catalog not fetched, skip render
  if (recommendedItems.length === 0) return null;

  return (
    <div id="shopsizzle-ai-stylist-panel" className="relative overflow-hidden bg-white border border-slate-150 rounded-2xl p-6 sm:p-8 shadow-xl shadow-slate-200/40 mt-12">
      
      {/* Decorative geometric background grid pattern */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 flex flex-wrap gap-1 p-4 origin-top-right rotate-12 opacity-30 select-none pointer-events-none -mr-4 -mt-4">
        {Array.from({ length: 16 }).map((_, i) => (
          <div key={i} className="w-4 h-4 border border-slate-300 rounded" />
        ))}
      </div>

      {/* Header section with styling descriptions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-5 mb-8">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-[#38BDF8] animate-pulse" />
            <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
              {t.aiRecommended}
            </h2>
          </div>
          <p className="text-xs text-slate-400 font-semibold tracking-wide">
            {t.aiExplain}
          </p>
        </div>
        <div className="mt-3 sm:mt-0 flex items-center bg-slate-50 border border-slate-150 py-1.5 px-3.5 rounded-full text-[10px] font-mono font-bold text-slate-600">
          <Cpu className="w-3.5 h-3.5 text-[#38BDF8] mr-1.5" />
          <span>Active Feed: Gemini 3.5 Flash</span>
        </div>
      </div>

      {/* Recommended mapping grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {recommendedItems.map(({ product, reason }) => (
          <div
            key={product.id}
            onClick={() => viewProduct(product.id)}
            className="group cursor-pointer flex flex-col bg-white border border-slate-150 hover:border-slate-300 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-350"
          >
            {/* Image banner with overlay */}
            <div className="relative h-56 w-full overflow-hidden bg-slate-50">
              <img
                src={product.images[0]}
                alt={product.name}
                className={`w-full h-full object-center group-hover:scale-105 transition-all duration-500 ${
                  collectionImageFit === 'cover' ? 'object-cover' : 'object-contain p-3 bg-slate-50'
                }`}
              />
              {product.badge && (
                <span className="absolute top-3 left-3 bg-slate-900 text-white font-black text-[9px] uppercase tracking-wider py-1 px-2.5 rounded-full">
                  {product.badge}
                </span>
              )}
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md p-1.5 rounded-full text-slate-700 shadow-sm">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>

            {/* Content Details */}
            <div className="p-4 flex-1 flex flex-col justify-between space-y-3.5">
              <div>
                <p className="text-[10px] text-[#38BDF8] font-black uppercase tracking-wider">
                  {product.category} &bull; {product.subcategory}
                </p>
                <h4 className="font-extrabold text-slate-900 text-sm line-clamp-1 group-hover:text-[#38BDF8] mt-1 transition-colors leading-snug">
                  {product.name}
                </h4>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-slate-900 font-extrabold text-sm">
                    ₹{product.price}
                  </span>
                  <span className="text-slate-400 line-through text-xs">
                    ₹{product.originalPrice}
                  </span>
                </div>
              </div>

              {/* Stylist Explanation Commentary */}
              <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-xl">
                <p className="text-[10.5px] text-slate-600 leading-relaxed italic font-medium">
                  "{reason}"
                </p>
              </div>

            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
