import React, { useState } from 'react';
import { Building2, CheckCircle2, MessageCircle, Upload, Shield, Users, Truck, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface SubmittedApplicationInfo {
  applicationId: string;
  submissionDate: string;
  schoolOrBusinessName: string;
  contactPerson: string;
  city: string;
  estimatedQuantity: number;
  requiredDeliveryDate: string;
  referenceFileUrl?: string;
  googleSheetsSynced?: boolean;
}

export const SchoolWholesale: React.FC = () => {
  const { language, getWhatsAppLink } = useStore();

  const [submittedApplication, setSubmittedApplication] = useState<SubmittedApplicationInfo | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  // Form State
  const [schoolOrBusinessName, setSchoolOrBusinessName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('Rawalpindi');
  const [uniformType, setUniformType] = useState('Complete School Uniform (Shirts, Trousers & Blazers)');
  const [estimatedQuantity, setEstimatedQuantity] = useState<number | string>(250);
  const [boysCount, setBoysCount] = useState<number | string>(150);
  const [girlsCount, setGirlsCount] = useState<number | string>(100);
  const [sizeBreakdown, setSizeBreakdown] = useState('Pre-School to Class 10 (Breakdown by grade)');
  const [fabricPreference, setFabricPreference] = useState('High-count Oxford Cotton & Poly-Viscose Suiting');
  const [color, setColor] = useState('Navy Blue trousers/skirts, Off-white shirts');
  const [designDetails, setDesignDetails] = useState('');
  const [requiredDeliveryDate, setRequiredDeliveryDate] = useState('2026-11-15');
  const [referenceFile, setReferenceFile] = useState<{ name: string; mimeType: string; base64: string } | null>(null);
  const [referenceFileName, setReferenceFileName] = useState('');

  const clearForm = () => {
    setSchoolOrBusinessName('');
    setContactPerson('');
    setPhone('');
    setWhatsapp('');
    setEmail('');
    setCity('Rawalpindi');
    setUniformType('Complete School Uniform (Shirts, Trousers & Blazers)');
    setEstimatedQuantity(250);
    setBoysCount(150);
    setGirlsCount(100);
    setSizeBreakdown('Pre-School to Class 10 (Breakdown by grade)');
    setFabricPreference('High-count Oxford Cotton & Poly-Viscose Suiting');
    setColor('Navy Blue trousers/skirts, Off-white shirts');
    setDesignDetails('');
    setRequiredDeliveryDate('2026-11-15');
    setReferenceFile(null);
    setReferenceFileName('');
    setFieldErrors({});
    setSubmitError(null);
    setFileError(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 15 * 1024 * 1024) {
        setFileError('File size exceeds 15MB limit. Please upload a smaller image or document.');
        return;
      }
      setFileError(null);
      setReferenceFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        const resultStr = reader.result as string;
        setReferenceFile({
          name: file.name,
          mimeType: file.type || 'application/octet-stream',
          base64: resultStr,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {};

    if (!schoolOrBusinessName.trim()) {
      errors.schoolOrBusinessName = 'Please enter your school/business name.';
    }

    if (!contactPerson.trim()) {
      errors.contactPerson = 'Please enter contact person name and designation.';
    }

    if (!city.trim()) {
      errors.city = 'Please select your city or campus location.';
    }

    const cleanPhone = phone.replace(/\D/g, '');
    if (!phone.trim() || cleanPhone.length < 10) {
      errors.phone = 'Please enter a valid phone number.';
    }

    if (!uniformType.trim()) {
      errors.uniformType = 'Please enter the uniform type or items needed.';
    }

    const parsedQty = parseInt(String(estimatedQuantity), 10);
    if (!estimatedQuantity || isNaN(parsedQty) || parsedQty <= 0) {
      errors.estimatedQuantity = 'Please enter the estimated quantity.';
    }

    if (!requiredDeliveryDate.trim()) {
      errors.requiredDeliveryDate = 'Please select a delivery deadline.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setSubmitError(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        schoolOrBusinessName: schoolOrBusinessName.trim(),
        contactPerson: contactPerson.trim(),
        city: city.trim(),
        phone: phone.trim(),
        whatsapp: whatsapp.trim() || phone.trim(),
        email: email.trim(),
        uniformType: uniformType.trim(),
        estimatedQuantity: parseInt(String(estimatedQuantity), 10),
        boysCount: parseInt(String(boysCount), 10) || 0,
        girlsCount: parseInt(String(girlsCount), 10) || 0,
        requiredDeliveryDate: requiredDeliveryDate.trim(),
        deliveryDeadline: requiredDeliveryDate.trim(),
        fabricPreference: fabricPreference.trim(),
        color: color.trim(),
        colourPalette: color.trim(),
        sizeBreakdown: sizeBreakdown.trim(),
        designDetails: designDetails.trim(),
        embroideryDetails: designDetails.trim(),
        referenceFile: referenceFile,
      };

      const response = await fetch('/api/institutional-applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "We couldn't submit your application right now. Please try again or contact us on WhatsApp.");
      }

      setSubmittedApplication({
        applicationId: data.applicationId,
        submissionDate: data.submissionDate || new Date().toISOString().replace('T', ' ').slice(0, 19),
        schoolOrBusinessName: payload.schoolOrBusinessName,
        contactPerson: payload.contactPerson,
        city: payload.city,
        estimatedQuantity: payload.estimatedQuantity,
        requiredDeliveryDate: payload.requiredDeliveryDate,
        referenceFileUrl: data.referenceFileUrl,
        googleSheetsSynced: data.googleSheetsSynced,
      });

      clearForm();
    } catch (err: any) {
      console.error('Submission failed:', err);
      setSubmitError("We couldn't submit your application right now. Please try again or contact us on WhatsApp.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getWholesaleWaText = (app: SubmittedApplicationInfo) => {
    return `Salam Zain Uniforms! I have submitted an Institutional Supply Application.\n\n` +
      `Application Reference: ${app.applicationId}\n` +
      `School / Business: ${app.schoolOrBusinessName}\n` +
      `Contact Person: ${app.contactPerson}\n` +
      `City: ${app.city}\n` +
      `Total Estimated Quantity: ${app.estimatedQuantity} sets\n` +
      `Delivery Deadline: ${app.requiredDeliveryDate}\n\n` +
      `Please review our application and confirm our institutional proposal.`;
  };

  return (
    <div className="py-12 sm:py-20 bg-[#F8FAFC] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Editorial Minimalistic Hero Header */}
        <div className="bg-[#0F1E36] rounded-2xl text-white p-8 sm:p-12 border border-[#1E293B] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#C5A869] tracking-wider uppercase bg-white/10 px-3.5 py-1.5 rounded-full backdrop-blur-xs">
              <Building2 className="w-4 h-4" />
              <span>B2B Institutional Supply & Wholesale Manufacturing</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
              {language === 'ur'
                ? 'اسکولز اور ہول سیل بلک آرڈرز'
                : 'Uniforms at Scale. Direct Factory Supply.'}
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Partner with Pakistan's trusted uniform manufacturer. From prestige private campuses to extensive school chains, we deliver custom-stitched uniforms with guaranteed reopening deadlines.
            </p>
          </div>
          <div className="shrink-0 flex flex-col sm:flex-row md:flex-col gap-3">
            <div className="px-5 py-3 bg-[#1E293B] border border-slate-700 rounded-xl text-xs font-semibold text-slate-200 flex items-center gap-2.5 shadow-xs">
              <Shield className="w-4 h-4 text-[#C5A869]" />
              <span>Custom Crests & Monograms</span>
            </div>
            <div className="px-5 py-3 bg-[#1E293B] border border-slate-700 rounded-xl text-xs font-semibold text-slate-200 flex items-center gap-2.5 shadow-xs">
              <Truck className="w-4 h-4 text-[#C5A869]" />
              <span>Carton Bulk Dispatch</span>
            </div>
          </div>
        </div>

        {/* Form or Confirmation */}
        {submittedApplication ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-10 sm:p-16 text-center shadow-sm space-y-6 max-w-3xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0F1E36]">
                Application Submitted Successfully
              </h2>
              <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
                Thank you for contacting Zain Uniforms. Your institutional supply application has been successfully logged into our Google Sheet.
              </p>
              <div className="pt-2">
                <span className="inline-block px-5 py-2 bg-slate-100 text-[#0F1E36] border border-slate-200 rounded-xl text-sm font-bold font-mono">
                  Application Reference: {submittedApplication.applicationId}
                </span>
              </div>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-left text-xs sm:text-sm space-y-3 max-w-xl mx-auto">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">School / Business:</span>
                <span className="font-semibold text-slate-900">{submittedApplication.schoolOrBusinessName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Contact Person:</span>
                <span className="font-semibold text-slate-900">{submittedApplication.contactPerson}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">City / Region:</span>
                <span className="font-semibold text-slate-900">{submittedApplication.city}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Total Estimated Units:</span>
                <span className="font-semibold text-slate-900 font-mono">{submittedApplication.estimatedQuantity} sets</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Delivery Deadline:</span>
                <span className="font-semibold text-slate-900">{submittedApplication.requiredDeliveryDate}</span>
              </div>
              {submittedApplication.referenceFileUrl && (
                <div className="flex justify-between items-center pt-1">
                  <span className="text-slate-500">Uploaded Specification:</span>
                  <a
                    href={submittedApplication.referenceFileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline font-semibold"
                  >
                    View File
                  </a>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <a
                href={getWhatsAppLink(getWholesaleWaText(submittedApplication))}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Discuss on WhatsApp ({submittedApplication.applicationId})</span>
              </a>

              <button
                onClick={() => setSubmittedApplication(null)}
                className="w-full sm:w-auto px-8 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
              >
                Submit Another Application
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 sm:p-12 space-y-8">
            <div className="border-b border-slate-200 pb-6">
              <h2 className="text-2xl font-bold text-[#0F1E36]">
                Institutional Supply Application Form
              </h2>
              <p className="text-sm text-slate-600 mt-1.5">
                Complete your institution's specifications below. All submissions sync directly to our production scheduling system and Google Sheets backend.
              </p>
            </div>

            {/* Error Notification Banner */}
            {submitError && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs sm:text-sm text-rose-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  <span>{submitError}</span>
                </div>
                <a
                  href={getWhatsAppLink('Salam Zain Uniforms! I was trying to submit the Institutional Supply form and encountered an issue. Please assist.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shrink-0"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Contact on WhatsApp</span>
                </a>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8 text-xs sm:text-sm">
              {/* Card Section 1: Institution & Contact Information */}
              <div className="p-6 sm:p-8 bg-slate-50/70 rounded-2xl border border-slate-200 space-y-6">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-[#0F1E36] text-[#C5A869] text-xs font-bold flex items-center justify-center font-mono">
                    01
                  </span>
                  <div>
                    <h3 className="font-bold text-[#0F1E36] text-base">Institution & Contact Details</h3>
                    <p className="text-xs text-slate-500">Provide your school or corporate name and official contact channels.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      School / Business Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Bloomfield Hall School"
                      value={schoolOrBusinessName}
                      onChange={e => {
                        setSchoolOrBusinessName(e.target.value);
                        if (fieldErrors.schoolOrBusinessName) {
                          setFieldErrors(prev => ({ ...prev, schoolOrBusinessName: '' }));
                        }
                      }}
                      className={`w-full px-4 py-3 border rounded-xl text-xs sm:text-sm text-slate-900 bg-white ${
                        fieldErrors.schoolOrBusinessName ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                      }`}
                    />
                    {fieldErrors.schoolOrBusinessName && (
                      <p className="text-[11px] text-rose-600 mt-1">{fieldErrors.schoolOrBusinessName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Contact Person & Designation *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Asim Raza (Procurement Head)"
                      value={contactPerson}
                      onChange={e => {
                        setContactPerson(e.target.value);
                        if (fieldErrors.contactPerson) {
                          setFieldErrors(prev => ({ ...prev, contactPerson: '' }));
                        }
                      }}
                      className={`w-full px-4 py-3 border rounded-xl text-xs sm:text-sm text-slate-900 bg-white ${
                        fieldErrors.contactPerson ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                      }`}
                    />
                    {fieldErrors.contactPerson && (
                      <p className="text-[11px] text-rose-600 mt-1">{fieldErrors.contactPerson}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      City / Campus Location *
                    </label>
                    <select
                      value={city}
                      onChange={e => {
                        setCity(e.target.value);
                        if (fieldErrors.city) {
                          setFieldErrors(prev => ({ ...prev, city: '' }));
                        }
                      }}
                      className={`w-full px-4 py-3 border rounded-xl text-xs sm:text-sm text-slate-900 bg-white ${
                        fieldErrors.city ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                      }`}
                    >
                      {['Islamabad', 'Rawalpindi', 'Lahore', 'Karachi', 'Faisalabad', 'Peshawar', 'Multan', 'Sialkot', 'Gujranwala', 'Quetta', 'Other'].map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    {fieldErrors.city && (
                      <p className="text-[11px] text-rose-600 mt-1">{fieldErrors.city}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Official Mobile / Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="03XXXXXXXXX"
                      value={phone}
                      onChange={e => {
                        setPhone(e.target.value);
                        if (fieldErrors.phone) {
                          setFieldErrors(prev => ({ ...prev, phone: '' }));
                        }
                      }}
                      className={`w-full px-4 py-3 border rounded-xl text-xs sm:text-sm text-slate-900 bg-white ${
                        fieldErrors.phone ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                      }`}
                    />
                    {fieldErrors.phone && (
                      <p className="text-[11px] text-rose-600 mt-1">{fieldErrors.phone}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      placeholder="03XXXXXXXXX"
                      value={whatsapp}
                      onChange={e => setWhatsapp(e.target.value)}
                      className="w-full px-4 py-3 border rounded-xl text-xs sm:text-sm text-slate-900 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Official Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="procurement@school.edu.pk"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full px-4 py-3 border rounded-xl text-xs sm:text-sm text-slate-900 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Card Section 2: Garment Specifications & Quantities */}
              <div className="p-6 sm:p-8 bg-slate-50/70 rounded-2xl border border-slate-200 space-y-6">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-[#0F1E36] text-[#C5A869] text-xs font-bold flex items-center justify-center font-mono">
                    02
                  </span>
                  <div>
                    <h3 className="font-bold text-[#0F1E36] text-base">Garment Specifications & Quantities</h3>
                    <p className="text-xs text-slate-500">Specify garment types, estimated quantities, and required delivery deadlines.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Uniform Type / Items Needed *
                    </label>
                    <input
                      type="text"
                      required
                      value={uniformType}
                      onChange={e => {
                        setUniformType(e.target.value);
                        if (fieldErrors.uniformType) {
                          setFieldErrors(prev => ({ ...prev, uniformType: '' }));
                        }
                      }}
                      placeholder="e.g. Shirts, Trousers, Pinafores, Blazers, Sports Kits"
                      className={`w-full px-4 py-3 border rounded-xl text-xs sm:text-sm text-slate-900 bg-white ${
                        fieldErrors.uniformType ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                      }`}
                    />
                    {fieldErrors.uniformType && (
                      <p className="text-[11px] text-rose-600 mt-1">{fieldErrors.uniformType}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Total Estimated Quantity (Pieces/Sets) *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={estimatedQuantity}
                      onChange={e => {
                        setEstimatedQuantity(e.target.value);
                        if (fieldErrors.estimatedQuantity) {
                          setFieldErrors(prev => ({ ...prev, estimatedQuantity: '' }));
                        }
                      }}
                      className={`w-full px-4 py-3 border rounded-xl text-xs sm:text-sm text-slate-900 font-mono font-bold bg-white ${
                        fieldErrors.estimatedQuantity ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                      }`}
                    />
                    {fieldErrors.estimatedQuantity && (
                      <p className="text-[11px] text-rose-600 mt-1">{fieldErrors.estimatedQuantity}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Boys Uniforms (Est.)
                    </label>
                    <input
                      type="number"
                      value={boysCount}
                      onChange={e => setBoysCount(e.target.value)}
                      className="w-full px-4 py-3 border rounded-xl text-xs sm:text-sm bg-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Girls Uniforms (Est.)
                    </label>
                    <input
                      type="number"
                      value={girlsCount}
                      onChange={e => setGirlsCount(e.target.value)}
                      className="w-full px-4 py-3 border rounded-xl text-xs sm:text-sm bg-white font-mono"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Delivery Deadline *
                    </label>
                    <input
                      type="date"
                      required
                      value={requiredDeliveryDate}
                      onChange={e => {
                        setRequiredDeliveryDate(e.target.value);
                        if (fieldErrors.requiredDeliveryDate) {
                          setFieldErrors(prev => ({ ...prev, requiredDeliveryDate: '' }));
                        }
                      }}
                      className={`w-full px-4 py-3 border rounded-xl text-xs sm:text-sm bg-white ${
                        fieldErrors.requiredDeliveryDate ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                      }`}
                    />
                    {fieldErrors.requiredDeliveryDate && (
                      <p className="text-[11px] text-rose-600 mt-1">{fieldErrors.requiredDeliveryDate}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Fabric Preference
                    </label>
                    <input
                      type="text"
                      value={fabricPreference}
                      onChange={e => setFabricPreference(e.target.value)}
                      placeholder="e.g. 60/40 Oxford, Twill Suiting, Combed Cotton"
                      className="w-full px-4 py-3 border rounded-xl text-xs sm:text-sm bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Colour Palette
                    </label>
                    <input
                      type="text"
                      value={color}
                      onChange={e => setColor(e.target.value)}
                      placeholder="e.g. Navy, Grey, Bottle Green, White"
                      className="w-full px-4 py-3 border rounded-xl text-xs sm:text-sm bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Grade / Size Breakdown Notes
                  </label>
                  <input
                    type="text"
                    value={sizeBreakdown}
                    onChange={e => setSizeBreakdown(e.target.value)}
                    placeholder="e.g. Grade 1-5: 200 pcs, Grade 6-10: 300 pcs"
                    className="w-full px-4 py-3 border rounded-xl text-xs sm:text-sm bg-white"
                  />
                </div>
              </div>

              {/* Card Section 3: Embroidery & Reference Specification */}
              <div className="p-6 sm:p-8 bg-slate-50/70 rounded-2xl border border-slate-200 space-y-6">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-[#0F1E36] text-[#C5A869] text-xs font-bold flex items-center justify-center font-mono">
                    03
                  </span>
                  <div>
                    <h3 className="font-bold text-[#0F1E36] text-base">Embroidery & Reference Specification</h3>
                    <p className="text-xs text-slate-500">Upload school monograms, crest designs, or specification sheets.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      School Crest / Monogram Embroidery Details
                    </label>
                    <textarea
                      rows={4}
                      value={designDetails}
                      onChange={e => setDesignDetails(e.target.value)}
                      placeholder="Specify whether you need direct embroidery on pocket, brass crest buttons, or woven ties..."
                      className="w-full px-4 py-3 border rounded-xl text-xs sm:text-sm text-slate-900 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Upload School Monogram / Reference Spec
                    </label>
                    <div className="border border-dashed border-slate-300 rounded-2xl p-6 text-center bg-white hover:bg-slate-50 transition-colors h-[120px] flex flex-col justify-center">
                      {referenceFile ? (
                        <div className="flex items-center justify-between text-xs sm:text-sm text-emerald-700 font-semibold px-2">
                          <span className="truncate max-w-[240px]">{referenceFileName}</span>
                          <button
                            type="button"
                            onClick={() => {
                              setReferenceFile(null);
                              setReferenceFileName('');
                            }}
                            className="text-rose-600 hover:underline cursor-pointer"
                          >
                            Clear
                          </button>
                        </div>
                      ) : (
                        <div>
                          <Upload className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                          <label className="text-xs text-[#0F1E36] font-semibold cursor-pointer hover:underline">
                            Select file (PDF, PNG, JPG, max 15MB)
                            <input
                              type="file"
                              accept=".pdf,image/png,image/jpeg,image/webp"
                              onChange={handleImageUpload}
                              className="hidden"
                            />
                          </label>
                        </div>
                      )}
                    </div>
                    {fileError && (
                      <p className="text-xs text-rose-600 mt-1.5 font-medium">{fileError}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <p className="text-xs text-slate-500">
                  A dedicated B2B institutional account representative will contact you within 24 hours.
                </p>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-10 py-4 rounded-xl text-xs sm:text-sm font-bold transition-colors flex items-center justify-center gap-2 shadow-sm ${
                    isSubmitting
                      ? 'bg-slate-400 text-white cursor-not-allowed'
                      : 'bg-[#0F1E36] hover:bg-[#1E293B] text-white cursor-pointer'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#C5A869]" />
                      <span>Submitting Application...</span>
                    </>
                  ) : (
                    <span>Submit Institutional Application</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
