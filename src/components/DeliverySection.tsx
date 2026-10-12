import React from 'react';
import { Truck, MapPin, ShieldCheck, PackageCheck, Clock } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const DeliverySection: React.FC = () => {
  const { settings, language } = useStore();

  const cities = [
    { name: 'Islamabad & Rawalpindi', time: settings.cityDeliveryTimes['Islamabad'] || '1-2 Days (Express)' },
    { name: 'Lahore', time: settings.cityDeliveryTimes['Lahore'] || '2-3 Days' },
    { name: 'Karachi', time: settings.cityDeliveryTimes['Karachi'] || '3-4 Days' },
    { name: 'Faisalabad & Sialkot', time: settings.cityDeliveryTimes['Faisalabad'] || '2-3 Days' },
    { name: 'Peshawar & Multan', time: settings.cityDeliveryTimes['Peshawar'] || '2-3 Days' },
    { name: 'Other Cities & Districts', time: settings.cityDeliveryTimes['Other Cities'] || '3-5 Days Nationwide' },
  ];

  return (
    <section className="py-16 bg-[#F8FAFC] border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#0F1E36] tracking-wider uppercase mb-2">
            <Truck className="w-4 h-4 text-[#C5A869]" />
            <span>Courier Logistics</span>
            <span aria-hidden="true">·</span>
            <span>Reliable & Direct Dispatch</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0F1E36]">
            {language === 'ur'
              ? 'پورے پاکستان میں اسکول یونیفارم کی ترسیل'
              : 'Delivering School Uniforms Across Pakistan'}
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
            From major metropolitan cities to northern and southern districts, our premier courier partnerships ensure your school uniforms arrive safely pressed and packaged.
          </p>
        </div>

        {/* City coverage cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {cities.map((city, idx) => (
            <div
              key={idx}
              className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#0F1E36] mb-1">
                  <MapPin className="w-3.5 h-3.5 text-[#C5A869] shrink-0" />
                  <span className="truncate">{city.name}</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-slate-500 mb-2">
                  <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                  <span>{city.time}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-emerald-700 font-medium">
                <span className="text-[10px] text-slate-400">Status:</span>
                <span>Active Route</span>
              </div>
            </div>
          ))}
        </div>

        {/* 3 Core Trust Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10 pt-10 border-t border-slate-200/80">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200">
              <PackageCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#0F1E36]">Protective Garment Packing</h4>
              <p className="text-[11px] text-slate-600 mt-0.5">Sealed moisture-proof garment wrapping and rigid carton dispatch.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 border border-blue-200">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#0F1E36]">Premier Couriers (TCS / Leopard)</h4>
              <p className="text-[11px] text-slate-600 mt-0.5">Prompt doorstep transit with real-time tracking updates via SMS and WhatsApp.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center shrink-0 border border-amber-200">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#0F1E36]">Free Size Exchanges</h4>
              <p className="text-[11px] text-slate-600 mt-0.5">Exchange for a larger or smaller size within 7 days hassle-free.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
