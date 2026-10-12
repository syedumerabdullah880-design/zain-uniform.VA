import React from 'react';
import { Star, ShieldCheck, Sparkles, Ruler, Building2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const TestimonialsSection: React.FC = () => {
  const { testimonials, language } = useStore();

  const whyCards = [
    {
      icon: Sparkles,
      titleEn: 'Quality Fabrics',
      titleUr: 'اعلیٰ پائیدار فیبرک',
      descEn: 'Selected high-count cotton blends and wrinkle-resistant suiting designed to endure everyday playground wear and weekly washing.',
    },
    {
      icon: ShieldCheck,
      titleEn: 'Professional Stitching',
      titleUr: 'پیشہ ورانہ مضبوط سلائی',
      descEn: 'Lockstitched seams, double-knee reinforcement on trousers, and structured interlined collars that never curl.',
    },
    {
      icon: Ruler,
      titleEn: 'Custom Fit',
      titleUr: 'درست کسٹم ناپ',
      descEn: 'Standard size charts or bespoke measurements. Our pattern masters incorporate growth margins for growing children.',
    },
    {
      icon: Building2,
      titleEn: 'Retail to Bulk',
      titleUr: 'ریٹیل سے بلک آرڈرز تک',
      descEn: 'Dependable manufacturing for individual parents, whole school grade cohorts, and nationwide retail uniform shops.',
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-[#F8FAFC] border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Why Choose Cards */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-[#0F1E36] tracking-wider uppercase mb-2">
            <span>The Zain Uniforms Difference</span>
            <span aria-hidden="true">·</span>
            <span>Est. 2008</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0F1E36]">
            {language === 'ur' ? 'زین یونیفارمز کا انتخاب کیوں؟' : 'Why Choose Zain Uniforms'}
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            Craftsmanship, durability, and dependable service tailored for Pakistani educational institutions and families.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-18">
          {whyCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-[#0F1E36] mb-4">
                    <Icon className="w-5 h-5 text-[#C5A869]" />
                  </div>
                  <h3 className="text-sm font-bold text-[#0F1E36]">
                    {language === 'ur' ? card.titleUr : card.titleEn}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {card.descEn}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Customer Experiences / Reviews */}
        <div className="border-t border-slate-200/80 pt-14">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#C5A869]">
                Verified Experiences
              </span>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0F1E36] mt-1">
                Parent & School Administrator Feedback
              </h3>
            </div>
            <div className="text-xs text-slate-500 font-mono">
              Rawalpindi · Islamabad · Lahore · Karachi
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map(t => (
              <div
                key={t.id}
                className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-[#C5A869] mb-3">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#C5A869]" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed italic">
                    "{t.review}"
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100">
                  <div className="font-bold text-xs text-[#0F1E36]">{t.customerName}</div>
                  <div className="text-[11px] text-slate-500">{t.schoolOrBusiness} · {t.city}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
