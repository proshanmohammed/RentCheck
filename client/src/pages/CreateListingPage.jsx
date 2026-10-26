import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  DollarSign, 
  Image as ImageIcon, 
  FileCheck2, 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Loader2,
  Plus,
  Trash2,
  ShieldCheck,
  Info
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const PROPERTY_TYPES = [
  'Apartment',
  'Condominium',
  'Single-Family House',
  'Townhouse',
  'Studio',
  'Shared Room'
];

const STANDARD_AMENITIES = [
  'In-Unit Washer & Dryer',
  'Central AC & Heating',
  'Dishwasher',
  'Assigned Garage Parking',
  'Pet Friendly',
  'Fitness Center',
  'Swimming Pool',
  'Balcony or Private Patio',
  'High-Speed Fiber Ready',
  'Elevator Access',
  '24/7 Security / Concierge',
  'Storage Locker'
];

export default function CreateListingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);
  const [error, setError] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    propertyType: 'Apartment',
    address: '',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '',
    bedrooms: 1,
    bathrooms: 1.0,
    squareFeet: 750,
    baseRent: 2400,
    securityDeposit: 2400,
    description: '',
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80'
    ],
    verificationEvidence: [
      'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['In-Unit Washer & Dryer', 'Central AC & Heating', 'Assigned Garage Parking'],
    feeDetails: {
      water_trash: 120,
      electricity_gas: 80,
      high_speed_internet: 60,
      assigned_garage_parking: 150,
      hoa_maintenance: 0
    }
  });

  const [newImageUrl, setNewImageUrl] = useState('');
  const [newEvidenceUrl, setNewEvidenceUrl] = useState('');

  // Calculate live recurring fees total
  const calculatedRecurring = Object.values(formData.feeDetails).reduce(
    (sum, val) => sum + (Number(val) || 0),
    0
  );
  const totalMonthlyOccupancy = (Number(formData.baseRent) || 0) + calculatedRecurring;
  const moveInTotal = (Number(formData.baseRent) || 0) + (Number(formData.securityDeposit) || 0) + calculatedRecurring;

  const handleFeeChange = (feeKey, value) => {
    setFormData((prev) => ({
      ...prev,
      feeDetails: {
        ...prev.feeDetails,
        [feeKey]: Number(value) || 0
      }
    }));
  };

  const handleToggleAmenity = (amenity) => {
    setFormData((prev) => {
      const exists = prev.amenities.includes(amenity);
      return {
        ...prev,
        amenities: exists
          ? prev.amenities.filter((a) => a !== amenity)
          : [...prev.amenities, amenity]
      };
    });
  };

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, newImageUrl.trim()]
      }));
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleAddEvidence = () => {
    if (newEvidenceUrl.trim()) {
      setFormData((prev) => ({
        ...prev,
        verificationEvidence: [...prev.verificationEvidence, newEvidenceUrl.trim()]
      }));
      setNewEvidenceUrl('');
    }
  };

  const handleRemoveEvidence = (index) => {
    setFormData((prev) => ({
      ...prev,
      verificationEvidence: prev.verificationEvidence.filter((_, i) => i !== index)
    }));
  };

  // Validation per step
  const validateStep = (step) => {
    if (step === 1) {
      if (!formData.title || formData.title.length < 5) return 'Title must be at least 5 characters.';
      if (!formData.address || formData.address.length < 5) return 'Valid street address is required.';
      if (!formData.city || formData.city.length < 2) return 'City is required.';
    }
    if (step === 2) {
      if (!formData.baseRent || Number(formData.baseRent) <= 0) return 'Base rent must be greater than zero.';
      if (Number(formData.securityDeposit) < 0) return 'Security deposit cannot be negative.';
    }
    if (step === 3) {
      if (formData.images.length === 0) return 'At least one property image URL is required.';
    }
    if (step === 4) {
      if (!formData.description || formData.description.length < 20) return 'Description must be at least 20 characters.';
    }
    return null;
  };

  const handleNext = () => {
    const errorMsg = validateStep(currentStep);
    if (errorMsg) {
      setError(errorMsg);
      return;
    }
    setError(null);
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setError(null);
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errorMsg = validateStep(4);
    if (errorMsg) {
      setError(errorMsg);
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const payload = {
        title: formData.title,
        propertyType: formData.propertyType,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        squareFeet: Number(formData.squareFeet) || null,
        baseRent: Number(formData.baseRent),
        securityDeposit: Number(formData.securityDeposit),
        recurringFees: calculatedRecurring,
        feeDetails: formData.feeDetails,
        amenities: formData.amenities,
        description: formData.description,
        images: formData.images,
        verificationEvidence: formData.verificationEvidence,
        landlordId: user?.id || '11111111-1111-4111-a111-111111111111'
      };

      const response = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to publish listing.');
      }

      setSubmitResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // If successfully published / submitted
  if (submitResult) {
    const { listing, duplicateAnalysis, duplicateFlag } = submitResult;
    const isDuplicate = duplicateAnalysis?.isDuplicate;

    return (
      <div className="max-w-2xl mx-auto px-4 py-16 space-y-6">
        <div className={`p-8 rounded-3xl border-2 text-center space-y-4 ${
          isDuplicate ? 'bg-orange-50 border-orange-300' : 'bg-emerald-50 border-emerald-300'
        }`}>
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto ${
            isDuplicate ? 'bg-orange-100 text-orange-600' : 'bg-emerald-100 text-emerald-600'
          }`}>
            {isDuplicate ? <AlertTriangle size={36} /> : <CheckCircle2 size={36} />}
          </div>

          <h2 className="text-2xl font-extrabold text-slate-900">
            {isDuplicate ? 'Listing Submitted — Duplicate Alert Flagged' : 'Listing Published with Transparency!'}
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
            {isDuplicate
              ? 'Our Google Gemini AI deduplication scanner detected significant similarities to an existing listing. The property has been queued for compliance review without automatic fraudulent penalties.'
              : 'Your property has been standardized into our verified directory with transparent fee disclosures.'}
          </p>

          {/* AI Deduplication Scan Output Box */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 text-left text-xs space-y-2 max-w-lg mx-auto shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="font-bold text-slate-900 flex items-center gap-1.5 text-brand-700">
                <Sparkles size={14} />
                Gemini AI Deduplication Analysis
              </span>
              <span className={`px-2 py-0.5 rounded font-bold text-[11px] ${
                isDuplicate ? 'bg-orange-100 text-orange-800' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {isDuplicate ? 'Flagged Candidate' : 'Clean Verification'}
              </span>
            </div>
            <p className="text-slate-700 text-[11px] leading-relaxed">
              <strong>Assessment:</strong> {duplicateAnalysis?.reasoning}
            </p>
            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
              <span>Similarity Score: <strong>{Math.round((duplicateAnalysis?.similarityScore || 0) * 100)}%</strong></span>
              <span>Assigned Status: <strong className="capitalize">{listing.verification_status}</strong></span>
            </div>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => navigate(`/listings/${listing.id}`)}
              className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-brand-600 transition-colors shadow-sm"
            >
              View Live Listing
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
          Landlord Publishing Wizard
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Publish Standardized Rental Listing
        </h1>
        <p className="text-xs text-slate-500">
          Complete transparent fee itemization & deed verification unlocks trusted renter inquiries.
        </p>
      </div>

      {/* Wizard Step Progress Tracker */}
      <div className="grid grid-cols-4 gap-2.5 luxury-glass p-3.5 rounded-3xl border border-white/80 shadow-luxury backdrop-blur-xl">
        {[
          { num: 1, title: 'Property Info', icon: Building2 },
          { num: 2, title: 'Fees & Deposits', icon: DollarSign },
          { num: 3, title: 'Media & Proof', icon: ImageIcon },
          { num: 4, title: 'Review & Scan', icon: FileCheck2 }
        ].map(({ num, title, icon: Icon }) => (
          <div
            key={num}
            className={`p-3 rounded-2xl flex items-center gap-2.5 text-xs font-black transition-all duration-300 ${
              currentStep === num
                ? 'bg-gradient-to-r from-brand-600 to-emerald-600 text-white shadow-md shadow-brand-500/25 ring-2 ring-brand-400/40'
                : currentStep > num
                ? 'bg-brand-50 text-brand-900 border border-brand-200'
                : 'text-slate-400 bg-white/40'
            }`}
          >
            <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs font-black ${
              currentStep === num ? 'bg-white/20 text-white' : currentStep > num ? 'bg-brand-200 text-brand-900' : 'bg-slate-100 text-slate-500'
            }`}>
              {currentStep > num ? <Check size={14} /> : num}
            </div>
            <span className="hidden sm:inline truncate tracking-tight">{title}</span>
          </div>
        ))}
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
          <AlertTriangle size={16} className="shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Step Content Container */}
      <div className="luxury-glass rounded-3xl border border-white/80 p-7 sm:p-10 shadow-luxury space-y-7 backdrop-blur-xl">
        
        {/* STEP 1: Basic Property Info */}
        {currentStep === 1 && (
          <div className="space-y-5 animate-in fade-in duration-150">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Step 1: Property Location & Architecture
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Listing Title *
              </label>
              <input
                type="text"
                placeholder="e.g. Modern High-Rise 1BR Flat with Skyline Balcony"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full text-xs sm:text-sm rounded-xl border border-slate-300 p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Property Type *
                </label>
                <select
                  value={formData.propertyType}
                  onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                  className="w-full text-xs sm:text-sm rounded-xl border border-slate-300 p-2.5 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
                >
                  {PROPERTY_TYPES.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  City *
                </label>
                <input
                  type="text"
                  placeholder="e.g. San Francisco"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full text-xs sm:text-sm rounded-xl border border-slate-300 p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Street Address (Full) *
              </label>
              <input
                type="text"
                placeholder="e.g. 500 Howard Street, Apt 14A"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full text-xs sm:text-sm rounded-xl border border-slate-300 p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Bedrooms
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={formData.bedrooms}
                  onChange={(e) => setFormData({ ...formData, bedrooms: Number(e.target.value) })}
                  className="w-full text-xs sm:text-sm rounded-xl border border-slate-300 p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Bathrooms
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  step="0.5"
                  value={formData.bathrooms}
                  onChange={(e) => setFormData({ ...formData, bathrooms: Number(e.target.value) })}
                  className="w-full text-xs sm:text-sm rounded-xl border border-slate-300 p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Square Feet
                </label>
                <input
                  type="number"
                  min="100"
                  value={formData.squareFeet}
                  onChange={(e) => setFormData({ ...formData, squareFeet: Number(e.target.value) })}
                  className="w-full text-xs sm:text-sm rounded-xl border border-slate-300 p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Financials & Mandatory Fees Itemization */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Step 2: Base Rent, Recurring Fees & Security Deposit
              </h3>
              <span className="text-xs font-semibold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-full border border-brand-200">
                Zero Hidden Fees Schema
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Advertised Base Rent ($/month) *
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.baseRent}
                  onChange={(e) => setFormData({ ...formData, baseRent: Number(e.target.value) })}
                  className="w-full text-sm font-bold rounded-xl border border-slate-300 p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Refundable Security Deposit ($) *
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.securityDeposit}
                  onChange={(e) => setFormData({ ...formData, securityDeposit: Number(e.target.value) })}
                  className="w-full text-sm font-bold rounded-xl border border-slate-300 p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            {/* Mandatory Recurring Charges Itemization */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Mandatory Monthly Disclosed Utilities & Charges
              </h4>
              <p className="text-[11px] text-slate-500">
                Enter $0 if the fee is already covered inside the advertised base rent.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Water, Sewer & Trash ($/mo)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.feeDetails.water_trash ?? 0}
                    onChange={(e) => handleFeeChange('water_trash', e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Electricity & Heating Gas ($/mo)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.feeDetails.electricity_gas ?? 0}
                    onChange={(e) => handleFeeChange('electricity_gas', e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">High-Speed Fiber / Wifi ($/mo)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.feeDetails.high_speed_internet ?? 0}
                    onChange={(e) => handleFeeChange('high_speed_internet', e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Assigned Garage Parking ($/mo)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.feeDetails.assigned_garage_parking ?? 0}
                    onChange={(e) => handleFeeChange('assigned_garage_parking', e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Live Calculation Box */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-brand-50 to-emerald-50 border border-brand-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="font-extrabold text-slate-900 block text-sm">
                  Live Calculated Occupancy Total:
                </span>
                <span className="text-slate-600">
                  ${formData.baseRent} Base + ${calculatedRecurring} Recurring Disclosed
                </span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-extrabold text-brand-700">
                  ${totalMonthlyOccupancy} /mo
                </span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Media & Proof of Ownership */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Step 3: Property Photographs & Ownership Verification Proof
            </h3>

            {/* Images */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Property Photograph URLs *
              </label>
              
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://example.com/property-photo.jpg"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="flex-1 text-xs sm:text-sm rounded-xl border border-slate-300 p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                <button
                  type="button"
                  onClick={handleAddImage}
                  className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-brand-600 transition-colors"
                >
                  Add Photo
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {formData.images.map((img, i) => (
                  <div key={i} className="relative group rounded-xl overflow-hidden h-24 border border-slate-200">
                    <img src={img} alt="Property" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(i)}
                      className="absolute top-1 right-1 p-1 bg-slate-900/80 text-white rounded-md hover:bg-rose-600 transition-colors"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Ownership Evidence Document URLs */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Proof of Ownership / Management Documents
                  </label>
                  <p className="text-[11px] text-slate-500">
                    Upload URLs to municipal property deed, property tax statement, or certified management agreement.
                  </p>
                </div>
                <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Earn Verified Badge
                </span>
              </div>

              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://example.com/county-deed-or-management-agreement.pdf"
                  value={newEvidenceUrl}
                  onChange={(e) => setNewEvidenceUrl(e.target.value)}
                  className="flex-1 text-xs sm:text-sm rounded-xl border border-slate-300 p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                <button
                  type="button"
                  onClick={handleAddEvidence}
                  className="px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold hover:bg-emerald-800 transition-colors"
                >
                  Add Document
                </button>
              </div>

              <div className="space-y-1.5 pt-1">
                {formData.verificationEvidence.map((doc, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700">
                    <span className="truncate max-w-sm">{doc}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveEvidence(i)}
                      className="text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Amenities checklist */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Select Amenities & Features
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {STANDARD_AMENITIES.map((amenity) => {
                  const selected = formData.amenities.includes(amenity);
                  return (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() => handleToggleAmenity(amenity)}
                      className={`p-2.5 rounded-xl text-xs font-semibold text-left border transition-all flex items-center justify-between ${
                        selected
                          ? 'bg-brand-50 border-brand-500 text-brand-900 shadow-2xs'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span className="truncate">{amenity}</span>
                      {selected && <Check size={14} className="text-brand-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Description, AI Scan Preview & Submission */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Step 4: Description & Automated Duplicate Check
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Comprehensive Property Description *
              </label>
              <textarea
                rows={4}
                placeholder="Describe layout, interior finishes, sunlight, neighborhood proximity, and lease terms..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full text-xs sm:text-sm rounded-xl border border-slate-300 p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            {/* AI Deduplication Pre-Scan Notice */}
            <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2">
              <div className="flex items-center gap-2 text-brand-400 font-bold text-xs uppercase tracking-wider">
                <Sparkles size={16} />
                <span>RentCheck Core Intelligence Automated Scan</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Upon clicking "Submit & Run Verification Scan", our Google Gemini deduplication engine will immediately compare your address, description n-grams, and photographs against active directory listings.
              </p>
              <p className="text-[11px] text-slate-400">
                If syndication overlap is identified, your listing enters the compliance queue for moderator evidence check rather than being unfairly blacklisted.
              </p>
            </div>

            {/* Summary preview table */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <h5 className="font-bold text-slate-900">Summary Submission Matrix:</h5>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-600">
                <div>
                  <span className="block text-slate-400">Title:</span>
                  <strong className="text-slate-800 truncate block">{formData.title}</strong>
                </div>
                <div>
                  <span className="block text-slate-400">Address:</span>
                  <strong className="text-slate-800 truncate block">{formData.address}, {formData.city}</strong>
                </div>
                <div>
                  <span className="block text-slate-400">Base Rent:</span>
                  <strong className="text-slate-800">${formData.baseRent}/mo</strong>
                </div>
                <div>
                  <span className="block text-slate-400">True Monthly:</span>
                  <strong className="text-brand-700">${totalMonthlyOccupancy}/mo</strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Wizard Navigation Action Controls */}
        <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <ChevronLeft size={16} />
              <span>Previous Step</span>
            </button>
          ) : (
            <div></div>
          )}

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <span>Next Step</span>
              <ChevronRight size={16} />
            </button>
          ) : (
            <button
              type="button"
              disabled={submitting}
              onClick={handleSubmit}
              className="px-7 py-3 rounded-xl bg-slate-900 hover:bg-brand-600 text-white text-xs font-extrabold flex items-center gap-2 transition-all shadow-md disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Scanning Gemini AI Deduplication...</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} className="text-brand-400" />
                  <span>Submit & Run Verification Scan</span>
                </>
              )}
            </button>
          )}
        </div>

      </div>

    </div>
  );
}
