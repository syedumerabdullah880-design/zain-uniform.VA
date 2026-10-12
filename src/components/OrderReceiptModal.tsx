import React from 'react';
import { CheckCircle2, Printer, MessageCircle, X, Truck } from 'lucide-react';
import { Order } from '../types';
import { useStore } from '../context/StoreContext';
import { BrandLogo } from './BrandLogo';

interface OrderReceiptModalProps {
  order: Order | null;
  onClose: () => void;
  onTrackOrder: (orderNumber: string) => void;
}

export const OrderReceiptModal: React.FC<OrderReceiptModalProps> = ({
  order,
  onClose,
  onTrackOrder,
}) => {
  const { settings, getWhatsAppLink } = useStore();

  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const totalQuantity = order.items.reduce((sum, item) => sum + item.quantity, 0);

  const waText = `Salam Zain Uniforms! I have booked Order #${order.orderNumber} for ${totalQuantity} uniform item(s) (${order.customerName}). Please confirm reception and production timeline.`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden max-h-[92vh] flex flex-col border border-slate-200">
        {/* Header - Not printed */}
        <div className="no-print flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-emerald-50 text-emerald-950 shrink-0">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-bold">
              Order Booking Confirmed Successfully!
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-emerald-800 hover:text-emerald-950 rounded-lg hover:bg-emerald-100/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Receipt Body */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
          {/* Brand & Invoice Header */}
          <div className="flex justify-between items-start border-b border-slate-200 pb-6">
            <div className="flex items-start gap-3">
              <BrandLogo variant="mark" size="sm" className="mt-1" />
              <div>
                <div className="text-xl font-bold tracking-tight text-[#0F1E36]">
                  {settings.businessName}
                </div>
                <p className="text-xs text-slate-500">{settings.tagline}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{settings.address}</p>
                <p className="text-[11px] text-slate-400">
                  Phone: {settings.phone} / {settings.phone2 || '03145357249'} · {settings.email}
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-[#C5A869] tracking-wider block">
                Official Order Slip
              </span>
              <div className="text-lg font-bold font-mono text-[#0F1E36]">
                {order.orderNumber}
              </div>
              <p className="text-xs text-slate-500 font-mono">{order.date}</p>
              <span className="inline-block mt-1 px-2.5 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-800 uppercase">
                {order.status}
              </span>
            </div>
          </div>

          {/* Customer & Shipping Summary */}
          <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <span className="font-bold text-slate-700 block mb-1">Delivering To:</span>
              <p className="font-semibold text-[#0F1E36]">{order.customerName}</p>
              <p className="text-slate-600 text-[11px]">{order.address}</p>
              <p className="text-slate-600 text-[11px]">{order.area}, {order.city} {order.postalCode || ''}</p>
              <p className="text-slate-600 text-[11px] font-mono mt-1">Phone: {order.phone}</p>
            </div>

            <div>
              <span className="font-bold text-slate-700 block mb-1">Dispatch & Production:</span>
              <p className="text-slate-700"><strong>Workshop & Store:</strong> Sadiqabad Rawalpindi Unit</p>
              <p className="text-slate-700"><strong>Carrier:</strong> TCS / Leopard Express</p>
              <p className="text-slate-700"><strong>Total Garments:</strong> {totalQuantity} pieces</p>
              {order.notes && (
                <p className="text-[11px] text-slate-500 mt-1 italic">
                  Note: {order.notes}
                </p>
              )}
            </div>
          </div>

          {/* Itemized Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Item Description</th>
                  <th className="py-2.5 px-3 text-center">Size</th>
                  <th className="py-2.5 px-3 text-center">Type</th>
                  <th className="py-2.5 px-3 text-right">Quantity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {order.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-slate-900">{item.product.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        SKU: {item.product.sku} · {item.selectedColor}
                        {item.customMeasurements && ' · [Custom Sizing Attached]'}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono">{item.selectedSize}</td>
                    <td className="py-2.5 px-3 text-center text-[11px]">
                      {item.isStitched ? 'Stitched' : 'Unstitched'}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold">{item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Quantity Totals */}
          <div className="flex justify-end text-xs">
            <div className="w-64 space-y-1.5 font-medium">
              <div className="flex justify-between text-base font-bold text-[#0F1E36] pt-2 border-t border-slate-200">
                <span>Total Units Booked:</span>
                <span className="font-mono text-[#0F1E36]">{totalQuantity} pieces</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions - Hidden during print */}
        <div className="no-print p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-slate-500" />
              <span>Print Slip</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onTrackOrder(order.orderNumber);
              }}
              className="px-4 py-2 bg-[#0F1E36] hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <Truck className="w-4 h-4 text-[#C5A869]" />
              <span>Track Live Status</span>
            </button>
          </div>

          <a
            href={getWhatsAppLink(waText)}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Confirm on WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
};
