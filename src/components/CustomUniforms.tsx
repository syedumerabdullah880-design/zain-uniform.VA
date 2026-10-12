import React, { useState } from 'react';
import { Scissors, Ruler, CheckCircle2, Upload, MessageCircle, FileText, ArrowRight, ArrowLeft, AlertCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Gender, CustomMeasurements, CustomOrderQuote } from '../types';

interface CustomUniformsProps {
  onOpenSizeGuide: () => void;
}

export const CustomUniforms: React.FC<CustomUniformsProps> = ({ onOpenSizeGuide }) => {
  const { submitCustomQuote, settings, language, getWhatsAppLink } = useStore();

  const [step, setStep] = useState<number>(1);
  const [submittedQuote, setSubmittedQuote] = useState<CustomOrderQuote | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Form State
  const [uniformType, setUniformType] = useState('School Shirt & Trouser Combo');
  const [gender, setGender] = useState<Gender>('Boys');
  const [fabric, setFabric] = useState('Oxford Cotton 60/40 & Poly-Viscose');
  const [color, setColor] = useState('Navy Blue & Crisp White');
  const [sizePreference, setSizePreference] = useState<'standard' | 'custom'>('custom');
  const [standardSize, setStandardSize] = useState('M (Medium)');
  const [isStitched, setIsStitched] = useState(true);
  const [quantity, setQuantity] = useState(2);
  const [schoolName, setSchoolName] = useState('');
  const [requiredDate, setRequiredDate] = useState('2026-10-30');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [referenceImage, setReferenceImage] = useState<string>('');

  // Contact info
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');

  // Custom Measurements
  const [measurements, setMeasurements] = useState<CustomMeasurements>({
    unit: 'inches',
    chest: '',
    shoulder: '',
    shirtLength: '',
    sleeveLength: '',
    waist: '',
    trouserLength: '',
    hip: '',
    inseam: '',
    collar: '',
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReferenceImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!customerName.trim() || !phone.trim()) {
      setFormError('Please provide your recipient name and mobile phone number so our tailoring team can reach you.');
      return;
    }

    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setFormError('Please enter a valid phone number with at least 10 digits.');
      return;
    }

    const created = submitCustomQuote({
      customerName: customerName.trim(),
      phone: phone.trim(),
      whatsapp: whatsapp.trim() || phone.trim(),
      email: email.trim() || 'customer@zainuniforms.pk',
      schoolName,
      uniformType,
      gender,
      fabric,
      color,
      sizePreference,
      standardSize: sizePreference === 'standard' ? standardSize : undefined,
      measurements: sizePreference === 'custom' ? measurements : undefined,
      isStitched,
      quantity,
      requiredDate,
      specialInstructions,
      referenceImage,
    });

    setSubmittedQuote(created);
  };

  const getCustomWaText = (quote: CustomOrderQuote) => {
    return `Salam Zain Uniforms! I have submitted a Custom Stitching Order Request (Ref: ${quote.quoteNumber}).\n\nDetails:\n- Customer: ${quote.customerName}\n- Phone: ${quote.phone}\n- School: ${quote.schoolName || 'N/A'}\n- Uniform: ${quote.uniformType} (${quote.gender})\n- Fabric: ${quote.fabric}\n- Color: ${quote.color}\n- Sizing: ${quote.sizePreference === 'custom' ? 'Custom Measurements provided' : quote.standardSize}\n- Stitching: ${quote.isStitched ? 'Stitched' : 'Unstitched'}\n- Quantity: ${quote.quantity}\n- Required Date: ${quote.requiredDate}\n\nPlease review and confirm production schedule.`;
  };

  const stepsList = [
    { num: 1, title: 'Uniform Type' },
    { num: 2, title: 'Fabric & Colour' },
    { num: 3, title: 'Measurements' },
    { num: 4, title: 'Stitching' },
    { num: 5, title: 'Reference' },
    { num: 6, title: 'Submit Quote' },
  ];

  return (
    <div className="py-12 bg-[#F8FAFC]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#0F1E36] tracking-wider uppercase mb-2">
            <Scissors className="w-3.5 h-3.5 text-[#C5A869]" />
            <span>Master Tailor Workshop</span>
            <span aria-hidden="true">·</span>
            <span>Made to Measure</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0F1E36]">
            {language === 'ur'
              ? 'کسٹم اسکول یونیفارم سلائی سروس'
              : 'Designed Around Your School. Stitched Around Your Measurements.'}
          </h1>

          <p className="text-sm text-slate-600 mt-3 leading-relaxed">
            Whether your school requires a specific collar pattern, custom pocket embroidery, or unique body measurements, our dedicated pattern masters stitch garments to fit perfectly.
          </p>
        </div>

        {/* Post-submission confirmation screen */}
        {submittedQuote ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest text-[#C5A869] font-bold">
                Quotation Request Received
              </span>
              <h2 className="text-2xl font-bold text-[#0F1E36]">
                Reference ID: <span className="font-mono text-[#0F1E36]">{submittedQuote.quoteNumber}</span>
              </h2>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Your request has been received. Our tailoring team will review your requirements and measurements and contact you shortly to confirm production.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 max-w-lg mx-auto text-left text-xs space-y-2">
              <div className="flex justify-between border-b border-slate-200 pb-1.5">
                <span className="text-slate-500">Customer Name:</span>
                <span className="font-semibold text-slate-800">{submittedQuote.customerName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1.5">
                <span className="text-slate-500">Uniform Type:</span>
                <span className="font-semibold text-slate-800">{submittedQuote.uniformType}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1.5">
                <span className="text-slate-500">Quantity:</span>
                <span className="font-semibold text-slate-800">{submittedQuote.quantity} units</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Target Delivery Date:</span>
                <span className="font-semibold text-slate-800">{submittedQuote.requiredDate}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <a
                href={getWhatsAppLink(getCustomWaText(submittedQuote))}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Send Details via WhatsApp Now</span>
              </a>

              <button
                onClick={() => {
                  setSubmittedQuote(null);
                  setStep(1);
                }}
                className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Start Another Custom Order
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Visual Step Timeline */}
            <div className="bg-[#0F1E36] px-6 py-4 border-b border-slate-800">
              <div className="flex items-center justify-between overflow-x-auto gap-2 no-scrollbar">
                {stepsList.map(s => (
                  <button
                    key={s.num}
                    type="button"
                    onClick={() => setStep(s.num)}
                    className={`flex items-center gap-2 text-xs whitespace-nowrap cursor-pointer transition-colors ${
                      step === s.num
                        ? 'text-[#C5A869] font-bold'
                        : step > s.num
                        ? 'text-slate-300'
                        : 'text-slate-500'
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-mono ${
                        step === s.num
                          ? 'bg-[#C5A869] text-[#0F1E36]'
                          : step > s.num
                          ? 'bg-slate-700 text-white'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {s.num}
                    </span>
                    <span className="hidden sm:inline">{s.title}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step Body */}
            <div className="p-6 sm:p-8">
              {/* STEP 1: Uniform Type */}
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-[#0F1E36]">Step 1: Choose Uniform Type</h3>
                    <p className="text-xs text-slate-500">Select the school garment category you require.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      'School Shirt & Trouser Combo',
                      'Classic Oxford School Shirt',
                      'Formal Uniform Trousers',
                      'Girls Pinafore & Skirt Set',
                      'School Blazer (Coat)',
                      'School Shalwar Kameez',
                      'Sports Tracksuit & PE Kit',
                      'Winter Sweater & Cardigan',
                    ].map(type => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setUniformType(type)}
                        className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                          uniformType === type
                            ? 'border-[#0F1E36] bg-slate-50 font-bold text-[#0F1E36] shadow-xs'
                            : 'border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <div className="text-sm font-semibold">{type}</div>
                      </button>
                    ))}
                  </div>

                  <div className="pt-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Student Gender:
                    </label>
                    <div className="flex gap-3">
                      {(['Boys', 'Girls', 'Unisex'] as Gender[]).map(g => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => setGender(g)}
                          className={`px-4 py-2 rounded-lg text-xs font-semibold border cursor-pointer ${
                            gender === g
                              ? 'bg-[#0F1E36] text-white border-[#0F1E36]'
                              : 'bg-white text-slate-700 border-slate-200'
                          }`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="px-6 py-2.5 bg-[#0F1E36] hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer"
                    >
                      <span>Continue to Fabric & Colour</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Fabric & Colour */}
              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-[#0F1E36]">Step 2: Choose Fabric & Colour</h3>
                    <p className="text-xs text-slate-500">Pick from our lab-tested uniform fabric options.</p>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-xs font-semibold text-slate-700">Fabric Preference:</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        'Oxford Cotton 60/40 (Breathable, Crisp)',
                        'Tropical Poly-Viscose (All-Season Suiting)',
                        'Heavy Twill (Double Durability)',
                        'Combed Cotton Piqué (Summer Knit)',
                        'Terry Wool Blend (Winter Suiting)',
                        'Other / Match School Sample',
                      ].map(fab => (
                        <button
                          key={fab}
                          type="button"
                          onClick={() => setFabric(fab)}
                          className={`p-3.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                            fabric === fab
                              ? 'border-[#0F1E36] bg-slate-50 font-bold text-[#0F1E36]'
                              : 'border-slate-200 hover:border-slate-300 text-slate-700'
                          }`}
                        >
                          {fab}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <label className="block text-xs font-semibold text-slate-700">Uniform Colour Scheme:</label>
                    <input
                      type="text"
                      value={color}
                      onChange={e => setColor(e.target.value)}
                      placeholder="e.g. Navy Blue trousers with White shirt and blue piping"
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs text-slate-900"
                    />
                    <p className="text-[11px] text-slate-400">
                      You can specify multiple colors or exact school shade references.
                    </p>
                  </div>

                  <div className="flex justify-between pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="px-6 py-2.5 bg-[#0F1E36] hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer"
                    >
                      <span>Continue to Measurements</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Measurements */}
              {step === 3 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <h3 className="text-lg font-bold text-[#0F1E36]">Step 3: Sizing & Measurements</h3>
                      <p className="text-xs text-slate-500">Choose standard ready-made sizing or input bespoke measurements.</p>
                    </div>

                    <button
                      type="button"
                      onClick={onOpenSizeGuide}
                      className="text-xs font-semibold text-[#C5A869] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Ruler className="w-3.5 h-3.5" />
                      <span>Open Measurement Guide</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setSizePreference('standard')}
                      className={`p-4 rounded-xl border text-center transition-all cursor-pointer ${
                        sizePreference === 'standard'
                          ? 'border-[#0F1E36] bg-slate-50 font-bold text-[#0F1E36]'
                          : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      <div className="text-sm font-bold">Standard Size</div>
                      <div className="text-xs text-slate-500 mt-1">XS, S, M, L, XL, XXL</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSizePreference('custom')}
                      className={`p-4 rounded-xl border text-center transition-all cursor-pointer ${
                        sizePreference === 'custom'
                          ? 'border-[#0F1E36] bg-slate-50 font-bold text-[#0F1E36]'
                          : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      <div className="text-sm font-bold">Custom Measurements</div>
                      <div className="text-xs text-slate-500 mt-1">Bespoke Master Tailoring</div>
                    </button>
                  </div>

                  {sizePreference === 'standard' ? (
                    <div className="space-y-2">
                      <label className="block text-xs font-semibold text-slate-700">Choose Standard Size:</label>
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                        {['XS (Chest 30)', 'S (Chest 34)', 'M (Chest 38)', 'L (Chest 42)', 'XL (Chest 46)', 'XXL (Chest 50)'].map(sz => (
                          <button
                            key={sz}
                            type="button"
                            onClick={() => setStandardSize(sz)}
                            className={`p-2.5 rounded-lg border text-xs font-semibold cursor-pointer ${
                              standardSize === sz
                                ? 'bg-[#0F1E36] text-white border-[#0F1E36]'
                                : 'bg-white text-slate-700 border-slate-200'
                            }`}
                          >
                            {sz}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#0F1E36]">Bespoke Measurement Chart</span>
                        <div className="flex items-center gap-2 text-xs">
                          <button
                            type="button"
                            onClick={() => setMeasurements({ ...measurements, unit: 'inches' })}
                            className={`px-2.5 py-1 rounded text-xs cursor-pointer ${
                              measurements.unit === 'inches' ? 'bg-[#0F1E36] text-white font-bold' : 'text-slate-600'
                            }`}
                          >
                            Inches
                          </button>
                          <button
                            type="button"
                            onClick={() => setMeasurements({ ...measurements, unit: 'cm' })}
                            className={`px-2.5 py-1 rounded text-xs cursor-pointer ${
                              measurements.unit === 'cm' ? 'bg-[#0F1E36] text-white font-bold' : 'text-slate-600'
                            }`}
                          >
                            Centimeters
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                        <div>
                          <label className="block text-[11px] font-medium text-slate-700 mb-1">Chest</label>
                          <input
                            type="text"
                            placeholder="e.g. 32"
                            value={measurements.chest || ''}
                            onChange={e => setMeasurements({ ...measurements, chest: e.target.value })}
                            className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium text-slate-700 mb-1">Shoulder</label>
                          <input
                            type="text"
                            placeholder="e.g. 14.5"
                            value={measurements.shoulder || ''}
                            onChange={e => setMeasurements({ ...measurements, shoulder: e.target.value })}
                            className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium text-slate-700 mb-1">Shirt Length</label>
                          <input
                            type="text"
                            placeholder="e.g. 26"
                            value={measurements.shirtLength || ''}
                            onChange={e => setMeasurements({ ...measurements, shirtLength: e.target.value })}
                            className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium text-slate-700 mb-1">Sleeve Length</label>
                          <input
                            type="text"
                            placeholder="e.g. 21"
                            value={measurements.sleeveLength || ''}
                            onChange={e => setMeasurements({ ...measurements, sleeveLength: e.target.value })}
                            className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium text-slate-700 mb-1">Waist</label>
                          <input
                            type="text"
                            placeholder="e.g. 28"
                            value={measurements.waist || ''}
                            onChange={e => setMeasurements({ ...measurements, waist: e.target.value })}
                            className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium text-slate-700 mb-1">Trouser Length</label>
                          <input
                            type="text"
                            placeholder="e.g. 36"
                            value={measurements.trouserLength || ''}
                            onChange={e => setMeasurements({ ...measurements, trouserLength: e.target.value })}
                            className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium text-slate-700 mb-1">Hips</label>
                          <input
                            type="text"
                            placeholder="e.g. 33"
                            value={measurements.hip || ''}
                            onChange={e => setMeasurements({ ...measurements, hip: e.target.value })}
                            className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium text-slate-700 mb-1">Inseam / Collar</label>
                          <input
                            type="text"
                            placeholder="e.g. 26"
                            value={measurements.inseam || ''}
                            onChange={e => setMeasurements({ ...measurements, inseam: e.target.value })}
                            className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(4)}
                      className="px-6 py-2.5 bg-[#0F1E36] hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer"
                    >
                      <span>Continue to Stitching Preference</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: Stitched or Unstitched & Quantity */}
              {step === 4 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-[#0F1E36]">Step 4: Stitched or Unstitched</h3>
                    <p className="text-xs text-slate-500">Select whether you need complete master stitching or cut fabric.</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setIsStitched(true)}
                      className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                        isStitched
                          ? 'border-[#0F1E36] bg-slate-50 font-bold text-[#0F1E36]'
                          : 'border-slate-200 text-slate-700'
                      }`}
                    >
                      <div className="text-sm font-bold">Stitched Uniform</div>
                      <div className="text-xs text-slate-500 mt-1">Ready-to-wear tailored finish by our master tailors.</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsStitched(false)}
                      className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                        !isStitched
                          ? 'border-[#0F1E36] bg-slate-50 font-bold text-[#0F1E36]'
                          : 'border-slate-200 text-slate-700'
                      }`}
                    >
                      <div className="text-sm font-bold">Unstitched Fabric</div>
                      <div className="text-xs text-slate-500 mt-1">Measured pre-cut premium uniform fabric yardage.</div>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Quantity of Uniforms Required:
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="500"
                        value={quantity}
                        onChange={e => setQuantity(parseInt(e.target.value) || 1)}
                        className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Required Delivery Date:
                      </label>
                      <input
                        type="date"
                        value={requiredDate}
                        onChange={e => setRequiredDate(e.target.value)}
                        className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(5)}
                      className="px-6 py-2.5 bg-[#0F1E36] hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer"
                    >
                      <span>Continue to Reference Upload</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 5: Reference Design Upload */}
              {step === 5 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-[#0F1E36]">Step 5: Reference Design & School</h3>
                    <p className="text-xs text-slate-500">Upload your school logo, badge, collar pattern, or design photo.</p>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-slate-700">
                      School / Institution Name (optional):
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Army Public School, Beaconhouse, The City School, Roots, etc."
                      value={schoolName}
                      onChange={e => setSchoolName(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs text-slate-900"
                    />
                  </div>

                  {/* Image upload area */}
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-slate-700">
                      Upload Reference Design / Badge Photo (optional):
                    </label>
                    <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:bg-slate-50 transition-colors">
                      {referenceImage ? (
                        <div className="space-y-3">
                          <img
                            src={referenceImage}
                            alt="Uploaded reference"
                            className="max-h-36 mx-auto rounded-lg border border-slate-200 shadow-xs"
                          />
                          <button
                            type="button"
                            onClick={() => setReferenceImage('')}
                            className="text-xs text-rose-600 hover:underline font-semibold cursor-pointer"
                          >
                            Remove image
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Upload className="w-8 h-8 text-slate-400 mx-auto" />
                          <div className="text-xs text-slate-600">
                            <label className="text-[#0F1E36] font-bold cursor-pointer hover:underline">
                              Click to select an image file
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                              />
                            </label>
                          </div>
                          <p className="text-[11px] text-slate-400">PNG, JPG up to 10MB</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-slate-700">
                      Special Tailoring Instructions:
                    </label>
                    <textarea
                      rows={3}
                      placeholder="e.g. Extra 2 inches hem allowance inside trousers for growth; double pocket stitching; navy piping on collar..."
                      value={specialInstructions}
                      onChange={e => setSpecialInstructions(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs text-slate-900"
                    />
                  </div>

                  <div className="flex justify-between pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setStep(4)}
                      className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(6)}
                      className="px-6 py-2.5 bg-[#0F1E36] hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer"
                    >
                      <span>Continue to Final Details</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 6: Submit Order / Request Quote */}
              {step === 6 && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-[#0F1E36]">Step 6: Submit Request & Quote</h3>
                    <p className="text-xs text-slate-500">Enter your contact details. You will receive an instant Reference ID.</p>
                  </div>

                  {/* Summary card */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs">
                    <div className="font-bold text-[#0F1E36] pb-1 border-b border-slate-200">
                      Order Summary Review:
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Uniform:</span>
                      <span className="font-semibold">{uniformType} ({gender})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Fabric:</span>
                      <span className="font-semibold">{fabric}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Sizing:</span>
                      <span className="font-semibold">
                        {sizePreference === 'custom' ? 'Custom Measurements Entered' : standardSize}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Quantity & Type:</span>
                      <span className="font-semibold">{quantity} units ({isStitched ? 'Stitched' : 'Unstitched'})</span>
                    </div>
                  </div>

                  {formError && (
                    <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>{formError}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Tariq Mehmood"
                        value={customerName}
                        onChange={e => setCustomerName(e.target.value)}
                        className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Mobile Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="03XXXXXXXXX"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        WhatsApp Number (for photo & sample approval)
                      </label>
                      <input
                        type="tel"
                        placeholder="03XXXXXXXXX"
                        value={whatsapp}
                        onChange={e => setWhatsapp(e.target.value)}
                        className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Email Address (optional)
                      </label>
                      <input
                        type="email"
                        placeholder="customer@email.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setStep(5)}
                      className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>
                    <button
                      type="submit"
                      className="px-7 py-3 bg-[#0F1E36] hover:bg-[#1E293B] text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-sm"
                    >
                      <FileText className="w-4 h-4 text-[#C5A869]" />
                      <span>Submit Custom Order / Request Quote</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
