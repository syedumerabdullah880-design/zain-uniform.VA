import React, { useState } from 'react';
import { X, ShieldCheck, FileText } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface PoliciesModalProps {
  isOpen: boolean;
  initialTab?: string;
  onClose: () => void;
}

export const PoliciesModal: React.FC<PoliciesModalProps> = ({
  isOpen,
  initialTab = 'delivery',
  onClose,
}) => {
  const { policies } = useStore();
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  if (!isOpen) return null;

  const tabs = [
    { id: 'delivery', label: 'Delivery Policy', content: policies.deliveryPolicy },
    { id: 'returns', label: 'Returns Policy', content: policies.returnsPolicy },
    { id: 'exchange', label: 'Exchange Policy', content: policies.exchangePolicy },
    { id: 'custom', label: 'Custom Orders', content: policies.customOrderPolicy },
    { id: 'wholesale', label: 'Wholesale & B2B', content: policies.wholesalePolicy },
    { id: 'privacy', label: 'Privacy Policy', content: policies.privacyPolicy },
    { id: 'terms', label: 'Terms & Conditions', content: policies.terms },
  ];

  const currentPolicy = tabs.find(t => t.id === activeTab) || tabs[0];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden max-h-[90vh] flex flex-col border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50 shrink-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#C5A869]" />
            <h3 className="text-base font-bold text-[#0F1E36]">
              Store & Manufacturing Policies
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Strip */}
        <div className="px-6 bg-slate-100 border-b border-slate-200 flex items-center gap-1 overflow-x-auto shrink-0 no-scrollbar">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`py-2.5 px-3 text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors border-b-2 ${
                activeTab === t.id
                  ? 'border-[#0F1E36] text-[#0F1E36] bg-white rounded-t-lg'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-4">
          <h4 className="text-lg font-bold text-[#0F1E36]">{currentPolicy.label}</h4>
          <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-5 rounded-xl border border-slate-200 font-sans">
            {currentPolicy.content}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#0F1E36] text-white rounded-xl text-xs font-bold cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
