import React from 'react';
import { Layers, Scissors, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const ManufacturingShowcase: React.FC = () => {
  const { language } = useStore();
  const workshopImage = '/src/assets/images/craftsmanship_workshop_1791745387660.jpg';

  const steps = [
    {
      num: '01',
      titleEn: 'Fabric Selection & Lab Testing',
      titleUr: 'فیبرک کا انتخاب اور ٹیسٹنگ',
      descEn: 'We source high-density Oxford cotton, tropical poly-viscose, and wool suiting tested for colorfastness across 50+ wash cycles.',
      descUr: 'رنگ اور کپڑے کی پائیداری کے لیے لیب ٹیسٹ شدہ فیبرک کا انتخاب۔',
    },
    {
      num: '02',
      titleEn: 'Master Pattern Drafting & Cutting',
      titleUr: 'ماہر ماسٹر پیٹرن کٹنگ',
      descEn: 'Master cutters draft individualized and graded school patterns with internal growth allowances and comfort ease.',
      descUr: 'بچوں کے قد اور بڑھوتری کو مدنظر رکھتے ہوئے پیٹرن کٹنگ۔',
    },
    {
      num: '03',
      titleEn: 'Precision Industrial Stitching',
      titleUr: 'صنعتی معیار کی پکی سلائی',
      descEn: 'Heavy-duty twin-needle lockstitch machines, bartack stress-point reinforcements, and interlined non-curl collars.',
      descUr: 'ڈبل سلائی، مضبوط انٹرلائننگ کالر اور پائیدار بٹن۔',
    },
    {
      num: '04',
      titleEn: 'Double Quality Inspection',
      titleUr: 'کوالٹی اور سائز انسپیکشن',
      descEn: 'Every garment passes a strict 8-point measurement check against school standards and customer-submitted size charts.',
      descUr: 'ہر یونیفارم کے ناپ اور سلائی کی جامع جانچ۔',
    },
    {
      num: '05',
      titleEn: 'Steam Vacuum Pressing',
      titleUr: 'اسٹیم پریس اور فنشنگ',
      descEn: 'Commercial boiler-driven steam vacuum shaping gives crisp trouser creases, stiff collars, and immaculate presentation.',
      descUr: 'مستقل کریز اور شکن سے پاک شاندار فنشنگ۔',
    },
    {
      num: '06',
      titleEn: 'Protective Packing & Dispatch',
      titleUr: 'محفوظ پیکنگ اور ترسیل',
      descEn: 'Sealed moisture-proof garment wrapping dispatched via premier couriers with real-time tracking across Pakistan.',
      descUr: 'محفوظ ڈبوں میں پیکنگ اور ایکسپریس کوریئر ترسیل۔',
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with authentic brand story */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-16">
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#0F1E36] tracking-wider uppercase">
              <span>Pakistani Craftsmanship</span>
              <span aria-hidden="true">·</span>
              <span>Tailoring & Retail Center in Rawalpindi</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#0F1E36]">
              {language === 'ur'
                ? 'کپڑے سے مکمل یونیفارم تک کا شاندار سفر'
                : 'From Fabric to Finished Uniform'}
            </h2>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
              Zain Uniforms operates a dedicated uniform tailoring and retail center at koyla center, Shop#2867 Nishter St, Sadiqabad Rawalpindi. We combine traditional tailoring craftsmanship with precision so your children and students wear uniforms that look distinguished and withstand the demanding school year.
            </p>

            <div className="flex items-center gap-6 pt-2 text-xs text-slate-700 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#C5A869]" />
                <span>Zero Outsourcing</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#C5A869]" />
                <span>Tested Wash Durability</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#C5A869]" />
                <span>Direct Workshop Pricing</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100">
              <img
                src={workshopImage}
                alt="Master tailor cutting navy school uniform fabric in Rawalpindi workshop"
                referrerPolicy="no-referrer"
                className="w-full h-[280px] object-cover"
              />
              <div className="p-3 bg-slate-50 text-[11px] text-slate-600 flex justify-between">
                <span>Zain Uniforms · Sadiqabad, Rawalpindi</span>
                <span className="font-semibold text-[#0F1E36]">Master Pattern Cutting</span>
              </div>
            </div>
          </div>
        </div>

        {/* 6 Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map(step => (
            <div
              key={step.num}
              className="p-6 bg-slate-50/70 rounded-xl border border-slate-200/80 flex flex-col justify-between hover:bg-white hover:shadow-xs transition-all duration-200"
            >
              <div>
                <div className="text-xl font-bold font-mono text-[#C5A869] mb-2">
                  {step.num}
                </div>
                <h3 className="text-sm font-bold text-[#0F1E36]">
                  {language === 'ur' ? step.titleUr : step.titleEn}
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {language === 'ur' ? step.descUr : step.descEn}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
