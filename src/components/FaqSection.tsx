import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search, MessageCircle, HelpCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const FaqSection: React.FC = () => {
  const { faqs, language, getWhatsAppLink } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [openIds, setOpenIds] = useState<string[]>(['faq-1', 'faq-3']);

  const toggleFaq = (id: string) => {
    setOpenIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const filteredFaqs = faqs.filter(f => {
    const q = f.question.toLowerCase() + ' ' + f.questionUrdu.toLowerCase() + ' ' + f.answer.toLowerCase();
    return q.includes(searchQuery.toLowerCase());
  });

  return (
    <section className="py-16 sm:py-20 bg-white border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#0F1E36] tracking-wider uppercase mb-2">
            <HelpCircle className="w-4 h-4 text-[#C5A869]" />
            <span>Questions & Guidance</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0F1E36]">
            {language === 'ur' ? 'عام پوچھے جانے والے سوالات' : 'Frequently Asked Questions'}
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            Clear answers about sizing, custom master stitching, bulk wholesale terms, and Pakistan-wide courier delivery.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-md mx-auto mt-6">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search questions (e.g. measurements, bulk, delivery)..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#0F1E36]"
            />
          </div>
        </div>

        {/* FAQs List */}
        <div className="space-y-3">
          {filteredFaqs.map(faq => {
            const isOpen = openIds.includes(faq.id);
            return (
              <div
                key={faq.id}
                className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs transition-all"
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  <span className="text-xs sm:text-sm font-bold text-[#0F1E36]">
                    {language === 'ur' ? faq.questionUrdu : faq.question}
                  </span>
                  <span className="text-slate-400 shrink-0">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-5 pb-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    <p>{language === 'ur' ? faq.answerUrdu : faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Direct WhatsApp Callout */}
        <div className="mt-10 p-5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <h4 className="text-xs font-bold text-[#0F1E36]">Have a specific school requirement?</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Talk directly with our master pattern cutter and tailoring manager on WhatsApp.
            </p>
          </div>

          <a
            href={getWhatsAppLink('Salam Zain Uniforms! I have a question regarding school uniform stitching and ordering.')}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  );
};
