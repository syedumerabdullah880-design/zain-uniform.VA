import React from 'react';
import { ArrowRight, ShieldCheck, Sparkles, MessageCircle, Trophy, Scissors } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { UniformCategory, Product } from '../types';

interface UniformsAndSportswearSectionProps {
  onSelectCategory: (cat: UniformCategory) => void;
  onViewProduct: (product: Product) => void;
}

export const UniformsAndSportswearSection: React.FC<UniformsAndSportswearSectionProps> = ({
  onSelectCategory,
  onViewProduct,
}) => {
  const { products, language, getWhatsAppLink } = useStore();

  const categoriesData = [
    {
      id: 'uniforms',
      title: 'Uniforms',
      urduTitle: 'پروفیشنل یونیفارمز',
      subtitle: 'General professional & work uniforms with custom tailoring and embroidery',
      features: [
        'General professional uniforms',
        'Work uniforms',
        'Custom uniforms',
        'Custom stitching and embroidery',
      ],
      image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=800',
      categoryKey: 'School Uniforms' as UniformCategory,
      tag: 'Professional Workwear',
    },
    {
      id: 'sportswear',
      title: 'Sportswear',
      urduTitle: 'اسپورٹس ویئر اور ٹریک سوٹس',
      subtitle: 'High-performance tracksuits, team jerseys, and school sports kits',
      features: [
        'Tracksuits',
        'Sports T-Shirts',
        'Sports Shorts',
        'School Sports Uniforms',
        'Custom Team Jerseys',
      ],
      image: 'https://images.unsplash.com/photo-1517649763962-0c6232660102?auto=format&fit=crop&q=80&w=800',
      categoryKey: 'Sports & House Uniforms' as UniformCategory,
      tag: 'Athletic Performance',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#0F1E36] tracking-wider uppercase bg-slate-100 px-3.5 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A869]" />
              <span>Specialized Collections</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0F1E36]">
              {language === 'ur' ? 'یونیفارمز اور اسپورٹس ویئر' : 'Uniforms & Sportswear Collection'}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Professional work uniforms, custom stitching, tracksuits, and high-performance school sportswear tailored with precision.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href={getWhatsAppLink('Salam Zain Uniforms! I would like to inquire about Custom Uniforms and Sportswear.')}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Get Custom Quote</span>
            </a>
          </div>
        </div>

        {/* 2 Clean Professional Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categoriesData.map((item) => (
            <div
              key={item.id}
              className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div className="relative h-64 sm:h-72 overflow-hidden bg-slate-100">
                <img
                  src={item.image}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-[#0F1E36]/90 backdrop-blur-xs text-[#C5A869] text-xs font-semibold px-3.5 py-1.5 rounded-lg shadow-sm">
                  {item.tag}
                </div>
              </div>

              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-[#0F1E36] group-hover:text-[#C5A869] transition-colors">
                    {language === 'ur' ? item.urduTitle : item.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {item.subtitle}
                  </p>

                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                    {item.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-center gap-2 text-xs font-medium text-slate-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C5A869]" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                  <button
                    onClick={() => onSelectCategory(item.categoryKey)}
                    className="inline-flex items-center gap-2 text-xs font-bold text-[#0F1E36] hover:text-[#C5A869] transition-colors cursor-pointer"
                  >
                    <span>Explore Range</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </button>

                  <a
                    href={getWhatsAppLink(`Salam Zain Uniforms! I am interested in ${item.title} (${item.features.join(', ')}). Please share details and pricing.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-slate-100 hover:bg-[#0F1E36] hover:text-white text-slate-800 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Request Quote
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
