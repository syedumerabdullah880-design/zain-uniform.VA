import React from 'react';
import { Phone, Mail, MapPin, MessageCircle, ShieldCheck } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { UniformCategory } from '../types';

interface FooterProps {
  onNavigate: (view: string) => void;
  onFilterCategory: (cat: UniformCategory) => void;
  onOpenPolicies: (tab: string) => void;
  onOpenSizeGuide: () => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onFilterCategory,
  onOpenPolicies,
  onOpenSizeGuide,
  onOpenAdmin,
}) => {
  const { settings, getWhatsAppLink } = useStore();

  return (
    <footer className="bg-[#0B1526] text-slate-300 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-18">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Col 1: Brand Info */}
          <div className="space-y-4 lg:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#C5A869] text-[#0F1E36] font-bold text-sm flex items-center justify-center">
                ZU
              </div>
              <span className="text-base font-bold text-white tracking-tight">
                Zain Uniforms
              </span>
            </div>

            <p className="text-slate-400 leading-relaxed text-xs">
              School uniforms made for quality, comfort, and the perfect fit. Serving Pakistani families, educational institutions, and wholesale retailers with dedicated craftsmanship.
            </p>

            <div className="pt-2">
              <a
                href={getWhatsAppLink('Hello Zain Uniforms! I have a question.')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/60 rounded-lg text-emerald-400 font-semibold text-[11px] transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp: {settings.phone}</span>
              </a>
            </div>
          </div>

          {/* Col 2: Shop */}
          <div className="space-y-3">
            <h4 className="text-white font-bold tracking-wider uppercase text-[11px]">
              Shop Uniforms
            </h4>
            <ul className="space-y-2 text-slate-400">
              {(
                [
                  'School Shirts',
                  'Trousers & Pants',
                  'Skirts & Pinafores',
                  'Blazers & Sweaters',
                  'Sports Uniforms',
                  'Accessories',
                ] as UniformCategory[]
              ).map(cat => (
                <li key={cat}>
                  <button
                    onClick={() => onFilterCategory(cat)}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Services */}
          <div className="space-y-3">
            <h4 className="text-white font-bold tracking-wider uppercase text-[11px]">
              Services & B2B
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button
                  onClick={() => onNavigate('custom')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Custom Uniform Stitching
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('wholesale')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  School & Institutional Orders
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('wholesale')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Wholesale & Bulk Supply
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Our Tailoring Workshop
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenPolicies('custom')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Made-to-Measure Guarantee
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Help & Policies */}
          <div className="space-y-3">
            <h4 className="text-white font-bold tracking-wider uppercase text-[11px]">
              Help & Policies
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button
                  onClick={onOpenSizeGuide}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Size Guide & Measurements
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('track')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Order Tracking
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenPolicies('delivery')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Nationwide Delivery Schedule
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenPolicies('returns')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  7-Day Returns & Exchange
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenPolicies('privacy')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Privacy & Terms
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Contact Info */}
          <div className="space-y-3">
            <h4 className="text-white font-bold tracking-wider uppercase text-[11px]">
              Contact Workshop
            </h4>
            <ul className="space-y-2.5 text-slate-400 text-xs">
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#C5A869] shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#C5A869] shrink-0" />
                <span>{settings.phone}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#C5A869] shrink-0" />
                <span>{settings.email}</span>
              </li>
              <li className="pt-2">
                <button
                  onClick={onOpenAdmin}
                  className="text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C5A869]" />
                  <span>Operations / Admin Portal</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-12 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px]">
          <div>
            © {new Date().getFullYear()} Zain Uniforms. All Rights Reserved. Tailored in Islamabad, Pakistan.
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => onOpenPolicies('privacy')} className="hover:text-slate-300">
              Privacy Policy
            </button>
            <button onClick={() => onOpenPolicies('terms')} className="hover:text-slate-300">
              Terms & Conditions
            </button>
            <button onClick={() => onOpenPolicies('delivery')} className="hover:text-slate-300">
              Delivery Guidelines
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
