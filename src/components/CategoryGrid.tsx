import React from 'react';
import { ArrowRight } from 'lucide-react';
import { UniformCategory } from '../types';
import { useStore } from '../context/StoreContext';

interface CategoryGridProps {
  onSelectCategory: (cat: UniformCategory) => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({ onSelectCategory }) => {
  const { language } = useStore();

  const categories: {
    category: UniformCategory;
    nameEn: string;
    nameUr: string;
    descEn: string;
    descUr: string;
    image: string;
    itemCount: string;
  }[] = [
    {
      category: 'School Shirts',
      nameEn: 'School Shirts',
      nameUr: 'اسکول شرٹس',
      descEn: 'Formal Oxford button-downs, Peter Pan collars, and combed pique polo shirts.',
      descUr: 'فارمل آکسفورڈ بٹن ڈاؤن اور گرمیوں کی آرام دہ پولو شرٹس۔',
      image: '/src/assets/images/product_formal_shirt_1791745342211.jpg',
      itemCount: 'Boys & Girls',
    },
    {
      category: 'Trousers & Pants',
      nameEn: 'Trousers & Pants',
      nameUr: 'ٹراؤزر و پینٹس',
      descEn: 'Crease-resistant suiting trousers with reinforced knees & elastic back waist.',
      descUr: 'ڈبل گھٹنے کی مضبوطی اور آل سیزن پولی وسکوز ٹراؤزرز۔',
      image: '/src/assets/images/craftsmanship_workshop_1791745387660.jpg',
      itemCount: 'Standard & Custom',
    },
    {
      category: 'Skirts & Pinafores',
      nameEn: 'Skirts & Pinafores',
      nameUr: 'پینا فور و اسکرٹس',
      descEn: 'Box-pleated pinafore dresses, modest school tunics, and matching collared ties.',
      descUr: 'مستقل پلیٹوں والے باوقار اسکول پینافور اور اسکرٹس۔',
      image: '/src/assets/images/product_girls_pinafore_1791745370566.jpg',
      itemCount: 'Stitched / Unstitched',
    },
    {
      category: 'Blazers & Sweaters',
      nameEn: 'Blazers & Sweaters',
      nameUr: 'بلیزر و سویٹرز',
      descEn: 'Tailored school crest wool blazers, V-neck pullovers, and school cardigans.',
      descUr: 'سرمائی اسکول کوٹ، کرسٹ بٹن اور اینٹی پِل سویٹرز۔',
      image: '/src/assets/images/product_navy_blazer_1791745358334.jpg',
      itemCount: 'Winter Uniforms',
    },
    {
      category: 'Sports Uniforms',
      nameEn: 'Sports Uniforms',
      nameUr: 'اسپورٹس کٹس و ٹریک سوٹ',
      descEn: 'Breathable micro-poly PE tracksuits, shorts, and school house color jerseys.',
      descUr: 'کھیلوں اور پی ٹی کے لیے ہوادار مائیکرو پولی کٹس۔',
      image: '/src/assets/images/hero_pakistan_uniforms_1791745324118.jpg',
      itemCount: 'PE & House Kits',
    },
    {
      category: 'Accessories',
      nameEn: 'Accessories',
      nameUr: 'ٹائی، بیلٹ و لوازمات',
      descEn: 'Embroidered school crest badges, jacquard woven ties, webbed belts, and socks.',
      descUr: 'اسکول ٹائی، بیلٹ، بیجز اور لازمی اسکول اسیسریز۔',
      image: '/src/assets/images/product_girls_pinafore_1791745370566.jpg',
      itemCount: 'Complete Sets',
    },
  ];

  return (
    <section className="py-14 sm:py-18 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with zero-pill metadata */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#0F1E36] tracking-wider uppercase mb-1">
              <span>Uniform Catalog</span>
              <span aria-hidden="true">·</span>
              <span>Class 1 to College</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0F1E36]">
              {language === 'ur' ? 'اسکول یونیفارم کیٹیگریز' : 'Shop School Uniforms'}
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-xl">
              Manufactured with high-durability school fabrics designed for daily classroom wear and Pakistani weather conditions.
            </p>
          </div>

          <div className="text-xs text-slate-500 font-medium">
            <span>Crafted in Rawalpindi</span>
            <span aria-hidden="true" className="mx-2">/</span>
            <span>Shipped Nationwide</span>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map(cat => (
            <div
              key={cat.category}
              onClick={() => onSelectCategory(cat.category)}
              className="group bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
            >
              <div className="relative h-48 overflow-hidden bg-slate-100">
                <img
                  src={cat.image}
                  alt={cat.nameEn}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 bg-[#0F1E36]/90 backdrop-blur-xs text-[#C5A869] text-[11px] font-semibold px-2.5 py-1 rounded">
                  {cat.itemCount}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-[#0F1E36] group-hover:text-[#C5A869] transition-colors">
                    {language === 'ur' ? cat.nameUr : cat.nameEn}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    {language === 'ur' ? cat.descUr : cat.descEn}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#0F1E36] group-hover:text-[#C5A869] transition-colors">
                  <span>{language === 'ur' ? 'اشیاء دیکھیں' : 'Explore Range'}</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
