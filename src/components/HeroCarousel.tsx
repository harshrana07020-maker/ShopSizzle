import React, { useState, useEffect } from "react";
import { useShop } from "../context/ShopContext";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

const HERO_SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&auto=format&fit=crop",
    title: "ELEVATE YOUR CLASS",
    subtitle: "AUTUMN / WINTER '26",
    description: "Discover bespoke tailoring and fluid satin silhouette dresses handpicked for your unique wardrobe requirements.",
    cta: "Shop Men's & Women's Collections",
    badge: "Smart Premium Selection",
    category: "all"
  },
  {
    image: "https://images.unsplash.com/photo-1540331548438-50b5530fb30f?w=1600&auto=format&fit=crop",
    title: "ROYAL FESTIVE GLOW",
    subtitle: "TRADITIONAL CHANDERI GOLD SILK",
    description: "Enchanting sarees, elegant kurtas, and traditional hand embroided styling to celebrate milestones.",
    cta: "Explore Traditional Kurta Set",
    badge: "Limited Festive Run",
    category: "Women"
  },
  {
    image: "https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=1600&auto=format&fit=crop",
    title: "LITTLE ICONIC COZY",
    subtitle: "KIDS PLAY FLEECE & COMED COTTON",
    description: "Cute dual-stitched bear hoods and Egyptian flow floral garden clothes tailored for certified active safety.",
    cta: "Browse Kids Outfits",
    badge: "New Kids Line",
    category: "Kids"
  }
];

export const HeroCarousel: React.FC = () => {
  const { setSelectedCategory, setPage } = useShop();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  const handleNext = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const handlePrev = () => {
    setCurrentSlideIndex((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1));
  };

  const handleCtaClick = (cat: string) => {
    if (cat === "all") {
      setSelectedCategory("all");
    } else {
      setSelectedCategory(cat as any);
    }
    setPage("home");
  };

  return (
    <div id="shopsizzle-hero-slider" className="relative w-full h-[520px] bg-slate-950 overflow-hidden shadow-2xl rounded-3xl">
      
      {/* Slides mapping */}
      {HERO_SLIDES.map((slide, index) => {
        const isActive = index === currentSlideIndex;
        return (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${
              isActive ? "opacity-100 scale-100 z-10" : "opacity-0 scale-95 -z-10 pointer-events-none"
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-950/60 to-transparent z-10" />
            <img
              src={slide.image}
              alt={slide.title}
              className="absolute inset-0 w-full h-full object-cover object-center transform scale-100 opacity-60"
            />
            
            {/* Abstract Graphic Elements Overlay */}
            <div className="absolute right-0 top-0 w-1/2 h-full bg-slate-900/30 flex items-center justify-center opacity-40 z-11 pointer-events-none">
              <div className="w-[300px] h-[300px] border-[40px] border-[#38BDF8]/10 rounded-full blur-3xl"></div>
              <div className="absolute w-40 h-40 border-4 border-[#38BDF8] opacity-10 -right-10 -bottom-10 rotate-12"></div>
            </div>

            {/* Infographic overlay detailing slide features */}
            <div className="absolute inset-0 flex items-center justify-start z-20 px-8 sm:px-16 md:px-24">
              <div className="max-w-2xl text-left text-white space-y-5">
                <div className="inline-flex items-center space-x-2 bg-[#38BDF8]/10 border border-[#38BDF8]/20 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest text-[#38BDF8] uppercase">
                  <Sparkles className="w-3 h-3 animate-spin duration-3000" />
                  <span>{slide.badge}</span>
                </div>
                <div>
                  <h3 className="text-xs font-black tracking-widest text-slate-400 uppercase">
                    {slide.subtitle}
                  </h3>
                  <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight mt-1 leading-none drop-shadow-md">
                    {slide.title}
                  </h1>
                </div>
                <p className="text-sm sm:text-base text-slate-300 md:text-md leading-relaxed drop-shadow-sm font-medium">
                  {slide.description}
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => handleCtaClick(slide.category)}
                    className="px-8 py-3.5 bg-[#38BDF8] text-slate-950 font-extrabold rounded-full hover:bg-[#38BDF8]/90 transition-all duration-300 text-xs tracking-wider uppercase shadow-lg shadow-[#38BDF8]/20 active:scale-95"
                  >
                    {slide.cta}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Nav Controls */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-slate-950/50 hover:bg-[#38BDF8] hover:text-slate-950 text-white p-2.5 rounded-full z-30 transition-all duration-250 cursor-pointer"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-slate-950/50 hover:bg-[#38BDF8] hover:text-slate-950 text-white p-2.5 rounded-full z-30 transition-all duration-250 cursor-pointer"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dots tracking indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2.5 z-30">
        {HERO_SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlideIndex(index)}
            className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
              index === currentSlideIndex ? "bg-[#38BDF8] w-8" : "bg-white/20 w-2"
            }`}
          />
        ))}
      </div>
    </div>
  );
};
