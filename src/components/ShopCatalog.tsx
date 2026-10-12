import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product, UniformCategory, Gender } from '../types';
import { ProductCard } from './ProductCard';

interface ShopCatalogProps {
  selectedCategory: UniformCategory | 'All';
  onCategoryChange: (cat: UniformCategory | 'All') => void;
  onViewProduct: (product: Product) => void;
  onQuickAdd?: (product: Product) => void;
}

export const ShopCatalog: React.FC<ShopCatalogProps> = ({
  selectedCategory,
  onCategoryChange,
  onViewProduct,
}) => {
  const { products, language } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGender, setSelectedGender] = useState<Gender | 'All'>('All');
  const [selectedStitching, setSelectedStitching] = useState<'All' | 'Stitched' | 'Unstitched'>('All');
  const [sortBy, setSortBy] = useState<'featured' | 'name' | 'category'>('featured');

  const categories: (UniformCategory | 'All')[] = [
    'All',
    'School Shirts',
    'Trousers & Pants',
    'Skirts & Pinafores',
    'Blazers & Sweaters',
    'Sports Uniforms',
    'Accessories',
    'Medical & Healthcare Uniforms',
  ];

  const filteredProducts = useMemo(() => {
    return products
      .filter(p => {
        // Category
        if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
        // Gender
        if (selectedGender !== 'All' && p.gender !== selectedGender && p.gender !== 'Unisex') return false;
        // Stitching
        if (selectedStitching === 'Stitched' && p.stitchingOption === 'Unstitched') return false;
        if (selectedStitching === 'Unstitched' && p.stitchingOption === 'Stitched') return false;
        // Search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const match =
            p.name.toLowerCase().includes(q) ||
            p.nameUrdu.includes(q) ||
            p.sku.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q);
          if (!match) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'category') return a.category.localeCompare(b.category);
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [products, selectedCategory, selectedGender, selectedStitching, searchQuery, sortBy]);

  return (
    <div className="py-10 sm:py-14 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#C5A869] mb-1">
            <span>School Uniform Catalog</span>
            <span aria-hidden="true">·</span>
            <span>All Grades & Sizes</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0F1E36]">
                {language === 'ur' ? 'اسکول یونیفارم کی تمام اشیاء' : 'School Uniforms Collection'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Showing {filteredProducts.length} verified school-ready items with bespoke master stitching options.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search shirts, blazers, trousers..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-xs bg-white text-slate-900 focus:outline-none focus:border-[#0F1E36]"
              />
            </div>
          </div>
        </div>

        {/* Category Tab Navigation */}
        <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#0F1E36] text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Filter & Sort Bar */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 mb-8 shadow-2xs flex flex-wrap items-center justify-between gap-4 text-xs">
          {/* Gender Filter Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-slate-500 font-medium">Gender:</span>
            {(['All', 'Boys', 'Girls', 'Unisex'] as (Gender | 'All')[]).map(g => (
              <button
                key={g}
                onClick={() => setSelectedGender(g)}
                className={`px-2.5 py-1 rounded text-xs cursor-pointer ${
                  selectedGender === g
                    ? 'bg-slate-900 text-white font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {g}
              </button>
            ))}

            <span className="text-slate-300 mx-1">|</span>

            {/* Stitching */}
            <span className="text-slate-500 font-medium">Make:</span>
            {(['All', 'Stitched', 'Unstitched'] as const).map(st => (
              <button
                key={st}
                onClick={() => setSelectedStitching(st)}
                className={`px-2.5 py-1 rounded text-xs cursor-pointer ${
                  selectedStitching === st
                    ? 'bg-slate-900 text-white font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-medium">Sort:</span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="px-2.5 py-1 border border-slate-300 rounded bg-white text-xs text-slate-800"
              >
                <option value="featured">Popular / Featured</option>
                <option value="name">Alphabetical (A-Z)</option>
                <option value="category">By Category</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
            <SlidersHorizontal className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-[#0F1E36]">No Uniforms Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No products matched your active filters. Try adjusting your search query, gender, or category.
            </p>
            <button
              onClick={() => {
                onCategoryChange('All');
                setSelectedGender('All');
                setSelectedStitching('All');
                setSearchQuery('');
              }}
              className="px-4 py-2 bg-[#0F1E36] text-white rounded-lg text-xs font-semibold cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={onViewProduct}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
