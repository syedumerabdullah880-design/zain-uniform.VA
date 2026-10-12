import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const FloatingWhatsApp: React.FC = () => {
  const { settings, getWhatsAppLink } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');

  const quickPrompts = [
    'How do I send custom measurements?',
    'What is the wholesale price for 50 school sets?',
    'Can I pay via Cash on Delivery?',
  ];

  const handleSend = (text: string) => {
    const targetText = text || customMsg || 'Salam Zain Uniforms! I would like to inquire about school uniforms.';
    window.open(getWhatsAppLink(targetText), '_blank');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end">
      {/* Mini popup dialog */}
      {isOpen && (
        <div className="mb-3 w-72 sm:w-80 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="bg-[#0F1E36] text-white p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-xs">
                WA
              </div>
              <div>
                <h4 className="text-xs font-bold">Zain Uniforms Tailoring</h4>
                <p className="text-[10px] text-emerald-400">Direct Workshop WhatsApp</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-300 hover:text-white p-1 rounded"
              aria-label="Close WhatsApp chat prompt"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-3.5 space-y-3 text-xs bg-slate-50/50">
            <p className="text-slate-600 leading-relaxed text-[11px]">
              Assalam-o-Alaikum! Looking for custom stitching, school crest embroidery, or sizing assistance? Chat with us directly.
            </p>

            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-slate-400">Quick inquiries:</span>
              {quickPrompts.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q)}
                  className="w-full text-left p-2 rounded-lg bg-white border border-slate-200 hover:border-[#0F1E36] text-[11px] text-slate-700 transition-colors cursor-pointer"
                >
                  {q}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5 pt-1">
              <input
                type="text"
                placeholder="Type your message..."
                value={customMsg}
                onChange={e => setCustomMsg(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend(customMsg)}
                className="flex-1 px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs bg-white"
              />
              <button
                onClick={() => handleSend(customMsg)}
                className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors cursor-pointer"
                title="Send"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Contact Zain Uniforms on WhatsApp"
        className="w-13 h-13 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg flex items-center justify-center transition-transform hover:scale-105 active:scale-95 cursor-pointer ring-4 ring-emerald-600/20"
      >
        <MessageCircle className="w-7 h-7" />
      </button>
    </div>
  );
};
