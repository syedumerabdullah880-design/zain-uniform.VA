import React from 'react';
import { Phone, Mail, MapPin, MessageCircle, ShieldCheck, Award, CheckCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { UniformCategory } from '../types';
import { BrandLogo } from './BrandLogo';

interface FooterProps {
  onNavigate: (view: string) => void;
  onFilterCategory: (cat: UniformCategory) => void;
  onOpenPolicies: (tab: string) => void;
  onOpenSizeGuide: () => void;
  onOpenAdmin: () => void;
  onOpenProfile?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onFilterCategory,
  onOpenPolicies,
  onOpenSizeGuide,
  onOpenAdmin,
  onOpenProfile,
}) => {
  const { settings, getWhatsAppLink } = useStore();

  return (
    <footer className="bg-[#070E18] text-slate-300 border-t border-slate-800 text-xs">
      {/* Brand Trust Banner */}
      <div className="border-b border-slate-800/80 bg-[#0B1526] py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center sm:text-left">
          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <div className="w-10 h-10 rounded-xl bg-[#C5A869]/10 text-[#C5A869] flex items-center justify-center border border-[#C5A869]/20 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-white font-bold text-sm">Direct Factory Supply</div>
              <div className="text-slate-400 text-[11px]">Wholesale & Retail pricing</div>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <div className="w-10 h-10 rounded-xl bg-[#C5A869]/10 text-[#C5A869] flex items-center justify-center border border-[#C5A869]/20 shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-white font-bold text-sm">Master Tailoring</div>
              <div className="text-slate-400 text-[11px]">Durable fabrics & precision fit</div>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <div className="w-10 h-10 rounded-xl bg-[#C5A869]/10 text-[#C5A869] flex items-center justify-center border border-[#C5A869]/20 shrink-0">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-white font-bold text-sm">Institutional Partner</div>
              <div className="text-slate-400 text-[11px]">Serving 50+ schools & colleges</div>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <div className="w-10 h-10 rounded-xl bg-[#C5A869]/10 text-[#C5A869] flex items-center justify-center border border-[#C5A869]/20 shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <div className="text-white font-bold text-sm">Dedicated Support</div>
              <div className="text-slate-400 text-[11px]">Instant WhatsApp assistance</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Col 1: Brand Info */}
          <div className="space-y-4 lg:col-span-1">
            <button
              onClick={onOpenProfile}
              className="text-left group cursor-pointer"
              title="View Business Profile"
            >
              <BrandLogo variant="banner" size="sm" />
            </button>

            <p className="text-slate-400 leading-relaxed text-xs">
              Zain Uniforms is Pakistan's premier institutional uniform manufacturer & tailoring house. We deliver superior fabrics, precise grading, and guaranteed durability for schools, colleges, and families.
            </p>

            <div className="pt-2 flex flex-col gap-2">
              <a
                href={getWhatsAppLink('Hello Zain Uniforms! I have a question.', settings.whatsappNumber)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/60 rounded-xl text-emerald-400 font-bold text-xs transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp: {settings.phone}</span>
              </a>
              <a
                href={getWhatsAppLink('Hello Zain Uniforms! I have a question.', settings.whatsappNumber2 || '923145357249')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/60 rounded-xl text-emerald-400 font-bold text-xs transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp 2: {settings.phone2 || '03145357249'}</span>
              </a>
            </div>
          </div>

          {/* Col 2: Shop */}
          <div className="space-y-3">
            <h4 className="text-white font-bold tracking-wider uppercase text-xs border-b border-slate-800 pb-2">
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
                    className="hover:text-white transition-colors cursor-pointer text-left py-0.5"
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Services */}
          <div className="space-y-3">
            <h4 className="text-white font-bold tracking-wider uppercase text-xs border-b border-slate-800 pb-2">
              Institutional & B2B
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button
                  onClick={() => onNavigate('wholesale')}
                  className="hover:text-white transition-colors cursor-pointer py-0.5"
                >
                  School & Bulk Orders
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('custom')}
                  className="hover:text-white transition-colors cursor-pointer py-0.5"
                >
                  Custom Tailoring & Crests
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('wholesale')}
                  className="hover:text-white transition-colors cursor-pointer py-0.5"
                >
                  Sample Set Requests
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('track')}
                  className="hover:text-white transition-colors cursor-pointer py-0.5"
                >
                  Track Production Status
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Help & Size Guide */}
          <div className="space-y-3">
            <h4 className="text-white font-bold tracking-wider uppercase text-xs border-b border-slate-800 pb-2">
              Size & Measurements
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button
                  onClick={onOpenSizeGuide}
                  className="hover:text-white transition-colors cursor-pointer py-0.5 text-[#C5A869] font-medium"
                >
                  View Complete Size Guide
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenPolicies('custom')}
                  className="hover:text-white transition-colors cursor-pointer py-0.5"
                >
                  Tailor's Growth Margins
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenPolicies('shipping')}
                  className="hover:text-white transition-colors cursor-pointer py-0.5"
                >
                  Delivery Across Pakistan
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenPolicies('returns')}
                  className="hover:text-white transition-colors cursor-pointer py-0.5"
                >
                  Exchange & Alteration Policy
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Location & Contact */}
          <div className="space-y-3">
            <h4 className="text-white font-bold tracking-wider uppercase text-xs border-b border-slate-800 pb-2">
              Headquarters & Info
            </h4>
            <div className="space-y-2.5 text-slate-400 text-xs leading-relaxed">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#C5A869] shrink-0 mt-0.5" />
                <span>Main Factory & Showroom, Rawalpindi / Islamabad Capital Territory, Pakistan.</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#C5A869] shrink-0" />
                <span>support@zainuniforms.pk</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#C5A869] shrink-0" />
                <span className="font-mono">{settings.phone}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={onOpenAdmin}
                className="px-3 py-1.5 bg-[#1E293B] hover:bg-slate-800 text-slate-300 rounded-lg text-[11px] font-medium transition-colors"
              >
                Admin Portal
              </button>
              {onOpenProfile && (
                <button
                  onClick={onOpenProfile}
                  className="px-3 py-1.5 bg-[#1E293B] hover:bg-slate-800 text-slate-300 rounded-lg text-[11px] font-medium transition-colors"
                >
                  Business Profile
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <div>
            © {new Date().getFullYear()} Zain Uniforms Manufacturer & Tailoring. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => onOpenPolicies('privacy')} className="hover:text-slate-300 transition-colors">Privacy Policy</button>
            <span>·</span>
            <button onClick={() => onOpenPolicies('terms')} className="hover:text-slate-300 transition-colors">Terms of Service</button>
            <span>·</span>
            <span>Made with precision for Pakistani Institutions</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
