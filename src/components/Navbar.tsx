import React, { useState } from 'react';
import { ShoppingBag, Search, Menu, X, Globe, Phone, ShieldCheck } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface NavbarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  openCart: () => void;
  openSearch: () => void;
  openSizeGuide: () => void;
  openAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  setActiveView,
  openCart,
  openSearch,
  openSizeGuide,
  openAdmin,
}) => {
  const { settings, cartCount, language, toggleLanguage, getWhatsAppLink } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (view: string) => {
    setActiveView(view);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { id: 'shop', labelEn: 'Shop Uniforms', labelUr: 'یونیفارم شاپ' },
    { id: 'custom', labelEn: 'Custom Stitching', labelUr: 'کسٹم سلائی' },
    { id: 'wholesale', labelEn: 'School & Bulk', labelUr: 'اسکول اور ہول سیل' },
    { id: 'track', labelEn: 'Track Order', labelUr: 'آرڈر ٹریکنگ' },
    { id: 'about', labelEn: 'Our Workshop', labelUr: 'ہماری ورکشاپ' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0F1E36] text-white shadow-sm border-b border-[#1E293B]">
      {/* Top subtle notification strip */}
      {settings.announcement && (
        <div className="bg-[#0B1526] text-slate-300 text-xs py-1.5 px-4 border-b border-slate-800/80">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 truncate">
              <span className="text-[#C5A869] font-medium tracking-wide">NOTICE:</span>
              <span className="truncate">{settings.announcement}</span>
            </div>
            <div className="hidden sm:flex items-center gap-4 text-[11px] shrink-0 text-slate-400">
              <a
                href={getWhatsAppLink('Hello Zain Uniforms, I need assistance with an order.')}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors flex items-center gap-1"
              >
                <Phone className="w-3 h-3 text-[#C5A869]" />
                <span>WhatsApp: {settings.phone}</span>
              </a>
              <span className="text-slate-600">|</span>
              <button
                onClick={openAdmin}
                className="hover:text-white transition-colors flex items-center gap-1 text-slate-400"
                title="Management Portal"
              >
                <ShieldCheck className="w-3 h-3 text-[#C5A869]" />
                <span>Admin</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Navigation - Strict Top Bar Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-18">
          {/* Zone 1: Brand Wordmark (Single element) */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 text-left focus:outline-none group cursor-pointer shrink-0"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#1E293B] to-[#0B1526] border border-[#C5A869]/40 flex items-center justify-center text-[#C5A869] font-bold text-lg shadow-inner">
              ZU
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-white block">
                Zain Uniforms
              </span>
              <span className="text-[10px] uppercase tracking-widest text-[#C5A869] block -mt-1 font-medium">
                Tailored in Pakistan
              </span>
            </div>
          </button>

          {/* Zone 2: Navigation Links (Single-line, unboxed) */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-200">
            {navLinks.map(item => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`transition-colors whitespace-nowrap cursor-pointer hover:text-[#C5A869] relative py-1 ${
                  activeView === item.id
                    ? 'text-white font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#C5A869]'
                    : 'text-slate-300'
                }`}
              >
                {language === 'ur' ? item.labelUr : item.labelEn}
              </button>
            ))}
            <button
              onClick={openSizeGuide}
              className="text-slate-300 hover:text-[#C5A869] transition-colors whitespace-nowrap cursor-pointer text-sm font-medium"
            >
              {language === 'ur' ? 'سائز گائیڈ' : 'Size Guide'}
            </button>
          </nav>

          {/* Zone 3: Primary Action & Quick Tools */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Search trigger */}
            <button
              onClick={openSearch}
              aria-label="Search uniforms"
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Language switch */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer border border-slate-700/60"
              title="Toggle English / اردو"
            >
              <Globe className="w-3.5 h-3.5 text-[#C5A869]" />
              <span>{language === 'en' ? 'اردو' : 'EN'}</span>
            </button>

            {/* Cart Trigger */}
            <button
              onClick={openCart}
              aria-label="View shopping cart"
              className="relative p-2.5 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-lg text-white transition-colors cursor-pointer flex items-center gap-2"
            >
              <ShoppingBag className="w-5 h-5 text-[#C5A869]" />
              <span className="hidden sm:inline text-xs font-semibold">
                Cart
              </span>
              {cartCount > 0 && (
                <span className="px-1.5 py-0.2 bg-[#C5A869] text-[#0F1E36] text-[11px] font-bold rounded-full">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Primary Action Button */}
            <button
              onClick={() => handleNavClick('shop')}
              className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-[#0F1E36] bg-[#C5A869] hover:bg-[#d5b97d] transition-colors rounded-lg whitespace-nowrap cursor-pointer shadow-sm"
            >
              {language === 'ur' ? 'آرڈر کریں' : 'Shop Uniforms'}
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-300 hover:text-white rounded-lg cursor-pointer"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0F1E36] border-t border-slate-800 px-4 pt-3 pb-6 space-y-3">
          <div className="flex flex-col space-y-1">
            {navLinks.map(item => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-left px-3 py-2.5 rounded-md text-sm font-medium ${
                  activeView === item.id
                    ? 'bg-slate-800 text-[#C5A869]'
                    : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                }`}
              >
                {language === 'ur' ? item.labelUr : item.labelEn}
              </button>
            ))}
            <button
              onClick={() => {
                openSizeGuide();
                setMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2.5 rounded-md text-sm font-medium text-slate-300 hover:bg-slate-800/50 hover:text-white"
            >
              {language === 'ur' ? 'سائز گائیڈ' : 'Size Guide'}
            </button>
            <button
              onClick={() => {
                openAdmin();
                setMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2.5 rounded-md text-sm font-medium text-slate-400 hover:bg-slate-800/50 hover:text-white flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-[#C5A869]" />
              <span>Admin Dashboard</span>
            </button>
          </div>

          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
            <a
              href={getWhatsAppLink('Hello Zain Uniforms, I would like to inquire about school uniforms.')}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
            >
              <span>Order on WhatsApp: {settings.phone}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
