import React from 'react';
import {
  X,
  MapPin,
  Phone,
  MessageCircle,
  ShieldCheck,
  Award,
  Clock,
  Sparkles,
  ExternalLink,
  Building,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { BrandLogo } from './BrandLogo';

interface BusinessProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (view: string) => void;
}

export const BusinessProfileModal: React.FC<BusinessProfileModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const { settings, getWhatsAppLink } = useStore();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative bg-white rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header Hero Pattern */}
        <div className="relative bg-gradient-to-br from-[#0F1E36] via-[#0A1322] to-[#050B14] text-white px-6 pt-8 pb-14 text-center overflow-hidden border-b border-[#C5A869]/30">
          {/* Subtle gold grid effect */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#C5A869_1px,transparent_1px)] [background-size:16px_16px]" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800/80 transition-colors cursor-pointer"
            aria-label="Close Profile"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Profile Badge with Official ZYN Logo */}
          <div className="relative z-10 flex flex-col items-center">
            <BrandLogo variant="profile" className="mb-2" />
            <h2 className="text-2xl font-bold tracking-tight text-white mt-1">
              Zain Uniforms
            </h2>
            <p className="text-xs text-[#C5A869] font-medium tracking-wider uppercase mt-0.5">
              Official Manufacturer & Bespoke Tailoring Profile
            </p>
          </div>
        </div>

        {/* Content Card Body */}
        <div className="relative -mt-6 px-5 sm:px-7 pb-7 space-y-5">
          {/* Status Badge */}
          <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  Verified Manufacturing Workshop
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                </h3>
                <p className="text-[11px] text-slate-500">
                  Licensed school apparel & institutional uniform provider
                </p>
              </div>
            </div>
            <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-md">
              Est. 2026
            </span>
          </div>

          {/* Location & Workshop Address */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#0F1E36] text-[#C5A869] flex items-center justify-center shrink-0 mt-0.5">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Workshop & Display Center Address
                </span>
                <p className="text-xs sm:text-sm font-semibold text-slate-900 leading-snug">
                  {settings.address ||
                    'koyla center, Shop#2867 Nishter St, Sadiqabad Rawalpindi, 46000'}
                </p>
                <p className="text-[11px] text-slate-500">
                  Rawalpindi & Islamabad Twin Cities Hub · Pakistan
                </p>
              </div>
            </div>
          </div>

          {/* Official Phone Numbers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              href={`tel:${settings.phone}`}
              className="p-3.5 rounded-xl border border-slate-200 hover:border-[#C5A869] bg-white hover:bg-amber-50/30 transition-all group flex items-center gap-3"
            >
              <div className="w-9 h-9 rounded-lg bg-slate-100 group-hover:bg-[#0F1E36] group-hover:text-[#C5A869] text-slate-700 flex items-center justify-center transition-colors">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-semibold text-slate-500 block">
                  Official Phone Line 1
                </span>
                <span className="text-xs font-bold text-slate-900 font-mono">
                  {settings.phone || '03185283067'}
                </span>
              </div>
            </a>

            <a
              href={`tel:${settings.phone2 || '03145357249'}`}
              className="p-3.5 rounded-xl border border-slate-200 hover:border-[#C5A869] bg-white hover:bg-amber-50/30 transition-all group flex items-center gap-3"
            >
              <div className="w-9 h-9 rounded-lg bg-slate-100 group-hover:bg-[#0F1E36] group-hover:text-[#C5A869] text-slate-700 flex items-center justify-center transition-colors">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-semibold text-slate-500 block">
                  Official Phone Line 2
                </span>
                <span className="text-xs font-bold text-slate-900 font-mono">
                  {settings.phone2 || '03145357249'}
                </span>
              </div>
            </a>
          </div>

          {/* Direct WhatsApp Action Buttons */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Direct WhatsApp Support Channels
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <a
                href={getWhatsAppLink(
                  'Hello Zain Uniforms! I am viewing your official profile and need assistance.',
                  settings.whatsappNumber
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp 1</span>
              </a>

              <a
                href={getWhatsAppLink(
                  'Hello Zain Uniforms! I am viewing your official profile and need assistance.',
                  settings.whatsappNumber2 || '923145357249'
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-sm transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp 2</span>
              </a>
            </div>
          </div>

          {/* Highlights & Operations */}
          <div className="pt-2 border-t border-slate-200 grid grid-cols-3 gap-2 text-center text-[11px]">
            <div className="p-2 rounded-lg bg-slate-50">
              <Award className="w-4 h-4 mx-auto text-[#C5A869] mb-1" />
              <span className="font-bold text-slate-800 block">Premium Stitching</span>
              <span className="text-[10px] text-slate-500">Fine Cotton & Twill</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-50">
              <Building className="w-4 h-4 mx-auto text-[#C5A869] mb-1" />
              <span className="font-bold text-slate-800 block">School Wholesale</span>
              <span className="text-[10px] text-slate-500">Bulk Monogram Crest</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-50">
              <Clock className="w-4 h-4 mx-auto text-[#C5A869] mb-1" />
              <span className="font-bold text-slate-800 block">Fast Turnaround</span>
              <span className="text-[10px] text-slate-500">Nationwide Delivery</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
