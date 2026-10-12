import React from 'react';
import { Eye, MessageCircle } from 'lucide-react';
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
    <div className="group bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      {/* Product Image Area */}
      <div className="relative aspect-4/3 overflow-hidden bg-slate-100 cursor-pointer" onClick={() => onViewDetails(product)}>
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
          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
        />

        {/* Quiet top badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
          <span className="text-[10px] font-semibold tracking-wider uppercase bg-[#0F1E36]/90 text-white px-2 py-0.5 rounded">
            {product.category}
          </span>
          {product.isMadeToOrder && (
            <span className="text-[10px] font-medium bg-[#C5A869] text-[#0F1E36] px-2 py-0.5 rounded">
              Made to Order ({product.productionDays}d)
            </span>
          )}
        </div>

        {/* Quick View Hover Action */}
        <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(product);
            }}
            className="px-4 py-2 bg-white text-[#0F1E36] text-xs font-semibold rounded-lg shadow-sm hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Details</span>
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata line without pill badges */}
          <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-1">
            <span className="font-mono text-slate-600">{product.sku}</span>
            <span aria-hidden="true">·</span>
            <span>{product.gender}</span>
            <span aria-hidden="true">·</span>
            <span>{product.stitchingOption}</span>
          </div>

          <h3
            onClick={() => onViewDetails(product)}
            className="text-sm sm:text-base font-bold text-[#0F1E36] hover:text-[#C5A869] transition-colors cursor-pointer line-clamp-1"
            title={product.name}
          >
            {language === 'ur' ? product.nameUrdu : product.name}
          </h3>

          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
            {language === 'ur' ? product.descriptionUrdu : product.description}
          </p>

          {/* Available Sizes List */}
          <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] text-slate-400 font-medium">Sizes:</span>
            {product.sizes.slice(0, 5).map(sz => (
              <span
                key={sz}
                className="text-[11px] font-mono px-1.5 py-0.2 bg-slate-100 rounded text-slate-700"
              >
                {sz}
              </span>
            ))}
            {product.sizes.length > 5 && (
              <span className="text-[10px] text-slate-400">+{product.sizes.length - 5}</span>
            )}
          </div>
        </div>

        {/* Sizing & Actions */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <div className="text-xs font-semibold text-[#0F1E36]">
              Made to Fit & Measure
            </div>
            <div className="text-[10px] text-slate-500">
              Bulk MOQ: {product.minWholesaleQty} pcs
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <a
              href={getWhatsAppLink(waMsg)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Inquire on WhatsApp"
              className="p-2 text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer"
              title="Inquire on WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
            </a>

            <button
              onClick={() => onViewDetails(product)}
              className="px-3.5 py-1.5 text-xs font-semibold bg-[#0F1E36] hover:bg-slate-800 text-white rounded-lg transition-colors cursor-pointer"
            >
              Order Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
