import React, { useState } from 'react';
import { Search, Menu, X, Globe, Phone, ShieldCheck, Award } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { BrandLogo } from './BrandLogo';

interface NavbarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  openSearch: () => void;
  openSizeGuide: () => void;
  openAdmin: () => void;
  openProfile?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  setActiveView,
  openSearch,
  openSizeGuide,
  openAdmin,
  openProfile,
}) => {
  const { settings, language, toggleLanguage, getWhatsAppLink } = useStore();
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
            <div className="hidden sm:flex items-center gap-3 text-[11px] shrink-0 text-slate-400">
              <a
                href={getWhatsAppLink('Hello Zain Uniforms, I need assistance with an order.', settings.whatsappNumber)}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors flex items-center gap-1 font-mono"
              >
                <Phone className="w-3 h-3 text-[#C5A869]" />
                <span>{settings.phone}</span>
              </a>
              <span className="text-slate-600">|</span>
              <a
                href={getWhatsAppLink('Hello Zain Uniforms, I need assistance with an order.', settings.whatsappNumber2 || '923145357249')}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors flex items-center gap-1 font-mono"
              >
                <Phone className="w-3 h-3 text-[#C5A869]" />
                <span>{settings.phone2 || '03145357249'}</span>
              </a>
              <span className="text-slate-600">|</span>
              <button
                onClick={openProfile}
                className="hover:text-white transition-colors flex items-center gap-1 text-slate-300 font-medium"
                title="Official Business Profile"
              >
                <Award className="w-3 h-3 text-[#C5A869]" />
                <span>Profile</span>
              </button>
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
          {/* Zone 1: Brand Wordmark with Official ZYN Logo */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 text-left focus:outline-none group cursor-pointer shrink-0"
            title="Zain Uniforms - Home"
          >
            <BrandLogo variant="banner" size="md" />
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
                openProfile?.();
                setMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2.5 rounded-md text-sm font-medium text-slate-300 hover:bg-slate-800/50 hover:text-white flex items-center gap-2"
            >
              <Award className="w-4 h-4 text-[#C5A869]" />
              <span>Business Profile</span>
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
            <div className="grid grid-cols-2 gap-2">
              <a
                href={`tel:${settings.phone}`}
                className="flex items-center justify-center gap-1.5 py-2 px-2 text-[11px] font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
              >
                <Phone className="w-3.5 h-3.5 text-[#C5A869]" />
                <span>Call: {settings.phone}</span>
              </a>
              <a
                href={`tel:${settings.phone2 || '03145357249'}`}
                className="flex items-center justify-center gap-1.5 py-2 px-2 text-[11px] font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
              >
                <Phone className="w-3.5 h-3.5 text-[#C5A869]" />
                <span>Call: {settings.phone2 || '03145357249'}</span>
              </a>
            </div>
            <a
              href={getWhatsAppLink('Hello Zain Uniforms, I would like to inquire about school uniforms.', settings.whatsappNumber)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
            >
              <span>WhatsApp: {settings.phone} · {settings.phone2 || '03145357249'}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
