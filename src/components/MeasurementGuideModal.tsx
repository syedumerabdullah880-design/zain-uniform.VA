import React, { useState } from 'react';
import { X, Ruler, HelpCircle, Check, Info } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface MeasurementGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MeasurementGuideModal: React.FC<MeasurementGuideModalProps> = ({ isOpen, onClose }) => {
  const { language } = useStore();
  const [activeTab, setActiveTab] = useState<'shirts' | 'trousers' | 'pinafore' | 'blazers'>('shirts');
  const [unit, setUnit] = useState<'inches' | 'cm'>('inches');

  if (!isOpen) return null;

  const sizeCharts = {
    shirts: [
      { size: 'XS (Age 4-6)', chest: '28"', shoulder: '12.5"', length: '21"', sleeve: '17"' },
      { size: 'S (Age 7-9)', chest: '31"', shoulder: '13.5"', length: '23"', sleeve: '19"' },
      { size: 'M (Age 10-12)', chest: '34"', shoulder: '14.5"', length: '25"', sleeve: '21"' },
      { size: 'L (Age 13-15)', chest: '37"', shoulder: '16.0"', length: '27"', sleeve: '23"' },
      { size: 'XL (Age 16+)', chest: '40"', shoulder: '17.5"', length: '29"', sleeve: '24.5"' },
      { size: 'XXL (College)', chest: '43"', shoulder: '18.5"', length: '30.5"', sleeve: '25.5"' },
    ],
    trousers: [
      { size: '24 (Age 5-7)', waist: '24"', hip: '28"', length: '28"', inseam: '20"' },
      { size: '26 (Age 8-10)', waist: '26"', hip: '31"', length: '32"', inseam: '23"' },
      { size: '28 (Age 11-13)', waist: '28"', hip: '34"', length: '35"', inseam: '26"' },
      { size: '30 (Age 14-16)', waist: '30"', hip: '36"', length: '38"', inseam: '29"' },
      { size: '32 (Senior)', waist: '32"', hip: '38"', length: '40"', inseam: '31"' },
      { size: '34 (College)', waist: '34"', hip: '40"', length: '41"', inseam: '32"' },
    ],
    pinafore: [
      { size: 'XS (Class 1-3)', chest: '26"', waist: '24"', totalLength: '28"', shoulder: '11.5"' },
      { size: 'S (Class 4-6)', chest: '30"', waist: '27"', totalLength: '32"', shoulder: '12.5"' },
      { size: 'M (Class 7-8)', chest: '33"', waist: '29"', totalLength: '36"', shoulder: '13.5"' },
      { size: 'L (Class 9-10)', chest: '36"', waist: '32"', totalLength: '40"', shoulder: '14.5"' },
      { size: 'XL (College)', chest: '39"', waist: '35"', totalLength: '42"', shoulder: '15.5"' },
    ],
    blazers: [
      { size: 'Size 28 (Junior)', chest: '30"', shoulder: '13.0"', length: '22"', sleeve: '18.5"' },
      { size: 'Size 30 (Middle)', chest: '32"', shoulder: '14.0"', length: '24"', sleeve: '20.0"' },
      { size: 'Size 32 (Senior)', chest: '34"', shoulder: '15.0"', length: '26"', sleeve: '21.5"' },
      { size: 'Size 34 (Matric/O-Levels)', chest: '36"', shoulder: '16.0"', length: '27.5"', sleeve: '23.0"' },
      { size: 'Size 36 (A-Levels/FSc)', chest: '38"', shoulder: '17.0"', length: '29.0"', sleeve: '24.5"' },
      { size: 'Size 38 (Adult)', chest: '40"', shoulder: '18.0"', length: '30.0"', sleeve: '25.5"' },
    ],
  };

  const measureTips = [
    {
      title: 'Chest / Bust (چھاتی کا ناپ)',
      instruction: 'Measure around the fullest part of the chest under arms. Keep measuring tape straight across back and comfortably flat.',
    },
    {
      title: 'Shoulder (کندھے کا ناپ)',
      instruction: 'Measure across the back from the edge of the left shoulder bone straight across to the right shoulder bone.',
    },
    {
      title: 'Shirt Length (قمیض کی لمبائی)',
      instruction: 'Measure from the highest point of the shoulder down along the front to the desired bottom hemline.',
    },
    {
      title: 'Sleeve Length (آستین کی لمبائی)',
      instruction: 'Measure from the top tip of the shoulder down past the elbow to the wrist bone.',
    },
    {
      title: 'Waist (کمر کا ناپ)',
      instruction: 'Measure around the natural waistline where school trousers or skirt waistband naturally sits. Insert two fingers under tape for comfort.',
    },
    {
      title: 'Trouser Length (پینٹ کی لمبائی)',
      instruction: 'Measure from the waistband down the outer leg to the top of the school shoes or desired hem.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden max-h-[90vh] flex flex-col border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50 shrink-0">
          <div className="flex items-center gap-2">
            <Ruler className="w-5 h-5 text-[#C5A869]" />
            <h3 className="text-base sm:text-lg font-bold text-[#0F1E36]">
              {language === 'ur' ? 'سائز گائیڈ اور ناپنے کا طریقہ' : 'Size Guide & Measurement Chart'}
            </h3>
          </div>

          <button
            onClick={onClose}
            aria-label="Close size guide"
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 space-y-6">
          {/* Important Pakistani parent tip banner */}
          <div className="p-4 bg-amber-50/80 rounded-xl border border-amber-200 flex items-start gap-3 text-xs text-amber-900">
            <Info className="w-5 h-5 text-[#C5A869] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Tailor's Growth Advice for Pakistani Parents: </span>
              Children grow quickly during academic sessions. We recommend measuring over light cotton innerwear and ordering 1-inch ease. Our master tailors automatically retain 1.5 inches of internal margin inside trousers and skirts for easy future adjustments.
            </div>
          </div>

          {/* Tab Selector */}
          <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-200 pb-2">
            <div className="flex gap-2">
              {[
                { id: 'shirts', label: 'Shirts & Tops' },
                { id: 'trousers', label: 'Trousers & Pants' },
                { id: 'pinafore', label: 'Pinafore & Skirts' },
                { id: 'blazers', label: 'Blazers & Coats' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-[#0F1E36] text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="text-[11px] text-slate-500 font-mono">
              Values in standard inches (")
            </div>
          </div>

          {/* Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/80 text-slate-700 uppercase font-bold text-[11px] border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Size / Grade</th>
                  {activeTab === 'shirts' && (
                    <>
                      <th className="py-2.5 px-3">Chest</th>
                      <th className="py-2.5 px-3">Shoulder</th>
                      <th className="py-2.5 px-3">Length</th>
                      <th className="py-2.5 px-3">Sleeve</th>
                    </>
                  )}
                  {activeTab === 'trousers' && (
                    <>
                      <th className="py-2.5 px-3">Waist</th>
                      <th className="py-2.5 px-3">Hip</th>
                      <th className="py-2.5 px-3">Outer Length</th>
                      <th className="py-2.5 px-3">Inseam</th>
                    </>
                  )}
                  {activeTab === 'pinafore' && (
                    <>
                      <th className="py-2.5 px-3">Chest</th>
                      <th className="py-2.5 px-3">Waist</th>
                      <th className="py-2.5 px-3">Length</th>
                      <th className="py-2.5 px-3">Shoulder</th>
                    </>
                  )}
                  {activeTab === 'blazers' && (
                    <>
                      <th className="py-2.5 px-3">Chest</th>
                      <th className="py-2.5 px-3">Shoulder</th>
                      <th className="py-2.5 px-3">Length</th>
                      <th className="py-2.5 px-3">Sleeve</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-slate-700">
                {activeTab === 'shirts' &&
                  sizeCharts.shirts.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-sans font-semibold text-[#0F1E36]">{row.size}</td>
                      <td className="py-2.5 px-3">{row.chest}</td>
                      <td className="py-2.5 px-3">{row.shoulder}</td>
                      <td className="py-2.5 px-3">{row.length}</td>
                      <td className="py-2.5 px-3">{row.sleeve}</td>
                    </tr>
                  ))}
                {activeTab === 'trousers' &&
                  sizeCharts.trousers.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-sans font-semibold text-[#0F1E36]">{row.size}</td>
                      <td className="py-2.5 px-3">{row.waist}</td>
                      <td className="py-2.5 px-3">{row.hip}</td>
                      <td className="py-2.5 px-3">{row.length}</td>
                      <td className="py-2.5 px-3">{row.inseam}</td>
                    </tr>
                  ))}
                {activeTab === 'pinafore' &&
                  sizeCharts.pinafore.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-sans font-semibold text-[#0F1E36]">{row.size}</td>
                      <td className="py-2.5 px-3">{row.chest}</td>
                      <td className="py-2.5 px-3">{row.waist}</td>
                      <td className="py-2.5 px-3">{row.totalLength}</td>
                      <td className="py-2.5 px-3">{row.shoulder}</td>
                    </tr>
                  ))}
                {activeTab === 'blazers' &&
                  sizeCharts.blazers.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-sans font-semibold text-[#0F1E36]">{row.size}</td>
                      <td className="py-2.5 px-3">{row.chest}</td>
                      <td className="py-2.5 px-3">{row.shoulder}</td>
                      <td className="py-2.5 px-3">{row.length}</td>
                      <td className="py-2.5 px-3">{row.sleeve}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Visual Measurement Instructions Guide */}
          <div className="space-y-3 pt-2">
            <h4 className="text-sm font-bold text-[#0F1E36] flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-[#C5A869]" />
              <span>How to Measure at Home (Step-by-Step)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {measureTips.map((tip, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  <div className="font-semibold text-[#0F1E36] mb-1">{tip.title}</div>
                  <p className="text-slate-600 leading-relaxed text-[11px]">{tip.instruction}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#0F1E36] hover:bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
