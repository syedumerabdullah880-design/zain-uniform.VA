import React from 'react';
import { Sparkles, Scissors, Ruler, Store, Truck, MessageCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const TrustBar: React.FC = () => {
  const { language } = useStore();

  const trustItems = [
    {
      icon: Sparkles,
      titleEn: 'Quality Fabrics',
      titleUr: 'معیاری کپڑا',
      descEn: 'Tested Oxford & twill blends',
      descUr: 'آزمودہ اور پائیدار فیبرک',
    },
    {
      icon: Scissors,
      titleEn: 'Professional Stitching',
      titleUr: 'ماہر درزی کی سلائی',
      descEn: 'Reinforced seams & collars',
      descUr: 'مضبوط پکی سلائی',
    },
    {
      icon: Ruler,
      titleEn: 'Custom Sizes',
      titleUr: 'درست ناپ',
      descEn: 'Made to exact measurements',
      descUr: 'کسٹم سائز کی سہولت',
    },
    {
      icon: Store,
      titleEn: 'Retail & Wholesale',
      titleUr: 'ریٹیل و ہول سیل',
      descEn: 'From 1 set to 10,000 units',
      descUr: 'والدین اور اسکولوں کے لیے',
    },
    {
      icon: Truck,
      titleEn: 'Nationwide Delivery',
      titleUr: 'ملک گیر ترسیل',
      descEn: 'Express courier across Pakistan',
      descUr: 'ٹی سی ایس و لیپرڈ کوریئر',
    },
    {
      icon: MessageCircle,
      titleEn: 'WhatsApp Support',
      titleUr: 'واٹس ایپ رابطہ',
      descEn: 'Instant tailoring consultation',
      descUr: 'براہ راست رہنمائی',
    },
  ];

  return (
    <section className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
          {trustItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex items-start gap-3.5 pt-3 sm:pt-0 sm:px-3 first:pt-0 first:pl-0"
              >
                <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-center shrink-0 text-[#0F1E36]">
                  <Icon className="w-5 h-5 text-[#C5A869]" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-[#0F1E36]">
                    {language === 'ur' ? item.titleUr : item.titleEn}
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    {language === 'ur' ? item.descUr : item.descEn}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
