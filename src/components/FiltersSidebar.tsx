import React from "react";
import { useShop } from "../context/ShopContext";
import { SlidersHorizontal, Eye, X, Filter } from "lucide-react";

// Pre-defined available fashion subcategories & sizing elements for filtering grids
const FILTER_SUBCATEGORIES = [
  "T-Shirts", "Shirts", "Jeans", "Hoodies", "Jackets", "Kurta", "Saree", "Dress", "Footwear", "Accessories"
];
const FILTER_SIZES = ["S", "M", "L", "XL", "UK 8", "UK 9", "One Size"];
const FILTER_COLORS = ["Sky Blue", "Chalk White", "Off-White Beige", "Emerald Green", "Charcoal Grey", "Burgundy Red", "Midnight Gold", "Midnight Blue"];

export const FiltersSidebar: React.FC = () => {
  const {
    selectedCategory,
    setSelectedCategory,
    selectedSubcategory,
    setSelectedSubcategory,
    selectedSize,
    setSelectedSize,
    selectedColor,
    setSelectedColor,
    sortBy,
    setSortBy,
    priceRange,
    setPriceRange,
    t
  } = useShop();

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, index: 0 | 1) => {
    const val = Number(e.target.value);
    const newRange = [...priceRange] as [number, number];
    newRange[index] = val;
    setPriceRange(newRange);
  };

  const handleResetFilters = () => {
    setSelectedCategory("all");
    setSelectedSubcategory("");
    setSelectedSize("");
    setSelectedColor("");
    setSortBy("default");
    setPriceRange([0, 8000]);
  };

  return (
    <div id="shopsizzle-filters-sidebar" className="bg-white border border-slate-150 rounded-2xl p-6 shadow-sm space-y-6">
      
      {/* Filters Title Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center space-x-2 text-slate-900">
          <SlidersHorizontal className="w-4 h-4 text-[#38BDF8]" />
          <span className="font-extrabold text-sm tracking-tight uppercase">Refine Styles</span>
        </div>
        <button
          onClick={handleResetFilters}
          className="text-xs font-black text-rose-500 hover:text-rose-600 transition-colors uppercase tracking-wider"
        >
          Reset All
        </button>
      </div>

      {/* Main Categories selection list (Horizontal / flex bento) */}
      <div className="space-y-3">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Gender Catalog</h4>
        <div className="flex flex-wrap gap-1.5">
          {["all", "Men", "Women", "Kids"].map((cat) => {
            const isSel = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat as any)}
                className={`py-1.5 px-3.5 rounded-full text-xs font-bold capitalize transition-all duration-200 border ${
                  isSel
                    ? "bg-slate-950 border-slate-950 text-white shadow-sm"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {cat === 'all' ? t.allCategories : t[cat.toLowerCase() as 'men' | 'women' | 'kids']}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sorter Selector */}
      <div className="space-y-2">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Sort Ordering</h4>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#38BDF8] select-none"
        >
          <option value="default">Premium Collections</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating">Rating: Highest Rated</option>
        </select>
      </div>

      {/* Subcategory selectors */}
      <div className="space-y-3 border-t border-slate-100 pt-4">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Garment Subcategory</h4>
        <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto pr-1">
          {FILTER_SUBCATEGORIES.map((sub) => {
            const isSel = selectedSubcategory === sub;
            return (
              <button
                key={sub}
                onClick={() => setSelectedSubcategory(selectedSubcategory === sub ? "" : sub)}
                className={`py-1.5 px-3 rounded-full text-[10px] font-bold transition-all duration-200 border ${
                  isSel
                    ? "bg-[#38BDF8] border-[#38BDF8] text-slate-950 font-black"
                    : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                {sub}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sizing grid filter */}
      <div className="space-y-3 border-t border-slate-100 pt-4">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Style Sizing</h4>
        <div className="flex flex-wrap gap-1.5">
          {FILTER_SIZES.map((sz) => {
            const isSel = selectedSize === sz;
            return (
              <button
                key={sz}
                onClick={() => setSelectedSize(selectedSize === sz ? "" : sz)}
                className={`h-9 min-w-9 px-2 rounded-xl text-xs font-bold text-center border transition-all duration-200 ${
                  isSel
                    ? "bg-slate-900 border-slate-900 text-white"
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {sz}
              </button>
            );
          })}
        </div>
      </div>

      {/* Color Filter */}
      <div className="space-y-3 border-t border-slate-100 pt-4">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Color Palette</h4>
        <div className="flex flex-wrap gap-1.5">
          {FILTER_COLORS.map((col) => {
            const isSel = selectedColor === col;
            return (
              <button
                key={col}
                onClick={() => setSelectedColor(selectedColor === col ? "" : col)}
                className={`py-1.5 px-3 rounded-full text-[10px] font-bold border transition-all duration-200 ${
                  isSel
                    ? "bg-[#38BDF8]/20 border-[#38BDF8] text-slate-950 font-black shadow-sm"
                    : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                {col}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price filter input decks */}
      <div className="space-y-3 border-t border-slate-100 pt-4">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Price Range</h4>
        <div className="flex items-center space-x-2">
          <div className="flex flex-col flex-1">
            <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Min price</span>
            <input
              type="number"
              value={priceRange[0]}
              min={0}
              max={8000}
              onChange={(e) => handlePriceChange(e, 0)}
              className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#38BDF8]"
            />
          </div>
          <span className="text-slate-300 text-xs self-end pb-3">&mdash;</span>
          <div className="flex flex-col flex-1">
            <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Max price</span>
            <input
              type="number"
              value={priceRange[1]}
              min={0}
              max={8000}
              onChange={(e) => handlePriceChange(e, 1)}
              className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#38BDF8]"
            />
          </div>
        </div>
      </div>

    </div>
  );
};
