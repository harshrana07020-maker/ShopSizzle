import React from 'react';

interface SizzleLogoProps {
  className?: string;
  size?: string | number;
}

export const SizzleLogo: React.FC<SizzleLogoProps> = ({ 
  className = "", 
  size = "40px" 
}) => {
  // Ultra-premium, fashion-forward inline SVG representing the ShopSizzle brand.
  // Combines a modern minimalist shopping bag, a flowing sizzle-S ribbon, and vibrant fire/shimmer sparkles.
  // Uses %23 to encode '#' for perfect browser-compatibility in image tags.
  const svgLogo = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <defs>
      <linearGradient id="sizzleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="%2338BDF8" />
        <stop offset="50%" stop-color="%23818CF8" />
        <stop offset="100%" stop-color="%23F43F5E" />
      </linearGradient>
    </defs>
    <!-- Shopping bag body -->
    <path d="M30 35 H70 L74 85 C74 87.2 72.2 89 70 89 H30 C27.8 89 26 87.2 26 85 Z" fill="none" stroke="url(%23sizzleGrad)" stroke-width="6.5" stroke-linejoin="round" />
    <!-- Curved handle -->
    <path d="M42 35 C42 22 58 22 58 35" fill="none" stroke="url(%23sizzleGrad)" stroke-width="5.5" stroke-linecap="round" />
    <!-- S-shaped Ribbon for "Sizzle" -->
    <path d="M42 50 C42 43 58 43 58 50 C58 57 42 57 42 64 C42 71 58 71 58 64" fill="none" stroke="url(%23sizzleGrad)" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round" />
    <!-- Fashion sparkle stars -->
    <path d="M74 16 L76.5 21 L82 22.5 L76.5 24 L74 29 L71.5 24 L66 22.5 L71.5 21 Z" fill="%23F43F5E" />
    <path d="M22,28 L23,31 L26,32 L23,33 L22,36 L21,33 L18,32 L21,31 Z" fill="%2338BDF8" />
  </svg>`;

  return (
    <div 
      className={`flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <img 
        src={svgLogo} 
        alt="ShopSizzle Logo"
        className="w-full h-full object-contain"
        onError={(e) => {
          // Fallback text if something unexpected happens
          e.currentTarget.style.display = 'none';
          const parent = e.currentTarget.parentElement;
          if (parent) {
            const textFallback = document.createElement('span');
            textFallback.className = 'text-xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400';
            textFallback.innerText = 'ShopSizzle';
            parent.appendChild(textFallback);
          }
        }}
      />
    </div>
  );
};