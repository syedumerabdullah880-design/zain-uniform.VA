import React from 'react';
import { ArrowRight, Scissors, Building2, MessageCircle, CheckCircle2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface HeroProps {
  onShopClick: () => void;
  onCustomClick: () => void;
  onBulkClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onShopClick, onCustomClick, onBulkClick }) => {
  const { settings, language, getWhatsAppLink } = useStore();

  const heroImage = '/src/assets/images/hero_pakistan_uniforms_1791745324118.jpg';

  const defaultWhatsAppMsg = 'Salam Zain Uniforms! I am looking for school uniforms and would like details on sizes and availability.';

  return (
    <section className="relative bg-[#0F1E36] text-white overflow-hidden border-b border-[#1E293B]">
      {/* Background subtle texture glow */}
      <div className="absolute inset-0 bg-radial from-slate-800/40 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-18 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Authentic Brand Copy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#C5A869]">
              <span>Made in Pakistan</span>
              <span aria-hidden="true">·</span>
              <span>Industrial Stitching Unit</span>
              <span aria-hidden="true">·</span>
              <span>Nationwide Dispatch</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-[1.15] text-balance">
              {language === 'ur' ? (
                <span className="font-urdu leading-relaxed">آپ کی اسکول یونیفارم، بہترین سلائی اور درست ناپ کے ساتھ</span>
              ) : (
                <>
                  Your School Uniform, <br className="hidden sm:inline" />
                  <span className="text-[#C5A869]">Made to Fit.</span>
                </>
              )}
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
              {language === 'ur'
                ? 'پاکستانی اسکولوں، والدین اور ہول سیل خریداروں کے لیے معیاری اسکول یونیفارم، کسٹم سلائی اور بلک آرڈرز۔ اسلام آباد سے پورے پاکستان میں ترسیل۔'
                : 'Quality school uniforms, custom stitching, and bulk orders — crafted for Pakistani schools, families, and businesses.'}
            </p>

            {/* CTAs Cluster */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onShopClick}
                className="px-6 py-3 text-sm font-semibold text-[#0F1E36] bg-[#C5A869] hover:bg-[#d8bd81] rounded-lg transition-all duration-150 flex items-center gap-2 cursor-pointer shadow-sm hover:translate-y-[-1px]"
              >
                <span>{language === 'ur' ? 'یونیفارم دیکھیں' : 'Shop Uniforms'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onCustomClick}
                className="px-5 py-3 text-sm font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-all duration-150 flex items-center gap-2 cursor-pointer hover:border-[#C5A869]/50"
              >
                <Scissors className="w-4 h-4 text-[#C5A869]" />
                <span>{language === 'ur' ? 'کسٹم سلائی آرڈر' : 'Custom Uniform Order'}</span>
              </button>

              <button
                onClick={onBulkClick}
                className="px-5 py-3 text-sm font-semibold text-slate-300 hover:text-white bg-transparent hover:bg-slate-800/60 border border-slate-700/80 rounded-lg transition-all duration-150 flex items-center gap-2 cursor-pointer"
              >
                <Building2 className="w-4 h-4 text-slate-400" />
                <span>{language === 'ur' ? 'بلک و اسکول آرڈرز' : 'Bulk & School Orders'}</span>
              </button>
            </div>

            {/* Direct WhatsApp Callout in Hero */}
            <div className="pt-2 flex items-center gap-4">
              <a
                href={getWhatsAppLink(defaultWhatsAppMsg)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-emerald-400 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-700/60 rounded-lg transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>{language === 'ur' ? 'واٹس ایپ پر آرڈر کریں' : 'Order on WhatsApp: Fast Quote'}</span>
              </a>
              <span className="text-xs text-slate-400">
                Direct Tailoring Support
              </span>
            </div>

            {/* Quick Proof Strip */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-800 max-w-lg text-xs text-slate-300">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A869] shrink-0" />
                <span>Pre-washed Fabrics</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A869] shrink-0" />
                <span>Master Tailor Cut</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A869] shrink-0" />
                <span>Custom Fit Guarantee</span>
              </div>
            </div>
          </div>

          {/* Right Column: Authentic Photography Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-slate-700/80 shadow-2xl bg-slate-900">
              <img
                src={heroImage}
                alt="Pakistani school students in crisp navy and white Zain Uniforms"
                referrerPolicy="no-referrer"
                className="w-full h-[380px] sm:h-[450px] object-cover object-top hover:scale-[1.01] transition-transform duration-500"
              />
              {/* Subtle natural bottom gradient scrim */}
              <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-[#0B1526]/95 via-[#0B1526]/60 to-transparent flex items-end justify-between">
                <div>
                  <p className="text-xs font-semibold text-white tracking-wide">
                    Authentic Pakistani School Uniforms
                  </p>
                  <p className="text-[11px] text-slate-300">
                    Precision-stitched in Islamabad for schools nationwide
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-mono text-[#C5A869] bg-slate-900/90 px-2 py-1 rounded border border-slate-700">
                    Est. 2008
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
