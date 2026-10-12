import React, { useState } from 'react';
import { Ruler, Info, Check, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const SizeGuidePage: React.FC = () => {
  const { language } = useStore();
  const [activeTab, setActiveTab] = useState<'shirts' | 'trousers' | 'pinafore' | 'blazers'>('shirts');

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
    <div className="py-12 sm:py-20 bg-[#F8FAFC] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#0F1E36] tracking-wider uppercase bg-white px-3.5 py-1.5 rounded-full border border-slate-200 shadow-xs">
            <Ruler className="w-4 h-4 text-[#C5A869]" />
            <span>Master Tailoring Size Matrix</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0F1E36]">
            {language === 'ur' ? 'سائز گائیڈ اور ناپنے کا طریقہ' : 'Size Guide & Measurement Standards'}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Standardized Pakistani school uniform sizing engineered for comfort, growth allowance, and institutional uniformity.
          </p>
        </div>

        {/* Growth Advice Banner */}
        <div className="bg-[#0F1E36] text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-md flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="w-12 h-12 rounded-xl bg-[#C5A869]/20 text-[#C5A869] flex items-center justify-center shrink-0 border border-[#C5A869]/30">
            <Info className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-[#C5A869]">Tailor's Growth Advice for Parents</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Children grow quickly during academic sessions. We recommend measuring over light cotton innerwear and ordering with standard ease. Our master tailors automatically retain 1.5 inches of internal margin inside trousers and skirts for easy future adjustments.
            </p>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-10 space-y-8">
          {/* Tab Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'shirts', label: 'Shirts & Tops' },
                { id: 'trousers', label: 'Trousers & Pants' },
                { id: 'pinafore', label: 'Pinafore & Skirts' },
                { id: 'blazers', label: 'Blazers & Coats' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-[#0F1E36] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="text-xs text-slate-500 font-mono">
              Measurements in standard inches (")
            </div>
          </div>

          {/* Size Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-xs">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#0F1E36] text-white uppercase font-bold text-[11px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Size / Grade</th>
                  {activeTab === 'shirts' && (
                    <>
                      <th className="py-3.5 px-4">Chest</th>
                      <th className="py-3.5 px-4">Shoulder</th>
                      <th className="py-3.5 px-4">Length</th>
                      <th className="py-3.5 px-4">Sleeve</th>
                    </>
                  )}
                  {activeTab === 'trousers' && (
                    <>
                      <th className="py-3.5 px-4">Waist</th>
                      <th className="py-3.5 px-4">Hip</th>
                      <th className="py-3.5 px-4">Length</th>
                      <th className="py-3.5 px-4">Inseam</th>
                    </>
                  )}
                  {activeTab === 'pinafore' && (
                    <>
                      <th className="py-3.5 px-4">Chest</th>
                      <th className="py-3.5 px-4">Waist</th>
                      <th className="py-3.5 px-4">Total Length</th>
                      <th className="py-3.5 px-4">Shoulder</th>
                    </>
                  )}
                  {activeTab === 'blazers' && (
                    <>
                      <th className="py-3.5 px-4">Chest</th>
                      <th className="py-3.5 px-4">Shoulder</th>
                      <th className="py-3.5 px-4">Length</th>
                      <th className="py-3.5 px-4">Sleeve</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {activeTab === 'shirts' &&
                  sizeCharts.shirts.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-[#0F1E36]">{row.size}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-700">{row.chest}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-700">{row.shoulder}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-700">{row.length}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-700">{row.sleeve}</td>
                    </tr>
                  ))}
                {activeTab === 'trousers' &&
                  sizeCharts.trousers.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-[#0F1E36]">{row.size}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-700">{row.waist}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-700">{row.hip}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-700">{row.length}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-700">{row.inseam}</td>
                    </tr>
                  ))}
                {activeTab === 'pinafore' &&
                  sizeCharts.pinafore.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-[#0F1E36]">{row.size}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-700">{row.chest}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-700">{row.waist}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-700">{row.totalLength}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-700">{row.shoulder}</td>
                    </tr>
                  ))}
                {activeTab === 'blazers' &&
                  sizeCharts.blazers.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-[#0F1E36]">{row.size}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-700">{row.chest}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-700">{row.shoulder}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-700">{row.length}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-700">{row.sleeve}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* How to Measure Section */}
          <div className="space-y-6 pt-6 border-t border-slate-200">
            <div>
              <h3 className="text-xl font-bold text-[#0F1E36]">How to Take Accurate Measurements</h3>
              <p className="text-xs text-slate-500 mt-1">
                Use a flexible measuring tape against bare skin or light inner garments for precise sizing.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {measureTips.map((tip, idx) => (
                <div key={idx} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#0F1E36] text-[#C5A869] text-xs font-bold flex items-center justify-center font-mono">
                      0{idx + 1}
                    </span>
                    <h4 className="font-bold text-[#0F1E36] text-sm">{tip.title}</h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{tip.instruction}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
