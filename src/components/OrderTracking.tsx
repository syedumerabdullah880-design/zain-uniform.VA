import React, { useState } from 'react';
import { Search, PackageCheck, Clock, CheckCircle2, AlertCircle, MessageCircle, Truck } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Order, OrderStatus } from '../types';

export const OrderTracking: React.FC = () => {
  const { getOrder, orders, language, getWhatsAppLink } = useStore();

  const [orderNumber, setOrderNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [searched, setSearched] = useState(false);
  const [foundOrder, setFoundOrder] = useState<Order | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber || !phone) return;
    const ord = getOrder(orderNumber, phone);
    setFoundOrder(ord || null);
    setSearched(true);
  };

  const handleFillDemo = (demo: Order) => {
    setOrderNumber(demo.orderNumber);
    setPhone(demo.phone);
    setFoundOrder(demo);
    setSearched(true);
  };

  const statusPipeline: { key: OrderStatus; label: string; desc: string }[] = [
    { key: 'Pending', label: 'Order Received', desc: 'Order logged into workshop queue' },
    { key: 'Confirmed', label: 'Confirmed', desc: 'Measurements & items verified' },
    { key: 'In Production', label: 'In Production', desc: 'Fabric cutting & master stitching' },
    { key: 'Quality Check', label: 'Quality Check', desc: 'Size audit & pressing' },
    { key: 'Ready for Dispatch', label: 'Ready for Dispatch', desc: 'Packaged with invoice' },
    { key: 'Dispatched', label: 'Dispatched', desc: 'Handed over to courier' },
    { key: 'Delivered', label: 'Delivered', desc: 'Safely received by customer' },
  ];

  const getStatusIndex = (st: OrderStatus): number => {
    switch (st) {
      case 'Pending': return 0;
      case 'Confirmed': return 1;
      case 'In Production': return 2;
      case 'Quality Check': return 3;
      case 'Ready for Dispatch': return 4;
      case 'Dispatched': return 5;
      case 'Delivered': return 6;
      default: return 0;
    }
  };

  return (
    <div className="py-12 sm:py-16 bg-[#F8FAFC]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#0F1E36] tracking-wider uppercase mb-2">
            <PackageCheck className="w-4 h-4 text-[#C5A869]" />
            <span>Live Workshop Status</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-[#0F1E36]">
            {language === 'ur' ? 'اپنا آرڈر ٹریک کریں' : 'Track Your Order'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            Enter your order reference number and telephone number to view live production and dispatch status.
          </p>
        </div>

        {/* Search Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Order Number (e.g. ZU-2026-0081)
                </label>
                <input
                  type="text"
                  required
                  placeholder="ZU-2026-XXXX"
                  value={orderNumber}
                  onChange={e => setOrderNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-mono font-bold uppercase text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mobile / WhatsApp Number
                </label>
                <input
                  type="tel"
                  required
                  placeholder="03XXXXXXXXX"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs text-slate-900"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              {/* Quick sample chips for testing */}
              {orders.length > 0 && (
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 flex-wrap">
                  <span>Recent orders:</span>
                  {orders.slice(0, 2).map(ord => (
                    <button
                      key={ord.id}
                      type="button"
                      onClick={() => handleFillDemo(ord)}
                      className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-mono text-[10px] cursor-pointer"
                    >
                      {ord.orderNumber}
                    </button>
                  ))}
                </div>
              )}

              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 bg-[#0F1E36] hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs ml-auto"
              >
                <Search className="w-4 h-4" />
                <span>Track Status</span>
              </button>
            </div>
          </form>
        </div>

        {/* Results */}
        {searched && foundOrder && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-8">
            {/* Top Order Summary */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#C5A869] font-bold">
                  Order Details
                </span>
                <h3 className="text-xl font-bold text-[#0F1E36] font-mono">
                  {foundOrder.orderNumber}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Placed on {foundOrder.date} · {foundOrder.customerName} ({foundOrder.city})
                </p>
              </div>

              <div className="sm:text-right">
                <span className="inline-block px-3 py-1 bg-slate-900 text-white text-xs font-bold rounded-lg uppercase tracking-wide">
                  {foundOrder.status}
                </span>
                <div className="text-xs text-slate-600 mt-1">
                  {foundOrder.items.reduce((s, i) => s + i.quantity, 0)} garments in production
                </div>
              </div>
            </div>

            {/* Visual Step Timeline */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Production & Delivery Timeline
              </h4>

              <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-2.5 sm:before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {statusPipeline.map((step, idx) => {
                  const currentIdx = getStatusIndex(foundOrder.status);
                  const isCompleted = idx <= currentIdx;
                  const isCurrent = idx === currentIdx;

                  // Find history record if logged
                  const historyRecord = foundOrder.trackingHistory.find(
                    h => h.status.toLowerCase() === step.key.toLowerCase()
                  );

                  return (
                    <div key={step.key} className="relative flex items-start gap-3">
                      <span
                        className={`absolute -left-6 sm:-left-8 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                          isCurrent
                            ? 'bg-[#C5A869] text-[#0F1E36] ring-4 ring-amber-100'
                            : isCompleted
                            ? 'bg-[#0F1E36] text-white'
                            : 'bg-slate-100 text-slate-400 border border-slate-300'
                        }`}
                      >
                        {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                      </span>

                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-xs font-bold ${
                              isCurrent
                                ? 'text-[#0F1E36]'
                                : isCompleted
                                ? 'text-slate-800'
                                : 'text-slate-400'
                            }`}
                          >
                            {step.label}
                          </span>
                          {historyRecord && (
                            <span className="text-[10px] font-mono text-slate-400">
                              {historyRecord.timestamp}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {historyRecord ? historyRecord.note : step.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Items in this order */}
            <div className="pt-4 border-t border-slate-200">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                Items in This Package
              </h4>
              <div className="space-y-2">
                {foundOrder.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-800">{item.product.name}</span>
                      <div className="text-[11px] text-slate-500">
                        Size: {item.selectedSize} · Color: {item.selectedColor} · {item.isStitched ? 'Stitched' : 'Unstitched'} · Qty: {item.quantity}
                      </div>
                    </div>
                    <span className="font-mono font-bold text-slate-700">
                      Qty: {item.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* WhatsApp Support Callout */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 bg-emerald-50/70 p-4 rounded-xl border border-emerald-200">
              <div className="text-xs text-emerald-900">
                <span className="font-bold">Need updates or address change? </span>
                Our tailoring team can assist you directly on WhatsApp.
              </div>
              <a
                href={getWhatsAppLink(
                  `Hello Zain Uniforms! I am tracking Order ${foundOrder.orderNumber} for ${foundOrder.customerName}. Could you provide an update?`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shrink-0"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Contact on WhatsApp</span>
              </a>
            </div>
          </div>
        )}

        {searched && !foundOrder && (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-4">
            <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
            <h3 className="text-base font-bold text-[#0F1E36]">No Matching Order Found</h3>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              We couldn't locate an order with number <span className="font-mono font-bold">{orderNumber}</span> and telephone <span className="font-mono font-bold">{phone}</span>. Please verify the numbers on your confirmation SMS or contact our workshop team on WhatsApp.
            </p>
            <a
              href={getWhatsAppLink(
                `Salam Zain Uniforms! I am trying to track my uniform order (${orderNumber}) with phone (${phone}) but cannot find it. Please assist.`
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Ask Workshop on WhatsApp</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
