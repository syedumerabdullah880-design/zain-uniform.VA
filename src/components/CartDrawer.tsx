import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Scissors, MessageCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  onProceedToCheckout,
}) => {
  const { cart, removeFromCart, updateCartQuantity, cartCount, language, getWhatsAppLink } = useStore();

  if (!isOpen) return null;

  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

  const waInquiryText = `Salam Zain Uniforms! I have selected the following uniform items for inquiry/order booking:\n` +
    cart.map(i => `• ${i.product.name} (Size: ${i.selectedSize}, Color: ${i.selectedColor}, ${i.isStitched ? 'Stitched' : 'Unstitched'}, Qty: ${i.quantity})`).join('\n') +
    `\n\nPlease confirm availability and dispatch schedule.`;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-slate-200">
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#C5A869]" />
            <h3 className="text-base font-bold text-[#0F1E36]">
              {language === 'ur' ? 'آپ کی منتخب یونیفارمز' : 'Uniform Request Bag'}
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              ({totalQuantity} items)
            </span>
          </div>

          <button
            onClick={onClose}
            aria-label="Close bag"
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tip Strip */}
        <div className="px-5 py-2.5 bg-slate-100 border-b border-slate-200 text-xs text-slate-700 shrink-0">
          <span>
            Selected uniforms can be booked directly or confirmed on WhatsApp with our master tailors.
          </span>
        </div>

        {/* Items List */}
        <div className="overflow-y-auto p-5 flex-1 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold text-slate-700">Your bag is empty</p>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Explore our school shirts, trousers, blazers, and sports uniforms to get started.
              </p>
              <button
                onClick={onClose}
                className="mt-2 px-5 py-2 bg-[#0F1E36] text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                Browse Uniforms
              </button>
            </div>
          ) : (
            cart.map(item => (
              <div
                key={item.id}
                className="flex gap-3.5 p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white transition-colors"
              >
                {/* Thumb */}
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  referrerPolicy="no-referrer"
                  className="w-18 h-20 object-cover rounded-lg bg-slate-100 border border-slate-200 shrink-0"
                />

                <div className="flex-1 flex flex-col justify-between text-xs">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="font-bold text-[#0F1E36] line-clamp-1">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-slate-400 hover:text-rose-600 transition-colors p-1 cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-[11px] text-slate-500 mt-0.5 space-y-0.5">
                      <div>
                        Size: <span className="font-semibold text-slate-700">{item.selectedSize}</span> · Color: <span className="font-semibold text-slate-700">{item.selectedColor}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Scissors className="w-3 h-3 text-[#C5A869]" />
                        <span>{item.isStitched ? 'Stitched Uniform' : 'Unstitched Fabric'}</span>
                      </div>
                      {item.customMeasurements && (
                        <span className="text-amber-800 font-medium block">
                          [Bespoke Measurements attached]
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 mt-1 border-t border-slate-200/60">
                    {/* Stepper */}
                    <div className="flex items-center border border-slate-300 rounded-md bg-white">
                      <button
                        onClick={() => updateCartQuantity(item.id, -1)}
                        className="px-2 py-0.5 text-slate-600 hover:bg-slate-100 cursor-pointer font-bold"
                      >
                        -
                      </button>
                      <span className="px-2.5 py-0.5 font-mono text-[11px] font-bold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.id, 1)}
                        className="px-2 py-0.5 text-slate-600 hover:bg-slate-100 cursor-pointer font-bold"
                      >
                        +
                      </button>
                    </div>

                    <span className="text-slate-600 text-xs font-medium">
                      Qty: <strong className="font-mono text-slate-800">{item.quantity}</strong>
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer / Submit Request */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-slate-200 bg-slate-50 space-y-3 shrink-0">
            <div className="flex justify-between items-center text-xs text-slate-700">
              <span>Total Selected Items:</span>
              <span className="font-mono font-bold text-slate-900 text-sm">
                {totalQuantity} pieces
              </span>
            </div>

            <button
              onClick={() => {
                onClose();
                onProceedToCheckout();
              }}
              className="w-full py-3 px-4 bg-[#0F1E36] hover:bg-[#1E293B] text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <span>Submit Order Booking</span>
              <ArrowRight className="w-4 h-4 text-[#C5A869]" />
            </button>

            <a
              href={getWhatsAppLink(waInquiryText)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>Send Bag to WhatsApp</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
