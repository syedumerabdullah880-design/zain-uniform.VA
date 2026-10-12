import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, Truck, ShoppingBag, FileText, AlertCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Order } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onOrderSuccess,
}) => {
  const { cart, settings, placeOrder } = useStore();

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Rawalpindi');
  const [area, setArea] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [notes, setNotes] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!customerName.trim() || !phone.trim() || !address.trim() || !city.trim()) {
      setErrorMessage('Please fill out all required recipient, phone, and delivery address fields.');
      return;
    }

    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid contact phone number with at least 10 digits.');
      return;
    }

    const createdOrder = placeOrder({
      customerName: customerName.trim(),
      phone: phone.trim(),
      whatsapp: whatsapp.trim() || phone.trim(),
      email: email.trim() || 'orders@zainuniforms.pk',
      address: address.trim(),
      city: city.trim(),
      area: area.trim() || city.trim(),
      postalCode: postalCode.trim(),
      notes: notes.trim(),
    });

    onOrderSuccess(createdOrder);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden max-h-[92vh] flex flex-col border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50 shrink-0">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#C5A869]" />
            <h3 className="text-base sm:text-lg font-bold text-[#0F1E36]">
              Uniform Order Booking & Delivery Details
            </h3>
          </div>

          <button
            onClick={onClose}
            aria-label="Close booking form"
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handlePlaceOrder} className="overflow-y-auto p-6 space-y-6">
          {errorMessage && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Customer & Address Details */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F1E36]">
              1. Delivery & Contact Details (Pakistan)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Full Recipient Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Asif Mehmood"
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Mobile Number (for Courier SMS & Delivery) *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="03XXXXXXXXX"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  WhatsApp Number (for measurement & order verification)
                </label>
                <input
                  type="tel"
                  placeholder="03XXXXXXXXX"
                  value={whatsapp}
                  onChange={e => setWhatsapp(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Email (optional)
                </label>
                <input
                  type="email"
                  placeholder="customer@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Complete Street Address / House No. *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. House 42, Street 18, Sector G-10/2, Near City Park"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  City *
                </label>
                <select
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 font-medium"
                >
                  {Object.keys(settings.cityDeliveryTimes).map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Area / Sector / Colony
                </label>
                <input
                  type="text"
                  placeholder="e.g. Gulberg / DHA / F-8"
                  value={area}
                  onChange={e => setArea(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Selected Items Review */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
            <h5 className="font-bold text-[#0F1E36] border-b border-slate-200 pb-1.5 flex items-center justify-between">
              <span>Selected Uniforms ({totalQuantity} pieces)</span>
              <span className="font-normal text-slate-500 text-[11px]">Ready for Production Booking</span>
            </h5>

            <div className="space-y-1.5 text-slate-600">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-center text-[11px] py-1 border-b border-slate-200/60 last:border-0">
                  <div>
                    <span className="font-semibold text-slate-800">{item.product.name}</span>
                    <span className="text-slate-500 block">
                      Size: {item.selectedSize} · Color: {item.selectedColor} · {item.isStitched ? 'Stitched' : 'Unstitched'}
                      {item.customMeasurements && ' · [Custom Sizing Attached]'}
                    </span>
                  </div>
                  <span className="font-mono font-bold text-slate-800 text-xs">
                    Qty: {item.quantity}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Dispatch Route: {city}</span>
              <span>Courier Transit: {settings.cityDeliveryTimes[city] || '2-4 Days'}</span>
            </div>
          </div>

          {/* Notes */}
          <div className="text-xs">
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Special Tailoring or Fitting Instructions (optional)
            </label>
            <input
              type="text"
              placeholder="e.g. School name, child's grade, collar embroidery requirements..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
            />
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-8 py-3 bg-[#0F1E36] hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-sm flex items-center gap-2"
            >
              <FileText className="w-4 h-4 text-[#C5A869]" />
              <span>Submit Order Booking</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
