import React from 'react';
import { Eye, MessageCircle, ShieldCheck } from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
  onQuickAdd?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onViewDetails,
}) => {
  const { language, getWhatsAppLink } = useStore();

  const waMsg = `Hello Zain Uniforms, I want to inquire about: ${product.name} (SKU: ${product.sku}). Is this currently available?`;

  return (
    <div className="group bg-white rounded-xl border border-slate-200/80 hover:border-[#0F1E36]/30 overflow-hidden shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between">
      {/* Product Image Area */}
      <div className="relative aspect-4/3 overflow-hidden bg-slate-50 cursor-pointer" onClick={() => onViewDetails(product)}>
        <img
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          onError={(e) => {
            const target = e.currentTarget;
            if (!target.src.includes('product_formal_shirt')) {
              target.src = '/images/product_formal_shirt_1791745342211.jpg';
            }
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Clean minimal top badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center">
          <span className="text-[10px] font-semibold tracking-wider uppercase bg-[#0F1E36] text-white px-2.5 py-1 rounded-md shadow-xs">
            {product.category}
          </span>
          {product.isMadeToOrder && (
            <span className="text-[10px] font-medium bg-[#C5A869] text-[#0F1E36] px-2.5 py-1 rounded-md shadow-xs">
              Custom ({product.productionDays}d)
            </span>
          )}
        </div>

        {/* Hover Action Overlay */}
        <div className="absolute inset-0 bg-[#0F1E36]/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4 backdrop-blur-[1px]">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(product);
            }}
            className="px-4 py-2 bg-white text-[#0F1E36] text-xs font-bold rounded-xl shadow-md hover:bg-slate-50 transition-transform active:scale-95 flex items-center gap-1.5 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span className="font-mono font-medium text-slate-600">{product.sku}</span>
            <span className="font-medium text-[#C5A869]">{product.gender} · {product.stitchingOption}</span>
          </div>

          <h3
            onClick={() => onViewDetails(product)}
            className="text-base font-bold text-[#0F1E36] hover:text-[#C5A869] transition-colors cursor-pointer line-clamp-1"
            title={product.name}
          >
            {language === 'ur' ? product.nameUrdu : product.name}
          </h3>

          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {language === 'ur' ? product.descriptionUrdu : product.description}
          </p>

          {/* Available Sizes Pills */}
          <div className="pt-2 flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] text-slate-400 font-medium">Sizes:</span>
            {product.sizes.slice(0, 5).map(sz => (
              <span
                key={sz}
                className="text-[10px] font-mono px-2 py-0.5 bg-slate-100 rounded-md text-slate-700 font-medium"
              >
                {sz}
              </span>
            ))}
            {product.sizes.length > 5 && (
              <span className="text-[10px] text-slate-400 font-medium">+{product.sizes.length - 5}</span>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
            <ShieldCheck className="w-4 h-4 text-[#C5A869]" />
            <span>Verified Fit</span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={getWhatsAppLink(waMsg)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Inquire on WhatsApp"
              className="p-2 text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors cursor-pointer"
              title="Inquire on WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
            </a>

            <button
              onClick={() => onViewDetails(product)}
              className="px-4 py-2 text-xs font-semibold bg-[#0F1E36] hover:bg-slate-800 text-white rounded-xl transition-colors cursor-pointer shadow-2xs"
            >
              Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

