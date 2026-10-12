import React, { useState } from 'react';
import { X, Check, Ruler, MessageCircle, Truck, ShieldCheck, Clock, Scissors } from 'lucide-react';
import { Product, CustomMeasurements } from '../types';
import { useStore } from '../context/StoreContext';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onOpenSizeGuide: () => void;
  onBuyNow: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onOpenSizeGuide,
  onBuyNow,
}) => {
  const { addToCart, language, getWhatsAppLink } = useStore();

  if (!product) return null;

  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0]?.name || 'Standard');
  const [isStitched, setIsStitched] = useState<boolean>(product.stitchingOption !== 'Unstitched');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'details' | 'measurements'>('details');
  const [customMeasurements, setCustomMeasurements] = useState<CustomMeasurements>({
    unit: 'inches',
    chest: '',
    shoulder: '',
    shirtLength: '',
    sleeveLength: '',
    waist: '',
    trouserLength: '',
    specialInstructions: '',
  });

  const isCustomSize = selectedSize === 'Custom';

  const handleDirectBuy = () => {
    addToCart(
      product,
      selectedSize,
      selectedColor,
      isStitched,
      isCustomSize ? customMeasurements : undefined,
      quantity
    );
    onClose();
    onBuyNow();
  };

  const waOrderText = `Salam Zain Uniforms! I want to order / inquire about:\n- Product: ${product.name}\n- SKU: ${product.sku}\n- Size: ${selectedSize}${isCustomSize ? ' (Custom Measurements)' : ''}\n- Color: ${selectedColor}\n- Stitching: ${isStitched ? 'Stitched' : 'Unstitched'}\n- Quantity: ${quantity}\nPlease confirm availability and booking.`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white rounded-2xl max-w-4xl w-full shadow-2xl overflow-hidden max-h-[92vh] flex flex-col my-auto border border-slate-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/80 shrink-0">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <span className="font-mono text-slate-800">{product.sku}</span>
            <span aria-hidden="true">·</span>
            <span>{product.category}</span>
            <span aria-hidden="true">·</span>
            <span>{product.gender}</span>
          </div>

          <button
            onClick={onClose}
            aria-label="Close product details"
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Left: Gallery & Highlights */}
          <div className="md:col-span-5 space-y-4">
            <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
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
                className="w-full h-full object-cover"
              />
              {product.isMadeToOrder && (
                <div className="absolute top-3 left-3 bg-[#0F1E36] text-[#C5A869] text-xs font-medium px-2.5 py-1 rounded">
                  Made to Order: {product.productionDays} days
                </div>
              )}
            </div>

            {/* Fabric specs card */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F1E36]">
                Fabric & Construction
              </h4>
              <ul className="text-xs text-slate-600 space-y-1">
                {product.fabrics.map((fab, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C5A869]" />
                    <span>{fab}</span>
                  </li>
                ))}
              </ul>
              {product.careInstructions && (
                <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                  <span className="font-semibold text-slate-700">Care: </span>
                  {product.careInstructions}
                </p>
              )}
            </div>

            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#C5A869]" />
                <span>Nationwide Courier: {product.deliveryDaysEstimate}</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#C5A869]" />
                <span>7-Day Fit & Size Exchange Guarantee</span>
              </div>
            </div>
          </div>

          {/* Right: Purchase Module */}
          <div className="md:col-span-7 space-y-5">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#0F1E36]">
                {language === 'ur' ? product.nameUrdu : product.name}
              </h2>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                {language === 'ur' ? product.descriptionUrdu : product.description}
              </p>
            </div>

            {/* Tailoring & Sizing Highlight */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-[#0F1E36]">
                  School Specification Grade
                </div>
                <p className="text-[11px] text-slate-500 font-medium">
                  Stitched to standard sizes or bespoke student measurements
                </p>
              </div>
              <div className="text-right">
                <div className="text-xs font-semibold text-slate-700">
                  Wholesale & School Bulk
                </div>
                <div className="text-[11px] text-slate-500">
                  MOQ: {product.minWholesaleQty} units for institutions
                </div>
              </div>
            </div>

            {/* Stitching Option (if product supports both) */}
            {product.stitchingOption === 'Both' && (
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Scissors className="w-3.5 h-3.5 text-[#C5A869]" />
                  <span>Stitching Preference:</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setIsStitched(true)}
                    className={`py-2 px-3 text-xs font-semibold rounded-lg border text-center transition-all cursor-pointer ${
                      isStitched
                        ? 'border-[#0F1E36] bg-[#0F1E36] text-white shadow-xs'
                        : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400'
                    }`}
                  >
                    Stitched (Ready to Wear)
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsStitched(false)}
                    className={`py-2 px-3 text-xs font-semibold rounded-lg border text-center transition-all cursor-pointer ${
                      !isStitched
                        ? 'border-[#0F1E36] bg-[#0F1E36] text-white shadow-xs'
                        : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400'
                    }`}
                  >
                    Unstitched Fabric
                  </button>
                </div>
              </div>
            )}

            {/* Colors */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 block">
                Colour: <span className="text-slate-500 font-normal">{selectedColor}</span>
              </label>
              <div className="flex items-center gap-2 flex-wrap">
                {product.colors.map(col => (
                  <button
                    key={col.name}
                    type="button"
                    onClick={() => setSelectedColor(col.name)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs cursor-pointer transition-all ${
                      selectedColor === col.name
                        ? 'border-[#0F1E36] bg-slate-100 font-semibold text-[#0F1E36]'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0"
                      style={{ backgroundColor: col.hex }}
                    />
                    <span>{col.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700">
                  Select Size:
                </label>
                <button
                  type="button"
                  onClick={onOpenSizeGuide}
                  className="text-xs text-[#C5A869] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>Size Chart & Guide</span>
                </button>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                {product.sizes.map(sz => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setSelectedSize(sz)}
                    className={`py-2 text-xs font-semibold rounded-lg border text-center transition-all cursor-pointer ${
                      selectedSize === sz
                        ? 'border-[#0F1E36] bg-[#0F1E36] text-white shadow-xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Conditional Custom Measurements Input */}
            {isCustomSize && (
              <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                    <Ruler className="w-4 h-4 text-[#C5A869]" />
                    <span>Enter Custom Measurements ({customMeasurements.unit})</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setCustomMeasurements(prev => ({ ...prev, unit: 'inches' }))}
                      className={`px-2 py-0.5 rounded text-[11px] font-medium cursor-pointer ${
                        customMeasurements.unit === 'inches' ? 'bg-[#0F1E36] text-white' : 'text-slate-600'
                      }`}
                    >
                      Inches
                    </button>
                    <button
                      type="button"
                      onClick={() => setCustomMeasurements(prev => ({ ...prev, unit: 'cm' }))}
                      className={`px-2 py-0.5 rounded text-[11px] font-medium cursor-pointer ${
                        customMeasurements.unit === 'cm' ? 'bg-[#0F1E36] text-white' : 'text-slate-600'
                      }`}
                    >
                      CM
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-1">Chest</label>
                    <input
                      type="text"
                      placeholder="e.g. 32"
                      value={customMeasurements.chest || ''}
                      onChange={e => setCustomMeasurements({ ...customMeasurements, chest: e.target.value })}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white text-slate-900 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-1">Shoulder</label>
                    <input
                      type="text"
                      placeholder="e.g. 14.5"
                      value={customMeasurements.shoulder || ''}
                      onChange={e => setCustomMeasurements({ ...customMeasurements, shoulder: e.target.value })}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white text-slate-900 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-1">Shirt Length</label>
                    <input
                      type="text"
                      placeholder="e.g. 26"
                      value={customMeasurements.shirtLength || ''}
                      onChange={e => setCustomMeasurements({ ...customMeasurements, shirtLength: e.target.value })}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white text-slate-900 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-1">Sleeve</label>
                    <input
                      type="text"
                      placeholder="e.g. 22"
                      value={customMeasurements.sleeveLength || ''}
                      onChange={e => setCustomMeasurements({ ...customMeasurements, sleeveLength: e.target.value })}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white text-slate-900 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-1">Waist</label>
                    <input
                      type="text"
                      placeholder="e.g. 28"
                      value={customMeasurements.waist || ''}
                      onChange={e => setCustomMeasurements({ ...customMeasurements, waist: e.target.value })}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white text-slate-900 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-1">Trouser Length</label>
                    <input
                      type="text"
                      placeholder="e.g. 36"
                      value={customMeasurements.trouserLength || ''}
                      onChange={e => setCustomMeasurements({ ...customMeasurements, trouserLength: e.target.value })}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white text-slate-900 text-xs"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[11px] text-slate-600 mb-1">Tailor Note (optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Child is 12 years old, slim build"
                      value={customMeasurements.specialInstructions || ''}
                      onChange={e => setCustomMeasurements({ ...customMeasurements, specialInstructions: e.target.value })}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white text-slate-900 text-xs"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Quantity Stepper & Stock */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-700">Quantity:</span>
                <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-white">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 font-bold text-sm cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-4 py-1.5 text-xs font-bold text-slate-800 font-mono">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 font-bold text-sm cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="text-right text-xs text-slate-500">
                <span className="font-semibold text-emerald-600">● In Stock & Ready</span>
                <span className="block text-[11px] text-slate-400 font-mono">
                  {quantity} unit(s) selected
                </span>
              </div>
            </div>

            {/* CTAs: Order Booking & WhatsApp */}
            <div className="space-y-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={handleDirectBuy}
                className="w-full py-3.5 px-4 bg-[#C5A869] hover:bg-[#d5b97d] text-[#0F1E36] rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <span>Submit Order Booking</span>
              </button>

              <a
                href={getWhatsAppLink(waOrderText)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>Inquire on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
