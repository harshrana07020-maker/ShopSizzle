import React, { useState } from "react";
import { useShop } from "../context/ShopContext";
import { Search, Heart, ShoppingBag, User, Globe, Menu, X, ShieldAlert } from "lucide-react";
import { SizzleLogo } from "./SizzleLogo";

// Helper to mask sensitive details like email address
const maskEmail = (email: string) => {
  if (!email) return "";
  const [local, domain] = email.split("@");
  if (!domain) return email;
  if (local.length <= 3) {
    return `${local[0]}***@${domain}`;
  }
  return `${local.slice(0, 2)}***${local.slice(-1)}@${domain}`;
};

export const Header: React.FC = () => {
  const {
    user,
    cart,
    wishlist,
    language,
    setLanguage,
    t,
    searchQuery,
    setSearchQuery,
    setPage,
    currentPage,
    logout
  } = useShop();

  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage("home");
  };

  return (
    <header id="shopsizzle-navbar" className="sticky top-0 z-50 bg-white/95 backdrop-blur-md text-slate-800 border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo & Slogan */}
          <div className="flex items-center space-x-3 cursor-pointer select-none" onClick={() => setPage("home")}>
            <div className="w-12 h-12 flex items-center justify-center">
              <SizzleLogo size="100%" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tighter text-slate-950">
                {t.brandName}
              </span>
              <p className="text-[9px] text-[#38BDF8] font-black tracking-wider uppercase leading-none mt-0.5">
                {t.tagline}
              </p>
            </div>
          </div>

          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-sm mx-8 relative">
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-250/70 rounded-full py-2.5 pl-5 pr-12 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#38BDF8]/40 focus:border-[#38BDF8] transition-all duration-300"
            />
            <button type="submit" className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#38BDF8] transition-colors">
              <Search className="w-4.5 h-4.5"/>
            </button>
          </form>

          {/* Right Action Icons panel */}
          <div className="flex items-center space-x-4 lg:space-x-5">
            
            {/* Global Language Switcher */}
            <div className="relative">
              <button 
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center space-x-1 hover:text-[#38BDF8] transition-colors text-sm font-bold tracking-wide py-1.5 px-3 rounded-xl hover:bg-slate-50 text-slate-600"
              >
                <Globe className="w-4 h-4 text-[#38BDF8]" />
                <span className="uppercase text-xs">{language}</span>
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white border border-slate-100 rounded-xl overflow-hidden shadow-xl z-50">
                  <button 
                    onClick={() => { setLanguage("en"); setLangDropdownOpen(false); }}
                    className={`w-full text-left px-4 py-2 text-xs hover:bg-slate-50 transition-colors ${language === 'en' ? 'text-[#38BDF8] font-black' : 'text-slate-700'}`}
                  >
                    English
                  </button>
                  <button 
                    onClick={() => { setLanguage("gu"); setLangDropdownOpen(false); }}
                    className={`w-full text-left px-4 py-2 text-xs hover:bg-slate-50 transition-colors ${language === 'gu' ? 'text-[#38BDF8] font-black' : 'text-slate-700'}`}
                  >
                    ગુજરાતી
                  </button>
                  <button 
                    onClick={() => { setLanguage("hi"); setLangDropdownOpen(false); }}
                    className={`w-full text-left px-4 py-2 text-xs hover:bg-slate-50 transition-colors ${language === 'hi' ? 'text-[#38BDF8] font-black' : 'text-slate-700'}`}
                  >
                    हिन्दी
                  </button>
                </div>
              )}
            </div>

            {/* Wishlist */}
            <button 
              onClick={() => setPage("wishlist")} 
              className="relative p-2 rounded-xl hover:bg-slate-50 text-slate-600 hover:text-[#38BDF8] transition-all"
              title="View Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1.5 right-1.5 bg-rose-500 text-white text-[9px] w-4 h-4 flex items-center justify-center font-black rounded-full shadow-sm animate-pulse">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button 
              onClick={() => setPage("cart")} 
              className="relative p-2 rounded-xl hover:bg-slate-50 text-slate-600 hover:text-[#38BDF8] transition-all"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartItemsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 bg-[#38BDF8] text-[#0F172A] text-[9px] w-4 h-4 flex items-center justify-center font-black rounded-full shadow-sm">
                  {cartItemsCount}
                </span>
              )}
            </button>

            {/* User Profile / Admin dropdown */}
            <div className="relative">
              <button 
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center space-x-1.5 p-2 rounded-xl hover:bg-slate-50 text-slate-600 hover:text-[#38BDF8] transition-all"
              >
                <User className="w-5 h-5" />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-100 rounded-xl overflow-hidden shadow-xl z-50 py-1 text-slate-700">
                  {user ? (
                    <>
                      <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                        <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Logged in as</p>
                        <p className="font-bold text-slate-800 text-sm truncate mt-0.5">{user.fullName}</p>
                        <p className="text-xs text-slate-400 truncate mt-0.5">{maskEmail(user.email)}</p>
                      </div>
                      <button 
                        onClick={() => { setPage("orders"); setProfileDropdownOpen(false); }}
                        className="w-full text-left px-4 py-2.5 text-xs font-semibold hover:bg-slate-50 transition-colors text-slate-700 flex items-center space-x-2"
                      >
                        <span>{t.orderHistory}</span>
                      </button>
                      {user.isAdmin && (
                        <button 
                          onClick={() => { setPage("admin"); setProfileDropdownOpen(false); }}
                          className="w-full text-left px-4 py-2.5 text-xs font-bold hover:bg-slate-50 text-[#38BDF8] transition-colors flex items-center space-x-2 border-t border-b border-slate-150"
                        >
                          <ShieldAlert className="w-4 h-4" />
                          <span>{t.adminDashboard}</span>
                        </button>
                      )}
                      <button 
                        onClick={() => { logout(); setProfileDropdownOpen(false); }}
                        className="w-full text-left px-4 py-2.5 text-xs font-bold hover:bg-rose-50 text-rose-600 transition-colors"
                      >
                        Logout Session
                      </button>
                    </>
                  ) : (
                    <button 
                      onClick={() => { setPage("auth"); setProfileDropdownOpen(false); }}
                      className="w-full text-center my-2 mx-auto bg-slate-900 hover:bg-[#38BDF8]/95 hover:text-slate-900 text-white font-extrabold py-2 px-4 rounded-lg w-[88%] block text-xs hover:scale-102 transition-all uppercase tracking-wider"
                    >
                      Login / Sign Up
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Hamburger Menu toggler */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 hover:text-[#38BDF8] transition-colors text-slate-650"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile responsive search + collections list drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 space-y-4">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-full py-2 pl-4 pr-10 text-sm placeholder-slate-450 focus:outline-none focus:ring-1 focus:ring-[#38BDF8] text-slate-800"
            />
            <button type="submit" className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* User profile check */}
          <div className="border-t border-slate-100 pt-3">
            {user ? (
              <div className="flex items-center justify-between pb-2">
                <div>
                  <p className="font-bold text-sm text-slate-850">{user.fullName}</p>
                  <p className="text-xs text-slate-400">{maskEmail(user.email)}</p>
                </div>
                <button onClick={() => logout()} className="text-rose-500 text-xs font-bold border border-rose-200 hover:bg-rose-50 px-2.5 py-1 rounded-lg">Logout</button>
              </div>
            ) : (
              <button 
                onClick={() => { setPage("auth"); setMobileMenuOpen(false); }}
                className="w-full bg-slate-900 text-white font-bold py-2 rounded-xl text-center text-xs uppercase hover:bg-[#38BDF8]"
              >
                Sign In to Account
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
