import React from 'react';

interface BrandLogoProps {
  variant?: 'mark' | 'banner' | 'profile' | 'seal';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showSubtitle?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'mark',
  size = 'md',
  className = '',
  showSubtitle = true,
}) => {
  // Size dimensions mapping for mark/profile
  const sizeMap = {
    xs: { box: 'w-7 h-7', text: 'text-xs', sub: 'text-[8px]' },
    sm: { box: 'w-9 h-9', text: 'text-sm', sub: 'text-[9px]' },
    md: { box: 'w-11 h-11', text: 'text-lg', sub: 'text-[10px]' },
    lg: { box: 'w-14 h-14', text: 'text-xl', sub: 'text-xs' },
    xl: { box: 'w-20 h-20', text: 'text-2xl', sub: 'text-sm' },
  };

  const currentSize = sizeMap[size];

  // SVG Mark (ZYN Monogram on Luxury Deep Sapphire & Gold)
  const renderSvgMark = (customBoxClass?: string) => (
    <div
      className={`relative shrink-0 rounded-xl overflow-hidden shadow-md border border-[#C5A869]/50 bg-gradient-to-br from-[#12233f] via-[#0B1526] to-[#050B14] flex items-center justify-center group-hover:border-[#C5A869] transition-all ${
        customBoxClass || currentSize.box
      }`}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full p-1"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="logoGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FBF4DD" />
            <stop offset="40%" stopColor="#D4AF37" />
            <stop offset="75%" stopColor="#A37E22" />
            <stop offset="100%" stopColor="#E5C772" />
          </linearGradient>
          <linearGradient id="innerGlow" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Outer stitch border */}
        <rect
          x="6"
          y="6"
          width="88"
          height="88"
          rx="18"
          stroke="url(#logoGold)"
          strokeWidth="1.2"
          strokeDasharray="3 2"
          opacity="0.7"
        />

        {/* Ambient glow in center */}
        <circle cx="50" cy="48" r="30" fill="url(#innerGlow)" />

        {/* Tailor's Crown / Diamond Accent at top */}
        <polygon points="50,14 54,20 50,22 46,20" fill="url(#logoGold)" />
        <circle cx="50" cy="11" r="1.5" fill="url(#logoGold)" />

        {/* ZYN Monogram - Precision Crafted */}
        <g fill="url(#logoGold)">
          {/* Z */}
          <path d="M22 26 H45 L26 56 H47 V62 H20 L40 32 H22 Z" />

          {/* Y (centered) */}
          <path d="M44 26 L51 43 L58 26 H64 L54 48 V62 H48 V48 L38 26 Z" />

          {/* N */}
          <path d="M59 26 H65 L76 53 V26 H82 V62 H76 L65 35 V62 H59 Z" />
        </g>

        {/* Baseline Accent Bar with Diamond */}
        <line
          x1="22"
          y1="70"
          x2="78"
          y2="70"
          stroke="url(#logoGold)"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <polygon points="50,68 52,70 50,72 48,70" fill="url(#logoGold)" />

        {/* Micro Wordmark */}
        <text
          x="50"
          y="83"
          textAnchor="middle"
          fill="url(#logoGold)"
          fontSize="7.5"
          fontWeight="700"
          fontFamily="system-ui, sans-serif"
          letterSpacing="2"
        >
          ZAIN
        </text>
      </svg>
    </div>
  );

  // Variant 1: Pure Mark
  if (variant === 'mark') {
    return (
      <div className={`inline-flex items-center ${className}`}>
        {renderSvgMark()}
      </div>
    );
  }

  // Variant 2: Profile Badge (for Company / User Profile display)
  if (variant === 'profile') {
    return (
      <div className={`flex flex-col items-center text-center ${className}`}>
        <div className="relative mb-3">
          {/* Subtle outer glowing gold ring */}
          <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-r from-[#D4AF37] via-[#AA8220] to-[#E5C772] opacity-40 blur-xs" />
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shadow-2xl border-2 border-[#C5A869] bg-[#0A1322] flex items-center justify-center p-1">
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="profileGold" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFF2D1" />
                  <stop offset="35%" stopColor="#D4AF37" />
                  <stop offset="70%" stopColor="#9E791D" />
                  <stop offset="100%" stopColor="#E5C772" />
                </linearGradient>
              </defs>

              <rect
                x="4"
                y="4"
                width="92"
                height="92"
                rx="20"
                fill="#0F1E36"
                stroke="url(#profileGold)"
                strokeWidth="1.5"
              />
              <rect
                x="8"
                y="8"
                width="84"
                height="84"
                rx="16"
                fill="none"
                stroke="url(#profileGold)"
                strokeWidth="0.8"
                strokeDasharray="3 2"
                opacity="0.6"
              />

              {/* Crown Emblem */}
              <polygon points="50,14 54,20 50,22 46,20" fill="url(#profileGold)" />
              <circle cx="50" cy="11" r="1.5" fill="url(#profileGold)" />

              {/* ZYN Monogram */}
              <g fill="url(#profileGold)">
                <path d="M22 26 H45 L26 56 H47 V62 H20 L40 32 H22 Z" />
                <path d="M44 26 L51 43 L58 26 H64 L54 48 V62 H48 V48 L38 26 Z" />
                <path d="M59 26 H65 L76 53 V26 H82 V62 H76 L65 35 V62 H59 Z" />
              </g>

              {/* Divider & Wordmark */}
              <line
                x1="20"
                y1="70"
                x2="80"
                y2="70"
                stroke="url(#profileGold)"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
              <polygon points="50,68 52,70 50,72 48,70" fill="url(#profileGold)" />

              <text
                x="50"
                y="82"
                textAnchor="middle"
                fill="url(#profileGold)"
                fontSize="7"
                fontWeight="700"
                letterSpacing="2.5"
              >
                ZAIN UNIFORMS
              </text>
              <text
                x="50"
                y="90"
                textAnchor="middle"
                fill="#94A3B8"
                fontSize="4"
                fontWeight="500"
                letterSpacing="1.5"
              >
                RAWALPINDI · PAKISTAN
              </text>
            </svg>
          </div>
        </div>
        <div className="space-y-0.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#C5A869]/15 border border-[#C5A869]/40 text-[#C5A869] text-[11px] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C5A869] animate-pulse" />
            <span>Official Brand Profile</span>
          </div>
        </div>
      </div>
    );
  }

  // Variant 3: Circular Seal / Crest
  if (variant === 'seal') {
    return (
      <div className={`relative inline-flex items-center justify-center ${className}`}>
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#12233f] to-[#050B14] border-2 border-[#C5A869] shadow-lg flex items-center justify-center p-1.5">
          <svg viewBox="0 0 80 80" className="w-full h-full" fill="none">
            <defs>
              <linearGradient id="sealGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFF" />
                <stop offset="50%" stopColor="#D4AF37" />
                <stop offset="100%" stopColor="#8A6715" />
              </linearGradient>
            </defs>
            <circle cx="40" cy="40" r="36" stroke="url(#sealGold)" strokeWidth="1" strokeDasharray="2 2" />
            <g fill="url(#sealGold)">
              <path d="M16 22 H32 L19 44 H34 V48 H14 L28 26 H16 Z" />
              <path d="M33 22 L38 34 L43 22 H47 L40 38 V48 H36 V38 L29 22 Z" />
              <path d="M44 22 H49 L58 41 V22 H62 V48 H58 L49 29 V48 H44 Z" />
            </g>
            <text x="40" y="60" textAnchor="middle" fill="url(#sealGold)" fontSize="6" fontWeight="700" letterSpacing="1">
              TAILORED
            </text>
            <text x="40" y="68" textAnchor="middle" fill="#94A3B8" fontSize="4.5" letterSpacing="0.8">
              EST. 2026
            </text>
          </svg>
        </div>
      </div>
    );
  }

  // Variant 4: Banner (Emblem + Typography, used in Navbar and Footer)
  return (
    <div className={`inline-flex items-center gap-3 text-left ${className}`}>
      {renderSvgMark()}
      <div>
        <div className="flex items-center gap-1.5">
          <span className={`font-bold tracking-tight text-white block ${currentSize.text}`}>
            Zain Uniforms
          </span>
          <span className="hidden sm:inline-block px-1.5 py-0.2 rounded text-[9px] font-semibold bg-[#C5A869]/20 text-[#C5A869] border border-[#C5A869]/40 tracking-wider">
            ZYN
          </span>
        </div>
        {showSubtitle && (
          <span
            className={`uppercase tracking-widest text-[#C5A869] block font-medium ${currentSize.sub}`}
          >
            Tailored in Pakistan
          </span>
        )}
      </div>
    </div>
  );
};
